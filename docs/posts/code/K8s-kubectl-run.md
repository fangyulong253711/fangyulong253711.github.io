---
icon: edit
date: 2022-01-03
category:
  - 源码解读
tag:
  - k8s
  - kubectl
  - 环境
  - go
  - cncf
---
# kubectl源码解读

## kubectl 入口函数

cmd/kubectl/kubectl.go

```go
func main() {
	// 如果不调用rand.Seed，每次重新运行这个main函数，rand下的函数返回值始终一致
	// Seed即随机的种子，每次用时间戳作为种子，就能保证随机性
	rand.Seed(time.Now().UnixNano())


	// 创建了kubectl命令的默认参数
	command := cmd.NewDefaultKubectlCommand()

	pflag.CommandLine.SetNormalizeFunc(cliflag.WordSepNormalizeFunc)
	pflag.CommandLine.AddGoFlagSet(goflag.CommandLine)
	//  初始化log
	logs.InitLogs()
	defer logs.FlushLogs()
    
	// 运行command 运行上述步骤的流程
	if err := command.Execute(); err != nil {
		os.Exit(1)
	}
}
```

该部分最重要的是NewDefaultKubectlCommand() 接下来我们看一看这个函数具体内容

## NewDefaultKubectlCommand() -主函数的执行流程

**该函数主要是 初始化Command对象 再将传入的参数解析使用Command对象执行**

主要流程为
 1 调用NewDefaultKubectlCommandWithArgs 
 2 NewKubectlCommand(in, out, errout) 采用标准输入、输出、错误输出初始化Command对象
 3 处理传入的参数将参数传入第一步的Command对象进行执行

pkg/kubectl/cmd/cmd.go

```go
// 创建初始化的kubect
//  k8s的命令行工具采用了 cobra 库，具有命令提示等强大功能，比go语言自带的flag强大很多，可参考 github.com/spf13/cobra
func NewDefaultKubectlCommand() *cobra.Command {
	return NewDefaultKubectlCommandWithArgs(NewDefaultPluginHandler(plugin.ValidPluginFilenamePrefixes), os.Args, os.Stdin, os.Stdout, os.Stderr)
}
```

该函数调用 NewDefaultKubectlCommandWithArgs 并且将参数传入

```go
// NewDefaultKubectlCommandWithArgs creates the `kubectl` command with arguments
func NewDefaultKubectlCommandWithArgs(pluginHandler PluginHandler, args []string, in io.Reader, out, errout io.Writer) *cobra.Command {
   // 初始化NewKubectlCommand，采用标准输入、输出、错误输出
   cmd := NewKubectlCommand(in, out, errout)

   if pluginHandler == nil {
      return cmd
   }

   if len(args) > 1 {
      // 这里为传入的参数，即 create -f nginx_pod.yaml 部分
      cmdPathPieces := args[1:]

      //  调用cobra的Find去匹配args
      // 如果指定的命令不存在，则只寻找合适的扩展可执行文件
      if _, _, err := cmd.Find(cmdPathPieces); err != nil {
         if err := HandlePluginCommand(pluginHandler, cmdPathPieces); err != nil {
            fmt.Fprintf(errout, "%v\n", err)
            os.Exit(1)
         }
      }
   }

   return cmd
}
```

## NewKubectlCommand() - 命令command对象的创建

**在上一步我们已经知道了大致的处理过程，接下来我们看看Command到底是怎么创建的也就是NewKubectlCommand（）函数的细节**

主要流程为
 1 初始化command的主命令 并且注入一些执行前 执行后的hook函数
 2 cmd以配置文件进行实例化
 3 初始化一个工场类
 4 注入子命令 例如create delete等
 5 处理alpha命令
 6 代码补全
 7 将相关组件注入command对象并且返回

pkg/kubectl/cmd/cmd.go

```go
func NewKubectlCommand(in io.Reader, out, err io.Writer) *cobra.Command {
   // 添加所有子命令的父命令。
   // 创建主命令
   cmds := &cobra.Command{
      Use:   "kubectl",
      Short: i18n.T("kubectl controls the Kubernetes cluster manager"),
      Long: templates.LongDesc(`
      kubectl controls the Kubernetes cluster manager.
      
      Find more information at:
            https://kubernetes.io/docs/reference/kubectl/overview/`),
      Run: runHelp,
      // 初始化后，在运行指令前的钩子
      PersistentPreRunE: func(*cobra.Command, []string) error {
      // 这里是做pprof性能分析，跳转到对应代码可以看到，我们可以用参数 --profile xxx 来采集性能指标，默认保存在当前目录下的profile.pprof中
         return initProfiling()
      },
      // 运行指令后的钩子
      PersistentPostRunE: func(*cobra.Command, []string) error {
         return flushProfiling()
      },
      //bash自动补齐功能，可通过 kubectl completion bash 命令查看
      //具体安装可参考 https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion
      BashCompletionFunction: bashCompletionFunc,
   }

   // cmd实例化的过程
   flags := cmds.PersistentFlags()
   flags.SetNormalizeFunc(cliflag.WarnWordSepNormalizeFunc) // Warn for "_" flags

   // Normalize all flags that are coming from other packages or pre-configurations
   // a.k.a. change all "_" to "-". e.g. glog package
   flags.SetNormalizeFunc(cliflag.WordSepNormalizeFunc)

   addProfilingFlags(flags)

   kubeConfigFlags := genericclioptions.NewConfigFlags(true).WithDeprecatedPasswordFlag()
   kubeConfigFlags.AddFlags(flags)
   matchVersionKubeConfigFlags := cmdutil.NewMatchVersionFlags(kubeConfigFlags)
   matchVersionKubeConfigFlags.AddFlags(cmds.PersistentFlags())

   cmds.PersistentFlags().AddGoFlagSet(flag.CommandLine)


   // 初始化了一个工厂
   f := cmdutil.NewFactory(matchVersionKubeConfigFlags)

   i18n.LoadTranslations("kubectl", nil)
   cmds.SetGlobalNormalizationFunc(cliflag.WarnWordSepNormalizeFunc)
   ioStreams := genericclioptions.IOStreams{In: in, Out: out, ErrOut: err}

   //    kubectl定义了7类命令，结合Message和各个子命令的package名来看
   groups := templates.CommandGroups{
      {
         Message: "Basic Commands (Beginner):",
         Commands: []*cobra.Command{
            create.NewCmdCreate(f, ioStreams),
            expose.NewCmdExposeService(f, ioStreams),
            run.NewCmdRun(f, ioStreams),
            set.NewCmdSet(f, ioStreams),
         },
      },
      // 其他命令省略。。。。。。
   }
   groups.Add(cmds)

   filters := []string{"options"}

   // 如果在这个版本中没有alpha命令，隐藏“alpha”子命令。
   // alpha相关的子命令
   alpha := cmdpkg.NewCmdAlpha(f, ioStreams)
   if !alpha.HasSubCommands() {
      filters = append(filters, alpha.Name())
   }

   templates.ActsAsRootCommand(cmds, filters, groups...)

   // // 代码补全相关
   for name, completion := range bashCompletionFlags {
      if cmds.Flag(name) != nil {
         if cmds.Flag(name).Annotations == nil {
            cmds.Flag(name).Annotations = map[string][]string{}
         }
         cmds.Flag(name).Annotations[cobra.BashCompCustom] = append(
            cmds.Flag(name).Annotations[cobra.BashCompCustom],
            completion,
         )
      }
   }

   // 添加其余子命令，包括 alpha/config/plugin/version/api-versions/api-resources/options
   cmds.AddCommand(alpha)
   cmds.AddCommand(cmdconfig.NewCmdConfig(f, clientcmd.NewDefaultPathOptions(), ioStreams))
   cmds.AddCommand(plugin.NewCmdPlugin(f, ioStreams))
   cmds.AddCommand(version.NewCmdVersion(f, ioStreams))
   cmds.AddCommand(apiresources.NewCmdAPIVersions(f, ioStreams))
   cmds.AddCommand(apiresources.NewCmdAPIResources(f, ioStreams))
   cmds.AddCommand(options.NewCmdOptions(ioStreams.Out))

   return cmds
}
```

## NewCmdCreate() - create命令详解

**在上面一段中我们了解了，k8s的命令是分组的注入在代码中，我们就来详细看看与create相关的create.NewCmdCreate函数**



主要流程为
 1 初始化 create子命令的相关选项
 2 验证参数并运行
 3 RunCreate
 4 create的子命令，指定create对象
 5 将相关组件注入command对象并且返回



k8s.io/kubectl/pkg/cmd/create/create.go

```go
func NewCmdCreate(f cmdutil.Factory, ioStreams genericclioptions.IOStreams) *cobra.Command {
   // create子命令的相关选项
   o := NewCreateOptions(ioStreams)
   // create子命令的相关说明
   cmd := &cobra.Command{
      Use:                   "create -f FILENAME",
      DisableFlagsInUseLine: true,
      Short:                 i18n.T("Create a resource from a file or from stdin."),
      Long:                  createLong,
      Example:               createExample,
      // 验证参数并运行
      Run: func(cmd *cobra.Command, args []string) {
         if cmdutil.IsFilenameSliceEmpty(o.FilenameOptions.Filenames, o.FilenameOptions.Kustomize) {
            ioStreams.ErrOut.Write([]byte("Error: must specify one of -f and -k\n\n"))
            defaultRunFunc := cmdutil.DefaultSubCommandRun(ioStreams.ErrOut)
            defaultRunFunc(cmd, args)
            return
         }
         cmdutil.CheckErr(o.Complete(f, cmd))
         cmdutil.CheckErr(o.ValidateArgs(cmd, args))
         // 核心的运行代码逻辑是在这里的RunCreate
         cmdutil.CheckErr(o.RunCreate(f, cmd))
      },
   }

   // bind flag structs
   o.RecordFlags.AddFlags(cmd)

   usage := "to use to create the resource"
   // 加入文件名选项的flag -f，保存到o.FilenameOptions.Filenames中，对应上面
   cmdutil.AddFilenameOptionFlags(cmd, &o.FilenameOptions, usage)
   cmdutil.AddValidateFlags(cmd)
   cmd.Flags().BoolVar(&o.EditBeforeCreate, "edit", o.EditBeforeCreate, "Edit the API resource before creating")
   cmd.Flags().Bool("windows-line-endings", runtime.GOOS == "windows",
      "Only relevant if --edit=true. Defaults to the line ending native to your platform.")
   cmdutil.AddApplyAnnotationFlags(cmd)
   cmdutil.AddDryRunFlag(cmd)
   cmd.Flags().StringVarP(&o.Selector, "selector", "l", o.Selector, "Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)")
   cmd.Flags().StringVar(&o.Raw, "raw", o.Raw, "Raw URI to POST to the server.  Uses the transport specified by the kubeconfig file.")

   o.PrintFlags.AddFlags(cmd)

   // create的子命令，指定create对象
   cmd.AddCommand(NewCmdCreateNamespace(f, ioStreams))
   cmd.AddCommand(NewCmdCreateQuota(f, ioStreams))
   cmd.AddCommand(NewCmdCreateSecret(f, ioStreams))
   cmd.AddCommand(NewCmdCreateConfigMap(f, ioStreams))
   cmd.AddCommand(NewCmdCreateServiceAccount(f, ioStreams))
   cmd.AddCommand(NewCmdCreateService(f, ioStreams))
   cmd.AddCommand(NewCmdCreateDeployment(f, ioStreams))
   cmd.AddCommand(NewCmdCreateClusterRole(f, ioStreams))
   cmd.AddCommand(NewCmdCreateClusterRoleBinding(f, ioStreams))
   cmd.AddCommand(NewCmdCreateRole(f, ioStreams))
   cmd.AddCommand(NewCmdCreateRoleBinding(f, ioStreams))
   cmd.AddCommand(NewCmdCreatePodDisruptionBudget(f, ioStreams))
   cmd.AddCommand(NewCmdCreatePriorityClass(f, ioStreams))
   cmd.AddCommand(NewCmdCreateJob(f, ioStreams))
   cmd.AddCommand(NewCmdCreateCronJob(f, ioStreams))
   return cmd
}
```

## RunCreate() -create的执行

在上述我们知道了 create的创建过程，真正执行是RunCreate 我们就来看看RunCreate

主要流程为
 1 初始化 工厂类
 2 初始化builder
 3 利用观察者模式处理资源创建  封装client 和object  发送给apiserver


pkg/kubectl/cmd/cmd.go

```go
func (o *CreateOptions) RunCreate(f cmdutil.Factory, cmd *cobra.Command) error {
	// f为传入的Factory，主要是封装了与kube-apiserver交互客户端
  
	schema, err := f.Validator(cmdutil.GetFlagBool(cmd, "validate"))
	if err != nil {
		return err
	}

	cmdNamespace, enforceNamespace, err := f.ToRawKubeConfigLoader().Namespace()
	if err != nil {
		return err
	}

  // 实例化Builder，这块的逻辑比较复杂，我们先关注文件部分
	r := f.NewBuilder().
		Unstructured().
		Schema(schema).
		ContinueOnError().
		NamespaceParam(cmdNamespace).DefaultNamespace().
  	// 读取文件信息，发现除了支持简单的本地文件，也支持标准输入和http/https协议访问的文件，保存为Visitor
		FilenameParam(enforceNamespace, &o.FilenameOptions).
		LabelSelectorParam(o.Selector).
		Flatten().
		Do()
	err = r.Err()
	if err != nil {
		return err
	}

	count := 0
  // 调用visit函数，创建资源
	err = r.Visit(func(info *resource.Info, err error) error {
		// 打印结果 xxxx created
		return o.PrintObj(info.Object)
	})
	return nil
}
```