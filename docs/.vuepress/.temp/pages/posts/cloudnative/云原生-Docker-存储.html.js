export const data = {
  "key": "v-3c33bfe2",
  "path": "/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%AD%98%E5%82%A8.html",
  "title": "docker中rootfs，UnionFS ，layer关系",
  "lang": "zh-CN",
  "frontmatter": {
    "icon": "edit",
    "date": "2022-01-03T00:00:00.000Z",
    "category": [
      "云原生"
    ],
    "tag": [
      "docker",
      "原理",
      "go",
      "cncf"
    ],
    "summary": "docker中rootfs，UnionFS ，layer关系 rootfs 为了能够让容器的这个根目录看起来更“真实”，我们一般会在这个容器的根目录下挂载一个完整操作系统的文件系统，比如 Ubuntu16.04 的 ISO。这样，在容器启动之后，我们在容器里通过执行 \"ls /\" 查看根目录下的内容，就是 Ubuntu 16.04 的所有目录和文件。 而这个",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%AD%98%E5%82%A8.html"
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
          "content": "docker中rootfs，UnionFS ，layer关系"
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
          "content": "docker"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "原理"
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
  "headers": [],
  "readingTime": {
    "minutes": 10.38,
    "words": 3115
  },
  "filePathRelative": "posts/cloudnative/云原生-Docker-存储.md"
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
