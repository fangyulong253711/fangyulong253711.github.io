export const data = {
  "key": "v-1858945c",
  "path": "/posts/code/K8s-apiserver-run.html",
  "title": "kube-apiserver源码",
  "lang": "zh-CN",
  "frontmatter": {
    "icon": "edit",
    "date": "2022-01-03T00:00:00.000Z",
    "category": [
      "源码解读"
    ],
    "tag": [
      "k8s",
      "apiserver",
      "环境",
      "go",
      "cncf"
    ],
    "summary": "kube-apiserver源码 1 入口函数 cmd/kube-apiserver/apiserver.go 主要是NewAPIServerCommand()执行,接下来我们就看看他的执行过程 Command创建过程 cmd/kube-apiserver/app/server.go 1 初始化command 核心为其中的Run()函数 server的创建 ",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/code/K8s-apiserver-run.html"
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
          "content": "kube-apiserver源码"
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
      "title": "1 入口函数",
      "slug": "_1-入口函数",
      "children": []
    },
    {
      "level": 2,
      "title": "Command创建过程",
      "slug": "command创建过程",
      "children": []
    },
    {
      "level": 2,
      "title": "server的创建",
      "slug": "server的创建",
      "children": []
    },
    {
      "level": 2,
      "title": "CreateKubeAPIServer()  apiserver的创建",
      "slug": "createkubeapiserver-apiserver的创建",
      "children": []
    },
    {
      "level": 2,
      "title": "GenericConfig.New() 设置的初始化",
      "slug": "genericconfig-new-设置的初始化",
      "children": []
    },
    {
      "level": 2,
      "title": "Apiserver的创建",
      "slug": "apiserver的创建",
      "children": []
    }
  ],
  "readingTime": {
    "minutes": 4.75,
    "words": 1425
  },
  "filePathRelative": "posts/code/K8s-apiserver-run.md"
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
