---
title: angularjs-ui路由权限篇
date: 2016-06-03 11:15:20
tags:
    - 前端
    - 框架
    - angularjs
categories: 技术文档
description: 前端框架angularjs-ui路由权限的三种方法 
---

## 事件捕获

用户是否可以进入哪个页面,最好在页面加载还未渲染跳转页面时进行判断,
第一种解决办法:在全局简历MainController

```
$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
    if(toState.name=='login')return;// 如果是进入登录界面则允许
    // 如果用户不存在
    if(!$rootScope.user || !$rootScope.user.token){
        event.preventDefault();// 取消默认跳转行为
        $state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
    }
});
```

## 路由跳转配置

在config中配置$stateProvider.state()中的reslove中如果接收的是一个promise对象若抛出的是deferred.reject()页面是不跳转的.

```
$stateProvider.state('default',{
    url:'',
    resolve:{
        guarder:function($q,$http){
            var allowed = false;
            var deferred = $q.defer();
            if(allowed){
                deferred.resolve();
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }
    },
    templateUrl:'controllers/home/index.html',
    controller:'HomeIndexController as vm'
});
```

## Controller中$location判断

在controller中手动判断用户登陆状态,一般将用户数据存储在rootscope中,保持html模板和controller都能调用到且相互独立,当然也能放到自己定义的service中.

## 总结:

三种方式各有优缺点,需要更具具体需求,判断要用哪个.