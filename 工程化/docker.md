---
title: docker
tags:
  - docker
categories:
  - 技术文档
  - 前端
  - docker
date: 2020-09-12 22:45:24
---

# docker 命令

| 命令                   | 说明     |
| ---------------------- | -------- |
| docker image ls -a     | 查看镜像 |
| docker container ls -a | 查看容器 |


# docker 查看日志
实时查看docker容器日志

$ sudo docker logs -f -t --tail 行数 容器名



例：实时查看docker容器名为s12的最后10行日志

$ sudo docker logs -f -t --tail 10 s12