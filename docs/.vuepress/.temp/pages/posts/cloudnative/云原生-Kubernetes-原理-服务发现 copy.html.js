export const data = {
  "key": "v-35de4c9f",
  "path": "/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%20copy.html",
  "title": "k8s 中Service、DNS与服务发现",
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
      "环境",
      "go",
      "cncf"
    ],
    "summary": "k8s 中Service、DNS与服务发现 Service创建过程 举个例子，对于创建的名叫 hostnames 的 Service 来说，一旦它被提交给 Kubernetes，那么 kube-proxy 就可以通过 Service 的 Informer 感知到这样一个 Service 对象的添加。而作为对这个事件的响应，它就会在宿主机上创建这样一条 ipt",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Kubernetes-%E5%8E%9F%E7%90%86-%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0%20copy.html"
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
          "content": "k8s 中Service、DNS与服务发现"
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
      "title": "Service创建过程",
      "slug": "service创建过程",
      "children": []
    },
    {
      "level": 2,
      "title": "IPVS模式",
      "slug": "ipvs模式",
      "children": []
    }
  ],
  "readingTime": {
    "minutes": 3.8,
    "words": 1140
  },
  "filePathRelative": "posts/cloudnative/云原生-Kubernetes-原理-服务发现 copy.md"
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
