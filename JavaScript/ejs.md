---
title: EJS
date: 2016-04-16 19:39:52
tags: 前端
categories: 技术文档
description: EJS 前端模版语言学习笔记
---
之前一直没有用过EJS，一直用的jade，但是越用jade，越觉得好像被框在了圈圈里，倒不是jade的语法问题，相反我觉得jade从语法角度而言是最好的一门模版语言，对比ejs没有额外的添加代码，甚至是比html更好，但是jade由于他的简洁也造成了一个问题，如果没有html2jade 的转义很难和html相结合，特别是大多数人使用的前端模版，都是建立在html上的，所以如果不是项目开始就用jade的话就特别别扭，但是EJS却没有这类的问题，当然也付出了相应的代价在代码中看到让人眼睛发晕的`<%  %>`标签，特别让人不舒服，这也是在刚开始学习使用模版的时候没有选择EJS的原因
## example

### jade    
        !!!
        html
            head
                title #{title}
                meta(charset="UTF-8")
            body
                div.description #{description}
                ul
                    - each data in datas
                        li.item(id='item_'+data.index)
                            span= data.time
                            a.art(href=data.url)= data.title

### ejs
        <!doctype html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title><%=title%> - Page Test</title>
        </head>
        <body>
            <div class="description"><%=description%></div>
            <ul>
        <% function data(data) { %>
                <li class="item" id="item_<%=data.index%>"><span><%=data.time%></span><a href="<%=data.url%>" class="art"><%=data.title%></a></li>
        <% } %>
        <% datas.map(data) %>
            </ul>
        </body>
        </html>
## 语法

### 标签

1. `<% ... %>` 用来包含要执行的JS代码，凡是不需要输出文本的地方都用它
2. `<%= ... %>` 用于输出文本，被包含的值解析后转换成文本
3. `<%- ... %>` EJS内部语法，不进行转义，如内部模版嵌套
4. `<%% ... %>` 输出<%
5. `<%#` 内部注释
6. `－%>` 换行符 
如果不喜欢`<% ...%>` 也可以换成其他的

```js
  var ejs = require('ejs');
    ejs.open = '{{';
    ejs.close = '}}';
```
      

### 语法
1. EJS 直接使用js内嵌，用编程的方式写html,如：

```html
<% if (user) { %>
    <h2><%= user.name %></h2>
<% } %>

```
        

2. 其主要有两种用法，一个是直接返回一个Function函数，参数为填充的数值对象，另一种是直接返回String类型的html，如：

```html
 var template = ejs.compile(str, options);
        template(data);
        // => Rendered HTML string

        ejs.render(str, data, options);
        // => Rendered HTML string
```

3. 其中options的一些参数为： 
    1. cache：是否缓存解析后的模版，需要filename作为key； 
    2. filename：模版文件名； 
    3. scope：complile后的Function执行所在的上下文环境； 
    4. debug：标识是否是debeg状态，debug为true则会输出生成的Function内容； 
    5. compileDebug：标识是否是编译debug，为true则会生成解析过程中的跟踪信息，用于调试； 
    6. client，标识是否用于浏览器客户端运行，为true则返回解析后的可以单独运行的Function函数； 
    7. open，代码开头标记，默认为'<%'； 
    8. close，代码结束标记，默认为'%>'； 
    9. 其他的一些用于解析模版时提供的变量。 
    在express中使用时，options参数将由response.render进行传入，其中包含了一些express中的设置，以及用户提供的变量值。 
4. 此外ejs还提供了一些辅助函数，用于代替使用javascript代码，使得更加方便的操纵数据。 
    1. first，返回数组的第一个元素； 
    2. last，返回数组的最后一个元素； 
    3. capitalize，返回首字母大写的字符串； 
    4. downcase，返回字符串的小写； 
    5. upcase，返回字符串的大写； 
    6. sort，排序（Object.create(obj).sort()？）； 
    7. sort_by:'prop'，按照指定的prop属性进行升序排序； 
    8. size，返回长度，即length属性，不一定非是数组才行； 
    9. plus:n，加上n，将转化为Number进行运算； 
    10. minus:n，减去n，将转化为Number进行运算； 
    11. times:n，乘以n，将转化为Number进行运算； 
    12. divided_by:n，除以n，将转化为Number进行运算； 
    13. join:'val'，将数组用'val'最为分隔符，进行合并成一个字符串； 
    14. truncate:n，截取前n个字符，超过长度时，将返回一个副本 
    15. truncate_words:n，取得字符串中的前n个word，word以空格进行分割； 
    16. replace:pattern,substitution，字符串替换，substitution不提供将删除匹配的子串； 
    17. prepend:val，如果操作数为数组，则进行合并；为字符串则添加val在前面； 
    18. append:val，如果操作数为数组，则进行合并；为字符串则添加val在后面； 
    19. map:'prop'，返回对象数组中属性为prop的值组成的数组； 
    20. reverse，翻转数组或字符串； 
    21. get:'prop'，取得属性为'prop'的值； 
    22. json，转化为json格式字符串 
5. EJS 模版嵌套`<%- include ... %>
```html
<ul>
  <% users.forEach(function(user){ %>
    <% include user/show %>
  <% }) %>
</ul>
```

## 总结: 
EJS和jade之间其实没必要太过关注，他们都是模版语言，只要你喜欢只要合适，更具具体的项目选择合适的模版就行。
