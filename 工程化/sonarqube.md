---
title: sonarqube
tags:
  - ci/cd
categories:
  - 技术文档
  - 前端
  - ci/cd
date: 2020-09-12 22:40:32
---

# 安装
## 安装数据库

```bash
$> docker run -d --name pgdb -e POSTGRES_USER=sonar  -e POSTGRES_PASSWORD=sonar -v ~/data/pgdata:/var/lib/postgresql/data-d docker.io/postgres:latest
```

## 安装 sonarqube

```bash
$> docker volume create --name sonarqube_data
$> docker volume create --name sonarqube_extensions
$> docker volume create --name sonarqube_logs

$> docker run -d --name sonarqube --link pgdb \
    -p 9000:9000 \
    -e SONAR_JDBC_URL=jdbc:postgresql://pgdb:5432/sonar \
    -e SONAR_JDBC_USERNAME=sonar \
    -e SONAR_JDBC_PASSWORD=sonar \
    -v sonarqube_data:/opt/sonarqube/data \
    -v sonarqube_extensions:/opt/sonarqube/extensions \
    -v sonarqube_logs:/opt/sonarqube/logs \
    sonarqube
```

## 安装 sonar-scanner

```bash
brew install sonar-scanner
```

# 配置

1. 登录 sonarqube 网站 `http://192.168.31.73:9000`

2. 在

