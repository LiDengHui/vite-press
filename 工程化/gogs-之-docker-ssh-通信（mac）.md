---
title: gogs 之 docker ssh 通信（mac）
date: 2017-02-25 22:18:25
tags: [docker,gogs]
description: 在使用docker布置gogs时遇到的ssh链接问题 

---

打算用docker布置一下gogs，用来给公司建立代码库

在连接ssh时遇到要输入密码的问题

后来才发线 docker 在配置gogs是会对端口进行映射导致端口被改变所以需要用./ssh/config,来更改配置的端口号修改代码如下 ~/.ssh/config

		Host	www.macl.com

		Port	32781

然后再下载：

		git clone git@www.macl.com:lidenghui/test.git




