---
icon: edit
date: 2022-01-03
category:
  - 云原生
tag:
  - cicd
  - 云原生
---
# jenkins 利用Gitee  WebHook触发流水线



### 插件安装

在线安装

- 前往 Manage Jenkins -> Manage Plugins -> Available
- 右侧 Filter 输入： Gitee
- 下方可选列表中勾选 Gitee（如列表中不存在 Gitee，则点击 Check now 更新插件列表）
- 点击 Download now and install after restart

![https://images.gitee.com/uploads/images/2018/0723/112748_b81a1ee3_58426.png](https://images.gitee.com/uploads/images/2018/0723/112748_b81a1ee3_58426.png)



### 插件配置





###  添加码云链接配置

1. 前往 Jenkins -> Manage Jenkins -> Configure System -> Gitee Configuration -> Gitee connections
2. 在 `Connection name` 中输入 `Gitee` 或者你想要的名字
3. `Gitee host URL` 中输入码云完整 URL地址： `https://gitee.com` （码云私有化客户输入部署的域名）
4. Credentials 中如还未配置码云 APIV5 私人令牌，点Add->Jenkins
   1. `Domain` 选择 `Global credentials`
   2. `Kind` 选择 `Gitee API Token`
   3. `Scope` 选择你需要的范围
   4. `Gitee API Token` 输入你的码云私人令牌，获取地址：https://gitee.com/profile/personal_access_tokens
   5. `ID`, `Descripiton` 中输入你想要的 ID 和描述即可。
5. `Credentials` 选择配置好的 Gitee APIV5 Token
6. 点击 `Advanced` ，可配置是否忽略 SSL 错误（适您的Jenkins环境是否支持），并可设置链接测超时时间（适您的网络环境而定）
7. 点击 `Test Connection` 测试链接是否成功，如失败请检查以上 3，5，6 步骤。

配置成功后如图所示：
![码云链接配置](https://images.gitee.com/uploads/images/2018/0716/185651_68707d16_58426.png)

### 新建构建任务

前往 Jenkins -> New Item , name 输入 'Gitee Test'，选择 `Freestyle project`（自由风格） 保存即可创建构建项目。







###  任务全局配置

任务全局配置中需要选择前一步中的码云链接。前往某个任务（如'Gitee Test'）的 Configure -> General，Gitee connection 中选择前面所配置的码云联机，如图：

![任务全局配置](https://images.gitee.com/uploads/images/2018/0716/191715_9660237b_58426.png)

### 源码管理配置

前往某个任务（如'Gitee Test'）的 Configure -> Source Code Management 选项卡

1. 点击 *Git*

2. 输入你的仓库地址，例如

    

   ```
   git@your.gitee.server:gitee_group/gitee_project.git
   ```

   1. 点击 *Advanced* 按钮, *Name* 字段中输入 `origin`， *Refspec* 字段输入 `+refs/heads/*:refs/remotes/origin/* +refs/pull/*/MERGE:refs/pull/*/MERGE`

3. Branch Specifier

    

   选项:

   1. 对于单仓库工作流输入: `origin/${giteeSourceBranch}`
   2. 对于 PR 工作流输入: `pull/${giteePullRequestIid}/MERGE`

4. Additional Behaviours

    

   选项：

   1. 对于单仓库工作流，如果你希望推送的分支构建前合并默认分支（发布的分支），可以做以下操作：
      1. 点击 *Add* 下拉框
      2. 选择 *Merge before build*
      3. 设置 *Name of repository* 为 `origin`
      4. 设置 *Branch to merge to* 为 `${ReleaseBranch}` 即您要合并的默认分支（发布分支）
   2. 对于 PR 工作流，码云服务端已经将 PR 的原分支和目标分支作了预合并，您可以直接构建，如果目标分支不是默认分支（发布分支），您也可以进行上诉构建前合并。

配置如图所示：

![源码管理配置](https://images.gitee.com/uploads/images/2018/0716/191913_ef0995f4_58426.png)

### 触发器配置

前往任务配置的触发器构建： Configure -> Build Triggers 选项卡

1. ```
   Enabled Gitee triggers
   ```

    

   勾选您所需要的构建触发规则，如

    

   ```
   Push Event
   ```

   ,

    

   ```
   Opened Merge Request Events
   ```

   ，勾选的事件会接受WebHook，触发构建。目前支持触发事件有：

   - Push Events ：推送代码事件
   - Opened Merge Request Events ：提交 PR 事件
   - Updated Merge Request Events ：更新 PR 事件
   - Accepted Merge Request Events ：接受/合并 PR 事件
   - Closed Merge Request Events ：关闭 PR 事件
   - Approved Pull Requests ： 审查通过 PR 事件
   - Tested Pull Requests ：测试通过 PR 事件

2. `Enable [ci-skip]` 该选项可以开启支持 `[ci-skip]` 指令，只要commit message 中包含 `[ci-skip]`，当前commit 即可跳过构建触发。

3. `Ignore last commit has build` 该选项可以跳过已经构建过的 Commit 版本。

4. `Allowed branches` 可以配置允许构建的分支，目前支持分支名和正则表达式的方式进行过滤。

5. `Secret Token for Gitee WebHook` 该选项可以配置 WebHook 的密码，该密码需要与码云 WebHook配置的密码一致方可触发构建。

6. 注意：若 PR 状态为不可自动合并，则不触发构建。

![触发器配置](https://images.gitee.com/uploads/images/2018/0724/120539_106f7480_58426.png)

### 构建后步骤配置

前往任务配置的构建后配置： Configure -> Post-build Actions 选项卡

#### 构建结果回评至码云

1. 点击 `Add post-build action` 下拉框选择：`Add note with build status on Gitee pull requests`
2. Advanced中可以配置：
   - Add message only for failed builds ：仅为构建失败回评到码云
   - 自定义各状态的回评内容（内容可以引用 Jenkins 的环境变量，或者自定义的环境变量）
3. 若开启该功能，还可将不可自动合并的状态回评至码云

#### 构建成功自动合并PR

点击 `Add post-build action` 下拉框选择：`Accept Gitee pull request on success`

![构建后步骤配置](https://images.gitee.com/uploads/images/2018/0716/192304_0e323bc0_58426.png)

### 新建码云仓库WebHook

进入源码管理配置中设置的码云仓库中，进入 管理 -> WebHooks

1. 添加 WebHook， URL 填写 `触发器配置：Build when a change is pushed to Gitee. Gitee webhook URL` 中所示 URL，如：: http://127.0.0.1:8080/jenkins/project/fu
2. 密码填写：触发器配置第 5 点中配置的 WebHook密码，不设密码可以不填
3. 勾选 PUSH， Pull Request

#### 测试推送触发构建

1. 码云的 WebHook 管理中选择勾选了PUSH的 WebHook 点击测试，观察 Jenkins 任务的构建状态
2. 码云仓库页面编辑一个文件提交，观察 Jenkins 任务的构建状态

#### 测试PR触发构建

1. 码云的 WebHook 管理中选择勾选了 Pull Request 的 WebHook 点击测试，观察 Jenkins 任务的构建状态
2. 在码云仓库中新建一个Pull Request，观察 Jenkins 任务的构建状态

# 