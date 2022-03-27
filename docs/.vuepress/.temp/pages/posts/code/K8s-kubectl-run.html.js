export const data = {
  "key": "v-af6d1ffe",
  "path": "/posts/code/K8s-kubectl-run.html",
  "title": "kubectl源码解读",
  "lang": "zh-CN",
  "frontmatter": {
    "icon": "edit",
    "date": "2022-01-03T00:00:00.000Z",
    "category": [
      "源码解读"
    ],
    "tag": [
      "k8s",
      "kubectl",
      "环境",
      "go",
      "cncf"
    ],
    "summary": "kubectl源码解读 kubectl 入口函数 cmd/kubectl/kubectl.go 该部分最重要的是NewDefaultKubectlCommand() 接下来我们看一看这个函数具体内容 NewDefaultKubectlCommand() -主函数的执行流程 该函数主要是 初始化Command对象 再将传入的参数解析使用Command对象执行 ",
    "head": [
      [
        "meta",
        {
          "property": "og:url",
          "content": "https://vuepress-theme-hope-v2-demo.mrhope.site/posts/code/K8s-kubectl-run.html"
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
          "content": "kubectl源码解读"
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
          "content": "kubectl"
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
      "title": "kubectl 入口函数",
      "slug": "kubectl-入口函数",
      "children": []
    },
    {
      "level": 2,
      "title": "NewDefaultKubectlCommand() -主函数的执行流程",
      "slug": "newdefaultkubectlcommand-主函数的执行流程",
      "children": []
    },
    {
      "level": 2,
      "title": "NewKubectlCommand() - 命令command对象的创建",
      "slug": "newkubectlcommand-命令command对象的创建",
      "children": []
    },
    {
      "level": 2,
      "title": "NewCmdCreate() - create命令详解",
      "slug": "newcmdcreate-create命令详解",
      "children": []
    },
    {
      "level": 2,
      "title": "RunCreate() -create的执行",
      "slug": "runcreate-create的执行",
      "children": []
    }
  ],
  "git": {},
  "readingTime": {
    "minutes": 5.65,
    "words": 1695
  },
  "filePathRelative": "posts/code/K8s-kubectl-run.md"
}
