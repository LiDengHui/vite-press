# SVG基础语法

SVG（Scalable Vector Graphics）是一种基于 XML 的**矢量图形格式**，可在任何分辨率下无损缩放，适用于图标、图表、动画等场景。

[[toc]]

---

## 一、基础语法结构
```svg
<svg xmlns="http://www.w3.org/2000/svg" 
     width="200" 
     height="200" 
     viewBox="0 0 100 100">
  <!-- 图形元素 -->
</svg>
```
- **xmlns**：XML 命名空间（必须声明）
- **width/height**：画布尺寸（支持 `px`, `%`, `em`）
- **viewBox**：定义坐标系 `(minX, minY, width, height)`

---

## 二、常用图形元素
1. **矩形** `<rect>`
   ```svg
   <rect x="10" y="10" width="80" height="40" 
         fill="#3498db" stroke="#2c3e50" stroke-width="2" rx="5"/>
   ```
    - `x,y`：左上角坐标
    - `rx/ry`：圆角半径

2. **圆形** `<circle>`
   ```svg
   <circle cx="50" cy="50" r="40" fill="#e74c3c" />
   ```

3. **直线** `<line>`
   ```svg
   <line x1="10" y1="10" x2="90" y2="90" stroke="#27ae60" stroke-width="3"/>
   ```

4. **路径** `<path>`（最灵活）
   ```svg
   <path d="M10 80 Q 50 10, 90 80 T 150 80" 
         fill="none" stroke="#9b59b6" stroke-width="2"/>
   ```
    - **路径命令**：
        - `M x y`：移动到 (MoveTo)
        - `L x y`：画线 (LineTo)
        - `Q x1 y1, x y`：二次贝塞尔曲线
        - `Z`：闭合路径

5. **文本** `<text>`
   ```svg
   <text x="50" y="50" font-family="Arial" font-size="12" text-anchor="middle" fill="#333">
     Hello SVG!
   </text>
   ```

---

## 三、样式与属性
| 属性             | 说明         | 示例值                |
|----------------|------------|--------------------|
| `fill`         | 填充颜色       | `red`, `#ff0000`   |
| `stroke`       | 描边颜色       | `blue`, `none`     |
| `stroke-width` | 描边宽度       | `2`                |
| `opacity`      | 透明度 (0-1)  | `0.5`              |
| `transform`    | 变换（旋转/缩放等） | `rotate(45 50 50)` |

---

## 四、分组与复用
1. **分组** `<g>`
   ```svg
   <g fill="purple" transform="translate(0,20)">
     <circle cx="30" cy="30" r="20"/>
     <rect x="60" y="10" width="40" height="40"/>
   </g>
   ```

2. **复用元素** `<defs>` + `<use>`
   ```svg
   <defs>
     <circle id="myCircle" cx="0" cy="0" r="10" />
   </defs>
   <use href="#myCircle" x="50" y="50" fill="gold"/>
   ```

---

## 五、嵌入HTML的三种方式
1. **直接内联**
   ```html
   <body>
     <svg width="100" height="100">...</svg>
   </body>
   ```

2. **通过`<img>`标签**
   ```html
   <img src="image.svg" alt="SVG Image">
   ```

3. **作为CSS背景**
   ```css
   .icon {
     background: url('icon.svg') no-repeat;
   }
   ```

---

## 六、动画示例（SMIL）
```svg
<circle cx="50" cy="50" r="10" fill="orange">
  <animate attributeName="r" from="10" to="40" dur="1s" repeatCount="indefinite"/>
</circle>
```
> **注意**：SMIL 动画在新浏览器中逐渐被 CSS 动画替代。

---

## 七、最佳实践
1. **优化工具**：使用 [SVGO](https://github.com/svg/svgo) 压缩文件
2. **响应式设计**：
   ```css
   svg {
     max-width: 100%;
     height: auto;
   }
   ```
3. **可访问性**：
   ```svg
   <title>Blue Rectangle</title>
   <desc>A rectangle with rounded corners</desc>
   ```


## 八、浏览器支持
- 所有现代浏览器（Chrome/Firefox/Safari/Edge）
- IE9+（部分高级特性不支持）

> [查看完整支持表](https://caniuse.com/svg)

## 九、SVG 滤镜的使用
SVG 滤镜（Filter）是一种用于修改 SVG 元素外观的强大工具。它们可以实现模糊、颜色调整、阴影等效果，使 SVG 图形更加生动和有趣。

[svg-filters 滤镜示例](https://yoksel.github.io/svg-filters/)


```html

```

```css

```

掌握 SVG 可创建分辨率无关的图形，结合 CSS/JavaScript 可实现交互式数据可视化与复杂动画。
