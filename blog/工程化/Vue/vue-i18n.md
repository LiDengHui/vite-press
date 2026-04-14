# vue-i18n 消息语法避坑指南（v9+）

这篇整理了 `vue-i18n` 常见消息语法，重点是那些“看起来像普通字符，实际是语法”的坑点。

## 一、最常用的 10 种写法

### 1) 普通文本

```json
"hello": "Hello world"
```

最安全，几乎不会踩语法坑。

### 2) 命名插值（Named interpolation）

```json
"greet": "Hello {name}"
```

```ts
t('greet', { name: 'Alice' })
```

### 3) 列表插值（List interpolation）

```json
"order": "Item {0}, Qty {1}"
```

```ts
t('order', ['Apple', 3])
```

### 4) 字面量插值（Literal interpolation）

```json
"special": "Use {'@'} and {'{'} and {'}'}"
```

用于把原本会被当语法的字符，强制按普通字符输出。

### 5) Linked message（引用其他 key）

```json
"pwd": "Password",
"label": "Enter @:pwd"
```

`@:` 表示引用另一个翻译 key。

### 6) Linked + Modifier（修饰符）

```json
"word": "hello",
"up": "@.upper:word",
"low": "@.lower:word",
"cap": "@.capitalize:word"
```

`@.xxx:key` 会对被引用内容做转换。

### 7) 复数消息（Plural message）

```json
"car": "no cars | one car | {count} cars"
```

```ts
t('car', 0) // no cars
t('car', 1) // one car
t('car', 5) // 5 cars（结合参数）
```

不同语言复数规则差异很大，国际化项目里要特别小心。

### 8) 复数 + 插值

```json
"apple": "no apples | one apple | {count} apples"
```

```ts
t('apple', 3, { count: 3 })
```

### 9) HTML 文本（不推荐放复杂 HTML）

```json
"msg": "Click <b>here</b>"
```

若直接渲染 HTML，要注意 XSS 风险。

### 10) 组件插值（`<i18n-t>`）

链接、强调等内容建议作为组件插槽传入，通常比拼接 HTML 字符串更安全。

## 二、最容易出错的 5 个“超直觉点”

1. `@` 不是普通字符，可能会被当成 linked 语法。
2. `{}` 不是普通括号，可能会被当成插值占位符。
3. `|` 不只是分隔符，在复数语法里是分支分隔。
4. 同一条文案混用 `@:`、`{}`、`|` 时，报错往往不直观。
5. 需要输出保留字符时，优先用字面量写法，如 `{'@'}`、`{'{'}`。

## 三、实战建议

1. 文案里出现 `@`、`{}`、`|` 时，先判断它是内容还是语法。
2. 有“符号展示”需求时，直接用字面量插值，不要硬转义。
3. 涉及 HTML 的翻译文本，优先使用 `<i18n-t>`。
