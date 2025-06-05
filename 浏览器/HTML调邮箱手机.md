---
title: HTML调邮箱手机
date: 2019-08-20 13:37:28
tags:
---

## `format-detectio` 

`格式检测` , 默认为yes，yes为开启样式允许跳转，no为不开启样式不允许跳转

    <meta name="format-detection" content="telephone=no,email=no,adress=no">
    

## 打电话

    <a href="tel:400-0000-688">400-0000-688</a>
    

## 发信息

    <a href="sms:18688888888">发短信</a>
    

## 发邮件

    <a href="Mailto:ghsau@163.com?CC=ghsau@163.com&BCC=ghsau@163.com&Subject=Hello&Body=你好">给我发邮件</a>
    
CC       | BCC          | Subject | Body
---------|--------------|---------|-----
抄送地址 | 密件抄送地址 | 主题    | 邮件内容
