---
title: CSS 表单样式进阶
date: 2025-04-29
tags:
  - CSS
  - 表单
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 表单样式进阶

[[toc]]

原生表单控件样式简陋且浏览器差异大。现代 CSS 提供了 `accent-color`、`appearance` 等属性，配合伪类和伪元素，可以打造一致且美观的表单体验。

---

## 现代表单属性

### accent-color 统一主题色

```css
:root {
  --accent: #4a90d9;
}

input[type="checkbox"],
input[type="radio"],
input[type="range"],
progress {
  accent-color: var(--accent);
}
```

一行代码统一复选框、单选框、滑块、进度条的主题色。

### appearance 重置控件样式

```css
/* 移除浏览器默认样式 */
.custom-select {
  appearance: none;
  -webkit-appearance: none;
  background: url('arrow.svg') no-repeat right 1rem center;
  padding-right: 2.5rem;
}

.custom-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.custom-checkbox:checked {
  background: #4a90d9;
  border-color: #4a90d9;
}
```

---

## 自定义复选框与单选框

### 纯 CSS 自定义复选框

```css
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-wrapper input {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-wrapper input:checked {
  background: #4a90d9;
  border-color: #4a90d9;
}

.checkbox-wrapper input:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkbox-wrapper input:focus-visible {
  outline: 2px solid #4a90d9;
  outline-offset: 2px;
}
```

### 切换开关

```css
.toggle {
  appearance: none;
  width: 48px;
  height: 24px;
  background: #ccc;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle:checked {
  background: #4a90d9;
}

.toggle:checked::after {
  transform: translateX(24px);
}
```

---

## 表单验证样式

### :valid / :invalid 伪类

```css
input:invalid {
  border-color: #e74c3c;
}

input:valid {
  border-color: #2ecc71;
}

input:focus:invalid {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}
```

### 自定义验证提示

```css
input:invalid + .error-msg {
  display: block;
  color: #e74c3c;
  font-size: 0.875rem;
}

input:valid + .error-msg {
  display: none;
}
```

```html
<input type="email" required>
<span class="error-msg">请输入有效的邮箱地址</span>
```

### :has() 增强验证

```css
/* 当表单包含无效字段时，提交按钮变灰 */
form:has(:invalid) button[type="submit"] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 当输入为空时显示占位提示 */
.form-group:has(input:placeholder-shown) label {
  color: #999;
}
```

---

## 浮动标签模式

```css
.floating-label {
  position: relative;
}

.floating-label input {
  padding: 1.5rem 1rem 0.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  width: 100%;
  font-size: 1rem;
}

.floating-label label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: all 0.2s;
  pointer-events: none;
}

/* 输入时或聚焦时标签上浮 */
.floating-label input:focus + label,
.floating-label input:not(:placeholder-shown) + label {
  top: 0.75rem;
  transform: translateY(0);
  font-size: 0.75rem;
  color: #4a90d9;
}
```

```html
<div class="floating-label">
  <input type="text" id="name" placeholder=" " required>
  <label for="name">用户名</label>
</div>
```

---

## 范围滑块自定义

```css
input[type="range"] {
  appearance: none;
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
}

/* Webkit 滑块轨道 */
input[type="range"]::-webkit-slider-runnable-track {
  height: 6px;
  background: linear-gradient(to right, #4a90d9 var(--value, 50%), #e0e0e0 var(--value, 50%));
  border-radius: 3px;
}

/* Webkit 滑块 thumb */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #4a90d9;
  border-radius: 50%;
  margin-top: -7px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.1s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

/* Firefox */
input[type="range"]::-moz-range-track {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #4a90d9;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| accent-color | 93+ | 15.4+ | 92+ | 93+ |
| appearance | 1+ | 3+ | 1+ | 12+ |
| :has() | 105+ | 15.4+ | 121+ | 105+ |
| :focus-visible | 86+ | 15.4+ | 85+ | 86+ |

---

## 奇淫技巧

### 技巧一：密码可见性切换

```css
.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 2.5rem;
}

.password-wrapper button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}
```

```js
// 切换 type
btn.addEventListener('click', () => {
  input.type = input.type === 'password' ? 'text' : 'password';
});
```

### 技巧二：文件上传美化

```css
.file-upload {
  position: relative;
}

.file-upload input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.file-upload .upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.2s;
}

.file-upload:hover .upload-btn {
  border-color: #4a90d9;
  background: #f0f7ff;
}

/* 拖拽状态 */
.file-upload:has(input[type="file"]:focus) .upload-btn,
.file-upload:has(input[type="file"]:active) .upload-btn {
  border-color: #4a90d9;
  background: #e8f2ff;
}
```

### 技巧三：搜索框自动展开

```css
.search-input {
  width: 40px;
  padding: 0.5rem;
  border-radius: 999px;
  border: 2px solid #ddd;
  transition: width 0.3s, padding 0.3s;
  background: url('search.svg') no-repeat 0.5rem center;
}

.search-input:focus {
  width: 200px;
  padding-left: 2rem;
}
```

### 技巧四：多选框卡片

```css
.option-card {
  appearance: none;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-card:checked {
  border-color: #4a90d9;
  background: #f0f7ff;
}

.option-card:checked::after {
  content: '✓';
  float: right;
  color: #4a90d9;
  font-weight: bold;
}
```

### 技巧五：自动增长文本域

```css
.auto-grow {
  field-sizing: content;  /* 现代浏览器 */
  min-height: 100px;
  max-height: 300px;
  resize: vertical;
}

/* 兼容方案 */
.auto-grow-compat {
  min-height: 100px;
  max-height: 300px;
  overflow-y: auto;
  resize: vertical;
}
```

---

## 参考资料

- [MDN accent-color](https://developer.mozilla.org/zh-CN/docs/Web/CSS/accent-color)
- [MDN appearance](https://developer.mozilla.org/zh-CN/docs/Web/CSS/appearance)
- [CSS-Tricks: Custom Styling Form Inputs](https://css-tricks.com/custom-styling-form-inputs-with-modern-css-features/)
