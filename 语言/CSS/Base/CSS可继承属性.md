# CSS可继承属性

在 CSS 中，**可继承属性**是指当元素未显式设置该属性时，会自动从其父元素继承值的属性。以下是主要可继承属性的分类列表：

---

### 📜 文本与字体相关
1. **`color`**：文本颜色
2. **`font`** 及其子属性：
    - `font-family`：字体系列
    - `font-size`：字体大小
    - `font-style`：斜体/正常（如 `italic`）
    - `font-weight`：字体粗细（如 `bold`）
    - `font-variant`：小型大写字母（如 `small-caps`）
3. **`line-height`**：行高
4. **`text-align`**：文本对齐方式（如 `left`, `center`）
5. **`text-indent`**：首行缩进
6. **`text-transform`**：文本转换（如 `uppercase`, `capitalize`）
7. **`letter-spacing`**：字母间距
8. **`word-spacing`**：单词间距
9. **`white-space`**：空白处理方式（如 `nowrap`）
10. **`direction`**：文本方向（如 `rtl` 从右到左）

---

### 📝 列表相关
11. **`list-style`** 及其子属性：
    - `list-style-type`：列表标记类型（如 `disc`, `decimal`）
    - `list-style-position`：标记位置（`inside`/`outside`）
    - `list-style-image`：自定义列表标记图片

---

### 🖋️ 其他属性
12. **`visibility`**：元素可见性（如 `hidden`）
13. **`cursor`**：鼠标指针样式（如 `pointer`）
14. **`quotes`**：引号样式（如 `« " »`）

---

### ⚠️ 重要注意事项
- **不可继承的常见属性**：  
  `width`/`height`、`margin`/`padding`/`border`、`background`、`position`、`display`、`float`、`overflow`、`z-index` 等布局和盒模型属性**不会继承**。

- **强制继承**：  
  通过 `inherit` 关键字可强制继承父元素的值（即使本身不可继承）：
  ```css
  div {
    background: inherit; /* 强制继承背景 */
  }
  ```

- **表单元素例外**：  
  部分表单控件（如 `<input>`、`<textarea>`）默认不继承文本属性，需手动设置：
  ```css
  input, button, textarea {
    font-family: inherit; /* 手动启用继承 */
    color: inherit;
  }
  ```

---

### 🌰 继承示例
```html
<div style="color: blue; font-size: 20px;">
  父元素文本
  <p>子元素自动继承蓝色和20px字体</p>
</div>
```

> 💡 **最佳实践**：利用继承减少重复代码（如全局设置 `font-family` 在 `<body>` 上）。通过浏览器开发者工具检查样式时，继承值通常显示为 _灰色_ 或标明 "Inherited from...”。