# SVG滤镜完整使用指南 - 17种滤镜原语详解

## 概述

SVG滤镜是一套强大的图像处理工具，提供了17种滤镜原语（filter primitives）包括'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence'。每个滤镜原语都以"fe"为前缀，代表"filter effect"（滤镜效果）。

## 基础使用语法

```xml
<svg>
  <defs>
    <filter id="filterName">
      <feFilterPrimitive attributes="values" />
      <!-- 可以链接多个滤镜原语 -->
    </filter>
  </defs>
  
  <!-- 将滤镜应用到元素 -->
  <element filter="url(#filterName)" />
</svg>
```

---

## 1. feGaussianBlur - 高斯模糊

### 功能描述
feGaussianBlur SVG滤镜原语通过stdDeviation属性指定的数值对输入图像进行模糊处理，该属性定义了钟形曲线。

### 主要参数
- **stdDeviation**: 标准偏差值，控制模糊程度
    - 单个值：应用均匀模糊
    - 两个值：第一个为水平模糊，第二个为垂直模糊
- **in**: 输入源（SourceGraphic、SourceAlpha等）

### 使用场景
- 创建阴影效果
- 图像柔化处理
- 背景虚化
- 制作发光效果

### 代码示例
```xml
<!-- 基本模糊 -->
<filter id="blur">
  <feGaussianBlur stdDeviation="5" />
</filter>

<!-- 不对称模糊（水平20，垂直3） -->
<filter id="directionalBlur">
  <feGaussianBlur stdDeviation="20,3" />
</filter>
```

---

## 2. feColorMatrix - 颜色矩阵变换

### 功能描述
feColorMatrix SVG滤镜元素基于变换矩阵改变颜色。每个像素的颜色值[R,G,B,A]通过5x5颜色矩阵相乘来创建新颜色[R',G',B',A']。

### 主要参数
- **type**: 变换类型
    - `matrix`: 使用自定义5x5矩阵
    - `saturate`: 饱和度调整（0-1）
    - `hueRotate`: 色相旋转（角度值）
    - `luminanceToAlpha`: 亮度转透明度
- **values**: 矩阵值或参数值

### 使用场景
- 颜色调整和校正
- 创建单色效果
- 饱和度/对比度调整
- 色相变换
- 透明度处理

### 代码示例
```xml
<!-- 转换为灰度 -->
<filter id="grayscale">
  <feColorMatrix type="saturate" values="0"/>
</filter>

<!-- 色相旋转90度 -->
<filter id="hueShift">
  <feColorMatrix type="hueRotate" values="90"/>
</filter>

<!-- 自定义矩阵（增强红色通道） -->
<filter id="redBoost">
  <feColorMatrix type="matrix" 
    values="1.5 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 1 0"/>
</filter>
```

---

## 3. feOffset - 偏移滤镜

### 功能描述
feOffset滤镜原语接受输入并按照指定的数量偏移其位置。

### 主要参数
- **dx**: X轴偏移量
- **dy**: Y轴偏移量
- **in**: 输入源

### 使用场景
- 创建阴影效果
- 元素位置调整
- 多层叠加效果

### 代码示例
```xml
<!-- 创建简单阴影 -->
<filter id="shadow">
  <feOffset dx="3" dy="3" in="SourceAlpha"/>
  <feGaussianBlur stdDeviation="2"/>
  <feMerge>
    <feMergeNode/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

---

## 4. feFlood - 洪填充

### 功能描述
feFlood SVG滤镜原语用flood-color和flood-opacity定义的颜色和不透明度填充滤镜子区域。

### 主要参数
- **flood-color**: 填充颜色
- **flood-opacity**: 不透明度（0.0-1.0）

### 使用场景
- 创建纯色背景
- 颜色叠加效果
- 作为其他滤镜的颜色源

### 代码示例
```xml
<filter id="colorOverlay">
  <feFlood flood-color="#ff0000" flood-opacity="0.5"/>
  <feComposite in="SourceGraphic" operator="multiply"/>
</filter>
```

---

## 5. feMorphology - 形态学滤镜

### 功能描述
feMorphology SVG滤镜原语用于腐蚀或扩张输入图像。它的用处特别在于增粗或变细效果。

### 主要参数
- **operator**: 操作类型
    - `erode`: 腐蚀（变细）
    - `dilate`: 扩张（增粗）
- **radius**: 作用半径

### 使用场景
- 文字描边效果
- 形状增粗/变细
- 创建外轮廓
- 图像预处理

### 代码示例
```xml
<!-- 文字变粗 -->
<filter id="bold">
  <feMorphology operator="dilate" radius="1"/>
</filter>

<!-- 文字变细 -->
<filter id="thin">
  <feMorphology operator="erode" radius="0.5"/>
</filter>
```

---

## 6. feConvolveMatrix - 卷积矩阵

### 功能描述
feConvolveMatrix SVG滤镜原语应用矩阵卷积滤镜效果。卷积将输入图像中的像素与相邻像素结合产生结果图像。

### 主要参数
- **kernelMatrix**: 卷积核矩阵值
- **order**: 矩阵尺寸（默认3x3）
- **divisor**: 除数（默认为矩阵值之和）
- **bias**: 偏移值

### 使用场景
- 边缘检测
- 图像锐化
- 浮雕效果
- 模糊处理

### 代码示例
```xml
<!-- 浮雕效果 -->
<filter id="emboss">
  <feConvolveMatrix kernelMatrix="3 0 0 0 0 0 0 0 -3"/>
</filter>

<!-- 锐化 -->
<filter id="sharpen">
  <feConvolveMatrix kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"/>
</filter>
```

---

## 7. feTurbulence - 噪声生成

### 功能描述
feTurbulence SVG滤镜原语使用Perlin湍流函数创建图像。它允许合成人工纹理，如云朵或大理石。

### 主要参数
- **baseFrequency**: 基础频率
- **numOctaves**: 八度数（细节层次）
- **seed**: 随机种子
- **type**: 噪声类型
    - `turbulence`: 湍流噪声
    - `fractalNoise`: 分形噪声

### 使用场景
- 纹理生成
- 背景效果
- 位移映射源
- 艺术效果

### 代码示例
```xml
<!-- 大理石纹理 -->
<filter id="marble">
  <feTurbulence baseFrequency="0.1" numOctaves="4" type="fractalNoise"/>
  <feColorMatrix type="saturate" values="0"/>
</filter>

<!-- 云朵效果 -->
<filter id="clouds">
  <feTurbulence baseFrequency="0.025" numOctaves="3" type="turbulence"/>
</filter>
```

---

## 8. feDisplacementMap - 位移映射

### 功能描述
feDisplacementMap SVG滤镜原语使用来自in2的图像的像素值来在空间上置换来自in的图像。

### 主要参数
- **in**: 主输入图像
- **in2**: 位移映射图像
- **scale**: 位移缩放因子
- **xChannelSelector**: X轴通道选择器（R、G、B、A）
- **yChannelSelector**: Y轴通道选择器（R、G、B、A）

### 使用场景
- 图像扭曲效果
- 水波纹效果
- 玻璃折射效果
- 艺术变形

### 代码示例
```xml
<filter id="warp">
  <feTurbulence baseFrequency="0.05" numOctaves="2" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" 
                     xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

---

## 9. feComponentTransfer - 分量传输

### 功能描述
feComponentTransfer元素允许您修改每个像素中表示的每个RGBA分量。

### 主要参数
- 子元素：feFuncR、feFuncG、feFuncB、feFuncA
- **type**: 函数类型
    - `identity`: 恒等函数
    - `table`: 查找表
    - `discrete`: 离散函数
    - `linear`: 线性函数
    - `gamma`: 伽马函数

### 使用场景
- 颜色通道调整
- 对比度控制
- 色彩校正
- 特殊颜色效果

### 代码示例
```xml
<filter id="contrast">
  <feComponentTransfer>
    <feFuncR type="linear" slope="1.5" intercept="0"/>
    <feFuncG type="linear" slope="1.5" intercept="0"/>
    <feFuncB type="linear" slope="1.5" intercept="0"/>
  </feComponentTransfer>
</filter>
```

---

## 10. feComposite - 合成滤镜

### 功能描述
feComposite滤镜原语使用常用的图像软件混合模式对两个对象进行组合。

### 主要参数
- **operator**: 合成操作符
    - `over`: 叠加
    - `in`: 内部
    - `out`: 外部
    - `atop`: 顶部
    - `xor`: 异或
    - `arithmetic`: 算术运算
- **k1, k2, k3, k4**: 算术运算系数

### 使用场景
- 图层混合
- 遮罩效果
- 透明度合成
- 复杂合成效果

### 代码示例
```xml
<filter id="multiply">
  <feComposite in="SourceGraphic" in2="pattern" operator="multiply"/>
</filter>
```

---

## 11. feBlend - 混合滤镜

### 功能描述
feBlend滤镜原语使用常用的图像软件混合模式执行两个输入图像的像素级合并。

### 主要参数
- **mode**: 混合模式
    - `normal`: 正常
    - `multiply`: 正片叠底
    - `screen`: 滤色
    - `darken`: 变暗
    - `lighten`: 变亮

### 使用场景
- 颜色混合
- 光照效果
- 纹理叠加
- 艺术滤镜

### 代码示例
```xml
<filter id="screenBlend">
  <feBlend in="SourceGraphic" in2="background" mode="screen"/>
</filter>
```

---

## 12. feMerge - 合并滤镜

### 功能描述
feMerge SVG元素允许滤镜效果并发应用而不是按顺序应用。

### 主要参数
- 子元素：feMergeNode
    - **in**: 输入源引用

### 使用场景
- 多层叠加
- 阴影合成
- 复杂效果组合

### 代码示例
```xml
<filter id="dropShadow">
  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
  <feOffset dx="2" dy="2" result="offsetblur"/>
  <feMerge>
    <feMergeNode in="offsetblur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

---

## 13. feDiffuseLighting - 漫反射光照

### 功能描述
feDiffuseLighting SVG滤镜原语使用alpha通道作为凹凸贴图来照亮图像。

### 主要参数
- **surfaceScale**: 表面高度比例
- **diffuseConstant**: 漫反射常数
- **lighting-color**: 光源颜色
- 光源类型：feDistantLight、fePointLight、feSpotLight

### 使用场景
- 3D光照效果
- 表面纹理
- 立体感增强

### 代码示例
```xml
<filter id="lighting">
  <feDiffuseLighting surfaceScale="1" diffuseConstant="1" 
                     lighting-color="white">
    <fePointLight x="100" y="100" z="50"/>
  </feDiffuseLighting>
</filter>
```

---

## 14. feSpecularLighting - 镜面反射光照

### 功能描述
feSpecularLighting SVG滤镜原语使用alpha通道作为凹凸贴图来照亮源图形。

### 主要参数
- **surfaceScale**: 表面高度比例
- **specularConstant**: 镜面反射常数
- **specularExponent**: 镜面反射指数
- **lighting-color**: 光源颜色

### 使用场景
- 高光效果
- 金属质感
- 光泽表面
- 材质渲染

### 代码示例
```xml
<filter id="shiny">
  <feSpecularLighting surfaceScale="5" specularConstant="1" 
                      specularExponent="10" lighting-color="white">
    <fePointLight x="50" y="50" z="200"/>
  </feSpecularLighting>
  <feComposite in="SourceGraphic" operator="arithmetic" 
               k1="0" k2="1" k3="1" k4="0"/>
</filter>
```

---

## 15. feImage - 图像滤镜

### 功能描述
feImage允许将外部图像文件引入滤镜处理流中。

### 主要参数
- **href**: 图像URL引用
- **preserveAspectRatio**: 长宽比保持方式

### 使用场景
- 纹理映射
- 图案填充
- 背景合成
- 复杂合成效果

### 代码示例
```xml
<filter id="textureOverlay">
  <feImage href="texture.jpg" result="texture"/>
  <feBlend in="SourceGraphic" in2="texture" mode="multiply"/>
</filter>
```

---

## 16. feTile - 平铺滤镜

### 功能描述
feTile直接类似于pattern。它允许我们将重复的图像模式引入滤镜装置。

### 主要参数
- **in**: 输入源

### 使用场景
- 图案重复
- 背景平铺
- 纹理生成

### 代码示例
```xml
<filter id="tilePattern">
  <feTile in="smallPattern"/>
</filter>
```

---

## 17. feDropShadow - 阴影滤镜（CSS Filter）

### 功能描述
现代浏览器中的简化阴影滤镜。

### 主要参数
- **dx, dy**: 阴影偏移
- **stdDeviation**: 模糊程度
- **flood-color**: 阴影颜色

### 使用场景
- 快速阴影效果
- UI元素阴影

### 代码示例
```xml
<filter id="simpleShadow">
  <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="black"/>
</filter>
```

---

## 复合滤镜示例

### 复杂阴影效果
```xml
<filter id="complexShadow">
  <!-- 创建阴影 -->
  <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
  <feOffset in="blur" dx="4" dy="4" result="offsetBlur"/>
  
  <!-- 添加颜色 -->
  <feFlood flood-color="#000000" flood-opacity="0.3" result="shadowColor"/>
  <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadow"/>
  
  <!-- 合并图层 -->
  <feMerge>
    <feMergeNode in="shadow"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

### 水彩效果
```xml
<filter id="watercolor">
  <feTurbulence baseFrequency="0.1" numOctaves="3" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="8"/>
  <feGaussianBlur stdDeviation="1"/>
  <feColorMatrix type="saturate" values="1.2"/>
</filter>
```

## 性能优化建议

1. **合理使用滤镜链长度** - 避免过长的滤镜链
2. **设置合适的滤镜区域** - 使用x、y、width、height限制处理区域
3. **避免复杂的噪声生成** - feTurbulence可能影响性能
4. **使用result属性缓存中间结果** - 避免重复计算
5. **在移动设备上谨慎使用** - 某些滤镜在移动端性能较差

## 浏览器兼容性

- **现代浏览器**: 全面支持所有滤镜原语
- **WebKit (Safari)**: 大部分支持，某些复杂滤镜可能有限制
- **移动端**: 支持度良好，但性能需考虑
- **IE**: 需要Adobe ASV插件支持

## 总结

SVG滤镜系统提供了强大而灵活的图像处理能力，17种滤镜原语可以单独使用或组合使用来创建各种视觉效果。理解每个滤镜的特性和最佳应用场景，能够帮助开发者创建出令人印象深刻的视觉效果。