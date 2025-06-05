---
title: npm 安装程序使用国内镜像
date: 2017-09-23 16:09:43
tags:
---

之前安装npm是使用了cnpm或者切换了源，但是依然有一部分东西下载走得国外的链接，所以，在这里我们讲持续更新.npmrc 的路径以帮助优化使用npm

## 换源

一般国内人使用npm比较慢，所以很多人都装了cnpm，但是cnpm一方面模块之间的依赖可能会不好，另一方面，重复下载很多无用的文件（@开头的）:所以这里介绍一种跟好更方便的方式：

    npm intall -g nrm

`nrm` 是用来切换npm源的一个工具。切过去之后可以很方便的切换回来，比如我要使用cnpm的镜像：

  ![nrm use taobao](./npm-安装程序使用国内镜像/nrmuse.png)

但是我觉得还是不满足，在这里推荐另外一中包安装工具`yarn`，它有一大优势就是不用每次都去远程服务器上取包，他会在本地保存一部分，当我们安装包的使用，直接copy一份就好。

    npm install -g yarn

同样的yarn也存在换源的问题。同样的也从在一个包`yrm`来支持换源。

    npm install -g yrm

换源：

  ![yrm use taobao](./npm-安装程序使用国内镜像/yrmuse.png)


## 添加cdnurl

如：chromedirver下载老是使用google的下载地址，但在国内使用很不方便，于是在安装chromedirver，就要运行命令：

      npm install chromedriver --chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver --CHROMEDRIVER_VERSION=2.25
  
但是在项目里并不是一个人来开发，所以不可能每个人都运行这样一条命令或写成shell，太low。

所以，这里提供更专业一点的办法，在package.json的更目录建立`.npmrc`的文件。内部加入

```conf    
    chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
    selenium_cdnurl=http://npm.taobao.org/mirrorss/selenium
    phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
    electron_mirror=https://npm.taobao.org/mirrors/electron
    node_sassurl=http://npm.taobao.org/mirrors/node_sass
    puppeteer_cdnurl=http://npm.taobao.org/mirrors/puppeteer
```
后面的链接可以更改成其他的镜像文件，也可以（需要什么加什么）。
