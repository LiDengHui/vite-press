---
title: CSS Houdini 魔法
date: 2025-04-29
tags:
  - CSS
  - Houdini
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS Houdini 魔法

[[toc]]

CSS Houdini 是一组底层 API，允许开发者直接访问 CSS 引擎，创建自定义属性、自定义绘图和自定义布局。本文介绍 Houdini 的核心 API 和实际应用。

---

## CSS Properties and Values API

### 注册自定义属性

```css
@property --gradient-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@property --gradient-color-1 {
  syntax: '<color>';
  initial-value: #667eea;
  inherits: false;
}
```

### 使用自定义属性

```css
.gradient-border {
  --gradient-angle: 0deg;
  background: linear-gradient(var(--gradient-angle), var(--gradient-color-1), #764ba2);
  animation: rotate-gradient 3s linear infinite;
}

@keyframes rotate-gradient {
  to {
    --gradient-angle: 360deg;
  }
}
```

### JavaScript 注册

```javascript
CSS.registerProperty({
  name: '--primary-color',
  syntax: '<color>',
  initialValue: '#3498db',
  inherits: true
});

CSS.registerProperty({
  name: '--spacing',
  syntax: '<length> | <percentage>',
  initialValue: '0px',
  inherits: false
});
```

---

## CSS Paint API

### 基本工作流程

```javascript
// paint-worklet.js
class CheckerboardPainter {
  static get inputProperties() {
    return ['--checkerboard-size', '--checkerboard-color'];
  }

  paint(ctx, geom, properties) {
    const size = parseInt(properties.get('--checkerboard-size')) || 20;
    const color = properties.get('--checkerboard-color').toString() || '#ccc';
    
    for (let y = 0; y < geom.height; y += size) {
      for (let x = 0; x < geom.width; x += size) {
        if ((x / size + y / size) % 2 === 0) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, size, size);
        }
      }
    }
  }
}

registerPaint('checkerboard', CheckerboardPainter);
```

```css
.checkerboard {
  --checkerboard-size: 20;
  --checkerboard-color: #e0e0e0;
  background-image: paint(checkerboard);
}
```

```javascript
// 注册 Worklet
if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule('paint-worklet.js');
}
```

### 动态背景

```javascript
// animated-bg.js
class AnimatedBackground {
  static get inputProperties() {
    return ['--time'];
  }

  paint(ctx, geom, properties) {
    const time = parseFloat(properties.get('--time')) || 0;
    
    for (let i = 0; i < 5; i++) {
      const x = geom.width / 2 + Math.sin(time + i) * 100;
      const y = geom.height / 2 + Math.cos(time + i * 1.5) * 50;
      
      ctx.beginPath();
      ctx.arc(x, y, 30 + i * 10, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(time * 50 + i * 60) % 360}, 70%, 60%, 0.3)`;
      ctx.fill();
    }
  }
}

registerPaint('animated-bg', AnimatedBackground);
```

```css
.animated-section {
  --time: 0;
  background-image: paint(animated-bg);
  animation: time-tick 1s linear infinite;
}

@keyframes time-tick {
  from { --time: 0; }
  to { --time: 6.28; }
}
```

---

## CSS Typed OM

### 类型化操作

```javascript
// 传统方式
el.style.width = '100px';

// Typed OM 方式
el.attributeStyleMap.set('width', CSS.px(100));
el.attributeStyleMap.set('opacity', CSS.number(0.5));
el.attributeStyleMap.set('transform', new CSSTranslate(CSS.px(10), CSS.px(20)));
```

### 读取计算样式

```javascript
const styleMap = el.computedStyleMap();
const width = styleMap.get('width');  // CSSUnitValue {value: 100, unit: 'px'}
const color = styleMap.get('color');  // CSSRGB {r: 0, g: 0, b: 0, alpha: 1}
```

### 数值运算

```javascript
const width = CSS.px(100);
const doubled = width.mul(2);  // CSSUnitValue {value: 200, unit: 'px'}
const halved = width.div(2);   // CSSUnitValue {value: 50, unit: 'px'}
```

---

## CSS Layout API

### 自定义布局

```javascript
// layout-worklet.js
class MasonryLayout {
  static get inputProperties() {
    return ['--masonry-gap', '--masonry-columns'];
  }

  async layout(children, edges, constraints, styleMap) {
    const gap = parseInt(styleMap.get('--masonry-gap')) || 10;
    const columns = parseInt(styleMap.get('--masonry-columns')) || 3;
    
    const columnWidths = (constraints.fixedInlineSize - gap * (columns - 1)) / columns;
    const columnHeights = new Array(columns).fill(0);
    
    const childFragments = await Promise.all(
      children.map(child => child.layoutNextFragment({
        fixedInlineSize: columnWidths
      }))
    );
    
    childFragments.forEach(fragment => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      
      fragment.inlineOffset = shortestColumn * (columnWidths + gap);
      fragment.blockOffset = columnHeights[shortestColumn];
      
      columnHeights[shortestColumn] += fragment.blockSize + gap;
    });
    
    return {
      autoBlockSize: Math.max(...columnHeights)
    };
  }
}

registerLayout('masonry', MasonryLayout);
```

```css
.masonry-container {
  display: layout(masonry);
  --masonry-gap: 16;
  --masonry-columns: 3;
}
```

---

## CSS Animation Worklet

### 自定义动画

```javascript
// animation-worklet.js
registerAnimator('parallax', class {
  animate(currentTime, effect) {
    const scrollPos = currentTime;
    effect.localTime = scrollPos * 0.5;  // 减速滚动
  }
});
```

```javascript
// 使用
const parallax = new WorkletAnimation(
  'parallax',
  new KeyframeEffect(
    element,
    [{ transform: 'translateY(0)' }, { transform: 'translateY(-100px)' }],
    { duration: 1000 }
  ),
  document.timeline,
  { scrollSource: document.scrollingElement }
);

parallax.play();
```

---

## 浏览器兼容性

| API | Chrome | Safari | Firefox | Edge |
|-----|--------|--------|---------|------|
| Properties & Values | 78+ | 16.4+ | 128+ | 79+ |
| Paint API | 65+ | 不支持 | 不支持 | 79+ |
| Typed OM | 66+ | 16.4+ | 不支持 | 79+ |
| Layout API | 85+ (flag) | 不支持 | 不支持 | 85+ (flag) |
| Animation Worklet | 71+ (flag) | 不支持 | 不支持 | 79+ (flag) |

---

## 奇淫技巧

### 技巧一：自定义提示线

```javascript
// tooltip-arrow.js
class TooltipArrow {
  static get inputProperties() {
    return ['--tooltip-direction', '--tooltip-color'];
  }

  paint(ctx, geom, properties) {
    const dir = properties.get('--tooltip-direction').toString() || 'top';
    const color = properties.get('--tooltip-color').toString() || '#333';
    const size = 8;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    
    switch(dir) {
      case 'top':
        ctx.moveTo(geom.width / 2 - size, 0);
        ctx.lineTo(geom.width / 2 + size, 0);
        ctx.lineTo(geom.width / 2, size);
        break;
      case 'bottom':
        ctx.moveTo(geom.width / 2 - size, geom.height);
        ctx.lineTo(geom.width / 2 + size, geom.height);
        ctx.lineTo(geom.width / 2, geom.height - size);
        break;
    }
    
    ctx.closePath();
    ctx.fill();
  }
}

registerPaint('tooltip-arrow', TooltipArrow);
```

```css
.tooltip::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 8px;
  background: paint(tooltip-arrow);
  --tooltip-direction: top;
  --tooltip-color: #333;
}
```

### 技巧二：动态渐变边框

```javascript
// gradient-border.js
class GradientBorder {
  static get inputProperties() {
    return ['--border-angle'];
  }

  paint(ctx, geom, properties) {
    const angle = parseFloat(properties.get('--border-angle')) || 0;
    
    const gradient = ctx.createConicGradient(
      angle * Math.PI / 180,
      geom.width / 2,
      geom.height / 2
    );
    
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.33, '#4ecdc4');
    gradient.addColorStop(0.66, '#45b7d1');
    gradient.addColorStop(1, '#ff6b6b');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, geom.width - 4, geom.height - 4);
  }
}

registerPaint('gradient-border', GradientBorder);
```

```css
.card {
  --border-angle: 0;
  background: paint(gradient-border);
  animation: rotate-border 3s linear infinite;
}

@keyframes rotate-border {
  to { --border-angle: 360; }
}
```

### 技巧三：动态点阵

```javascript
// dots-pattern.js
class DotsPattern {
  static get inputProperties() {
    return ['--dots-size', '--dots-gap', '--dots-color'];
  }

  paint(ctx, geom, properties) {
    const size = parseInt(properties.get('--dots-size')) || 4;
    const gap = parseInt(properties.get('--dots-gap')) || 20;
    const color = properties.get('--dots-color').toString() || '#ccc';
    
    ctx.fillStyle = color;
    
    for (let y = 0; y < geom.height; y += gap) {
      for (let x = 0; x < geom.width; x += gap) {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

registerPaint('dots', DotsPattern);
```

```css
.dotted-bg {
  --dots-size: 3;
  --dots-gap: 24;
  --dots-color: #e0e0e0;
  background-image: paint(dots);
}
```

### 技巧四：纹理填充

```javascript
// noise-texture.js
class NoiseTexture {
  static get inputProperties() {
    return ['--noise-opacity'];
  }

  paint(ctx, geom, properties) {
    const opacity = parseFloat(properties.get('--noise-opacity')) || 0.1;
    const imageData = ctx.createImageData(geom.width, geom.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;     // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = opacity * 255; // A
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
}

registerPaint('noise', NoiseTexture);
```

```css
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: paint(noise);
  --noise-opacity: 0.05;
  pointer-events: none;
}
```

### 技巧五：Typed OM 实时动画

```javascript
// 使用 Typed OM 创建平滑动画
const element = document.querySelector('.animated');
const transform = new CSSTranslate(CSS.px(0), CSS.px(0));

element.attributeStyleMap.set('transform', transform);

function animate() {
  const time = performance.now() / 1000;
  const x = Math.sin(time) * 100;
  const y = Math.cos(time) * 50;
  
  transform.x = CSS.px(x);
  transform.y = CSS.px(y);
  
  requestAnimationFrame(animate);
}

animate();
```

---

## 参考资料

- [MDN Houdini APIs](https://developer.mozilla.org/en-US/docs/Web/Guide/Houdini)
- [CSS Houdini](https://houdini.how/)
- [Google Developers: Houdini](https://developers.google.com/web/updates/2016/05/houdini)
- [Is Houdini ready yet?](https://ishoudinireadyyet.com/)
