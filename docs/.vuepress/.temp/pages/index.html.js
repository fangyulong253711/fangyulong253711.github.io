export const data = {
  "key": "v-8daa1a0e",
  "path": "/",
  "title": "博客主页",
  "lang": "zh-CN",
  "frontmatter": {
    "home": true,
    "layout": "Blog",
    "icon": "home",
    "title": "博客主页",
    "heroImage": "/user.png",
    "heroText": "方玉龙(loganfang)",
    "heroFullScreen": true,
    "tagline": "一位云原生领域程序员",
    "projects": [
      {
        "icon": "project",
        "name": "项目名称",
        "desc": "gitee链接包含所有项目",
        "link": "https://gitee.com/fangyulong253711"
      },
      {
        "icon": "friend",
        "name": "个人介绍",
        "desc": "阿里云云原生开发工程师",
        "link": "./home.html"
      }
    ],
    "footer": "备案号 鄂ICP备19011705号-2",
    "summary": "<!-- 这是一个博客主页。 要使用此布局，你应该在页面前端设置 layout: Blog 和 home: true。 相关配置文档请见 博客主页。 -->",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/"
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
          "content": "博客主页"
        }
      ],
      [
        "meta",
        {
          "property": "og:type",
          "content": "website"
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
    "minutes": 0.17,
    "words": 50
  },
  "filePathRelative": "README.md"
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
