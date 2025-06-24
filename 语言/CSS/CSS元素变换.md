# CSS3 元素变换详解

CSS3 变换（Transforms）模块允许我们对元素进行**旋转、缩放、倾斜和平移**等操作，为现代网页设计提供了强大的视觉效果能力。

[[TOC]]


# 2D 变换
2D 变换在二维平面内操作元素，包含以下基本操作：

## 平移（Translate）
```css
transform: translateX(50px); /* 水平移动 */
transform: translateY(-20px); /* 垂直移动 */
transform: translate(30px, 40px); /* 同时移动 */
```

## 旋转（Rotate）
```css
transform: rotate(45deg); /* 顺时针旋转45度 */
transform: rotate(-90deg); /* 逆时针旋转90度 */
```

## 缩放（Scale）
```css
transform: scale(1.5); /* 等比例放大1.5倍 */
transform: scaleX(2); /* 水平放大2倍 */
transform: scaleY(0.5); /* 垂直缩小一半 */
transform: scale(2, 0.5); /* 水平2倍，垂直0.5倍 */
```

## 倾斜（Skew）
```css
transform: skewX(20deg); /* 水平倾斜20度 */
transform: skewY(15deg); /* 垂直倾斜15度 */
transform: skew(20deg, 15deg); /* 组合倾斜 */
```

---

## 3D 变换
3D 变换在三维空间中操作元素，需要设置透视（perspective）才能看到效果。

## 基本 3D 操作
```css
/* 父容器设置透视 */
.container {
  perspective: 800px;
}

/* 子元素应用3D变换 */
.element {
  transform: rotateX(45deg); /* 绕X轴旋转 */
  transform: rotateY(30deg); /* 绕Y轴旋转 */
  transform: rotateZ(15deg); /* 绕Z轴旋转 */
  transform: translateZ(100px); /* Z轴移动 */
  transform: scale3d(1.2, 1, 0.8); /* 三维缩放 */
}
```

## 透视控制
```css
perspective: 500px; /* 透视距离，值越小透视效果越强 */
perspective-origin: top left; /* 观察者位置 */
```

## 变换样式
```css
transform-style: preserve-3d; /* 保留子元素的3D位置 */
```


## 变换原点
`transform-origin` 属性控制变换的基准点（原点）：

```css
/* 语法 */
transform-origin: x-axis y-axis z-axis;

/* 示例 */
transform-origin: center center; /* 默认值（中心点） */
transform-origin: left top; /* 左上角 */
transform-origin: 30px 60px; /* 具体坐标 */
transform-origin: center center -100px; /* 3D原点调整 */
```

## 原点调整效果
| 原点位置 | 旋转效果   | 缩放效果     |
|------|--------|----------|
| 中心点  | 原地旋转   | 从中心缩放    |
| 左上角  | 类似门轴旋转 | 从左上角缩放   |
| 右下角  | 类似关门效果 | 从右下角缩放   |
| Z轴负值 | 绕背后点旋转 | 创建深度缩放效果 |

---

## 多重变换
可以组合多个变换效果，按从左到右的顺序执行：

```css
/* 先平移再旋转 */
transform: translateX(100px) rotate(45deg);

/* 先旋转再平移（效果不同） */
transform: rotate(45deg) translateX(100px);

/* 复杂3D变换 */
transform: 
  perspective(1000px)
  rotateY(30deg)
  translateZ(50px)
  scale(1.2);
```



## 2D 变换函数
| 函数 | 描述 | 示例 |
|------|------|------|
| `translate()` | 移动元素 | `translate(20px, 30px)` |
| `rotate()` | 旋转元素 | `rotate(45deg)` |
| `scale()` | 缩放元素 | `scale(1.5, 0.8)` |
| `skew()` | 倾斜元素 | `skew(20deg, 10deg)` |
| `matrix()` | 矩阵变换 | `matrix(a, b, c, d, tx, ty)` |

## 3D 变换函数
| 函数 | 描述 | 示例 |
|------|------|------|
| `translate3d()` | 三维移动 | `translate3d(20px, 30px, 50px)` |
| `rotate3d()` | 三维旋转 | `rotate3d(1, 1, 0, 45deg)` |
| `scale3d()` | 三维缩放 | `scale3d(1.2, 1, 0.8)` |
| `matrix3d()` | 3D矩阵变换 | `matrix3d(...)` |
| `perspective()` | 设置透视 | `perspective(1000px)` |


## 性能与最佳实践

1. **硬件加速**：
   ```css
   /* 触发GPU加速 */
   transform: translateZ(0);
   will-change: transform;
   ```

2. **动画优化**：
    - 优先使用 `transform` 和 `opacity` 制作动画
    - 避免在动画中改变布局属性（如width/height）

3. **变换顺序**：
    - 变换顺序影响最终效果（矩阵乘法不满足交换律）
    - 推荐顺序：缩放 → 旋转 → 平移

4. **浏览器前缀**：
   ```css
   /* 兼容旧版浏览器 */
   -webkit-transform: rotate(30deg);
   -moz-transform: rotate(30deg);
   transform: rotate(30deg);
   ```

5. **响应式设计**：
   ```css
   /* 根据屏幕大小调整变换效果 */
   @media (max-width: 768px) {
     .element {
       transform: scale(0.8);
     }
   }
   ```

> **注意**：复杂的3D变换可能影响性能，尤其在移动设备上。建议在可能的情况下使用 `transform-style: preserve-3d` 优化3D渲染。

CSS3变换为现代网页提供了强大的视觉表达能力，合理使用可以创建引人入胜的用户体验，同时保持性能优化。
