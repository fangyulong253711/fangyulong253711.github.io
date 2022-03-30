export const themeData = {
  "blog": {
    "description": "一个云原生领域开发者",
    "intro": "/home.html",
    "medias": {
      "Email": "3095329264@qq.com",
      "Gitee": "https://gitee.com/fangyulong253711",
      "GitHub": "https://github.com/fangyulong253711",
      "QQ": "https://qm.qq.com/cgi-bin/qm/qr?k=VMRJSO0uRq1gC4RE7qkSDVQHK0k6_p50&noverify=0"
    }
  },
  "encrypt": {},
  "pure": false,
  "iconPrefix": "iconfont icon-",
  "darkmode": "auto-switch",
  "themeColor": {
    "red": "#e74c3c",
    "blue": "#3498db",
    "green": "#3eaf7c",
    "orange": "#f39c12",
    "purple": "#8e44ad"
  },
  "fullscreen": true,
  "locales": {
    "/": {
      "blog": {
        "description": "一个云原生领域开发者",
        "intro": "/home.html",
        "medias": {
          "Email": "3095329264@qq.com",
          "Gitee": "https://gitee.com/fangyulong253711",
          "GitHub": "https://github.com/fangyulong253711",
          "QQ": "https://qm.qq.com/cgi-bin/qm/qr?k=VMRJSO0uRq1gC4RE7qkSDVQHK0k6_p50&noverify=0"
        }
      },
      "repoDisplay": true,
      "navbarIcon": true,
      "navbarAutoHide": "mobile",
      "hideSiteNameonMobile": true,
      "sidebar": [
        "",
        "home",
        {
          "text": "源码分析",
          "icon": "code",
          "prefix": "/posts/",
          "children": [
            {
              "text": "kubernetes",
              "icon": "calculate",
              "prefix": "code/",
              "children": [
                {
                  "text": "k8s-informer-reflector",
                  "icon": "code",
                  "link": "K8s-informer-reflector.html"
                },
                {
                  "text": "k8s-informer-SharedInformer",
                  "icon": "code",
                  "link": "k8s-informer-SharedInformer.html"
                },
                {
                  "text": "K8s-apiserver-run",
                  "icon": "code",
                  "link": "K8s-apiserver-run.html"
                },
                {
                  "text": "K8s-kubectl-run",
                  "icon": "code",
                  "link": "K8s-kubectl-run.html"
                }
              ]
            }
          ]
        },
        {
          "text": "知识分享",
          "icon": "info",
          "prefix": "/posts/",
          "children": [
            {
              "text": "编程语言",
              "icon": "calculate",
              "collapsable": true,
              "prefix": "language/",
              "children": [
                {
                  "text": "java-springboot",
                  "icon": "check",
                  "link": "编程语言-java-springboot.html"
                },
                {
                  "text": "java-springboot进阶",
                  "icon": "check",
                  "link": "编程语言-java-springboot进阶.html"
                },
                {
                  "text": "java-mybatis-plus",
                  "icon": "check",
                  "link": "编程语言-java-mybatis-plus.html"
                },
                {
                  "text": "java-dubbo",
                  "icon": "check",
                  "link": "编程语言-java-dubbo.html"
                },
                {
                  "text": "java-cloud",
                  "icon": "check",
                  "link": "编程语言-java-springcloud.html"
                },
                {
                  "text": "go-原理",
                  "icon": "check",
                  "link": "编程语言-go-原理相关.html"
                }
              ]
            },
            {
              "text": "基础知识",
              "icon": "blog",
              "collapsable": true,
              "prefix": "baseknowledge/",
              "children": [
                {
                  "text": "操作系统-面经",
                  "icon": "check",
                  "link": "基础知识-操作系统-面经.html"
                },
                {
                  "text": "计算机网络-面经",
                  "icon": "check",
                  "link": "基础知识-计算机网络-面经.html"
                }
              ]
            },
            {
              "text": "云原生",
              "icon": "blog",
              "prefix": "cloudnative/",
              "collapsable": true,
              "children": [
                {
                  "text": "cicd-jenkins-webhook",
                  "icon": "check",
                  "link": "云原生-cicd-jenkins-webhook.html"
                },
                {
                  "text": "Docker-网络流程",
                  "icon": "check",
                  "link": "云原生-Docker-网络流程.html"
                },
                {
                  "text": "Docker-原理",
                  "icon": "check",
                  "link": "云原生-Docker-原理.html"
                },
                {
                  "text": "Docker-存储",
                  "icon": "check",
                  "link": "云原生-Docker-存储.html"
                },
                {
                  "text": "Kubernetes-单机部署",
                  "icon": "check",
                  "link": "云原生-Kubernetes-单机部署.html"
                },
                {
                  "text": "Kubernetes-helm安装",
                  "icon": "check",
                  "link": "云原生-Kubernetes-helm安装.html"
                },
                {
                  "text": "Kubernetes-原理-apiserver",
                  "icon": "check",
                  "link": "云原生-Kubernetes-原理-apiserver.html"
                },
                {
                  "text": "Kubernetes-原理-服务发现",
                  "icon": "check",
                  "link": "云原生-Kubernetes-原理-服务发现.html"
                },
                {
                  "text": "Kubernetes-原理-FlannelUDP",
                  "icon": "check",
                  "link": "云原生-Kubernetes-原理-FlannelUDP.html"
                }
              ]
            }
          ]
        }
      ],
      "sidebarIcon": true,
      "headerDepth": 2,
      "author": {
        "name": "方玉龙",
        "url": "https://mrhope.site"
      },
      "logo": "/user.png",
      "docsDir": "demo/src",
      "navbar": [
        "/",
        "/home",
        {
          "text": "源码分析",
          "icon": "code",
          "prefix": "/posts/",
          "children": [
            {
              "text": "kubernetes",
              "icon": "calculate",
              "prefix": "code/",
              "children": [
                {
                  "text": "k8s-informer-SharedInformer",
                  "icon": "code",
                  "link": "k8s-informer-SharedInformer.html"
                },
                {
                  "text": "k8s-informer-reflector",
                  "icon": "code",
                  "link": "K8s-informer-reflector.html"
                },
                {
                  "text": "K8s-apiserver-run",
                  "icon": "code",
                  "link": "K8s-apiserver-run.html"
                },
                {
                  "text": "K8s-kubectl-run",
                  "icon": "code",
                  "link": "K8s-kubectl-run.html"
                }
              ]
            }
          ]
        },
        {
          "text": "知识分享",
          "icon": "info",
          "prefix": "/posts/",
          "children": [
            {
              "text": "编程语言",
              "icon": "calculate",
              "prefix": "language/",
              "children": [
                {
                  "text": "java-springboot",
                  "icon": "check",
                  "link": "编程语言-java-springboot.html"
                },
                {
                  "text": "java-springboot进阶",
                  "icon": "check",
                  "link": "编程语言-java-springboot进阶.html"
                },
                {
                  "text": "java-mybatis-plus",
                  "icon": "check",
                  "link": "编程语言-java-mybatis-plus.html"
                },
                {
                  "text": "java-dubbo",
                  "icon": "check",
                  "link": "编程语言-java-dubbo.html"
                },
                {
                  "text": "java-cloud",
                  "icon": "check",
                  "link": "编程语言-java-springcloud.html"
                },
                {
                  "text": "go-原理",
                  "icon": "check",
                  "link": "编程语言-go-原理相关.html"
                }
              ]
            },
            {
              "text": "基础知识",
              "icon": "blog",
              "prefix": "baseknowledge/",
              "children": [
                {
                  "text": "操作系统-面经",
                  "icon": "check",
                  "link": "基础知识-操作系统-面经.html"
                },
                {
                  "text": "计算机网络-面经",
                  "icon": "check",
                  "link": "基础知识-计算机网络-面经.html"
                }
              ]
            },
            {
              "text": "云原生",
              "icon": "blog",
              "prefix": "cloudnative/",
              "children": [
                {
                  "text": "cicd-jenkins-webhook",
                  "icon": "check",
                  "link": "云原生-cicd-jenkins-webhook.html"
                },
                {
                  "text": "Docker-网络流程",
                  "icon": "check",
                  "link": "云原生-Docker-网络流程.html"
                },
                {
                  "text": "Docker-原理",
                  "icon": "check",
                  "link": "云原生-Docker-原理.html"
                },
                {
                  "text": "Docker-存储",
                  "icon": "check",
                  "link": "云原生-Docker-存储.html"
                },
                {
                  "text": "Kubernetes-单机部署",
                  "icon": "check",
                  "link": "云原生-Kubernetes-单机部署.html"
                },
                {
                  "text": "Kubernetes-helm安装",
                  "icon": "check",
                  "link": "云原生-Kubernetes-helm安装.html"
                },
                {
                  "text": "Kubernetes-原理-apiserver",
                  "icon": "check",
                  "link": "云原生-Kubernetes-原理-apiserver.html"
                },
                {
                  "text": "Kubernetes-原理-服务发现",
                  "icon": "check",
                  "link": "云原生-Kubernetes-原理-服务发现.html"
                },
                {
                  "text": "Kubernetes-原理-FlannelUDP",
                  "icon": "check",
                  "link": "云原生-Kubernetes-原理-FlannelUDP.html"
                }
              ]
            }
          ]
        }
      ],
      "footer": "备案号 鄂ICP备19011705号-2 ",
      "displayFooter": true,
      "pageInfo": [
        "Author",
        "Original",
        "Date",
        "Category",
        "Tag",
        "ReadingTime"
      ],
      "lang": "zh-CN",
      "navbarLocales": {
        "langName": "简体中文",
        "selectLangText": "选择语言",
        "selectLangAriaLabel": "选择语言"
      },
      "metaLocales": {
        "prev": "上一页",
        "next": "下一页",
        "lastUpdated": "上次编辑于",
        "contributors": "贡献者",
        "editLink": "编辑此页"
      },
      "blogLocales": {
        "article": "文章",
        "articleList": "文章列表",
        "category": "分类",
        "tag": "标签",
        "timeline": "时间轴",
        "timelineTitle": "昨日不在",
        "all": "全部",
        "intro": "个人介绍",
        "star": "收藏",
        "slides": "幻灯片",
        "encrypt": "加密"
      },
      "outlookLocales": {
        "themeColor": "主题色",
        "darkmode": "外观",
        "fullscreen": "全屏"
      },
      "encryptLocales": {
        "title": "请输入密码",
        "errorHint": "请输入正确密码"
      },
      "routeLocales": {
        "404msg": [
          "这里什么也没有",
          "我们是怎么来到这儿的？",
          "这 是 四 零 四 !",
          "看起来你访问了一个失效的链接"
        ],
        "back": "返回上一页",
        "home": "带我回家"
      }
    }
  }
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
