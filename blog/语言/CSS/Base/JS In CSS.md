---
title: JS 操作 CSS 的方式
date: 2025-04-29
tags:
  - CSS
  - 前端
  - JavaScript
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# JS 操作 CSS 的方式

CSS 本质是声明式语言，但实际开发中经常需要 JS 动态操作样式。本文汇总所有常见方式及其适用场景。

---

## 一、操作行内样式（style 属性）

### 单个属性

```javascript
const el = document.querySelector('.box');

// 设置
el.style.backgroundColor = 'red';
el.style.width = '200px';

// 读取（只读取行内样式）
color = el.style.backgroundColor;

// 删除
delete el.style.backgroundColor; // 或 el.style.backgroundColor = ''
```

### 多个属性

```javascript
Object.assign(el.style, {
    backgroundColor: 'red',
    width: '200px',
    transform: 'translateX(100px)',
    transition: 'all 0.3s ease'
});

// 或用 cssText（会覆盖全部行内样式）
el.style.cssText = 'background: red; width: 200px;';
```

> ⚠️ 注意：`style` 属性只能读取/设置 **行内样式**（`style="..."`），无法访问外部样式表。

---

## 二、计算样式值（getComputedStyle）

### 读取最终生效的样式

```javascript
const style = getComputedStyle(el);

// 读取（返回计算后的值）
const width = style.width;           // "200px"
const color = style.backgroundColor; // "rgb(255, 0, 0)"
const fontSize = style.fontSize;     // "16px"

// 使用 CSS 变量
const primary = style.getPropertyValue('--primary-color');
```

### 与 style 属性的区别

| 方法 | 读取行内 | 读取外部表 | 返回格式 | 可写性 |
|------|---------|----------|--------|--------|
| `el.style` | ✅ | ❌ | 保持原格式 | ✅ |
| `getComputedStyle` | ✅ | ✅ | 计算后（如 rgb） | ❌ |

---

## 三、操作 CSS 变量（Custom Properties）

### 读取

```javascript
const root = document.documentElement;
const color = getComputedStyle(root)
    .getPropertyValue('--primary-color');  // " #1890ff"
```

### 设置

```javascript
// 设置全局变量
document.documentElement.style.setProperty('--primary-color', '#ff5722');

// 设置元素级变量
const card = document.querySelector('.card');
card.style.setProperty('--card-bg', '#f5f5f5');

// 删除变量
card.style.removeProperty('--card-bg');
```

### 动态主题切换

```javascript
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
}

// 或用纯 CSS 变量
function setTheme(name) {
    const themes = {
        light: { '--bg': '#fff', '--text': '#333' },
        dark:  { '--bg': '#1a1a1a', '--text': '#e0e0e0' }
    };
    const root = document.documentElement;
    Object.entries(themes[name]).forEach(([k, v]) => {
        root.style.setProperty(k, v);
    });
}
```

---

## 四、操作类名

```javascript
const el = document.querySelector('.btn');

// 添加
el.classList.add('active', 'primary');

// 删除
el.classList.remove('active');

// 切换
el.classList.toggle('active');

// 检查
const isActive = el.classList.contains('active');

// 替换
el.classList.replace('old', 'new');

// 按条件切换
el.classList.toggle('active', condition);
```

> ✅ 永远用 `classList` 而非 `className`，避免覆盖其他类名。

---

## 五、操作样式表（StyleSheet）

### 动态插入样式

```javascript
const style = document.createElement('style');
style.textContent = `
    .dynamic { color: red; }
    .dynamic:hover { color: blue; }
`;
document.head.appendChild(style);
```

### 操作已有样式表

```javascript
const sheet = document.styleSheets[0]; // 第一个样式表

// 插入规则
sheet.insertRule('.new-rule { color: green; }', sheet.cssRules.length);

// 删除规则
sheet.deleteRule(0);

// 读取所有规则
for (const rule of sheet.cssRules) {
    console.log(rule.cssText);
}
```

### 媒体查询 JS 版

```javascript
const mql = window.matchMedia('(max-width: 768px)');

// 检查
console.log(mql.matches); // true/false

// 监听变化
mql.addEventListener('change', (e) => {
    if (e.matches) {
        console.log('进入移动端模式');
    }
});

// 旧版浏览器兼容
mql.addListener((e) => { ... });
```

---

## 六、动画与过渡（Web Animations API）

```javascript
const el = document.querySelector('.box');

// 基础动画
el.animate([
    { transform: 'translateX(0)', opacity: 0 },
    { transform: 'translateX(100px)', opacity: 1 }
], {
    duration: 500,
    easing: 'ease-out',
    fill: 'forwards'
});

// 控制动画
const animation = el.animate(...);
animation.pause();
animation.play();
animation.reverse();
animation.cancel();
animation.finish();

// 监听动画事件
animation.onfinish = () => console.log('done');
```

### 与 CSS 动画对比

| 方式 | 优势 | 劣势 |
|------|------|------|
| CSS Animation | 性能好，无需 JS | 逻辑复杂时困难 |
| WAAPI | JS 控制，可动态 | 需要 JS 支持 |

---

## 七、ResizeObserver 监听尺寸变化

```javascript
const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('宽度变化为:', width);
    }
});

ro.observe(document.querySelector('.box'));
ro.unobserve(el);  // 停止监听
ro.disconnect();   // 停止所有
```

> 相比 `window.resize` 事件，ResizeObserver 更高性能，且可监听任意元素。

---

## 八、IntersectionObserver 视图交叉检测

```javascript
const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target); // 只触发一次
        }
    }
}, {
    threshold: 0.5,      // 可见 50% 时触发
    rootMargin: '100px'  // 提前 100px 触发
});

document.querySelectorAll('.lazy').forEach(el => io.observe(el));
```

---

## 九、奇淫技巧

### 技巧 1：元素在窗口内是否完全可见

```javascript
function isFullyVisible(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
}
```

### 技巧 2：获取真实字体大小

```javascript
function getTextSize(text, styles = {}) {
    const span = document.createElement('span');
    span.textContent = text;
    Object.assign(span.style, {
        position: 'absolute',
        visibility: 'hidden',
        whiteSpace: 'nowrap',
        ...styles
    });
    document.body.appendChild(span);
    const { width, height } = span.getBoundingClientRect();
    document.body.removeChild(span);
    return { width, height };
}
```

### 技巧 3：动态计算 scrollbar 宽度

```javascript
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

// 打开模态框时补偿滚动条消失导致的闪动
function lockScroll() {
    const sbw = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sbw}px`;
}
function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}
```

### 技巧 4：CSS 属性值转换

```javascript
// px → number
const pxToNum = (px) => parseFloat(px);

// 色值转换
const div = document.createElement('div');
div.style.color = 'red';
document.body.appendChild(div);
const computedColor = getComputedStyle(div).color; // "rgb(255, 0, 0)"
document.body.removeChild(div);
```

### 技巧 5：requestAnimationFrame 实现滑动

```javascript
function smoothScrollTo(targetY, duration = 500) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, startY + diff * ease);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}
```

### 技巧 6：用 CSS 变量做 JS 与 CSS 的"桥梁"

```javascript
// JS 更新变量，CSS 自动响应
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll', scrollPercent);
});
```

```css
/* CSS 使用变量 */
.progress-bar {
    transform: scaleX(var(--scroll));
}
```

### 技巧 7：滚动驱动动画的 JS 增强

```javascript
// 当元素进入视口时触发动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
});

document.querySelectorAll('.scroll-animate').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});
```

### 技巧 8：批量写样式时用 requestAnimationFrame 合并刷新

```javascript
const queue = new Map();
let scheduled = false;

function batchStyle(el, styles) {
    queue.set(el, { ...(queue.get(el) || {}), ...styles });

    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
        queue.forEach((styleMap, node) => Object.assign(node.style, styleMap));
        queue.clear();
        scheduled = false;
    });
}

batchStyle(card, {
    transform: 'translateY(-8px)',
    opacity: '1'
});
```

> 当你在一次交互里连续改多个样式时，先收集再在下一帧统一写入，能减少布局抖动。

### 技巧 9：测量尺寸前后分离“读”和“写”

```javascript
const rect = panel.getBoundingClientRect(); // 先读
const nextHeight = `${rect.width * 0.75}px`;

requestAnimationFrame(() => {
    panel.style.height = nextHeight; // 再写
});
```

> 避免在同一段代码里反复“读布局 → 写样式 → 再读布局”，这样更不容易触发强制同步布局。

### 技巧 10：动态注入主题规则时优先用 constructable stylesheet

```javascript
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
    .theme-card {
        background: var(--card-bg, #fff);
        color: var(--card-text, #222);
    }
`);

document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
```

> 适合组件化场景，比频繁创建 `<style>` 标签更利于管理；但要注意旧环境兼容性。

> 💡 **总结**：
> - 单个属性用 `el.style.xxx`
> - 读取计算后值用 `getComputedStyle`
> - 主题/配色用 CSS 变量 `setProperty`
> - 状态切换用 `classList`
> - 复杂动画用 WAAPI
> - 性能敏感操作用 `requestAnimationFrame`
