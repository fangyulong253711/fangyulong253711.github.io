export const data = {
  "key": "v-c9884392",
  "path": "/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-go-%E5%8E%9F%E7%90%86%E7%9B%B8%E5%85%B3.html",
  "title": "go原理相关",
  "lang": "zh-CN",
  "frontmatter": {
    "icon": "edit",
    "date": "2022-01-03T00:00:00.000Z",
    "category": [
      "编程语言"
    ],
    "tag": [
      "golang",
      "原理"
    ],
    "summary": "go原理相关 一 堆内存模型 基于 TCMalloc 多级缓存 # 内存分配器不仅会区别对待大小不同的对象，还会将内存分成不同的级别分别管理，TCMalloc 和 Go 运行时分配器都会引入线程缓存（Thread Cache）、中心缓存（Central Cache）和页堆（Page Heap）三个组件分级管理内存： 图 7-6 多级缓存内存分配 线程缓存属于",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/language/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80-go-%E5%8E%9F%E7%90%86%E7%9B%B8%E5%85%B3.html"
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
          "content": "go原理相关"
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
          "content": "golang"
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
      "title": "基于 TCMalloc",
      "slug": "基于-tcmalloc",
      "children": []
    },
    {
      "level": 2,
      "title": "三色标记",
      "slug": "三色标记",
      "children": []
    },
    {
      "level": 2,
      "title": "屏障机制",
      "slug": "屏障机制",
      "children": [
        {
          "level": 3,
          "title": "强三色不变式",
          "slug": "强三色不变式",
          "children": []
        },
        {
          "level": 3,
          "title": "弱三色不变式",
          "slug": "弱三色不变式",
          "children": []
        },
        {
          "level": 3,
          "title": "插入屏障(只对堆有效)",
          "slug": "插入屏障-只对堆有效",
          "children": []
        },
        {
          "level": 3,
          "title": "删除屏障(只对堆有效)",
          "slug": "删除屏障-只对堆有效",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "混合写屏障",
      "slug": "混合写屏障",
      "children": []
    },
    {
      "level": 2,
      "title": "设计原理",
      "slug": "设计原理",
      "children": [
        {
          "level": 3,
          "title": "寄存器",
          "slug": "寄存器",
          "children": []
        },
        {
          "level": 3,
          "title": "线程栈",
          "slug": "线程栈",
          "children": []
        },
        {
          "level": 3,
          "title": "逃逸分析",
          "slug": "逃逸分析",
          "children": []
        },
        {
          "level": 3,
          "title": "栈内存空间",
          "slug": "栈内存空间",
          "children": []
        }
      ]
    }
  ],
  "git": {},
  "readingTime": {
    "minutes": 21.63,
    "words": 6490
  },
  "filePathRelative": "posts/language/编程语言-go-原理相关.md"
}
