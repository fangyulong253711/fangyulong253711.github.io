import{_ as n,f as s}from"./app.9d0d0a36.js";const a={},p=s(`<h1 id="k8s-sharedinformer\u6E90\u7801\u5206\u6790" tabindex="-1"><a class="header-anchor" href="#k8s-sharedinformer\u6E90\u7801\u5206\u6790" aria-hidden="true">#</a> K8s-SharedInformer\u6E90\u7801\u5206\u6790</h1><h2 id="\u4F5C\u7528\u8BF4\u660E" tabindex="-1"><a class="header-anchor" href="#\u4F5C\u7528\u8BF4\u660E" aria-hidden="true">#</a> \u4F5C\u7528\u8BF4\u660E</h2><p>SharedInformer\uFF0C\u5B83\u662F\u53EF\u4EE5\u5171\u4EAB\u4F7F\u7528\u7684\u3002\u5982\u679C\u540C\u4E00\u4E2A\u8D44\u6E90\u7684 Informer \u88AB\u5B9E\u4F8B\u5316\u591A\u6B21\uFF0C\u90A3\u4E48\u5C31\u4F1A\u8FD0\u884C\u591A\u4E2A ListAndWatch \u64CD\u4F5C\uFF0C\u8FD9\u4F1A\u52A0\u5927 APIServer \u7684\u538B\u529B\u3002\u800C SharedInformer \u901A\u8FC7\u4E00\u4E2A map \u6765\u8BA9\u540C\u4E00\u7C7B\u8D44\u6E90\u7684 Informer \u5B9E\u73B0\u5171\u4EAB\u4E00\u4E2A Refelctor\uFF0C\u8FD9\u6837\u5C31\u4E0D\u4F1A\u51FA\u73B0\u4E0A\u9762\u8FD9\u4E2A\u95EE\u9898\u4E86\u3002</p><h2 id="\u7ED3\u6784\u8BF4\u660E" tabindex="-1"><a class="header-anchor" href="#\u7ED3\u6784\u8BF4\u660E" aria-hidden="true">#</a> \u7ED3\u6784\u8BF4\u660E</h2><h3 id="sharedindexinformer" tabindex="-1"><a class="header-anchor" href="#sharedindexinformer" aria-hidden="true">#</a> sharedIndexInformer</h3><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token comment">// k8s.io/client-go/tools/cache/shared_informer.go</span>

<span class="token keyword">type</span> sharedIndexInformer <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	indexer    Indexer
	controller Controller

	processor             <span class="token operator">*</span>sharedProcessor
	cacheMutationDetector MutationDetector

	listerWatcher ListerWatcher

	<span class="token comment">// objectType is an example object of the type this informer is</span>
	<span class="token comment">// expected to handle.  Only the type needs to be right, except</span>
	<span class="token comment">// that when that is \`unstructured.Unstructured\` the object&#39;s</span>
	<span class="token comment">// \`&quot;apiVersion&quot;\` and \`&quot;kind&quot;\` must also be right.</span>
	objectType runtime<span class="token punctuation">.</span>Object

	<span class="token comment">// resyncCheckPeriod is how often we want the reflector&#39;s resync timer to fire so it can call</span>
	<span class="token comment">// shouldResync to check if any of our listeners need a resync.</span>
	resyncCheckPeriod time<span class="token punctuation">.</span>Duration
	<span class="token comment">// defaultEventHandlerResyncPeriod is the default resync period for any handlers added via</span>
	<span class="token comment">// AddEventHandler (i.e. they don&#39;t specify one and just want to use the shared informer&#39;s default</span>
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




<span class="token comment">// \u6267\u884C\u51FD\u6570</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>sharedIndexInformer<span class="token punctuation">)</span> <span class="token function">Run</span><span class="token punctuation">(</span>stopCh <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">defer</span> utilruntime<span class="token punctuation">.</span><span class="token function">HandleCrash</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token keyword">if</span> s<span class="token punctuation">.</span><span class="token function">HasStarted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		klog<span class="token punctuation">.</span><span class="token function">Warningf</span><span class="token punctuation">(</span><span class="token string">&quot;The sharedIndexInformer has started, run more than once is not allowed&quot;</span><span class="token punctuation">)</span>
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
		s<span class="token punctuation">.</span>stopped <span class="token operator">=</span> <span class="token boolean">true</span> <span class="token comment">// Don&#39;t want any new listeners</span>
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	s<span class="token punctuation">.</span>controller<span class="token punctuation">.</span><span class="token function">Run</span><span class="token punctuation">(</span>stopCh<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br></div></div><h3 id="controller" tabindex="-1"><a class="header-anchor" href="#controller" aria-hidden="true">#</a> controller</h3><p>\u5728\u4E0A\u9762 sharedIndexInformer\u7684\u6267\u884C\u51FD\u6570\u4E2D \u6211\u4EEC\u53D1\u73B0\u6700\u540E\u8FD0\u884C\u7684\u662Fcontroller\u7684\u4E00\u4E2Arun\u51FD\u6570</p><p>\u8FD9\u91CC\u7684 Controller \u5B9A\u4E49\u5728 client-go/tools/cache/controller.go \u4E2D\uFF0C\u76EE\u7684\u662F\u7528\u6765\u628A Reflector\u3001DeltaFIFO \u8FD9\u4E9B\u7EC4\u4EF6\u7EC4\u5408\u8D77\u6765\u5F62\u6210\u4E00\u4E2A\u76F8\u5BF9\u56FA\u5B9A\u7684\u3001\u6807\u51C6\u7684\u5904\u7406\u6D41\u7A0B</p><p>\u4ECE\u4E0A\u9762\u7684\u6838\u5FC3\u51FD\u6570 Run \u7684\u5B9E\u73B0\u65B9\u5F0F\u6765\u770B\uFF0C\u8BE5\u51FD\u6570\u4E2D\u4E3B\u8981\u5C31\u662F\u5B9E\u4F8B\u5316\u4E00\u4E2A Reflector\uFF0C\u7136\u540E\u542F\u52A8\u4E00\u4E2A\u534F\u7A0B\u53BB\u6267\u884C\u8FD9\u4E2A\u53CD\u5C04\u5668\u7684 Run \u51FD\u6570\uFF0C\u8FD9\u4E2A Run \u51FD\u6570\u524D\u9762\u6211\u4EEC\u5DF2\u7ECF\u8BB2\u89E3\u8FC7\u5C31\u662F\u53BB\u8C03\u7528 ListAndWatch \u51FD\u6570\u8FDB\u884C List \u548C Watch \u64CD\u4F5C\uFF0C\u8FD9\u4E2A\u64CD\u4F5C\u4E2D\u5177\u4F53\u7684\u5B9E\u73B0\u5C31\u662F Config \u4E2D\u7684 ListerWatcher\u3002\u7136\u540E\u7684\u4E00\u4E2A\u6838\u5FC3\u5C31\u662F processLoop() \u51FD\u6570\u7684\u5B9E\u73B0\uFF1A</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token comment">// k8s.io/client-go/tools/cache/controller.go</span>
<span class="token comment">// Run begins processing items, and will continue until a value is sent down stopCh or it is closed.</span>
<span class="token comment">// It&#39;s an error to call Run more than once.</span>
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

<span class="token comment">// \u5904\u7406\u961F\u5217\u5F39\u51FA\u7684\u5BF9\u8C61</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>controller<span class="token punctuation">)</span> <span class="token function">processLoop</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u6B7B\u5FAA\u73AF\uFF0C\u4E0D\u65AD\u4ECE\u961F\u5217\u4E2D\u5F39\u51FA\u5BF9\u8C61\u6765\u5904\u7406</span>
	<span class="token keyword">for</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u4ECE\u961F\u5217\u4E2D\u5F39\u51FA\u4E00\u4E2A\u5BF9\u8C61\uFF0C\u7136\u540E\u5904\u7406\u8FD9\u4E2A\u5BF9\u8C61</span>
    <span class="token comment">// \u771F\u6B63\u5904\u7406\u7684\u662F\u901A\u8FC7 Config \u4F20\u9012\u8FDB\u6765\u7684 Process \u51FD\u6570</span>
		obj<span class="token punctuation">,</span> err <span class="token operator">:=</span> c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>Queue<span class="token punctuation">.</span><span class="token function">Pop</span><span class="token punctuation">(</span><span class="token function">PopProcessFunc</span><span class="token punctuation">(</span>c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>Process<span class="token punctuation">)</span><span class="token punctuation">)</span>
		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
      <span class="token comment">// \u5982\u679C\u961F\u5217\u5173\u95ED\u4E86\u90A3\u5C31\u76F4\u63A5\u9000\u51FA\u4E86</span>
			<span class="token keyword">if</span> err <span class="token operator">==</span> ErrFIFOClosed <span class="token punctuation">{</span>
				<span class="token keyword">return</span>
			<span class="token punctuation">}</span>
      <span class="token comment">// \u5982\u679C\u914D\u7F6E\u7684\u662F\u9519\u8BEF\u540E\u5141\u8BB8\u91CD\u8BD5</span>
			<span class="token keyword">if</span> c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>RetryOnError <span class="token punctuation">{</span>
				<span class="token comment">// \u5982\u679C\u9519\u8BEF\u53EF\u4EE5\u518D\u91CD\u8BD5\u90A3\u4E48\u5C06\u5F39\u51FA\u7684\u5BF9\u8C61\u91CD\u65B0\u5165\u961F\u5217\u8FDB\u884C\u5904\u7406</span>
				c<span class="token punctuation">.</span>config<span class="token punctuation">.</span>Queue<span class="token punctuation">.</span><span class="token function">AddIfNotPresent</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br></div></div><h3 id="sharedindexinformer-1" tabindex="-1"><a class="header-anchor" href="#sharedindexinformer-1" aria-hidden="true">#</a> sharedIndexInformer</h3><p>sharedIndexInformer \u901A\u8FC7 Run() \u51FD\u6570\u542F\u52A8\u4E86 Controller \u548C sharedProcess\uFF0CController \u901A\u8FC7 DeltaFIFO \u7684 Pop \u51FD\u6570\u5F39\u51FA Deltas \u5BF9\u8C61\uFF0C\u5E76\u4F7F\u7528 HandleDeltas \u51FD\u6570\u6765\u5904\u7406\u8FD9\u4E2A\u5BF9\u8C61\uFF0C\u8FD9\u4E2A\u51FD\u6570\u628A Deltas \u8F6C\u6362\u4E3A sharedProcess \u9700\u8981\u7684\u5404\u79CDNotification \u7C7B\u578B\u3002</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token comment">// k8s.io/client-go/tools/cache/shared_informer.go</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>sharedIndexInformer<span class="token punctuation">)</span> <span class="token function">Run</span><span class="token punctuation">(</span>stopCh <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">defer</span> utilruntime<span class="token punctuation">.</span><span class="token function">HandleCrash</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token comment">// \u65B0\u5EFA\u4E00\u4E2A DeltaFIFO</span>
	fifo <span class="token operator">:=</span> <span class="token function">NewDeltaFIFOWithOptions</span><span class="token punctuation">(</span>DeltaFIFOOptions<span class="token punctuation">{</span>
		KnownObjects<span class="token punctuation">:</span>          s<span class="token punctuation">.</span>indexer<span class="token punctuation">,</span>
		EmitDeltaTypeReplaced<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token comment">// \u7528\u4E8E\u6784\u9020 Controller \u7684\u914D\u7F6E</span>
	cfg <span class="token operator">:=</span> <span class="token operator">&amp;</span>Config<span class="token punctuation">{</span>
		Queue<span class="token punctuation">:</span>            fifo<span class="token punctuation">,</span>  
		ListerWatcher<span class="token punctuation">:</span>    s<span class="token punctuation">.</span>listerWatcher<span class="token punctuation">,</span>
		ObjectType<span class="token punctuation">:</span>       s<span class="token punctuation">.</span>objectType<span class="token punctuation">,</span>
		FullResyncPeriod<span class="token punctuation">:</span> s<span class="token punctuation">.</span>resyncCheckPeriod<span class="token punctuation">,</span>
		RetryOnError<span class="token punctuation">:</span>     <span class="token boolean">false</span><span class="token punctuation">,</span>
		ShouldResync<span class="token punctuation">:</span>     s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span>shouldResync<span class="token punctuation">,</span>
    <span class="token comment">// Controller \u8C03\u7528 DeltaFIFO \u7684 Pop \u51FD\u6570\u4F20\u5165\u8FD9\u4E2A\u56DE\u8C03\u51FD\u6570\u6765\u5904\u7406\u5F39\u51FA\u7684\u5BF9\u8C61</span>
		Process<span class="token punctuation">:</span> s<span class="token punctuation">.</span>HandleDeltas<span class="token punctuation">,</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">defer</span> s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token comment">// \u65B0\u5EFA\u4E00\u4E2A Controller \u5E76\u6807\u8BB0\u4E3A\u5DF2\u7ECF\u542F\u52A8</span>
		s<span class="token punctuation">.</span>controller <span class="token operator">=</span> <span class="token function">New</span><span class="token punctuation">(</span>cfg<span class="token punctuation">)</span>
		s<span class="token punctuation">.</span>controller<span class="token punctuation">.</span><span class="token punctuation">(</span><span class="token operator">*</span>controller<span class="token punctuation">)</span><span class="token punctuation">.</span>clock <span class="token operator">=</span> s<span class="token punctuation">.</span>clock
		s<span class="token punctuation">.</span>started <span class="token operator">=</span> <span class="token boolean">true</span>
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	processorStopCh <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
	<span class="token keyword">var</span> wg wait<span class="token punctuation">.</span>Group
	<span class="token keyword">defer</span> wg<span class="token punctuation">.</span><span class="token function">Wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span>              <span class="token comment">// \u7B49\u5F85\u5904\u7406\u5668\u505C\u6B62</span>
	<span class="token keyword">defer</span> <span class="token function">close</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">)</span> <span class="token comment">// \u901A\u77E5\u5904\u7406\u5668\u505C\u6B62</span>
  <span class="token comment">// \u542F\u52A8\u4E24\u4E2A\u534F\u7A0B</span>
	wg<span class="token punctuation">.</span><span class="token function">StartWithChannel</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">,</span> s<span class="token punctuation">.</span>cacheMutationDetector<span class="token punctuation">.</span>Run<span class="token punctuation">)</span>
	wg<span class="token punctuation">.</span><span class="token function">StartWithChannel</span><span class="token punctuation">(</span>processorStopCh<span class="token punctuation">,</span> s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span>run<span class="token punctuation">)</span>

	<span class="token keyword">defer</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">defer</span> s<span class="token punctuation">.</span>startedLock<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token comment">// \u6807\u8BB0\u4E3A\u5DF2\u505C\u6B62</span>
		s<span class="token punctuation">.</span>stopped <span class="token operator">=</span> <span class="token boolean">true</span> 
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token comment">// \u542F\u52A8 Controller</span>
	s<span class="token punctuation">.</span>controller<span class="token punctuation">.</span><span class="token function">Run</span><span class="token punctuation">(</span>stopCh<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br></div></div><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token comment">// k8s.io/client-go/tools/cache/shared_informer.go</span>

<span class="token comment">// DeltaFIFO \u7684\u5BF9\u8C61\u88AB Pop \u540E\u7684\u5904\u7406\u51FD\u6570</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>sharedIndexInformer<span class="token punctuation">)</span> <span class="token function">HandleDeltas</span><span class="token punctuation">(</span>obj <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	s<span class="token punctuation">.</span>blockDeltas<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">defer</span> s<span class="token punctuation">.</span>blockDeltas<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token comment">// \u56E0\u4E3A Deltas \u662F Delta \u5217\u8868\uFF0C\u91CC\u9762\u5305\u542B\u4E00\u4E2A\u5BF9\u8C61\u7684\u591A\u4E2A\u64CD\u4F5C</span>
  <span class="token comment">// \u6240\u4EE5\u8981\u4ECE\u6700\u8001\u7684 Delta \u5230\u6700\u65B0\u7684 Delta \u904D\u5386\u5904\u7406</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> d <span class="token operator">:=</span> <span class="token keyword">range</span> obj<span class="token punctuation">.</span><span class="token punctuation">(</span>Deltas<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">switch</span> d<span class="token punctuation">.</span>Type <span class="token punctuation">{</span> <span class="token comment">// \u6839\u636E\u5BF9\u8C61\u64CD\u4F5C\u7C7B\u578B\u8FDB\u884C\u5904\u7406</span>
    <span class="token comment">// \u540C\u6B65\u3001\u66FF\u6362\u3001\u6DFB\u52A0\u3001\u66F4\u65B0\u7C7B\u578B</span>
		<span class="token keyword">case</span> Sync<span class="token punctuation">,</span> Replaced<span class="token punctuation">,</span> Added<span class="token punctuation">,</span> Updated<span class="token punctuation">:</span>
			s<span class="token punctuation">.</span>cacheMutationDetector<span class="token punctuation">.</span><span class="token function">AddObject</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span>
      <span class="token comment">// \u5982\u679C indexer \u4E2D\u6709\u8FD9\u4E2A\u5BF9\u8C61\uFF0C\u5219\u5F53\u6210\u66F4\u65B0\u4E8B\u4EF6\u8FDB\u884C\u5904\u7406</span>
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
        <span class="token comment">// \u901A\u77E5\u5904\u7406\u5668\u5904\u7406\u4E8B\u4EF6</span>
				s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span><span class="token function">distribute</span><span class="token punctuation">(</span>updateNotification<span class="token punctuation">{</span>oldObj<span class="token punctuation">:</span> old<span class="token punctuation">,</span> newObj<span class="token punctuation">:</span> d<span class="token punctuation">.</span>Object<span class="token punctuation">}</span><span class="token punctuation">,</span> isSync<span class="token punctuation">)</span>
			<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// \u5C06\u5BF9\u8C61\u6DFB\u52A0\u5230 indexer \u5B58\u50A8\u4E2D</span>
				<span class="token keyword">if</span> err <span class="token operator">:=</span> s<span class="token punctuation">.</span>indexer<span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
					<span class="token keyword">return</span> err
				<span class="token punctuation">}</span>
        <span class="token comment">// \u7136\u540E\u901A\u77E5\u5904\u7406\u5668\u5904\u7406\u4E8B\u4EF6</span>
				s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span><span class="token function">distribute</span><span class="token punctuation">(</span>addNotification<span class="token punctuation">{</span>newObj<span class="token punctuation">:</span> d<span class="token punctuation">.</span>Object<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
			<span class="token punctuation">}</span>
    <span class="token comment">// \u5220\u9664\u7C7B\u578B</span>
		<span class="token keyword">case</span> Deleted<span class="token punctuation">:</span>
      <span class="token comment">// \u4ECE indexer \u4E2D\u5220\u9664\u5BF9\u8C61</span>
			<span class="token keyword">if</span> err <span class="token operator">:=</span> s<span class="token punctuation">.</span>indexer<span class="token punctuation">.</span><span class="token function">Delete</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Object<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
				<span class="token keyword">return</span> err
			<span class="token punctuation">}</span>
      <span class="token comment">// \u901A\u77E5\u6240\u6709\u7684\u5904\u7406\u5668\u5BF9\u8C61\u88AB\u5220\u9664\u4E86</span>
			s<span class="token punctuation">.</span>processor<span class="token punctuation">.</span><span class="token function">distribute</span><span class="token punctuation">(</span>deleteNotification<span class="token punctuation">{</span>oldObj<span class="token punctuation">:</span> d<span class="token punctuation">.</span>Object<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br></div></div>`,15);function t(e,o){return p}var l=n(a,[["render",t]]);export{l as default};
