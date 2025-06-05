---
title: mermaid笔记
tags:
    - markdown
    - vscode
categories:
    - 技术文档
    - 工具
    - markdown
date: 2020-07-30 23:52:11
---

# 安装

## 安装 VSCode

安装插件

![](./mermaid笔记/2020-07-30-23-56-15.png)



## Hexo支持mermaid

1. `yarn add hexo-filter-mermaid-diagrams`

2. 在主题中的`_config.yml`中添加

```yml
mermaid:
    enable: true # Available themes: default | dark | forest | neutral
    theme: forest
    cdn: //cdn.jsdelivr.net/npm/mermaid@8/dist/mermaid.min.js
```
3. 在主题找到资源加载文件`layout/_partial/head.ejs`添加代码

```html
<% if (theme.mermaid.enable) { %>
<script src="<%= theme.mermaid.cdn %>"></script>
<script>
    if (window.mermaid) {
        mermaid.initialize({ theme: '<%= theme.mermaid.theme %>' })
    }
</script>
<% } %>
```



## 类图


```mermaid
classDiagram
    class 动物{
        特点1：能动
        特点2：能叫
    }
    class 狗{
        特点1：4条腿
        特点2：会汪汪叫
        特点3：可爱至极
        汪汪叫(陌生人)
    }
    动物 <|-- 狗
```

参考资料：

http://lightzhan.xyz/index.php/2020/05/10/markdown-mermaid-tutorial-2/

http://lightzhan.xyz/index.php/2020/04/06/markdown-mermaid-tutorial/



