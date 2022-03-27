---
icon: edit
date: 2022-01-01
category:
  - 编程语言
tag:
  - java
  - web
---
# spring boot 教程



插件

maven

```xml
<!--   idea插件     -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
```

```java
@NoArgsConstructor //无参构造函数
@Data  //自动写get和set方法
@AllArgsConstructor  //自动构成构造函数
public class people{
    private int age;
    private String name;
    @Slf4j //日志
    
}
```



##   一 入门 helloword探究

### 1 pom文件

#### 1 父项目

```xml
<!--    父极依赖-->  
    <parent> 
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starterparent</artifactId>  
    <version>2.2.2.RELEASE</version>   
    <relativePath/> 
    <!-- lookup parent from repository --> 
    </parent>

管理spring boot应用里面的所有依赖版本
spring boot的版本仲裁中心：
以后导入依赖默认是不需要写版本的


```

#### 2 导入依赖

```xml

 <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
 </dependency>
spring-boot-starter-web:
	spring-boot-starter:spring-boot场景启动器；帮我们导入了web正常运行所依赖的组件；

       
```





### 2 主程序 主入口

```java
@RestController
@SpringBootApplication
//spring boot 应用程序标注某个类上说明这个类是springboot的主配置类，
//springboot就应该运行这个类的main方法来启动springboot应用
public class DemoApplication {
    @RequestMapping("/")
    public String index(){
        return "Hello Spring Boot";
    }


    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```

### 3    运行类

``` java
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloController {
    @ResponseBody
    @RequestMapping("/hello")
    public String hello(){
        return "hello word";
    }
}

```





### 3 端口改变

在 resources 下面的applicatuon.properties

## 二 配置文件

####  1  application.properties

```properties
server.port=80
```



#### 2  application.yaml

```yaml
server:
	port: 8081
	
```



#### 3   值的绑定

```java

@ConfigurationProperties(prefix = "mingzi")
1  告诉SpringBoot将本类的所有属性和配置文件中的相关配置进行绑定
2  perfix 告诉把哪个配置文件下的属性进行对应   
```

```jav
@Value("${从环境变量中获取}")
@Value("#{计算式}")
@Value("值")

```



#### 4  配置文件的读取

 @PropertySource(value = {"classpath:persion.properties"})

@ImportResource:导入Spring的配置文件，让配置文件里面的内容生效;

Spring Boot里面没有Spring 的配置文件，我们自己编写的配置文件，也不能自动识别；

@ImportResource(locations={"class:beans.xml"})

## 三  添加组件的方式：推荐使用全注解的方式

#### 1 配置类

```java
package com.example.demo.config;

import com.example.demo.controller.HelloController;
import com.example.demo.service.HelloService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//@Configuration指明当前类是一个配置类
@Configuration
public class MyAppConfig {
    //将方法的返回值添加到容器中；容器中这个组件默认的id就是方法名
    @Bean
    public HelloService helloService(){
        System.out.println("配置类的@Bean给容器中添加了组件");
        return new HelloService();
    }
}

```

#### 2 配置文件的激活

  ```yaml
1  在配置文件中指定  spring.profiles.active=dev
  ```



## 四 日志系统

### 

#### 1 日志主类的书写

```java
   //日志的级别
    //由低到高
    //可以调整输出的日志级别,日志就会在这个级别以后的高级别生效
    Logger logger= LoggerFactory.getLogger(getClass());

    @Test
    public void contextLoad(){
        logger.trace("这是trace日志。。。");
        logger.debug("这是debug日志。。。");
        //SpringBoot默认给我们使用的是info级别的，没有指定级别就使用默认级别
        logger.info("这是info日志。。。");
        logger.warn("这是warn日志。。。");
        logger.error("这是error日志。。。");

    }
```

#### 2  日志系统的基本配置

```properties
logging.level.com.example.demo=trace
#指定文件路径
logging.file.path=/spring/log
#指定文件名
logging.file.name=spring.log
```

## 五  静态资源的引用

#### 1 webjars包的引用

​    https://www.webjars.org/ 到webjars首页




找到对应的maven引入到pom文件中 



```xml

    <dependencies>

        <!--引入jQuery依赖-->
        <dependency>
            <groupId>org.webjars</groupId>
            <artifactId>jquery</artifactId>
            <version>3.4.1</version>
        </dependency>

    </dependencies>
```

#### 2  访问静态资源 

```
"classpath:/META-INF/resources/",
"classpath:/resources",
"classpath:/static",
"classpath:/public"
"/" 表示当前目录
```

**在路径下面创建index.html文件在没有找到所需要的的请求的时候就返回index.html文件的内容**

#### 3 配置导航图标

在静态资源目录下面放入favicon.ico后  无论在哪个目录下访问服务都会有这个图标

## 六模板引擎  Thymeleaf

#### 1 Thymeleaf 的引用

```xml
<properties>
        <java.version>1.8</java.version>
        <!--选择thymeleaf的版本-->
        <properties>
            <thymeleaf.version>3.0.2RELEASE</thymeleaf.version>
            <thymeleaf-layout-dialect.version>2.1.1</thymeleaf-layout-dialect.version>
        </properties>
</properties>
```

```xml
<dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

#### 2 Thymeleaf 使用和语法

##### 1， Thymeleaf的使用

```java
@Controller  //使用这个修饰器  程序就会自动在templates等路径下寻找success.html文件返回文件
@SpringBootApplication
public class DemoApplication {
 
    @RequestMapping("/success")
    public String success(){
        //classpath:/templates/success.html
        return "success";
    }
}
```


##### 2，Thymeleaf的语法

```java
 @RequestMapping("/success")
    public String success(Map<String,Object> map){
        map.put("hello","你好");
        //classpath:/templates/success.html
        return "success";
    }
```

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<!--导入名称空间-->
<head>
    <meta charset="UTF-8">
    <title>Success</title>
</head>
<body>
<h1>Success 成功请求页面 </h1>
<h2 th:text="${hello}"></h2>

</body>
</html>
```

```properties
th:insert     片段包含
th:replace


th:each	      片段循环


th:if		 条件判断
th:unless
th:switch


th:object    变量声明
th:with

th:attr		任意属性修改 支持前面追加和后面追加
th:attrprepend
th:attrappend


th:value	修改指定属性
th:href
th:src


th:text		修改标签体里面的内容  转义/不转义
th:utext
```

```xml
*{...} ${..}选择表达式，
<div th:object="${session.user}">
<p>Name:<span th:text="*{firstName}">Sebastion</span>.</p>
</div>

th:if="${not #strings.isEmpty(msg)}"

#{...}获得国际化内容
@{...}定义url  @{/order/process(execId=${execid},execType="FAST")}
~{...}片段引用表达式 <div th:insert="commons :: main">...</div>
```

#####  3, 	视例代码

```java
@RequestMapping("/success")
    public String success(Map<String,Object> map){
        map.put("hello","<h1>你好</h1>");
        map.put("users", Arrays.asList("张三","李四","王五"));
        //classpath:/templates/success.html
        return "success";
    }
```

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Success</title>
</head>
<body>
<h1>Success 成功请求页面 </h1>
<h2 th:text="${hello}"></h2>
<!--导入名称空间-->
<hr/>
<div th:text="${hello}"></div>
<div th:utext="${hello}"></div>
<hr/>
<h4 th:text="${user}" th:each="user : ${users}"></h4>
<hr/>
<h4>
    <!--  [[${user}]] th:text   [(${user})]  th:utext -->
    <span th:each="user:${users}">[[${user}]]</span>
</h4>
</body>
</html>
```



## 七 jdbc配置



pwm.xml

```xml
<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
```



application.yml配置详情

```yml
spring:
  datasource:
    username: root
    password: 123456
    url: jdbc:mysql://fangyulong.top:3306/jdbc
    driver-class-name: com.mysql.cj.jdbc.Driver
#    选择druid数据源
    type: com.alibaba.druid.pool.DruidDataSource
```



配置类中的信息如图所示 可以显示配置的信息

```java
@RunWith(SpringRunner.class)
@SpringBootTest
class DemoApplicationTests {

    @Autowired
    DataSource dataSource;

    @Test
    void contextLoads() throws SQLException {
        System.out.println(dataSource.getClass());
        Connection connection=dataSource.getConnection();
        System.out.println(connection);
        connection.close();
    }

}

```





在controller下面创建 HelloController  这个时候进入路由/query的时候可以得到查询的数据 

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;
@Controller
public class HelloController {
    @Autowired
    JdbcTemplate jdbcTemplate;
    
    @ResponseBody
    @GetMapping("/query")
    public Map<String ,Object> map(){
        List<Map<String,Object>> list=jdbcTemplate.queryForList("select  * from user");
        return list.get(0);
    }
}
```

## 八  配置druid

pom.xml文件的相关内容

```xml
  <!--        引入druid数据源-->
        <!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.18</version>
        </dependency>


        <!-- https://mvnrepository.com/artifact/log4j/log4j -->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.11</version>
        </dependency>

```

application.yaml文件添加类容

```yaml
    initialSize: 5
    minIdle: 5
    maxActive: 20
    maxWait: 60000
    timeBetweenEvictionRunsMillis: 60000
    minEvictableIdleTimeMillis: 300000
    validationQuery: SELECT 1 FROM DUAL
    testWhileIdle: true
    testOnBorrow: false
    testOnReturn: false
    poolPreparedStatements: true

    filters: stat,wall,log4j
    maxPoolPreparedStatementPerConnectionSize: 20
    useGlobalDataSourceStat: true
    connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
```



讲配置文件注入到容器中

在config 下创建DruidConfig类

```java
package com.atguigu.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DruidConfig {
    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource druid(){
        return new DruidDataSource();
    }


    //配置druid监控
    //1配置一个管理后台Servet
    @Bean
    public ServletRegistrationBean servletRegistrationBean(){
         ServletRegistrationBean bean= new ServletRegistrationBean(new StatViewServlet(),"/druid/*");
        Map<String,String> initParams = new HashMap<>();
        initParams.put("loginUsername","admin");//用户名
        initParams.put("loginPassword","123456");//密码
        initParams.put("allow","");//不填代表所有都可以访问
        initParams.put("deny","192.168.15.21");//拒绝访问的ip地址

        bean.setInitParameters(initParams);

         return bean;
    }


    //2， 配置一个web监控的filter
    @Bean
    public FilterRegistrationBean webStatFilter(){
        FilterRegistrationBean bean = new FilterRegistrationBean();
        bean.setFilter(new WebStatFilter());

        Map<String,String> initParams = new HashMap<>();
        initParams.put("exclusions","*.js,*.css,/druid/*");//这些结尾的文件不拦截
        bean.setInitParameters(initParams);

        bean.setUrlPatterns(Arrays.asList("/*"));

        return bean;
    }
}

```





## 九   Mybatis集成

### 1 Mapper注解板

开始要配置druid数据源

bean 目下创建  Department 

```java
package com.atguigu.bean;

public class Department {
    private Integer id;
    private String departmentName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
}

```

在 bean 目录下创建 Employee

```java
package com.atguigu.bean;

public class Employee {
    private Integer id;
    private String lastName;
    private String gender;
    private String email;
    private Integer dId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getdId() {
        return dId;
    }

    public void setdId(Integer dId) {
        this.dId = dId;
    }
}

```

在config 目录下创建 DruidConfig

```java
package com.atguigu.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DruidConfig {
    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource druid(){
        return new DruidDataSource();
    }


    //配置druid监控
    //1配置一个管理后台Servet
    @Bean
    public ServletRegistrationBean servletRegistrationBean(){
        ServletRegistrationBean bean= new ServletRegistrationBean(new StatViewServlet(),"/druid/*");
        Map<String,String> initParams = new HashMap<>();
        initParams.put("loginUsername","admin");
        initParams.put("loginPassword","123456");
        initParams.put("allow","");//不填代表所有都可以访问
        initParams.put("deny","192.168.15.21");//拒绝访问的ip地址

        bean.setInitParameters(initParams);

        return bean;
    }


    //2， 配置一个web监控的filter
    @Bean
    public FilterRegistrationBean webStatFilter(){
        FilterRegistrationBean bean = new FilterRegistrationBean();
        bean.setFilter(new WebStatFilter());

        Map<String,String> initParams = new HashMap<>();
        initParams.put("exclusions","*.js,*.css,/druid/*");
        bean.setInitParameters(initParams);

        bean.setUrlPatterns(Arrays.asList("/*"));

        return bean;
    }
}

```

在controller 下创建 DeptConntroller.java文件

```java
package com.atguigu.controller;

import com.atguigu.bean.Department;
import com.atguigu.mapper.DepartmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeptConntroller {
    @Autowired
    DepartmentMapper departmentMapper;


    @GetMapping("/dept/{id}")
    public Department getDepartment(@PathVariable("id") Integer id){
        return departmentMapper.getDeptById(id);//http://localhost:8080/dept/1
    }

    @GetMapping("/dept")
    public Department insertDept(Department department){
        departmentMapper.insertDept(department);//http://localhost:8080/dept?departmentName=BB
        return department;
    }
}

```

在 mapper目录下创建DepartmentMapper接口

```java
package com.atguigu.mapper;

import com.atguigu.bean.Department;
import org.apache.ibatis.annotations.*;

//指定这是一个操作数据库的mapper
@Mapper
public interface DepartmentMapper {

    @Select("select * from department where id = #{id}")
    public Department getDeptById(Integer id);

    @Delete("delete from department where id = #{id}")
    public int deleteDeptById(Integer id);
    
    
	@Options(useGeneratedKeys  = true)//是否显示自增属性
    @Insert("insert into department(departmentName)  values(#{departmentName})")
    public int insertDept(Department department);

    @Update("update department set departmentName=#{departmentName} where id=#{id}")
    public int updateDept(Department department);
}

```

@MapperScan(value = "com.atguigu.springboot.mapper")

批量扫描mapper接口扫描





### 2 xml文件版

在yml中指定映射文件的路径

```yaml
mybatis:
  config-location: classpath:mybatis/mybatis-config.xml
  mapper-locations: classpath:mybatis/mapper/*.xml
```

在controller下的DeptConntroller中设置路由

```java
package com.atguigu.controller;

import com.atguigu.bean.Department;
import com.atguigu.bean.Employee;
import com.atguigu.mapper.DepartmentMapper;
import com.atguigu.mapper.EmployeeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeptConntroller {
    @Autowired
    DepartmentMapper departmentMapper;

    @Autowired
    EmployeeMapper employeeMapper;


    @GetMapping("/dept/{id}")
    public Department getDepartment(@PathVariable("id") Integer id){
        return departmentMapper.getDeptById(id);//http://localhost:8080/dept/1
    }

    @GetMapping("/dept")
    public Department insertDept(Department department){
        departmentMapper.insertDept(department);//http://localhost:8080/dept?departmentName=BB
        return department;
    }


    @GetMapping("/emp/{id}")
    public Employee getEmp(@PathVariable("id") Integer id){
        return employeeMapper.getEmpById(id);
    }
}

```



在mapper下面写EmployeeMapper接口

```java
package com.atguigu.mapper;

import com.atguigu.bean.Employee;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmployeeMapper {
    public Employee getEmpById(Integer id);

    public void insertEmp(Employee employee);
}

```

在resources目录下创建 mybatis文件夹  下创建mybatis-config.xml  



```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>

</configuration>
```





在mybatis文件夹下创建 EmployeeMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mapper.EmployeeMapper">
    <!--    public Employee getEmpById(Integer id);

        public void insertEmp(Employee employee);-->

    <select id="getEmpById" resultType="com.atguigu.bean.Employee">
        SELECT * FROM employee WHERE id = #{id}
    </select>
    <insert id="insertEmp">
        INSERT  INTO employee(lastName,email,gender,d_id) VALUES (#{lastName},#{email},#{gender},#{dId})
    </insert>
</mapper>
```



## 十  jpa配置

yml文件的配置

```yaml
spring:
  datasource:
    username: root
    password: 123456
    url: jdbc:mysql://fangyulong.top:3306/jpa
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      #更新或者创建数据表
      ddl-auto: update
    #控制台显示sql
    show-sql: true


```



entity下面创建User.java的映射文件

```java
package com.example.entity;

import javax.persistence.*;
//使用jpa、注解配置映射关系
@Entity//告诉JPA这是一个实体类（和数据表映射的类）
@Table(name = "tbl_user")//@TAble来指定和哪个数据表对应；如果省略默认表就是user
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//自增主键
    private Integer id;
    @Column(name = "last_name",length = 50)//这是和数据表对应的一个列
    private String lastName;
    @Column//省略默认列名就是属性名
    private String email;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

```

repository下面创建 UserRepository接口

```java
package com.example.repository;

import com.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer> {
}

```

controller 下面创建UserController.java

```java
package com.example.controller;

import com.example.entity.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable("id") Integer id){
        User user = userRepository.findById(id).orElse(null);
        return user;

    }

    @GetMapping("/user")
    public User insertUser(User user){
        User save = userRepository.save(user);
        return  save;
    }
}

```

数据的插入 http://localhost:8080/user?lastName=zhangsan&email=aa 

数据查询     http://localhost:8080/user/1 

## 十一 MyBatis-Plus

### 1基本配置

数据库建表 

```sql

CREATE TABLE user
(
	id BIGINT(20) NOT NULL COMMENT '主键ID',
	name VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
	age INT(11) NULL DEFAULT NULL COMMENT '年龄',
	email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
	PRIMARY KEY (id)
);


INSERT INTO user (id, name, age, email) VALUES
(1, 'Jone', 18, 'test1@baomidou.com'),
(2, 'Jack', 20, 'test2@baomidou.com'),
(3, 'Tom', 28, 'test3@baomidou.com'),
(4, 'Sandy', 21, 'test4@baomidou.com'),
(5, 'Billie', 24, 'test5@baomidou.com');
```

applications.yml配置

```yml
spring:
  datasource:
    #数据源的基本配置
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
#    driver-class-name: com.mysql.jdbc.Driver

    url: jdbc:mysql://fangyulong.top:3306/MyBatis_Plus

```

Bean下面创建User.java

```java
package com.example.Bean;

public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;

    public User() {
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", email='" + email + '\'' +
                '}';
    }

    public User(Long id, String name, Integer age, String email) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.email = email;
    }

    public User(String name, Integer age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

```

Mapper文件夹下面创建UserMapper.java

```JAVA
package com.example.Mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.Bean.User;

public interface UserMapper extends BaseMapper<User> {

}
```

启动类添加扫描注解

```java
package com.example;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.Mapper")
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}

```

text类测试

```java
@RunWith(SpringRunner.class)
@SpringBootTest
class DemoApplicationTests {
    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {
//        数据插入
        User user = new User();
        user.setName("王启年");
        user.setAge(44);
        user.setEmail("3095329264@qq.com");
        int rows = userMapper.insert(user);
        System.out.println("影响记录条数"+rows);


//        数据的查询
        System.out.println(("----- selectAll method test ------"));
        List<User> userList = userMapper.selectList(null);
        Assert.assertEquals(8, userList.size());
        userList.forEach(System.out::println);
    }



}

```

### 2 常用注解



| 名称                     | 描述：                        |
| ------------------------ | ----------------------------- |
| @TableName（"表名字"）   | 表名注解 对应数据库中的某个表 |
| @Tabledld                | 表示主键                      |
| @TableField("字段名")    | 指定对应数据库中的某个列      |
| @TableField(exist=false) | 注解字段不序列化              |
|                          |                               |
|                          |                               |
|                          |                               |
|                          |                               |

### 3查询字段





### 4 数据的增删改查

#### >1根据id查数据

```java
//    根据Id查询数据
    @Test
    void selectById() {
        User user = userMapper.selectById(1218876814844268545L);
        System.out.println(user);

    }
```

#### >2 根据多个id查询多个数据

```java
//   根据多个id查询多个id
    @Test
    void selectBuIds() {
        List<Long> idsList = Arrays.asList(1218876942820921345L, 1218877033581506561L, 1218876942820921345L);
        List<User> userList = userMapper.selectBatchIds(idsList);
        userList.forEach(System.out::println);
    }
```

#### >3 根据条件查询数据

```java
//    根据条件查询数据  name="王启年"  and id = 1218876942820921345L
    @Test
    void selectByMap() {
        Map<String, Object> columnMap = new HashMap<>();
        columnMap.put("name", "王启年");
        columnMap.put("id", 1218876942820921345L);
        List<User> userList = userMapper.selectByMap(columnMap);
        userList.forEach(System.out::println);

    }


//    根据条件查询  name 中含有年字    age在50一下
    @Test
    void selectByWrapper() {
        QueryWrapper<User> queryWrapper = new QueryWrapper<User>();
        queryWrapper.like("name", "年").lt("age", 50);

        List<User> userList = userMapper.selectList(queryWrapper);
        userList.forEach(System.out::println);

    }
```

#### >4根据id更新数据

```java
//      根据id更新数据
    @Test
    void updateById() {
        User user = new User();
        user.setId(1L);
        user.setEmail("123@qq.com");
        user.setAge(100);
        int rows = userMapper.updateById(user);
        System.out.println("影响记录数：" + rows);

    }

```

#### >5 根据条件更新数据

```java
//    根据条件更新数据  name = "王启年" age=44 的数据 年纪改成1  邮箱改成123@qq.com
    @Test
    void updateByWrapper() {
        UpdateWrapper<User> updateWrapper = new UpdateWrapper<User>();
        updateWrapper.eq("name", "王启年").eq("age", 44);
        User user = new User();
        user.setEmail("123@qq.com");
        user.setAge(1);
        int rows = userMapper.update(user, updateWrapper);
        System.out.println("影响记录数：" + rows);

    }



//    根据条件更新数据  name = "王启年" age=44 的数据 年纪改成10
    @Test
    void updateByWrapper3() {
        UpdateWrapper<User> updateWrapper = new UpdateWrapper<User>();
        updateWrapper.eq("name", "王启年").eq("age", 44).set("age",10);
        int rows = userMapper.update(null, updateWrapper);
        System.out.println("影响记录数：" + rows);

    }
```

#### >6根据id删除数据

```java
//    根据id删除数据
    @Test
    void deleeteById(){
        int rows = userMapper.deleteById(1218876942820921345L);
        System.out.println("删除条数："+rows);
    }
```

#### >7 根据id删除多个

```java
void deleteBatchIds(){
        int rows = userMapper.deleteBatchIds(Arrays.asList(1L,2L));
        System.out.println("删除条数："+rows);
    }

```

#### >8 根据条件删除

```java
@Test
    void delectByMap(){
        Map<String,Object> columnMap = new HashMap<>();
        columnMap.put("name","Jony");
        columnMap.put("age",22);
        int rows = userMapper.deleteByMap(columnMap);
        System.out.println("删除条数：" + rows);
    }
```

## 十二 获得地址参数的方法

#### PathVaribale   localhost：8080/hello/100/hello

```java
@ResponseBody
    @RequestMapping(value = "/test/{id}/{name}", method = RequestMethod.GET)
    public String sayhello1(@PathVariable("id") Integer id, @PathVariable("name") String name) {
        return "id" + id + "name" + name;
    }
```

#### RequestParam  localhost:8080/hello?id=1000

```java
//    RequestParam 获取请求参数的值
    //    localhost:8080/hello?id=1000
    //localhost:8080/hello?id=98&&name=helloworld
    //required=false 表示url中可以无id参数，此时就使用默认参数
    @ResponseBody
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String sayhello2(@RequestParam(value = "id", required = false, defaultValue = "1") Integer id,
                            @RequestParam(value = "name", required = false, defaultValue = "路人甲") String name) {
        return "id" + '\t' + id + '\n' + "name" + '\t' + name;
    }
```

## 十三 spring mvc

| 注解            | 解释                                                        |
| --------------- | ----------------------------------------------------------- |
| @Controller     | 处理http请求                                                |
| @RestController | @Controller和@ResponseBody组合注解   返回字符串或者json数据 |
| @GetMapping     | RequestMapping和Post请求方法的组合                          |
| @PostMapping    | RequestMapping和Post请求方法的组合                          |
| @PutMapping     | RequestMapping和Put方法的组合                               |
| @DeleteMapping  | RequestMapping和Delete请求方法的组合                        |

