---
title: jenkins安装
tags:
  - webpack
categories:
  - 技术文档
  - 前端
  - webpack
date: 2020-09-17 21:22:47
---

# 安装

## 拉取镜像
```bash
docker pull jenkins
```

## 创建卷积
```bash
docker volume create --name jenkins_home
```
## 运行 docker
```bash
docker run \
    --name jenkins \
    -itd \
    -p 8080:8080 \
    -p 50000:50000 \
    -v jenkins_home:/var/jenkins_home \
    jenkins
```
## 删除容器

docker container rm jenkins

## 暂停服务

docker container stop jenkins

## copy 文件

docker cp jenkins.war jenkins:/usr/share/jenkins/
# 配置

## 输入密码

密码保存在`/var/jenkins_home/secrets/initialAdminPassword`目录下

进入 docker container bash, 打印密码
```bash
docker exec -it jenkins /bin/bash
cat /var/jenkins_home/secrets/initialAdminPassword
//7c5f6c209bd24a57b50b1decf50564e8
```


# 创建项目
