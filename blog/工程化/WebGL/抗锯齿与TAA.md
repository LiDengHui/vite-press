---
title: 抗锯齿与TAA
tags:
  - WebGL
  - GLSL
  - 抗锯齿
  - TAA
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# 抗锯齿与TAA

[[toc]]

---

## 一、为什么需要抗锯齿

光栅化把几何图元离散成像素，边缘会产生**锯齿**（Aliasing）。本质原因是采样频率低于信号频率（奈奎斯特定理）。

```
理想边缘:    ____
            |
光栅化:     ■■__
            |■■
```

---

## 二、MSAA（多重采样抗锯齿）

### 2.1 原理

每个像素采样多个子像素，然后平均。

```js
// Three.js 开启 MSAA
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
```

**优点：** 硬件原生支持，效果最好
**缺点：** 内存消耗大（4x MSAA = 4倍颜色缓冲），与延迟渲染不兼容

---

## 三、FXAA（快速近似抗锯齿）

### 3.1 原理

纯后处理：检测边缘对比度，在边缘处模糊。

```glsl
// 简化版 FXAA
uniform sampler2D uTexture;
uniform vec2 uResolution;

vec3 fxaa(sampler2D tex, vec2 uv) {
    vec2 texel = 1.0 / uResolution;

    vec3 n  = texture2D(tex, uv + vec2(0,  texel.y)).rgb;
    vec3 s  = texture2D(tex, uv + vec2(0, -texel.y)).rgb;
    vec3 e  = texture2D(tex, uv + vec2( texel.x, 0)).rgb;
    vec3 w  = texture2D(tex, uv + vec2(-texel.x, 0)).rgb;
    vec3 c  = texture2D(tex, uv).rgb;

    float lumaC = dot(c, vec3(0.299, 0.587, 0.114));
    float lumaN = dot(n, vec3(0.299, 0.587, 0.114));
    float lumaS = dot(s, vec3(0.299, 0.587, 0.114));
    float lumaE = dot(e, vec3(0.299, 0.587, 0.114));
    float lumaW = dot(w, vec3(0.299, 0.587, 0.114));

    float maxLuma = max(max(lumaN, lumaS), max(lumaE, lumaW));
    float minLuma = min(min(lumaN, lumaS), min(lumaE, lumaW));
    float range = maxLuma - minLuma;

    if (range < max(0.0312, lumaC * 0.063)) return c;  // 不是边缘

    // 沿边缘方向混合
    vec3 blurNS = (n + s) * 0.5;
    vec3 blurEW = (e + w) * 0.5;

    float gradientNS = abs(lumaN - lumaS);
    float gradientEW = abs(lumaE - lumaW);

    return (gradientNS > gradientEW) ? blurNS : blurEW;
}
```

**优点：** 速度快，无额外内存
**缺点：** 可能模糊纹理细节

---

## 四、SMAA（子像素形态学抗锯齿）

比 FXAA 更智能，检测边缘方向并沿边缘方向滤波：

```js
// 使用 SMAA 库
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
composer.addPass(smaaPass);
```

---

## 五、TAA（时间性抗锯齿）

### 5.1 核心思想

用**时间**换**空间**：每帧对投影矩阵做微小偏移（Jitter），然后把当前帧与历史帧混合。

```
帧1: 采样位置 + (-0.25, -0.25)
帧2: 采样位置 + ( 0.25, -0.25)
帧3: 采样位置 + (-0.25,  0.25)
帧4: 采样位置 + ( 0.25,  0.25)
```

### 5.2 投影矩阵 Jitter

```js
// Halton 序列生成 Jitter 偏移
function halton(index, base) {
    let result = 0;
    let f = 1 / base;
    let i = index;
    while (i > 0) {
        result += f * (i % base);
        i = Math.floor(i / base);
        f /= base;
    }
    return result;
}

// 每帧更新
const jitterX = (halton(frameIndex % 16, 2) - 0.5) / width;
const jitterY = (halton(frameIndex % 16, 3) - 0.5) / height;
camera.projectionMatrix.elements[8] += jitterX * 2;
camera.projectionMatrix.elements[9] += jitterY * 2;
```

### 5.3 GLSL 实现

```glsl
uniform sampler2D uCurrentFrame;
uniform sampler2D uHistoryFrame;
uniform sampler2D uVelocityBuffer;
uniform vec2 uResolution;

vec3 taa() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // 1. 读取当前帧
    vec3 current = texture2D(uCurrentFrame, uv).rgb;

    // 2. 用速度缓冲找到历史像素位置
    vec2 velocity = texture2D(uVelocityBuffer, uv).rg;
    vec2 historyUV = uv - velocity;

    // 3. 读取历史帧
    vec3 history = texture2D(uHistoryFrame, historyUV).rgb;

    // 4. 颜色裁剪（Clipping）- 防止重影
    vec3 minColor = current, maxColor = current;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec3 neighbor = texture2D(uCurrentFrame, uv + vec2(x, y) / uResolution).rgb;
            minColor = min(minColor, neighbor);
            maxColor = max(maxColor, neighbor);
        }
    }
    history = clamp(history, minColor, maxColor);

    // 5. 混合
    float blend = 0.1;  // 历史权重
    if (historyUV.x < 0.0 || historyUV.x > 1.0 || historyUV.y < 0.0 || historyUV.y > 1.0) {
        blend = 0.0;  // 超出屏幕，不信任历史
    }

    return mix(current, history, blend);
}
```

### 5.4 速度缓冲（Velocity Buffer）

```glsl
// 顶点着色器
varying vec4 vCurrentPos;
varying vec4 vPrevPos;

void main() {
    vCurrentPos = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vPrevPos = uPrevProjectionMatrix * uPrevViewMatrix * uPrevModelMatrix * vec4(position, 1.0);
    gl_Position = vCurrentPos;
}

// 片段着色器
vec2 velocity = ((vCurrentPos.xy / vCurrentPos.w) - (vPrevPos.xy / vPrevPos.w)) * 0.5;
gl_FragColor = vec4(velocity, 0.0, 1.0);
```

---

## 六、DLSS / FSR 思想

虽然没有 WebGL 原生实现，但思路值得了解：
- **DLSS**：低分辨率渲染 + AI 上采样
- **FSR**：空间上采样 + 锐化，无需 AI

```glsl
// 简化的 FSR-like 锐化
vec3 sharpen(sampler2D tex, vec2 uv, vec2 texelSize, float amount) {
    vec3 center = texture2D(tex, uv).rgb;
    vec3 avg = (
        texture2D(tex, uv + vec2(-texelSize.x, 0)).rgb +
        texture2D(tex, uv + vec2( texelSize.x, 0)).rgb +
        texture2D(tex, uv + vec2(0, -texelSize.y)).rgb +
        texture2D(tex, uv + vec2(0,  texelSize.y)).rgb
    ) * 0.25;

    return center + (center - avg) * amount;
}
```

---

## 七、完整对比

| 技术 | 质量 | 性能 | 内存 | 运动场景 | 实现复杂度 |
|------|------|------|------|----------|-----------|
| MSAA | ⭐⭐⭐ | 中 | 高 | ✅ | 低 |
| FXAA | ⭐ | 极快 | 无 | ✅ | 低 |
| SMAA | ⭐⭐ | 快 | 无 | ✅ | 中 |
| TAA | ⭐⭐⭐ | 中 | 中 | 需处理 | 高 |
| DLSS/FSR | ⭐⭐⭐ | 快 | 低 | ✅ | 极高 |

---

## 八、奇淫技巧

### 8.1 自适应抗锯齿

```glsl
// 根据运动速度选择抗锯齿强度
float motion = length(velocity);
if (motion < 0.001) {
    // 静态场景：高历史混合
    blend = 0.95;
} else if (motion > 0.1) {
    // 快速运动：减少历史依赖
    blend = 0.05;
}
```

### 8.2 抖动序列对比

```glsl
// Halton 比随机或网格分布更均匀
// 2x MSAA 的采样点可用于 TAA jitter
const vec2 halton[8] = vec2[](
    vec2(1.0/2.0, 1.0/3.0),
    vec2(1.0/4.0, 2.0/3.0),
    // ...
);
```

### 8.3 用深度检测遮挡变化

```glsl
// 如果深度变化太大，历史像素不可信
float currentDepth = texture2D(uDepth, uv).r;
float historyDepth = texture2D(uPrevDepth, historyUV).r;
if (abs(currentDepth - historyDepth) > 0.1) {
    blend = 0.0;  // 不信任历史
}
```


### 4.1 动态物体检测优化

使用运动矢量或深度差分检测动态区域，只在动态区域启用 TAA，静态区域保持锁定

### 5.1 历史帧质量控制

用马赛克距离检测历史帧的质量，差异过大时降低混合权重，避免重影

---

## 相关阅读

- [帧缓冲与后处理管线](./帧缓冲与后处理管线.md) — TAA 通常作为后处处理管线的最终 pass
- [GPU 性能优化与着色器调试](./GPU 性能优化与着色器调试.md) — TAA 对性能的影响分析

---

## 在线示例

以下 ShaderToy 示例可以在浏览器中直接运行，建议结合本文章内容对照阅读：

- [Anti-aliased Lines](https://www.shadertoy.com/view/MlMfzj) — MSAA 线条演示
- [TAA Playground](https://www.shadertoy.com/view/WslBDf) — TAA 实现参考
- [FXAA](https://www.shadertoy.com/view/Xdf3Rf) — FXAA 算法演示

---

## 参考资料

- [TAA: A Survey (NVIDIA)](https://developer.nvidia.com/gameworks/graphicssamples/d3d_samples/taa-sample)
- [Anti-Aliasing Methods Comparison](https://www.asawicki.info/articles/AA-1.php)
- [DLSS Technology](https://www.nvidia.com/en-us/geforce/technologies/dlss/)
