---
icon: edit
date: 2022-01-03
category:
  - 云原生
tag:
  - k8s
  - helm
  - 环境
  - go
  - cncf
---
[# ](https://note.youdao.com/)Helm安装



## 下载安装包

在官网下载指定想要版本的helm并传入服务器：[https://github.com/helm/helm/releases](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fhelm%2Fhelm%2Freleases)

```shell
tar zxvf helm-xxxxx-linux-amd64.tar.gz
mv liniux-amd64/helm /usr/local/bin
helm version #查看helm client版本
```

## 权限创建

创建rbac-config.yaml，并输入以下内容：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

然后执行`kubectl create -f rbac-config.yaml`

## 安装tiller

```shell
# google源
helm init --service-account tiller --upgrade -i gcr.io/kubernetes-helm/tiller:v2.11.0

# 阿里源
helm init --service-account tiller --upgrade -i registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.11.0 --stable-repo-url https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts
```



## 查看tiller是否安装成功



```shell
[root@k8s-master01 helm]# kubectl get pod -n kube-system -l app=helm
NAME                             READY   STATUS    RESTARTS   AGE
tiller-deploy-66cdf6dfc8-p7x7g   1/1     Running   0          20d
```



## 常用命令：

```php
helm list --all #列出所有部署应用
helm repo list  #列出repo
helm delete --purge <name>  #删除某个应用
helm reset  #重置helm
```



## 备注

### 如何删除tiller

```shell
kubectl get -n kube-system secrets,sa,clusterrolebinding -o name|grep tiller|xargs kubectl -n kube-system delete
kubectl get all -n kube-system -l app=helm -o name|xargs kubectl delete -n kube-system
```







