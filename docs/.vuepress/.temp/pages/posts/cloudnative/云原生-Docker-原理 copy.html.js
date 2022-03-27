export const data = {
  "key": "v-f219eeda",
  "path": "/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%8E%9F%E7%90%86%20copy.html",
  "title": "docker原理",
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
    "summary": "docker原理 Namespace 技术 Namespace 技术则是用来修改进程视图的主要方法。 本来，每当我们在宿主机上运行了一个 /bin/sh 程序，操作系统都会给它分配一个进程编号，比如 PID=100。这个编号是进程的唯一标识，就像员工的工牌一样。所以 PID=100，可以粗略地理解为这个 /bin/sh 是我们公司里的第 100 号员工，而第",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/cloudnative/%E4%BA%91%E5%8E%9F%E7%94%9F-Docker-%E5%8E%9F%E7%90%86%20copy.html"
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
          "content": "docker原理"
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
  "headers": [
    {
      "level": 2,
      "title": "Namespace 技术",
      "slug": "namespace-技术",
      "children": []
    },
    {
      "level": 2,
      "title": "Cgroups 技术",
      "slug": "cgroups-技术",
      "children": []
    },
    {
      "level": 2,
      "title": "UnionFS",
      "slug": "unionfs",
      "children": []
    }
  ],
  "readingTime": {
    "minutes": 6.92,
    "words": 2076
  },
  "filePathRelative": "posts/cloudnative/云原生-Docker-原理 copy.md"
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
