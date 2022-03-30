import { defineNavbarConfig } from "vuepress-theme-hope";

export default defineNavbarConfig([
  "/",
  "/home",
  // { text: "使用指南", icon: "creative", link: "/guide/" },
  

  // {
  //   text: "前沿技术",
  //   icon: "guide",
  //   prefix: "/posts/",
  //   children: [
  //     {
  //       text: "文章 1-4",
  //       icon: "calculate",
  //       prefix: "article/",
  //       children: [
  //         { text: "文章 1", icon: "edit", link: "article1" },
  //         { text: "文章 2", icon: "edit", link: "article2" },
  //         "article3",
  //         "article4",
  //       ],
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
          { text: "k8s-informer-SharedInformer", icon: "code", link: "k8s-informer-SharedInformer.html" },
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

  // {
  //   text: "主题文档",
  //   icon: "note",
  //   link: "https://vuepress-theme-hope.github.io/v2/zh/",
  // },
]);
