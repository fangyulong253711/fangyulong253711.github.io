---
icon: edit
date: 2022-01-03
category:
  - 云原生
tag:
  - k8s
  - 环境
  - go
  - cncf
---
# k8s 单机部署

## 关闭防火墙

systemctl status firewalld

service  iptables status





## 安装`docker`

```shell
// 安装docker
$ yum install -y docker-ce
// 开机启动 && 启动服务
$ systemctl enable docker && systemctl start docker
```



## 设置阿里云yum仓库并安装kubernetes组件

```sh
# cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
 
# yum -y install kubelet-1.13* kubeadm-1.13* kubectl-1.13*

# apt install   kubelet=1.15.9-00 kubeadm=1.15.9-00 kubectl=1.15.9-00
# systemctl start kubelet
# systemctl enable kubelet
```

## 拉取镜像

### 方法一

```shell
// 查看kubeadm镜像
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
$ for i in `kubeadm config images list`; do 
  imageName=${i#k8s.gcr.io/}
  docker pull registry.aliyuncs.com/google_containers/$imageName
  docker tag registry.aliyuncs.com/google_containers/$imageName k8s.gcr.io/$imageName
  docker rmi registry.aliyuncs.com/google_containers/$imageName
done;

// 开机启动 && 启动服务
$ systemctl enable kubelet && systemctl start kubelet
```







### 方法二

```sh
docker pull mirrorgooglecontainers/kube-apiserver:v1.13.2
docker pull mirrorgooglecontainers/kube-controller-manager:v1.13.2
docker pull mirrorgooglecontainers/kube-scheduler:v1.13.2
docker pull mirrorgooglecontainers/kube-proxy:v1.13.2
docker pull mirrorgooglecontainers/pause:3.1
docker pull mirrorgooglecontainers/etcd:3.2.24
docker pull coredns/coredns:1.2.6
 
docker tag mirrorgooglecontainers/kube-apiserver:v1.13.2 k8s.gcr.io/kube-apiserver:v1.13.2
docker tag mirrorgooglecontainers/kube-controller-manager:v1.13.2 k8s.gcr.io/kube-controller-manager:v1.13.2
docker tag mirrorgooglecontainers/kube-scheduler:v1.13.2 k8s.gcr.io/kube-scheduler:v1.13.2
docker tag mirrorgooglecontainers/kube-proxy:v1.13.2 k8s.gcr.io/kube-proxy:v1.13.2
docker tag mirrorgooglecontainers/pause:3.1 k8s.gcr.io/pause:3.1
docker tag mirrorgooglecontainers/etcd:3.2.24 k8s.gcr.io/etcd:3.2.24
docker tag coredns/coredns:1.2.6 k8s.gcr.io/coredns:1.2.6
```

### 方法三（推荐）

初始化时候直接使用以下命令

kubeadm init --image-repository registry.aliyuncs.com/google_containers --ignore-preflight-errors=Swap  --pod-network-cidr=10.100.0.0/16

## 初始化

### 节点

kubeadm init --image-repository registry.aliyuncs.com/google_containers --ignore-preflight-errors=Swap  --pod-network-cidr=10.100.0.0/16



### 文件初始化

显示成功之后

mkdir -p $HOME/.kube

 sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

 sudo chown $(id -u):$(id -g) $HOME/.kube/config





## 设置单击模式（运行master节点跑node）

```php
kubectl taint nodes --all node-role.kubernetes.io/master-
```



## 部署网络插件

 kubectl apply -f https:*//cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')*



## 部署成功

```shell
[root@instance-vpoiaq2d ~]# kubectl get pods --all-namespaces
NAMESPACE     NAME                                        READY   STATUS    RESTARTS   AGE
kube-system   coredns-6587c6dc7-4655v                     1/1     Running   0          5m26s
kube-system   coredns-6587c6dc7-b2k2t                     1/1     Running   0          5m26s
kube-system   etcd-instance-vpoiaq2d                      1/1     Running   0          4m42s
kube-system   kube-apiserver-instance-vpoiaq2d            1/1     Running   0          4m29s
kube-system   kube-controller-manager-instance-vpoiaq2d   1/1     Running   0          4m42s
kube-system   kube-proxy-6s8x7                            1/1     Running   0          5m26s
kube-system   kube-scheduler-instance-vpoiaq2d            1/1     Running   0          4m35s
kube-system   weave-net-84pfl                             2/2     Running   0          105s
[root@instance-vpoiaq2d ~]# kubectl get node
NAME                STATUS   ROLES    AGE     VERSION
instance-vpoiaq2d   Ready    master   5m52s   v1.13.12
```



## 

