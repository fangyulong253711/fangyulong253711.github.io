<template><h1 id="docker原理" tabindex="-1"><a class="header-anchor" href="#docker原理" aria-hidden="true">#</a> docker原理</h1>
<h2 id="namespace-技术" tabindex="-1"><a class="header-anchor" href="#namespace-技术" aria-hidden="true">#</a> <strong>Namespace 技术</strong></h2>
<p><strong>Namespace 技术</strong>则是用来修改进程视图的主要方法。</p>
<p>本来，每当我们在宿主机上运行了一个 /bin/sh 程序，操作系统都会给它分配一个进程编号，比如 PID=100。这个编号是进程的唯一标识，就像员工的工牌一样。所以 PID=100，可以粗略地理解为这个 /bin/sh 是我们公司里的第 100 号员工，而第 1 号员工就自然是比尔 · 盖茨这样统领全局的人物。</p>
<p>而现在，我们要通过 Docker 把这个 /bin/sh 程序运行在一个容器当中。这时候，Docker 就会在这个第 100 号员工入职时给他施一个“障眼法”，让他永远看不到前面的其他 99 个员工，更看不到比尔 · 盖茨。这样，他就会错误地以为自己就是公司里的第 1 号员工。</p>
<p>这种机制，其实就是对被隔离应用的进程空间做了手脚，使得这些进程只能看到重新计算过的进程编号，比如 PID=1。可实际上，他们在宿主机的操作系统里，还是原来的第 100 号进程。</p>
<p><strong>宿主机pid-&gt;容器pid-&gt;施加namespace-&gt;(容器看不见其他pid看到自己pid也为1)</strong></p>
<p><strong>这种技术，就是 Linux 里面的 Namespace 机制</strong>。而 Namespace 的使用方式也非常有意思：它其实只是 Linux 创建新进程的一个可选参数。我们知道，在 Linux 系统中创建线程的系统调用是 clone()，比如：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>int pid <span class="token operator">=</span> clone<span class="token punctuation">(</span>main_function, stack_size, SIGCHLD, NULL<span class="token punctuation">)</span><span class="token punctuation">;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>这个系统调用就会为我们创建一个新的进程，并且返回它的进程号 pid。</p>
<p>而当我们用 clone() 系统调用创建一个新进程时，就可以在参数中指定 CLONE_NEWPID 参数，比如：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>int pid <span class="token operator">=</span> clone<span class="token punctuation">(</span>main_function, stack_size, CLONE_NEWPID <span class="token operator">|</span> SIGCHLD, NULL<span class="token punctuation">)</span><span class="token punctuation">;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>这时，新创建的这个进程将会“看到”一个全新的进程空间，在这个进程空间里，它的 PID 是 1。之所以说“看到”，是因为这只是一个“障眼法”，在宿主机真实的进程空间里，这个进程的 PID 还是真实的数值，比如 100。</p>
<p>当然，我们还可以多次执行上面的 clone() 调用，这样就会创建多个 PID Namespace，而每个 Namespace 里的应用进程，都会认为自己是当前容器里的第 1 号进程，它们既看不到宿主机里真正的进程空间，也看不到其他 PID Namespace 里的具体情况。</p>
<p>而<strong>除了我们刚刚用到的 PID Namespace，Linux 操作系统还提供了 Mount、UTS、IPC、Network 和 User 这些 Namespace，用来对各种不同的进程上下文进行“障眼法”操作。</strong></p>
<p>比如，Mount Namespace，用于让被隔离进程只看到当前 Namespace 里的挂载点信息；Network Namespace，用于让被隔离进程看到当前 Namespace 里的网络设备和配置。</p>
<p><strong>这，就是 Linux 容器最基本的实现原理了。</strong></p>
<p>详细namespaces 讲解<a href="https://www.cnblogs.com/charlieroro/p/10069461.html" target="_blank" rel="noopener noreferrer">docker namespaces - charlieroro - 博客园 (cnblogs.com)<ExternalLinkIcon/></a></p>
<h2 id="cgroups-技术" tabindex="-1"><a class="header-anchor" href="#cgroups-技术" aria-hidden="true">#</a> <strong>Cgroups 技术</strong></h2>
<p>我们通过 Linux 的命名空间为新创建的进程隔离了文件系统、网络并与宿主机器之间的进程相互隔离，但是命名空间并不能够为我们提供物理资源上的隔离，比如 CPU 或者内存，如果在同一台机器上运行了多个对彼此以及宿主机器一无所知的『容器』，这些容器却共同占用了宿主机器的物理资源。</p>
<p><a href="http://dockone.io/uploads/article/20190625/5c4040102b82ac5ccd472855b93d85ab.png" target="_blank" rel="noopener noreferrer"><img src="http://dockone.io/uploads/article/20190625/5c4040102b82ac5ccd472855b93d85ab.png" alt="12.png" loading="lazy"><ExternalLinkIcon/></a></p>
<p>如果其中的某一个容器正在执行 CPU 密集型的任务，那么就会影响其他容器中任务的性能与执行效率，导致多个容器相互影响并且抢占资源。如何对多个容器的资源使用进行限制就成了解决进程虚拟资源隔离之后的主要问题，而 Control Groups（简称 CGroups）就是能够隔离宿主机器上的物理资源，例如 CPU、内存、磁盘 I/O 和网络带宽。</p>
<p>每一个 CGroup 都是一组被相同的标准和参数限制的进程，不同的 CGroup 之间是有层级关系的，也就是说它们之间可以从父类继承一些用于限制资源使用的标准和参数。</p>
<p><a href="http://dockone.io/uploads/article/20190625/a686646574f66fa4b6989b8d42761063.png" target="_blank" rel="noopener noreferrer"><img src="http://dockone.io/uploads/article/20190625/a686646574f66fa4b6989b8d42761063.png" alt="13.png" loading="lazy"><ExternalLinkIcon/></a></p>
<p>Linux 的 CGroup 能够为一组进程分配资源，也就是我们在上面提到的 CPU、内存、网络带宽等资源，通过对资源的分配，CGroup 能够提供以下的几种功能：</p>
<p><a href="http://dockone.io/uploads/article/20190625/6b1f30062324d26ce74d2f64630ee1a6.png" target="_blank" rel="noopener noreferrer"><img src="http://dockone.io/uploads/article/20190625/6b1f30062324d26ce74d2f64630ee1a6.png" alt="14.png" loading="lazy"><ExternalLinkIcon/></a></p>
<blockquote>
<p>在 CGroup 中，所有的任务就是一个系统的一个进程，而 CGroup 就是一组按照某种标准划分的进程，在 CGroup 这种机制中，所有的资源控制都是以 CGroup 作为单位实现的，每一个进程都可以随时加入一个 CGroup 也可以随时退出一个 CGroup。
——<a href="https://www.ibm.com/developerworks/cn/linux/1506_cgroup/index.html" target="_blank" rel="noopener noreferrer">CGroup 介绍、应用实例及原理描述<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="unionfs" tabindex="-1"><a class="header-anchor" href="#unionfs" aria-hidden="true">#</a> UnionFS</h2>
<p>1）什么是UnionFS
联合文件系统（Union File System）：2004年由纽约州立大学石溪分校开发，它可以把多个目录(也叫分支)内容联合挂载到同一个目录下，而目录的物理位置是分开的。UnionFS允许只读和可读写目录并存，就是说可同时删除和增加内容。UnionFS应用的地方很多，比如在多个磁盘分区上合并不同文件系统的主目录，或把几张CD光盘合并成一个统一的光盘目录(归档)。另外，具有写时复制(copy-on-write)功能UnionFS可以把只读和可读写文件系统合并在一起，虚拟上允许只读文件系统的修改可以保存到可写文件系统当中。</p>
<p>2）docker的镜像rootfs，和layer的设计
任何程序运行时都会有依赖，无论是开发语言层的依赖库，还是各种系统lib、操作系统等，不同的系统上这些库可能是不一样的，或者有缺失的。为了让容器运行时一致，docker将依赖的操作系统、各种lib依赖整合打包在一起（即镜像），然后容器启动时，作为它的根目录（根文件系统rootfs），使得容器进程的各种依赖调用都在这个根目录里，这样就做到了环境的一致性。</p>
<p>不过，这时你可能已经发现了另一个问题：难道每开发一个应用，都要重复制作一次rootfs吗（那每次pull/push一个系统岂不疯掉）？</p>
<p>比如，我现在用Debian操作系统的ISO做了一个rootfs，然后又在里面安装了Golang环境，用来部署我的应用A。那么，我的另一个同事在发布他的Golang应用B时，希望能够直接使用我安装过Golang环境的rootfs，而不是重复这个流程，那么本文的主角UnionFS就派上用场了。</p>
<p>Docker镜像的设计中，引入了层（layer）的概念，也就是说，用户制作镜像的每一步操作，都会生成一个层，也就是一个增量rootfs（一个目录），这样应用A和应用B所在的容器共同引用相同的Debian操作系统层、Golang环境层（作为只读层），而各自有各自应用程序层，和可写层。启动容器的时候通过UnionFS把相关的层挂载到一个目录，作为容器的根文件系统。</p>
<p>需要注意的是，rootfs只是一个操作系统所包含的文件、配置和目录，并不包括操作系统内核。这就意味着，如果你的应用程序需要配置内核参数、加载额外的内核模块，以及跟内核进行直接的交互，你就需要注意了：这些操作和依赖的对象，都是宿主机操作系统的内核，它对于该机器上的所有容器来说是一个“全局变量”，牵一发而动全身。</p>
<p>详细介绍 https://blog.csdn.net/songcf_faith/article/details/82787946</p>
</template>
