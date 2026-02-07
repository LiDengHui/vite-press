### Flex 布局属性

#### **一、容器属性（父元素）**
1. **`display`**
    - 定义容器为 flex 布局
    - 值：
        - `flex`：块级弹性容器
        - `inline-flex`：行内弹性容器

2. **`flex-direction`**
    - 定义主轴方向（项目排列方向）
    - 值：
        - `row`（默认）：水平从左到右
        - `row-reverse`：水平从右到左
        - `column`：垂直从上到下
        - `column-reverse`：垂直从下到上

3. **`flex-wrap`**
    - 控制项目是否换行
    - 值：
        - `nowrap`（默认）：不换行
        - `wrap`：换行（第一行在上方）
        - `wrap-reverse`：换行（第一行在下方）

4. **`flex-flow`**
    - `flex-direction` + `flex-wrap` 的简写
    - 格式：`<flex-direction> <flex-wrap>`
    - 示例：`flex-flow: row wrap;`

5. **`justify-content`**
    - 定义项目在**主轴**上的对齐方式
    - 值：
        - `flex-start`（默认）：左对齐
        - `flex-end`：右对齐
        - `center`：居中
        - `space-between`：两端对齐（项目间等距）
        - `space-around`：项目两侧等距
        - `space-evenly`：所有间距完全相等

6. **`align-items`**
    - 定义项目在**交叉轴**上的对齐方式（单行）
    - 值：
        - `stretch`（默认）：拉伸填满容器
        - `flex-start`：顶部对齐
        - `flex-end`：底部对齐
        - `center`：垂直居中
        - `baseline`：基线对齐

7. **`align-content`**
    - 定义**多行项目**在交叉轴上的对齐方式
    - 值同 `justify-content`
    - **注意**：仅当 `flex-wrap: wrap` 时生效

---

#### **二、项目属性（子元素）**
1. **`order`**
    - 定义项目的排列顺序（数值越小越靠前）
    - 默认值：`0`
    - 示例：`order: 1;`

2. **`flex-grow`**
    - 定义项目的放大比例（剩余空间分配）
    - 默认值：`0`（不放大）
    - 示例：`flex-grow: 2;`（占剩余空间2份）

3. **`flex-shrink`**
    - 定义项目的缩小比例（空间不足时）
    - 默认值：`1`（等比例缩小）
    - `0`：禁止缩小

4. **`flex-basis`**
    - 定义项目在分配空间前的初始大小
    - 值：`auto`（默认） | `长度`（如 `200px`） | `content`
    - 优先级：`flex-basis > width`

5. **`flex`**
    - `flex-grow` + `flex-shrink` + `flex-basis` 的简写
    - 常用值：
        - `flex: 1` → `1 1 0%`（自适应占满剩余空间）
        - `flex: none` → `0 0 auto`（固定大小）

6. **`align-self`**
    - 覆盖容器的 `align-items`，定义单个项目的对齐方式
    - 值同 `align-items`
    - 示例：`align-self: flex-end;`（底部对齐）

---

### **使用示例**
```html
<div class="container">
  <div class="item item1">1</div>
  <div class="item item2">2</div>
  <div class="item item3">3</div>
</div>
```

```css
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  height: 300px;
}

.item1 {
  flex: 1; /* 占满剩余空间 */
  align-self: flex-start; /* 顶部对齐 */
}

.item2 {
  flex: 0 0 200px; /* 固定宽度200px，不放大/缩小 */
}

.item3 {
  order: -1; /* 排在最前面 */
}
```

### **核心概念**
- **主轴（Main Axis）**：由 `flex-direction` 定义的方向（水平/垂直）。
- **交叉轴（Cross Axis）**：与主轴垂直的方向。

> 💡 **最佳实践**：
> - 使用 `flex: 1` 实现自适应布局
> - 用 `justify-content: space-between` 实现导航栏均匀分布
> - `align-items: center` 实现垂直居中

通过组合这些属性，可高效实现响应式布局、居中对齐、动态分配空间等效果。
