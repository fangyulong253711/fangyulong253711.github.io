import { defineThemeConfig } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default defineThemeConfig({
  hostname: "https://vuepress-theme-hope-v2-demo.mrhope.site",

  author: {
    name: "方玉龙",
    url: "https://mrhope.site",
  },

  iconPrefix: "iconfont icon-",

  logo: "/user.png",

  // repo: "https://github.com/vuepress-theme-hope/vuepress-theme-hope",

  docsDir: "demo/src",

  // navbar
  navbar: navbar,

  // sidebar
  sidebar: sidebar,

  footer: "备案号 鄂ICP备19011705号-2 ",

  displayFooter: true,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  blog: {
    description: "一个云原生领域开发者",
    intro: "/home.html",
    medias: {
      Email: "3095329264@qq.com",
      Gitee: "https://gitee.com/fangyulong253711",
      GitHub: "https://github.com/fangyulong253711",
      QQ: "https://qm.qq.com/cgi-bin/qm/qr?k=VMRJSO0uRq1gC4RE7qkSDVQHK0k6_p50&noverify=0",
    },
  },

  // encrypt: {
  //   config: {
  //     "/guide/encrypt.html": ["1234"],
  //   },
  // },

  plugins: {
    search: {
      locales: {
        "/zh/": {
          placeholder: "搜索",
        },
      }
    },

    blog: {
      autoExcerpt: true,
    },

    // // 你也可以使用 Waline
    // comment: {
    //   type: "giscus",
    //   repo: "vuepress-theme-hope/giscus-discussions",
    //   repoId: "R_kgDOG_Pt2A",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOG_Pt2M4COD69",
    // },

    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
    },
  },
});
