---
title: MySQL
tags:
  - db
categories:
  - 技术文档
  - 前端
  - db
date: 2020-08-16 22:09:15
---

## 命令

### 启动mysql

1. sudo /usr/local/mysql/support-files/mysql.server start**

### 停止mysql

1. sudo /usr/local/mysql/support-files/mysql.server stop**

### 重启mysql

1. sudo /usr/local/mysql/support-files/mysql.server restart**



## 服务管理命令

```bash

brew services start mysql
brew services run mysql
brew services stop mysql
```

# 参考资料
[mysql启动关闭服务](https://www.jianshu.com/p/eee8a7de179c)


# Mysql 忘记密码恢复

# 步骤1

找到 `usr/local/etc/my.cnf`,添加 skip-grant-tables

# 步骤2

重新启动服务 mysql.server start

# 步骤3

选择数据mysql use mysql

# 步骤4

设置密码为空

update user set authentication_string='' where user="root"


推出

quit;

# 步骤5

重启mysql,并登陆

mysql.server restart

mysql -u root -p

# 步骤6


设置密码校验规格,及密码长度

SHOW VARIABLES LIKE 'validate_password%';

set global validate_password.policy=LOW;
set global validate_password.length=6;

否则报错: ERROR 1819 (HY000): Your password does not satisfy the current policy requirements

# 步骤7

修改密码

ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';

推出

quit;

# 步骤8

重新用密码登陆
