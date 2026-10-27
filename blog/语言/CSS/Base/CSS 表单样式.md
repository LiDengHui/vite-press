---
title: CSS 表单样式
date: 2025-04-29
tags:
  - CSS
  - 表单
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 表单样式

表单是网页交互的核心，现代 CSS 提供了丰富的伪类和属性选择器，让表单样式不再依赖 JavaScript。

---

## 一、基础表单样式

```css
input, textarea, select {
    font-family: inherit;
    font-size: 16px; /* iOS 最小 16px 防止自动缩放 */
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 8px 12px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
```

---

## 二、状态伪类

```css
/* 必填 */
input:required { border-color: #ff4d4f; }

/* 可选 */
input:optional { }

/* 有效 */
input:valid { border-color: #52c41a; }

/* 无效 */
input:invalid { border-color: #ff4d4f; }
input:invalid:not(:placeholder-shown) { border-color: #ff4d4f; }

/* 禁用 */
input:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
}

/* 只读 */
input:read-only { background: #f5f5f5; }

/* 占位符显示中 */
input:placeholder-shown { }

/* 已勾选 */
input:checked { }

/* 不确定状态 */
input:indeterminate { }

/* 范围内 */
input:in-range { }

/* 范围外 */
input:out-of-range { }
```

---

## 三、自定义复选框/单选框

```css
/* 隐藏原生控件 */
.custom-checkbox input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

/* 自定义外观 */
.custom-checkbox .checkmark {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #d9d9d9;
    border-radius: 2px;
    position: relative;
    transition: all 0.2s;
}

/* 选中状态 */
.custom-checkbox input:checked + .checkmark {
    background: #1890ff;
    border-color: #1890ff;
}
.custom-checkbox input:checked + .checkmark::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* 聚焦 */
.custom-checkbox input:focus + .checkmark {
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 禁用 */
.custom-checkbox input:disabled + .checkmark {
    opacity: 0.5;
    cursor: not-allowed;
}
```

---

## 四、自定义开关

```css
.toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}
.toggle input { opacity: 0; width: 0; height: 0; }

.slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: #ccc;
    border-radius: 24px;
    transition: 0.3s;
}
.slider::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: #fff;
    border-radius: 50%;
    transition: 0.3s;
}

input:checked + .slider { background: #1890ff; }
input:checked + .slider::before { transform: translateX(20px); }
input:focus + .slider { box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2); }
input:disabled + .slider { opacity: 0.5; cursor: not-allowed; }
```

---

## 五、自定义滑块

```css
input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1890ff;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1890ff;
    cursor: pointer;
    border: 2px solid #fff;
}
```

---

## 六、文件上传美化

```css
.file-input {
    position: relative;
    display: inline-block;
}
.file-input input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.file-input .btn {
    display: inline-block;
    padding: 8px 16px;
    background: #1890ff;
    color: #fff;
    border-radius: 4px;
    pointer-events: none;
}
```

---

## 七、输入框前缀/后缀

```css
.input-group {
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
}
.input-group .prefix,
.input-group .suffix {
    padding: 8px 12px;
    background: #f5f5f5;
    color: #666;
    white-space: nowrap;
}
.input-group input {
    flex: 1;
    border: none;
    outline: none;
    padding: 8px 12px;
}
```

---

## 奇淫技巧

### 技巧 1：浮动标签（Float Label）

```css
.float-label {
    position: relative;
}
.float-label input {
    padding: 16px 12px 8px;
}
.float-label label {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    transition: all 0.2s;
    pointer-events: none;
}
.float-label input:focus + label,
.float-label input:not(:placeholder-shown) + label {
    top: 8px;
    font-size: 12px;
    color: #1890ff;
}
```

### 技巧 2：密码可见性切换

```css
.password-field {
    position: relative;
}
.password-field input { padding-right: 40px; }
.password-field .toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
}
```

### 技巧 3：搜索框清空按钮

```css
.search-box {
    position: relative;
}
.search-box input:placeholder-shown + .clear-btn {
    display: none;
}
.search-box .clear-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}
```

### 技巧 4：字符计数器

```css
textarea {
    field-sizing: content; /* 根据内容自动调整高度（Chrome 123+） */
}

.char-counter {
    position: relative;
}
.char-counter::after {
    content: attr(data-count) "/" attr(data-max);
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 12px;
    color: #999;
}
```

### 技巧 5：步骤指示器

```css
.step-indicator {
    display: flex;
    counter-reset: step;
}
.step {
    flex: 1;
    text-align: center;
    position: relative;
}
.step::before {
    counter-increment: step;
    content: counter(step);
    display: inline-block;
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 50%;
    background: #e0e0e0;
}
.step.active::before { background: #1890ff; color: #fff; }
```

### 技巧 6：颜色选择器美化

```css
input[type="color"] {
    -webkit-appearance: none;
    appearance: none;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
}
input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
input[type="color"]::-webkit-color-swatch { border: none; }
```

### 技巧 7：纯 CSS 表单验证提示

```css
input:invalid:not(:placeholder-shown) {
    border-color: #ff4d4f;
}
input:invalid:not(:placeholder-shown) + .error-msg {
    display: block;
}
.error-msg {
    display: none;
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 4px;
}
```

### 技巧 8：数字输入框去除箭头

```css
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
    -moz-appearance: textfield;
}
```

### 技巧 9：自动完成样式覆盖

```css
/* 覆盖浏览器自动完成背景色 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px #fff inset;
    -webkit-text-fill-color: #333;
    transition: background-color 5000s ease-in-out 0s;
}
```

### 技巧 10：进度条样式

```css
progress {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
}
progress::-webkit-progress-bar {
    background: #e0e0e0;
    border-radius: 4px;
}
progress::-webkit-progress-value {
    background: #1890ff;
    border-radius: 4px;
    transition: width 0.3s;
}
progress::-moz-progress-bar {
    background: #1890ff;
    border-radius: 4px;
}
```

> 💡 **表单口诀**：状态用伪类，自定义用同胞选择器，滑块用 appearance:none，自动完成用 box-shadow 覆盖。
