---
icon: edit
date: 2022-01-03
category:
  - 源码解读
tag:
  - k8s
  - apiserver
  - 环境
  - go
  - cncf
---
# kube-apiserver源码

## 1 入口函数

cmd/kube-apiserver/apiserver.go

```go
func main() {
   rand.Seed(time.Now().UnixNano())

   command := app.NewAPIServerCommand()
   logs.InitLogs()
   defer logs.FlushLogs()

   if err := command.Execute(); err != nil {
      os.Exit(1)
   }
}
```

主要是NewAPIServerCommand()执行,接下来我们就看看他的执行过程



## Command创建过程

cmd/kube-apiserver/app/server.go
1 初始化command 核心为其中的Run()函数

```go
// NewAPIServerCommand creates a *cobra.Command object with default parameters
func NewAPIServerCommand() *cobra.Command {
   s := options.NewServerRunOptions()
   cmd := &cobra.Command{
      Use: "kube-apiserver",
      Long: `The Kubernetes API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.`,
      RunE: func(cmd *cobra.Command, args []string) error {
         verflag.PrintAndExitIfRequested()
         utilflag.PrintFlags(cmd.Flags())

         // set default options
         completedOptions, err := Complete(s)
         if err != nil {
            return err
         }

         // validate options
         if errs := completedOptions.Validate(); len(errs) != 0 {
            return utilerrors.NewAggregate(errs)
         }

         return Run(completedOptions, genericapiserver.SetupSignalHandler())
      },
   }

   fs := cmd.Flags()
   namedFlagSets := s.Flags()
   verflag.AddFlags(namedFlagSets.FlagSet("global"))
   globalflag.AddGlobalFlags(namedFlagSets.FlagSet("global"), cmd.Name())
   options.AddCustomGlobalFlags(namedFlagSets.FlagSet("generic"))
   for _, f := range namedFlagSets.FlagSets {
      fs.AddFlagSet(f)
   }

   usageFmt := "Usage:\n  %s\n"
   cols, _, _ := term.TerminalSize(cmd.OutOrStdout())
   cmd.SetUsageFunc(func(cmd *cobra.Command) error {
      fmt.Fprintf(cmd.OutOrStderr(), usageFmt, cmd.UseLine())
      cliflag.PrintSections(cmd.OutOrStderr(), namedFlagSets, cols)
      return nil
   })
   cmd.SetHelpFunc(func(cmd *cobra.Command, args []string) {
      fmt.Fprintf(cmd.OutOrStdout(), "%s\n\n"+usageFmt, cmd.Long, cmd.UseLine())
      cliflag.PrintSections(cmd.OutOrStdout(), namedFlagSets, cols)
   })

   return cmd
}





// completeOptions 是初始化的模板   stopCh是创建的时候传入的信号量 可以根据他停止进程
func Run(completeOptions completedServerRunOptions, stopCh <-chan struct{}) error {
	// To help debugging, immediately log version
	klog.Infof("Version: %+v", version.Get())

	server, err := CreateServerChain(completeOptions, stopCh)
	if err != nil {
		return err
	}

	prepared, err := server.PrepareRun()
	if err != nil {
		return err
	}

	return prepared.Run(stopCh)
}

```

## server的创建

在上述代码中主要和server创建相关的是CreateServerChain 我们就来看看CreateServerChain

```go
// 在CreateServerChain这个函数下，创建了3个server
func CreateServerChain(){
 // kubeapiserver 的配置创建
    CreateKubeAPIServerConfig()
    
    // kube 额外配置的创建
    createAPIExtensionsConfig()
  // API扩展服务，主要针对CRD
	createAPIExtensionsServer(){} 
  // API核心服务，包括常见的Pod/Deployment/Service，我们今天的重点聚焦在这里
  // 我会跳过很多非核心的配置参数，一开始就去研究细节，很影响整体代码的阅读效率
	CreateKubeAPIServer(){} 
  // API聚合服务，主要针对metrics
	createAggregatorServer(){} 
}
```

## CreateKubeAPIServer()  apiserver的创建

cmd/kube-apiserver/app/server.go

```go
//首先调用complete 进行参数的填充  然后调用new进行实例化
func CreateKubeAPIServer(kubeAPIServerConfig *master.Config, delegateAPIServer genericapiserver.DelegationTarget) (*master.Master, error) {
   kubeAPIServer, err := kubeAPIServerConfig.Complete().New(delegateAPIServer)
   if err != nil {
      return nil, err
   }

   return kubeAPIServer, nil
}
```

可见他是调用了New函数

```go
func (c completedConfig) New(delegationTarget genericapiserver.DelegationTarget) (*Master, error) {
   if reflect.DeepEqual(c.ExtraConfig.KubeletClientConfig, kubeletclient.KubeletClientConfig{}) {
      return nil, fmt.Errorf("Master.New() called with empty config.KubeletClientConfig")
   }
	// 使用通用配置 new一个config
    
   s, err := c.GenericConfig.New("kube-apiserver", delegationTarget)
   if err != nil {
      return nil, err
   }

   if c.ExtraConfig.EnableLogsSupport {
      routes.Logs{}.Install(s.Handler.GoRestfulContainer)
   }

   if utilfeature.DefaultFeatureGate.Enabled(features.ServiceAccountIssuerDiscovery) {
      // Metadata and keys are expected to only change across restarts at present,
      // so we just marshal immediately and serve the cached JSON bytes.
      md, err := serviceaccount.NewOpenIDMetadata(
         c.ExtraConfig.ServiceAccountIssuerURL,
         c.ExtraConfig.ServiceAccountJWKSURI,
         c.GenericConfig.ExternalAddress,
         c.ExtraConfig.ServiceAccountPublicKeys,
      )
      if err != nil {
         // If there was an error, skip installing the endpoints and log the
         // error, but continue on. We don't return the error because the
         // metadata responses require additional, backwards incompatible
         // validation of command-line options.
         msg := fmt.Sprintf("Could not construct pre-rendered responses for"+
            " ServiceAccountIssuerDiscovery endpoints. Endpoints will not be"+
            " enabled. Error: %v", err)
         if c.ExtraConfig.ServiceAccountIssuerURL != "" {
            // The user likely expects this feature to be enabled if issuer URL is
            // set and the feature gate is enabled. In the future, if there is no
            // longer a feature gate and issuer URL is not set, the user may not
            // expect this feature to be enabled. We log the former case as an Error
            // and the latter case as an Info.
            klog.Error(msg)
         } else {
            klog.Info(msg)
         }
      } else {
         routes.NewOpenIDMetadataServer(md.ConfigJSON, md.PublicKeysetJSON).
            Install(s.Handler.GoRestfulContainer)
      }
   }

   m := &Master{
      GenericAPIServer:          s,
      ClusterAuthenticationInfo: c.ExtraConfig.ClusterAuthenticationInfo,
   }

   // install legacy rest storage
   if c.ExtraConfig.APIResourceConfigSource.VersionEnabled(apiv1.SchemeGroupVersion) {
      legacyRESTStorageProvider := corerest.LegacyRESTStorageProvider{
         StorageFactory:              c.ExtraConfig.StorageFactory,
         ProxyTransport:              c.ExtraConfig.ProxyTransport,
         KubeletClientConfig:         c.ExtraConfig.KubeletClientConfig,
         EventTTL:                    c.ExtraConfig.EventTTL,
         ServiceIPRange:              c.ExtraConfig.ServiceIPRange,
         SecondaryServiceIPRange:     c.ExtraConfig.SecondaryServiceIPRange,
         ServiceNodePortRange:        c.ExtraConfig.ServiceNodePortRange,
         LoopbackClientConfig:        c.GenericConfig.LoopbackClientConfig,
         ServiceAccountIssuer:        c.ExtraConfig.ServiceAccountIssuer,
         ServiceAccountMaxExpiration: c.ExtraConfig.ServiceAccountMaxExpiration,
         APIAudiences:                c.GenericConfig.Authentication.APIAudiences,
      }
      if err := m.InstallLegacyAPI(&c, c.GenericConfig.RESTOptionsGetter, legacyRESTStorageProvider); err != nil {
         return nil, err
      }
   }

   // The order here is preserved in discovery.
   // If resources with identical names exist in more than one of these groups (e.g. "deployments.apps"" and "deployments.extensions"),
   // the order of this list determines which group an unqualified resource name (e.g. "deployments") should prefer.
   // This priority order is used for local discovery, but it ends up aggregated in `k8s.io/kubernetes/cmd/kube-apiserver/app/aggregator.go
   // with specific priorities.
   // TODO: describe the priority all the way down in the RESTStorageProviders and plumb it back through the various discovery
   // handlers that we have.
   restStorageProviders := []RESTStorageProvider{
      auditregistrationrest.RESTStorageProvider{},
      authenticationrest.RESTStorageProvider{Authenticator: c.GenericConfig.Authentication.Authenticator, APIAudiences: c.GenericConfig.Authentication.APIAudiences},
      authorizationrest.RESTStorageProvider{Authorizer: c.GenericConfig.Authorization.Authorizer, RuleResolver: c.GenericConfig.RuleResolver},
      autoscalingrest.RESTStorageProvider{},
      batchrest.RESTStorageProvider{},
      certificatesrest.RESTStorageProvider{},
      coordinationrest.RESTStorageProvider{},
      discoveryrest.StorageProvider{},
      extensionsrest.RESTStorageProvider{},
      networkingrest.RESTStorageProvider{},
      noderest.RESTStorageProvider{},
      policyrest.RESTStorageProvider{},
      rbacrest.RESTStorageProvider{Authorizer: c.GenericConfig.Authorization.Authorizer},
      schedulingrest.RESTStorageProvider{},
      settingsrest.RESTStorageProvider{},
      storagerest.RESTStorageProvider{},
      flowcontrolrest.RESTStorageProvider{},
      // keep apps after extensions so legacy clients resolve the extensions versions of shared resource names.
      // See https://github.com/kubernetes/kubernetes/issues/42392
      appsrest.RESTStorageProvider{},
      admissionregistrationrest.RESTStorageProvider{},
      eventsrest.RESTStorageProvider{TTL: c.ExtraConfig.EventTTL},
   }
   if err := m.InstallAPIs(c.ExtraConfig.APIResourceConfigSource, c.GenericConfig.RESTOptionsGetter, restStorageProviders...); err != nil {
      return nil, err
   }

   if c.ExtraConfig.Tunneler != nil {
      m.installTunneler(c.ExtraConfig.Tunneler, corev1client.NewForConfigOrDie(c.GenericConfig.LoopbackClientConfig).Nodes())
   }

   m.GenericAPIServer.AddPostStartHookOrDie("start-cluster-authentication-info-controller", func(hookContext genericapiserver.PostStartHookContext) error {
      kubeClient, err := kubernetes.NewForConfig(hookContext.LoopbackClientConfig)
      if err != nil {
         return err
      }
      controller := clusterauthenticationtrust.NewClusterAuthenticationTrustController(m.ClusterAuthenticationInfo, kubeClient)

      // prime values and start listeners
      if m.ClusterAuthenticationInfo.ClientCA != nil {
         if notifier, ok := m.ClusterAuthenticationInfo.ClientCA.(dynamiccertificates.Notifier); ok {
            notifier.AddListener(controller)
         }
         if controller, ok := m.ClusterAuthenticationInfo.ClientCA.(dynamiccertificates.ControllerRunner); ok {
            // runonce to be sure that we have a value.
            if err := controller.RunOnce(); err != nil {
               runtime.HandleError(err)
            }
            go controller.Run(1, hookContext.StopCh)
         }
      }
      if m.ClusterAuthenticationInfo.RequestHeaderCA != nil {
         if notifier, ok := m.ClusterAuthenticationInfo.RequestHeaderCA.(dynamiccertificates.Notifier); ok {
            notifier.AddListener(controller)
         }
         if controller, ok := m.ClusterAuthenticationInfo.RequestHeaderCA.(dynamiccertificates.ControllerRunner); ok {
            // runonce to be sure that we have a value.
            if err := controller.RunOnce(); err != nil {
               runtime.HandleError(err)
            }
            go controller.Run(1, hookContext.StopCh)
         }
      }

      go controller.Run(1, hookContext.StopCh)
      return nil
   })

   return m, nil
}
```

## GenericConfig.New() 设置的初始化

在上述代码中 有用new进行初始化了一个config对象 

```go
// 都通过GenericConfig创建了genericServer，我们先大致浏览下
func (c completedConfig) New(name string, delegationTarget DelegationTarget) (*GenericAPIServer, error) {
	// 新建Handler
	apiServerHandler := NewAPIServerHandler(name, c.Serializer, handlerChainBuilder, delegationTarget.UnprotectedHandler())
  
	// 实例化一个Server
	s := &GenericAPIServer{
    ...
  }

	// 处理钩子hook操作
	for k, v := range delegationTarget.PostStartHooks() {
		s.postStartHooks[k] = v
	}

	for k, v := range delegationTarget.PreShutdownHooks() {
		s.preShutdownHooks[k] = v
	}

	// 健康监测
	for _, delegateCheck := range delegationTarget.HealthzChecks() {
		skip := false
		for _, existingCheck := range c.HealthzChecks {
			if existingCheck.Name() == delegateCheck.Name() {
				skip = true
				break
			}
		}
		if skip {
			continue
		}
		s.AddHealthChecks(delegateCheck)
	}
	
  // 安装API相关参数，这个是重点
	installAPI(s, c.Config)

	return s, nil
}
```





## Apiserver的创建





```go
func (c completedConfig) New(delegationTarget genericapiserver.DelegationTarget) (*Master, error) {
	// genericServer的初始化
	s, err := c.GenericConfig.New("kube-apiserver", delegationTarget)
	// 核心KubeAPIServer的实例化
	m := &Master{
		GenericAPIServer:          s,
		ClusterAuthenticationInfo: c.ExtraConfig.ClusterAuthenticationInfo,
	}

	// 注册Legacy API的注册
	if c.ExtraConfig.APIResourceConfigSource.VersionEnabled(apiv1.SchemeGroupVersion) {
		legacyRESTStorageProvider := corerest.LegacyRESTStorageProvider{}
		if err := m.InstallLegacyAPI(&c, c.GenericConfig.RESTOptionsGetter, legacyRESTStorageProvider); err != nil {
			return nil, err
		}
	}
	// REST接口的存储定义，可以看到很多k8s上的常见定义，比如node节点/storage存储/event事件等等
	restStorageProviders := []RESTStorageProvider{
		authenticationrest.RESTStorageProvider{Authenticator: c.GenericConfig.Authentication.Authenticator, APIAudiences: c.GenericConfig.Authentication.APIAudiences},
		authorizationrest.RESTStorageProvider{Authorizer: c.GenericConfig.Authorization.Authorizer, RuleResolver: c.GenericConfig.RuleResolver},
		autoscalingrest.RESTStorageProvider{},
		batchrest.RESTStorageProvider{},
		certificatesrest.RESTStorageProvider{},
		coordinationrest.RESTStorageProvider{},
		discoveryrest.StorageProvider{},
		extensionsrest.RESTStorageProvider{},
		networkingrest.RESTStorageProvider{},
		noderest.RESTStorageProvider{},
		policyrest.RESTStorageProvider{},
		rbacrest.RESTStorageProvider{Authorizer: c.GenericConfig.Authorization.Authorizer},
		schedulingrest.RESTStorageProvider{},
		settingsrest.RESTStorageProvider{},
		storagerest.RESTStorageProvider{},
		flowcontrolrest.RESTStorageProvider{},
		// keep apps after extensions so legacy clients resolve the extensions versions of shared resource names.
		// See https://github.com/kubernetes/kubernetes/issues/42392
		appsrest.StorageProvider{},
		admissionregistrationrest.RESTStorageProvider{},
		eventsrest.RESTStorageProvider{TTL: c.ExtraConfig.EventTTL},
	}
  // 注册API
	if err := m.InstallAPIs(c.ExtraConfig.APIResourceConfigSource, c.GenericConfig.RESTOptionsGetter, restStorageProviders...); err != nil {
		return nil, err
	}
	// 添加Hook
	m.GenericAPIServer.AddPostStartHookOrDie("start-cluster-authentication-info-controller", func(hookContext genericapiserver.PostStartHookContext) error {
	})
	return m, nil
}
```

