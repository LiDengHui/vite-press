# String 常用方法

当然可以，以下是 JavaScript 中对 `String` 类型最常用、最常见的操作方法和属性，按 **类型分类整理**，并附带简单例子，便于理解和记忆。

---

## ✅ 基本属性

### `length`

- 返回字符串的长度（字符数）

```js
'hello'.length; // 5
```

---

## 🔍 查找相关

### `indexOf(substring)`

- 返回子串首次出现的位置，找不到返回 -1

```js
'hello world'.indexOf('world'); // 6
```

### `lastIndexOf(substring)`

- 返回子串最后一次出现的位置

```js
'hello hello'.lastIndexOf('hello'); // 6
```

### `includes(substring)`

- 是否包含某子串（返回布尔值）

```js
'hello'.includes('he'); // true
```

### `startsWith(substring)`

- 是否以某子串开头

```js
'hello'.startsWith('he'); // true
```

### `endsWith(substring)`

- 是否以某子串结尾

```js
'hello'.endsWith('lo'); // true
```

---

## ✂️ 提取字符串

### `slice(start, end?)`

- 提取从 `start` 到 `end`（不包括 end）

```js
'abcdef'.slice(1, 4); // 'bcd'
```

### `substring(start, end?)`

- 类似于 `slice`，不支持负索引

```js
'abcdef'.substring(1, 4); // 'bcd'
```

### `substr(start, length)`

- 提取从 start 开始的 length 个字符（已废弃，但仍在使用）

```js
'abcdef'.substr(1, 3); // 'bcd'
```

---

## 🧱 修改与处理

### `replace(pattern, replacement)`

- 替换匹配的字符串（默认只替换第一个）

```js
'foo bar foo'.replace('foo', 'baz'); // 'baz bar foo'
```

#### 替换全部

```js
'foo bar foo'.replace(/foo/g, 'baz'); // 'baz bar baz'
```

### `replaceAll(search, replace)`

- 替换所有匹配项（无需正则）

```js
'foo bar foo'.replaceAll('foo', 'baz'); // 'baz bar baz'
```

### `toUpperCase()` / `toLowerCase()`

```js
'hello'.toUpperCase(); // 'HELLO'
'WORLD'.toLowerCase(); // 'world'
```

### `trim()` / `trimStart()` / `trimEnd()`

```js
'  hello  '.trim(); // 'hello'
'  hello  '.trimStart(); // 'hello  '
'  hello  '.trimEnd(); // '  hello'
```

---

## 🧩 拆分与拼接

### `split(separator, limit?)`

- 将字符串按某分隔符拆分成数组

```js
'1,2,3'.split(','); // ['1', '2', '3']
```

### `concat(str1, str2, ...)`

- 拼接多个字符串（不推荐，推荐用 `+` 或模板字符串）

```js
'Hello'.concat(' ', 'World'); // 'Hello World'
```

### 模板字符串（推荐）

```js
const name = 'Alice';
`Hello, ${name}!`; // 'Hello, Alice!'
```

---

## 🔄 重复与填充

### `repeat(n)`

```js
'abc'.repeat(3); // 'abcabcabc'
```

### `padStart(length, padString)` / `padEnd(length, padString)`

```js
'5'.padStart(3, '0'); // '005'
'5'.padEnd(3, '_'); // '5__'
```

## 🧪 其他常用技巧

### 1. 反转字符串（需转数组）

```js
'abc'.split('').reverse().join(''); // 'cba'
```

### 2. 判断是否为空字符串

```js
str === '' || str.length === 0;
```

### 3. 判断是否只包含空白

```js
'   '.trim() === ''; // true
```

---

## 🧠 小贴士

| 需求           | 方法                              |
| -------------- | --------------------------------- |
| 是否包含子串   | `includes`                        |
| 截取部分字符串 | `slice` / `substring`             |
| 转大小写       | `toUpperCase()` / `toLowerCase()` |
| 去除空格       | `trim()`                          |
| 拆分           | `split(',')`                      |
| 替换           | `replace()` / `replaceAll()`      |
| 重复字符       | `repeat(n)`                       |
| 前后补齐       | `padStart()` / `padEnd()`         |

---

如你有特定场景，比如「处理 URL」、「格式化字符串」、「敏感词替换」等，我也可以提供更实用的组合操作技巧。需要的话可以告诉我。
