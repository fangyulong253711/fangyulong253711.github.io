import{_ as e,e as i}from"./app.4b919133.js";const l={},a=i(`<h1 id="jenkins-\u5229\u7528gitee-webhook\u89E6\u53D1\u6D41\u6C34\u7EBF" tabindex="-1"><a class="header-anchor" href="#jenkins-\u5229\u7528gitee-webhook\u89E6\u53D1\u6D41\u6C34\u7EBF" aria-hidden="true">#</a> jenkins \u5229\u7528Gitee WebHook\u89E6\u53D1\u6D41\u6C34\u7EBF</h1><h3 id="\u63D2\u4EF6\u5B89\u88C5" tabindex="-1"><a class="header-anchor" href="#\u63D2\u4EF6\u5B89\u88C5" aria-hidden="true">#</a> \u63D2\u4EF6\u5B89\u88C5</h3><p>\u5728\u7EBF\u5B89\u88C5</p><ul><li>\u524D\u5F80 Manage Jenkins -&gt; Manage Plugins -&gt; Available</li><li>\u53F3\u4FA7 Filter \u8F93\u5165\uFF1A Gitee</li><li>\u4E0B\u65B9\u53EF\u9009\u5217\u8868\u4E2D\u52FE\u9009 Gitee\uFF08\u5982\u5217\u8868\u4E2D\u4E0D\u5B58\u5728 Gitee\uFF0C\u5219\u70B9\u51FB Check now \u66F4\u65B0\u63D2\u4EF6\u5217\u8868\uFF09</li><li>\u70B9\u51FB Download now and install after restart</li></ul><p><img src="https://images.gitee.com/uploads/images/2018/0723/112748_b81a1ee3_58426.png" alt="https://images.gitee.com/uploads/images/2018/0723/112748_b81a1ee3_58426.png" loading="lazy"></p><h3 id="\u63D2\u4EF6\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u63D2\u4EF6\u914D\u7F6E" aria-hidden="true">#</a> \u63D2\u4EF6\u914D\u7F6E</h3><h3 id="\u6DFB\u52A0\u7801\u4E91\u94FE\u63A5\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u6DFB\u52A0\u7801\u4E91\u94FE\u63A5\u914D\u7F6E" aria-hidden="true">#</a> \u6DFB\u52A0\u7801\u4E91\u94FE\u63A5\u914D\u7F6E</h3><ol><li>\u524D\u5F80 Jenkins -&gt; Manage Jenkins -&gt; Configure System -&gt; Gitee Configuration -&gt; Gitee connections</li><li>\u5728 <code>Connection name</code> \u4E2D\u8F93\u5165 <code>Gitee</code> \u6216\u8005\u4F60\u60F3\u8981\u7684\u540D\u5B57</li><li><code>Gitee host URL</code> \u4E2D\u8F93\u5165\u7801\u4E91\u5B8C\u6574 URL\u5730\u5740\uFF1A <code>https://gitee.com</code> \uFF08\u7801\u4E91\u79C1\u6709\u5316\u5BA2\u6237\u8F93\u5165\u90E8\u7F72\u7684\u57DF\u540D\uFF09</li><li>Credentials \u4E2D\u5982\u8FD8\u672A\u914D\u7F6E\u7801\u4E91 APIV5 \u79C1\u4EBA\u4EE4\u724C\uFF0C\u70B9Add-&gt;Jenkins <ol><li><code>Domain</code> \u9009\u62E9 <code>Global credentials</code></li><li><code>Kind</code> \u9009\u62E9 <code>Gitee API Token</code></li><li><code>Scope</code> \u9009\u62E9\u4F60\u9700\u8981\u7684\u8303\u56F4</li><li><code>Gitee API Token</code> \u8F93\u5165\u4F60\u7684\u7801\u4E91\u79C1\u4EBA\u4EE4\u724C\uFF0C\u83B7\u53D6\u5730\u5740\uFF1Ahttps://gitee.com/profile/personal_access_tokens</li><li><code>ID</code>, <code>Descripiton</code> \u4E2D\u8F93\u5165\u4F60\u60F3\u8981\u7684 ID \u548C\u63CF\u8FF0\u5373\u53EF\u3002</li></ol></li><li><code>Credentials</code> \u9009\u62E9\u914D\u7F6E\u597D\u7684 Gitee APIV5 Token</li><li>\u70B9\u51FB <code>Advanced</code> \uFF0C\u53EF\u914D\u7F6E\u662F\u5426\u5FFD\u7565 SSL \u9519\u8BEF\uFF08\u9002\u60A8\u7684Jenkins\u73AF\u5883\u662F\u5426\u652F\u6301\uFF09\uFF0C\u5E76\u53EF\u8BBE\u7F6E\u94FE\u63A5\u6D4B\u8D85\u65F6\u65F6\u95F4\uFF08\u9002\u60A8\u7684\u7F51\u7EDC\u73AF\u5883\u800C\u5B9A\uFF09</li><li>\u70B9\u51FB <code>Test Connection</code> \u6D4B\u8BD5\u94FE\u63A5\u662F\u5426\u6210\u529F\uFF0C\u5982\u5931\u8D25\u8BF7\u68C0\u67E5\u4EE5\u4E0A 3\uFF0C5\uFF0C6 \u6B65\u9AA4\u3002</li></ol><p>\u914D\u7F6E\u6210\u529F\u540E\u5982\u56FE\u6240\u793A\uFF1A <img src="https://images.gitee.com/uploads/images/2018/0716/185651_68707d16_58426.png" alt="\u7801\u4E91\u94FE\u63A5\u914D\u7F6E" loading="lazy"></p><h3 id="\u65B0\u5EFA\u6784\u5EFA\u4EFB\u52A1" tabindex="-1"><a class="header-anchor" href="#\u65B0\u5EFA\u6784\u5EFA\u4EFB\u52A1" aria-hidden="true">#</a> \u65B0\u5EFA\u6784\u5EFA\u4EFB\u52A1</h3><p>\u524D\u5F80 Jenkins -&gt; New Item , name \u8F93\u5165 &#39;Gitee Test&#39;\uFF0C\u9009\u62E9 <code>Freestyle project</code>\uFF08\u81EA\u7531\u98CE\u683C\uFF09 \u4FDD\u5B58\u5373\u53EF\u521B\u5EFA\u6784\u5EFA\u9879\u76EE\u3002</p><h3 id="\u4EFB\u52A1\u5168\u5C40\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u4EFB\u52A1\u5168\u5C40\u914D\u7F6E" aria-hidden="true">#</a> \u4EFB\u52A1\u5168\u5C40\u914D\u7F6E</h3><p>\u4EFB\u52A1\u5168\u5C40\u914D\u7F6E\u4E2D\u9700\u8981\u9009\u62E9\u524D\u4E00\u6B65\u4E2D\u7684\u7801\u4E91\u94FE\u63A5\u3002\u524D\u5F80\u67D0\u4E2A\u4EFB\u52A1\uFF08\u5982&#39;Gitee Test&#39;\uFF09\u7684 Configure -&gt; General\uFF0CGitee connection \u4E2D\u9009\u62E9\u524D\u9762\u6240\u914D\u7F6E\u7684\u7801\u4E91\u8054\u673A\uFF0C\u5982\u56FE\uFF1A</p><p><img src="https://images.gitee.com/uploads/images/2018/0716/191715_9660237b_58426.png" alt="\u4EFB\u52A1\u5168\u5C40\u914D\u7F6E" loading="lazy"></p><h3 id="\u6E90\u7801\u7BA1\u7406\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u6E90\u7801\u7BA1\u7406\u914D\u7F6E" aria-hidden="true">#</a> \u6E90\u7801\u7BA1\u7406\u914D\u7F6E</h3><p>\u524D\u5F80\u67D0\u4E2A\u4EFB\u52A1\uFF08\u5982&#39;Gitee Test&#39;\uFF09\u7684 Configure -&gt; Source Code Management \u9009\u9879\u5361</p><ol><li><p>\u70B9\u51FB <em>Git</em></p></li><li><p>\u8F93\u5165\u4F60\u7684\u4ED3\u5E93\u5730\u5740\uFF0C\u4F8B\u5982</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>git@your.gitee.server:gitee_group/gitee_project.git
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><ol><li>\u70B9\u51FB <em>Advanced</em> \u6309\u94AE, <em>Name</em> \u5B57\u6BB5\u4E2D\u8F93\u5165 <code>origin</code>\uFF0C <em>Refspec</em> \u5B57\u6BB5\u8F93\u5165 <code>+refs/heads/*:refs/remotes/origin/* +refs/pull/*/MERGE:refs/pull/*/MERGE</code></li></ol></li><li><p>Branch Specifier</p><p>\u9009\u9879:</p><ol><li>\u5BF9\u4E8E\u5355\u4ED3\u5E93\u5DE5\u4F5C\u6D41\u8F93\u5165: <code>origin/\${giteeSourceBranch}</code></li><li>\u5BF9\u4E8E PR \u5DE5\u4F5C\u6D41\u8F93\u5165: <code>pull/\${giteePullRequestIid}/MERGE</code></li></ol></li><li><p>Additional Behaviours</p><p>\u9009\u9879\uFF1A</p><ol><li>\u5BF9\u4E8E\u5355\u4ED3\u5E93\u5DE5\u4F5C\u6D41\uFF0C\u5982\u679C\u4F60\u5E0C\u671B\u63A8\u9001\u7684\u5206\u652F\u6784\u5EFA\u524D\u5408\u5E76\u9ED8\u8BA4\u5206\u652F\uFF08\u53D1\u5E03\u7684\u5206\u652F\uFF09\uFF0C\u53EF\u4EE5\u505A\u4EE5\u4E0B\u64CD\u4F5C\uFF1A <ol><li>\u70B9\u51FB <em>Add</em> \u4E0B\u62C9\u6846</li><li>\u9009\u62E9 <em>Merge before build</em></li><li>\u8BBE\u7F6E <em>Name of repository</em> \u4E3A <code>origin</code></li><li>\u8BBE\u7F6E <em>Branch to merge to</em> \u4E3A <code>\${ReleaseBranch}</code> \u5373\u60A8\u8981\u5408\u5E76\u7684\u9ED8\u8BA4\u5206\u652F\uFF08\u53D1\u5E03\u5206\u652F\uFF09</li></ol></li><li>\u5BF9\u4E8E PR \u5DE5\u4F5C\u6D41\uFF0C\u7801\u4E91\u670D\u52A1\u7AEF\u5DF2\u7ECF\u5C06 PR \u7684\u539F\u5206\u652F\u548C\u76EE\u6807\u5206\u652F\u4F5C\u4E86\u9884\u5408\u5E76\uFF0C\u60A8\u53EF\u4EE5\u76F4\u63A5\u6784\u5EFA\uFF0C\u5982\u679C\u76EE\u6807\u5206\u652F\u4E0D\u662F\u9ED8\u8BA4\u5206\u652F\uFF08\u53D1\u5E03\u5206\u652F\uFF09\uFF0C\u60A8\u4E5F\u53EF\u4EE5\u8FDB\u884C\u4E0A\u8BC9\u6784\u5EFA\u524D\u5408\u5E76\u3002</li></ol></li></ol><p>\u914D\u7F6E\u5982\u56FE\u6240\u793A\uFF1A</p><p><img src="https://images.gitee.com/uploads/images/2018/0716/191913_ef0995f4_58426.png" alt="\u6E90\u7801\u7BA1\u7406\u914D\u7F6E" loading="lazy"></p><h3 id="\u89E6\u53D1\u5668\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u89E6\u53D1\u5668\u914D\u7F6E" aria-hidden="true">#</a> \u89E6\u53D1\u5668\u914D\u7F6E</h3><p>\u524D\u5F80\u4EFB\u52A1\u914D\u7F6E\u7684\u89E6\u53D1\u5668\u6784\u5EFA\uFF1A Configure -&gt; Build Triggers \u9009\u9879\u5361</p><ol><li><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>Enabled Gitee triggers
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>\u52FE\u9009\u60A8\u6240\u9700\u8981\u7684\u6784\u5EFA\u89E6\u53D1\u89C4\u5219\uFF0C\u5982</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>Push Event
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>,</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>Opened Merge Request Events
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>\uFF0C\u52FE\u9009\u7684\u4E8B\u4EF6\u4F1A\u63A5\u53D7WebHook\uFF0C\u89E6\u53D1\u6784\u5EFA\u3002\u76EE\u524D\u652F\u6301\u89E6\u53D1\u4E8B\u4EF6\u6709\uFF1A</p><ul><li>Push Events \uFF1A\u63A8\u9001\u4EE3\u7801\u4E8B\u4EF6</li><li>Opened Merge Request Events \uFF1A\u63D0\u4EA4 PR \u4E8B\u4EF6</li><li>Updated Merge Request Events \uFF1A\u66F4\u65B0 PR \u4E8B\u4EF6</li><li>Accepted Merge Request Events \uFF1A\u63A5\u53D7/\u5408\u5E76 PR \u4E8B\u4EF6</li><li>Closed Merge Request Events \uFF1A\u5173\u95ED PR \u4E8B\u4EF6</li><li>Approved Pull Requests \uFF1A \u5BA1\u67E5\u901A\u8FC7 PR \u4E8B\u4EF6</li><li>Tested Pull Requests \uFF1A\u6D4B\u8BD5\u901A\u8FC7 PR \u4E8B\u4EF6</li></ul></li><li><p><code>Enable [ci-skip]</code> \u8BE5\u9009\u9879\u53EF\u4EE5\u5F00\u542F\u652F\u6301 <code>[ci-skip]</code> \u6307\u4EE4\uFF0C\u53EA\u8981commit message \u4E2D\u5305\u542B <code>[ci-skip]</code>\uFF0C\u5F53\u524Dcommit \u5373\u53EF\u8DF3\u8FC7\u6784\u5EFA\u89E6\u53D1\u3002</p></li><li><p><code>Ignore last commit has build</code> \u8BE5\u9009\u9879\u53EF\u4EE5\u8DF3\u8FC7\u5DF2\u7ECF\u6784\u5EFA\u8FC7\u7684 Commit \u7248\u672C\u3002</p></li><li><p><code>Allowed branches</code> \u53EF\u4EE5\u914D\u7F6E\u5141\u8BB8\u6784\u5EFA\u7684\u5206\u652F\uFF0C\u76EE\u524D\u652F\u6301\u5206\u652F\u540D\u548C\u6B63\u5219\u8868\u8FBE\u5F0F\u7684\u65B9\u5F0F\u8FDB\u884C\u8FC7\u6EE4\u3002</p></li><li><p><code>Secret Token for Gitee WebHook</code> \u8BE5\u9009\u9879\u53EF\u4EE5\u914D\u7F6E WebHook \u7684\u5BC6\u7801\uFF0C\u8BE5\u5BC6\u7801\u9700\u8981\u4E0E\u7801\u4E91 WebHook\u914D\u7F6E\u7684\u5BC6\u7801\u4E00\u81F4\u65B9\u53EF\u89E6\u53D1\u6784\u5EFA\u3002</p></li><li><p>\u6CE8\u610F\uFF1A\u82E5 PR \u72B6\u6001\u4E3A\u4E0D\u53EF\u81EA\u52A8\u5408\u5E76\uFF0C\u5219\u4E0D\u89E6\u53D1\u6784\u5EFA\u3002</p></li></ol><p><img src="https://images.gitee.com/uploads/images/2018/0724/120539_106f7480_58426.png" alt="\u89E6\u53D1\u5668\u914D\u7F6E" loading="lazy"></p><h3 id="\u6784\u5EFA\u540E\u6B65\u9AA4\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u6784\u5EFA\u540E\u6B65\u9AA4\u914D\u7F6E" aria-hidden="true">#</a> \u6784\u5EFA\u540E\u6B65\u9AA4\u914D\u7F6E</h3><p>\u524D\u5F80\u4EFB\u52A1\u914D\u7F6E\u7684\u6784\u5EFA\u540E\u914D\u7F6E\uFF1A Configure -&gt; Post-build Actions \u9009\u9879\u5361</p><h4 id="\u6784\u5EFA\u7ED3\u679C\u56DE\u8BC4\u81F3\u7801\u4E91" tabindex="-1"><a class="header-anchor" href="#\u6784\u5EFA\u7ED3\u679C\u56DE\u8BC4\u81F3\u7801\u4E91" aria-hidden="true">#</a> \u6784\u5EFA\u7ED3\u679C\u56DE\u8BC4\u81F3\u7801\u4E91</h4><ol><li>\u70B9\u51FB <code>Add post-build action</code> \u4E0B\u62C9\u6846\u9009\u62E9\uFF1A<code>Add note with build status on Gitee pull requests</code></li><li>Advanced\u4E2D\u53EF\u4EE5\u914D\u7F6E\uFF1A <ul><li>Add message only for failed builds \uFF1A\u4EC5\u4E3A\u6784\u5EFA\u5931\u8D25\u56DE\u8BC4\u5230\u7801\u4E91</li><li>\u81EA\u5B9A\u4E49\u5404\u72B6\u6001\u7684\u56DE\u8BC4\u5185\u5BB9\uFF08\u5185\u5BB9\u53EF\u4EE5\u5F15\u7528 Jenkins \u7684\u73AF\u5883\u53D8\u91CF\uFF0C\u6216\u8005\u81EA\u5B9A\u4E49\u7684\u73AF\u5883\u53D8\u91CF\uFF09</li></ul></li><li>\u82E5\u5F00\u542F\u8BE5\u529F\u80FD\uFF0C\u8FD8\u53EF\u5C06\u4E0D\u53EF\u81EA\u52A8\u5408\u5E76\u7684\u72B6\u6001\u56DE\u8BC4\u81F3\u7801\u4E91</li></ol><h4 id="\u6784\u5EFA\u6210\u529F\u81EA\u52A8\u5408\u5E76pr" tabindex="-1"><a class="header-anchor" href="#\u6784\u5EFA\u6210\u529F\u81EA\u52A8\u5408\u5E76pr" aria-hidden="true">#</a> \u6784\u5EFA\u6210\u529F\u81EA\u52A8\u5408\u5E76PR</h4><p>\u70B9\u51FB <code>Add post-build action</code> \u4E0B\u62C9\u6846\u9009\u62E9\uFF1A<code>Accept Gitee pull request on success</code></p><p><img src="https://images.gitee.com/uploads/images/2018/0716/192304_0e323bc0_58426.png" alt="\u6784\u5EFA\u540E\u6B65\u9AA4\u914D\u7F6E" loading="lazy"></p><h3 id="\u65B0\u5EFA\u7801\u4E91\u4ED3\u5E93webhook" tabindex="-1"><a class="header-anchor" href="#\u65B0\u5EFA\u7801\u4E91\u4ED3\u5E93webhook" aria-hidden="true">#</a> \u65B0\u5EFA\u7801\u4E91\u4ED3\u5E93WebHook</h3><p>\u8FDB\u5165\u6E90\u7801\u7BA1\u7406\u914D\u7F6E\u4E2D\u8BBE\u7F6E\u7684\u7801\u4E91\u4ED3\u5E93\u4E2D\uFF0C\u8FDB\u5165 \u7BA1\u7406 -&gt; WebHooks</p><ol><li>\u6DFB\u52A0 WebHook\uFF0C URL \u586B\u5199 <code>\u89E6\u53D1\u5668\u914D\u7F6E\uFF1ABuild when a change is pushed to Gitee. Gitee webhook URL</code> \u4E2D\u6240\u793A URL\uFF0C\u5982\uFF1A: http://127.0.0.1:8080/jenkins/project/fu</li><li>\u5BC6\u7801\u586B\u5199\uFF1A\u89E6\u53D1\u5668\u914D\u7F6E\u7B2C 5 \u70B9\u4E2D\u914D\u7F6E\u7684 WebHook\u5BC6\u7801\uFF0C\u4E0D\u8BBE\u5BC6\u7801\u53EF\u4EE5\u4E0D\u586B</li><li>\u52FE\u9009 PUSH\uFF0C Pull Request</li></ol><h4 id="\u6D4B\u8BD5\u63A8\u9001\u89E6\u53D1\u6784\u5EFA" tabindex="-1"><a class="header-anchor" href="#\u6D4B\u8BD5\u63A8\u9001\u89E6\u53D1\u6784\u5EFA" aria-hidden="true">#</a> \u6D4B\u8BD5\u63A8\u9001\u89E6\u53D1\u6784\u5EFA</h4><ol><li>\u7801\u4E91\u7684 WebHook \u7BA1\u7406\u4E2D\u9009\u62E9\u52FE\u9009\u4E86PUSH\u7684 WebHook \u70B9\u51FB\u6D4B\u8BD5\uFF0C\u89C2\u5BDF Jenkins \u4EFB\u52A1\u7684\u6784\u5EFA\u72B6\u6001</li><li>\u7801\u4E91\u4ED3\u5E93\u9875\u9762\u7F16\u8F91\u4E00\u4E2A\u6587\u4EF6\u63D0\u4EA4\uFF0C\u89C2\u5BDF Jenkins \u4EFB\u52A1\u7684\u6784\u5EFA\u72B6\u6001</li></ol><h4 id="\u6D4B\u8BD5pr\u89E6\u53D1\u6784\u5EFA" tabindex="-1"><a class="header-anchor" href="#\u6D4B\u8BD5pr\u89E6\u53D1\u6784\u5EFA" aria-hidden="true">#</a> \u6D4B\u8BD5PR\u89E6\u53D1\u6784\u5EFA</h4><ol><li>\u7801\u4E91\u7684 WebHook \u7BA1\u7406\u4E2D\u9009\u62E9\u52FE\u9009\u4E86 Pull Request \u7684 WebHook \u70B9\u51FB\u6D4B\u8BD5\uFF0C\u89C2\u5BDF Jenkins \u4EFB\u52A1\u7684\u6784\u5EFA\u72B6\u6001</li><li>\u5728\u7801\u4E91\u4ED3\u5E93\u4E2D\u65B0\u5EFA\u4E00\u4E2APull Request\uFF0C\u89C2\u5BDF Jenkins \u4EFB\u52A1\u7684\u6784\u5EFA\u72B6\u6001</li></ol><h1 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h1>`,38);function o(d,t){return a}var s=e(l,[["render",o]]);export{s as default};
