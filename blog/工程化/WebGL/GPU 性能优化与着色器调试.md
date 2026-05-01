---
title: GPU 性能优化与着色器调试
tags:
  - WebGL
  - GLSL
  - 性能优化
  - 调试
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# GPU 性能优化与着色器调试

[[toc]]

---

## 一、GPU 渲染管线瓶颈定位

### 1.1 四大瓶颈

| 瓶颈类型 | 特征 | 检测方法 |
|---------|------|---------|
| **顶点处理** | 顶点数过多 / 顶点着色器复杂 | 减少顶点数，帧率提升明显 |
| **片段填充** | 分辨率过高 / 片段着色器复杂 | 缩小窗口，帧率提升明显 |
| **纹理带宽** | 大纹理 / 频繁采样 | 降低纹理分辨率测试 |
| **CPU 提交** | Draw Call 过多 | Chrome Performance 面板看主线程 |

```js
// 快速定位：强制降低分辨率测试
const lowResRenderer = new THREE.WebGLRenderer();
lowResRenderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
// 如果帧率翻倍 → 片段着色器瓶颈
// 如果帧率不变 → 顶点或 CPU 瓶颈
```

### 1.2 Chrome GPU Profile

```
Chrome DevTools → Performance → GPU 轨道
Chrome DevTools → Rendering → Frame Rendering Stats
chrome://gpu/  查看硬件能力和问题
```

---

## 二、Draw Call 优化

### 2.1 合并网格（Merge Geometry）

```js
// 把多个静态网格合并为一个
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const geometries = [];
for (const mesh of staticMeshes) {
    const cloned = mesh.geometry.clone();
    cloned.applyMatrix4(mesh.matrixWorld);
    geometries.push(cloned);
}
const merged = mergeGeometries(geometries);
const singleMesh = new THREE.Mesh(merged, sharedMaterial);
```

### 2.2 实例化渲染（Instanced Rendering）

```js
// 同一网格绒制上千次，只需 1 个 Draw Call
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mesh = new THREE.InstancedMesh(geometry, material, 1000);

const dummy = new THREE.Object3D();
for (let i = 0; i < 1000; i++) {
    dummy.position.set(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
}
```

### 2.3 LOD（多级细节）

```js
// 距离远时使用简化网格
const lod = new THREE.LOD();
lod.addLevel(new THREE.Mesh(highPolyGeo, material), 0);
lod.addLevel(new THREE.Mesh(mediumPolyGeo, material), 50);
lod.addLevel(new THREE.Mesh(lowPolyGeo, material), 200);
```

---

## 三、片段着色器优化

### 3.1 避免分支

GPU 使用 SIMD 架构，同一 warp/wavefront 内的线程必须执行相同指令。

```glsl
// ❌ 坏：分支导致线程发散
if (useTexture) {
    color = texture2D(uTex, uv);
} else {
    color = vec4(1.0);
}

// ✅ 好：用 mix 取代分支（两条路都计算，只选结果）
color = mix(vec4(1.0), texture2D(uTex, uv), float(useTexture));
```

### 3.2 减少纹理采样

```glsl
// ❌ 坏：每个光源都采样一次阴影纹理
for (int i = 0; i < 4; i++) {
    shadow += texture2D(uShadowMap[i], shadowCoord);
}

// ✅ 好：合并到一张 atlas 或 array texture，减少绑定切换
shadow += texture2DArray(uShadowMaps, vec3(shadowCoord, i));
```

### 3.3 精度与性能权衡

```glsl
// 选择合适的 precision
precision highp float;   // 高精度，慢
precision mediump float; // 中精度，大多数情况够用
precision lowp float;    // 低精度，只用于颜色计算

// 在特定变量上重载
varying lowp vec4 vColor;
```

### 3.4 避免动态循环

```glsl
// ❌ 坏：变量边界的 for 循环可能导致编译时无法展开
uniform int uLightCount;
for (int i = 0; i < uLightCount; i++) { ... }  // ❌

// ✅ 好：使用固定上限，内部跳过
for (int i = 0; i < 8; i++) {
    if (i >= uLightCount) break;
    ...
}
```

---

## 四、着色器调试技巧

### 4.1 可视化法线

```glsl
// 把法线转换为颜色直接显示
vec3 debugNormal = normalize(vNormal) * 0.5 + 0.5;
gl_FragColor = vec4(debugNormal, 1.0);
```

### 4.2 可视化 UV 坐标

```glsl
gl_FragColor = vec4(fract(vUv), 0.0, 1.0);
// 红色 = U, 绿色 = V，帮助检查 UV 是否越界或反转
```

### 4.3 可视化深度

```glsl
// 线性深度可视化
float linearDepth = (2.0 * near * far) / (far + near - depth * (far - near));
gl_FragColor = vec4(vec3(linearDepth / far), 1.0);
```

### 4.4 Spector.js 捕获工具

```js
// 插入 Spector.js 捕获所有 WebGL 调用
import * as SPECTOR from 'spectorjs';

const spector = new SPECTOR.Spector();
spector.displayUI();
// 或者自动捕获
spector.onCapture.add((capture) => {
    console.log(capture);
});
spector.captureCanvas(renderer.domElement);
```

### 4.5 RenderDoc / PIX

- **RenderDoc** (Windows/Linux): 捕获帧，查看每个 Draw Call 的状态
- **PIX** (Windows/DirectX): 微软的 GPU 调试工具
- **Snapdragon Profiler** (Android): 高通 GPU 调试

---

## 五、常见性能陷阱

### 5.1 Overdraw

同一像素被多次绘制，通常由半透明物体/粒子引起。

```js
// 检测 overdraw：使用 additive blending 累加
const overdrawMaterial = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    fragmentShader: `
        void main() {
            gl_FragColor = vec4(0.1, 0.0, 0.0, 1.0);  // 红色越深 = overdraw 越严重
        }
    `
});
```

### 5.2 状态切换开销

```js
// 按照材质 / shader 排序渲染，减少状态切换
scene.traverse(obj => {
    if (obj.isMesh) {
        obj.renderOrder = getMaterialSortKey(obj.material);
    }
});
```

### 5.3 触发重构

只对发生变化的对象重新构建 BVH 或网格。

```js
// 静态场景只构建一次 BVH
const bvh = new MeshBVH(geometry, { lazyGeneration: false });
```

---

## 六、WebGL 限制与绕过

### 6.1 纹理单元数量限制

```glsl
// WebGL1: 最少 8 个 texture unit
// WebGL2: 最少 16 个
uniform sampler2D uTex0;
uniform sampler2D uTex1;
// ... 超过限制会报错
```

### 6.2 varying 变量限制

```glsl
// WebGL1: 最少 8 个 vec4 varying
// WebGL2: 最少 16 个
// 压缩法线到 2 个 float 可以节省 varying
```

### 6.3 练习大小限制

```glsl
// 片段着色器最大指令数量受限
// 复杂的 ray marching 很容易触发此限制
// 解决方案：在 JavaScript 中预计算部分逻辑
```

---

## 七、奇淫技巧

### 7.1 着色器热重载

```glsl
// 根据距离/大小选择不同复杂度的着色器
#ifdef HIGH_QUALITY
    // 复杂计算
#else
    // 简化近似
#endif
```

### 7.2 预计算恒量

```glsl
// 把在 CPU 上不变的计算移到 uniform
uniform float uPrecomputedValue;
// 而不是在片段着色器里每像素重新计算
```

### 7.3 纹理预载与压缩

```js
// 使用 KTX2/Basis 格式压缩纹理
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
const loader = new KTX2Loader();
loader.setTranscoderPath('/basis/');
const texture = await loader.loadAsync('texture.ktx2');
```

### 7.4 使用 R16F 节省带宽

```glsl
// 对于只需要单通道的数据（深度、AO），用 R16F 而非 RGBA8
// WebGL2 支持半浮点纹理
```

### 7.5 延迟渲染

```js
// 将光照计算从前向渲染移到后处理
// 先渲染 G-Buffer，然后用全屏四角形做光照
// 光源数量再多也只是一个全屏 pass
```


### 6.1 结构体内存布局

将小型字段放在结构体开头，避免对齐填充导致的内存浪费，如 bool 后接 vec3 会填充 3 字节

---

## 相关阅读

- [帧缓冲与后处理管线](./帧缓冲与后处理管线.md) — 后处处理的性能考量
- [抗锯齿与TAA](./抗锯齿与TAA.md) — TAA 的性能优化策略

---

## 在线示例

以下 ShaderToy 示例可以在浏览器中直接运行，建议结合本文章内容对照阅读：

- [Shader Performance](https://www.shadertoy.com/view/MdVfz1) — 着色器性能对比
- [Loop Unrolling](https://www.shadertoy.com/view/XsSfRK) — 循环展开示例

---

## 参考资料

- [WebGL Best Practices (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [Optimize your WebGL application](https://developer.chrome.com/docs/webgl/optimize)
- [Spector.js](https://spector.babylonjs.com/)
- [RenderDoc](https://renderdoc.org/)
