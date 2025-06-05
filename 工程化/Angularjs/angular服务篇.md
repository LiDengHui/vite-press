---
title: angular服务篇
date: 2016-06-03 11:10:18
tags: [前端,框架,angularjs]
categories: 技术文档
description: 前端框架angularjs服务类型详解
---

## 运用范围

Controller: 只用来处理简单的页面逻辑, 及处理View层,为View-Model修饰层,数据在Controller里被绑定道View-Model层即$scope,最后通过$digest循环来刷新页面.
Service: 用来处理复杂的数据逻辑,与后台服务器通信构成Model层,与Controller互联完成页面的数据传输.

## Service

1. Factory
2. Service
3. Provider

### Factory 

创建一个数据结构,包括对象和函数,并将其返回,在Factory 加载时被调用,后台只保留一份.但是当返回函数时可以通过new操作符,创建独立作用域数据.

### Service:

返回一个this 对象当然也可以不返回,默认为this.对象本身会在controller 调用时被创建一次,但仅仅只会被创建一次,属于单利模式.

### Provider

在angular载入时加载ProviderProvider,是唯一一种在angular运行开始时传入.config的服务,如果要进行模块范围的配置就用provider.在被Controller调用时,只会调用this.$get函数中的返回值


### 实现

Provider --> Factory --> Service
