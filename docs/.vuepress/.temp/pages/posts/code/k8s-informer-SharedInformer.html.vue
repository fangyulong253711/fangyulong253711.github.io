<template><h1 id="k8s-sharedinformer源码分析" tabindex="-1"><a class="header-anchor" href="#k8s-sharedinformer源码分析" aria-hidden="true">#</a> K8s-SharedInformer源码分析</h1>
<h2 id="作用说明" tabindex="-1"><a class="header-anchor" href="#作用说明" aria-hidden="true">#</a> 作用说明</h2>
<p>SharedInformer，它是可以共享使用的。如果同一个资源的 Informer 被实例化多次，那么就会运行多个 ListAndWatch 操作，这会加大 APIServer 的压力。而 SharedInformer 通过一个 map 来让同一类资源的 Informer 实现共享一个 Refelctor，这样就不会出现上面这个问题了。</p>
<h2 id="结构说明" tabindex="-1"><a class="header-anchor" href="#结构说明" aria-hidden="true">#</a> 结构说明</h2>
<h3 id="sharedindexinformer" tabindex="-1"><a class="header-anchor" href="#sharedindexinformer" aria-hidden="true">#</a> sharedIndexInformer</h3>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token comment">// k8s.io/client-go/tools/cache/shared_informer.go</span>

<span class="token keyword">type</span> sharedIndexInformer <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	indexer    Indexer
	controller Controller

	processor             <span class="token operator">*</span>sharedProcessor
	cacheMutationDetector MutationDetector

	listerWatcher ListerWatcher

	<span class="token comment">// objectType is an example object of the type this informer is</span>
	<span class="token comment">// expected to handle.  Only the type needs to be right, except</span>
	<span class="token comment">// that when that is `unstructured.Unstructured` the object's</span>
	<span class="token comment">// `"apiVersion"` and `"kind"` must also be right.</span>
	objectType runtime<span class="token punctuation">.</span>Object

	<span class="token comment">// resyncCheckPeriod is how often we want the reflector's resync timer to fire so it can call</span>
	<span class="token comment">// shouldResync to check if any of our listeners need a resync.</span>
	resyncCheckPeriod time<span class="token punctuation">.</span>Duration
	<span class="token comment">// defaultEventHandlerResyncPeriod is the default resync period for any handlers added via</span>
	<span class="token comment">// AddEventHandler (i.e. they don't specify one and just want to use the shared informer's default</span>
	<span class="token comment">// value).</span>
	defaultEventHandlerResyncPeriod time<span class="token punctuation">.</span>Duration
	<span class="token comment">// clock allows for testability</span>
	clock clock<span class="token punctuation">.</span>Clock

	started<span class="token punctuation">,</span> stopped <span class="token builtin">bool</span>
	startedLock      sync<span class="token punctuation">.</span>Mutex

	<span class="token comment">// blockDeltas gives a way to stop all event distribution so that a late event handler</span>
	<span class="token comment">// can safely join the shared informer.</span>
	blockDeltas sync<span class="token punctuation">.</span>Mutex

	<span class="token comment">// Called whenever the ListAndWatch drops the connection with an error.</span>
	watchErrorHandler WatchErrorHandler
<span class="token punctuation">}</span>




<span class="token comment">// 执行函数</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>sharedIndexInformer<span class="token punctuation">)</span> <span class="token function">Run</span><span class="token punctuation">(</span>stopCh <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">defer</span> utilruntime<span class="token punctuation">.</span><span class="token function">HandleCrash</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token keyword">if</span> s<span class="token punctuation">.</span><span class="token function">HasStarted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		klog<span class="token punctuation">.</span><span class="token function">Warningf</span><span class="token punctuation">(</span><span class="token string">"The sharedIndexInformer has started, run more than once is not allowed"</span><span class="token punctuation">)</span>
		<span class="token keyword">return</span>
	<span class="token punctuation">}</span>
	fifo <span class="token operator">:=</span> <span class="token function">NewDeltaFIFOWithOptions</span><span class="token punctuation">(</span>DeltaFIFOOptions<span class="token punctuation">{</span>
		KnownObjects<span class="token punctuation">:</span>          s<span class="token punctuation">.</span>indexer<span class="token punctuation">,</span>
		EmitDeltaTypeReplaced<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span><span class="token punctuation">)</span>

	cfg <span class="token operator">:=</span> <span class="token operator">&amp;</span>Config<span class="token punctuation">{</span>
		Queue<span class="token punctuation">:</span>            fifo<span class="token punctuation">,</span>
		ListerWatcher<span class="token punctuation">:</span>    s<span class="token punctuation">.</span>listerWatcher<span class="token punctuation">,</span>
		ObjectType<span class="token punctuation">:</span>       s<span class="token punctuation">.</span>objectType<span class="token punctuation">,</span>
		FullResyncPeriod<span class="token punctuation">:</span> s<span class="token punctuation">.</span>resyncCheckPeriod<span class="token punctuation">,</span>
		RetryOnError<span class="token punctuation">:</span>     <span class="token boolean">false</span><span class="token punctuation">,</span>
		ShouldResync<span class="token punctuation">:</span>     s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span>shouldResync<span class="token punctuation">,</span>

		Process<span class="token punctuation">:</span>           s<span class="token punctuation">.</span>HandleDeltas<span class="token punctuation">,</span>
		WatchErrorHandler<span class="token punctuation">:</span> s<span class="token punctuation">.</span>watchErrorHandler<span class="token punctuation">,</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">defer</span> s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

		s<span class="token punctuation">.</span>controller <span class="token operator">=</span> <span class="token function">New</span><span class="token punctuation">(</span>cfg<span class="token punctuation">)</span>
		s<span class="token punctuation">.</span>controller<span class="token punctuation">.</span><span class="token punctuation">(</span><span class="token operator">*</span>controller<span class="token punctuation">)</span><span class="token punctuation">.</span>clock <span class="token operator">=</span> s<span class="token punctuation">.</span>clock
		s<span class="token punctuation">.</span>started <span class="token operator">=</span> <span class="token boolean">true</span>
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token comment">// Separate stop channel because Processor should be stopped strictly after controller</span>
	processorStopCh <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
	<span class="token keyword">var</span> wg wait<span class="token punctuation">.</span>Group
	<span class="token keyword">defer</span> wg<span class="token punctuation">.</span><span class="token function">Wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span>              <span class="token comment">// Wait for Processor to stop</span>
	<span class="token keyword">defer</span> <span class="token function">close</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">)</span> <span class="token comment">// Tell Processor to stop</span>
	wg<span class="token punctuation">.</span><span class="token function">StartWithChannel</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">,</span> s<span class="token punctuation">.</span>cacheMutationDetector<span class="token punctuation">.</span>Run<span class="token punctuation">)</span>
	wg<span class="token punctuation">.</span><span class="token function">StartWithChannel</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">,</span> s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span>run<span class="token punctuation">)</span>

	<span class="token keyword">defer</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">defer</span> s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		s<span class="token punctuation">.</span>stopped <span class="token operator">=</span> <span class="token boolean">true</span> <span class="token comment">// Don't want any new listeners</span>
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	s<span class="token punctuation">.</span>controller<span class="token punctuation">.</span><span class="token function">Run</span><span class="token punctuation">(</span>stopCh<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br></div></div><h3 id="controller" tabindex="-1"><a class="header-anchor" href="#controller" aria-hidden="true">#</a> controller</h3>
<p>在上面 sharedIndexInformer的执行函数中 我们发现最后运行的是controller的一个run函数</p>
<p>这里的 Controller 定义在 client-go/tools/cache/controller.go 中，目的是用来把 Reflector、DeltaFIFO 这些组件组合起来形成一个相对固定的、标准的处理流程</p>
<p>从上面的核心函数 Run 的实现方式来看，该函数中主要就是实例化一个 Reflector，然后启动一个协程去执行这个反射器的 Run 函数，这个 Run 函数前面我们已经讲解过就是去调用 ListAndWatch 函数进行 List 和 Watch 操作，这个操作中具体的实现就是 Config 中的 ListerWatcher。然后的一个核心就是 processLoop() 函数的实现：</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token comment">// k8s.io/client-go/tools/cache/controller.go</span>
<span class="token comment">// Run begins processing items, and will continue until a value is sent down stopCh or it is closed.</span>
<span class="token comment">// It's an error to call Run more than once.</span>
<span class="token comment">// Run blocks; call via go.</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>controller<span class="token punctuation">)</span> <span class="token function">Run</span><span class="token punctuation">(</span>stopCh <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">defer</span> utilruntime<span class="token punctuation">.</span><span class="token function">HandleCrash</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">go</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token operator">&lt;-</span>stopCh
		c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>Queue<span class="token punctuation">.</span><span class="token function">Close</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	r <span class="token operator">:=</span> <span class="token function">NewReflector</span><span class="token punctuation">(</span>
		c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>ListerWatcher<span class="token punctuation">,</span>
		c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>ObjectType<span class="token punctuation">,</span>
		c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>Queue<span class="token punctuation">,</span>
		c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>FullResyncPeriod<span class="token punctuation">,</span>
	<span class="token punctuation">)</span>
	r<span class="token punctuation">.</span>ShouldResync <span class="token operator">=</span> c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>ShouldResync
	r<span class="token punctuation">.</span>WatchListPageSize <span class="token operator">=</span> c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>WatchListPageSize
	r<span class="token punctuation">.</span>clock <span class="token operator">=</span> c<span class="token punctuation">.</span>clock
	<span class="token keyword">if</span> c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>WatchErrorHandler <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		r<span class="token punctuation">.</span>watchErrorHandler <span class="token operator">=</span> c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>WatchErrorHandler
	<span class="token punctuation">}</span>

	c<span class="token punctuation">.</span>reflectorMutex<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	c<span class="token punctuation">.</span>reflector <span class="token operator">=</span> r
	c<span class="token punctuation">.</span>reflectorMutex<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token keyword">var</span> wg wait<span class="token punctuation">.</span>Group

	wg<span class="token punctuation">.</span><span class="token function">StartWithChannel</span><span class="token punctuation">(</span>stopCh<span class="token punctuation">,</span> r<span class="token punctuation">.</span>Run<span class="token punctuation">)</span>

	wait<span class="token punctuation">.</span><span class="token function">Until</span><span class="token punctuation">(</span>c<span class="token punctuation">.</span>processLoop<span class="token punctuation">,</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">,</span> stopCh<span class="token punctuation">)</span>
	wg<span class="token punctuation">.</span><span class="token function">Wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>



<span class="token comment">// k8s.io/client-go/tools/cache/controller.go</span>

<span class="token comment">// 处理队列弹出的对象</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>controller<span class="token punctuation">)</span> <span class="token function">processLoop</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 死循环，不断从队列中弹出对象来处理</span>
	<span class="token keyword">for</span> <span class="token punctuation">{</span>
    <span class="token comment">// 从队列中弹出一个对象，然后处理这个对象</span>
    <span class="token comment">// 真正处理的是通过 Config 传递进来的 Process 函数</span>
		obj<span class="token punctuation">,</span> err <span class="token operator">:=</span> c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>Queue<span class="token punctuation">.</span><span class="token function">Pop</span><span class="token punctuation">(</span><span class="token function">PopProcessFunc</span><span class="token punctuation">(</span>c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>Process<span class="token punctuation">)</span><span class="token punctuation">)</span>
		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果队列关闭了那就直接退出了</span>
			<span class="token keyword">if</span> err <span class="token operator">==</span> ErrFIFOClosed <span class="token punctuation">{</span>
				<span class="token keyword">return</span>
			<span class="token punctuation">}</span>
      <span class="token comment">// 如果配置的是错误后允许重试</span>
			<span class="token keyword">if</span> c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>RetryOnError <span class="token punctuation">{</span>
				<span class="token comment">// 如果错误可以再重试那么将弹出的对象重新入队列进行处理</span>
				c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>Queue<span class="token punctuation">.</span><span class="token function">AddIfNotPresent</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br></div></div><h3 id="sharedindexinformer-1" tabindex="-1"><a class="header-anchor" href="#sharedindexinformer-1" aria-hidden="true">#</a> sharedIndexInformer</h3>
<p>sharedIndexInformer 通过 Run() 函数启动了 Controller 和 sharedProcess，Controller 通过 DeltaFIFO 的 Pop 函数弹出 Deltas 对象，并使用 HandleDeltas 函数来处理这个对象，这个函数把 Deltas 转换为 sharedProcess 需要的各种Notification 类型。</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token comment">// k8s.io/client-go/tools/cache/shared_informer.go</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>sharedIndexInformer<span class="token punctuation">)</span> <span class="token function">Run</span><span class="token punctuation">(</span>stopCh <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">defer</span> utilruntime<span class="token punctuation">.</span><span class="token function">HandleCrash</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token comment">// 新建一个 DeltaFIFO</span>
	fifo <span class="token operator">:=</span> <span class="token function">NewDeltaFIFOWithOptions</span><span class="token punctuation">(</span>DeltaFIFOOptions<span class="token punctuation">{</span>
		KnownObjects<span class="token punctuation">:</span>          s<span class="token punctuation">.</span>indexer<span class="token punctuation">,</span>
		EmitDeltaTypeReplaced<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token comment">// 用于构造 Controller 的配置</span>
	cfg <span class="token operator">:=</span> <span class="token operator">&amp;</span>Config<span class="token punctuation">{</span>
		Queue<span class="token punctuation">:</span>            fifo<span class="token punctuation">,</span>  
		ListerWatcher<span class="token punctuation">:</span>    s<span class="token punctuation">.</span>listerWatcher<span class="token punctuation">,</span>
		ObjectType<span class="token punctuation">:</span>       s<span class="token punctuation">.</span>objectType<span class="token punctuation">,</span>
		FullResyncPeriod<span class="token punctuation">:</span> s<span class="token punctuation">.</span>resyncCheckPeriod<span class="token punctuation">,</span>
		RetryOnError<span class="token punctuation">:</span>     <span class="token boolean">false</span><span class="token punctuation">,</span>
		ShouldResync<span class="token punctuation">:</span>     s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span>shouldResync<span class="token punctuation">,</span>
    <span class="token comment">// Controller 调用 DeltaFIFO 的 Pop 函数传入这个回调函数来处理弹出的对象</span>
		Process<span class="token punctuation">:</span> s<span class="token punctuation">.</span>HandleDeltas<span class="token punctuation">,</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">defer</span> s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token comment">// 新建一个 Controller 并标记为已经启动</span>
		s<span class="token punctuation">.</span>controller <span class="token operator">=</span> <span class="token function">New</span><span class="token punctuation">(</span>cfg<span class="token punctuation">)</span>
		s<span class="token punctuation">.</span>controller<span class="token punctuation">.</span><span class="token punctuation">(</span><span class="token operator">*</span>controller<span class="token punctuation">)</span><span class="token punctuation">.</span>clock <span class="token operator">=</span> s<span class="token punctuation">.</span>clock
		s<span class="token punctuation">.</span>started <span class="token operator">=</span> <span class="token boolean">true</span>
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	processorStopCh <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
	<span class="token keyword">var</span> wg wait<span class="token punctuation">.</span>Group
	<span class="token keyword">defer</span> wg<span class="token punctuation">.</span><span class="token function">Wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span>              <span class="token comment">// 等待处理器停止</span>
	<span class="token keyword">defer</span> <span class="token function">close</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">)</span> <span class="token comment">// 通知处理器停止</span>
  <span class="token comment">// 启动两个协程</span>
	wg<span class="token punctuation">.</span><span class="token function">StartWithChannel</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">,</span> s<span class="token punctuation">.</span>cacheMutationDetector<span class="token punctuation">.</span>Run<span class="token punctuation">)</span>
	wg<span class="token punctuation">.</span><span class="token function">StartWithChannel</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">,</span> s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span>run<span class="token punctuation">)</span>

	<span class="token keyword">defer</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">defer</span> s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token comment">// 标记为已停止</span>
		s<span class="token punctuation">.</span>stopped <span class="token operator">=</span> <span class="token boolean">true</span> 
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token comment">// 启动 Controller</span>
	s<span class="token punctuation">.</span>controller<span class="token punctuation">.</span><span class="token function">Run</span><span class="token punctuation">(</span>stopCh<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br></div></div><div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token comment">// k8s.io/client-go/tools/cache/shared_informer.go</span>

<span class="token comment">// DeltaFIFO 的对象被 Pop 后的处理函数</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>sharedIndexInformer<span class="token punctuation">)</span> <span class="token function">HandleDeltas</span><span class="token punctuation">(</span>obj <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	s<span class="token punctuation">.</span>blockDeltas<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">defer</span> s<span class="token punctuation">.</span>blockDeltas<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token comment">// 因为 Deltas 是 Delta 列表，里面包含一个对象的多个操作</span>
  <span class="token comment">// 所以要从最老的 Delta 到最新的 Delta 遍历处理</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> d <span class="token operator">:=</span> <span class="token keyword">range</span> obj<span class="token punctuation">.</span><span class="token punctuation">(</span>Deltas<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">switch</span> d<span class="token punctuation">.</span>Type <span class="token punctuation">{</span> <span class="token comment">// 根据对象操作类型进行处理</span>
    <span class="token comment">// 同步、替换、添加、更新类型</span>
		<span class="token keyword">case</span> Sync<span class="token punctuation">,</span> Replaced<span class="token punctuation">,</span> Added<span class="token punctuation">,</span> Updated<span class="token punctuation">:</span>
			s<span class="token punctuation">.</span>cacheMutationDetector<span class="token punctuation">.</span><span class="token function">AddObject</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span>
      <span class="token comment">// 如果 indexer 中有这个对象，则当成更新事件进行处理</span>
			<span class="token keyword">if</span> old<span class="token punctuation">,</span> exists<span class="token punctuation">,</span> err <span class="token operator">:=</span> s<span class="token punctuation">.</span>indexer<span class="token punctuation">.</span><span class="token function">Get</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token operator">&amp;&amp;</span> exists <span class="token punctuation">{</span>
				<span class="token keyword">if</span> err <span class="token operator">:=</span> s<span class="token punctuation">.</span>indexer<span class="token punctuation">.</span><span class="token function">Update</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>  
					<span class="token keyword">return</span> err
				<span class="token punctuation">}</span>

				isSync <span class="token operator">:=</span> <span class="token boolean">false</span>
				<span class="token keyword">switch</span> <span class="token punctuation">{</span>
				<span class="token keyword">case</span> d<span class="token punctuation">.</span>Type <span class="token operator">==</span> Sync<span class="token punctuation">:</span>
					isSync <span class="token operator">=</span> <span class="token boolean">true</span>
				<span class="token keyword">case</span> d<span class="token punctuation">.</span>Type <span class="token operator">==</span> Replaced<span class="token punctuation">:</span>
					<span class="token keyword">if</span> accessor<span class="token punctuation">,</span> err <span class="token operator">:=</span> meta<span class="token punctuation">.</span><span class="token function">Accessor</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
						<span class="token keyword">if</span> oldAccessor<span class="token punctuation">,</span> err <span class="token operator">:=</span> meta<span class="token punctuation">.</span><span class="token function">Accessor</span><span class="token punctuation">(</span>old<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
							isSync <span class="token operator">=</span> accessor<span class="token punctuation">.</span><span class="token function">GetResourceVersion</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> oldAccessor<span class="token punctuation">.</span><span class="token function">GetResourceVersion</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
						<span class="token punctuation">}</span>
					<span class="token punctuation">}</span>
				<span class="token punctuation">}</span>
        <span class="token comment">// 通知处理器处理事件</span>
				s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span><span class="token function">distribute</span><span class="token punctuation">(</span>updateNotification<span class="token punctuation">{</span>oldObj<span class="token punctuation">:</span> old<span class="token punctuation">,</span> newObj<span class="token punctuation">:</span> d<span class="token punctuation">.</span>Object<span class="token punctuation">}</span><span class="token punctuation">,</span> isSync<span class="token punctuation">)</span>
			<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// 将对象添加到 indexer 存储中</span>
				<span class="token keyword">if</span> err <span class="token operator">:=</span> s<span class="token punctuation">.</span>indexer<span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
					<span class="token keyword">return</span> err
				<span class="token punctuation">}</span>
        <span class="token comment">// 然后通知处理器处理事件</span>
				s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span><span class="token function">distribute</span><span class="token punctuation">(</span>addNotification<span class="token punctuation">{</span>newObj<span class="token punctuation">:</span> d<span class="token punctuation">.</span>Object<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
			<span class="token punctuation">}</span>
    <span class="token comment">// 删除类型</span>
		<span class="token keyword">case</span> Deleted<span class="token punctuation">:</span>
      <span class="token comment">// 从 indexer 中删除对象</span>
			<span class="token keyword">if</span> err <span class="token operator">:=</span> s<span class="token punctuation">.</span>indexer<span class="token punctuation">.</span><span class="token function">Delete</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
				<span class="token keyword">return</span> err
			<span class="token punctuation">}</span>
      <span class="token comment">// 通知所有的处理器对象被删除了</span>
			s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span><span class="token function">distribute</span><span class="token punctuation">(</span>deleteNotification<span class="token punctuation">{</span>oldObj<span class="token punctuation">:</span> d<span class="token punctuation">.</span>Object<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br></div></div></template>
