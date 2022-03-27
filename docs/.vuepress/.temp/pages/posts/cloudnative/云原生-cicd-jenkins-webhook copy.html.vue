<template><h1 id="jenkins-利用gitee-webhook触发流水线" tabindex="-1"><a class="header-anchor" href="#jenkins-利用gitee-webhook触发流水线" aria-hidden="true">#</a> jenkins 利用Gitee  WebHook触发流水线</h1>
<h3 id="插件安装" tabindex="-1"><a class="header-anchor" href="#插件安装" aria-hidden="true">#</a> 插件安装</h3>
<p>在线安装</p>
<ul>
<li>前往 Manage Jenkins -&gt; Manage Plugins -&gt; Available</li>
<li>右侧 Filter 输入： Gitee</li>
<li>下方可选列表中勾选 Gitee（如列表中不存在 Gitee，则点击 Check now 更新插件列表）</li>
<li>点击 Download now and install after restart</li>
</ul>
<p><img src="https://images.gitee.com/uploads/images/2018/0723/112748_b81a1ee3_58426.png" alt="https://images.gitee.com/uploads/images/2018/0723/112748_b81a1ee3_58426.png" loading="lazy"></p>
<h3 id="插件配置" tabindex="-1"><a class="header-anchor" href="#插件配置" aria-hidden="true">#</a> 插件配置</h3>
<h3 id="添加码云链接配置" tabindex="-1"><a class="header-anchor" href="#添加码云链接配置" aria-hidden="true">#</a> 添加码云链接配置</h3>
<ol>
<li>前往 Jenkins -&gt; Manage Jenkins -&gt; Configure System -&gt; Gitee Configuration -&gt; Gitee connections</li>
<li>在 <code>Connection name</code> 中输入 <code>Gitee</code> 或者你想要的名字</li>
<li><code>Gitee host URL</code> 中输入码云完整 URL地址： <code>https://gitee.com</code> （码云私有化客户输入部署的域名）</li>
<li>Credentials 中如还未配置码云 APIV5 私人令牌，点Add-&gt;Jenkins
<ol>
<li><code>Domain</code> 选择 <code>Global credentials</code></li>
<li><code>Kind</code> 选择 <code>Gitee API Token</code></li>
<li><code>Scope</code> 选择你需要的范围</li>
<li><code>Gitee API Token</code> 输入你的码云私人令牌，获取地址：https://gitee.com/profile/personal_access_tokens</li>
<li><code>ID</code>, <code>Descripiton</code> 中输入你想要的 ID 和描述即可。</li>
</ol>
</li>
<li><code>Credentials</code> 选择配置好的 Gitee APIV5 Token</li>
<li>点击 <code>Advanced</code> ，可配置是否忽略 SSL 错误（适您的Jenkins环境是否支持），并可设置链接测超时时间（适您的网络环境而定）</li>
<li>点击 <code>Test Connection</code> 测试链接是否成功，如失败请检查以上 3，5，6 步骤。</li>
</ol>
<p>配置成功后如图所示：
<img src="https://images.gitee.com/uploads/images/2018/0716/185651_68707d16_58426.png" alt="码云链接配置" loading="lazy"></p>
<h3 id="新建构建任务" tabindex="-1"><a class="header-anchor" href="#新建构建任务" aria-hidden="true">#</a> 新建构建任务</h3>
<p>前往 Jenkins -&gt; New Item , name 输入 'Gitee Test'，选择 <code>Freestyle project</code>（自由风格） 保存即可创建构建项目。</p>
<h3 id="任务全局配置" tabindex="-1"><a class="header-anchor" href="#任务全局配置" aria-hidden="true">#</a> 任务全局配置</h3>
<p>任务全局配置中需要选择前一步中的码云链接。前往某个任务（如'Gitee Test'）的 Configure -&gt; General，Gitee connection 中选择前面所配置的码云联机，如图：</p>
<p><img src="https://images.gitee.com/uploads/images/2018/0716/191715_9660237b_58426.png" alt="任务全局配置" loading="lazy"></p>
<h3 id="源码管理配置" tabindex="-1"><a class="header-anchor" href="#源码管理配置" aria-hidden="true">#</a> 源码管理配置</h3>
<p>前往某个任务（如'Gitee Test'）的 Configure -&gt; Source Code Management 选项卡</p>
<ol>
<li>
<p>点击 <em>Git</em></p>
</li>
<li>
<p>输入你的仓库地址，例如</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>git@your.gitee.server:gitee_group/gitee_project.git
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><ol>
<li>点击 <em>Advanced</em> 按钮, <em>Name</em> 字段中输入 <code>origin</code>， <em>Refspec</em> 字段输入 <code>+refs/heads/*:refs/remotes/origin/* +refs/pull/*/MERGE:refs/pull/*/MERGE</code></li>
</ol>
</li>
<li>
<p>Branch Specifier</p>
<p>选项:</p>
<ol>
<li>对于单仓库工作流输入: <code>origin/${giteeSourceBranch}</code></li>
<li>对于 PR 工作流输入: <code>pull/${giteePullRequestIid}/MERGE</code></li>
</ol>
</li>
<li>
<p>Additional Behaviours</p>
<p>选项：</p>
<ol>
<li>对于单仓库工作流，如果你希望推送的分支构建前合并默认分支（发布的分支），可以做以下操作：
<ol>
<li>点击 <em>Add</em> 下拉框</li>
<li>选择 <em>Merge before build</em></li>
<li>设置 <em>Name of repository</em> 为 <code>origin</code></li>
<li>设置 <em>Branch to merge to</em> 为 <code>${ReleaseBranch}</code> 即您要合并的默认分支（发布分支）</li>
</ol>
</li>
<li>对于 PR 工作流，码云服务端已经将 PR 的原分支和目标分支作了预合并，您可以直接构建，如果目标分支不是默认分支（发布分支），您也可以进行上诉构建前合并。</li>
</ol>
</li>
</ol>
<p>配置如图所示：</p>
<p><img src="https://images.gitee.com/uploads/images/2018/0716/191913_ef0995f4_58426.png" alt="源码管理配置" loading="lazy"></p>
<h3 id="触发器配置" tabindex="-1"><a class="header-anchor" href="#触发器配置" aria-hidden="true">#</a> 触发器配置</h3>
<p>前往任务配置的触发器构建： Configure -&gt; Build Triggers 选项卡</p>
<ol>
<li>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>Enabled Gitee triggers
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>勾选您所需要的构建触发规则，如</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>Push Event
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>,</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>Opened Merge Request Events
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>，勾选的事件会接受WebHook，触发构建。目前支持触发事件有：</p>
<ul>
<li>Push Events ：推送代码事件</li>
<li>Opened Merge Request Events ：提交 PR 事件</li>
<li>Updated Merge Request Events ：更新 PR 事件</li>
<li>Accepted Merge Request Events ：接受/合并 PR 事件</li>
<li>Closed Merge Request Events ：关闭 PR 事件</li>
<li>Approved Pull Requests ： 审查通过 PR 事件</li>
<li>Tested Pull Requests ：测试通过 PR 事件</li>
</ul>
</li>
<li>
<p><code>Enable [ci-skip]</code> 该选项可以开启支持 <code>[ci-skip]</code> 指令，只要commit message 中包含 <code>[ci-skip]</code>，当前commit 即可跳过构建触发。</p>
</li>
<li>
<p><code>Ignore last commit has build</code> 该选项可以跳过已经构建过的 Commit 版本。</p>
</li>
<li>
<p><code>Allowed branches</code> 可以配置允许构建的分支，目前支持分支名和正则表达式的方式进行过滤。</p>
</li>
<li>
<p><code>Secret Token for Gitee WebHook</code> 该选项可以配置 WebHook 的密码，该密码需要与码云 WebHook配置的密码一致方可触发构建。</p>
</li>
<li>
<p>注意：若 PR 状态为不可自动合并，则不触发构建。</p>
</li>
</ol>
<p><img src="https://images.gitee.com/uploads/images/2018/0724/120539_106f7480_58426.png" alt="触发器配置" loading="lazy"></p>
<h3 id="构建后步骤配置" tabindex="-1"><a class="header-anchor" href="#构建后步骤配置" aria-hidden="true">#</a> 构建后步骤配置</h3>
<p>前往任务配置的构建后配置： Configure -&gt; Post-build Actions 选项卡</p>
<h4 id="构建结果回评至码云" tabindex="-1"><a class="header-anchor" href="#构建结果回评至码云" aria-hidden="true">#</a> 构建结果回评至码云</h4>
<ol>
<li>点击 <code>Add post-build action</code> 下拉框选择：<code>Add note with build status on Gitee pull requests</code></li>
<li>Advanced中可以配置：
<ul>
<li>Add message only for failed builds ：仅为构建失败回评到码云</li>
<li>自定义各状态的回评内容（内容可以引用 Jenkins 的环境变量，或者自定义的环境变量）</li>
</ul>
</li>
<li>若开启该功能，还可将不可自动合并的状态回评至码云</li>
</ol>
<h4 id="构建成功自动合并pr" tabindex="-1"><a class="header-anchor" href="#构建成功自动合并pr" aria-hidden="true">#</a> 构建成功自动合并PR</h4>
<p>点击 <code>Add post-build action</code> 下拉框选择：<code>Accept Gitee pull request on success</code></p>
<p><img src="https://images.gitee.com/uploads/images/2018/0716/192304_0e323bc0_58426.png" alt="构建后步骤配置" loading="lazy"></p>
<h3 id="新建码云仓库webhook" tabindex="-1"><a class="header-anchor" href="#新建码云仓库webhook" aria-hidden="true">#</a> 新建码云仓库WebHook</h3>
<p>进入源码管理配置中设置的码云仓库中，进入 管理 -&gt; WebHooks</p>
<ol>
<li>添加 WebHook， URL 填写 <code>触发器配置：Build when a change is pushed to Gitee. Gitee webhook URL</code> 中所示 URL，如：: http://127.0.0.1:8080/jenkins/project/fu</li>
<li>密码填写：触发器配置第 5 点中配置的 WebHook密码，不设密码可以不填</li>
<li>勾选 PUSH， Pull Request</li>
</ol>
<h4 id="测试推送触发构建" tabindex="-1"><a class="header-anchor" href="#测试推送触发构建" aria-hidden="true">#</a> 测试推送触发构建</h4>
<ol>
<li>码云的 WebHook 管理中选择勾选了PUSH的 WebHook 点击测试，观察 Jenkins 任务的构建状态</li>
<li>码云仓库页面编辑一个文件提交，观察 Jenkins 任务的构建状态</li>
</ol>
<h4 id="测试pr触发构建" tabindex="-1"><a class="header-anchor" href="#测试pr触发构建" aria-hidden="true">#</a> 测试PR触发构建</h4>
<ol>
<li>码云的 WebHook 管理中选择勾选了 Pull Request 的 WebHook 点击测试，观察 Jenkins 任务的构建状态</li>
<li>在码云仓库中新建一个Pull Request，观察 Jenkins 任务的构建状态</li>
</ol>
<h1 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a> </h1>
</template>
