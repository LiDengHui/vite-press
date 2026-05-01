---
title: 光线追踪与 SDF 渲染原理
tags:
  - WebGL
  - GLSL
  - 光线追踪
  - SDF
  - Ray Marching
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# 光线追踪与 SDF 渲染原理

[[toc]]

---

## 一、渲染方法对比

| 方法 | 原理 | 速度 | 反射/折射 | 软阴影 | 全局光照 |
|------|------|------|-----------|--------|----------|
| **光栅化** | 顶点投影到屏幕 | 极快（GPU 原生） | 需 trick | 需 shadow map | 烘焙/SSAO |
| **Ray Tracing** | 追踪单条光线 | 慢 | 天然支持 | 需区域光 | 需 Path Tracing |
| **Ray Marching** | 沿光线步进 | 中等 | 支持 | 天然软阴影 | 支持 |
| **Path Tracing** | 蒙特卡洛采样 | 极慢 | 完美 | 完美 | 天然支持 |

---

## 二、Ray Marching 核心原理

### 2.1 距离场（Signed Distance Field, SDF）

SDF 是一个函数 `f(p)`，返回点 `p` 到**最近表面**的有向距离：
- `f(p) > 0`：点在物体外部
- `f(p) = 0`：点在表面上
- `f(p) < 0`：点在物体内部

```glsl
// 基础 SDF 图元
float sdSphere(vec3 p, float r)      { return length(p) - r; }
float sdBox(vec3 p, vec3 b)          { vec3 q = abs(p) - b; return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0); }
float sdTorus(vec3 p, vec2 t)        { vec2 q = vec2(length(p.xz)-t.x,p.y); return length(q)-t.y; }
float sdCylinder(vec3 p, float h, float r) { vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r); return min(max(d.x,d.y),0.0) + length(max(d,0.0)); }
float sdPlane(vec3 p, vec4 n)        { return dot(p,n.xyz) + n.w; }
```

### 2.2 Sphere Tracing 算法

Ray Marching 的一种高效实现，利用 SDF 的**安全距离**特性：

```
沿光线每次可以前进 f(p) 的距离而不用担心穿透表面
glsl
#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.001

float rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;  // 已走的距离
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + dO * rd;
        float dS = map(p);  // 场景 SDF
        dO += dS;
        if (dS < SURF_DIST || dO > MAX_DIST) break;
    }
    return dO;
}
```

**收敛性证明：** 因为 `dS` 是到最近表面的距离，所以以 `dS` 为步长前进不会跳过任何表面。

### 2.3 法线计算（梯度法）

```glsl
vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
    // 或者更高效的四面体法：
    // return normalize(vec3(
    //     map(p + e.xyy) - map(p),
    //     map(p + e.yxy) - map(p),
    //     map(p + e.yyx) - map(p)
    // ));
}
```

---

## 三、SDF 集合运算

### 3.1 布尔运算

```glsl
float opUnion(float d1, float d2)        { return min(d1, d2); }                    // 并集
float opIntersection(float d1, float d2) { return max(d1, d2); }                    // 交集
float opSubtraction(float d1, float d2)  { return max(-d1, d2); }                   // 差集（d1 挖掉 d2）
```

### 3.2 平滑布尔运算

```glsl
// 平滑并集（ blend 过渡）
float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

// 平滑交集
float opSmoothIntersection(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) + k * h * (1.0 - h);
}

// 平滑差集
float opSmoothSubtraction(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
    return mix(d2, -d1, h) + k * h * (1.0 - h);
}
```

### 3.3 空间变换

```glsl
// 无限重复（domain repetition）
float opRepetition(vec3 p, vec3 c) {
    vec3 q = mod(p + 0.5 * c, c) - 0.5 * c;
    return sdBox(q, vec3(0.2));
}

// 有限重复
float opLimitedRepetition(vec3 p, float s, vec3 l) {
    vec3 q = p - s * clamp(round(p / s), -l, l);
    return sdSphere(q, 0.3);
}

// 位移/扭曲
float opDisplace(vec3 p) {
    float d1 = sdSphere(p, 1.0);
    float d2 = sin(3.0*p.x) * sin(3.0*p.y) * sin(3.0*p.z) * 0.2;
    return d1 + d2;
}

// 弯曲
float opBend(vec3 p, float k) {
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2 m = mat2(c, -s, s, c);
    vec3 q = vec3(m * p.xy, p.z);
    return sdBox(q, vec3(0.5));
}

// 扭转
float opTwist(vec3 p, float k) {
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2 m = mat2(c, -s, s, c);
    vec3 q = vec3(m * p.xz, p.y);
    return sdBox(q, vec3(0.5));
}
```

### 3.4 圆形/极坐标重复

```glsl
// 绕 Y 轴旋转重复 n 次
float opPolarRepeat(vec3 p, float n) {
    float angle = 2.0 * 3.14159 / n;
    float a = atan(p.z, p.x) + angle / 2.0;
    float r = length(p.xz);
    float c = floor(a / angle);
    a = mod(a, angle) - angle / 2.0;
    vec3 q = vec3(cos(a) * r, p.y, sin(a) * r);
    return sdBox(q - vec3(2.0, 0.0, 0.0), vec3(0.2));
}
```

---

## 四、完整 Ray Marching 场景

```glsl
precision highp float;
uniform vec2 uResolution;
uniform float uTime;

#define MAX_STEPS 128
#define MAX_DIST 50.0
#define SURF_DIST 0.001

// === SDF 实体 ===
float sdScene(vec3 p) {
    // 地面
    float plane = p.y + 1.0;

    // 动态球体
    vec3 sphere1Pos = vec3(sin(uTime) * 2.0, 0.0, 0.0);
    float sphere1 = length(p - sphere1Pos) - 1.0;

    vec3 sphere2Pos = vec3(0.0, 0.5, cos(uTime * 0.7) * 2.0);
    float sphere2 = length(p - sphere2Pos) - 0.6;

    // 圆滑连接两个球
    float blob = opSmoothUnion(sphere1, sphere2, 0.5);

    // 与地面合并
    return opUnion(blob, plane);
}

// === Ray Marching ===
float rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + dO * rd;
        float dS = sdScene(p);
        dO += dS;
        if (dS < SURF_DIST || dO > MAX_DIST) break;
    }
    return dO;
}

// === 法线 ===
vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        sdScene(p + e.xyy) - sdScene(p - e.xyy),
        sdScene(p + e.yxy) - sdScene(p - e.yxy),
        sdScene(p + e.yyx) - sdScene(p - e.yyx)
    ));
}

// === 软阴影 ===
float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    for (int i = 0; i < 32; i++) {
        float h = sdScene(ro + rd * t);
        if (h < 0.001) return 0.0;
        res = min(res, k * h / t);
        t += clamp(h, 0.02, 0.5);
        if (t > maxt) break;
    }
    return clamp(res, 0.0, 1.0);
}

// === 环境光遮蔽 (AO) ===
float ambientOcclusion(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
        float h = 0.01 + 0.12 * float(i) / 4.0;
        float d = sdScene(p + h * n);
        occ += (h - d) * sca;
        sca *= 0.95;
        if (occ > 0.35) break;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0) * (0.5 + 0.5 * n.y);
}

// === 主函数 ===
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    // 相机
    vec3 ro = vec3(0.0, 2.0, 5.0);
    vec3 lookAt = vec3(0.0, 0.0, 0.0);
    vec3 forward = normalize(lookAt - ro);
    vec3 right = normalize(cross(forward, vec3(0, 1, 0)));
    vec3 up = cross(right, forward);
    vec3 rd = normalize(uv.x * right + uv.y * up + 1.5 * forward);

    // 追踪
    float t = rayMarch(ro, rd);

    vec3 col = vec3(0.02, 0.02, 0.05);  // 背景

    if (t < MAX_DIST) {
        vec3 p = ro + t * rd;
        vec3 n = calcNormal(p);

        // 材质
        vec3 matCol = (p.y < -0.99)
            ? vec3(0.3, 0.5, 0.2)   // 绿色地面
            : vec3(0.8, 0.3, 0.2);   // 红色球体

        // 光照
        vec3 lightPos = vec3(3.0, 5.0, 2.0);
        vec3 lightDir = normalize(lightPos - p);
        float diff = max(dot(n, lightDir), 0.0);

        // 软阴影
        float sha = softShadow(p + n * 0.01, lightDir, 0.02, length(lightPos - p), 8.0);

        // 环境光
        float ao = ambientOcclusion(p, n);

        // 组合
        col = matCol * (0.3 + diff * sha + 0.2 * ao);

        // 雾效
        col = mix(col, vec3(0.02, 0.02, 0.05), 1.0 - exp(-0.02 * t * t));
    }

    // gamma 校正
    col = pow(col, vec3(0.4545));
    gl_FragColor = vec4(col, 1.0);
}
```

---

## 五、Path Tracing（路径追踪）

### 5.1 蒙特卡洛积分

渲染方程：

```
L_o(p, ω_o) = L_e(p, ω_o) + ∫_Ω f(p, ω_i, ω_o) · L_i(p, ω_i) · |n·ω_i| dω_i
```

Path Tracing 用蒙特卡洛采样近似这个积分。

### 5.2 简化版 Path Tracer

```glsl
// 余弦采样：在法线半球上按 cosine 重形采样
vec3 cosineSampleHemisphere(vec3 n, vec2 rand) {
    float r = sqrt(rand.x);
    float theta = 2.0 * 3.14159 * rand.y;

    vec3 u = abs(n.x) < 0.999 ? vec3(1,0,0) : vec3(0,1,0);
    vec3 t = normalize(cross(u, n));
    vec3 b = cross(n, t);

    return normalize(t * r * cos(theta) + b * r * sin(theta) + n * sqrt(1.0 - rand.x));
}

// 简单随机数
vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

// Path Tracing（单弹跳精度）
vec3 pathTrace(vec3 ro, vec3 rd) {
    vec3 throughput = vec3(1.0);  // 光路传递率
    vec3 color = vec3(0.0);       // 累积光照

    for (int bounce = 0; bounce < 4; bounce++) {
        float t = rayMarch(ro, rd);
        if (t > MAX_DIST) {
            // 环境光（天空）
            color += throughput * vec3(0.5, 0.7, 0.9) * max(rd.y, 0.0);
            break;
        }

        vec3 p = ro + t * rd;
        vec3 n = calcNormal(p);
        vec3 albedo = (p.y < -0.99) ? vec3(0.3, 0.5, 0.2) : vec3(0.8, 0.3, 0.2);

        // 直接光照（对光源采样）
        vec3 lightPos = vec3(3.0, 5.0, 2.0);
        vec3 lightDir = normalize(lightPos - p);
        float shadow = (rayMarch(p + n * 0.01, lightDir) > length(lightPos - p)) ? 1.0 : 0.0;
        color += throughput * albedo * max(dot(n, lightDir), 0.0) * shadow * vec3(1.0);

        // 间接光照：继续弹跳
        vec2 rand = hash22(gl_FragCoord.xy + float(bounce) * 37.0);
        rd = cosineSampleHemisphere(n, rand);
        ro = p + n * 0.001;
        throughput *= albedo;  // 吸收
    }

    return color;
}
```

### 5.3 降噪

Path Tracing 每像素只采一条路径时噪声极大，需要降噪：

```glsl
// 1. 时间累积（屏幕空间采样 + 时间累积）
// 每帧在光线方向上加一个小偏移，然后与前一帧混合
uniform sampler2D uPrevFrame;
uniform float uFrame;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 jitter = (hash22(uv + uFrame) - 0.5) / uResolution;

    vec3 color = pathTrace(ro, rd + jitter);

    // 与前一帧混合
    vec3 prev = texture2D(uPrevFrame, uv).rgb;
    float alpha = 1.0 / (uFrame + 1.0);
    color = mix(prev, color, alpha);

    gl_FragColor = vec4(color, 1.0);
}
```

---

## 六、从光栅化到 Ray Marching 的桥梁

在 Three.js 中用 `ShaderMaterial` 做全屏 Ray Marching：

```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const material = new THREE.ShaderMaterial({
    vertexShader: `
        void main() { gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: /* 上面的 ray marching shader */,
    uniforms: {
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTime: { value: 0.0 }
    }
});

scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

// 动画循环
const clock = new THREE.Clock();
function animate() {
    material.uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
```

---

## 七、奇淫技巧

### 7.1 降低 Ray Marching 步数

```glsl
// 用包围盒预检，避免空白区域无效步进
float t = 0.0;
if (!intersectAABB(ro, rd, boxMin, boxMax, tmin, tmax)) {
    discard;  // 光线不进入场景
}
t = tmin;
```

### 7.2 假折射（不需要真的 ray march）

```glsl
// 玻璃/水的简化折射：直接根据视角偏移采样背景
vec3 fakeRefraction(vec3 rd, vec3 n, float ior, samplerCube envMap) {
    vec3 refracted = refract(rd, n, 1.0 / ior);
    return textureCube(envMap, refracted).rgb;
}
```

### 7.3 体渲染（云、雾）

```glsl
// Beer-Lambert 定律模拟体积吸收
vec4 volumetricRayMarch(vec3 ro, vec3 rd) {
    vec4 col = vec4(0.0);
    float t = 0.0;
    for (int i = 0; i < 64; i++) {
        vec3 p = ro + t * rd;
        float density = cloudSDF(p);  // 云的 SDF
        if (density > 0.0) {
            float transmittance = exp(-density * 0.1);
            vec3 light = exp(-density * 0.5) * vec3(1.0);  // 向光源计算
            col.rgb += (1.0 - transmittance) * light * col.a;
            col.a *= transmittance;
        }
        t += 0.1;
        if (col.a < 0.01) break;
    }
    return col;
}
```

### 7.4 SDF 文字渲染

```glsl
// 用 SDF 纹理绘制清晰文字（不依赖像素）
float sdText(vec2 uv, sampler2D sdfTexture) {
    float d = texture2D(sdfTexture, uv).r - 0.5;
    return d * fwidth(d);  // 抗锯齿
}
```

### 7.5 无限细节（Fractal SDF）

```glsl
// Mandelbox 分形 SDF
float sdMandelbox(vec3 p, float scale) {
    vec3 z = p;
    float dr = 1.0;
    for (int i = 0; i < 8; i++) {
        z = clamp(z, -1.0, 1.0) * 2.0 - z;  // 折叠
        float r2 = dot(z, z);
        if (r2 < 0.5) { z /= 0.5; dr /= 0.5; }
        else if (r2 < 1.0) { z /= r2; dr /= r2; }
        z = z * scale + p;
        dr = dr * abs(scale) + 1.0;
    }
    return length(z) / abs(dr);
}
```


### 6.1 圆角 SDF 一行实现

`length(max(abs(p) - b, 0.0)) - r`，其中 b 是半边长，r 是圆角半径，一行实现两种形状

---

## 相关阅读

- [体积渲染与大气效果](./体积渲染与大气效果.md) — SDF 与体积渲染都用 Ray Marching
- [阴影技术全景](./阴影技术全景.md) — SDF 软阴影技术

---

## 在线示例

以下 ShaderToy 示例可以在浏览器中直接运行，建议结合本文章内容对照阅读：

- [Ray Marching Primitives](https://www.shadertoy.com/view/Xds3zN) — Inigo 经典 SDF 几何体
- [Ray Marching Tutorial](https://www.shadertoy.com/view/XlGBW3) — 光线行进教程
- [SDF Modeling](https://www.shadertoy.com/view/MsVGzG) — SDF 布尔运算演示
- [Path Tracing SDF](https://www.shadertoy.com/view/WtGXDD) — SDF 路径追踪

---

## 参考资料

- [Inigo Quilez - SDF Articles](https://iquilezles.org/articles/)
- [Shadertoy](https://www.shadertoy.com/)
- [Ray Tracing in One Weekend](https://raytracing.github.io/)
- [The Art of Code - Ray Marching Tutorial](https://www.youtube.com/watch?v=PGtv-dBi2wE)
