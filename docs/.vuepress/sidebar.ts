import { defineSidebarConfig } from "vuepress-theme-hope";

export default defineSidebarConfig([
  "",
  "home",
  // "slide",
  // {
  //   text: "如何使用",
  //   icon: "creative",
  //   prefix: "guide/",
  //   link: "guide/",
  //   children: "structure",
  // },
  // {
  //   text: "文章",
  //   icon: "note",
  //   prefix: "posts/",
  //   children: [
  //     {
  //       text: "文章 1-4",
  //       icon: "note",
  //       collapsable: true,
  //       prefix: "article/",
  //       children: ["article1"],
  //     }
  //   ],
  // },
  {
    text: "源码分析",
    icon: "code",
    prefix: "/posts/",
    children: [
      {
        text: "kubernetes",
        icon: "calculate",
        prefix: "code/",
        children: [
          { text: "k8s-informer-reflector", icon: "code", link: "K8s-informer-reflector.html" },
          { text: "K8s-apiserver-run", icon: "code", link: "K8s-apiserver-run.html" },
          { text: "K8s-kubectl-run", icon: "code", link: "K8s-kubectl-run.html" },
        ],
      },

    ],
  },
  {
    text: "知识分享",
    icon: "info",
    prefix: "/posts/",
    children: [
      {
        text: "编程语言",
        icon: "calculate",
        collapsable: true,
        prefix: "language/",
        children: [
          { text: "java-springboot", icon: "check", link: "编程语言-java-springboot.html" },
          { text: "java-springboot进阶", icon: "check", link: "编程语言-java-springboot进阶.html" },
          { text: "java-mybatis-plus", icon: "check", link: "编程语言-java-mybatis-plus.html" },
          { text: "java-dubbo", icon: "check", link: "编程语言-java-dubbo.html" },
          { text: "java-cloud", icon: "check", link: "编程语言-java-springcloud.html" },
          { text: "go-原理", icon: "check", link: "编程语言-go-原理相关.html" },
        ],
      },
      {
        text: "基础知识",
        icon: "blog",
        collapsable: true,
        prefix: "baseknowledge/",
        children: [
          { text: "操作系统-面经", icon: "check", link: "基础知识-操作系统-面经.html" },
          { text: "计算机网络-面经", icon: "check", link: "基础知识-计算机网络-面经.html" },
        ],
      },
      {
        text: "云原生",
        icon: "blog",
        prefix: "cloudnative/",
        collapsable: true,
        children: [
          { text: "cicd-jenkins-webhook", icon: "check", link: "云原生-cicd-jenkins-webhook.html" },
          { text: "Docker-网络流程", icon: "check", link: "云原生-Docker-网络流程.html" },
          { text: "Docker-原理", icon: "check", link: "云原生-Docker-原理.html" },
          { text: "Docker-存储", icon: "check", link: "云原生-Docker-存储.html" },
          { text: "Kubernetes-单机部署", icon: "check", link: "云原生-Kubernetes-单机部署.html" },
          { text: "Kubernetes-helm安装", icon: "check", link: "云原生-Kubernetes-helm安装.html" },
          { text: "Kubernetes-原理-apiserver", icon: "check", link: "云原生-Kubernetes-原理-apiserver.html" },
          { text: "Kubernetes-原理-服务发现", icon: "check", link: "云原生-Kubernetes-原理-服务发现.html" },
          { text: "Kubernetes-原理-FlannelUDP", icon: "check", link: "云原生-Kubernetes-原理-FlannelUDP.html" },
        ],
      },


    ],
  },
]);
