export const data = {
  "key": "v-25f4135b",
  "path": "/posts/code/k8s-informer-SharedInformer.html",
  "title": "K8s-SharedInformer源码分析",
  "lang": "zh-CN",
  "frontmatter": {
    "icon": "edit",
    "date": "2022-01-03T00:00:00.000Z",
    "category": [
      "源码解读"
    ],
    "tag": [
      "k8s",
      "informer",
      "环境",
      "go",
      "cncf"
    ],
    "summary": "K8s-SharedInformer源码分析 作用说明 SharedInformer，它是可以共享使用的。如果同一个资源的 Informer 被实例化多次，那么就会运行多个 ListAndWatch 操作，这会加大 APIServer 的压力。而 SharedInformer 通过一个 map 来让同一类资源的 Informer 实现共享一个 Refelct",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/code/k8s-informer-SharedInformer.html"
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
          "content": "K8s-SharedInformer源码分析"
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
          "content": "informer"
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
      "title": "作用说明",
      "slug": "作用说明",
      "children": []
    },
    {
      "level": 2,
      "title": "结构说明",
      "slug": "结构说明",
      "children": [
        {
          "level": 3,
          "title": "sharedIndexInformer",
          "slug": "sharedindexinformer",
          "children": []
        },
        {
          "level": 3,
          "title": "controller",
          "slug": "controller",
          "children": []
        },
        {
          "level": 3,
          "title": "sharedIndexInformer",
          "slug": "sharedindexinformer-1",
          "children": []
        }
      ]
    }
  ],
  "readingTime": {
    "minutes": 4.23,
    "words": 1269
  },
  "filePathRelative": "posts/code/k8s-informer-SharedInformer.md"
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
