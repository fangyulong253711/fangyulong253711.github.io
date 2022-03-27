---
icon: edit
date: 2022-01-03
category:
  - 源码解读
tag:
  - k8s
  - informer
  - 环境
  - go
  - cncf
---
# K8s-informer-reflector源码

## 作用说明

Reflector 用于监控（Watch）指定的 Kubernetes 资源，当监控的资源发生变化时，触发相应的变更事件，例如 Add 事件、Update 事件、Delete 事件，并将其资源对象存放到本地缓存 DeltaFIFO 中。

## 结构说明

### Reflector

```go
// k8s.io/client-go/tools/cache/reflector.go
// Reflector(反射器) 监听指定的资源，将所有的变化都反射到给定的存储中去(store 对象)
type Reflector struct {
	// 反射器名称
	name string
  // 期望放到 Store 中的类型名称，如果提供，则是 expectedGVK 的字符串形式
  // 否则就是 expectedType 的字符串，它仅仅用于显示，不用于解析或者比较。
	expectedTypeName string
	// 我们放到 Store 中的对象类型
	expectedType reflect.Type
	// 如果是非结构化的，我们期望放在 Sotre 中的对象的 GVK
	expectedGVK *schema.GroupVersionKind
	// 与 watch 源同步的目标 Store（FIFO）
	store Store
	// 用来执行 lists 和 watches 操作的 listerWatcher 接口（最重要的）
	listerWatcher ListerWatcher
	backoffManager wait.BackoffManager
	initConnBackoffManager wait.BackoffManager
	resyncPeriod time.Duration
	// ShouldResync 会周期性的被调用，当返回 true 的时候，就会调用 Store 的 Resync 操作
	ShouldResync func() bool
	clock clock.Clock
	paginatedResult bool
	// 对象的任何修改(添加、删除、更新)都会造成资源版本更新，lastSyncResourceVersion 就是指的这个版本的版本号
	lastSyncResourceVersion string
	// 如果之前的 list 或 watch 带有 lastSyncResourceVersion 的请求中是一个 HTTP 410（Gone）的失败请求，则 isLastSyncResourceVersionGone 为 true
	isLastSyncResourceVersionUnavailable bool
	lastSyncResourceVersionMutex sync.RWMutex
	WatchListPageSize int64
	watchErrorHandler WatchErrorHandler
}

```

### ListerWatcher

必须传入一个 ListerWatcher 接口对象，这个也是反射器最核心的功能，该接口拥有 List 和 Watch 方法，用于获取和监控资源对象。

```go
// k8s.io/client-go/tools/cache/listwatch.go
// Lister 是知道如何执行初始化List列表的对象
type Lister interface {
	// List 应该返回一个列表类型的对象；
  // Items 字段将被解析，ResourceVersion 字段将被用于正确启动 watch 的地方
	List(options metav1.ListOptions) (runtime.Object, error)
}

// Watcher 是知道如何执行 watch 操作的任何对象
type Watcher interface {
	// Watch 在指定的版本开始执行 watch 操作
	Watch(options metav1.ListOptions) (watch.Interface, error)
}

// ListerWatcher 是任何知道如何对一个资源执行初始化List列表和启动Watch监控操作的对象
type ListerWatcher interface {
	Lister
	Watcher
}



// k8s.io/client-go/informers/apps/v1/deployment.go
// Deployment的ListWatch 功能
func NewFilteredDeploymentInformer(client kubernetes.Interface, namespace string, resyncPeriod time.Duration, indexers cache.Indexers, tweakListOptions internalinterfaces.TweakListOptionsFunc) cache.SharedIndexInformer {
	return cache.NewSharedIndexInformer(
		&cache.ListWatch{
			ListFunc: func(options metav1.ListOptions) (runtime.Object, error) {
				if tweakListOptions != nil {
					tweakListOptions(&options)
				}
				return client.AppsV1().Deployments(namespace).List(context.TODO(), options)
			},
			WatchFunc: func(options metav1.ListOptions) (watch.Interface, error) {
				if tweakListOptions != nil {
					tweakListOptions(&options)
				}
				return client.AppsV1().Deployments(namespace).Watch(context.TODO(), options)
			},
		},
		&appsv1.Deployment{},
		resyncPeriod,
		indexers,
	)
}
```

## 执行流程

开完关键核心代码之后 我们再来看看Reflector的启动过程

### run

核心是执行 ListAndWatch 方法

```go
// k8s.io/client-go/tools/cache/reflector.go

// Run 函数反复使用反射器的 ListAndWatch 函数来获取所有对象和后续的 deltas。
// 当 stopCh 被关闭的时候，Run函数才会退出。
func (r *Reflector) Run(stopCh <-chan struct{}) {
	klog.V(2).Infof("Starting reflector %s (%s) from %s", r.expectedTypeName, r.resyncPeriod, r.name)
	wait.BackoffUntil(func() {
		if err := r.ListAndWatch(stopCh); err != nil {
			utilruntime.HandleError(err)
		}
	}, r.backoffManager, true, stopCh)
	klog.V(2).Infof("Stopping reflector %s (%s) from %s", r.expectedTypeName, r.resyncPeriod, r.name)
}
```

### ListAndWatch

```go
// k8s.io/client-go/tools/cache/reflector.go

//ListAndWatch首先列出所有项，并在调用时获取资源版本，然后使用资源版本进行监视。如果ListAndWatch没有尝试初始化watch，它会返回错误。
func (r *Reflector) ListAndWatch(stopCh <-chan struct{}) error {
	klog.V(3).Infof("Listing and watching %v from %s", r.expectedTypeName, r.name)
	var resourceVersion string

	options := metav1.ListOptions{ResourceVersion: r.relistResourceVersion()}

	if err := func() error {
		initTrace := trace.New("Reflector ListAndWatch", trace.Field{Key: "name", Value: r.name})
		defer initTrace.LogIfLong(10 * time.Second)
		var list runtime.Object
		var paginatedResult bool
		var err error
		listCh := make(chan struct{}, 1)
		panicCh := make(chan interface{}, 1)
    
    
    // 执行list操作
		go func() {
			defer func() {
				if r := recover(); r != nil {
					panicCh <- r
				}
			}()
			// 调用list接口 执行list的分页查询
			pager := pager.New(pager.SimplePageFunc(func(opts metav1.ListOptions) (runtime.Object, error) {
				return r.listerWatcher.List(opts)
			}))
			switch {
			case r.WatchListPageSize != 0:
				pager.PageSize = r.WatchListPageSize
			case r.paginatedResult:
				//  // 获得一个初始的分页结果。假定此资源和服务器符合分页请求，并保留默认的分页器大小设置
			case options.ResourceVersion != "" && options.ResourceVersion != "0":
				pager.PageSize = 0
			}

			list, paginatedResult, err = pager.List(context.Background(), options)
			if isExpiredError(err) || isTooLargeResourceVersionError(err) {
				r.setIsLastSyncResourceVersionUnavailable(true)
				list, paginatedResult, err = pager.List(context.Background(), metav1.ListOptions{ResourceVersion: r.relistResourceVersion()})
			}
			close(listCh)
		}()
		select {
		case <-stopCh:
			return nil
		case r := <-panicCh:
			panic(r)
		case <-listCh:
		}
		initTrace.Step("Objects listed", trace.Field{Key: "error", Value: err})
		if err != nil {
			klog.Warningf("%s: failed to list %v: %v", r.name, r.expectedTypeName, err)
			return fmt.Errorf("failed to list %v: %v", r.expectedTypeName, err)
		}
		if options.ResourceVersion == "0" && paginatedResult {
			r.paginatedResult = true
		}

		r.setIsLastSyncResourceVersionUnavailable(false) // list 成功
		listMetaInterface, err := meta.ListAccessor(list)
		if err != nil {
			return fmt.Errorf("unable to understand list result %#v: %v", list, err)
		}
		resourceVersion = listMetaInterface.GetResourceVersion()
		initTrace.Step("Resource version extracted")
		items, err := meta.ExtractList(list)
		if err != nil {
			return fmt.Errorf("unable to understand list result %#v (%v)", list, err)
		}
		initTrace.Step("Objects extracted")
    // 这一步会把list出来的数据  Replace 到store中
		if err := r.syncWith(items, resourceVersion); err != nil {
			return fmt.Errorf("unable to sync list result: %v", err)
		}
		initTrace.Step("SyncWith done")
		r.setLastSyncResourceVersion(resourceVersion)
		initTrace.Step("Resource version updated")
		return nil
	}(); err != nil {
		return err
	}

	resyncerrc := make(chan error, 1)
	cancelCh := make(chan struct{})
	defer close(cancelCh)
	go func() {
		resyncCh, cleanup := r.resyncChan()
		defer func() {
			cleanup() // Call the last one written into cleanup
		}()
		for {
			select {
			case <-resyncCh:
       //  stopCh 一个停止循环的机会
			case <-stopCh:
				return
			case <-cancelCh:
				return
			}
			if r.ShouldResync == nil || r.ShouldResync() {
				klog.V(4).Infof("%s: forcing resync", r.name)
				if err := r.store.Resync(); err != nil {
					resyncerrc <- err
					return
				}
			}
			cleanup()
			resyncCh, cleanup = r.resyncChan()
		}
	}()

  
  // watch操作
	for {
		// give the stopCh a chance to stop the loop, even in case of continue statements further down on errors
		select {
		case <-stopCh:
			return nil
		default:
		}

		timeoutSeconds := int64(minWatchTimeout.Seconds() * (rand.Float64() + 1.0))
    // 设置watch的选项，因为前期列举了全量对象，从这里只要监听最新版本以后的资源就可以了 并且设置超时时间
		options = metav1.ListOptions{
			ResourceVersion: resourceVersion,
			TimeoutSeconds: &timeoutSeconds,
			AllowWatchBookmarks: true,
		}

		start := r.clock.Now()
    // 调用 Watch 接口 执行Watch 操作
		w, err := r.listerWatcher.Watch(options)
		if err != nil {
			if utilnet.IsConnectionRefused(err) || apierrors.IsTooManyRequests(err) {
				<-r.initConnBackoffManager.Backoff().C()
				continue
			}
			return err
		}

    // 执行 watchHandler 操作
		if err := r.watchHandler(start, w, &resourceVersion, resyncerrc, stopCh); err != nil {
			if err != errorStopRequested {
				switch {
				case isExpiredError(err):
					klog.V(4).Infof("%s: watch of %v closed with: %v", r.name, r.expectedTypeName, err)
				case apierrors.IsTooManyRequests(err):
					klog.V(2).Infof("%s: watch of %v returned 429 - backing off", r.name, r.expectedTypeName)
					<-r.initConnBackoffManager.Backoff().C()
					continue
				default:
					klog.Warningf("%s: watch of %v ended with: %v", r.name, r.expectedTypeName, err)
				}
			}
			return nil
		}
	}
}

```

### watchHandler 

在执行watch操作时 最后会执行一个watchHandler 对不同的事件 执行不同的处理方式

对于增删改操作 都会调用底层的Store对应的方法

```go
// k8s.io/client-go/tools/cache/reflector.go

// watchHandler 监听 w 保持资源版本最新
func (r *Reflector) watchHandler(start time.Time, w watch.Interface, resourceVersion *string, errc chan error, stopCh <-chan struct{}) error {
	eventCount := 0

	defer w.Stop()

loop:
	for {
		select {
		case <-stopCh:
			return errorStopRequested
		case err := <-errc:
			return err
		case event, ok := <-w.ResultChan():
			if !ok {
				break loop
			}
			if event.Type == watch.Error {
				return apierrors.FromObject(event.Object)
			}
			if r.expectedType != nil {
				if e, a := r.expectedType, reflect.TypeOf(event.Object); e != a {
					utilruntime.HandleError(fmt.Errorf("%s: expected type %v, but watch event object had type %v", r.name, e, a))
					continue
				}
			}
			if r.expectedGVK != nil {
				if e, a := *r.expectedGVK, event.Object.GetObjectKind().GroupVersionKind(); e != a {
					utilruntime.HandleError(fmt.Errorf("%s: expected gvk %v, but watch event object had gvk %v", r.name, e, a))
					continue
				}
			}
			meta, err := meta.Accessor(event.Object)
			if err != nil {
				utilruntime.HandleError(fmt.Errorf("%s: unable to understand watch event %#v", r.name, event))
				continue
			}
      // 获取当前watch到的资源版本号
			newResourceVersion := meta.GetResourceVersion()
			switch event.Type {  // 分发事件
			case watch.Added:    // add事件
				err := r.store.Add(event.Object)
				if err != nil {
					utilruntime.HandleError(fmt.Errorf("%s: unable to add watch event object (%#v) to store: %v", r.name, event.Object, err))
				}
			case watch.Modified: // Update 事件
				err := r.store.Update(event.Object)
				if err != nil {
					utilruntime.HandleError(fmt.Errorf("%s: unable to update watch event object (%#v) to store: %v", r.name, event.Object, err))
				}
			case watch.Deleted: // Delete 事件
				err := r.store.Delete(event.Object)
				if err != nil {
					utilruntime.HandleError(fmt.Errorf("%s: unable to delete watch event object (%#v) from store: %v", r.name, event.Object, err))
				}
			case watch.Bookmark:
				// A `Bookmark` means watch has synced here, just update the resourceVersion
			default:
				utilruntime.HandleError(fmt.Errorf("%s: unable to understand watch event %#v", r.name, event))
			}
			*resourceVersion = newResourceVersion
			r.setLastSyncResourceVersion(newResourceVersion)
			if rvu, ok := r.store.(ResourceVersionUpdater); ok {
				rvu.UpdateResourceVersion(newResourceVersion)
			}
			eventCount++
		}
	}

	watchDuration := r.clock.Since(start)
	if watchDuration < 1*time.Second && eventCount == 0 {
		return fmt.Errorf("very short watch: %s: Unexpected watch close - watch lasted less than a second and no items received", r.name)
	}
	klog.V(4).Infof("%s: Watch close - %v total %v items received", r.name, r.expectedTypeName, eventCount)
	return nil
}
```





