---
title: CSS 阴影与光效
date: 2025-04-29
tags:
  - CSS
  - 阴影
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 阴影与光效

[[toc]]

CSS 阴影和光效是创建视觉层次、深度感和氛围的核心工具。本文从基础 `box-shadow` 到复杂的 `drop-shadow()` 滤镜、内阴影组合、以及现代 CSS 的光照效果全面展开。

---

## 基础阴影

### box-shadow 语法

```css
box-shadow: offset-x offset-y blur-radius spread-radius color inset;
```

```css
/* 基础投影 */
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 多层阴影 */
.elevated {
  box-shadow:
    0 1px 3px rgba(0,0,0,0.12),
    0 1px 2px rgba(0,0,0,0.24);
}

/* 扩展阴影 */
.spread {
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.3);
}

/* 内阴影 */
.inset {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

/* 彩色阴影 */
.colored {
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}
```

### 阴影层级系统

```css
/* Material Design 风格层级 */
.z-1 { box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); }
.z-2 { box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); }
.z-3 { box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23); }
.z-4 { box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); }
.z-5 { box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22); }
```

---

## 文字阴影

### text-shadow

```css
/* 基础文字阴影 */
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

/* 多层文字阴影 - 3D 效果 */
.text-3d {
  text-shadow:
    1px 1px 0 #ccc,
    2px 2px 0 #c9c9c9,
    3px 3px 0 #bbb,
    4px 4px 0 #b9b9b9,
    5px 5px 0 #aaa,
    6px 6px 1px rgba(0,0,0,0.1);
}

/* 发光文字 */
.glow-text {
  text-shadow:
    0 0 10px #3498db,
    0 0 20px #3498db,
    0 0 30px #3498db;
}

/* 描边效果 */
.text-stroke {
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
```

---

## 滤镜阴影

### drop-shadow()

```css
/* 跟随透明形状 */
.icon {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

/* 与 box-shadow 的区别：跟随轮廓 */
.polygon {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
}

/* 多层滤镜阴影 */
.layered-shadow {
  filter:
    drop-shadow(0 2px 4px rgba(0,0,0,0.1))
    drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}
```

### 阴影与滤镜组合

```css
.enhanced {
  filter:
    brightness(1.1)
    contrast(1.1)
    drop-shadow(0 4px 12px rgba(0,0,0,0.2));
}
```

---

## 高级阴影技巧

### 柔和弥散阴影

```css
.soft-shadow {
  box-shadow:
    0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048),
    0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072),
    0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
}
```

### 彩色弥散光

```css
.color-glow {
  position: relative;
}

.color-glow::before {
  content: '';
  position: absolute;
  inset: -20px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  filter: blur(40px);
  opacity: 0.4;
  z-index: -1;
}
```

### 动态阴影方向

```css
.dynamic-shadow {
  --shadow-x: 0;
  --shadow-y: 8px;
  box-shadow: var(--shadow-x) var(--shadow-y) 16px rgba(0,0,0,0.2);
  transition: box-shadow 0.3s;
}

.dynamic-shadow:hover {
  --shadow-x: 0;
  --shadow-y: 16px;
  box-shadow: var(--shadow-x) var(--shadow-y) 32px rgba(0,0,0,0.3);
}
```

---

## 光效效果

### 径向渐变光晕

```css
.glow-halo {
  background: radial-gradient(
    circle at center,
    rgba(102, 126, 234, 0.4) 0%,
    transparent 70%
  );
}
```

### 扫描线光效

```css
.scan-line {
  position: relative;
  overflow: hidden;
}

.scan-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.4),
    transparent
  );
  animation: scan 2s linear infinite;
}

@keyframes scan {
  to { left: 100%; }
}
```

### 脉冲光效

```css
.pulse-glow {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(52, 152, 219, 0);
  }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| box-shadow | 10+ | 5.1+ | 4+ | 12+ |
| text-shadow | 2+ | 1.1+ | 3.5+ | 12+ |
| filter: drop-shadow() | 53+ | 9.1+ | 35+ | 79+ |
| CSS 变量阴影 | 49+ | 9.1+ | 31+ | 79+ |

---

## 奇淫技巧

### 技巧一：拟态凸起按钮

```css
.neumorphic-btn {
  background: #e0e5ec;
  border: none;
  border-radius: 16px;
  box-shadow:
    9px 9px 16px rgba(163,177,198,0.6),
    -9px -9px 16px rgba(255,255,255,0.5);
  transition: box-shadow 0.3s;
}

.neumorphic-btn:active {
  box-shadow:
    inset 9px 9px 16px rgba(163,177,198,0.6),
    inset -9px -9px 16px rgba(255,255,255,0.5);
}
```

### 技巧二：彩虹发光边框

```css
.rainbow-border {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 20px;
}

.rainbow-border::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 18px;
  background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  z-index: -1;
  filter: blur(8px);
  opacity: 0.8;
}
```

### 技巧三：长投影效果

```css
.long-shadow {
  text-shadow:
    1px 1px 0 #ccc,
    2px 2px 0 #c9c9c9,
    3px 3px 0 #bbb,
    4px 4px 0 #b9b9b9,
    5px 5px 0 #aaa,
    6px 6px 0 #a9a9a9,
    7px 7px 0 #999,
    8px 8px 0 #969696,
    9px 9px 0 #888,
    10px 10px 0 #868686,
    11px 11px 0 #777,
    12px 12px 0 #767676,
    13px 13px 0 #666,
    14px 14px 0 #646464,
    15px 15px 0 #555,
    16px 16px 0 #545454,
    17px 17px 0 #444,
    18px 18px 0 #424242,
    19px 19px 0 #333,
    20px 20px 0 #323232;
}
```

### 技巧四：悬浮倒影

```css
.reflection {
  position: relative;
}

.reflection::after {
  content: '';
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  transform: scaleY(-1);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  filter: blur(2px);
}
```

### 技巧五：环境光遮蔽

```css
.ambient-occlusion {
  box-shadow:
    0 1px 2px rgba(0,0,0,0.07),
    0 2px 4px rgba(0,0,0,0.07),
    0 4px 8px rgba(0,0,0,0.07),
    0 8px 16px rgba(0,0,0,0.07),
    0 16px 32px rgba(0,0,0,0.07),
    0 32px 64px rgba(0,0,0,0.07);
}
```

---

## 参考资料

- [MDN: box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)
- [MDN: text-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow)
- [MDN: filter: drop-shadow()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter-function/drop-shadow)
- [CSS-Tricks: A Complete Guide to CSS Shadow](https://css-tricks.com/almanac/properties/b/box-shadow/)
