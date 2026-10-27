---
title: CSS 表单样式与验证
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

# CSS 表单样式与验证

[[toc]]

CSS 为表单元素提供了丰富的样式控制能力，结合 HTML5 验证属性和现代 CSS 伪类，可以创建美观且用户友好的表单体验。

---

## 基础表单样式

### 输入框美化

```css
/* 基础输入框 */
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.input::placeholder {
  color: #999;
}
```

### 标签样式

```css
.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 0.875rem;
}

/* 浮动标签 */
.floating-label {
  position: relative;
}

.floating-label input {
  padding: 20px 16px 8px;
}

.floating-label label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: all 0.2s;
  pointer-events: none;
}

.floating-label input:focus + label,
.floating-label input:not(:placeholder-shown) + label {
  top: 8px;
  transform: translateY(0);
  font-size: 0.75rem;
  color: #3498db;
}
```

---

## 验证伪类

### :valid / :invalid

```css
/* 有效状态 */
.input:valid {
  border-color: #2ecc71;
}

/* 无效状态 */
.input:invalid {
  border-color: #e74c3c;
}

/* 仅在用户交互后显示验证状态 */
.input:user-valid {
  border-color: #2ecc71;
}

.input:user-invalid {
  border-color: #e74c3c;
}
```

### :required

```css
.required-field {
  border-left: 3px solid #e74c3c;
}

.required-field:required {
  background-image: url('required-icon.svg');
  background-position: right 12px center;
  background-repeat: no-repeat;
}
```

### :placeholder-shown

```css
/* 占位符显示时 */
.input:placeholder-shown {
  border-color: #e0e0e0;
}

/* 占位符隐藏时（已输入内容） */
.input:not(:placeholder-shown) {
  border-color: #333;
}
```

### :checked

```css
/* 自定义复选框 */
.checkbox {
  display: none;
}

.checkbox + label {
  position: relative;
  padding-left: 28px;
  cursor: pointer;
}

.checkbox + label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}

.checkbox:checked + label::before {
  background: #3498db;
  border-color: #3498db;
}

.checkbox:checked + label::after {
  content: '✓';
  position: absolute;
  left: 4px;
  top: 0;
  color: white;
  font-size: 14px;
}
```

### :indeterminate

```css
/* 半选状态（用于全选/半选场景） */
.checkbox:indeterminate + label::before {
  background: #3498db;
  border-color: #3498db;
}

.checkbox:indeterminate + label::after {
  content: '−';
  position: absolute;
  left: 5px;
  top: -1px;
  color: white;
}
```

### :in-range / :out-of-range

```css
/* 数值范围内 */
.number-input:in-range {
  border-color: #2ecc71;
}

/* 数值范围外 */
.number-input:out-of-range {
  border-color: #e74c3c;
}
```

### :disabled / :enabled

```css
.input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.input:enabled {
  background: #fff;
}
```

---

## 高级验证样式

### 验证消息

```css
/* 使用 :has() 显示错误消息 */
.form-group:has(.input:user-invalid) .error-msg {
  display: block;
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 4px;
}

.form-group:has(.input:user-valid) .success-msg {
  display: block;
  color: #2ecc71;
  font-size: 0.875rem;
  margin-top: 4px;
}

.error-msg,
.success-msg {
  display: none;
}
```

### 密码强度指示

```css
/* 基于 pattern 属性的密码强度 */
.password:placeholder-shown + .strength {
  display: none;
}

.password:invalid + .strength::after {
  content: '弱';
  color: #e74c3c;
}

.password:valid + .strength::after {
  content: '强';
  color: #2ecc71;
}
```

### 表单整体验证状态

```css
/* 表单未填写完整时禁用提交按钮 */
form:invalid button[type="submit"] {
  opacity: 0.5;
  cursor: not-allowed;
}

form:valid button[type="submit"] {
  opacity: 1;
  cursor: pointer;
}
```

---

## 自定义控件

### 单选按钮组

```css
.radio-group {
  display: flex;
  gap: 16px;
}

.radio {
  display: none;
}

.radio + label {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio:checked + label {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}
```

### 开关按钮

```css
.toggle {
  display: none;
}

.toggle + label {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  background: #ddd;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle + label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle:checked + label {
  background: #3498db;
}

.toggle:checked + label::after {
  transform: translateX(24px);
}
```

### 范围滑块

```css
.range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
}

.range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.range::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
```

---

## 文件上传

```css
.file-input {
  display: none;
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.file-label:hover {
  background: #2980b9;
}

.file-label::before {
  content: '📎';
}
```

---

## 浏览器兼容性

| 伪类 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| :valid / :invalid | 10+ | 5+ | 4+ | 12+ |
| :required | 10+ | 5+ | 4+ | 12+ |
| :placeholder-shown | 47+ | 9.1+ | 51+ | 79+ |
| :user-valid | 119+ | 17.4+ | 88+ | 119+ |
| :user-invalid | 119+ | 17.4+ | 88+ | 119+ |
| :indeterminate | 1+ | 3+ | 1+ | 12+ |
| :in-range | 10+ | 5.1+ | 29+ | 12+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 密码可见切换

```css
.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

/* 使用 checkbox 控制密码可见性 */
#show-password:checked ~ .password-wrapper input {
  -webkit-text-security: none;
}

#show-password:not(:checked) ~ .password-wrapper input {
  -webkit-text-security: disc;
}
```

### 技巧二：搜索框清除按钮

```css
.search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  background: url('clear-icon.svg') no-repeat center;
  cursor: pointer;
}
```

### 技巧三：自动填充样式覆盖

```css
/* 覆盖浏览器自动填充样式 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px white inset;
  -webkit-text-fill-color: #333;
  transition: background-color 5000s ease-in-out 0s;
}
```

### 技巧四：步进器样式

```css
.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  opacity: 1;
  height: 30px;
}

/* 自定义步进器 */
.custom-stepper {
  display: flex;
  align-items: center;
}

.custom-stepper button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
}

.custom-stepper input {
  width: 60px;
  text-align: center;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
  height: 32px;
}
```

### 技巧五：字符计数器

```css
.char-counter {
  position: relative;
}

.char-counter input {
  padding-bottom: 24px;
}

.char-counter::after {
  content: attr(data-count) ' / ' attr(data-max);
  position: absolute;
  right: 12px;
  bottom: 4px;
  font-size: 0.75rem;
  color: #999;
}

/* 接近限制时变色 */
.char-counter[data-count="90"]::after,
.char-counter[data-count="91"]::after,
.char-counter[data-count="92"]::after,
.char-counter[data-count="93"]::after,
.char-counter[data-count="94"]::after,
.char-counter[data-count="95"]::after,
.char-counter[data-count="96"]::after,
.char-counter[data-count="97"]::after,
.char-counter[data-count="98"]::after,
.char-counter[data-count="99"]::after {
  color: #e74c3c;
}
```

---

## 参考资料

- [MDN: CSS 表单](https://developer.mozilla.org/zh-CN/docs/Learn/Forms)
- [MDN: :user-valid](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid)
- [CSS-Tricks: Form Validation UX](https://css-tricks.com/form-validation-ux-html-css/)
