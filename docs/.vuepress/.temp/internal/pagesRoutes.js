import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/",{"title":"博客主页","icon":"home","type":"home","readingTime":{"minutes":0.17,"words":50},"excerpt":"<!-- 这是一个博客主页。 要使用此布局，你应该在页面前端设置 layout: Blog 和 home: true。 相关配置文档请见 博客主页。 -->"},["/index.html","/README.md"]],
  ["v-79fdd481","/home.html",{"title":"个人介绍","icon":"relation","type":"article","readingTime":{"minutes":0.1,"words":30},"excerpt":"云原生领域程序员，目前就职于阿里云。 仰望星空，脚踏实地。 联系方式：QQ 3095329264"},["/home","/home.md"]],
  ["v-0e503981","/slide.html",{"title":"幻灯片页","icon":"slides","type":"slide","readingTime":{"minutes":4.47,"words":1342},"excerpt":"@slidestart 幻灯片演示 一个简单的幻灯片演示与各种小贴士。 \" 作者 Mr.Hope. 请滚动鼠标滚轮进入下一页\" --- 标注幻灯片 👇 -- 标注幻灯片 使用 --- 标注水平幻灯片 在水平幻灯片中使用 -- 分割垂直幻灯片 使用 `` 在幻灯片上添加属性 使用 `` 在前一个 HTML 元素上添加属性 --- Markdown 你可以在幻"},["/slide","/slide.md"]],
  ["v-99340306","/posts/1.html",{"title":"","type":"article","readingTime":{"minutes":0,"words":1},"excerpt":"hello"},["/posts/1","/posts/1.md"]],
  ["v-cd1aa97a","/posts/baseknowledge/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86-%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F-%E9%9D%A2%E7%BB%8F.html",{"title":"计算机网络汇总","icon":"edit","type":"article","readingTime":{"minutes":7.63,"words":2290},"excerpt":"@TOC 计算机网络汇总 应用层(应用,表示,会话) http https 工作原理HTTPS工作原理 一、首先HTTP请求服务端生成证书，客户端对证书的有效期、合法性、域名是否与请求的域名一致、证书的公钥（RSA加密）等进行校验；; 二、客户端如果校验通过后，就根据证书的公钥的有效， 生成随机数，随机数使用公钥进行加密（RSA加密）；; 三、消息体产生的后","date":"2022-01-03T00:00:00.000Z","category":["基础知识"],"tag":["计算机网络","面经"]},["/posts/baseknowledge/基础知识-操作系统-面经.html","/posts/baseknowledge/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86-%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F-%E9%9D%A2%E7%BB%8F","/posts/baseknowledge/基础知识-操作系统-面经.md","/posts/baseknowledge/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86-%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F-%E9%9D%A2%E7%BB%8F.md"]],
  ["v-48d2a58d","/posts/baseknowledge/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86-%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C-%E9%9D%A2%E7%BB%8F.html",{"title":"操作系统","icon":"edit","type":"article","readingTime":{"minutes":32.7,"words":9809},"excerpt":"操作系统 进程 进程 vs 线程 进程(process)与线程(thread)最大的区别是进程拥有自己的地址空间，某进程内的线程对于其他进程不可见，即进程A不能通过传地址的方式直接读写进程B的存储区域。进程之间的通信需要通过进程间通信(Inter-process communication，IPC)。与之相对的，同一进程的各线程间之间可以直接通过传递地址或全","date":"2022-01-03T00:00:00.000Z","category":["基础知识"],"tag":["操作系统","面经"]},["/posts/baseknowledge/基础知识-计算机网络-面经.html","/posts/baseknowledge/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86-%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C-%E9%9D%A2%E7%BB%8F","/posts/baseknowledge/基础知识-计算机网络-面经.md","/posts/baseknowledge/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86-%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C-%E9%9D%A2%E7%BB%8F.md"]],
  ["v-1858945c","/posts/code/K8s-apiserver-run.html",{"title":"kube-apiserver源码","icon":"edit","type":"article","readingTime":{"minutes":4.75,"words":1425},"excerpt":"kube-apiserver源码 1 入口函数 cmd/kube-apiserver/apiserver.go 主要是NewAPIServerCommand()执行,接下来我们就看看他的执行过程 Command创建过程 cmd/kube-apiserver/app/server.go 1 初始化command 核心为其中的Run()函数 server的创建 ","date":"2022-01-03T00:00:00.000Z","category":["源码解读"],"tag":["k8s","apiserver","环境","go","cncf"]},["/posts/code/K8s-apiserver-run","/posts/code/K8s-apiserver-run.md"]],
  ["v-28aafbc8","/posts/code/K8s-informer-reflector.html",{"title":"K8s-informer-reflector源码","icon":"edit","type":"article","readingTime":{"minutes":5.93,"words":1780},"excerpt":"K8s-informer-reflector源码 作用说明 Reflector 用于监控（Watch）指定的 Kubernetes 资源，当监控的资源发生变化时，触发相应的变更事件，例如 Add 事件、Update 事件、Delete 事件，并将其资源对象存放到本地缓存 DeltaFIFO 中。 结构说明 Reflector ListerWatcher 必须","date":"2022-01-03T00:00:00.000Z","category":["源码解读"],"tag":["k8s","informer","环境","go","cncf"]},["/posts/code/K8s-informer-reflector","/posts/code/K8s-informer-reflector.md"]],
  ["v-af6d1ffe","/posts/code/K8s-kubectl-run.html",{"title":"kubectl源码解读","icon":"edit","type":"article","readingTime":{"minutes":5.65,"words":1695},"excerpt":"kubectl源码解读 kubectl 入口函数 cmd/kubectl/kubectl.go 该部分最重要的是NewDefaultKubectlCommand() 接下来我们看一看这个函数具体内容 NewDefaultKubectlCommand() -主函数的执行流程 该函数主要是 初始化Command对象 再将传入的参数解析使用Command对象执行 ","date":"2022-01-03T00:00:00.000Z","category":["源码解读"],"tag":["k8s","kubectl","环境","go","cncf"]},["/posts/code/K8s-kubectl-run","/posts/code/K8s-kubectl-run.md"]],
  ["v-c9884392","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-go-%E5%8E%9F%E7%90%86%E7%9B%B8%E5%85%B3.html",{"title":"go原理相关","icon":"edit","type":"article","readingTime":{"minutes":21.63,"words":6490},"excerpt":"go原理相关 一 堆内存模型 基于 TCMalloc 多级缓存 # 内存分配器不仅会区别对待大小不同的对象，还会将内存分成不同的级别分别管理，TCMalloc 和 Go 运行时分配器都会引入线程缓存（Thread Cache）、中心缓存（Central Cache）和页堆（Page Heap）三个组件分级管理内存： 图 7-6 多级缓存内存分配 线程缓存属于","date":"2022-01-03T00:00:00.000Z","category":["编程语言"],"tag":["golang","原理"]},["/posts/language/编程语言-go-原理相关.html","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-go-%E5%8E%9F%E7%90%86%E7%9B%B8%E5%85%B3","/posts/language/编程语言-go-原理相关.md","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-go-%E5%8E%9F%E7%90%86%E7%9B%B8%E5%85%B3.md"]],
  ["v-1c22cb96","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-dubbo.html",{"title":"Dubbo笔记","icon":"edit","type":"article","readingTime":{"minutes":4.38,"words":1313},"excerpt":"Dubbo笔记 Dubbo admin监控管理 sudo docker run -d -p 2181:2181 --name zookeeper zookeeper docker run -p 8080:8080 -d -e admin.registry.address=zookeeper://zookeeper:2181 -e admin.config-c","date":"2022-01-03T00:00:00.000Z","category":["编程语言"],"tag":["java","web"]},["/posts/language/编程语言-java-dubbo.html","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-dubbo","/posts/language/编程语言-java-dubbo.md","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-dubbo.md"]],
  ["v-47792baa","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-mybatis-plus.html",{"title":"","icon":"edit","type":"article","readingTime":{"minutes":4.53,"words":1359},"excerpt":"十一 MyBatis-Plus 1基本配置 数据库建表 applications.yml配置 Bean下面创建User.java Mapper文件夹下面创建UserMapper.java 启动类添加扫描注解 text类测试 2 常用注解 名称 描述： ------------------------ -----------------------------","date":"2022-01-03T00:00:00.000Z","category":["编程语言"],"tag":["java","web"]},["/posts/language/编程语言-java-mybatis-plus.html","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-mybatis-plus","/posts/language/编程语言-java-mybatis-plus.md","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-mybatis-plus.md"]],
  ["v-0e739540","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springboot.html",{"title":"spring boot 教程","icon":"edit","type":"article","readingTime":{"minutes":12.89,"words":3867},"excerpt":"spring boot 教程 插件 maven 一 入门 helloword探究 1 pom文件 1 父项目 2 导入依赖 2 主程序 主入口 3 运行类 3 端口改变 在 resources 下面的applicatuon.properties 二 配置文件 1 application.properties 2 application.yaml 3 值的绑定","date":"2022-01-01T00:00:00.000Z","category":["编程语言"],"tag":["java","web"]},["/posts/language/编程语言-java-springboot.html","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springboot","/posts/language/编程语言-java-springboot.md","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springboot.md"]],
  ["v-1cc36fe2","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springboot%E8%BF%9B%E9%98%B6.html",{"title":"springboot进阶使用","icon":"edit","type":"article","readingTime":{"minutes":8.87,"words":2662},"excerpt":"springboot进阶使用 一 缓存 重要概念&缓存注解 Cache 缓存接口，定义缓存操作。实现有：redisCache，EhCacheCache，ConcurrentMapCache等 -------------- ------------------------------------------------------------ CacheMan","date":"2022-01-02T00:00:00.000Z","category":["编程语言"],"tag":["java","web"],"star":true},["/posts/language/编程语言-java-springboot进阶.html","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springboot%E8%BF%9B%E9%98%B6","/posts/language/编程语言-java-springboot进阶.md","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springboot%E8%BF%9B%E9%98%B6.md"]],
  ["v-355c4aaa","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springcloud.html",{"title":"spring cloud","icon":"edit","type":"article","readingTime":{"minutes":16.28,"words":4884},"excerpt":"spring cloud 项目构建 版本依赖 dependencies 创建文件夹 hello-spring-cloud-dependencies 创建一个pom.xml \"hello-spring-cloud-dependencies\" \"\" \"pom.xml\" 服务注册与发现 eureka 创建文件夹 hello-spring-cloud-eureka ","date":"2022-01-03T00:00:00.000Z","category":["编程语言"],"tag":["java","web"]},["/posts/language/编程语言-java-springcloud.html","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springcloud","/posts/language/编程语言-java-springcloud.md","/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-java-springcloud.md"]],
  ["v-511c7947","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%8E%9F%E7%90%86.html",{"title":"docker原理","icon":"edit","type":"article","readingTime":{"minutes":6.92,"words":2076},"excerpt":"docker原理 Namespace 技术 Namespace 技术则是用来修改进程视图的主要方法。 本来，每当我们在宿主机上运行了一个 /bin/sh 程序，操作系统都会给它分配一个进程编号，比如 PID=100。这个编号是进程的唯一标识，就像员工的工牌一样。所以 PID=100，可以粗略地理解为这个 /bin/sh 是我们公司里的第 100 号员工，而第","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["docker","原理","go","cncf"]},["/posts/cloudnative/云原生-Docker-原理.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%8E%9F%E7%90%86","/posts/cloudnative/云原生-Docker-原理.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%8E%9F%E7%90%86.md"]],
  ["v-3c33bfe2","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%AD%98%E5%82%A8.html",{"title":"docker中rootfs，UnionFS ，layer关系","icon":"edit","type":"article","readingTime":{"minutes":10.38,"words":3115},"excerpt":"docker中rootfs，UnionFS ，layer关系 rootfs 为了能够让容器的这个根目录看起来更“真实”，我们一般会在这个容器的根目录下挂载一个完整操作系统的文件系统，比如 Ubuntu16.04 的 ISO。这样，在容器启动之后，我们在容器里通过执行 \"ls /\" 查看根目录下的内容，就是 Ubuntu 16.04 的所有目录和文件。 而这个","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["docker","原理","go","cncf"]},["/posts/cloudnative/云原生-Docker-存储.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%AD%98%E5%82%A8","/posts/cloudnative/云原生-Docker-存储.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%AD%98%E5%82%A8.md"]],
  ["v-4215c56e","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E7%BD%91%E7%BB%9C%E6%B5%81%E7%A8%8B.html",{"title":"Docker网络流程","icon":"edit","type":"article","readingTime":{"minutes":6.44,"words":1931},"excerpt":"Docker网络流程 网络栈 “网络栈”，就包括了：网卡、回环设备、路由表和 iptables 规则。对于一个进程来说，这些要素，其实就构成了它发起和响应网络请求的基本环境。 在大多数情况下，我们都希望容器进程能使用自己 Network Namespace 里的网络栈，即：拥有属于自己的 IP 地址和端口。 容器与容器交互原理 如果你想要实现两台主机之间的通","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["docker","网络","go","cncf"]},["/posts/cloudnative/云原生-Docker-网络流程.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E7%BD%91%E7%BB%9C%E6%B5%81%E7%A8%8B","/posts/cloudnative/云原生-Docker-网络流程.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E7%BD%91%E7%BB%9C%E6%B5%81%E7%A8%8B.md"]],
  ["v-fb949372","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-helm%E5%AE%89%E8%A3%85.html",{"title":"","icon":"edit","type":"article","readingTime":{"minutes":0.94,"words":282},"excerpt":"# Helm安装 下载安装包 在官网下载指定想要版本的helm并传入服务器：https://github.com/helm/helm/releases 权限创建 创建rbac-config.yaml，并输入以下内容： 然后执行kubectl create -f rbac-config.yaml 安装tiller 查看tiller是否安装成功 常用命令： 备注","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["k8s","helm","环境","go","cncf"]},["/posts/cloudnative/云原生-Kubernetes-helm安装.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-helm%E5%AE%89%E8%A3%85","/posts/cloudnative/云原生-Kubernetes-helm安装.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-helm%E5%AE%89%E8%A3%85.md"]],
  ["v-345af680","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8D%95%E6%9C%BA%E9%83%A8%E7%BD%B2.html",{"title":"k8s 单机部署","icon":"edit","type":"article","readingTime":{"minutes":1.99,"words":597},"excerpt":"k8s 单机部署 关闭防火墙 systemctl status firewalld service iptables status 安装docker 设置阿里云yum仓库并安装kubernetes组件 拉取镜像 方法一 方法二 方法三（推荐） 初始化时候直接使用以下命令 kubeadm init --image-repository registry.ali","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["k8s","环境","go","cncf"]},["/posts/cloudnative/云原生-Kubernetes-单机部署.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8D%95%E6%9C%BA%E9%83%A8%E7%BD%B2","/posts/cloudnative/云原生-Kubernetes-单机部署.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8D%95%E6%9C%BA%E9%83%A8%E7%BD%B2.md"]],
  ["v-0b9aa719","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-FlannelUDP.html",{"title":"Flannel UDP模式","icon":"edit","type":"article","readingTime":{"minutes":6.12,"words":1836},"excerpt":"Flannel UDP模式 流程 在今天这篇文章中，我会先从 UDP 模式开始，来为你讲解容器“跨主网络”的实现原理。 在这个例子中，我有两台宿主机。 宿主机 Node 1 上有一个容器 container-1，它的 IP 地址是 100.96.1.2，对应的 docker0 网桥的地址是：100.96.1.1/24。; 宿主机 Node 2 上有一个容器 ","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["k8s","apiserver","cni","环境","go","cncf"]},["/posts/cloudnative/云原生-Kubernetes-原理-FlannelUDP.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-FlannelUDP","/posts/cloudnative/云原生-Kubernetes-原理-FlannelUDP.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-FlannelUDP.md"]],
  ["v-0b92cb1d","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-apiserver.html",{"title":"kubernetes  APIServer工作原理","icon":"edit","type":"article","readingTime":{"minutes":4.31,"words":1294},"excerpt":"kubernetes APIServer工作原理 APIserver设计 在 Kubernetes 项目中，一个 API 对象在 Etcd 里的完整资源路径，是由：Group（API 组）、Version（API 版本）和 Resource（API 资源类型）三个部分组成的。 通过这样的结构，整个 Kubernetes 里的所有 API 对象，实际上就可以用","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["k8s","apiserver","环境","go","cncf"]},["/posts/cloudnative/云原生-Kubernetes-原理-apiserver.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-apiserver","/posts/cloudnative/云原生-Kubernetes-原理-apiserver.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-apiserver.md"]],
  ["v-0f186abb","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0.html",{"title":"k8s 中Service、DNS与服务发现","icon":"edit","type":"article","readingTime":{"minutes":3.8,"words":1140},"excerpt":"k8s 中Service、DNS与服务发现 Service创建过程 举个例子，对于创建的名叫 hostnames 的 Service 来说，一旦它被提交给 Kubernetes，那么 kube-proxy 就可以通过 Service 的 Informer 感知到这样一个 Service 对象的添加。而作为对这个事件的响应，它就会在宿主机上创建这样一条 ipt","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["k8s","apiserver","环境","go","cncf"]},["/posts/cloudnative/云原生-Kubernetes-原理-服务发现.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0","/posts/cloudnative/云原生-Kubernetes-原理-服务发现.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0.md"]],
  ["v-2ac38bbb","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-cicd-jenkins-webhook.html",{"title":"jenkins 利用Gitee  WebHook触发流水线","icon":"edit","type":"article","readingTime":{"minutes":4.71,"words":1412},"excerpt":"jenkins 利用Gitee WebHook触发流水线 插件安装 在线安装 前往 Manage Jenkins -> Manage Plugins -> Available; 右侧 Filter 输入： Gitee; 下方可选列表中勾选 Gitee（如列表中不存在 Gitee，则点击 Check now 更新插件列表）; 点击 Download now a","date":"2022-01-03T00:00:00.000Z","category":["云原生"],"tag":["cicd","云原生"]},["/posts/cloudnative/云原生-cicd-jenkins-webhook.html","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-cicd-jenkins-webhook","/posts/cloudnative/云原生-cicd-jenkins-webhook.md","/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-cicd-jenkins-webhook.md"]],
  ["v-3706649a","/404.html",{"title":"","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/404"]],
  ["v-5bc93818","/category/",{"title":"分类","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/category/index.html"]],
  ["v-744d024e","/tag/",{"title":"标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/index.html"]],
  ["v-e52c881c","/article/",{"title":"文章","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/article/index.html"]],
  ["v-75ed4ea4","/encrypted/",{"title":"加密","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/encrypted/index.html"]],
  ["v-2897d318","/slides/",{"title":"幻灯片","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/slides/index.html"]],
  ["v-154dc4c4","/star/",{"title":"收藏","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/star/index.html"]],
  ["v-01560935","/timeline/",{"title":"时间轴","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/timeline/index.html"]],
  ["v-3fe1292c","/category/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/",{"title":"基础知识 分类","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/category/基础知识/","/category/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/index.html"]],
  ["v-7812146a","/tag/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/",{"title":"计算机网络 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/计算机网络/","/tag/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/index.html"]],
  ["v-05a92276","/category/%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/",{"title":"源码解读 分类","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/category/源码解读/","/category/%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/index.html"]],
  ["v-5626848a","/tag/%E9%9D%A2%E7%BB%8F/",{"title":"面经 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/面经/","/tag/%E9%9D%A2%E7%BB%8F/index.html"]],
  ["v-3df94dfd","/category/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/",{"title":"编程语言 分类","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/category/编程语言/","/category/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/index.html"]],
  ["v-10a04a2f","/tag/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/",{"title":"操作系统 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/操作系统/","/tag/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/index.html"]],
  ["v-6193b4f4","/category/%E4%BA%91%E5%8E%9F%E7%94%9F/",{"title":"云原生 分类","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/category/云原生/","/category/%E4%BA%91%E5%8E%9F%E7%94%9F/index.html"]],
  ["v-b30ea152","/tag/k8s/",{"title":"k8s 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/k8s/index.html"]],
  ["v-42f6f280","/tag/apiserver/",{"title":"apiserver 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/apiserver/index.html"]],
  ["v-e9bea91e","/tag/%E7%8E%AF%E5%A2%83/",{"title":"环境 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/环境/","/tag/%E7%8E%AF%E5%A2%83/index.html"]],
  ["v-0da0c339","/tag/go/",{"title":"go 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/go/index.html"]],
  ["v-2844d653","/tag/cncf/",{"title":"cncf 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/cncf/index.html"]],
  ["v-5e079a8b","/tag/informer/",{"title":"informer 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/informer/index.html"]],
  ["v-5b56c322","/tag/kubectl/",{"title":"kubectl 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/kubectl/index.html"]],
  ["v-0033da0b","/tag/golang/",{"title":"golang 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/golang/index.html"]],
  ["v-6e3f2a98","/tag/%E5%8E%9F%E7%90%86/",{"title":"原理 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/原理/","/tag/%E5%8E%9F%E7%90%86/index.html"]],
  ["v-28a1d8bf","/tag/java/",{"title":"java 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/java/index.html"]],
  ["v-b3026aae","/tag/web/",{"title":"web 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/web/index.html"]],
  ["v-6106c001","/tag/docker/",{"title":"docker 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/docker/index.html"]],
  ["v-ec4438a6","/tag/%E7%BD%91%E7%BB%9C/",{"title":"网络 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/网络/","/tag/%E7%BD%91%E7%BB%9C/index.html"]],
  ["v-28875723","/tag/helm/",{"title":"helm 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/helm/index.html"]],
  ["v-b3145442","/tag/cni/",{"title":"cni 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/cni/index.html"]],
  ["v-2842903a","/tag/cicd/",{"title":"cicd 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/cicd/index.html"]],
  ["v-d33dba88","/tag/%E4%BA%91%E5%8E%9F%E7%94%9F/",{"title":"云原生 标签","type":"page","readingTime":{"minutes":0,"words":0},"excerpt":""},["/tag/云原生/","/tag/%E4%BA%91%E5%8E%9F%E7%94%9F/index.html"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, meta, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta,
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)