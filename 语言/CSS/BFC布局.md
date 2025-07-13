<script setup>
import AutoResizeTwoColumn from './BFC布局/AutoResizeTwoColumn.vue';
</script>  

# BFC（块级格式上下文）布局


好的，我们来详细介绍一下 **BFC（Block Formatting Context，块级格式化上下文）**。

**简单来说：** BFC 是 Web 页面 CSS 渲染中的一块独立的渲染区域。它规定了内部块级元素的布局规则，并且这个区域内的布局不会影响到外部元素，外部元素也不会影响到它内部的布局（除了其自身在文档流中的位置）。

你可以把它想象成一个隔离的盒子，盒子内部有一套自己的布局规则，盒子内外互不干扰（在垂直方向上）。

## 一、BFC 的核心作用/规则

理解 BFC 的关键在于掌握它内部的布局规则和它如何与外部环境隔离：

1.  **内部的 Box 垂直排列：** 在 BFC 中，块级盒子（Block-level Boxes）会从上到下依次垂直排列。
2.  **外边距折叠只发生在同一个 BFC 内：** 这是 BFC 最重要的隔离特性之一。**相邻块级元素**的垂直外边距（`margin-top` 和 `margin-bottom`）会发生折叠（Collapse）。**但是，如果它们属于不同的 BFC，它们的外边距就不会折叠。**
    *   *例子：* 两个相邻的 `<div>`，如果它们都在同一个 BFC（比如根元素 `<html>` 创建的 BFC）里，它们的垂直 `margin` 会重叠。如果其中一个 `<div>` 被包裹在一个新创建的 BFC（比如加了 `overflow: hidden`）中，那么这两个 `<div>` 的 `margin` 就不会重叠。
3.  **BFC 的区域不会与浮动元素重叠：** BFC 会识别并避开浮动元素。
    *   *例子：* 一个浮动元素（`float: left`）后面跟着一个普通流中的块级元素。普通流元素的内容默认可能会环绕在浮动元素周围（部分重叠）。如果给这个普通流元素创建 BFC（比如加 `overflow: auto`），它就会整个移动到浮动元素的右侧，形成真正的两栏布局，而不会重叠。
4.  **计算 BFC 高度时，浮动子元素也参与计算：** 这是解决“高度塌陷”问题的关键。如果一个元素只包含浮动子元素，且该元素自身没有创建 BFC，那么它的高度会计算为 0（塌陷）。如果给这个父元素创建 BFC，它就会“包裹”住内部的浮动子元素，高度恢复正常。
5.  **BFC 内部的元素不会影响外部的元素：** 这是一个概括性的原则，上述的隔离外边距折叠、隔离浮动影响都是这个原则的体现。

## 二、BFC 的常见使用场景

基于 BFC 的规则，它的主要应用场景包括：

1.  **防止外边距折叠：**
    *   **场景：** 两个相邻的块级元素（比如上下两个 `<section>` 或 `<div>`），你不希望它们的外边距合并（比如设计稿要求它们之间的间距是两者 `margin` 之和）。
    *   **解决：** 给其中一个元素包裹一个容器，并让这个容器创建 BFC（例如设置 `overflow: hidden`），或者直接给其中一个元素创建 BFC（如果可行）。这样它们就处于不同的 BFC 中，外边距不再折叠。
2.  **清除浮动 / 解决父元素高度塌陷：**
    *   **场景：** 父元素 (`container`) 内部所有子元素都设置了 `float: left/right`。父元素的高度会塌陷为 0，导致边框、背景等无法正常显示，后续布局错乱。
    *   **解决：** 给父元素 (`container`) 创建 BFC（常用 `overflow: hidden`, `display: flow-root` 或 `display: inline-block`）。父元素计算高度时会包含浮动子元素的高度。
3.  **创建自适应两栏布局 / 避免内容环绕：**
    *   **场景：** 左侧一个固定宽度的浮动元素 (`float: left`)，右侧希望是一个自适应宽度的内容区域，并且这个内容区域应该占据剩余宽度，而不是环绕在浮动元素下方。
    *   **解决：** 给右侧的内容区域创建 BFC（常用 `overflow: hidden`）。根据 BFC 规则，它不会与左侧的浮动元素重叠，会占据父容器剩余的水平空间。
4.  **隔离内容（较少见，但体现隔离性）：**
    *   **场景：** 需要确保某一部分内容的布局完全独立，不受外部浮动或其他布局影响，也不影响外部。
    *   **解决：** 将该部分内容包裹在一个创建了 BFC 的容器中。

## 三、BFC 的触发条件

只要满足以下 CSS 声明之一，元素就会创建一个新的 BFC：

1.  **根元素 (`<html>`):** 整个页面本身就是一个最大的 BFC。
2.  **浮动元素 (`float`):** `float` 的值 **不是** `none`。
3.  **绝对定位元素 (`position`):** `position` 的值是 `absolute` 或 `fixed`。
4.  **行内块元素 (`display`):** `display` 的值是 `inline-block`。
5.  **表格单元格 (`display`):** `display` 的值是 `table-cell` (HTML 表格单元格 `<td>`, `<th>` 默认值)。
6.  **表格标题 (`display`):** `display` 的值是 `table-caption` (HTML 表格标题 `<caption>` 默认值)。
7.  **匿名表格元素 (`display`):** `display` 的值是 `table`, `table-row`, `table-row-group`, `table-header-group`, `table-footer-group`, `inline-table` (这些值创建匿名的表格相关盒子)。
8.  **`overflow` 值不为 `visible` 的块元素:** `overflow` 的值是 `hidden`, `scroll`, `auto`, `clip`。**(这是最常用且副作用相对较小的触发方式之一)**。
9.  **`display: flow-root`:** **这是创建 BFC 的现代、明确且副作用最小的方式。** 它的设计目的就是创建一个新的 BFC，而不会带来像浮动、绝对定位或 `overflow: hidden` 可能引起的其他布局影响（如裁剪内容、脱离文档流等）。
10. **弹性项目 (Flex Items) 和 网格项目 (Grid Items):** 如果它们是 `flex` 或 `grid` 容器的直接子元素，它们会为其内容创建一个新的 BFC。
11. **`contain` 属性值为 `layout`, `content`, 或 `paint` 的元素。**
12. **多列容器 (`column-count` 或 `column-width`):** `column-count` 或 `column-width` 的值 **不是** `auto` (即使设置了 `column-count: 1` 也会创建 BFC)。
13. **`column-span` 值为 `all` 的元素:** 该元素会创建一个新的 BFC，即使它没有包裹在多列容器中。

### 常用触发方式总结

*   **最推荐 (副作用最小):** `display: flow-root`
*   **常用且兼容性好:** `overflow: hidden` (需注意可能裁剪溢出的阴影或内容)、`overflow: auto` (可能会产生不必要的滚动条)
*   **常用但会改变布局模式:** `display: inline-block` (元素变为行内块)、`float` (需要清除浮动)、`position: absolute/fixed` (脱离文档流)
*   **明确用于布局:** Flex 容器 (`display: flex/inline-flex`) 和 Grid 容器 (`display: grid/inline-grid`) **本身** 会为它们的内容创建一个新的格式化上下文（FFC 和 GFC），它们的行为与 BFC 类似（包含浮动、隔离外边距）但规则不同。它们的子项也会为自身内容创建 BFC。

## 总结

BFC 是 CSS 布局中一个核心但相对底层的概念。它通过创建独立的渲染区域，解决了外边距折叠、高度塌陷、浮动环绕等经典布局问题。理解它的规则（隔离性、包含浮动、阻止外边距折叠）以及触发条件（`overflow: hidden`, `display: flow-root`, `float`, `position: absolute/fixed`, `display: inline-block` 等）对于掌握 CSS 布局至关重要。

虽然现代布局技术（Flexbox, Grid）在很多场景下简化了布局并减少了直接操作 BFC 的需求，但 BFC 的原理仍然是理解 CSS 布局机制的基础，并且在处理上述特定问题时依然是非常有效的工具。`display: flow-root` 的出现更是为触发 BFC 提供了一种清晰、无副作用的最佳实践。
## Examples

> margin重叠

1. 重叠

```html
<body>
	<p>top</p>
	<p>bottom</p>
</body>

<style>
p {
	width: 100px;
	height: 100px;
	background: yellow;
	line-height: 100px;
	margin: 10px;
	text-align: center;
}
</style>
```
![20190813125350.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190813125350.png)

2. 不重叠

```html
<body>
	<p>top</p>
	<div>
		<p>bottom</p>
	</div>
</body>
<style>
p {
	width: 100px;
	height: 100px;
	background: yellow;
	line-height: 100px;
	margin: 10px;
	text-align: center;
}

div	{
	overflow: auto;
}

</style>
```
![20190813125339.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190813125339.png)

> 让浮动元素等高

1. 不等高

```html
<div class="box">
    <div class="float">浮动元素</div>
    <p>未浮动元素</p>
</div>
<style>
.box {
    background-color: rgb(224, 206, 247);
    border: 5px solid rebeccapurple;
}

.float {
    float: left;
    width: 200px;
    height: 150px;
    background-color: white;
    border:1px solid black;
    padding: 10px;
}      
</style>
```
![20190813125311.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190813125311.png)

2. 等高

```html
<div class="box">
    <div class="float">浮动元素</div>
    <p>未浮动元素</p>
</div>
<style>
.box {
    background-color: rgb(224, 206, 247);
    border: 5px solid rebeccapurple;
    overflow: auto;
}

.float {
    float: left;
    width: 200px;
    height: 150px;
    background-color: white;
    border:1px solid black;
    padding: 10px;
}      
</style>
```
![20190813125635.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190813125635.png)

## 自适应两栏布局

<AutoResizeTwoColumn />    
