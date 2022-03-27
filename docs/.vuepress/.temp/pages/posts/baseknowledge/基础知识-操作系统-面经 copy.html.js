export const data = {
  "key": "v-a5c839d2",
  "path": "/posts/baseknowledge/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86-%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F-%E9%9D%A2%E7%BB%8F%20copy.html",
  "title": "操作系统",
  "lang": "zh-CN",
  "frontmatter": {
    "icon": "edit",
    "date": "2022-01-03T00:00:00.000Z",
    "category": [
      "基础知识"
    ],
    "tag": [
      "操作系统",
      "面经"
    ],
    "summary": "操作系统 进程 进程 vs 线程 进程(process)与线程(thread)最大的区别是进程拥有自己的地址空间，某进程内的线程对于其他进程不可见，即进程A不能通过传地址的方式直接读写进程B的存储区域。进程之间的通信需要通过进程间通信(Inter-process communication，IPC)。与之相对的，同一进程的各线程间之间可以直接通过传递地址或全",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/baseknowledge/%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86-%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F-%E9%9D%A2%E7%BB%8F%20copy.html"
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
          "content": "操作系统"
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
          "content": "操作系统"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "面经"
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
      "title": "进程",
      "slug": "进程",
      "children": [
        {
          "level": 3,
          "title": "进程 vs 线程",
          "slug": "进程-vs-线程",
          "children": []
        },
        {
          "level": 3,
          "title": "进程调度",
          "slug": "进程调度",
          "children": []
        },
        {
          "level": 3,
          "title": "守护、僵尸、孤儿进程的概念",
          "slug": "守护、僵尸、孤儿进程的概念",
          "children": []
        },
        {
          "level": 3,
          "title": "进程通信",
          "slug": "进程通信",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "内存",
      "slug": "内存",
      "children": [
        {
          "level": 3,
          "title": "逻辑地址 Vs 物理地址 Vs 虚拟内存",
          "slug": "逻辑地址-vs-物理地址-vs-虚拟内存",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "锁",
      "slug": "锁",
      "children": [
        {
          "level": 3,
          "title": "请问死锁的条件是什么？以及如何处理死锁问题？",
          "slug": "请问死锁的条件是什么-以及如何处理死锁问题",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "中断与系统调用",
      "slug": "中断与系统调用",
      "children": [
        {
          "level": 3,
          "title": "用户态和内核态区别",
          "slug": "用户态和内核态区别",
          "children": []
        },
        {
          "level": 3,
          "title": "中断和中断种类",
          "slug": "中断和中断种类",
          "children": []
        },
        {
          "level": 3,
          "title": "系统调用",
          "slug": "系统调用",
          "children": []
        }
      ]
    }
  ],
  "readingTime": {
    "minutes": 32.7,
    "words": 9809
  },
  "filePathRelative": "posts/baseknowledge/基础知识-操作系统-面经 copy.md"
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
