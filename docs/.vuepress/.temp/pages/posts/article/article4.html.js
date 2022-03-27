export const data = {
  "key": "v-08a2b06d",
  "path": "/posts/article/article4.html",
  "title": "Dubbo笔记",
  "lang": "zh-CN",
  "frontmatter": {
    "icon": "edit",
    "date": "2022-01-03T00:00:00.000Z",
    "category": [
      "编程语言"
    ],
    "tag": [
      "java",
      "web"
    ],
    "summary": "Dubbo笔记 Dubbo admin监控管理 sudo docker run -d -p 2181:2181 --name zookeeper zookeeper docker run -p 8080:8080 -d -e admin.registry.address=zookeeper://zookeeper:2181 -e admin.config-c",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/article/article4.html"
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
          "content": "Dubbo笔记"
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
          "content": "java"
        }
      ],
      [
        "meta",
        {
          "property": "article:tag",
          "content": "web"
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
      "title": "Dubbo admin监控管理",
      "slug": "dubbo-admin监控管理",
      "children": []
    },
    {
      "level": 2,
      "title": "统一的api管理",
      "slug": "统一的api管理",
      "children": []
    },
    {
      "level": 2,
      "title": "服务提供者",
      "slug": "服务提供者",
      "children": []
    },
    {
      "level": 2,
      "title": "负载均衡",
      "slug": "负载均衡",
      "children": [
        {
          "level": 3,
          "title": "Random LoadBalance",
          "slug": "random-loadbalance",
          "children": []
        },
        {
          "level": 3,
          "title": "RoundRobin LoadBalance",
          "slug": "roundrobin-loadbalance",
          "children": []
        },
        {
          "level": 3,
          "title": "LeastActive LoadBalance",
          "slug": "leastactive-loadbalance",
          "children": []
        },
        {
          "level": 3,
          "title": "ConsistentHash LoadBalance",
          "slug": "consistenthash-loadbalance",
          "children": []
        },
        {
          "level": 3,
          "title": "服务端服务级别",
          "slug": "服务端服务级别",
          "children": []
        },
        {
          "level": 3,
          "title": "客户端服务级别",
          "slug": "客户端服务级别",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "高速序列化  kryo",
      "slug": "高速序列化-kryo",
      "children": []
    },
    {
      "level": 2,
      "title": "熔断器  Hystrix",
      "slug": "熔断器-hystrix",
      "children": [
        {
          "level": 3,
          "title": "Dubbo Provider",
          "slug": "dubbo-provider",
          "children": []
        },
        {
          "level": 3,
          "title": "Dubbo Consumer",
          "slug": "dubbo-consumer",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "熔断器仪表盘",
      "slug": "熔断器仪表盘",
      "children": []
    }
  ],
  "readingTime": {
    "minutes": 4.38,
    "words": 1313
  },
  "filePathRelative": "posts/article/article4.md"
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
