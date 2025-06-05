---
title: npm install 时总是报phantomjs-prebuilt@2.1.14安装失败
date: 2017-03-27 10:54:00
tags: [error]
---

# 解决办法

		npm install phantomjs-prebuilt@2.1.14 --ignore-scripts
		

npm install 时总是报phantomjs-prebuilt@2.1.14安装失败

在npm install时总是报如下错误，

尝试单独安装：npm install phantomjs-prebuilt@2.1.14 还是报错

 

Please report this full log at https://github.com/Medium/phantomjs

npm ERR! Darwin 15.0.0

npm ERR! argv "/usr/local/bin/node" "/usr/local/bin/npm" "install"

npm ERR! node v4.4.3

npm ERR! npm  v3.10.9

npm ERR! code ELIFECYCLE

 

npm ERR! phantomjs-prebuilt@2.1.14 install: `node install.js`

npm ERR! Exit status 1

npm ERR! 

npm ERR! Failed at the phantomjs-prebuilt@2.1.14 install script 'node install.js

 
