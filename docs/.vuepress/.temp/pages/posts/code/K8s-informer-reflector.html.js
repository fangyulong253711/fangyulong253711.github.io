export const data = {
  "key": "v-28aafbc8",
  "path": "/posts/code/K8s-informer-reflector.html",
  "title": "K8s-informer-reflector源码",
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
    "summary": "K8s-informer-reflector源码 作用说明 Reflector 用于监控（Watch）指定的 Kubernetes 资源，当监控的资源发生变化时，触发相应的变更事件，例如 Add 事件、Update 事件、Delete 事件，并将其资源对象存放到本地缓存 DeltaFIFO 中。 结构说明 Reflector ListerWatcher 必须",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/code/K8s-informer-reflector.html"
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
          "content": "K8s-informer-reflector源码"
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
          "title": "Reflector",
          "slug": "reflector",
          "children": []
        },
        {
          "level": 3,
          "title": "ListerWatcher",
          "slug": "listerwatcher",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "执行流程",
      "slug": "执行流程",
      "children": [
        {
          "level": 3,
          "title": "run",
          "slug": "run",
          "children": []
        },
        {
          "level": 3,
          "title": "ListAndWatch",
          "slug": "listandwatch",
          "children": []
        },
        {
          "level": 3,
          "title": "watchHandler",
          "slug": "watchhandler",
          "children": []
        }
      ]
    }
  ],
  "readingTime": {
    "minutes": 5.93,
    "words": 1780
  },
  "filePathRelative": "posts/code/K8s-informer-reflector.md"
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
