---
icon: edit
date: 2022-01-03
category:
  - 编程语言
tag:
  - java
  - web
---

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

| 查询方式     | 说明                                |
| ------------ | ----------------------------------- |
| setSqlSelect | 设置SELECT查询字段                  |
| where        | Where 语句 凭借+WHERE 条件          |
| and          | AND 语句，拼接+AND字段=值           |
| andNew       | AND语句，拼接+And（字段=值）        |
| or           | Or语句凭借+OR字段=值                |
| orNew        | Or语句凭借+OR（字段=值）            |
| eq           | 等于=                               |
| allEq        | 基于map内容等于=                    |
| ne           | 不等于<>                            |
| gt           | 大于>                               |
| ge           | 大于等于>=                          |
| lt           | 小于<                               |
| le           | 小于等于<=                          |
| like         | 模糊查询LIKe                        |
| notLike      | 模糊查询not like                    |
| in           | IN查询                              |
| notln        | NOT IN 查询                         |
| isNull       | NULL值查询                          |
| isNotNull    | IS NOT NULL                         |
| groupBy      | 分组GROUP BY                        |
| having       | HAVING 关键词                       |
| orderBy      | 排序ORDER BY                        |
| orderAsc     | ASC排序ORDER BY                     |
| orderDesc    | DESC排序ORDER BY                    |
| exists       | EXISTS条件语句                      |
| notExists    | NOT  EXISTS条件语句                 |
| between      | BETWEEN 条件语句                    |
| notBetween   | Not BETWEEN 条件语句                |
| addFilter    | 自由拼接SQL                         |
| last         | 拼接在最后，例如：last（"LIMIT 1"） |
|              |                                     |





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

##  十四 分页查询

config  下面创建MyBatisPlusConfug的设置类

```java
package com.config;


import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement//开启事务
@Configuration//标记该类是一个配置类
@MapperScan("com.Mapper")//加载mapper接口所在的包
public class MyBatisPlusConfig {
    /**
     * 分页查询
     */
    @Bean
    public PaginationInterceptor paginationInterceptor(){
        PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
        return paginationInterceptor;
    }
}

```

test类下创建测试

```java
@Test
    void contextLoads() {
        //创建条件构造器
        QueryWrapper<TableBean> queryWrapper = new QueryWrapper<TableBean>();
        queryWrapper.ge("age",15);
        //创建分页对象
        Page<TableBean> page = new Page<TableBean>(2,2);
        //分页查询
        IPage<TableBean> iPage = tableMapper.selectPage(page,queryWrapper);
        System.out.println("当前页码："+iPage.getCurrent());
        System.out.println("每页显示数量："+iPage.getSize());
        System.out.println("总记录数："+iPage.getTotal());
        System.out.println("总页数："+iPage.getPages());
        List<TableBean> tableBeanList = iPage.getRecords();//员工数据集合
        for (TableBean tableBean:tableBeanList){
            System.out.println(tableBean);
        }

    }
```


