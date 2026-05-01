---
title: GLSL 噪声函数与程序化生成
tags:
  - WebGL
  - GLSL
  - 噪声
  - 程序化生成
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# GLSL 噪声函数与程序化生成

[[toc]]

---

## 一、为什么需要噪声

真实世界没有完美的平滑表面。土地、岩石、云、水、木纹都有细节变化。在 GPU 上用噪声函数**实时生成**这些细节，比传输纹理图更省内存、更无缝、更可缩放。

---

## 二、伪随机数（PRNG）

GPU 没有真随机数。所有"随机"都是确定性的哈希函数。

```glsl
// 基础哈希
float hash(float n) { return fract(sin(n) * 43758.5453123); }
float hash(vec2 p)  { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hash(vec3 p)  { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }

// 更高质量的 2D 哈希
vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

// 3D 哈希
vec3 hash33(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453);
}
```

---

## 三、Value Noise

在网格点上采样随机值，然后线性/三次插值。最简单的噪声。

```glsl
float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);  // 三次 Hermite 插值

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
```

---

## 四、Perlin Noise

网格点上不是随机值，而是**随机梯度向量**。通过点与向量的点积插值，产生更自然的过渡。

```glsl
vec2 perlinGradient(vec2 p) {
    float angle = hash(p) * 6.283185;
    return vec2(cos(angle), sin(angle));
}

float perlinNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);  // quintic 插值

    vec2 g00 = perlinGradient(i + vec2(0, 0));
    vec2 g10 = perlinGradient(i + vec2(1, 0));
    vec2 g01 = perlinGradient(i + vec2(0, 1));
    vec2 g11 = perlinGradient(i + vec2(1, 1));

    float v00 = dot(g00, f - vec2(0, 0));
    float v10 = dot(g10, f - vec2(1, 0));
    float v01 = dot(g01, f - vec2(0, 1));
    float v11 = dot(g11, f - vec2(1, 1));

    return mix(mix(v00, v10, f.x), mix(v01, v11, f.x), f.y) * 0.5 + 0.5;
}
```

---

## 五、Simplex Noise

Perlin Noise 的改进版，使用**简单形**（三角形/四面体）网格替代正方形网格：
- 更少的网格点计算（2D 下 3 个点而非 4 个）
- 没有方向性偏移
- 更均匀的频谱

```glsl
// 2D Simplex Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
```

---

## 六、FBM（Fractal Brownian Motion）

将多层噪声叠加，每层频率加倍、幅度减半：

```glsl
float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}
```

### 应用示例：地形

```glsl
float terrain(vec2 p) {
    float h = fbm(p, 4) * 2.0;           // 大形
    h += fbm(p * 4.0, 3) * 0.5;          // 细节
    h += abs(fbm(p * 8.0, 2)) * 0.1;     // 峡谷感
    return h;
}
```

### 应用示例：云

```glsl
float cloudDensity(vec3 p) {
    float d = fbm(p.xz * 0.5 + uTime * 0.1, 5);
    d += fbm(p.xz * 1.0 + uTime * 0.2, 4) * 0.5;
    d = smoothstep(0.3, 0.7, d);  // 调整云的密度阈值
    return d * exp(-max(p.y - 2.0, 0.0) * 0.5);  // 高度衰减
}
```

---

## 七、Worley / Cellular Noise

仿生细胞结构，产生多边形/石头纹理效果。

```glsl
// 2D Worley Noise
float worley(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);

    float minDist = 1.0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = neighbor + hash22(n + neighbor);
            float dist = length(point - f);
            minDist = min(minDist, dist);
        }
    }
    return minDist;
}

// F2 - F1 差值产生缝隙纹理
float worleyF2F1(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float dists[9];
    int idx = 0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = neighbor + hash22(n + neighbor);
            dists[idx++] = length(point - f);
        }
    }
    // 简化：只取最近两个
    float f1 = 1.0, f2 = 1.0;
    for (int i = 0; i < 9; i++) {
        if (dists[i] < f1) { f2 = f1; f1 = dists[i]; }
        else if (dists[i] < f2) { f2 = dists[i]; }
    }
    return f2 - f1;
}
```

---

## 八、Domain Warping（领域扭曲）

用噪声去扭曲坐标，产生有机的、流体感的图案：

```glsl
// Inigo Quilez 的经典技法
float domainWarping(vec2 p) {
    vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0), 4),
        fbm(p + vec2(5.2, 1.3), 4)
    );
    vec2 r = vec2(
        fbm(p + 4.0 * q + vec2(1.7, 9.2), 4),
        fbm(p + 4.0 * q + vec2(8.3, 2.8), 4)
    );
    return fbm(p + 4.0 * r, 4);
}

// 效果：简单的 FBM 变成流动的、牛奶一样的纹理
```

---

## 九、完整示例：程序化火星地表

```glsl
precision highp float;
uniform float uTime;
uniform vec2 uResolution;

// === 噪声函数集合 ===
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float valueNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
}

float fbm(vec2 p, int octaves) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        v += a * valueNoise(p); p *= 2.0; a *= 0.5;
    }
    return v;
}

float crater(vec2 p, vec2 center, float radius) {
    float d = length(p - center);
    float rim = smoothstep(radius * 0.8, radius, d) * smoothstep(radius * 1.5, radius, d);
    float bowl = smoothstep(radius, 0.0, d) * 0.3;
    return rim - bowl;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 p = uv * 5.0;

    // 基础地形
    float h = fbm(p, 5) * 2.0;
    h += fbm(p * 3.0, 3) * 0.3;

    // 隗石坑
    h += crater(p, vec2(1.5, 2.3), 0.8);
    h += crater(p, vec2(3.8, 1.2), 1.2);
    h += crater(p, vec2(2.5, 4.1), 0.5) * 0.5;

    // 颜色映射
    vec3 rock1 = vec3(0.55, 0.27, 0.15);
    vec3 rock2 = vec3(0.35, 0.15, 0.08);
    vec3 dust = vec3(0.7, 0.5, 0.3);

    vec3 col = mix(rock2, rock1, smoothstep(-0.5, 1.0, h));
    col = mix(col, dust, smoothstep(1.5, 2.5, h));

    // 细节纹理
    float detail = fbm(p * 10.0, 3);
    col *= 0.9 + 0.1 * detail;

    gl_FragColor = vec4(col, 1.0);
}
```

---

## 十、奇淫技巧

### 10.1 静止图像噪声

```glsl
// 用图像作为噪声来源，比哈希更自然
uniform sampler2D uNoiseTexture;
float textureNoise(vec2 p) {
    return texture2D(uNoiseTexture, p).r;
}
```

### 10.2 蓝噪声截止

```glsl
// 因为 hash 是确定性的，可以偏移序列来模拟随机
float blueNoise(vec2 p, float frame) {
    return hash(p + frame * 73.0);
}
```

### 10.3 流体动画

```glsl
// 时间偏移产生流动感
float flowingNoise(vec2 p, float time) {
    return fbm(p + vec2(time * 0.1, time * 0.05), 4);
}
```

### 10.4 过渡区域的混合噪声

```glsl
// 在两种噪声之间混合
float blendedNoise(vec2 p, float blend) {
    float n1 = fbm(p, 4);
    float n2 = worley(p * 2.0);
    return mix(n1, n2, blend);
}
```

### 10.5 GPU 优化的噗哈希

```glsl
// PCG 哈希比 sin 哈希更快更均匀
uint pcg(uint v) {
    uint state = v * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}
// WebGL2 支持 uint，WebGL1 需模拟
```


### 6.1 噪声函数的导数估计

在 GPU 上用差分代替解析求导，数值方法比分析解更稳定，尤其是复杂噪声函数

---

## 相关阅读

- [体积渲染与大气效果](./体积渲染与大气效果.md) — 云朵密度计算中使用了 FBM 噪声
- [光线追踪与 SDF 渲染原理](./光线追踪与 SDF 渲染原理.md) — SDF 场景的程序化纹理也依赖噪声

---

## 在线示例

以下 ShaderToy 示例可以在浏览器中直接运行，建议结合本文章内容对照阅读：

- [Noise functions in 1, 2 and 3D](https://www.shadertoy.com/view/4dS3Wd) — 各维度噪声函数综合演示
- [Noise Gradients](https://www.shadertoy.com/view/XdXGW8) — 噪声梯度算法
- [Voronoi - basic](https://www.shadertoy.com/view/ldl3W8) — 基础 Voronoi 实现
- [Fractal Brownian Motion](https://www.shadertoy.com/view/lsl3RH) — FBM 与纹理演示

---

## 参考资料

- [The Book of Shaders - Noise](https://thebookofshaders.com/11/)
- [Inigo Quilez - Noise](https://iquilezles.org/articles/)
- [Stefan Gustavson - Simplex Noise](https://weber.itn.liu.se/~stegu/simplexnoise/)
- [GPU Gems - Procedural Textures](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-5-implementing-improved-perlin-noise)
