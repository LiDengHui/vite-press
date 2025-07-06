# AddEventListener 方法的属性意义

`addEventListener()` 是 JavaScript 中用于为 DOM 元素添加事件监听器的方法，它的语法如下：

```javascript
target.addEventListener(type, listener, options);
// 或
target.addEventListener(type, listener, useCapture);
```

## 参数意义

### 1. type (必需)
- 表示要监听的事件类型的字符串（如 "click", "mouseover", "keydown" 等）
- 事件类型区分大小写

### 2. listener (必需)
- 事件触发时执行的回调函数
- 可以是函数引用或匿名函数
- 回调函数会接收一个事件对象作为参数

## 3. options / useCapture (可选)

### 作为对象 options 时：
```javascript
{
  capture: Boolean,  // 是否在捕获阶段触发
  once: Boolean,     // 是否只执行一次后自动移除
  passive: Boolean,  // 是否永远不会调用 preventDefault()
  signal: AbortSignal // 关联的 AbortSignal 用于移除监听器
}
```

### 作为布尔值 useCapture 时：
- `true`: 在捕获阶段处理事件
- `false` (默认): 在冒泡阶段处理事件

## 重要特性

1. **可以添加多个相同类型的事件处理器**，不会覆盖已有处理器
2. **提供了更精细的控制**，可以通过 options 配置事件行为
3. **可以移除特定监听器**，需要使用 `removeEventListener()` 并传入相同的参数
4. **兼容性好**，是现代浏览器推荐的事件处理方式

## 示例

```javascript
// 基本用法
button.addEventListener('click', function(event) {
  console.log('Button clicked!');
});

// 使用 options 对象
document.addEventListener('scroll', function(event) {
  console.log('Scrolling...');
}, { passive: true, once: true });

// 使用 useCapture
parent.addEventListener('click', function() {
  console.log('捕获阶段触发');
}, true);
child.addEventListener('click', function() {
  console.log('冒泡阶段触发');
});
```

`addEventListener()` 比传统的 `onclick` 等属性更灵活，是处理 DOM 事件的首选方法。

## 何时应该使用 passive: 默认为true
1. 滚动事件 (scroll, wheel, mousewheel)
```javascript
   window.addEventListener('scroll', function(e) {
   // 这里不会调用 e.preventDefault()
   }, { passive: true });
```
2. 触摸事件 (touchstart, touchmove)
```javascript
   element.addEventListener('touchmove', function(e) {
   // 这里不会调用 e.preventDefault()
   }, { passive: true });
```
3. 指针事件 (pointermove)
```javascript
element.addEventListener('pointermove', function(e) {
// 这里不会调用 e.preventDefault()
}, { passive: true });
```
   