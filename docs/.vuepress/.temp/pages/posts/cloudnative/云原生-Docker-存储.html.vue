<template><h1 id="docker中rootfs-unionfs-layer关系" tabindex="-1"><a class="header-anchor" href="#docker中rootfs-unionfs-layer关系" aria-hidden="true">#</a> docker中rootfs，UnionFS ，layer关系</h1>
<h1 id="rootfs" tabindex="-1"><a class="header-anchor" href="#rootfs" aria-hidden="true">#</a> rootfs</h1>
<p>为了能够让容器的这个根目录看起来更“真实”，我们一般会在这个容器的根目录下挂载一个完整操作系统的文件系统，比如 Ubuntu16.04 的 ISO。这样，在容器启动之后，我们在容器里通过执行 &quot;ls /&quot; 查看根目录下的内容，就是 Ubuntu 16.04 的所有目录和文件。</p>
<p><strong>而这个挂载在容器根目录上、用来为容器进程提供隔离后执行环境的文件系统，就是所谓的“容器镜像”。它还有一个更为专业的名字，叫作：rootfs（根文件系统）。</strong></p>
<p>所以，一个最常见的 rootfs，或者说容器镜像，会包括如下所示的一些目录和文件，比如 /bin，/etc，/proc 等等：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ ls /
bin dev etc home lib lib64 mnt opt proc root run sbin sys tmp usr var
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>而你进入容器之后执行的 /bin/bash，就是 /bin 目录下的可执行文件，与宿主机的 /bin/bash 完全不同。</p>
<p>现在，你应该可以理解，对 Docker 项目来说，它最核心的原理实际上就是为待创建的用户进程：</p>
<ol>
<li>启用 Linux Namespace 配置；</li>
<li>设置指定的 Cgroups 参数；</li>
<li>切换进程的根目录（Change Root）。</li>
</ol>
<p>这样，一个完整的容器就诞生了。不过，Docker 项目在最后一步的切换上会优先使用 pivot_root 系统调用，如果系统不支持，才会使用 chroot。这两个系统调用虽然功能类似，但是也有细微的区别，这一部分小知识就交给你课后去探索了。</p>
<p>另外，<strong>需要明确的是，rootfs 只是一个操作系统所包含的文件、配置和目录，并不包括操作系统内核。在 Linux 操作系统中，这两部分是分开存放的，操作系统只有在开机启动时才会加载指定版本的内核镜像。</strong></p>
<h1 id="union-file-system" tabindex="-1"><a class="header-anchor" href="#union-file-system" aria-hidden="true">#</a> Union File System</h1>
<p><strong>由于 rootfs 里打包的不只是应用，而是整个操作系统的文件和目录，也就意味着，应用以及它运行所需要的所有依赖，都被封装在了一起。</strong></p>
<p>事实上，对于大多数开发者而言，他们对应用依赖的理解，一直局限在编程语言层面。比如 Golang 的 Godeps.json。但实际上，一个一直以来很容易被忽视的事实是，<strong>对一个应用来说，操作系统本身才是它运行所需要的最完整的“依赖库”。</strong></p>
<p>有了容器镜像“打包操作系统”的能力，这个最基础的依赖环境也终于变成了应用沙盒的一部分。这就赋予了容器所谓的一致性：无论在本地、云端，还是在一台任何地方的机器上，用户只需要解压打包好的容器镜像，那么这个应用运行所需要的完整的执行环境就被重现出来了。</p>
<p><strong>这种深入到操作系统级别的运行环境一致性，打通了应用在本地开发和远端执行环境之间难以逾越的鸿沟。</strong></p>
<p>不过，这时你可能已经发现了另一个非常棘手的问题：难道我每开发一个应用，或者升级一下现有的应用，都要重复制作一次 rootfs 吗？</p>
<p>比如，我现在用 Ubuntu 操作系统的 ISO 做了一个 rootfs，然后又在里面安装了 Java 环境，用来部署我的 Java 应用。那么，我的另一个同事在发布他的 Java 应用时，显然希望能够直接使用我安装过 Java 环境的 rootfs，而不是重复这个流程。</p>
<p>一种比较直观的解决办法是，我在制作 rootfs 的时候，每做一步“有意义”的操作，就<strong>保存一个 rootfs 出来</strong>，这样其他同事就可以按需求去用他需要的 rootfs 了。</p>
<p>但是，这个解决办法并不具备推广性。原因在于，一旦你的同事们修改了这个 rootfs，新旧两个 rootfs 之间就没有任何关系了。这样做的结果就是极度的碎片化。</p>
<p>那么，既然这些修改都基于一个旧的 rootfs，我们能不能以增量的方式去做这些修改呢？这样做的好处是，所有人都只需要维护相对于 base rootfs 修改的增量内容，而不是每次修改都制造一个“fork”。</p>
<p>答案当然是肯定的。</p>
<p>这也正是为何，Docker 公司在实现 Docker 镜像时并没有沿用以前制作 rootfs 的标准流程，而是做了一个小小的创新：</p>
<blockquote>
<p>Docker 在镜像的设计中，引入了层（layer）的概念。也就是说，用户制作镜像的每一步操作，都会生成一个层，也就是一个增量 rootfs。</p>
</blockquote>
<p>当然，这个想法不是凭空臆造出来的，而是用到了一种叫作联合文件系统（Union File System）的能力。</p>
<p>Union File System 也叫 UnionFS，最主要的功能是将多个不同位置的目录联合挂载（union mount）到同一个目录下。比如，我现在有两个目录 A 和 B，它们分别有两个文件：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ tree
.
├── A
│  ├── a
│  └── x
└── B
  ├── b
  └── x
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>然后，我使用联合挂载的方式，将这两个目录挂载到一个公共的目录 C 上：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ mkdir C
$ mount -t aufs -o dirs=./A:./B none ./C
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>这时，我再查看目录 C 的内容，就能看到目录 A 和 B 下的文件被合并到了一起：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ tree ./C
./C
├── a
├── b
└── x
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>可以看到，在这个合并后的目录 C 里，有 a、b、x 三个文件，并且 x 文件只有一份。这，就是“合并”的含义。此外，如果你在目录 C 里对 a、b、x 文件做修改，这些修改也会在对应的目录 A、B 中生效。</p>
<p>那么，在 Docker 项目中，又是如何使用这种 Union File System 的呢？</p>
<p>我的环境是 Ubuntu 16.04 和 Docker CE 18.05，这对组合默认使用的是 AuFS 这个联合文件系统的实现。你可以通过 docker info 命令，查看到这个信息。</p>
<p>AuFS 的全称是 Another UnionFS，后改名为 Alternative UnionFS，再后来干脆改名叫作 Advance UnionFS，从这些名字中你应该能看出这样两个事实：</p>
<ol>
<li>它是对 Linux 原生 UnionFS 的重写和改进；</li>
<li>它的作者怨气好像很大。我猜是 Linus Torvalds（Linux 之父）一直不让 AuFS 进入 Linux 内核主干的缘故，所以我们只能在 Ubuntu 和 Debian 这些发行版上使用它。</li>
</ol>
<p>对于 AuFS 来说，它最关键的目录结构在 /var/lib/docker 路径下的 diff 目录：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>/var/lib/docker/aufs/diff/&lt;layer_id>
复制代码
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p><strong>而这个目录的作用，我们不妨通过一个具体例子来看一下。</strong></p>
<p>现在，我们启动一个容器，比如：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ docker run -d ubuntu:latest sleep 3600
复制代码
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>这时候，Docker 就会从 Docker Hub 上拉取一个 Ubuntu 镜像到本地。</p>
<h1 id="layer" tabindex="-1"><a class="header-anchor" href="#layer" aria-hidden="true">#</a> layer</h1>
<p>这个所谓的“镜像”，实际上就是一个 Ubuntu 操作系统的 rootfs，它的内容是 Ubuntu 操作系统的所有文件和目录。不过，与之前我们讲述的 rootfs 稍微不同的是，Docker 镜像使用的 rootfs，往往由多个“层”组成：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ docker image inspect ubuntu:latest
...
     "RootFS": {
      "Type": "layers",
      "Layers": [
        "sha256:f49017d4d5ce9c0f544c...",
        "sha256:8f2b771487e9d6354080...",
        "sha256:ccd4d61916aaa2159429...",
        "sha256:c01d74f99de40e097c73...",
        "sha256:268a067217b5fe78e000..."
      ]
    }
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>可以看到，这个 Ubuntu 镜像，实际上由五个层组成。这五个层就是五个增量 rootfs，每一层都是 Ubuntu 操作系统文件与目录的一部分；而在使用镜像时，Docker 会把这些增量联合挂载在一个统一的挂载点上（等价于前面例子里的“/C”目录）。</p>
<p>这个挂载点就是 /var/lib/docker/aufs/mnt/，比如：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>/var/lib/docker/aufs/mnt/6e3be5d2ecccae7cc0fcfa2a2f5c89dc21ee30e166be823ceaeba15dce645b3e
复制代码
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>不出意外的，这个目录里面正是一个完整的 Ubuntu 操作系统：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ ls /var/lib/docker/aufs/mnt/6e3be5d2ecccae7cc0fcfa2a2f5c89dc21ee30e166be823ceaeba15dce645b3e
bin boot dev etc home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>那么，前面提到的五个镜像层，又是如何被联合挂载成这样一个完整的 Ubuntu 文件系统的呢？</p>
<p>这个信息记录在 AuFS 的系统目录 /sys/fs/aufs 下面。</p>
<p>首先，通过查看 AuFS 的挂载信息，我们可以找到这个目录对应的 AuFS 的内部 ID（也叫：si）：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ cat /proc/mounts| grep aufs
none /var/lib/docker/aufs/mnt/6e3be5d2ecccae7cc0fc... aufs rw,relatime,si=972c6d361e6b32ba,dio,dirperm1 0 0
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>即，si=972c6d361e6b32ba。</p>
<p>然后使用这个 ID，你就可以在 /sys/fs/aufs 下查看被联合挂载在一起的各个层的信息：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ cat /sys/fs/aufs/si_972c6d361e6b32ba/br[0-9]*
/var/lib/docker/aufs/diff/6e3be5d2ecccae7cc...=rw
/var/lib/docker/aufs/diff/6e3be5d2ecccae7cc...-init=ro+wh
/var/lib/docker/aufs/diff/32e8e20064858c0f2...=ro+wh
/var/lib/docker/aufs/diff/2b8858809bce62e62...=ro+wh
/var/lib/docker/aufs/diff/20707dce8efc0d267...=ro+wh
/var/lib/docker/aufs/diff/72b0744e06247c7d0...=ro+wh
/var/lib/docker/aufs/diff/a524a729adadedb90...=ro+wh
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>从这些信息里，我们可以看到，镜像的层都放置在 /var/lib/docker/aufs/diff 目录下，然后被联合挂载在 /var/lib/docker/aufs/mnt 里面。</p>
<p><strong>而且，从这个结构可以看出来，这个容器的 rootfs 由如下所示的三部分组成：</strong></p>
<p><strong>第一部分，只读层。</strong></p>
<p>它是这个容器的 rootfs 最下面的五层，对应的正是 ubuntu:latest 镜像的五层。可以看到，它们的挂载方式都是只读的（ro+wh，即 readonly+whiteout，至于什么是 whiteout，我下面马上会讲到）。</p>
<p>这时，我们可以分别查看一下这些层的内容：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>$ ls /var/lib/docker/aufs/diff/72b0744e06247c7d0...
etc sbin usr var
$ ls /var/lib/docker/aufs/diff/32e8e20064858c0f2...
run
$ ls /var/lib/docker/aufs/diff/a524a729adadedb900...
bin boot dev etc home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>可以看到，这些层，都以增量的方式分别包含了 Ubuntu 操作系统的一部分。</p>
<p><strong>第二部分，可读写层。</strong></p>
<p>它是这个容器的 rootfs 最上面的一层（6e3be5d2ecccae7cc），它的挂载方式为：rw，即 read write。在没有写入文件之前，这个目录是空的。而一旦在容器里做了写操作，你修改产生的内容就会以增量的方式出现在这个层中。</p>
<p>可是，你有没有想到这样一个问题：如果我现在要做的，是删除只读层里的一个文件呢？</p>
<p>为了实现这样的删除操作，AuFS 会在可读写层创建一个 whiteout 文件，把只读层里的文件“遮挡”起来。</p>
<p>比如，你要删除只读层里一个名叫 foo 的文件，那么这个删除操作实际上是在可读写层创建了一个名叫.wh.foo 的文件。这样，当这两个层被联合挂载之后，foo 文件就会被.wh.foo 文件“遮挡”起来，“消失”了。这个功能，就是“ro+wh”的挂载方式，即只读 +whiteout 的含义。我喜欢把 whiteout 形象地翻译为：“白障”。</p>
<p>所以，最上面这个可读写层的作用，就是专门用来存放你修改 rootfs 后产生的增量，无论是增、删、改，都发生在这里。而当我们使用完了这个被修改过的容器之后，还可以使用 docker commit 和 push 指令，保存这个被修改过的可读写层，并上传到 Docker Hub 上，供其他人使用；而与此同时，原先的只读层里的内容则不会有任何变化。这，就是增量 rootfs 的好处。</p>
<p><strong>第三部分，Init 层。</strong></p>
<p>它是一个以“-init”结尾的层，夹在只读层和读写层之间。Init 层是 Docker 项目单独生成的一个内部层，专门用来存放 /etc/hosts、/etc/resolv.conf 等信息。</p>
<p>需要这样一层的原因是，这些文件本来属于只读的 Ubuntu 镜像的一部分，但是用户往往需要在启动容器时写入一些指定的值比如 hostname，所以就需要在可读写层对它们进行修改。</p>
<p>可是，这些修改往往只对当前的容器有效，我们并不希望执行 docker commit 时，把这些信息连同可读写层一起提交掉。</p>
<p>所以，Docker 做法是，在修改了这些文件之后，以一个单独的层挂载了出来。而用户执行 docker commit 只会提交可读写层，所以是不包含这些内容的。</p>
<p>最终，这 7 个层都被联合挂载到 /var/lib/docker/aufs/mnt 目录下，表现为一个完整的 Ubuntu 操作系统供容器使用。</p>
<blockquote></blockquote>
</template>
