<template><h1 id="go原理相关" tabindex="-1"><a class="header-anchor" href="#go原理相关" aria-hidden="true">#</a> go原理相关</h1>
<h1 id="一-堆内存模型" tabindex="-1"><a class="header-anchor" href="#一-堆内存模型" aria-hidden="true">#</a> 一 堆内存模型</h1>
<h2 id="基于-tcmalloc" tabindex="-1"><a class="header-anchor" href="#基于-tcmalloc" aria-hidden="true">#</a> 基于 TCMalloc</h2>
<h4 id="多级缓存" tabindex="-1"><a class="header-anchor" href="#多级缓存" aria-hidden="true">#</a> 多级缓存 <a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#%E5%A4%9A%E7%BA%A7%E7%BC%93%E5%AD%98" target="_blank" rel="noopener noreferrer">#<ExternalLinkIcon/></a></h4>
<p>内存分配器不仅会区别对待大小不同的对象，还会将内存分成不同的级别分别管理，TCMalloc 和 Go 运行时分配器都会引入线程缓存（Thread Cache）、中心缓存（Central Cache）和页堆（Page Heap）三个组件分级管理内存：</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066457-multi-level-cache.png" alt="multi-level-cache" loading="lazy"></p>
<p><strong>图 7-6 多级缓存内存分配</strong></p>
<p>线程缓存属于每一个独立的线程，它能够满足线程上绝大多数的内存分配需求，因为不涉及多线程，所以也不需要使用互斥锁来保护内存，这能够减少锁竞争带来的性能损耗。当线程缓存不能满足需求时，<em><strong>运行时会使用中心缓存作为补充解决小对象的内存分配，在遇到 32KB 以上的对象时，内存分配器会选择页堆直接分配大内存。</strong></em></p>
<p>这种多层级的内存分配设计与计算机操作系统中的多级缓存有些类似，因为多数的对象都是小对象，我们可以通过线程缓存和中心缓存提供足够的内存空间，发现资源不足时从上一级组件中获取更多的内存资源。</p>
<h4 id="堆区的线性结构-v1-10前" tabindex="-1"><a class="header-anchor" href="#堆区的线性结构-v1-10前" aria-hidden="true">#</a> 堆区的线性结构 v1.10前</h4>
<p><img src="https://img.draveness.me/2020-10-19-16031147347484/heap-before-go-1-10.png" alt="heap-before-go-1-10" loading="lazy"></p>
<ul>
<li><code>spans</code> 区域存储了指向内存管理单元 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a> 的指针，每个内存单元会管理几页的内存空间，每页大小为 8KB；</li>
<li><code>bitmap</code> 用于标识 <code>arena</code> 区域中的那些地址保存了对象，位图中的每个字节都会表示堆区中的 32 字节是否包含空闲；</li>
<li><code>arena</code> 区域是真正的堆区，运行时会将 8KB 看做一页，这些内存页中存储了所有在堆上初始化的对象；</li>
</ul>
<p>对于任意一个地址，我们都可以根据 <code>arena</code> 的基地址计算该地址所在的页数并通过 <code>spans</code> 数组获得管理该片内存的管理单元 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a>，<code>spans</code> 数组中多个连续的位置可能对应同一个 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a> 结构。</p>
<p>Go 语言在垃圾回收时会根据指针的地址判断对象是否在堆中，并通过上一段中介绍的过程找到管理该对象的 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a>。这些都建立在<strong>堆区的内存是连续的</strong>这一假设上。这种设计虽然简单并且方便，但是在 C 和 Go 混合使用时会导致程序崩溃：</p>
<ol>
<li>分配的内存地址会发生冲突，导致堆的初始化和扩容失败<a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#fn:3" target="_blank" rel="noopener noreferrer">3<ExternalLinkIcon/></a>；</li>
<li>没有被预留的大块内存可能会被分配给 C 语言的二进制，导致扩容后的堆不连续<a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#fn:4" target="_blank" rel="noopener noreferrer">4<ExternalLinkIcon/></a>；</li>
</ol>
<p>线性的堆内存需要预留大块的内存空间，但是申请大块的内存空间而不使用是不切实际的，不预留内存空间却会在特殊场景下造成程序崩溃。虽然连续内存的实现比较简单，但是这些问题也没有办法忽略。</p>
<h4 id="堆的稀疏内存-v1-11" tabindex="-1"><a class="header-anchor" href="#堆的稀疏内存-v1-11" aria-hidden="true">#</a> 堆的稀疏内存 v1.11</h4>
<p>稀疏内存是 Go 语言在 1.11 中提出的方案，使用稀疏的内存布局不仅能移除堆大小的上限<a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#fn:5" target="_blank" rel="noopener noreferrer">5<ExternalLinkIcon/></a>，还能解决 C 和 Go 混合使用时的地址空间冲突问题<a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#fn:6" target="_blank" rel="noopener noreferrer">6<ExternalLinkIcon/></a>。不过因为基于稀疏内存的内存管理失去了内存的连续性这一假设，这也使内存管理变得更加复杂：</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066468-heap-after-go-1-11.png" alt="heap-after-go-1-11" loading="lazy"></p>
<p><strong>图 7-8 二维稀疏内存</strong></p>
<p>如上图所示，运行时使用二维的 <a href="https://draveness.me/golang/tree/runtime.heapArena" target="_blank" rel="noopener noreferrer"><code>runtime.heapArena</code><ExternalLinkIcon/></a> 数组管理所有的内存，每个单元都会管理 64MB 的内存空间：</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> heapArena <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	bitmap       <span class="token punctuation">[</span>heapArenaBitmapBytes<span class="token punctuation">]</span><span class="token builtin">byte</span>
	spans        <span class="token punctuation">[</span>pagesPerArena<span class="token punctuation">]</span><span class="token operator">*</span>mspan
	pageInUse    <span class="token punctuation">[</span>pagesPerArena <span class="token operator">/</span> <span class="token number">8</span><span class="token punctuation">]</span><span class="token builtin">uint8</span>
	pageMarks    <span class="token punctuation">[</span>pagesPerArena <span class="token operator">/</span> <span class="token number">8</span><span class="token punctuation">]</span><span class="token builtin">uint8</span>
	pageSpecials <span class="token punctuation">[</span>pagesPerArena <span class="token operator">/</span> <span class="token number">8</span><span class="token punctuation">]</span><span class="token builtin">uint8</span>
	checkmarks   <span class="token operator">*</span>checkmarksMap
	zeroedBase   <span class="token builtin">uintptr</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>Go</p>
<p>该结构体中的 <code>bitmap</code> 和 <code>spans</code> 与线性内存中的 <code>bitmap</code> 和 <code>spans</code> 区域一一对应，<code>zeroedBase</code> 字段指向了该结构体管理的内存的基地址。上述设计将原有的连续大内存切分成稀疏的小内存，而用于管理这些内存的元信息也被切成了小块。</p>
<p>不同平台和架构的二维数组大小可能完全不同，如果我们的 Go 语言服务在 Linux 的 x86-64 架构上运行，二维数组的一维大小会是 1，而二维大小是 4,194,304，因为每一个指针占用 8 字节的内存空间，所以元信息的总大小为 32MB。由于每个 <a href="https://draveness.me/golang/tree/runtime.heapArena" target="_blank" rel="noopener noreferrer"><code>runtime.heapArena</code><ExternalLinkIcon/></a> 都会管理 64MB 的内存，整个堆区最多可以管理 256TB 的内存，这比之前的 512GB 多好几个数量级。</p>
<h4 id="内存管理组件" tabindex="-1"><a class="header-anchor" href="#内存管理组件" aria-hidden="true">#</a> 内存管理组件</h4>
<p>Go 语言的内存分配器包含内存管理单元、线程缓存、中心缓存和页堆几个重要组件，本节将介绍这几种最重要组件对应的数据结构 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a>、<a href="https://draveness.me/golang/tree/runtime.mcache" target="_blank" rel="noopener noreferrer"><code>runtime.mcache</code><ExternalLinkIcon/></a>、<a href="https://draveness.me/golang/tree/runtime.mcentral" target="_blank" rel="noopener noreferrer"><code>runtime.mcentral</code><ExternalLinkIcon/></a> 和 <a href="https://draveness.me/golang/tree/runtime.mheap" target="_blank" rel="noopener noreferrer"><code>runtime.mheap</code><ExternalLinkIcon/></a>，我们会详细介绍它们在内存分配器中的作用以及实现。</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066479-go-memory-layout.png" alt="go-memory-layout" loading="lazy"></p>
<p>所有的 Go 语言程序都会在启动时初始化如上图所示的内存布局，每一个处理器都会分配一个线程缓存 <a href="https://draveness.me/golang/tree/runtime.mcache" target="_blank" rel="noopener noreferrer"><code>runtime.mcache</code><ExternalLinkIcon/></a> 用于处理微对象和小对象的分配，它们会持有内存管理单元 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a>。</p>
<p>每个类型的内存管理单元都会管理特定大小的对象，当内存管理单元中不存在空闲对象时，它们会从 <a href="https://draveness.me/golang/tree/runtime.mheap" target="_blank" rel="noopener noreferrer"><code>runtime.mheap</code><ExternalLinkIcon/></a> 持有的 134 个中心缓存 <a href="https://draveness.me/golang/tree/runtime.mcentral" target="_blank" rel="noopener noreferrer"><code>runtime.mcentral</code><ExternalLinkIcon/></a> 中获取新的内存单元，中心缓存属于全局的堆结构体 <a href="https://draveness.me/golang/tree/runtime.mheap" target="_blank" rel="noopener noreferrer"><code>runtime.mheap</code><ExternalLinkIcon/></a>，它会从操作系统中申请内存。</p>
<p>在 amd64 的 Linux 操作系统上，<a href="https://draveness.me/golang/tree/runtime.mheap" target="_blank" rel="noopener noreferrer"><code>runtime.mheap</code><ExternalLinkIcon/></a> 会持有 4,194,304 <a href="https://draveness.me/golang/tree/runtime.heapArena" target="_blank" rel="noopener noreferrer"><code>runtime.heapArena</code><ExternalLinkIcon/></a>，每个 <a href="https://draveness.me/golang/tree/runtime.heapArena" target="_blank" rel="noopener noreferrer"><code>runtime.heapArena</code><ExternalLinkIcon/></a> 都会管理 64MB 的内存，单个 Go 语言程序的内存上限也就是 256TB。</p>
<p><a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a> 会以两种不同的视角看待管理的内存，当结构体管理的内存不足时，运行时会以页为单位向堆申请内存：</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066492-mspan-and-pages.png" alt="mspan-and-pages" loading="lazy"></p>
<p><strong>图 7-12 内存管理单元与页</strong></p>
<p>当用户程序或者线程向 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a> 申请内存时，它会使用 <code>allocCache</code> 字段以对象为单位在管理的内存中快速查找待分配的空间：</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066499-mspan-and-objects.png" alt="mspan-and-objects" loading="lazy"></p>
<h5 id="线程缓存" tabindex="-1"><a class="header-anchor" href="#线程缓存" aria-hidden="true">#</a> 线程缓存 <a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#%E7%BA%BF%E7%A8%8B%E7%BC%93%E5%AD%98" target="_blank" rel="noopener noreferrer">#<ExternalLinkIcon/></a></h5>
<p><a href="https://draveness.me/golang/tree/runtime.mcache" target="_blank" rel="noopener noreferrer"><code>runtime.mcache</code><ExternalLinkIcon/></a> 是 Go 语言中的线程缓存，它会与线程上的处理器一一绑定，主要用来缓存用户程序申请的微小对象。每一个线程缓存都持有 68 * 2 个 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a>，这些内存管理单元都存储在结构体的 <code>alloc</code> 字段中：</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066512-mcache-and-mspans.png" alt="mcache-and-mspans" loading="lazy"></p>
<h5 id="中心缓存" tabindex="-1"><a class="header-anchor" href="#中心缓存" aria-hidden="true">#</a> 中心缓存 <a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#%E4%B8%AD%E5%BF%83%E7%BC%93%E5%AD%98" target="_blank" rel="noopener noreferrer">#<ExternalLinkIcon/></a></h5>
<p><a href="https://draveness.me/golang/tree/runtime.mcentral" target="_blank" rel="noopener noreferrer"><code>runtime.mcentral</code><ExternalLinkIcon/></a> 是内存分配器的中心缓存，与线程缓存不同，访问中心缓存中的内存管理单元需要使用互斥锁：</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> mcentral <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	spanclass spanClass
	partial  <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span>spanSet
	full     <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span>spanSet
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>Go</p>
<p>每个中心缓存都会管理某个跨度类的内存管理单元，它会同时持有两个 <a href="https://draveness.me/golang/tree/runtime.spanSet" target="_blank" rel="noopener noreferrer"><code>runtime.spanSet</code><ExternalLinkIcon/></a>，分别存储包含空闲对象和不包含空闲对象的内存管理单元。</p>
<h5 id="页堆" tabindex="-1"><a class="header-anchor" href="#页堆" aria-hidden="true">#</a> 页堆 <a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#%E9%A1%B5%E5%A0%86" target="_blank" rel="noopener noreferrer">#<ExternalLinkIcon/></a></h5>
<p><a href="https://draveness.me/golang/tree/runtime.mheap" target="_blank" rel="noopener noreferrer"><code>runtime.mheap</code><ExternalLinkIcon/></a> 是内存分配的核心结构体，Go 语言程序会将其作为全局变量存储，而堆上初始化的所有对象都由该结构体统一管理，该结构体中包含两组非常重要的字段，其中一个是全局的中心缓存列表 <code>central</code>，另一个是管理堆区内存区域的 <code>arenas</code> 以及相关字段。</p>
<p>页堆中包含一个长度为 136 的 <a href="https://draveness.me/golang/tree/runtime.mcentral" target="_blank" rel="noopener noreferrer"><code>runtime.mcentral</code><ExternalLinkIcon/></a> 数组，其中 68 个为跨度类需要 <code>scan</code> 的中心缓存，另外的 68 个是 <code>noscan</code> 的中心缓存：</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066525-mheap-and-mcentrals.png" alt="mheap-and-mcentrals" loading="lazy"></p>
<p><strong>图 7-17 页堆与中心缓存列表</strong></p>
<p>我们在设计原理一节中已经介绍过 Go 语言所有的内存空间都由如下所示的二维矩阵 <a href="https://draveness.me/golang/tree/runtime.heapArena" target="_blank" rel="noopener noreferrer"><code>runtime.heapArena</code><ExternalLinkIcon/></a> 管理，这个二维矩阵管理的内存可以是不连续的：</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066531-mheap-and-memories.png" alt="mheap-and-memories" loading="lazy"></p>
<p><strong>图 7-18 页堆管理的内存区域</strong></p>
<h4 id="内存分配" tabindex="-1"><a class="header-anchor" href="#内存分配" aria-hidden="true">#</a> 内存分配 <a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#713-%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D" target="_blank" rel="noopener noreferrer">#<ExternalLinkIcon/></a></h4>
<p>堆上所有的对象都会通过调用 <a href="https://draveness.me/golang/tree/runtime.newobject" target="_blank" rel="noopener noreferrer"><code>runtime.newobject</code><ExternalLinkIcon/></a> 函数分配内存，该函数会调用 <a href="https://draveness.me/golang/tree/runtime.mallocgc" target="_blank" rel="noopener noreferrer"><code>runtime.mallocgc</code><ExternalLinkIcon/></a> 分配指定大小的内存空间，这也是用户程序向堆上申请内存空间的必经函数：</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">mallocgc</span><span class="token punctuation">(</span>size <span class="token builtin">uintptr</span><span class="token punctuation">,</span> typ <span class="token operator">*</span>_type<span class="token punctuation">,</span> needzero <span class="token builtin">bool</span><span class="token punctuation">)</span> unsafe<span class="token punctuation">.</span>Pointer <span class="token punctuation">{</span>
	mp <span class="token operator">:=</span> <span class="token function">acquirem</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	mp<span class="token punctuation">.</span>mallocing <span class="token operator">=</span> <span class="token number">1</span>

	c <span class="token operator">:=</span> <span class="token function">gomcache</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">var</span> x unsafe<span class="token punctuation">.</span>Pointer
	noscan <span class="token operator">:=</span> typ <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token operator">||</span> typ<span class="token punctuation">.</span>ptrdata <span class="token operator">==</span> <span class="token number">0</span>
	<span class="token keyword">if</span> size <span class="token operator">&lt;=</span> maxSmallSize <span class="token punctuation">{</span>
		<span class="token keyword">if</span> noscan <span class="token operator">&amp;&amp;</span> size <span class="token operator">&lt;</span> maxTinySize <span class="token punctuation">{</span>
			<span class="token comment">// 微对象分配</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
			<span class="token comment">// 小对象分配</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
		<span class="token comment">// 大对象分配</span>
	<span class="token punctuation">}</span>

	<span class="token function">publicationBarrier</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	mp<span class="token punctuation">.</span>mallocing <span class="token operator">=</span> <span class="token number">0</span>
	<span class="token function">releasem</span><span class="token punctuation">(</span>mp<span class="token punctuation">)</span>

	<span class="token keyword">return</span> x
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>Go</p>
<p>上述代码使用 <a href="https://draveness.me/golang/tree/runtime.gomcache" target="_blank" rel="noopener noreferrer"><code>runtime.gomcache</code><ExternalLinkIcon/></a> 获取线程缓存并判断申请内存的类型是否为指针。我们从这个代码片段可以看出 <a href="https://draveness.me/golang/tree/runtime.mallocgc" target="_blank" rel="noopener noreferrer"><code>runtime.mallocgc</code><ExternalLinkIcon/></a> 会根据对象的大小执行不同的分配逻辑，在前面的章节也曾经介绍过运行时根据对象大小将它们分成微对象、小对象和大对象，这里会根据大小选择不同的分配逻辑：</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066537-allocator-and-memory-size.png" alt="allocator-and-memory-size" loading="lazy"></p>
<p><strong>图 7-19 三种对象</strong></p>
<ul>
<li>微对象 <code>(0, 16B)</code> — 先使用微型分配器，再依次尝试线程缓存、中心缓存和堆分配内存；</li>
<li>小对象 <code>[16B, 32KB]</code> — 依次尝试使用线程缓存、中心缓存和堆分配内存；</li>
<li>大对象 <code>(32KB, +∞)</code> — 直接在堆上分配内存；</li>
</ul>
<p>我们会依次介绍运行时分配微对象、小对象和大对象的过程，梳理内存分配的核心执行流程。</p>
<h5 id="微对象" tabindex="-1"><a class="header-anchor" href="#微对象" aria-hidden="true">#</a> 微对象 <a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#%E5%BE%AE%E5%AF%B9%E8%B1%A1" target="_blank" rel="noopener noreferrer">#<ExternalLinkIcon/></a></h5>
<p>Go 语言运行时将小于 16 字节的对象划分为微对象，它会使用线程缓存上的微分配器提高微对象分配的性能，我们主要使用它来分配较小的字符串以及逃逸的临时变量。微分配器可以将多个较小的内存分配请求合入同一个内存块中，只有当内存块中的所有对象都需要被回收时，整片内存才可能被回收。</p>
<p>微分配器管理的对象不可以是指针类型，管理多个对象的内存块大小 <code>maxTinySize</code> 是可以调整的，在默认情况下，内存块的大小为 16 字节。<code>maxTinySize</code> 的值越大，组合多个对象的可能性就越高，内存浪费也就越严重；<code>maxTinySize</code> 越小，内存浪费就会越少，不过无论如何调整，8 的倍数都是一个很好的选择。</p>
<p><img src="https://img.draveness.me/2020-02-29-15829868066543-tiny-allocator.png" alt="tiny-allocator" loading="lazy"></p>
<p>如上图所示，微分配器已经在 16 字节的内存块中分配了 12 字节的对象，如果下一个待分配的对象小于 4 字节，它会直接使用上述内存块的剩余部分，减少内存碎片，不过该内存块只有所有对象都被标记为垃圾时才会回收。</p>
<p>当内存块中不包含空闲的内存时，下面的这段代码会先从线程缓存找到跨度类对应的内存管理单元 <a href="https://draveness.me/golang/tree/runtime.mspan" target="_blank" rel="noopener noreferrer"><code>runtime.mspan</code><ExternalLinkIcon/></a>，调用 <a href="https://draveness.me/golang/tree/runtime.nextFreeFast" target="_blank" rel="noopener noreferrer"><code>runtime.nextFreeFast</code><ExternalLinkIcon/></a> 获取空闲的内存；当不存在空闲内存时，我们会调用 <a href="https://draveness.me/golang/tree/runtime.mcache.nextFree" target="_blank" rel="noopener noreferrer"><code>runtime.mcache.nextFree</code><ExternalLinkIcon/></a> 从中心缓存或者页堆中获取可分配的内存块：</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">mallocgc</span><span class="token punctuation">(</span>size <span class="token builtin">uintptr</span><span class="token punctuation">,</span> typ <span class="token operator">*</span>_type<span class="token punctuation">,</span> needzero <span class="token builtin">bool</span><span class="token punctuation">)</span> unsafe<span class="token punctuation">.</span>Pointer <span class="token punctuation">{</span>
	<span class="token operator">...</span>
	<span class="token keyword">if</span> size <span class="token operator">&lt;=</span> maxSmallSize <span class="token punctuation">{</span>
		<span class="token keyword">if</span> noscan <span class="token operator">&amp;&amp;</span> size <span class="token operator">&lt;</span> maxTinySize <span class="token punctuation">{</span>
			<span class="token operator">...</span>
			span <span class="token operator">:=</span> c<span class="token punctuation">.</span>alloc<span class="token punctuation">[</span>tinySpanClass<span class="token punctuation">]</span>
			v <span class="token operator">:=</span> <span class="token function">nextFreeFast</span><span class="token punctuation">(</span>span<span class="token punctuation">)</span>
			<span class="token keyword">if</span> v <span class="token operator">==</span> <span class="token number">0</span> <span class="token punctuation">{</span>
				v<span class="token punctuation">,</span> <span class="token boolean">_</span><span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">=</span> c<span class="token punctuation">.</span><span class="token function">nextFree</span><span class="token punctuation">(</span>tinySpanClass<span class="token punctuation">)</span>
			<span class="token punctuation">}</span>
			x <span class="token operator">=</span> unsafe<span class="token punctuation">.</span><span class="token function">Pointer</span><span class="token punctuation">(</span>v<span class="token punctuation">)</span>
			<span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token builtin">uint64</span><span class="token punctuation">)</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>
			<span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token builtin">uint64</span><span class="token punctuation">)</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>
			<span class="token keyword">if</span> size <span class="token operator">&lt;</span> c<span class="token punctuation">.</span>tinyoffset <span class="token operator">||</span> c<span class="token punctuation">.</span>tiny <span class="token operator">==</span> <span class="token number">0</span> <span class="token punctuation">{</span>
				c<span class="token punctuation">.</span>tiny <span class="token operator">=</span> <span class="token function">uintptr</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
				c<span class="token punctuation">.</span>tinyoffset <span class="token operator">=</span> size
			<span class="token punctuation">}</span>
			size <span class="token operator">=</span> maxTinySize
		<span class="token punctuation">}</span>
		<span class="token operator">...</span>
	<span class="token punctuation">}</span>
	<span class="token operator">...</span>
	<span class="token keyword">return</span> x
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><h5 id="小对象" tabindex="-1"><a class="header-anchor" href="#小对象" aria-hidden="true">#</a> 小对象 <a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#%E5%B0%8F%E5%AF%B9%E8%B1%A1" target="_blank" rel="noopener noreferrer">#<ExternalLinkIcon/></a></h5>
<p>小对象是指大小为 16 字节到 32,768 字节的对象以及所有小于 16 字节的指针类型的对象，小对象的分配可以被分成以下的三个步骤：</p>
<ol>
<li>确定分配对象的大小以及跨度类 <a href="https://draveness.me/golang/tree/runtime.spanClass" target="_blank" rel="noopener noreferrer"><code>runtime.spanClass</code><ExternalLinkIcon/></a>；</li>
<li>从线程缓存、中心缓存或者堆中获取内存管理单元并从内存管理单元找到空闲的内存空间；</li>
<li>调用 <a href="https://draveness.me/golang/tree/runtime.memclrNoHeapPointers" target="_blank" rel="noopener noreferrer"><code>runtime.memclrNoHeapPointers</code><ExternalLinkIcon/></a> 清空空闲内存中的所有数据；</li>
</ol>
<p>确定待分配的对象大小以及跨度类需要使用预先计算好的 <code>size_to_class8</code>、<code>size_to_class128</code> 以及 <code>class_to_size</code> 字典，这些字典能够帮助我们快速获取对应的值并构建 <a href="https://draveness.me/golang/tree/runtime.spanClass" target="_blank" rel="noopener noreferrer"><code>runtime.spanClass</code><ExternalLinkIcon/></a>：</p>
<h5 id="大对象" tabindex="-1"><a class="header-anchor" href="#大对象" aria-hidden="true">#</a> 大对象 <a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/#%E5%A4%A7%E5%AF%B9%E8%B1%A1" target="_blank" rel="noopener noreferrer">#<ExternalLinkIcon/></a></h5>
<p>运行时对于大于 32KB 的大对象会单独处理，我们不会从线程缓存或者中心缓存中获取内存管理单元，而是直接调用 <a href="https://draveness.me/golang/tree/runtime.mcache.allocLarge" target="_blank" rel="noopener noreferrer"><code>runtime.mcache.allocLarge</code><ExternalLinkIcon/></a> 分配大片内存：</p>
<h1 id="二-gc-模型" tabindex="-1"><a class="header-anchor" href="#二-gc-模型" aria-hidden="true">#</a> 二 gc 模型</h1>
<h2 id="三色标记" tabindex="-1"><a class="header-anchor" href="#三色标记" aria-hidden="true">#</a> 三色标记</h2>
<p>Go V1.5的三色并发标记法</p>
<p><strong>第一步</strong> , 就是只要是新创建的对象,默认的颜色都是标记为“白色”.</p>
<p><img src="https://static.sitestack.cn/projects/aceld-golang/images/46-GC4.png" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图7" loading="lazy"></p>
<p>这里面需要注意的是, 所谓“程序”, 则是一些对象的跟节点集合.</p>
<p><img src="https://static.sitestack.cn/projects/aceld-golang/images/47-GC5.jpeg" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图8" loading="lazy"></p>
<p>所以上图,可以转换如下的方式来表示.</p>
<p><strong>第二步</strong>, 每次GC回收开始, 然后从根节点开始遍历所有对象，把遍历到的对象从白色集合放入“灰色”集合。</p>
<p><img src="https://static.sitestack.cn/projects/aceld-golang/images/48-GC6.jpeg" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图9" loading="lazy"></p>
<p><strong>第三步</strong>, 遍历灰色集合，将灰色对象引用的对象从白色集合放入灰色集合，之后将此灰色对象放入黑色集合</p>
<p><img src="https://static.sitestack.cn/projects/aceld-golang/images/49-GC7.jpeg" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图10" loading="lazy"></p>
<p><strong>第四步</strong>, 重复<strong>第三步</strong>, 直到灰色中无任何对象. <img src="https://static.sitestack.cn/projects/aceld-golang/images/50-GC8.jpeg" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图11" loading="lazy"> <img src="https://static.sitestack.cn/projects/aceld-golang/images/51-GC9.jpeg" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图12" loading="lazy"></p>
<p><strong>第五步</strong>: 回收所有的白色标记表的对象. 也就是回收垃圾. <img src="https://static.sitestack.cn/projects/aceld-golang/images/52-GC10.jpeg" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图13" loading="lazy"></p>
<h2 id="屏障机制" tabindex="-1"><a class="header-anchor" href="#屏障机制" aria-hidden="true">#</a> 屏障机制</h2>
<h3 id="强三色不变式" tabindex="-1"><a class="header-anchor" href="#强三色不变式" aria-hidden="true">#</a> 强三色不变式</h3>
<p>不存在黑色对象引用到白色对象的指针。</p>
<p><img src="https://static.sitestack.cn/projects/aceld-golang/images/60-三色标记问题6.jpeg" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图19" loading="lazy"></p>
<h3 id="弱三色不变式" tabindex="-1"><a class="header-anchor" href="#弱三色不变式" aria-hidden="true">#</a> 弱三色不变式</h3>
<p>所有被黑色对象引用的白色对象都处于灰色保护状态.</p>
<p><img src="https://static.sitestack.cn/projects/aceld-golang/images/61-三色标记问题7.jpeg" alt="5、Golang三色标记+混合写屏障GC模式全分析 - 图20" loading="lazy"></p>
<h3 id="插入屏障-只对堆有效" tabindex="-1"><a class="header-anchor" href="#插入屏障-只对堆有效" aria-hidden="true">#</a> 插入屏障(只对堆有效)</h3>
<p><code>具体操作</code>: 在A对象引用B对象的时候，B对象被标记为灰色。(将B挂在A下游，B必须被标记为灰色)</p>
<p><code>满足</code>: <strong>强三色不变式</strong>. (不存在黑色对象引用白色对象的情况了， 因为白色会强制变成灰色)</p>
<p>1 当插入对象到黑色对象时将插入对象转为灰色。</p>
<p>2 重新扫描栈中的对象</p>
<h3 id="删除屏障-只对堆有效" tabindex="-1"><a class="header-anchor" href="#删除屏障-只对堆有效" aria-hidden="true">#</a> 删除屏障(只对堆有效)</h3>
<p><code>具体操作</code>: 被删除的对象，如果自身为灰色或者白色，那么被标记为灰色。</p>
<p><code>满足</code>: <strong>弱三色不变式</strong>. (保护灰色对象到白色对象的路径不会断)</p>
<p>1 删除自身为白色或者灰色，标记为灰色</p>
<p>2 第二次扫描再重新扫描这些对象</p>
<h2 id="混合写屏障" tabindex="-1"><a class="header-anchor" href="#混合写屏障" aria-hidden="true">#</a> 混合写屏障</h2>
<p>1、GC开始将栈上的对象全部扫描并标记为黑色(之后不再进行第二次重复扫描，无需STW)，</p>
<p>2、GC期间，任何在栈上创建的新对象，均为黑色。</p>
<p>3、被删除的对象标记为灰色。</p>
<p>4、被添加的对象标记为灰色。</p>
<p><code>满足</code>: 变形的<strong>弱三色不变式</strong>.</p>
<h1 id="三-栈内存模型" tabindex="-1"><a class="header-anchor" href="#三-栈内存模型" aria-hidden="true">#</a> 三 栈内存模型</h1>
<h2 id="设计原理" tabindex="-1"><a class="header-anchor" href="#设计原理" aria-hidden="true">#</a> 设计原理</h2>
<h3 id="寄存器" tabindex="-1"><a class="header-anchor" href="#寄存器" aria-hidden="true">#</a> 寄存器</h3>
<p>Go 语言的汇编代码包含 BP 和 SP 两个栈寄存器，它们分别存储了栈的基址指针和栈顶的地址，栈内存与函数调用的关系非常紧密，我们在函数调用一节中曾经介绍过栈区，BP 和 SP 之间的内存就是当前函数的调用栈。</p>
<p><img src="https://img.draveness.me/2020-03-23-15849514795843-stack-registers.png" alt="stack-registers" loading="lazy"></p>
<h3 id="线程栈" tabindex="-1"><a class="header-anchor" href="#线程栈" aria-hidden="true">#</a> 线程栈</h3>
<p>线程和进程都是代码执行的上下文<a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-stack-management/#fn:4" target="_blank" rel="noopener noreferrer">4<ExternalLinkIcon/></a>，但是如果一个应用程序包含成百上千个执行上下文并且每个上下文都是线程，会占用大量的内存空间并带来其他的额外开销，Go 语言在设计时认为执行上下文是轻量级的，所以它在用户态实现 Goroutine 作为执行上下文。</p>
<h3 id="逃逸分析" tabindex="-1"><a class="header-anchor" href="#逃逸分析" aria-hidden="true">#</a> 逃逸分析</h3>
<p>在 C 语言和 C++ 这类需要手动管理内存的编程语言中，将对象或者结构体分配到栈上或者堆上是由工程师自主决定的，这也为工程师的工作带来的挑战，如果工程师能够精准地为每一个变量分配合理的空间，那么整个程序的运行效率和内存使用效率一定是最高的，但是手动分配内存会导致如下的两个问题：</p>
<ol>
<li>不需要分配到堆上的对象分配到了堆上 — 浪费内存空间；</li>
<li>需要分配到堆上的对象分配到了栈上 — 悬挂指针、影响内存安全；</li>
</ol>
<p>与悬挂指针相比，浪费内存空间反而是小问题。在 C 语言中，栈上的变量被函数作为返回值返回给调用方是一个常见的错误，在如下所示的代码中，栈上的变量 <code>i</code> 被错误返回：</p>
<div class="language-c ext-c line-numbers-mode"><pre v-pre class="language-c"><code><span class="token keyword">int</span> <span class="token operator">*</span><span class="token function">dangling_pointer</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token operator">&amp;</span>i<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>C</p>
<p>当 <code>dangling_pointer</code> 函数返回后，它的本地变量会被编译器回收，调用方获取的是危险的悬挂指针，我们不确定当前指针指向的值是否合法时，这种问题在大型项目中是比较难以发现和定位的。</p>
<p>在编译器优化中，逃逸分析是用来决定指针动态作用域的方法<a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-stack-management/#fn:5" target="_blank" rel="noopener noreferrer">5<ExternalLinkIcon/></a>。Go 语言的编译器使用逃逸分析决定哪些变量应该在栈上分配，哪些变量应该在堆上分配，其中包括使用 <code>new</code>、<code>make</code> 和字面量等方法隐式分配的内存，Go 语言的逃逸分析遵循以下两个不变性：</p>
<ol>
<li>指向栈对象的指针不能存在于堆中；</li>
<li>指向栈对象的指针不能在栈对象回收后存活；</li>
</ol>
<p><img src="https://img.draveness.me/2020-03-23-15849514795864-escape-analysis-and-key-invariants.png" alt="escape-analysis-and-key-invariants" loading="lazy"></p>
<p><strong>图 7-44 逃逸分析和不变性</strong></p>
<p>我们通过上图展示两条不变性存在的意义，当我们违反了第一条不变性时，堆上的绿色指针指向了栈中的黄色内存，一旦函数返回后函数栈会被回收，该绿色指针指向的值就不再合法；如果我们违反了第二条不变性，因为寄存器 SP 下面的内存由于函数返回已经释放，所以黄色指针指向的内存已经不再合法。</p>
<p>逃逸分析是静态分析的一种，在编译器解析了 Go 语言源文件后，它可以获得整个程序的抽象语法树（Abstract syntax tree，AST），编译器可以根据抽象语法树分析静态的数据流，我们会通过以下几个步骤实现静态分析的全过程<a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-stack-management/#fn:6" target="_blank" rel="noopener noreferrer">6<ExternalLinkIcon/></a>：</p>
<ol>
<li>构建带权重的有向图，其中顶点 <a href="https://draveness.me/golang/tree/cmd/compile/internal/gc.EscLocation" target="_blank" rel="noopener noreferrer"><code>cmd/compile/internal/gc.EscLocation</code><ExternalLinkIcon/></a> 表示被分配的变量，边 <a href="https://draveness.me/golang/tree/cmd/compile/internal/gc.EscEdge" target="_blank" rel="noopener noreferrer"><code>cmd/compile/internal/gc.EscEdge</code><ExternalLinkIcon/></a> 表示变量之间的分配关系，权重表示寻址和取地址的次数；</li>
<li>遍历对象分配图并查找违反两条不变性的变量分配关系，如果堆上的变量指向了栈上的变量，那么该变量需要分配在堆上；</li>
<li>记录从函数的调用参数到堆以及返回值的数据流，增强函数参数的逃逸分析；</li>
</ol>
<p>决定变量是在栈上还是堆上虽然重要，但是这是一个定义相对清晰的问题，我们可以通过编译器统一作决策。为了保证内存的绝对安全，编译器可能会将一些变量错误地分配到堆上，但是因为堆也会被垃圾收集器扫描，所以不会造成内存泄露以及悬挂指针等安全问题，解放了工程师的生产力。</p>
<h3 id="栈内存空间" tabindex="-1"><a class="header-anchor" href="#栈内存空间" aria-hidden="true">#</a> 栈内存空间</h3>
<h4 id="分段栈" tabindex="-1"><a class="header-anchor" href="#分段栈" aria-hidden="true">#</a> 分段栈</h4>
<p>当 Goroutine 调用的函数层级或者局部变量需要的越来越多时，运行时会调用 <a href="https://draveness.me/golang/tree/runtime.morestack:go1.2" target="_blank" rel="noopener noreferrer"><code>runtime.morestack:go1.2</code><ExternalLinkIcon/></a> 和 <a href="https://draveness.me/golang/tree/runtime.newstack:go1.2" target="_blank" rel="noopener noreferrer"><code>runtime.newstack:go1.2</code><ExternalLinkIcon/></a> 创建一个新的栈空间，这些栈空间虽然不连续，但是当前 Goroutine 的多个栈空间会以链表的形式串联起来，运行时会通过指针找到连续的栈片段：</p>
<p><img src="https://img.draveness.me/2020-03-23-15849514795874-segmented-stacks.png" alt="segmented-stacks" loading="lazy"></p>
<p><strong>图 7-45 分段栈的内存布局</strong></p>
<p>一旦 Goroutine 申请的栈空间不在被需要，运行时会调用 <a href="https://draveness.me/golang/tree/runtime.lessstack:go1.2" target="_blank" rel="noopener noreferrer"><code>runtime.lessstack:go1.2</code><ExternalLinkIcon/></a> 和 <a href="https://draveness.me/golang/tree/runtime.oldstack:go1.2" target="_blank" rel="noopener noreferrer"><code>runtime.oldstack:go1.2</code><ExternalLinkIcon/></a> 释放不再使用的内存空间。</p>
<p>分段栈机制虽然能够按需为当前 Goroutine 分配内存并且及时减少内存的占用，但是它也存在两个比较大的问题：</p>
<ol>
<li>如果当前 Goroutine 的栈几乎充满，那么任意的函数调用都会触发栈扩容，当函数返回后又会触发栈的收缩，如果在一个循环中调用函数，栈的分配和释放就会造成巨大的额外开销，这被称为热分裂问题（Hot split）；</li>
<li>一旦 Goroutine 使用的内存<strong>越过</strong>了分段栈的扩缩容阈值，运行时会触发栈的扩容和缩容，带来额外的工作量；</li>
</ol>
<h4 id="连续栈" tabindex="-1"><a class="header-anchor" href="#连续栈" aria-hidden="true">#</a> 连续栈</h4>
<p>连续栈可以解决分段栈中存在的两个问题，其核心原理是每当程序的栈空间不足时，初始化一片更大的栈空间并将原栈中的所有值都迁移到新栈中，新的局部变量或者函数调用就有充足的内存空间。使用连续栈机制时，栈空间不足导致的扩容会经历以下几个步骤：</p>
<ol>
<li>在内存空间中分配更大的栈内存空间；</li>
<li>将旧栈中的所有内容复制到新栈中；</li>
<li><strong>将指向旧栈对应变量的指针重新指向新栈</strong>；</li>
<li>销毁并回收旧栈的内存空间；</li>
</ol>
<p>在扩容的过程中，最重要的是调整指针的第三步，这一步能够保证指向栈的指针的正确性，因为栈中的所有变量内存都会发生变化，所以原本指向栈中变量的指针也需要调整。我们在前面提到过经过逃逸分析的 Go 语言程序的遵循以下不变性 —— <strong>指向栈对象的指针不能存在于堆中</strong>，所以指向栈中变量的指针只能在栈上，我们只需要调整栈中的所有变量就可以保证内存的安全了。</p>
<p><img src="https://img.draveness.me/2020-03-23-15849514795883-continuous-stacks.png" alt="continuous-stacks" loading="lazy"></p>
<p><strong>图 7-46 连续栈的内存布局</strong></p>
<p>因为需要拷贝变量和调整指针，连续栈增加了栈扩容时的额外开销，但是通过合理栈缩容机制就能避免热分裂带来的性能问题<a href="https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-stack-management/#fn:10" target="_blank" rel="noopener noreferrer">10<ExternalLinkIcon/></a>，在 GC 期间如果 Goroutine 使用了栈内存的四分之一，那就将其内存减少一半，这样在栈内存几乎充满时也只会扩容一次，不会因为函数调用频繁扩缩容。</p>
</template>
