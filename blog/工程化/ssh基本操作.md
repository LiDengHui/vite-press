---
title: ssh基本操作
tags:
  - ssh
categories:
  - 技术文档
  - 操作系统
  - ssh
date: 2020-08-09 22:17:03
---

1.启动sshd服务：
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist

2.停止sshd服务：
sudo launchctl unload -w /System/Library/LaunchDaemons/ssh.plist

3查看是否启动：
sudo launchctl list | grep ssh