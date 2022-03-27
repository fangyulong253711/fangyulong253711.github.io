<template><p><a href="https://note.youdao.com/" target="_blank" rel="noopener noreferrer"># <ExternalLinkIcon/></a>Helm安装</p>
<h2 id="下载安装包" tabindex="-1"><a class="header-anchor" href="#下载安装包" aria-hidden="true">#</a> 下载安装包</h2>
<p>在官网下载指定想要版本的helm并传入服务器：<a href="https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fhelm%2Fhelm%2Freleases" target="_blank" rel="noopener noreferrer">https://github.com/helm/helm/releases<ExternalLinkIcon/></a></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">tar</span> zxvf helm-xxxxx-linux-amd64.tar.gz
<span class="token function">mv</span> liniux-amd64/helm /usr/local/bin
helm version <span class="token comment">#查看helm client版本</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="权限创建" tabindex="-1"><a class="header-anchor" href="#权限创建" aria-hidden="true">#</a> 权限创建</h2>
<p>创建rbac-config.yaml，并输入以下内容：</p>
<div class="language-yaml ext-yml line-numbers-mode"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> tiller
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kube<span class="token punctuation">-</span>system
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1beta1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRoleBinding
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> tiller
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
  <span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
  <span class="token key atrule">name</span><span class="token punctuation">:</span> cluster<span class="token punctuation">-</span>admin
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
    <span class="token key atrule">name</span><span class="token punctuation">:</span> tiller
    <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kube<span class="token punctuation">-</span>system
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>然后执行<code>kubectl create -f rbac-config.yaml</code></p>
<h2 id="安装tiller" tabindex="-1"><a class="header-anchor" href="#安装tiller" aria-hidden="true">#</a> 安装tiller</h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment"># google源</span>
helm init --service-account tiller --upgrade -i gcr.io/kubernetes-helm/tiller:v2.11.0

<span class="token comment"># 阿里源</span>
helm init --service-account tiller --upgrade -i registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.11.0 --stable-repo-url https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="查看tiller是否安装成功" tabindex="-1"><a class="header-anchor" href="#查看tiller是否安装成功" aria-hidden="true">#</a> 查看tiller是否安装成功</h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token punctuation">[</span>root@k8s-master01 helm<span class="token punctuation">]</span><span class="token comment"># kubectl get pod -n kube-system -l app=helm</span>
NAME                             READY   STATUS    RESTARTS   AGE
tiller-deploy-66cdf6dfc8-p7x7g   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          20d
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令" aria-hidden="true">#</a> 常用命令：</h2>
<div class="language-php ext-php line-numbers-mode"><pre v-pre class="language-php"><code>helm <span class="token keyword">list</span> <span class="token operator">--</span>all <span class="token comment">#列出所有部署应用</span>
helm repo <span class="token keyword">list</span>  <span class="token comment">#列出repo</span>
helm delete <span class="token operator">--</span>purge <span class="token operator">&lt;</span>name<span class="token operator">></span>  <span class="token comment">#删除某个应用</span>
helm reset  <span class="token comment">#重置helm</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="备注" tabindex="-1"><a class="header-anchor" href="#备注" aria-hidden="true">#</a> 备注</h2>
<h3 id="如何删除tiller" tabindex="-1"><a class="header-anchor" href="#如何删除tiller" aria-hidden="true">#</a> 如何删除tiller</h3>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>kubectl get -n kube-system secrets,sa,clusterrolebinding -o name<span class="token operator">|</span><span class="token function">grep</span> tiller<span class="token operator">|</span><span class="token function">xargs</span> kubectl -n kube-system delete
kubectl get all -n kube-system -l <span class="token assign-left variable">app</span><span class="token operator">=</span>helm -o name<span class="token operator">|</span><span class="token function">xargs</span> kubectl delete -n kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div></template>
