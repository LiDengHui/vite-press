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

Mermaid 是一个用于生成图表和流程图的标记语言，基于 JavaScript，可以通过简单的文本描述来创建各种可视化图表。以下是 Mermaid 常用的语法示例：

---

### 1. **流程图 (Flowchart)**
```mermaid
graph TD;
    A[开始] --> B{条件};
    B -- 是 --> C[执行操作1];
    B -- 否 --> D[执行操作2];
    C --> E[结束];
    D --> E;
```
**语法说明：**
- `graph TD`：定义垂直方向（Top-Down）的流程图。
- `A[开始]`：节点用方括号 `[]` 表示。
- `-->`：箭头表示流程方向。
- `B{条件}`：菱形表示判断条件。

---

### 2. **序列图 (Sequence Diagram)**
```mermaid
sequenceDiagram
    
    Alice->>Bob: 你好！
    Bob-->>Alice: 你好，Alice！
    Bob->>John: 你好吗？
    John-->>Bob: 很好！
```
**语法说明：**
- `->>`：实线箭头（有箭头）。
- `-->>`：虚线箭头（有箭头）。

---

### 3. **甘特图 (Gantt Chart)**
```mermaid
gantt
    title 项目计划
    dateFormat  YYYY-MM-DD
    section 开发
    需求分析   :a1, 2023-10-01, 7d
    设计       :a2, after a1, 5d
    编码       :a3, after a2, 14d
```
**语法说明：**
- `dateFormat`：定义日期格式。
- `section`：分组任务。
- `after`：表示任务依赖关系。

---

### 4. **类图 (Class Diagram)**
```mermaid
classDiagram
    class Animal {
        +String name
        +void eat()
    }
    class Dog {
        +void bark()
    }
    Animal <|-- Dog
```
**语法说明：**
- `+`：表示公共属性/方法。
- `<|--`：表示继承关系。

---

### 5. **饼图 (Pie Chart)**
```mermaid
pie
    title 浏览器市场份额
    "Chrome" : 60
    "Safari" : 20
    "Firefox" : 10
    "其他" : 10
```

---

### 6. **状态图 (State Diagram)**
```mermaid
stateDiagram
    direction LR
    [*] --> Idle
    Idle --> Processing : 开始任务
    Processing --> Idle : 任务完成
```

---

### 7. **实体关系图 (ER Diagram)**
```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
```

---

### 注意事项：
1. Mermaid 代码需要放在 Markdown 的代码块中，并标注语言为 `mermaid`。
2. 部分工具（如 GitHub、VS Code 的 Markdown 预览）需要插件支持。
3. 方向定义：
    - `TB` / `TD`：从上到下（Top-Bottom/Top-Down）
    - `BT`：从下到上
    - `LR`：从左到右
    - `RL`：从右到左

可以参考 [Mermaid 官方文档](https://mermaid.js.org/)。
参考资料：

http://lightzhan.xyz/index.php/2020/05/10/markdown-mermaid-tutorial-2/

http://lightzhan.xyz/index.php/2020/04/06/markdown-mermaid-tutorial/



