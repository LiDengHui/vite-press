# IntersectionObserver 使用方式和场景

## 基本概念

IntersectionObserver API 提供了一种异步观察目标元素与祖先元素或顶级文档视口(viewport)交叉状态的方法。它可以高效地检测元素是否进入可视区域，而无需频繁计算和监听滚动事件。

## 基本使用方式

### 1. 创建观察者

```javascript
const observer = new IntersectionObserver(callback, options);
```

### 2. 定义回调函数

```javascript
const callback = (entries, observer) => {
  entries.forEach(entry => {
    // 每个entry描述一个观察到的目标元素的交叉状态
    if (entry.isIntersecting) {
      // 元素进入视口
    } else {
      // 元素离开视口
    }
  });
};
```

### 3. 配置选项

```javascript
const options = {
  root: null, // 观察的根元素，null表示视口
  rootMargin: '0px', // 根元素的margin，可以提前或延迟触发
  threshold: 0.5 // 触发回调的阈值，可以是数组[0, 0.25, 0.5, 0.75, 1]
};
```

### 4. 观察目标元素

```javascript
const target = document.querySelector('#target-element');
observer.observe(target);
```

### 5. 停止观察

```javascript
observer.unobserve(target); // 停止观察特定元素
observer.disconnect(); // 停止所有观察
```

## 常见应用场景

### 1. 图片懒加载

```javascript
const lazyImages = document.querySelectorAll('img.lazy');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));
```

### 2. 无限滚动

```javascript
const sentinel = document.querySelector('#sentinel');
const container = document.querySelector('#container');

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreItems(); // 加载更多内容
  }
});

observer.observe(sentinel);
```

### 3. 广告曝光统计

```javascript
const adObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const adId = entry.target.dataset.adId;
      trackAdImpression(adId); // 发送广告曝光统计
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.ad').forEach(ad => adObserver.observe(ad));
```

### 4. 动画触发

```javascript
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  animateObserver.observe(el);
});
```

### 5. 固定导航栏

```javascript
const header = document.querySelector('header');
const stickyObserver = new IntersectionObserver(
  ([e]) => e.intersectionRatio < 1 
    ? header.classList.add('sticky')
    : header.classList.remove('sticky'),
  { threshold: [1] }
);

stickyObserver.observe(document.querySelector('#header-sentinel'));
```

## 注意事项

1. **性能优势**：相比传统的滚动事件监听+getBoundingClientRect计算，IntersectionObserver性能更好，因为它是异步的且由浏览器优化。

2. **兼容性**：现代浏览器基本都支持，但对于旧浏览器需要polyfill。

3. **rootMargin**：可以使用负值来延迟触发，或正值来提前触发交叉检测。

4. **threshold**：可以设置多个阈值，当交叉比例达到任一阈值时都会触发回调。

5. **观察多个元素**：一个观察者可以观察多个元素，回调中会包含所有变化的entries。

IntersectionObserver为现代Web开发提供了更高效的元素可见性检测方案，特别适合懒加载、曝光统计、滚动动画等场景。