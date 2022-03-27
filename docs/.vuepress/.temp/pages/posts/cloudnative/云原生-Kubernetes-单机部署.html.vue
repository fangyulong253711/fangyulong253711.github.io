<template><h1 id="k8s-单机部署" tabindex="-1"><a class="header-anchor" href="#k8s-单机部署" aria-hidden="true">#</a> k8s 单机部署</h1>
<h2 id="关闭防火墙" tabindex="-1"><a class="header-anchor" href="#关闭防火墙" aria-hidden="true">#</a> 关闭防火墙</h2>
<p>systemctl status firewalld</p>
<p>service  iptables status</p>
<h2 id="安装docker" tabindex="-1"><a class="header-anchor" href="#安装docker" aria-hidden="true">#</a> 安装<code>docker</code></h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>// 安装docker
$ yum <span class="token function">install</span> -y docker-ce
// 开机启动 <span class="token operator">&amp;&amp;</span> 启动服务
$ systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span> <span class="token operator">&amp;&amp;</span> systemctl start <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="设置阿里云yum仓库并安装kubernetes组件" tabindex="-1"><a class="header-anchor" href="#设置阿里云yum仓库并安装kubernetes组件" aria-hidden="true">#</a> 设置阿里云yum仓库并安装kubernetes组件</h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># cat &lt;&lt;EOF > /etc/yum.repos.d/kubernetes.repo</span>
<span class="token punctuation">[</span>kubernetes<span class="token punctuation">]</span>
<span class="token assign-left variable">name</span><span class="token operator">=</span>Kubernetes
<span class="token assign-left variable">baseurl</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
<span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">gpgcheck</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">repo_gpgcheck</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">gpgkey</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
 
<span class="token comment"># yum -y install kubelet-1.13* kubeadm-1.13* kubectl-1.13*</span>

<span class="token comment"># apt install   kubelet=1.15.9-00 kubeadm=1.15.9-00 kubectl=1.15.9-00</span>
<span class="token comment"># systemctl start kubelet</span>
<span class="token comment"># systemctl enable kubelet</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h2 id="拉取镜像" tabindex="-1"><a class="header-anchor" href="#拉取镜像" aria-hidden="true">#</a> 拉取镜像</h2>
<h3 id="方法一" tabindex="-1"><a class="header-anchor" href="#方法一" aria-hidden="true">#</a> 方法一</h3>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>// 查看kubeadm镜像
$ kubeadm config images list

// 结果
k8s.gcr.io/kube-apiserver:v1.13.3
k8s.gcr.io/kube-controller-manager:v1.13.3
k8s.gcr.io/kube-scheduler:v1.13.3
k8s.gcr.io/kube-proxy:v1.13.3
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.2.24
k8s.gcr.io/coredns:1.2.6

// 执行如下脚本（没有翻墙的同学只能通过阿里云镜像或者其他镜像）
$ <span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> <span class="token variable"><span class="token variable">`</span>kubeadm config images list<span class="token variable">`</span></span><span class="token punctuation">;</span> <span class="token keyword">do</span> 
  <span class="token assign-left variable">imageName</span><span class="token operator">=</span><span class="token variable">${i<span class="token operator">#</span>k8s.gcr.io<span class="token operator">/</span>}</span>
  <span class="token function">docker</span> pull registry.aliyuncs.com/google_containers/<span class="token variable">$imageName</span>
  <span class="token function">docker</span> tag registry.aliyuncs.com/google_containers/<span class="token variable">$imageName</span> k8s.gcr.io/<span class="token variable">$imageName</span>
  <span class="token function">docker</span> rmi registry.aliyuncs.com/google_containers/<span class="token variable">$imageName</span>
<span class="token keyword">done</span><span class="token punctuation">;</span>

// 开机启动 <span class="token operator">&amp;&amp;</span> 启动服务
$ systemctl <span class="token builtin class-name">enable</span> kubelet <span class="token operator">&amp;&amp;</span> systemctl start kubelet
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h3 id="方法二" tabindex="-1"><a class="header-anchor" href="#方法二" aria-hidden="true">#</a> 方法二</h3>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">docker</span> pull mirrorgooglecontainers/kube-apiserver:v1.13.2
<span class="token function">docker</span> pull mirrorgooglecontainers/kube-controller-manager:v1.13.2
<span class="token function">docker</span> pull mirrorgooglecontainers/kube-scheduler:v1.13.2
<span class="token function">docker</span> pull mirrorgooglecontainers/kube-proxy:v1.13.2
<span class="token function">docker</span> pull mirrorgooglecontainers/pause:3.1
<span class="token function">docker</span> pull mirrorgooglecontainers/etcd:3.2.24
<span class="token function">docker</span> pull coredns/coredns:1.2.6
 
<span class="token function">docker</span> tag mirrorgooglecontainers/kube-apiserver:v1.13.2 k8s.gcr.io/kube-apiserver:v1.13.2
<span class="token function">docker</span> tag mirrorgooglecontainers/kube-controller-manager:v1.13.2 k8s.gcr.io/kube-controller-manager:v1.13.2
<span class="token function">docker</span> tag mirrorgooglecontainers/kube-scheduler:v1.13.2 k8s.gcr.io/kube-scheduler:v1.13.2
<span class="token function">docker</span> tag mirrorgooglecontainers/kube-proxy:v1.13.2 k8s.gcr.io/kube-proxy:v1.13.2
<span class="token function">docker</span> tag mirrorgooglecontainers/pause:3.1 k8s.gcr.io/pause:3.1
<span class="token function">docker</span> tag mirrorgooglecontainers/etcd:3.2.24 k8s.gcr.io/etcd:3.2.24
<span class="token function">docker</span> tag coredns/coredns:1.2.6 k8s.gcr.io/coredns:1.2.6
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h3 id="方法三-推荐" tabindex="-1"><a class="header-anchor" href="#方法三-推荐" aria-hidden="true">#</a> 方法三（推荐）</h3>
<p>初始化时候直接使用以下命令</p>
<p>kubeadm init --image-repository registry.aliyuncs.com/google_containers --ignore-preflight-errors=Swap  --pod-network-cidr=10.100.0.0/16</p>
<h2 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化" aria-hidden="true">#</a> 初始化</h2>
<h3 id="节点" tabindex="-1"><a class="header-anchor" href="#节点" aria-hidden="true">#</a> 节点</h3>
<p>kubeadm init --image-repository registry.aliyuncs.com/google_containers --ignore-preflight-errors=Swap  --pod-network-cidr=10.100.0.0/16</p>
<h3 id="文件初始化" tabindex="-1"><a class="header-anchor" href="#文件初始化" aria-hidden="true">#</a> 文件初始化</h3>
<p>显示成功之后</p>
<p>mkdir -p $HOME/.kube</p>
<p>sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config</p>
<p>sudo chown <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>i</mi><mi>d</mi><mo>−</mo><mi>u</mi><mo stretchy="false">)</mo><mo>:</mo></mrow><annotation encoding="application/x-tex">(id -u):</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">u</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>(id -g) $HOME/.kube/config</p>
<h2 id="设置单击模式-运行master节点跑node" tabindex="-1"><a class="header-anchor" href="#设置单击模式-运行master节点跑node" aria-hidden="true">#</a> 设置单击模式（运行master节点跑node）</h2>
<div class="language-php ext-php line-numbers-mode"><pre v-pre class="language-php"><code>kubectl taint nodes <span class="token operator">--</span>all node<span class="token operator">-</span>role<span class="token operator">.</span>kubernetes<span class="token operator">.</span>io<span class="token operator">/</span>master<span class="token operator">-</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="部署网络插件" tabindex="-1"><a class="header-anchor" href="#部署网络插件" aria-hidden="true">#</a> 部署网络插件</h2>
<p>kubectl apply -f https:<em>//cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')</em></p>
<h2 id="部署成功" tabindex="-1"><a class="header-anchor" href="#部署成功" aria-hidden="true">#</a> 部署成功</h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token punctuation">[</span>root@instance-vpoiaq2d ~<span class="token punctuation">]</span><span class="token comment"># kubectl get pods --all-namespaces</span>
NAMESPACE     NAME                                        READY   STATUS    RESTARTS   AGE
kube-system   coredns-6587c6dc7-4655v                     <span class="token number">1</span>/1     Running   <span class="token number">0</span>          5m26s
kube-system   coredns-6587c6dc7-b2k2t                     <span class="token number">1</span>/1     Running   <span class="token number">0</span>          5m26s
kube-system   etcd-instance-vpoiaq2d                      <span class="token number">1</span>/1     Running   <span class="token number">0</span>          4m42s
kube-system   kube-apiserver-instance-vpoiaq2d            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          4m29s
kube-system   kube-controller-manager-instance-vpoiaq2d   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          4m42s
kube-system   kube-proxy-6s8x7                            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          5m26s
kube-system   kube-scheduler-instance-vpoiaq2d            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          4m35s
kube-system   weave-net-84pfl                             <span class="token number">2</span>/2     Running   <span class="token number">0</span>          105s
<span class="token punctuation">[</span>root@instance-vpoiaq2d ~<span class="token punctuation">]</span><span class="token comment"># kubectl get node</span>
NAME                STATUS   ROLES    AGE     VERSION
instance-vpoiaq2d   Ready    master   5m52s   v1.13.12
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h2 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a> </h2>
</template>
