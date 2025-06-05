---
title: visual studio code terminal command
tags:
  - 开发
categories: 技术文档
description: vs code 新一代前段开发神器
date: 2016-11-07 17:32:11
---


之前一直用sublime text 但是sublime text在linux 上的中文输入问题一直让人很蛋疼，前两天刚看了一个博客发现了一个和sublime text 差不多的一个开发编辑器。于是就打算试试，感觉还不错就推荐一下

# 问题

## 命令行启动

> linux 直接使用 `code {文件名}`打开对应的文件

> mac 上没有 `code` 命令需要自己安装
    
  1. 按下`Command + Shift + P`

  2. 输入`shell`

  3. 选择`Shell Command : Install code in PATH`，这样自动安装`code`命令行启动

## root启动

> linux 上使用 `sudo code {文件名}` 会报错

        It is recommended to start vscode as a normal user. To run as root, you must specify an alternate user data directory with the --user-data-dir argument.

所以要加上 `sudo code --user-data-dir=/`,之后会有一个空目录，选择要打开的文件或目录即可

## git

> 如果要使用编辑器自带的git工具需要安装git，mac由于使用的是Xcode的git命令，需要安装Xcode之后才能使用。