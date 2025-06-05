---
title: CORS-简单请求与复杂请求
tags:
  - 浏览器
categories:
  - 技术文档
  - 前端
  - 浏览器
date: 2020-08-18 22:19:19
---


# CORS

CORS即Cross Origin Resource Sharing (跨来源资源共享), 通俗说就是我们所熟知的跨域请求,
众所周知,在以前,跨域可以采用代理、JSONP等方式,而在Nodern浏览器前,一切终将是过去,应为有了CORS

CORS 通过服务器端设置Access-Control-Allow-Origin 响应头,即可使指定来源像同源接口一样访问,

CORS 分成两类: 1. 简单请求, 2. 复杂请求

# 简单请求

## HTTP方法为
* HEAD
* GET
* POST

## 请求头不能超出一下字段
* Accept
* Accept-Language
* Content-Language
* Last-Event-ID
* Content-Type,但仅支持一下列  
  1. application/x-www-form-urlencoded
  2. multipart/form-data
  3. text/plain

任何一个不满足上述要求的请求,即被认为是复杂请求.一个复杂请求不仅有包含通信内容的请求,同时也包含预请求(preflight request)

简单请求的发送从代码上来看和普通的XHR没有太大的区别,但是HTTP头当中要求总是包含一个域(origin)的信息, 该域包含协议名、地址、以及一个可选的端口.不过这一项实际是由浏览器代为发送,并不是开发者代码可以触及到的


## 简单请求部分解释

* Access-Control-Allow-Origin(必含)---不可省略,否则请求按失败处理.该项控制数据可见范围,如果希望所有人可见,可以填写“*”
* Access-Control-Allow-Credentials(可选)---该项标志请求当中是否包含cookies信息,只有一个可选值true,如果不包含cookies,请略去该项.这一项与XmlHttpRequest2对象中的withCredentials属性应保持一致, 即withCredentiaks为true时,该项也为true;
* Access-Control-Expose-Heads(可选) --- 该项确定XmlHttpRequest2对象中getResponseHeader()方法所能获取的额外信息,通常只能获取到如下信息
  1. Cache-Control
  2. Content-Language
  3. Content-Type
  4. Expires
  5. Last-Modified
  6. Pragma
  7. 当你需要访问额外信息是,就需要在这项当中填写并以逗号进行分隔

如果仅仅是简单请求,那么即便不用CORS也没有什么大不了,但是CORS的复杂请求就令CORS显的更加有用了,简单来说,任何不满足上述简单请求要求的请求,都属于复杂请求,比如PUT、DELETE、等HTTP动作, 或发送Content-Type: application/json的内容

# 复杂请求

复杂请求表面上看起来和简单请求使用差不多,但实际上浏览器发送了不止一个请求.其中最先发送的是一种“预请求”,此时作为服务器端,也需要返回“预回应”作为响应.预请求实际上是对服务器的一种权限请求,只有当预请求成功返回.实际请求才开始执行.

预请求以OPTIONS形式发送,当中同样包含域,并且还包含了两项CORS特有内容

* Access-Control-Request-Method --- 该项内容是实际请求的种类,可以是GET、POST之类的简单请求,也可以是PUT、DELETE等等
* Access-Control-Request-Headers --- 该项是一个以逗号分隔的列表,当中是复杂请求所使用的头部

显而易见,这个预请求实际上就是在为之后的实际请求发送一个权限请求,在预请求应返回的内容当中, 服务端应当对这两项进行回复, 让浏览器确定请求是否能够成功完成

## 复杂请求的部分响应头及解释

* Access-Control-Allow-Origin(必含) --- 和简单请求一样,必须包含域
* Access-Control-Allow-Method(必含) --- 这是对预请求当中Access-Control-Request-Method的回复,这一回复将是以逗号分隔的列表.尽管客户端或许只请求某一个方法,但服务器端仍然可以返回所有允许的方法,以便客户端将其缓存.
* Access-Control-Allow-Headers(当预请求中包含Access-Control-Request-Headers时必须包含) --- 这是对预请求当中Access-Control-Requests-Headers的回复,和上面一样是以逗号分隔的列表,可以返回所有支持的头部.这里在实际使用中有遇到,所有支持的头部一时可能不能完全写出来,而不想在这一层做过多的判断,没有关系,实际上通过request的header可以直接把取到Access-Control-Request-Headers,直接把对应的value设置到Access-Control-Request-Headers即可
* Access-Control-Allow-Credentials(可选) --- 和简单请求当中的一样
* Access-Control-Max-Age(可选) --- 以秒为单位的缓存时间,预请求发出并非没有消耗, 允许时应当尽可能缓存

一旦预回应如期而至,所请求的权限也就满足,则实际请求开始发送

兼容版本IE11以后,所以移动端网站可以放心使用