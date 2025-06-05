---
title: angularjs绑定html标签
date: 2016-06-03 11:26:00
tags: [前端,框架,angularjs]
categories: 技术文档
description: 前端框架angularjs绑定不安全html
---

## 方法一使用ngSanitize

angular.module('app').filter('unsafe', function($sce) { return $sce.trustAsHtml; });
在angular 1.2 之前是直接通过 ng-bind-html-unsafe="contenxt",之后angular 官方去掉了这样直接的绑定方法
直接通过$sce的$sce.trustAsHtml 取代,
但是我们也可以通过使用指令的方式达到相同的目的

## 方法二自定指令
不用ngSanitize

module.directive('html', function() {
    function link(scope, element, attrs) {

        var update = function() {
            element.html(scope.html);
        }

        attrs.$observe('html', function(value) {
            update();
        });
    }

    return {
        link: link,
        scope:  {
            html:   '='
        }
    };
});
How to use:
<div html="angular.variable"></div>
