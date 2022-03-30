export const data = {
  "key": "v-0b9aa719",
  "path": "/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-FlannelUDP.html",
  "title": "Flannel UDP模式",
  "lang": "zh-CN",
  "frontmatter": {
    "icon": "edit",
    "date": "2022-01-03T00:00:00.000Z",
    "category": [
      "云原生"
    ],
    "tag": [
      "k8s",
      "apiserver",
      "cni",
      "环境",
      "go",
      "cncf"
    ],
    "summary": "Flannel UDP模式 流程 在今天这篇文章中，我会先从 UDP 模式开始，来为你讲解容器“跨主网络”的实现原理。 在这个例子中，我有两台宿主机。 宿主机 Node 1 上有一个容器 container-1，它的 IP 地址是 100.96.1.2，对应的 docker0 网桥的地址是：100.96.1.1/24。; 宿主机 Node 2 上有一个容器 ",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-FlannelUDP.html"
        }
      ],
      [
        "meta",
        {
          "property": "og:site_name",
          "content": "方玉龙的博客"
        }
      ],
      [
        "meta",
        {
          "property": "og:title",
          "content": "Flannel UDP模式"
        }
      ],
      [
        "meta",
        {
          "property": "og:type",
          "content": "article"
        }
      ],
      [
        "meta",
        {
          "property": "og:locale",
          "content": "zh-CN"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "k8s"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "apiserver"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "cni"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "环境"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "go"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "cncf"
        }
      ],
      [
        "meta",
        {
          "property": "article:published_time",
          "content": "2022-01-03T00:00:00.000Z"
        }
      ]
    ]
  },
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "流程",
      "slug": "流程",
      "children": []
    },
    {
      "level": 2,
      "title": "缺点",
      "slug": "缺点",
      "children": []
    }
  ],
  "readingTime": {
    "minutes": 6.12,
    "words": 1836
  },
  "filePathRelative": "posts/cloudnative/云原生-Kubernetes-原理-FlannelUDP.md"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
