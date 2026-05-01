---
title: CSS scroll-state 与 sticky 联动
date: 2025-04-29
tags:
  - CSS
  - sticky
  - 滚动状态
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS scroll-state 与 sticky 联动

[[toc]]

现代 CSS 的一个明显趋势，是把过去只能依赖 JavaScript 的交互状态，一点点收回到样式层来描述。`scroll-state` 就属于这类非常值得关注的新能力：它让我们可以基于**滚动容器中的元素状态**来切换样式，尤其适合和 `position: sticky`、滚动吸附、分段导航、阅读进度提示等场景联动。

很多人第一次看到这个能力时，会把它理解成“又一个容器查询”。这个理解不算错，但更准确地说，它是**针对滚动状态的容器查询扩展能力**。你不再只是根据宽度、高度来切换样式，而是可以根据“当前元素是否吸顶”“是否处于吸附状态”这类滚动语义来决定视觉表现。

本文会系统讲清楚 `scroll-state` 的思路、适用场景、与 `sticky` 的搭配方式、工程落地建议，以及一组可以直接复制到项目中的“奇淫技巧”。

---

## 一、什么是 scroll-state

传统滚动联动效果，一般要依赖 JavaScript：

1. 监听 `scroll`
2. 计算元素位置
3. 判断某个标题是否吸顶、某个卡片是否激活
4. 动态切换 class
5. 再由 CSS 根据 class 渲染视觉效果

这套方案当然可行，但问题很多：

- 滚动监听频繁，容易造成性能压力
- 逻辑与样式耦合
- 边界条件难测，比如嵌套滚动容器、吸顶阈值、横向滚动
- 组件复用成本高

而 `scroll-state` 试图表达的是：

> “让元素在特定滚动状态下，直接触发对应样式。”

也就是说，你可以把“是不是 sticky 了”“是不是处于 scroll snap 状态”这种判断，交给 CSS 状态系统，而不是每次都手搓滚动监听。

---

## 二、它解决了什么问题

`scroll-state` 最适合解决这几类问题：

### 1. sticky 标题吸顶后高亮

比如文档目录、章节标题、看板列头、表格表头。标题一旦吸顶，就切换背景、阴影、字号、边框等样式。

### 2. 分屏卡片滚动激活

横向或纵向滑动时，当前卡片进入吸附状态，就给它加高亮、缩放、阴影或描述区展开效果。

### 3. 阅读进度与章节联动

某一章成为当前吸顶标题时，右侧目录同步高亮，或者顶部进度条切换主题色。

### 4. 纯 CSS 的交互增强

少写很多“只为切一个 class”的 JS，把样式逻辑留在 CSS，自然更利于维护。

---

## 三、核心思路：把元素声明为滚动状态容器

要使用 `scroll-state`，第一步是让某个元素成为**滚动状态查询容器**。

常见写法如下：

```css
.section-title {
  position: sticky;
  top: 0;
  container-type: scroll-state;
  container-name: section-head;
}
```

这段样式表示：

- `.section-title` 是一个 sticky 元素
- 它同时也是一个可以被查询的滚动状态容器
- 名字叫 `section-head`

之后我们就可以通过容器查询，根据它的滚动状态切换别的样式，或者切换它自己的内部样式。

---

## 四、和 sticky 联动的基本示例

### HTML

```html
<article class="doc">
  <section class="doc-section">
    <h2 class="doc-title">一、基础概念</h2>
    <div class="doc-content">
      <p>这里是章节内容……</p>
    </div>
  </section>
</article>
```

### CSS

```css
.doc-title {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);

  container-type: scroll-state;
  container-name: chapter;
}

@container chapter scroll-state(stuck: top) {
  .doc-title {
    background: rgba(17, 24, 39, 0.9);
    color: white;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  }
}
```

### 这段代码表达了什么

当 `.doc-title` 进入“吸顶 stuck at top”状态时：

- 背景从浅色变成深色
- 文字变白
- 增加阴影

这就是一个非常典型的 sticky 联动效果，而且不需要 JS 去判断“现在是不是吸顶了”。

---

## 五、scroll-state 的几个高价值场景

### 1. 章节标题吸顶增强

文档站、知识库、技术博客特别适合。

```css
.article-heading {
  position: sticky;
  top: 0;
  container-type: scroll-state;
  container-name: article-heading;
}

@container article-heading scroll-state(stuck: top) {
  .article-heading {
    border-bottom: 1px solid rgba(148, 163, 184, 0.35);
    background: color-mix(in srgb, white 82%, #3b82f6 18%);
  }
}
```

适合做：

- 当前章节强调
- 顶部毛玻璃
- 吸顶后缩小间距
- 吸顶后补阴影

### 2. 看板列头吸顶

任务看板、表格区域、长列表分组标题也很适合。

```css
.column-title {
  position: sticky;
  top: 0;
  container-type: scroll-state;
  container-name: board-col;
}

@container board-col scroll-state(stuck: top) {
  .column-title {
    outline: 1px solid rgba(59, 130, 246, 0.28);
    background: #eff6ff;
  }
}
```

这样用户一滚动，就能明确知道当前看到的是哪一列或哪一组。

### 3. 横向卡片吸附高亮

如果你结合 `scroll-snap-type` 使用，还可以做横向卡片“居中即激活”的效果。

```css
.carousel-item {
  scroll-snap-align: center;
  container-type: scroll-state;
  container-name: card;
}

@container card scroll-state(snapped: inline) {
  .carousel-card {
    transform: scale(1.02);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.14);
  }
}
```

这种交互很适合：

- 轮播展示
- 产品卡片
- 作品集列表
- 移动端推荐内容流

### 4. 目录同步高亮思路

如果目录项和内容标题结构组织得好，可以把“当前 sticky 标题”对应的激活态也交给样式系统或最少量 JS 管理。CSS 负责强调当前容器状态，JS 只做最薄的一层同步，逻辑会简单很多。

---

## 六、scroll-state 与 scroll-snap 的关系

很多人容易把它和 `scroll-snap` 混淆。

### `scroll-snap` 负责什么

`scroll-snap` 负责**滚动停止时的对齐规则**，例如：

- 卡片一张一张吸附
- 分屏页面逐屏停靠
- 横向画廊自动对准中间元素

### `scroll-state` 负责什么

`scroll-state` 负责**在这些滚动状态下应用样式**，例如：

- 当前吸附的卡片加粗边框
- 当前中心卡片放大
- 当前被吸顶的标题换背景

也就是说：

- `scroll-snap` 更像“布局与滚动行为控制”
- `scroll-state` 更像“状态触发的视觉反馈”

两者结合，体验会非常完整。

---

## 七、和传统 JS 方案对比

### 传统方案

```js
const headers = document.querySelectorAll('.doc-title');
window.addEventListener('scroll', () => {
  headers.forEach((el) => {
    const rect = el.getBoundingClientRect();
    el.classList.toggle('is-stuck', rect.top <= 0);
  });
});
```

### 问题

- 监听频率高
- 代码冗长
- 多滚动容器时更复杂
- 容易与布局强耦合

### CSS 状态方案的优势

- 逻辑更接近样式语义
- 更利于组件封装
- 更少的 class 管理
- 更适合做渐进增强

当然，这不代表 JS 会完全消失。某些复杂交互仍然需要脚本参与，但你可以把大量“状态判断”从 JS 中剥离掉。

---

## 八、渐进增强怎么做

`scroll-state` 属于现代 CSS 能力，兼容性并不是百分百。因此真实项目里，不要把它当作唯一方案，建议按下面的顺序设计：

1. **先写基础可用样式**
2. **现代浏览器再启用 scroll-state 增强**
3. **必要时保留 JS 回退**

### 基础版本

```css
.doc-title {
  position: sticky;
  top: 0;
  padding: 12px 16px;
  background: white;
}
```

### 增强版本

```css
@supports (container-type: scroll-state) {
  .doc-title {
    container-type: scroll-state;
    container-name: chapter;
  }

  @container chapter scroll-state(stuck: top) {
    .doc-title {
      background: #111827;
      color: white;
    }
  }
}
```

这样做的好处是：

- 不支持的浏览器仍能正常吸顶
- 支持的浏览器获得更强视觉反馈
- 工程风险可控

---

## 九、实际项目中的组织建议

### 1. 不要滥用

并不是所有滚动变化都值得上 `scroll-state`。只有当“状态语义明确”时，它才最有价值，比如：

- 吸顶了没
- 吸附了没
- 当前是不是激活卡片

如果只是简单滚动入场动画，可能滚动驱动动画更合适。

### 2. 命名要语义化

建议容器名尽量直白：

```css
container-name: section-heading;
container-name: board-header;
container-name: product-card;
```

以后维护时，一眼就知道这个查询是围绕谁展开的。

### 3. 先设计基础态，再设计状态态

比如 sticky 标题组件应先定义：

- 正常背景
- 正常边框
- 正常内边距

然后再单独补：

- stuck 后的背景
- stuck 后的阴影
- stuck 后的压缩效果

这样层次会更清晰，不容易把样式写乱。

### 4. 在真实滚动容器里测试

不要只在空白页测。必须验证这些场景：

- 页面整体滚动
- 内层滚动面板
- 移动端小屏
- 横向滚动容器
- 吸附与 sticky 同时存在

因为滚动交互类能力，往往只有放进真实业务容器后才会暴露问题。

---

## 十、常见应用模板

### 模板一：文档章节吸顶条

```css
.chapter-title {
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
  container-type: scroll-state;
  container-name: chapter-title;
}

@container chapter-title scroll-state(stuck: top) {
  .chapter-title {
    background: rgba(15, 23, 42, 0.88);
    color: white;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
  }
}
```

### 模板二：表格表头增强

```css
.table-head {
  position: sticky;
  top: 0;
  container-type: scroll-state;
  container-name: table-head;
}

@container table-head scroll-state(stuck: top) {
  .table-head {
    border-bottom: 1px solid #cbd5e1;
    background: #f8fafc;
  }
}
```

### 模板三：横向画廊居中卡片

```css
.gallery {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 80%;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.gallery-item {
  scroll-snap-align: center;
  container-type: scroll-state;
  container-name: gallery-card;
}

.gallery-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

@container gallery-card scroll-state(snapped: inline) {
  .gallery-card {
    transform: scale(1.03);
    box-shadow: 0 18px 30px rgba(0, 0, 0, 0.14);
  }
}
```

---

## 十一、奇淫技巧

### 技巧一：sticky 后自动变成“阅读导航条”

```css
.article-nav-title {
  position: sticky;
  top: 0;
  padding: 12px 16px;
  background: transparent;
  container-type: scroll-state;
  container-name: article-nav;
  transition: background 0.2s ease, color 0.2s ease, padding 0.2s ease;
}

@container article-nav scroll-state(stuck: top) {
  .article-nav-title {
    padding-block: 8px;
    background: rgba(17, 24, 39, 0.88);
    color: white;
  }
}
```

吸顶后自动压缩高度，特别适合长文阅读体验。

### 技巧二：scroll-snap 卡片“居中即放大”

```css
.snap-card-wrap {
  scroll-snap-align: center;
  container-type: scroll-state;
  container-name: snap-card;
}

.snap-card {
  opacity: 0.72;
  transform: scale(0.96);
  transition: 0.25s ease;
}

@container snap-card scroll-state(snapped: inline) {
  .snap-card {
    opacity: 1;
    transform: scale(1);
  }
}
```

以前这类效果经常要配合轮播库和 JS 激活态，现在 CSS 可以更自然地接管。

### 技巧三：吸顶后给标题加“当前章节感”

```css
.section-head {
  position: sticky;
  top: 0;
  container-type: scroll-state;
  container-name: current-section;
}

.section-head .badge {
  opacity: 0;
  transform: translateY(-4px);
  transition: 0.2s ease;
}

@container current-section scroll-state(stuck: top) {
  .section-head .badge {
    opacity: 1;
    transform: translateY(0);
  }
}
```

可以显示“当前章节”“正在阅读”等小标签，体验很高级。

### 技巧四：看板列头 sticky 后给整列建立视觉边界

```css
.kanban-title {
  position: sticky;
  top: 0;
  container-type: scroll-state;
  container-name: kanban-title;
}

.kanban-column {
  border: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

@container kanban-title scroll-state(stuck: top) {
  .kanban-column {
    border-color: rgba(59, 130, 246, 0.2);
    box-shadow: inset 0 1px 0 rgba(59, 130, 246, 0.08);
  }
}
```

这类“整列被激活”的感觉很适合后台系统。

### 技巧五：增强写法放进 `@supports`，老浏览器自动忽略

```css
.sticky-title {
  position: sticky;
  top: 0;
  background: white;
}

@supports (container-type: scroll-state) {
  .sticky-title {
    container-type: scroll-state;
    container-name: sticky-title;
  }

  @container sticky-title scroll-state(stuck: top) {
    .sticky-title {
      background: #0f172a;
      color: white;
    }
  }
}
```

这是最稳妥的工程化姿势：基础可用，增强自然生效。

---

## 十二、常见误区

### 1. 以为它能替代所有滚动交互

不能。`scroll-state` 更适合做**状态样式切换**，不适合替代所有复杂滚动逻辑。比如复杂时间轴计算、滚动视差、多元素协同动画，还是可能要用 JS 或滚动驱动动画。

### 2. 以为 sticky 一定能完美触发

前提是 sticky 本身就要工作正常。如果父容器有错误的 `overflow`、高度不够、布局结构不合理，那么 sticky 效果就可能不符合预期，`scroll-state` 自然也不会按你想的方式生效。

### 3. 忽略嵌套滚动容器

项目里经常不是整个页面滚，而是局部面板滚。你必须在真实滚动上下文里验证，不要只在 body 滚动环境下测试一次就交付。

### 4. 状态态样式写得太重

吸顶高亮不等于把整个 UI 改头换面。建议变化集中在：

- 背景
- 边框
- 阴影
- 间距
- 轻量缩放

这样视觉反馈更高级，也更不容易突兀。

---

## 十三、总结

`scroll-state` 的价值，在于它把“滚动中的状态判断”从大量脚本逻辑里拆出来，交还给 CSS 自己处理。特别是与 `position: sticky`、`scroll-snap` 联动时，它能把很多过去略显笨重的交互，变成更声明式、更轻量、更容易维护的样式方案。

你可以把它简单理解为：

- `sticky` 负责把元素固定在合适位置
- `scroll-snap` 负责让滚动停在明确节点
- `scroll-state` 负责在这些状态成立时切换样式

它特别适合：

- 文档章节标题
- 看板列头
- 表格表头
- 横向画廊卡片
- 阅读态导航
- 分段滚动内容高亮

虽然它依然属于现代 CSS 能力，落地时要考虑浏览器支持与渐进增强，但从架构思路上说，这正是未来样式系统的发展方向：**更多状态描述留在 CSS，行为逻辑尽量变薄**。

如果你正在搭建内容站、后台系统、滚动容器丰富的中后台页面，`scroll-state + sticky` 这一组搭配非常值得你尽早掌握。

---

## 参考资料

- [MDN: CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN: position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [MDN: scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)
- [Chrome Developers: CSS scroll-state queries](https://developer.chrome.com/docs/css-ui/scroll-state-queries)
