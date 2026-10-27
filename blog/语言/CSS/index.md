---
title: CSS 学习导航
date: 2025-04-29
tags:
  - CSS
  - 前端
  - 学习路径
  - 归档
  - 标签导航
categories:
  - 技术文档
  - 前端
  - CSS
---

# CSS 学习导航

[[toc]]

## 目录说明

本目录已按主题归档，并统一补充标签，便于按学习路线、能力维度和具体特性快速查找。

## 分类总览

| 分类 | 数量 | 说明 |
| --- | ---: | --- |
| 基础入门 | 35 | 选择器、层叠、继承、盒模型、基础属性与常见规范。 |
| 布局系统 | 16 | 定位、Flex、Grid、BFC、响应式、多列与结构化布局。 |
| 视觉表现 | 27 | 颜色、排版、背景、边框、滤镜、渐变、遮罩与图形表现。 |
| 交互与动画 | 11 | 过渡、动画、变换、滚动体验与交互反馈。 |
| 工程化 | 5 | 预处理器、架构方法、工具类、打印样式与工程实践。 |
| 现代特性 | 21 | 容器查询、层叠层、作用域、锚点定位、视图过渡等新特性。 |
| 效果实战 | 10 | 按钮、卡片、导航、加载、评价等可直接复用的 UI 效果。 |
| SVG专题 | 2 | SVG 语法、滤镜与 CSS/SVG 联动技巧。 |

## 学习路径建议

1. **基础入门**：先理解选择器、层叠、盒模型、继承与基础属性。
2. **布局系统**：再学习定位、Flex、Grid、BFC 与响应式布局。
3. **视觉表现**：补强排版、颜色、背景、边框、滤镜与遮罩。
4. **交互与动画**：掌握过渡、动画、滚动体验与交互反馈。
5. **工程化 / 现代特性**：最后进入预处理器、架构、容器查询、层叠层与视图过渡。

## 专题学习链路（基础 / 进阶 / 实战）

> 下列主题存在内容相近或学习阶段不同的多篇文章，这里按“基础 → 进阶 → 实战”重新串联，避免重复跳读。

### 核心基础专题

| 主题 | 基础 | 进阶 | 实战 / 延伸 |
| --- | --- | --- | --- |
| 选择器 | [CSS 基础选择器](./Base/CSS基础选择器.md) | [CSS 选择器详解](./Base/CSS%20选择器详解.md)、[CSS 选择器深入](./Base/CSS%20选择器深入.md) | [CSS :has() 选择器详解](./Base/CSS%20has()%E9%80%89%E6%8B%A9%E5%99%A8%E8%AF%A6%E8%A7%A3.md) |
| 盒模型 | [CSS盒模型](./Base/CSS盒模型.md) | [CSS 盒模型详解](./Base/CSS%20盒模型详解.md)、[CSS 盒模型深入](./Base/CSS%20盒模型深入.md) | 结合 [CSS contain 布局隔离](./Base/CSS%20contain%20布局隔离.md) 理解布局边界 |
| 定位 | [CSS定位](./Base/CSS定位.md) | [CSS 定位详解](./Base/CSS%20定位详解.md)、[CSS 定位深入](./Base/CSS%20定位深入.md) | [CSS 锚点定位与浮层布局实战](./Base/CSS%20锚点定位与浮层布局实战.md) |
| 过渡与动画 | [CSS 过渡与动画基础](./Base/CSS%20过渡与动画基础.md) | [CSS过渡与动画](./Base/CSS过渡与动画.md)、[CSS 过渡与动画对比](./Base/CSS%20过渡与动画对比.md) | [CSS 视图过渡 View Transitions](./Base/CSS%20视图过渡%20View%20Transitions.md) |
| 变换 | [CSS 变换基础](./Base/CSS%20变换基础.md) | [CSS元素变换](./Base/CSS元素变换.md)、[CSS 变换进阶](./Base/CSS%20变换进阶.md) | [CSS 3D 变换](./Base/CSS%203D%20变换.md) |
| 媒体查询与响应式 | [响应式与媒体查询](./Base/响应式与媒体查询.md) | [CSS 媒体查询详解](./Base/CSS%20媒体查询详解.md)、[CSS 媒体查询深入](./Base/CSS%20媒体查询深入.md) | [CSS 响应式设计模式](./Base/CSS%20响应式设计模式.md) |
| 自定义属性 | [CSS 变量与自定义属性基础](./Base/CSS%20变量与自定义属性基础.md)、[CSS自定义属性](./Base/CSS自定义属性.md) | [CSS 自定义属性与主题系统](./Base/CSS%20自定义属性与主题系统.md) | [CSS @property 自定义属性进阶](./Base/CSS%20@property%20自定义属性进阶.md) |
| 文本排版 | [CSS 文本排版](./Base/CSS%20文本排版.md) | [CSS 文本排版详解](./Base/CSS%20文本排版详解.md)、[CSS 字体加载与排版](./Base/CSS%20字体加载与排版.md) | [CSS 字体图标与图标系统](./Base/CSS%20字体图标与图标系统.md) |

### 现代特性专题

| 主题 | 基础 | 进阶 | 实战 / 延伸 |
| --- | --- | --- | --- |
| 容器查询 | [CSS 容器查询深入](./Base/CSS%20容器查询深入.md) | [CSS 容器样式查询 @container style](./Base/CSS%20容器样式查询%20style%20queries.md) | [CSS 容器查询实战](./Base/CSS%20容器查询实战.md) |
| 级联层 | [CSS 级联层 Cascade Layers](./Base/CSS%20级联层%20Cascade%20Layers.md) | [CSS 隔离与层叠层](./Base/CSS%20隔离与层叠层.md) | 与 [CSS 作用域 @scope](./Base/CSS%20作用域%20@scope.md) 组合 |
| 作用域 | [CSS 作用域 @scope](./Base/CSS%20作用域%20@scope.md) | [CSS @scope 与作用域](./Base/CSS%20@scope%20与作用域.md) | 与 [CSS 隔离与层叠层](./Base/CSS%20隔离与层叠层.md) 结合使用 |
| 安全区 | [CSS 安全区适配](./Base/CSS%20安全区适配.md) | [CSS 安全区适配进阶](./Base/CSS%20安全区适配进阶.md)、[CSS 安全区域与环境变量](./Base/CSS%20安全区域与环境变量.md) | 移动端异形屏适配场景 |
| 子网格 | [CSS 子网格 subgrid](./Base/CSS%20子网格%20subgrid.md) | [CSS 子网格深入](./Base/CSS%20子网格深入.md) | 与 [CSS Grid 布局详解](./Base/CSS%20Grid%20布局详解.md) 联动 |
| 锚点定位 | [CSS 锚点定位 Anchor Positioning](./Base/CSS%20锚点定位%20anchor%20positioning.md) | 理解与传统定位差异 | [CSS 锚点定位与浮层布局实战](./Base/CSS%20锚点定位与浮层布局实战.md) |
| 滚动驱动动画 | [CSS 滚动驱动动画 scroll-driven animations](./Base/CSS%20滚动驱动动画.md) | [CSS 滚动驱动动画深入](./Base/CSS%20滚动驱动动画深入.md) | 与 [CSS scroll-state 与 sticky 联动](./Base/CSS%20scroll-state%20与%20sticky%20联动.md) 组合 |

### 视觉与工程专题

| 主题 | 基础 | 进阶 | 实战 / 延伸 |
| --- | --- | --- | --- |
| 背景 | [CSS 背景深入](./Base/CSS%20背景深入.md) | [CSS 背景高级技巧](./Base/CSS%20背景高级技巧.md) | 搭配 [CSS 渐变高级技巧](./Base/CSS%20渐变高级技巧.md) |
| 列表样式 | [CSS 列表样式深入](./Base/CSS%20列表样式深入.md) | [CSS 列表样式进阶](./Base/CSS%20列表样式进阶.md) | 与 [CSS 计数器进阶](./Base/CSS%20计数器进阶.md) 搭配 |
| 表单样式 | [CSS 表单样式](./Base/CSS%20表单样式.md) | [CSS 表单样式与验证](./Base/CSS%20表单样式与验证.md)、[CSS 表单样式进阶](./Base/CSS%20表单样式进阶.md) | [CSS field-sizing 与表单自适应尺寸](./Base/CSS%20field-sizing%20与表单自适应尺寸.md) |
| 打印样式 | [CSS 打印样式](./Base/CSS%20打印样式.md) | [CSS 打印样式进阶](./Base/CSS%20打印样式进阶.md) | 与 [CSS 最佳实践](./Base/CSS%20最佳实践.md) 结合形成交付规范 |
| 性能优化 | [CSS性能优化](./Base/CSS性能优化.md) | [CSS will-change 性能优化](./Base/CSS%20will-change%20性能优化.md) | [CSS 性能优化实战](./Base/CSS%20性能优化实战.md) |
| 滚动条样式 | [CSS 滚动条样式](./Base/CSS%20滚动条样式.md) | [CSS 滚动条样式与自定义](./Base/CSS%20滚动条样式与自定义.md) | [CSS scrollbar-gutter 与滚动条布局稳定性](./Base/CSS%20scrollbar-gutter%20与滚动条布局稳定性.md) |

## 分类归档

### 基础入门

> 选择器、层叠、继承、盒模型、基础属性与常见规范。重复主题已收敛为主入口，进阶内容请看上方“专题学习链路”。

| 文章 | 标签 |
| --- | --- |
| [CSS Nesting 嵌套语法](./Base/CSS%20Nesting%20嵌套语法.md) | CSS / Nesting / 嵌套 |
| [CSS 书写模式 writing-mode](./Base/CSS%20书写模式%20writing-mode.md) | CSS / writing-mode |
| [CSS 伪元素与伪类详解](./Base/CSS%20伪元素与伪类详解.md) | CSS / 伪类 / 伪元素 |
| [CSS 变量与自定义属性基础](./Base/CSS%20变量与自定义属性基础.md) | CSS / 自定义属性 |
| [CSS 可访问性](./Base/CSS%20可访问性.md) | CSS / 可访问性 |
| [CSS 基础选择器](./Base/CSS基础选择器.md) | CSS / 选择器 |
| [CSS 奇淫技巧集锦](./Base/CSS奇淫技巧集锦.md) | CSS |
| [CSS 安全区适配](./Base/CSS%20安全区适配.md) | CSS / 安全区 / 移动端 |
| [CSS 层叠与堆叠上下文](./Base/层叠系统.md) | CSS |
| [CSS 常见错误与避坑指南](./Base/CSS%20常见错误与避坑指南.md) | CSS |
| [CSS 性能优化](./Base/CSS性能优化.md) | CSS / 性能 |
| [CSS 效果合集](./Base/CSS%20效果合集.md) | CSS |
| [CSS 溢出与可见性](./Base/CSS%20溢出与可见性.md) | CSS |
| [CSS 现代新特性](./Base/CSS现代新特性.md) | CSS |
| [CSS 现代特性速查](./Base/CSS%20现代特性速查.md) | CSS |
| [CSS 盒模型](./Base/CSS盒模型.md) | CSS / 盒模型 |
| [CSS 级联层 Cascade Layers](./Base/CSS%20级联层%20Cascade%20Layers.md) | CSS / @layer / 级联层 / 层叠层 |
| [CSS 网格深入](./Base/CSS%20网格深入.md) | CSS |
| [CSS 表格样式](./Base/CSS%20表格样式.md) | CSS |
| [CSS 调试技巧](./Base/CSS%20调试技巧.md) | CSS |
| [CSS 逻辑属性 logical properties](./Base/CSS%20逻辑属性%20logical%20properties.md) | CSS / 逻辑属性 |
| [CSS 隔离 isolation](./Base/CSS%20隔离%20isolation.md) | CSS |
| [CSS 隔离与层叠层](./Base/CSS%20隔离与层叠层.md) | CSS / 层叠层 |
| [CSS 面试题精选](./Base/CSS%20面试题精选.md) | CSS |
| [CSS可继承属性](./Base/CSS可继承属性.md) | CSS |
| [CSS细线实现方法文档](./Base/CSS实现线条.md) | CSS |
| [JS IN CSS](./JS%20In%20CSS.md) | CSS |
| [JS 操作 CSS 的方式](./Base/JS%20In%20CSS.md) | CSS |
| [LESS 基础语法说明书](./Less基础语法.md) | CSS |
| [css优先级](./Base/css优先级.md) | CSS / 优先级 |
| [unset相关属性](./Base/unset相关属性.md) | CSS |

**延伸阅读：** [CSS :has() 选择器详解](./Base/CSS%20has()%E9%80%89%E6%8B%A9%E5%99%A8%E8%AF%A6%E8%A7%A3.md)、[CSS 选择器详解](./Base/CSS%20选择器详解.md)、[CSS 选择器深入](./Base/CSS%20选择器深入.md)、[CSS 媒体查询详解](./Base/CSS%20媒体查询详解.md)、[CSS 媒体查询深入](./Base/CSS%20媒体查询深入.md)、[CSS 安全区适配进阶](./Base/CSS%20安全区适配进阶.md)、[CSS 盒模型详解](./Base/CSS%20盒模型详解.md)、[CSS 盒模型深入](./Base/CSS%20盒模型深入.md)、[CSS 自定义属性（CSS 变量）](./Base/CSS自定义属性.md)、[CSS 自定义属性与主题系统](./Base/CSS%20自定义属性与主题系统.md)、[CSS 逻辑属性深入](./Base/CSS%20逻辑属性深入.md)

### 布局系统

> 定位、Flex、Grid、BFC、响应式、多列与结构化布局。重复主题已收敛为主入口，进阶内容请看上方“专题学习链路”。

| 文章 | 标签 |
| --- | --- |
| [BFC（块级格式上下文）布局](./Base/BFC布局.md) | CSS / 布局 / BFC |
| [CSS Flexbox 布局详解](./Base/CSS%20Flexbox%20布局详解.md) | CSS / 布局 / Flexbox |
| [CSS Grid 布局详解](./Base/CSS%20Grid%20布局详解.md) | CSS / 布局 / Grid |
| [CSS contain 布局隔离](./Base/CSS%20contain%20布局隔离.md) | CSS / 布局 / contain / 性能 |
| [CSS 响应式图片](./Base/CSS%20响应式图片.md) | CSS / 响应式 |
| [CSS 响应式设计模式](./Base/CSS%20响应式设计模式.md) | CSS / 响应式 |
| [CSS 多列布局](./Base/CSS%20多列布局.md) | CSS / 布局 |
| [CSS 定位](./Base/CSS定位.md) | CSS / 定位 |
| [CSS 层叠上下文深入](./Base/CSS%20层叠上下文深入.md) | CSS / 层叠上下文 |
| [CSS 布局技巧大全](./Base/CSS%20布局技巧大全.md) | CSS / 布局 |
| [CSS 显示属性深入](./Base/CSS%20显示属性深入.md) | CSS |
| [CSS 浮动与清除浮动](./Base/CSS%20浮动与清除浮动.md) | CSS / 浮动 |
| [CSS 现代布局模式](./Base/CSS%20现代布局模式.md) | CSS / 布局 |
| [瀑布流实现的思路和做法](./Base/CSS瀑布流.md) | CSS / 瀑布流 / 布局 |

**延伸阅读：** [Flex 布局](./Base/Flex%20布局.md)、[Grid 布局](./Base/Grid布局.md)、[响应式与媒体查询](./Base/响应式与媒体查询.md)、[CSS 定位详解](./Base/CSS%20定位详解.md)、[CSS 定位深入](./Base/CSS%20定位深入.md)、[CSS 浮动深入](./Base/CSS%20浮动深入.md)

### 视觉表现

> 颜色、排版、背景、边框、滤镜、渐变、遮罩与图形表现。重复主题已收敛为主入口，进阶内容请看上方“专题学习链路”。

| 文章 | 标签 |
| --- | --- |
| [CSS SVG 与 CSS 联动](./Base/CSS%20SVG%20与%20CSS%20联动.md) | CSS / SVG |
| [CSS aspect-ratio 纵横比](./Base/CSS%20aspect-ratio%20纵横比.md) | CSS / 纵横比 |
| [CSS clip-path 高级技巧](./Base/CSS%20clip-path%20高级技巧.md) | CSS / clip-path / 视觉效果 |
| [CSS 函数详解](./Base/CSS%20函数详解.md) | CSS / 函数 |
| [CSS 列表样式深入](./Base/CSS%20列表样式深入.md) | CSS / 列表 |
| [CSS 字体加载与排版](./Base/CSS%20字体加载与排版.md) | CSS / 字体 / 排版 |
| [CSS 字体图标与图标系统](./Base/CSS%20字体图标与图标系统.md) | CSS / 字体 / 排版 |
| [CSS 字体深入](./Base/CSS%20字体深入.md) | CSS / 字体 / 排版 |
| [CSS 形状 shape-outside 与文字环绕](./Base/CSS%20形状%20shape-outside%20与文字环绕.md) | CSS / shape-outside / 视觉效果 / 形状 |
| [CSS 数学函数详解](./Base/CSS%20数学函数详解.md) | CSS / 函数 |
| [CSS 文本排版](./Base/CSS%20文本排版.md) | CSS / 排版 / 文本 |
| [CSS 混合模式与滤镜](./Base/CSS%20混合模式与滤镜.md) | CSS / 滤镜 / 混合模式 |
| [CSS 混合模式与遮罩](./Base/CSS%20混合模式与遮罩.md) | CSS / 混合模式 / 遮罩 |
| [CSS 渐变高级技巧](./Base/CSS%20渐变高级技巧.md) | CSS / 渐变 |
| [CSS 滤镜](./Base/css%20滤镜.md) | CSS / 滤镜 |
| [CSS 玻璃拟态与新拟态](./Base/CSS%20玻璃拟态与新拟态.md) | CSS |
| [CSS 背景深入](./Base/CSS%20背景深入.md) | CSS / 背景 |
| [CSS 表单样式](./Base/CSS%20表单样式.md) | CSS / 表单 |
| [CSS 裁剪路径与形状](./Base/CSS%20裁剪路径与形状.md) | CSS / 裁剪 / 形状 |
| [CSS 计数器与形状](./Base/CSS%20计数器与形状.md) | CSS / 形状 / 计数器 |
| [CSS 计数器与生成内容深入](./Base/CSS%20计数器与生成内容深入.md) | CSS / 计数器 |
| [CSS 边框深入](./Base/CSS%20边框深入.md) | CSS / 边框 |
| [CSS 遮罩与裁剪详解](./Base/CSS%20遮罩与裁剪详解.md) | CSS / 遮罩 / 裁剪 |
| [CSS 阴影与光效](./Base/CSS%20阴影与光效.md) | CSS / 阴影 |
| [CSS 颜色新纪元：oklch、color-mix 与相对颜色](./Base/CSS颜色新纪元.md) | CSS / 颜色 |

**延伸阅读：** [CSS 函数速查](./Base/CSS%20函数速查.md)、[CSS 列表样式进阶](./Base/CSS%20列表样式进阶.md)、[CSS 文本排版详解](./Base/CSS%20文本排版详解.md)、[CSS 背景高级技巧](./Base/CSS%20背景高级技巧.md)、[CSS 表单样式与验证](./Base/CSS%20表单样式与验证.md)、[CSS 表单样式进阶](./Base/CSS%20表单样式进阶.md)、[CSS 计数器进阶](./Base/CSS%20计数器进阶.md)

### 交互与动画

> 过渡、动画、变换、滚动体验与交互反馈。重复主题已收敛为主入口，进阶内容请看上方“专题学习链路”。

| 文章 | 标签 |
| --- | --- |
| [CSS 3D 变换](./Base/CSS%203D%20变换.md) | CSS / 变换 / 3D |
| [CSS Scroll Snap 滚动吸附深入](./Base/CSS%20Scroll%20Snap%20滚动吸附深入.md) | CSS / 滚动 / Scroll Snap |
| [CSS pointer-events 与点击穿透控制](./Base/CSS%20pointer-events%20与点击穿透控制.md) | CSS / 交互 |
| [CSS user-select 与交互文本控制](./Base/CSS%20user-select%20与交互文本控制.md) | CSS / 文本 / 交互 |
| [CSS 变换基础](./Base/CSS%20变换基础.md) | CSS / 变换 |
| [CSS 故障艺术效果](./Base/CSS%20故障艺术效果.md) | CSS |
| [CSS 滚动与吸附](./Base/CSS%20滚动与吸附.md) | CSS / 滚动 |
| [CSS 滚动条样式](./Base/CSS%20滚动条样式.md) | CSS / 滚动条 / 滚动 |
| [CSS 过渡与动画基础](./Base/CSS%20过渡与动画基础.md) | CSS / 过渡 / 动画 |
| [CSS 鼠标与交互样式](./Base/CSS%20鼠标与交互样式.md) | CSS / 交互 |

**延伸阅读：** [CSS 变换进阶](./Base/CSS%20变换进阶.md)、[CSS3 元素变换详解](./Base/CSS元素变换.md)、[CSS 滚动条样式与自定义](./Base/CSS%20滚动条样式与自定义.md)、[CSS过渡与动画](./Base/CSS过渡与动画.md)、[CSS 过渡与动画对比](./Base/CSS%20过渡与动画对比.md)

### 工程化

> 预处理器、架构方法、工具类、打印样式与工程实践。重复主题已收敛为主入口，进阶内容请看上方“专题学习链路”。

| 文章 | 标签 |
| --- | --- |
| [CSS 工具类系统](./Base/CSS%20工具类系统.md) | CSS / 工程化 |
| [CSS 打印样式](./Base/CSS%20打印样式.md) | CSS / 打印 |
| [CSS 最佳实践](./Base/CSS%20最佳实践.md) | CSS |
| [CSS 架构方法论](./Base/CSS%20架构方法论.md) | CSS / 工程化 / 架构 |
| [Sass 基础语法使用说明书](./SCSS基础语法.md) | CSS / SCSS / Sass / 预处理器 |

**延伸阅读：** [CSS 打印样式进阶](./Base/CSS%20打印样式进阶.md)

### 现代特性

> 容器查询、层叠层、作用域、锚点定位、视图过渡等新特性。重复主题已收敛为主入口，进阶内容请看上方“专题学习链路”。

| 文章 | 标签 |
| --- | --- |
| [CSS @property 自定义属性进阶](./Base/CSS%20@property%20自定义属性进阶.md) | CSS / 自定义属性 / @property / 现代特性 |
| [CSS @scope 与作用域](./Base/CSS%20@scope%20与作用域.md) | CSS / @scope / 作用域 / 现代特性 |
| [CSS @starting-style 过渡初始样式](./Base/CSS%20@starting-style%20过渡初始样式.md) | CSS / 过渡 / 动画 / 现代特性 |
| [CSS @supports 特性查询](./Base/CSS%20@supports%20特性查询.md) | CSS / @supports / 特性查询 / 现代特性 |
| [CSS Houdini 魔法](./Base/CSS%20Houdini%20魔法.md) | CSS / Houdini / 现代特性 |
| [CSS accent-color 与原生控件主题化](./Base/CSS%20accent-color%20与原生控件主题化.md) | CSS / accent-color / 主题化 / 现代特性 |
| [CSS field-sizing 与表单自适应尺寸](./Base/CSS%20field-sizing%20与表单自适应尺寸.md) | CSS / 表单 / field-sizing / 现代特性 |
| [CSS interpolate-size 与 auto 尺寸过渡](./Base/CSS%20interpolate-size%20与%20auto%20尺寸过渡.md) | CSS / 过渡 / 动画 / interpolate-size / 现代特性 |
| [CSS margin-trim 与容器边距裁切](./Base/CSS%20margin-trim%20与容器边距裁切.md) | CSS / margin-trim / 现代特性 |
| [CSS scroll-state 与 sticky 联动](./Base/CSS%20scroll-state%20与%20sticky%20联动.md) | CSS / sticky / 滚动状态 / 现代特性 |
| [CSS text-wrap 与智能换行策略](./Base/CSS%20text-wrap%20与智能换行策略.md) | CSS / text-wrap / 现代特性 |
| [CSS 作用域 @scope](./Base/CSS%20作用域%20@scope.md) | CSS / @scope / 作用域 / 现代特性 |
| [CSS 子网格 subgrid](./Base/CSS%20子网格%20subgrid.md) | CSS / subgrid / 现代特性 |
| [CSS 安全区域与环境变量](./Base/CSS%20安全区域与环境变量.md) | CSS / 安全区 / 移动端 / 自定义属性 / 现代特性 |
| [CSS 容器查询深入](./Base/CSS%20容器查询深入.md) | CSS / 容器查询 / 响应式 / 现代特性 |
| [CSS 容器样式查询 @container style](./Base/CSS%20容器样式查询%20style%20queries.md) | CSS / contain / 性能 / 现代特性 |
| [CSS 弹出框与对话框 Popover and Dialog](./Base/CSS%20弹出框与对话框%20Popover%20and%20Dialog.md) | CSS / 弹出框 / 对话框 / 现代特性 |
| [CSS 滚动驱动动画 scroll-driven animations](./Base/CSS%20滚动驱动动画.md) | CSS / 动画 / 滚动 / 现代特性 |
| [CSS 视图过渡 View Transitions](./Base/CSS%20视图过渡%20View%20Transitions.md) | CSS / 过渡 / 动画 / View Transitions / 现代特性 |
| [CSS 锚点定位 Anchor Positioning](./Base/CSS%20锚点定位%20anchor%20positioning.md) | CSS / 定位 / 锚点定位 / 现代特性 |
| [CSS 颜色空间与 HDR](./Base/CSS%20颜色空间与%20HDR.md) | CSS / 颜色 / 颜色空间 / HDR / 现代特性 |

**延伸阅读：** [CSS scrollbar-gutter 与滚动条布局稳定性](./Base/CSS%20scrollbar-gutter%20与滚动条布局稳定性.md)、[CSS 子网格深入](./Base/CSS%20子网格深入.md)、[CSS 安全区适配进阶](./Base/CSS%20安全区适配进阶.md)、[CSS 容器查询实战](./Base/CSS%20容器查询实战.md)、[CSS 滚动驱动动画深入](./Base/CSS%20滚动驱动动画深入.md)、[CSS 锚点定位与浮层布局实战](./Base/CSS%20锚点定位与浮层布局实战.md)

### 效果实战

> 按钮、卡片、导航、加载、评价等可直接复用的 UI 效果。

| 文章 | 标签 |
| --- | --- |
| [CSS Hover 效果大全](./效果/CSS%20Hover%20效果大全.md) | CSS / 效果 / 实战 |
| [CSS 加载动画大全](./效果/CSS加载动画大全.md) | CSS / 效果 / 动画 / 实战 |
| [CSS 卡片效果大全](./效果/CSS卡片效果大全.md) | CSS / 效果 / 实战 |
| [CSS 图片效果大全](./效果/CSS图片效果大全.md) | CSS / 效果 / 实战 |
| [CSS 导航菜单效果大全](./效果/CSS导航菜单效果大全.md) | CSS / 效果 / 实战 |
| [CSS 按钮效果大全](./效果/CSS按钮效果大全.md) | CSS / 效果 / 实战 |
| [CSS 文字效果大全](./效果/CSS文字效果大全.md) | CSS / 效果 / 实战 |
| [两球相交](./效果/两球相交.md) | CSS / 效果 / 实战 |
| [文本超出](./效果/文本超出.md) | CSS / 效果 / 文本 / 实战 |
| [星型评价](./效果/星型评价.md) | CSS / 效果 / 实战 |

### SVG专题

> SVG 语法、滤镜与 CSS/SVG 联动技巧。

| 文章 | 标签 |
| --- | --- |
| [SVG基础语法](./SVG/SVG基础语法.md) | CSS / SVG |
| [SVG滤镜完整使用指南 - 17种滤镜原语详解](./SVG/SVG%20滤镜详解.md) | CSS / SVG / 滤镜 |

## 标签使用建议

- 想按能力面查找：优先看 `基础入门 / 布局系统 / 视觉表现 / 交互与动画`。
- 想追新特性：直接看 `现代特性` 分类与对应标签。
- 想找可复用案例：优先看 `效果实战` 与 `SVG专题`。
- 想做体系化整理：结合文章 frontmatter 中的 `categories` 与 `tags` 继续扩展自动索引。

## 奇淫技巧

```bash
# 查找某个标签或关键词对应的 CSS 文章
grep -R "容器查询\|@scope\|Flexbox" blog/语言/CSS --include="*.md" -n

# 统计某个分类下的文章数量
find blog/语言/CSS -name "*.md" | wc -l
```

## 参考资料

- [MDN CSS 参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)
- [Can I Use](https://caniuse.com/)
- [CSS-Tricks](https://css-tricks.com/)
- [W3C CSS 规范](https://www.w3.org/Style/CSS/)
- [Modern CSS Solutions](https://moderncss.dev/)
