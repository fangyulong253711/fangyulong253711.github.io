import{_ as e,e as n}from"./app.4b919133.js";const s={},a=n(`<h1 id="docker\u4E2Drootfs-unionfs-layer\u5173\u7CFB" tabindex="-1"><a class="header-anchor" href="#docker\u4E2Drootfs-unionfs-layer\u5173\u7CFB" aria-hidden="true">#</a> docker\u4E2Drootfs\uFF0CUnionFS \uFF0Clayer\u5173\u7CFB</h1><h1 id="rootfs" tabindex="-1"><a class="header-anchor" href="#rootfs" aria-hidden="true">#</a> rootfs</h1><p>\u4E3A\u4E86\u80FD\u591F\u8BA9\u5BB9\u5668\u7684\u8FD9\u4E2A\u6839\u76EE\u5F55\u770B\u8D77\u6765\u66F4\u201C\u771F\u5B9E\u201D\uFF0C\u6211\u4EEC\u4E00\u822C\u4F1A\u5728\u8FD9\u4E2A\u5BB9\u5668\u7684\u6839\u76EE\u5F55\u4E0B\u6302\u8F7D\u4E00\u4E2A\u5B8C\u6574\u64CD\u4F5C\u7CFB\u7EDF\u7684\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u6BD4\u5982 Ubuntu16.04 \u7684 ISO\u3002\u8FD9\u6837\uFF0C\u5728\u5BB9\u5668\u542F\u52A8\u4E4B\u540E\uFF0C\u6211\u4EEC\u5728\u5BB9\u5668\u91CC\u901A\u8FC7\u6267\u884C &quot;ls /&quot; \u67E5\u770B\u6839\u76EE\u5F55\u4E0B\u7684\u5185\u5BB9\uFF0C\u5C31\u662F Ubuntu 16.04 \u7684\u6240\u6709\u76EE\u5F55\u548C\u6587\u4EF6\u3002</p><p><strong>\u800C\u8FD9\u4E2A\u6302\u8F7D\u5728\u5BB9\u5668\u6839\u76EE\u5F55\u4E0A\u3001\u7528\u6765\u4E3A\u5BB9\u5668\u8FDB\u7A0B\u63D0\u4F9B\u9694\u79BB\u540E\u6267\u884C\u73AF\u5883\u7684\u6587\u4EF6\u7CFB\u7EDF\uFF0C\u5C31\u662F\u6240\u8C13\u7684\u201C\u5BB9\u5668\u955C\u50CF\u201D\u3002\u5B83\u8FD8\u6709\u4E00\u4E2A\u66F4\u4E3A\u4E13\u4E1A\u7684\u540D\u5B57\uFF0C\u53EB\u4F5C\uFF1Arootfs\uFF08\u6839\u6587\u4EF6\u7CFB\u7EDF\uFF09\u3002</strong></p><p>\u6240\u4EE5\uFF0C\u4E00\u4E2A\u6700\u5E38\u89C1\u7684 rootfs\uFF0C\u6216\u8005\u8BF4\u5BB9\u5668\u955C\u50CF\uFF0C\u4F1A\u5305\u62EC\u5982\u4E0B\u6240\u793A\u7684\u4E00\u4E9B\u76EE\u5F55\u548C\u6587\u4EF6\uFF0C\u6BD4\u5982 /bin\uFF0C/etc\uFF0C/proc \u7B49\u7B49\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ ls /
bin dev etc home lib lib64 mnt opt proc root run sbin sys tmp usr var
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u800C\u4F60\u8FDB\u5165\u5BB9\u5668\u4E4B\u540E\u6267\u884C\u7684 /bin/bash\uFF0C\u5C31\u662F /bin \u76EE\u5F55\u4E0B\u7684\u53EF\u6267\u884C\u6587\u4EF6\uFF0C\u4E0E\u5BBF\u4E3B\u673A\u7684 /bin/bash \u5B8C\u5168\u4E0D\u540C\u3002</p><p>\u73B0\u5728\uFF0C\u4F60\u5E94\u8BE5\u53EF\u4EE5\u7406\u89E3\uFF0C\u5BF9 Docker \u9879\u76EE\u6765\u8BF4\uFF0C\u5B83\u6700\u6838\u5FC3\u7684\u539F\u7406\u5B9E\u9645\u4E0A\u5C31\u662F\u4E3A\u5F85\u521B\u5EFA\u7684\u7528\u6237\u8FDB\u7A0B\uFF1A</p><ol><li>\u542F\u7528 Linux Namespace \u914D\u7F6E\uFF1B</li><li>\u8BBE\u7F6E\u6307\u5B9A\u7684 Cgroups \u53C2\u6570\uFF1B</li><li>\u5207\u6362\u8FDB\u7A0B\u7684\u6839\u76EE\u5F55\uFF08Change Root\uFF09\u3002</li></ol><p>\u8FD9\u6837\uFF0C\u4E00\u4E2A\u5B8C\u6574\u7684\u5BB9\u5668\u5C31\u8BDE\u751F\u4E86\u3002\u4E0D\u8FC7\uFF0CDocker \u9879\u76EE\u5728\u6700\u540E\u4E00\u6B65\u7684\u5207\u6362\u4E0A\u4F1A\u4F18\u5148\u4F7F\u7528 pivot_root \u7CFB\u7EDF\u8C03\u7528\uFF0C\u5982\u679C\u7CFB\u7EDF\u4E0D\u652F\u6301\uFF0C\u624D\u4F1A\u4F7F\u7528 chroot\u3002\u8FD9\u4E24\u4E2A\u7CFB\u7EDF\u8C03\u7528\u867D\u7136\u529F\u80FD\u7C7B\u4F3C\uFF0C\u4F46\u662F\u4E5F\u6709\u7EC6\u5FAE\u7684\u533A\u522B\uFF0C\u8FD9\u4E00\u90E8\u5206\u5C0F\u77E5\u8BC6\u5C31\u4EA4\u7ED9\u4F60\u8BFE\u540E\u53BB\u63A2\u7D22\u4E86\u3002</p><p>\u53E6\u5916\uFF0C<strong>\u9700\u8981\u660E\u786E\u7684\u662F\uFF0Crootfs \u53EA\u662F\u4E00\u4E2A\u64CD\u4F5C\u7CFB\u7EDF\u6240\u5305\u542B\u7684\u6587\u4EF6\u3001\u914D\u7F6E\u548C\u76EE\u5F55\uFF0C\u5E76\u4E0D\u5305\u62EC\u64CD\u4F5C\u7CFB\u7EDF\u5185\u6838\u3002\u5728 Linux \u64CD\u4F5C\u7CFB\u7EDF\u4E2D\uFF0C\u8FD9\u4E24\u90E8\u5206\u662F\u5206\u5F00\u5B58\u653E\u7684\uFF0C\u64CD\u4F5C\u7CFB\u7EDF\u53EA\u6709\u5728\u5F00\u673A\u542F\u52A8\u65F6\u624D\u4F1A\u52A0\u8F7D\u6307\u5B9A\u7248\u672C\u7684\u5185\u6838\u955C\u50CF\u3002</strong></p><h1 id="union-file-system" tabindex="-1"><a class="header-anchor" href="#union-file-system" aria-hidden="true">#</a> Union File System</h1><p><strong>\u7531\u4E8E rootfs \u91CC\u6253\u5305\u7684\u4E0D\u53EA\u662F\u5E94\u7528\uFF0C\u800C\u662F\u6574\u4E2A\u64CD\u4F5C\u7CFB\u7EDF\u7684\u6587\u4EF6\u548C\u76EE\u5F55\uFF0C\u4E5F\u5C31\u610F\u5473\u7740\uFF0C\u5E94\u7528\u4EE5\u53CA\u5B83\u8FD0\u884C\u6240\u9700\u8981\u7684\u6240\u6709\u4F9D\u8D56\uFF0C\u90FD\u88AB\u5C01\u88C5\u5728\u4E86\u4E00\u8D77\u3002</strong></p><p>\u4E8B\u5B9E\u4E0A\uFF0C\u5BF9\u4E8E\u5927\u591A\u6570\u5F00\u53D1\u8005\u800C\u8A00\uFF0C\u4ED6\u4EEC\u5BF9\u5E94\u7528\u4F9D\u8D56\u7684\u7406\u89E3\uFF0C\u4E00\u76F4\u5C40\u9650\u5728\u7F16\u7A0B\u8BED\u8A00\u5C42\u9762\u3002\u6BD4\u5982 Golang \u7684 Godeps.json\u3002\u4F46\u5B9E\u9645\u4E0A\uFF0C\u4E00\u4E2A\u4E00\u76F4\u4EE5\u6765\u5F88\u5BB9\u6613\u88AB\u5FFD\u89C6\u7684\u4E8B\u5B9E\u662F\uFF0C<strong>\u5BF9\u4E00\u4E2A\u5E94\u7528\u6765\u8BF4\uFF0C\u64CD\u4F5C\u7CFB\u7EDF\u672C\u8EAB\u624D\u662F\u5B83\u8FD0\u884C\u6240\u9700\u8981\u7684\u6700\u5B8C\u6574\u7684\u201C\u4F9D\u8D56\u5E93\u201D\u3002</strong></p><p>\u6709\u4E86\u5BB9\u5668\u955C\u50CF\u201C\u6253\u5305\u64CD\u4F5C\u7CFB\u7EDF\u201D\u7684\u80FD\u529B\uFF0C\u8FD9\u4E2A\u6700\u57FA\u7840\u7684\u4F9D\u8D56\u73AF\u5883\u4E5F\u7EC8\u4E8E\u53D8\u6210\u4E86\u5E94\u7528\u6C99\u76D2\u7684\u4E00\u90E8\u5206\u3002\u8FD9\u5C31\u8D4B\u4E88\u4E86\u5BB9\u5668\u6240\u8C13\u7684\u4E00\u81F4\u6027\uFF1A\u65E0\u8BBA\u5728\u672C\u5730\u3001\u4E91\u7AEF\uFF0C\u8FD8\u662F\u5728\u4E00\u53F0\u4EFB\u4F55\u5730\u65B9\u7684\u673A\u5668\u4E0A\uFF0C\u7528\u6237\u53EA\u9700\u8981\u89E3\u538B\u6253\u5305\u597D\u7684\u5BB9\u5668\u955C\u50CF\uFF0C\u90A3\u4E48\u8FD9\u4E2A\u5E94\u7528\u8FD0\u884C\u6240\u9700\u8981\u7684\u5B8C\u6574\u7684\u6267\u884C\u73AF\u5883\u5C31\u88AB\u91CD\u73B0\u51FA\u6765\u4E86\u3002</p><p><strong>\u8FD9\u79CD\u6DF1\u5165\u5230\u64CD\u4F5C\u7CFB\u7EDF\u7EA7\u522B\u7684\u8FD0\u884C\u73AF\u5883\u4E00\u81F4\u6027\uFF0C\u6253\u901A\u4E86\u5E94\u7528\u5728\u672C\u5730\u5F00\u53D1\u548C\u8FDC\u7AEF\u6267\u884C\u73AF\u5883\u4E4B\u95F4\u96BE\u4EE5\u903E\u8D8A\u7684\u9E3F\u6C9F\u3002</strong></p><p>\u4E0D\u8FC7\uFF0C\u8FD9\u65F6\u4F60\u53EF\u80FD\u5DF2\u7ECF\u53D1\u73B0\u4E86\u53E6\u4E00\u4E2A\u975E\u5E38\u68D8\u624B\u7684\u95EE\u9898\uFF1A\u96BE\u9053\u6211\u6BCF\u5F00\u53D1\u4E00\u4E2A\u5E94\u7528\uFF0C\u6216\u8005\u5347\u7EA7\u4E00\u4E0B\u73B0\u6709\u7684\u5E94\u7528\uFF0C\u90FD\u8981\u91CD\u590D\u5236\u4F5C\u4E00\u6B21 rootfs \u5417\uFF1F</p><p>\u6BD4\u5982\uFF0C\u6211\u73B0\u5728\u7528 Ubuntu \u64CD\u4F5C\u7CFB\u7EDF\u7684 ISO \u505A\u4E86\u4E00\u4E2A rootfs\uFF0C\u7136\u540E\u53C8\u5728\u91CC\u9762\u5B89\u88C5\u4E86 Java \u73AF\u5883\uFF0C\u7528\u6765\u90E8\u7F72\u6211\u7684 Java \u5E94\u7528\u3002\u90A3\u4E48\uFF0C\u6211\u7684\u53E6\u4E00\u4E2A\u540C\u4E8B\u5728\u53D1\u5E03\u4ED6\u7684 Java \u5E94\u7528\u65F6\uFF0C\u663E\u7136\u5E0C\u671B\u80FD\u591F\u76F4\u63A5\u4F7F\u7528\u6211\u5B89\u88C5\u8FC7 Java \u73AF\u5883\u7684 rootfs\uFF0C\u800C\u4E0D\u662F\u91CD\u590D\u8FD9\u4E2A\u6D41\u7A0B\u3002</p><p>\u4E00\u79CD\u6BD4\u8F83\u76F4\u89C2\u7684\u89E3\u51B3\u529E\u6CD5\u662F\uFF0C\u6211\u5728\u5236\u4F5C rootfs \u7684\u65F6\u5019\uFF0C\u6BCF\u505A\u4E00\u6B65\u201C\u6709\u610F\u4E49\u201D\u7684\u64CD\u4F5C\uFF0C\u5C31<strong>\u4FDD\u5B58\u4E00\u4E2A rootfs \u51FA\u6765</strong>\uFF0C\u8FD9\u6837\u5176\u4ED6\u540C\u4E8B\u5C31\u53EF\u4EE5\u6309\u9700\u6C42\u53BB\u7528\u4ED6\u9700\u8981\u7684 rootfs \u4E86\u3002</p><p>\u4F46\u662F\uFF0C\u8FD9\u4E2A\u89E3\u51B3\u529E\u6CD5\u5E76\u4E0D\u5177\u5907\u63A8\u5E7F\u6027\u3002\u539F\u56E0\u5728\u4E8E\uFF0C\u4E00\u65E6\u4F60\u7684\u540C\u4E8B\u4EEC\u4FEE\u6539\u4E86\u8FD9\u4E2A rootfs\uFF0C\u65B0\u65E7\u4E24\u4E2A rootfs \u4E4B\u95F4\u5C31\u6CA1\u6709\u4EFB\u4F55\u5173\u7CFB\u4E86\u3002\u8FD9\u6837\u505A\u7684\u7ED3\u679C\u5C31\u662F\u6781\u5EA6\u7684\u788E\u7247\u5316\u3002</p><p>\u90A3\u4E48\uFF0C\u65E2\u7136\u8FD9\u4E9B\u4FEE\u6539\u90FD\u57FA\u4E8E\u4E00\u4E2A\u65E7\u7684 rootfs\uFF0C\u6211\u4EEC\u80FD\u4E0D\u80FD\u4EE5\u589E\u91CF\u7684\u65B9\u5F0F\u53BB\u505A\u8FD9\u4E9B\u4FEE\u6539\u5462\uFF1F\u8FD9\u6837\u505A\u7684\u597D\u5904\u662F\uFF0C\u6240\u6709\u4EBA\u90FD\u53EA\u9700\u8981\u7EF4\u62A4\u76F8\u5BF9\u4E8E base rootfs \u4FEE\u6539\u7684\u589E\u91CF\u5185\u5BB9\uFF0C\u800C\u4E0D\u662F\u6BCF\u6B21\u4FEE\u6539\u90FD\u5236\u9020\u4E00\u4E2A\u201Cfork\u201D\u3002</p><p>\u7B54\u6848\u5F53\u7136\u662F\u80AF\u5B9A\u7684\u3002</p><p>\u8FD9\u4E5F\u6B63\u662F\u4E3A\u4F55\uFF0CDocker \u516C\u53F8\u5728\u5B9E\u73B0 Docker \u955C\u50CF\u65F6\u5E76\u6CA1\u6709\u6CBF\u7528\u4EE5\u524D\u5236\u4F5C rootfs \u7684\u6807\u51C6\u6D41\u7A0B\uFF0C\u800C\u662F\u505A\u4E86\u4E00\u4E2A\u5C0F\u5C0F\u7684\u521B\u65B0\uFF1A</p><blockquote><p>Docker \u5728\u955C\u50CF\u7684\u8BBE\u8BA1\u4E2D\uFF0C\u5F15\u5165\u4E86\u5C42\uFF08layer\uFF09\u7684\u6982\u5FF5\u3002\u4E5F\u5C31\u662F\u8BF4\uFF0C\u7528\u6237\u5236\u4F5C\u955C\u50CF\u7684\u6BCF\u4E00\u6B65\u64CD\u4F5C\uFF0C\u90FD\u4F1A\u751F\u6210\u4E00\u4E2A\u5C42\uFF0C\u4E5F\u5C31\u662F\u4E00\u4E2A\u589E\u91CF rootfs\u3002</p></blockquote><p>\u5F53\u7136\uFF0C\u8FD9\u4E2A\u60F3\u6CD5\u4E0D\u662F\u51ED\u7A7A\u81C6\u9020\u51FA\u6765\u7684\uFF0C\u800C\u662F\u7528\u5230\u4E86\u4E00\u79CD\u53EB\u4F5C\u8054\u5408\u6587\u4EF6\u7CFB\u7EDF\uFF08Union File System\uFF09\u7684\u80FD\u529B\u3002</p><p>Union File System \u4E5F\u53EB UnionFS\uFF0C\u6700\u4E3B\u8981\u7684\u529F\u80FD\u662F\u5C06\u591A\u4E2A\u4E0D\u540C\u4F4D\u7F6E\u7684\u76EE\u5F55\u8054\u5408\u6302\u8F7D\uFF08union mount\uFF09\u5230\u540C\u4E00\u4E2A\u76EE\u5F55\u4E0B\u3002\u6BD4\u5982\uFF0C\u6211\u73B0\u5728\u6709\u4E24\u4E2A\u76EE\u5F55 A \u548C B\uFF0C\u5B83\u4EEC\u5206\u522B\u6709\u4E24\u4E2A\u6587\u4EF6\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ tree
.
\u251C\u2500\u2500 A
\u2502  \u251C\u2500\u2500 a
\u2502  \u2514\u2500\u2500 x
\u2514\u2500\u2500 B
  \u251C\u2500\u2500 b
  \u2514\u2500\u2500 x
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>\u7136\u540E\uFF0C\u6211\u4F7F\u7528\u8054\u5408\u6302\u8F7D\u7684\u65B9\u5F0F\uFF0C\u5C06\u8FD9\u4E24\u4E2A\u76EE\u5F55\u6302\u8F7D\u5230\u4E00\u4E2A\u516C\u5171\u7684\u76EE\u5F55 C \u4E0A\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ mkdir C
$ mount -t aufs -o dirs=./A:./B none ./C
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u8FD9\u65F6\uFF0C\u6211\u518D\u67E5\u770B\u76EE\u5F55 C \u7684\u5185\u5BB9\uFF0C\u5C31\u80FD\u770B\u5230\u76EE\u5F55 A \u548C B \u4E0B\u7684\u6587\u4EF6\u88AB\u5408\u5E76\u5230\u4E86\u4E00\u8D77\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ tree ./C
./C
\u251C\u2500\u2500 a
\u251C\u2500\u2500 b
\u2514\u2500\u2500 x
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>\u53EF\u4EE5\u770B\u5230\uFF0C\u5728\u8FD9\u4E2A\u5408\u5E76\u540E\u7684\u76EE\u5F55 C \u91CC\uFF0C\u6709 a\u3001b\u3001x \u4E09\u4E2A\u6587\u4EF6\uFF0C\u5E76\u4E14 x \u6587\u4EF6\u53EA\u6709\u4E00\u4EFD\u3002\u8FD9\uFF0C\u5C31\u662F\u201C\u5408\u5E76\u201D\u7684\u542B\u4E49\u3002\u6B64\u5916\uFF0C\u5982\u679C\u4F60\u5728\u76EE\u5F55 C \u91CC\u5BF9 a\u3001b\u3001x \u6587\u4EF6\u505A\u4FEE\u6539\uFF0C\u8FD9\u4E9B\u4FEE\u6539\u4E5F\u4F1A\u5728\u5BF9\u5E94\u7684\u76EE\u5F55 A\u3001B \u4E2D\u751F\u6548\u3002</p><p>\u90A3\u4E48\uFF0C\u5728 Docker \u9879\u76EE\u4E2D\uFF0C\u53C8\u662F\u5982\u4F55\u4F7F\u7528\u8FD9\u79CD Union File System \u7684\u5462\uFF1F</p><p>\u6211\u7684\u73AF\u5883\u662F Ubuntu 16.04 \u548C Docker CE 18.05\uFF0C\u8FD9\u5BF9\u7EC4\u5408\u9ED8\u8BA4\u4F7F\u7528\u7684\u662F AuFS \u8FD9\u4E2A\u8054\u5408\u6587\u4EF6\u7CFB\u7EDF\u7684\u5B9E\u73B0\u3002\u4F60\u53EF\u4EE5\u901A\u8FC7 docker info \u547D\u4EE4\uFF0C\u67E5\u770B\u5230\u8FD9\u4E2A\u4FE1\u606F\u3002</p><p>AuFS \u7684\u5168\u79F0\u662F Another UnionFS\uFF0C\u540E\u6539\u540D\u4E3A Alternative UnionFS\uFF0C\u518D\u540E\u6765\u5E72\u8106\u6539\u540D\u53EB\u4F5C Advance UnionFS\uFF0C\u4ECE\u8FD9\u4E9B\u540D\u5B57\u4E2D\u4F60\u5E94\u8BE5\u80FD\u770B\u51FA\u8FD9\u6837\u4E24\u4E2A\u4E8B\u5B9E\uFF1A</p><ol><li>\u5B83\u662F\u5BF9 Linux \u539F\u751F UnionFS \u7684\u91CD\u5199\u548C\u6539\u8FDB\uFF1B</li><li>\u5B83\u7684\u4F5C\u8005\u6028\u6C14\u597D\u50CF\u5F88\u5927\u3002\u6211\u731C\u662F Linus Torvalds\uFF08Linux \u4E4B\u7236\uFF09\u4E00\u76F4\u4E0D\u8BA9 AuFS \u8FDB\u5165 Linux \u5185\u6838\u4E3B\u5E72\u7684\u7F18\u6545\uFF0C\u6240\u4EE5\u6211\u4EEC\u53EA\u80FD\u5728 Ubuntu \u548C Debian \u8FD9\u4E9B\u53D1\u884C\u7248\u4E0A\u4F7F\u7528\u5B83\u3002</li></ol><p>\u5BF9\u4E8E AuFS \u6765\u8BF4\uFF0C\u5B83\u6700\u5173\u952E\u7684\u76EE\u5F55\u7ED3\u6784\u5728 /var/lib/docker \u8DEF\u5F84\u4E0B\u7684 diff \u76EE\u5F55\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>/var/lib/docker/aufs/diff/&lt;layer_id&gt;
\uE613\u590D\u5236\u4EE3\u7801
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p><strong>\u800C\u8FD9\u4E2A\u76EE\u5F55\u7684\u4F5C\u7528\uFF0C\u6211\u4EEC\u4E0D\u59A8\u901A\u8FC7\u4E00\u4E2A\u5177\u4F53\u4F8B\u5B50\u6765\u770B\u4E00\u4E0B\u3002</strong></p><p>\u73B0\u5728\uFF0C\u6211\u4EEC\u542F\u52A8\u4E00\u4E2A\u5BB9\u5668\uFF0C\u6BD4\u5982\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ docker run -d ubuntu:latest sleep 3600
\uE613\u590D\u5236\u4EE3\u7801
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u8FD9\u65F6\u5019\uFF0CDocker \u5C31\u4F1A\u4ECE Docker Hub \u4E0A\u62C9\u53D6\u4E00\u4E2A Ubuntu \u955C\u50CF\u5230\u672C\u5730\u3002</p><h1 id="layer" tabindex="-1"><a class="header-anchor" href="#layer" aria-hidden="true">#</a> layer</h1><p>\u8FD9\u4E2A\u6240\u8C13\u7684\u201C\u955C\u50CF\u201D\uFF0C\u5B9E\u9645\u4E0A\u5C31\u662F\u4E00\u4E2A Ubuntu \u64CD\u4F5C\u7CFB\u7EDF\u7684 rootfs\uFF0C\u5B83\u7684\u5185\u5BB9\u662F Ubuntu \u64CD\u4F5C\u7CFB\u7EDF\u7684\u6240\u6709\u6587\u4EF6\u548C\u76EE\u5F55\u3002\u4E0D\u8FC7\uFF0C\u4E0E\u4E4B\u524D\u6211\u4EEC\u8BB2\u8FF0\u7684 rootfs \u7A0D\u5FAE\u4E0D\u540C\u7684\u662F\uFF0CDocker \u955C\u50CF\u4F7F\u7528\u7684 rootfs\uFF0C\u5F80\u5F80\u7531\u591A\u4E2A\u201C\u5C42\u201D\u7EC4\u6210\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ docker image inspect ubuntu:latest
...
     &quot;RootFS&quot;: {
      &quot;Type&quot;: &quot;layers&quot;,
      &quot;Layers&quot;: [
        &quot;sha256:f49017d4d5ce9c0f544c...&quot;,
        &quot;sha256:8f2b771487e9d6354080...&quot;,
        &quot;sha256:ccd4d61916aaa2159429...&quot;,
        &quot;sha256:c01d74f99de40e097c73...&quot;,
        &quot;sha256:268a067217b5fe78e000...&quot;
      ]
    }
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>\u53EF\u4EE5\u770B\u5230\uFF0C\u8FD9\u4E2A Ubuntu \u955C\u50CF\uFF0C\u5B9E\u9645\u4E0A\u7531\u4E94\u4E2A\u5C42\u7EC4\u6210\u3002\u8FD9\u4E94\u4E2A\u5C42\u5C31\u662F\u4E94\u4E2A\u589E\u91CF rootfs\uFF0C\u6BCF\u4E00\u5C42\u90FD\u662F Ubuntu \u64CD\u4F5C\u7CFB\u7EDF\u6587\u4EF6\u4E0E\u76EE\u5F55\u7684\u4E00\u90E8\u5206\uFF1B\u800C\u5728\u4F7F\u7528\u955C\u50CF\u65F6\uFF0CDocker \u4F1A\u628A\u8FD9\u4E9B\u589E\u91CF\u8054\u5408\u6302\u8F7D\u5728\u4E00\u4E2A\u7EDF\u4E00\u7684\u6302\u8F7D\u70B9\u4E0A\uFF08\u7B49\u4EF7\u4E8E\u524D\u9762\u4F8B\u5B50\u91CC\u7684\u201C/C\u201D\u76EE\u5F55\uFF09\u3002</p><p>\u8FD9\u4E2A\u6302\u8F7D\u70B9\u5C31\u662F /var/lib/docker/aufs/mnt/\uFF0C\u6BD4\u5982\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>/var/lib/docker/aufs/mnt/6e3be5d2ecccae7cc0fcfa2a2f5c89dc21ee30e166be823ceaeba15dce645b3e
\uE613\u590D\u5236\u4EE3\u7801
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u4E0D\u51FA\u610F\u5916\u7684\uFF0C\u8FD9\u4E2A\u76EE\u5F55\u91CC\u9762\u6B63\u662F\u4E00\u4E2A\u5B8C\u6574\u7684 Ubuntu \u64CD\u4F5C\u7CFB\u7EDF\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ ls /var/lib/docker/aufs/mnt/6e3be5d2ecccae7cc0fcfa2a2f5c89dc21ee30e166be823ceaeba15dce645b3e
bin boot dev etc home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u90A3\u4E48\uFF0C\u524D\u9762\u63D0\u5230\u7684\u4E94\u4E2A\u955C\u50CF\u5C42\uFF0C\u53C8\u662F\u5982\u4F55\u88AB\u8054\u5408\u6302\u8F7D\u6210\u8FD9\u6837\u4E00\u4E2A\u5B8C\u6574\u7684 Ubuntu \u6587\u4EF6\u7CFB\u7EDF\u7684\u5462\uFF1F</p><p>\u8FD9\u4E2A\u4FE1\u606F\u8BB0\u5F55\u5728 AuFS \u7684\u7CFB\u7EDF\u76EE\u5F55 /sys/fs/aufs \u4E0B\u9762\u3002</p><p>\u9996\u5148\uFF0C\u901A\u8FC7\u67E5\u770B AuFS \u7684\u6302\u8F7D\u4FE1\u606F\uFF0C\u6211\u4EEC\u53EF\u4EE5\u627E\u5230\u8FD9\u4E2A\u76EE\u5F55\u5BF9\u5E94\u7684 AuFS \u7684\u5185\u90E8 ID\uFF08\u4E5F\u53EB\uFF1Asi\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ cat /proc/mounts| grep aufs
none /var/lib/docker/aufs/mnt/6e3be5d2ecccae7cc0fc... aufs rw,relatime,si=972c6d361e6b32ba,dio,dirperm1 0 0
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u5373\uFF0Csi=972c6d361e6b32ba\u3002</p><p>\u7136\u540E\u4F7F\u7528\u8FD9\u4E2A ID\uFF0C\u4F60\u5C31\u53EF\u4EE5\u5728 /sys/fs/aufs \u4E0B\u67E5\u770B\u88AB\u8054\u5408\u6302\u8F7D\u5728\u4E00\u8D77\u7684\u5404\u4E2A\u5C42\u7684\u4FE1\u606F\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ cat /sys/fs/aufs/si_972c6d361e6b32ba/br[0-9]*
/var/lib/docker/aufs/diff/6e3be5d2ecccae7cc...=rw
/var/lib/docker/aufs/diff/6e3be5d2ecccae7cc...-init=ro+wh
/var/lib/docker/aufs/diff/32e8e20064858c0f2...=ro+wh
/var/lib/docker/aufs/diff/2b8858809bce62e62...=ro+wh
/var/lib/docker/aufs/diff/20707dce8efc0d267...=ro+wh
/var/lib/docker/aufs/diff/72b0744e06247c7d0...=ro+wh
/var/lib/docker/aufs/diff/a524a729adadedb90...=ro+wh
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>\u4ECE\u8FD9\u4E9B\u4FE1\u606F\u91CC\uFF0C\u6211\u4EEC\u53EF\u4EE5\u770B\u5230\uFF0C\u955C\u50CF\u7684\u5C42\u90FD\u653E\u7F6E\u5728 /var/lib/docker/aufs/diff \u76EE\u5F55\u4E0B\uFF0C\u7136\u540E\u88AB\u8054\u5408\u6302\u8F7D\u5728 /var/lib/docker/aufs/mnt \u91CC\u9762\u3002</p><p><strong>\u800C\u4E14\uFF0C\u4ECE\u8FD9\u4E2A\u7ED3\u6784\u53EF\u4EE5\u770B\u51FA\u6765\uFF0C\u8FD9\u4E2A\u5BB9\u5668\u7684 rootfs \u7531\u5982\u4E0B\u6240\u793A\u7684\u4E09\u90E8\u5206\u7EC4\u6210\uFF1A</strong></p><p><strong>\u7B2C\u4E00\u90E8\u5206\uFF0C\u53EA\u8BFB\u5C42\u3002</strong></p><p>\u5B83\u662F\u8FD9\u4E2A\u5BB9\u5668\u7684 rootfs \u6700\u4E0B\u9762\u7684\u4E94\u5C42\uFF0C\u5BF9\u5E94\u7684\u6B63\u662F ubuntu:latest \u955C\u50CF\u7684\u4E94\u5C42\u3002\u53EF\u4EE5\u770B\u5230\uFF0C\u5B83\u4EEC\u7684\u6302\u8F7D\u65B9\u5F0F\u90FD\u662F\u53EA\u8BFB\u7684\uFF08ro+wh\uFF0C\u5373 readonly+whiteout\uFF0C\u81F3\u4E8E\u4EC0\u4E48\u662F whiteout\uFF0C\u6211\u4E0B\u9762\u9A6C\u4E0A\u4F1A\u8BB2\u5230\uFF09\u3002</p><p>\u8FD9\u65F6\uFF0C\u6211\u4EEC\u53EF\u4EE5\u5206\u522B\u67E5\u770B\u4E00\u4E0B\u8FD9\u4E9B\u5C42\u7684\u5185\u5BB9\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>$ ls /var/lib/docker/aufs/diff/72b0744e06247c7d0...
etc sbin usr var
$ ls /var/lib/docker/aufs/diff/32e8e20064858c0f2...
run
$ ls /var/lib/docker/aufs/diff/a524a729adadedb900...
bin boot dev etc home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>\u53EF\u4EE5\u770B\u5230\uFF0C\u8FD9\u4E9B\u5C42\uFF0C\u90FD\u4EE5\u589E\u91CF\u7684\u65B9\u5F0F\u5206\u522B\u5305\u542B\u4E86 Ubuntu \u64CD\u4F5C\u7CFB\u7EDF\u7684\u4E00\u90E8\u5206\u3002</p><p><strong>\u7B2C\u4E8C\u90E8\u5206\uFF0C\u53EF\u8BFB\u5199\u5C42\u3002</strong></p><p>\u5B83\u662F\u8FD9\u4E2A\u5BB9\u5668\u7684 rootfs \u6700\u4E0A\u9762\u7684\u4E00\u5C42\uFF086e3be5d2ecccae7cc\uFF09\uFF0C\u5B83\u7684\u6302\u8F7D\u65B9\u5F0F\u4E3A\uFF1Arw\uFF0C\u5373 read write\u3002\u5728\u6CA1\u6709\u5199\u5165\u6587\u4EF6\u4E4B\u524D\uFF0C\u8FD9\u4E2A\u76EE\u5F55\u662F\u7A7A\u7684\u3002\u800C\u4E00\u65E6\u5728\u5BB9\u5668\u91CC\u505A\u4E86\u5199\u64CD\u4F5C\uFF0C\u4F60\u4FEE\u6539\u4EA7\u751F\u7684\u5185\u5BB9\u5C31\u4F1A\u4EE5\u589E\u91CF\u7684\u65B9\u5F0F\u51FA\u73B0\u5728\u8FD9\u4E2A\u5C42\u4E2D\u3002</p><p>\u53EF\u662F\uFF0C\u4F60\u6709\u6CA1\u6709\u60F3\u5230\u8FD9\u6837\u4E00\u4E2A\u95EE\u9898\uFF1A\u5982\u679C\u6211\u73B0\u5728\u8981\u505A\u7684\uFF0C\u662F\u5220\u9664\u53EA\u8BFB\u5C42\u91CC\u7684\u4E00\u4E2A\u6587\u4EF6\u5462\uFF1F</p><p>\u4E3A\u4E86\u5B9E\u73B0\u8FD9\u6837\u7684\u5220\u9664\u64CD\u4F5C\uFF0CAuFS \u4F1A\u5728\u53EF\u8BFB\u5199\u5C42\u521B\u5EFA\u4E00\u4E2A whiteout \u6587\u4EF6\uFF0C\u628A\u53EA\u8BFB\u5C42\u91CC\u7684\u6587\u4EF6\u201C\u906E\u6321\u201D\u8D77\u6765\u3002</p><p>\u6BD4\u5982\uFF0C\u4F60\u8981\u5220\u9664\u53EA\u8BFB\u5C42\u91CC\u4E00\u4E2A\u540D\u53EB foo \u7684\u6587\u4EF6\uFF0C\u90A3\u4E48\u8FD9\u4E2A\u5220\u9664\u64CD\u4F5C\u5B9E\u9645\u4E0A\u662F\u5728\u53EF\u8BFB\u5199\u5C42\u521B\u5EFA\u4E86\u4E00\u4E2A\u540D\u53EB.wh.foo \u7684\u6587\u4EF6\u3002\u8FD9\u6837\uFF0C\u5F53\u8FD9\u4E24\u4E2A\u5C42\u88AB\u8054\u5408\u6302\u8F7D\u4E4B\u540E\uFF0Cfoo \u6587\u4EF6\u5C31\u4F1A\u88AB.wh.foo \u6587\u4EF6\u201C\u906E\u6321\u201D\u8D77\u6765\uFF0C\u201C\u6D88\u5931\u201D\u4E86\u3002\u8FD9\u4E2A\u529F\u80FD\uFF0C\u5C31\u662F\u201Cro+wh\u201D\u7684\u6302\u8F7D\u65B9\u5F0F\uFF0C\u5373\u53EA\u8BFB +whiteout \u7684\u542B\u4E49\u3002\u6211\u559C\u6B22\u628A whiteout \u5F62\u8C61\u5730\u7FFB\u8BD1\u4E3A\uFF1A\u201C\u767D\u969C\u201D\u3002</p><p>\u6240\u4EE5\uFF0C\u6700\u4E0A\u9762\u8FD9\u4E2A\u53EF\u8BFB\u5199\u5C42\u7684\u4F5C\u7528\uFF0C\u5C31\u662F\u4E13\u95E8\u7528\u6765\u5B58\u653E\u4F60\u4FEE\u6539 rootfs \u540E\u4EA7\u751F\u7684\u589E\u91CF\uFF0C\u65E0\u8BBA\u662F\u589E\u3001\u5220\u3001\u6539\uFF0C\u90FD\u53D1\u751F\u5728\u8FD9\u91CC\u3002\u800C\u5F53\u6211\u4EEC\u4F7F\u7528\u5B8C\u4E86\u8FD9\u4E2A\u88AB\u4FEE\u6539\u8FC7\u7684\u5BB9\u5668\u4E4B\u540E\uFF0C\u8FD8\u53EF\u4EE5\u4F7F\u7528 docker commit \u548C push \u6307\u4EE4\uFF0C\u4FDD\u5B58\u8FD9\u4E2A\u88AB\u4FEE\u6539\u8FC7\u7684\u53EF\u8BFB\u5199\u5C42\uFF0C\u5E76\u4E0A\u4F20\u5230 Docker Hub \u4E0A\uFF0C\u4F9B\u5176\u4ED6\u4EBA\u4F7F\u7528\uFF1B\u800C\u4E0E\u6B64\u540C\u65F6\uFF0C\u539F\u5148\u7684\u53EA\u8BFB\u5C42\u91CC\u7684\u5185\u5BB9\u5219\u4E0D\u4F1A\u6709\u4EFB\u4F55\u53D8\u5316\u3002\u8FD9\uFF0C\u5C31\u662F\u589E\u91CF rootfs \u7684\u597D\u5904\u3002</p><p><strong>\u7B2C\u4E09\u90E8\u5206\uFF0CInit \u5C42\u3002</strong></p><p>\u5B83\u662F\u4E00\u4E2A\u4EE5\u201C-init\u201D\u7ED3\u5C3E\u7684\u5C42\uFF0C\u5939\u5728\u53EA\u8BFB\u5C42\u548C\u8BFB\u5199\u5C42\u4E4B\u95F4\u3002Init \u5C42\u662F Docker \u9879\u76EE\u5355\u72EC\u751F\u6210\u7684\u4E00\u4E2A\u5185\u90E8\u5C42\uFF0C\u4E13\u95E8\u7528\u6765\u5B58\u653E /etc/hosts\u3001/etc/resolv.conf \u7B49\u4FE1\u606F\u3002</p><p>\u9700\u8981\u8FD9\u6837\u4E00\u5C42\u7684\u539F\u56E0\u662F\uFF0C\u8FD9\u4E9B\u6587\u4EF6\u672C\u6765\u5C5E\u4E8E\u53EA\u8BFB\u7684 Ubuntu \u955C\u50CF\u7684\u4E00\u90E8\u5206\uFF0C\u4F46\u662F\u7528\u6237\u5F80\u5F80\u9700\u8981\u5728\u542F\u52A8\u5BB9\u5668\u65F6\u5199\u5165\u4E00\u4E9B\u6307\u5B9A\u7684\u503C\u6BD4\u5982 hostname\uFF0C\u6240\u4EE5\u5C31\u9700\u8981\u5728\u53EF\u8BFB\u5199\u5C42\u5BF9\u5B83\u4EEC\u8FDB\u884C\u4FEE\u6539\u3002</p><p>\u53EF\u662F\uFF0C\u8FD9\u4E9B\u4FEE\u6539\u5F80\u5F80\u53EA\u5BF9\u5F53\u524D\u7684\u5BB9\u5668\u6709\u6548\uFF0C\u6211\u4EEC\u5E76\u4E0D\u5E0C\u671B\u6267\u884C docker commit \u65F6\uFF0C\u628A\u8FD9\u4E9B\u4FE1\u606F\u8FDE\u540C\u53EF\u8BFB\u5199\u5C42\u4E00\u8D77\u63D0\u4EA4\u6389\u3002</p><p>\u6240\u4EE5\uFF0CDocker \u505A\u6CD5\u662F\uFF0C\u5728\u4FEE\u6539\u4E86\u8FD9\u4E9B\u6587\u4EF6\u4E4B\u540E\uFF0C\u4EE5\u4E00\u4E2A\u5355\u72EC\u7684\u5C42\u6302\u8F7D\u4E86\u51FA\u6765\u3002\u800C\u7528\u6237\u6267\u884C docker commit \u53EA\u4F1A\u63D0\u4EA4\u53EF\u8BFB\u5199\u5C42\uFF0C\u6240\u4EE5\u662F\u4E0D\u5305\u542B\u8FD9\u4E9B\u5185\u5BB9\u7684\u3002</p><p>\u6700\u7EC8\uFF0C\u8FD9 7 \u4E2A\u5C42\u90FD\u88AB\u8054\u5408\u6302\u8F7D\u5230 /var/lib/docker/aufs/mnt \u76EE\u5F55\u4E0B\uFF0C\u8868\u73B0\u4E3A\u4E00\u4E2A\u5B8C\u6574\u7684 Ubuntu \u64CD\u4F5C\u7CFB\u7EDF\u4F9B\u5BB9\u5668\u4F7F\u7528\u3002</p><blockquote></blockquote>`,77);function r(o,t){return a}var l=e(s,[["render",r]]);export{l as default};
