export const data = {
  "key": "v-79fdd481",
  "path": "/home.html",
  "title": "个人介绍",
  "lang": "zh-CN",
  "frontmatter": {
    "home": false,
    "icon": "relation",
    "title": "个人介绍",
    "heroImage": "/logo.svg",
    "heroText": "个人介绍",
    "tagline": "你可以在这里放置或是整个项目的描述。",
    "actions": [
      {
        "text": "博客主页 🏠",
        "link": "/zh/",
        "type": "secondary"
      }
    ],
    "copyright": false,
    "footer": "备案号 鄂ICP备19011705号-2  | Copyright © 2022-present 方玉龙",
    "summary": "云原生领域程序员，目前就职于阿里云。 仰望星空，脚踏实地。 联系方式：QQ 3095329264",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/home.html"
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
          "content": "个人介绍"
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
      ]
    ]
  },
  "excerpt": "",
  "headers": [],
  "readingTime": {
    "minutes": 0.1,
    "words": 30
  },
  "filePathRelative": "home.md"
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
