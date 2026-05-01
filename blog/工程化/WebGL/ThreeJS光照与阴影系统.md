---
title: Three.js 光照与阴影系统深度解析
tags:
  - WebGL
  - ThreeJS
  - 光照
  - 阴影
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# Three.js 光照与阴影系统深度解析

## 目录

1. [光源类型总览](#1-光源类型总览)
2. [光照参数调优](#2-光照参数调优)
3. [阴影原理](#3-阴影原理)
4. [阴影调优](#4-阴影调优)
5. [阴影类型对比](#5-阴影类型对比)
6. [光照烘焙与 LightMap](#6-光照烘焙与-lightmap)
7. [环境光照](#7-环境光照)
8. [奇淫技巧](#8-奇淫技巧)

---

## 1. 光源类型总览

Three.js 提供了六种核心光源类型，各自适用于不同的场景需求。

### 1.1 AmbientLight 环境光

环境光是一种**无方向、无位置**的全局光照，为场景提供基础亮度，避免纯黑区域。

```javascript
import * as THREE from 'three';

// 创建环境光
const ambientLight = new THREE.AmbientLight(
  0x404040, // 颜色：中性灰
  1.0       // 强度
);
scene.add(ambientLight);

// 典型用法：配合其他光源使用
const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff, 1.0);
directional.position.set(5, 10, 7);
scene.add(directional);
```

**特点：**
- 不投射阴影
- 不随距离衰减
- 通常作为辅助光源，强度控制在 0.1~0.5 之间
- 颜色会影响整体色调氛围

---

### 1.2 DirectionalLight 平行光

模拟**无限远处的平行光源**（如太阳光），光线方向一致，不随距离衰减。

```javascript
const directionalLight = new THREE.DirectionalLight(
  0xffffff, // 颜色
  1.5       // 强度
);

// 设置光源位置（决定光线方向）
directionalLight.position.set(10, 20, 10);

// 启用阴影
directionalLight.castShadow = true;

// 阴影相机配置（关键！）
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

scene.add(directionalLight);

// 可视化阴影相机范围（调试用）
const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(helper);
```

**特点：**
- 光线平行，无位置概念（只有方向）
- 不随距离衰减
- 阴影使用正交投影相机
- 适合户外场景、主光源

---

### 1.3 PointLight 点光源

模拟从一个点向**所有方向均匀发射**的光源（如灯泡、蜡烛）。

```javascript
const pointLight = new THREE.PointLight(
  0xffaa00, // 颜色：暖黄
  100,      // 强度（注意：距离衰减模式下强度值较大）
  10,       // 距离：光照最大范围
  2         // 衰减系数 decay
);

pointLight.position.set(2, 3, 2);
pointLight.castShadow = true;

// 点光源阴影配置
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.bias = -0.001;

scene.add(pointLight);

// 添加点光源辅助器
const sphereSize = 0.1;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);

// 让光源动起来（如吊灯摆动）
let time = 0;
function animate() {
  time += 0.01;
  pointLight.position.x = Math.sin(time) * 2;
  pointLight.position.z = Math.cos(time) * 2;
}
```

**特点：**
- 360° 全向发光
- 随距离衰减（受 distance 和 decay 控制）
- 阴影使用 6 个透视相机（立方体贴图）
- 性能开销较大（6 次阴影绘制）

---

### 1.4 SpotLight 聚光灯

模拟**锥形光束**（如手电筒、舞台灯、汽车大灯）。

```javascript
const spotLight = new THREE.SpotLight(
  0xffffff, // 颜色
  100,      // 强度
  30,       // 距离
  Math.PI / 6, // 角度：30度（弧度制）
  0.5,      // penumbra：半影衰减（0=硬边，1=软边）
  1         // decay：衰减系数
);

spotLight.position.set(5, 10, 5);
spotLight.target.position.set(0, 0, 0); // 照射目标

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;

scene.add(spotLight);
scene.add(spotLight.target); // 必须添加到场景

// 聚光灯辅助器
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// 让聚光灯追踪目标
const targetObject = new THREE.Object3D();
scene.add(targetObject);
spotLight.target = targetObject;

// 在动画循环中更新目标位置
targetObject.position.set(mouseX, mouseY, 0);
spotLightHelper.update();
```

**特点：**
- 锥形照射范围（angle 控制）
- 支持边缘软化（penumbra）
- 可设置 target 指向特定目标
- 阴影使用透视相机

---

### 1.5 HemisphereLight 半球光

模拟**天空和地面反射光**（如室外环境的自然光），上方和下方颜色不同。

```javascript
const hemisphereLight = new THREE.HemisphereLight(
  0x87ceeb, // 天空颜色：天蓝
  0x362d1d, // 地面颜色：泥土棕
  0.6       // 强度
);

hemisphereLight.position.set(0, 50, 0);
scene.add(hemisphereLight);

// 半球光辅助器
const hemiLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  5 // 大小
);
scene.add(hemiLightHelper);
```

**特点：**
- 无方向性，基于法线方向混合 skyColor 和 groundColor
- 不投射阴影
- 不随距离衰减
- 非常适合室外自然光照氛围
- 开销极低

---

### 1.6 RectAreaLight 矩形区域光

模拟**平面发光面**（如窗户、长条灯、LED 面板），产生真实的漫反射高光。

```javascript
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

// 必须先初始化
RectAreaLightUniformsLib.init();

const rectLight = new THREE.RectAreaLight(
  0xffffff, // 颜色
  5,        // 强度
  4,        // 宽度
  10        // 高度
);

rectLight.position.set(-5, 5, 5);
rectLight.lookAt(0, 0, 0);

scene.add(rectLight);

// 矩形光辅助器
const rectLightHelper = new RectAreaLightHelper(rectLight);
rectLight.add(rectLightHelper);
```

**特点：**
- 仅影响 MeshStandardMaterial 和 MeshPhysicalMaterial
- 不投射阴影（可配合 SpotLight/DirectionalLight 伪造）
- 产生真实的线性高光反射
- 需要 `RectAreaLightUniformsLib.init()` 初始化
- 性能开销中等

---

## 2. 光照参数调优

### 2.1 核心参数详解

| 参数 | 类型 | 适用范围 | 说明 |
|------|------|----------|------|
| `intensity` | number | 所有光源 | 光照强度。注意：物理正确模式下需配合 decay 调整 |
| `color` | Color | 所有光源 | 光照颜色，影响氛围 |
| `distance` | number | Point/Spot | 光照影响的最大距离，0 表示无限 |
| `decay` | number | Point/Spot | 衰减系数。物理正确模式用 2，旧版用 1 |
| `angle` | number(rad) | SpotLight | 锥形半角，范围 0~Math.PI/2 |
| `penumbra` | number | SpotLight | 边缘软化程度，0~1 |

### 2.2 intensity 调优

```javascript
// 非物理模式（默认）
// AmbientLight 建议 0.1~0.5
const ambient = new THREE.AmbientLight(0xffffff, 0.2);

// DirectionalLight 作为主光源建议 0.5~2.0
const sun = new THREE.DirectionalLight(0xffffff, 1.2);

// PointLight 在 decay=2 时，强度通常需要 50~500
const bulb = new THREE.PointLight(0xffaa00, 100, 10, 2);

// 物理正确模式
renderer.physicallyCorrectLights = true;
// 此时 intensity 单位为坎德拉（cd），需要重新调整
// 太阳约 1.6e12 cd，室内灯泡约 10~100 cd
```

### 2.3 distance 与 decay

```javascript
// 物理正确衰减公式：intensity / (distance^decay)
// decay=2 时符合真实世界平方反比定律

renderer.physicallyCorrectLights = true;

// 10 瓦 LED 灯泡效果
const ledLight = new THREE.PointLight(0xffffff, 10, 5, 2);

// 100 瓦白炽灯效果
const bulbLight = new THREE.PointLight(0xffeebb, 100, 20, 2);

// 蜡烛效果
const candle = new THREE.PointLight(0xff6600, 1, 3, 2);
```

### 2.4 angle 与 penumbra（SpotLight 专属）

```javascript
// 窄光束（手电筒）
const flashlight = new THREE.SpotLight(0xffffff, 100, 50, Math.PI / 10, 0.1);

// 宽光束（舞台灯）
const stageLight = new THREE.SpotLight(0xffffff, 200, 100, Math.PI / 3, 0.5);

// 超软边缘（柔光箱效果）
const softBox = new THREE.SpotLight(0xffffff, 150, 30, Math.PI / 4, 1.0);
```

### 2.5 完整光照配置示例

```javascript
function setupLighting(scene) {
  // 半球光提供自然氛围
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  // 平行光模拟太阳
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -20;
  dirLight.shadow.camera.right = 20;
  dirLight.shadow.camera.top = 20;
  dirLight.shadow.camera.bottom = -20;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  // 补光（点光源）
  const fillLight = new THREE.PointLight(0x99ccff, 20, 15, 2);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  // 轮廓光（聚光灯）
  const rimLight = new THREE.SpotLight(0xffaa55, 50, 20, Math.PI / 6, 0.5);
  rimLight.position.set(0, 5, -10);
  rimLight.target.position.set(0, 0, 0);
  scene.add(rimLight);
  scene.add(rimLight.target);
}
```

---

## 3. 阴影原理

### 3.1 Shadow Map 工作机制

Three.js 的阴影基于 **Shadow Mapping** 技术，其核心流程：

```
第 1 步：阴影渲染 Pass
├─ 以光源为视角，渲染深度图（Depth Map）到 FBO
├─ 记录每个像素到光源的最短距离
└─ 生成 Shadow Map 纹理

第 2 步：正常渲染 Pass
├─ 从相机视角渲染场景
├─ 对每个片段，转换到光源空间
├─ 采样 Shadow Map 比较深度
├─ 当前片段深度 > Shadow Map 深度 → 在阴影中
└─ 当前片段深度 <= Shadow Map 深度 → 被照亮
javascript
// 开启阴影的核心代码
renderer.shadowMap.enabled = true;

// 光源开启阴影投射
light.castShadow = true;

// 物体参与阴影系统
object.castShadow = true;   // 投射阴影
object.receiveShadow = true; // 接收阴影
```

### 3.2 为什么只有三种光源能投影？

| 光源类型 | 能否投影 | 原因 |
|----------|----------|------|
| **DirectionalLight** | ✅ | 使用正交投影相机，渲染一张阴影图 |
| **PointLight** | ✅ | 使用 6 面立方体相机，渲染 6 张阴影图 |
| **SpotLight** | ✅ | 使用透视相机，渲染一张阴影图 |
| **AmbientLight** | ❌ | 无方向、无位置，无法计算深度 |
| **HemisphereLight** | ❌ | 无方向性，基于法线混合颜色 |
| **RectAreaLight** | ❌ | 实现原理基于 LTC（Linearly Transformed Cosines），不支持深度测试 |

**本质原因：** Shadow Map 需要从光源视角渲染场景，这要求光源具有**明确的空间位置和观察方向**。环境类光源没有这些属性，因此无法生成深度图。

### 3.3 PointLight 的阴影立方体

```javascript
// PointLight 阴影内部实现：6 个方向的透视相机
// +X, -X, +Y, -Y, +Z, -Z
// 每帧需要渲染 6 次阴影 Pass

// 可以通过设置 mapSize 控制质量
pointLight.shadow.mapSize.set(512, 512); // 每个面 512x512
// 实际内存占用：512 * 512 * 6 * 4 bytes ≈ 6 MB
```

---

## 4. 阴影调优

### 4.1 mapSize 阴影分辨率

```javascript
// 阴影分辨率直接影响锯齿程度和性能
// 必须是 2 的幂次方

// 低质量（性能优先）
light.shadow.mapSize.set(512, 512);

// 中等质量（平衡）
light.shadow.mapSize.set(1024, 1024);

// 高质量（画质优先）
light.shadow.mapSize.set(2048, 2048);

// 超高质量（慎用）
light.shadow.mapSize.set(4096, 4096); // 显存占用大

// 显存计算公式：width * height * 4 bytes * 3（通常有3个buffer）
// 2048x2048 ≈ 48 MB per light
```

### 4.2 Camera 范围控制

```javascript
// DirectionalLight 正交相机范围
// 范围越小，阴影精度越高！

// 过大：阴影像素被拉伸，精度低
light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;

// 精确匹配场景：精度最高
const sceneBounds = new THREE.Box3().setFromObject(scene);
const size = new THREE.Vector3();
sceneBounds.getSize(size);
const center = new THREE.Vector3();
sceneBounds.getCenter(center);

light.shadow.camera.left = -size.x / 2;
light.shadow.camera.right = size.x / 2;
light.shadow.camera.top = size.y / 2;
light.shadow.camera.bottom = -size.y / 2;

// SpotLight/PointLight 透视相机
light.shadow.camera.near = 0.5;  // 太近可能裁切阴影
light.shadow.camera.far = 50;    // 太远浪费精度
```

### 4.3 bias 深度偏移

```javascript
// 解决 Shadow Acne（阴影自遮挡条纹）问题
light.shadow.bias = -0.001;

// 过大：阴影与物体分离（Peter-Panning）
// 过小：出现摩尔纹条纹

// 不同光源推荐值
// DirectionalLight: -0.0001 ~ -0.001
// SpotLight: -0.0001 ~ -0.001
// PointLight: -0.0001 ~ -0.001

// 另一种解决方案：使用 normalBias
light.shadow.normalBias = 0.02;
// normalBias 根据法线方向偏移，比固定 bias 更自然
```

### 4.4 radius 阴影柔化

```javascript
// 仅在 PCFSoftShadowMap 模式下有效
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 增大 radius 让阴影边缘更柔和
light.shadow.radius = 4;

// 注意：radius 太大会导致阴影噪点
```

### 4.5 完整阴影调优配置

```javascript
function optimizeShadows(light, sceneBounds) {
  light.castShadow = true;

  // 分辨率
  light.shadow.mapSize.set(2048, 2048);

  // 相机范围优化
  if (light.isDirectionalLight) {
    const d = 10;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 100;
    light.shadow.bias = -0.0005;
    light.shadow.normalBias = 0.02;
  } else if (light.isSpotLight) {
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    light.shadow.bias = -0.0001;
    light.shadow.radius = 4;
  } else if (light.isPointLight) {
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 30;
    light.shadow.bias = -0.0001;
  }

  // 自动更新阴影相机矩阵
  light.shadow.camera.updateProjectionMatrix();
}
```

---

## 5. 阴影类型对比

### 5.1 三种阴影算法

```javascript
// 1. BasicShadowMap - 最快，质量最低
renderer.shadowMap.type = THREE.BasicShadowMap;
// 无过滤，硬边锯齿明显

// 2. PCFShadowMap - 默认，性能与质量平衡
renderer.shadowMap.type = THREE.PCFShadowMap;
// Percentage-Closer Filtering
// 对周围像素采样平均，边缘较柔和

// 3. PCFSoftShadowMap - 更软边缘
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// 更大范围采样 + radius 控制
// 注意：Soft 不是真实软阴影（不会随距离增大而模糊）

// 4. VSMShadowMap - 方差阴影贴图
renderer.shadowMap.type = THREE.VSMShadowMap;
// 支持软阴影 + 无偏置问题
// 但会有光溢出（light bleeding）问题
```

### 5.2 对比表格

| 类型 | 性能 | 边缘质量 | 优点 | 缺点 |
|------|------|----------|------|------|
| `BasicShadowMap` | ⭐⭐⭐ 最快 | 锯齿严重 | 性能最好 | 无法接受的质量 |
| `PCFShadowMap` | ⭐⭐☆ 中等 | 轻微柔化 | 平衡 | 阴影有锯齿 |
| `PCFSoftShadowMap` | ⭐⭐☆ 中等 | 较柔和 | 观感好 | 非真实软阴影 |
| `VSMShadowMap` | ⭐☆☆ 较慢 | 最柔和 | 无 bias 问题 | light bleeding |

### 5.3 VSM 特殊使用

```javascript
// VSM 适合室内场景，阴影需要很软
renderer.shadowMap.type = THREE.VSMShadowMap;

// 必须配合较高分辨率
light.shadow.mapSize.set(2048, 2048);

// VSM 使用双边高斯模糊，不需要 bias
light.shadow.bias = 0;

// 注意：VSM 对透明物体处理不佳
```

---

## 6. 光照烘焙与 LightMap

### 6.1 为什么需要光照烘焙？

实时阴影和光照计算开销巨大。对于**静态场景**，可以预先计算光照并烘焙到纹理中。

**优势：**
- 零运行时开销
- 支持全局光照（GI）效果
- 可以烘焙间接光照
- 不受光源数量限制

### 6.2 在 Three.js 中使用 LightMap

```javascript
// 1. 使用外部工具烘焙（Blender / 3ds Max / Unity）
// 导出带有 lightmap UV 的模型

// 2. 加载并应用
const textureLoader = new THREE.TextureLoader();
const lightMap = textureLoader.load('models/lightmap.jpg');

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  map: diffuseTexture,      // 漫反射贴图
  lightMap: lightMap,       // 光照贴图
  lightMapIntensity: 1.0    // 光照贴图强度
});

// 3. 设置 lightmap 使用第 2 套 UV
geometry.setAttribute('uv2', geometry.attributes.uv);
// 或从建模软件导出时自带 uv2

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

### 6.3 烘焙流程示例（Blender）

```javascript
// Blender 导出 glTF 时烘焙光照：
// 1. 在 Blender 中展开 UV2（Lightmap UV）
// 2. 使用 Cycles 渲染器烘焙 Diffuse（只开间接光）
// 3. 导出 glTF 时勾选 "+Y is up"
// 4. Three.js 中：

const loader = new GLTFLoader();
loader.load('scene-baked.glb', (gltf) => {
  const model = gltf.scene;
  
  model.traverse((child) => {
    if (child.isMesh) {
      child.material.lightMap = child.material.lightMap || bakedLightMap;
      child.material.lightMapIntensity = 1.0;
      
      // 静态物体不需要实时阴影
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
  
  scene.add(model);
});
```

### 6.4 混合策略：烘焙 + 实时

```javascript
// 静态环境：完全烘焙
environment.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = false;
    child.receiveShadow = false;
  }
});

// 动态物体：实时阴影
const player = new THREE.Mesh(playerGeo, playerMat);
player.castShadow = true;
player.receiveShadow = true;

// 只有动态光源启用阴影
const dynamicLight = new THREE.SpotLight(0xffffff, 100);
dynamicLight.castShadow = true;
dynamicLight.shadow.mapSize.set(512, 512); // 低分辨率足够
```

---

## 7. 环境光照

### 7.1 Environment Map 环境贴图

环境贴图提供逼真的反射和间接光照，是 PBR 材质的核心。

```javascript
// 1. 加载 HDR/EXR 环境贴图
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const rgbeLoader = new RGBELoader();
rgbeLoader.load('textures/environment.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  
  // 设置为场景环境
  scene.environment = texture; // 影响 PBR 反射
  scene.background = texture;  // 作为背景（可选）
});
```

### 7.2 PMREMGenerator 预处理

HDR 环境贴图需要预处理才能用于实时渲染：

```javascript
import { PMREMGenerator } from 'three';

const pmremGenerator = new PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// 加载 HDR
const rgbeLoader = new RGBELoader();
rgbeLoader.load('textures/environment.hdr', (texture) => {
  // 生成预过滤的 Mipmap 立方体贴图
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  
  scene.environment = envMap;
  scene.background = envMap;
  
  // 释放原始纹理和生成器
  texture.dispose();
  pmremGenerator.dispose();
});
```

### 7.3 使用 RoomEnvironment（快速室内）

```javascript
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// 快速生成室内环境贴图（无需加载外部 HDR）
const pmremGenerator = new PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
```

### 7.4 程序化 CubeTexture

```javascript
// 快速测试用 CubeTexture
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  'px.jpg', 'nx.jpg',
  'py.jpg', 'ny.jpg',
  'pz.jpg', 'nz.jpg'
]);

scene.environment = envMap;
```

### 7.5 环境光遮蔽（AO）

```javascript
// AO Map 模拟环境光遮蔽细节
const aoMap = textureLoader.load('textures/ao.jpg');

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  aoMap: aoMap,
  aoMapIntensity: 1.0 // 控制 AO 强度
});

// 需要 UV2
geometry.setAttribute('uv2', geometry.attributes.uv);
```

---

## 8. 奇淫技巧

### 8.1 假阴影技巧

对于不需要精确阴影的场景，可以使用假阴影大幅提升性能：

```javascript
// 方法 1：平面投影假阴影（Blob Shadow）
function createFakeShadow(texture, scale = 1) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false, // 不写入深度缓冲
    polygonOffset: true,
    polygonOffsetFactor: -1 // 避免 z-fighting
  });
  
  const shadow = new THREE.Mesh(geometry, material);
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.setScalar(scale);
  return shadow;
}

// 绑定到物体下方
const fakeShadow = createFakeShadow(shadowTexture, 2);
scene.add(fakeShadow);

// 在动画中跟随物体
function update() {
  fakeShadow.position.copy(character.position);
  fakeShadow.position.y = 0.01; // 略高于地面避免闪烁
}
javascript
// 方法 2：使用 ShadowMaterial（接收真实阴影的简化版）
const shadowMaterial = new THREE.ShadowMaterial({
  opacity: 0.3
});
const ground = new THREE.Mesh(groundGeometry, shadowMaterial);
ground.receiveShadow = true;
scene.add(ground);
// ShadowMaterial 只渲染阴影，不渲染自身颜色
```

### 8.2 接近光源相机跟随

让方向光阴影相机始终跟随目标，保证阴影精度：

```javascript
class ShadowCameraFollower {
  constructor(light, target, offset = new THREE.Vector3(10, 20, 10)) {
    this.light = light;
    this.target = target;
    this.offset = offset;
  }

  update() {
    // 光源位置跟随目标
    this.light.position.copy(this.target.position).add(this.offset);
    this.light.target.position.copy(this.target.position);
    this.light.target.updateMatrixWorld();
    
    // 更新阴影相机到目标附近（保持高精度）
    const d = 10; // 阴影覆盖范围
    this.light.shadow.camera.left = -d;
    this.light.shadow.camera.right = d;
    this.light.shadow.camera.top = d;
    this.light.shadow.camera.bottom = -d;
    this.light.shadow.camera.updateProjectionMatrix();
  }
}

// 使用
const follower = new ShadowCameraFollower(dirLight, player);
function animate() {
  follower.update();
  renderer.render(scene, camera);
}
```

### 8.3 ContactShadows 代替真实阴影

`@react-three/drei` 提供的 `ContactShadows` 组件，用正交相机渲染深度图实现高性能阴影：

```javascript
// 原生 Three.js 实现思路
class ContactShadows {
  constructor(renderer, scene, camera, options = {}) {
    this.renderer = renderer;
    this.resolution = options.resolution || 1024;
    this.opacity = options.opacity || 0.5;
    this.blur = options.blur || 2;
    
    // 创建正交相机（从上往下）
    const size = 10;
    this.orthoCamera = new THREE.OrthographicCamera(
      -size, size, size, -size, 0, 10
    );
    this.orthoCamera.position.set(0, 5, 0);
    this.orthoCamera.lookAt(0, 0, 0);
    
    // 渲染目标
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.resolution, 
      this.resolution
    );
    
    // 深度材质
    this.depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking
    });
    
    // 显示平面
    const planeGeo = new THREE.PlaneGeometry(20, 20);
    const planeMat = new THREE.MeshBasicMaterial({
      map: this.renderTarget.texture,
      transparent: true,
      opacity: this.opacity
    });
    this.mesh = new THREE.Mesh(planeGeo, planeMat);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = 0.01;
  }
  
  update() {
    // 只渲染投射阴影的物体
    this.scene.overrideMaterial = this.depthMaterial;
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.orthoCamera);
    this.renderer.setRenderTarget(null);
    this.scene.overrideMaterial = null;
  }
}

// 使用：适合角色脚下的接触阴影
const contactShadows = new ContactShadows(renderer, scene, camera, {
  resolution: 512,
  opacity: 0.4,
  blur: 3
});
scene.add(contactShadows.mesh);

function animate() {
  contactShadows.update();
  renderer.render(scene, camera);
}
```

### 8.4 级联阴影贴图（Cascaded Shadow Maps）

对于大场景，Three.js 支持 CSM：

```javascript
import { CSM } from 'three/addons/csm/CSM.js';

const csm = new CSM({
  maxFar: 100,
  cascades: 3,
  shadowMapSize: 2048,
  shadowBias: 0.0001,
  lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
  camera: camera,
  parent: scene
});

// 给材质应用 CSM
csm.setupMaterial(standardMaterial);

// 每帧更新
function animate() {
  csm.update();
  renderer.render(scene, camera);
}
```

### 8.5 性能优化检查清单

```javascript
// 1. 限制阴影光源数量
const MAX_SHADOW_LIGHTS = 2;

// 2. 动态调整阴影质量
function adjustShadowQuality(distance) {
  if (distance > 50) {
    light.shadow.mapSize.set(512, 512);
  } else if (distance > 20) {
    light.shadow.mapSize.set(1024, 1024);
  } else {
    light.shadow.mapSize.set(2048, 2048);
  }
}

// 3. 使用 LOD 减少远处物体阴影
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(lowDetailMesh, 20);
lod.addLevel(noShadowMesh, 50); // 远处不投射阴影

// 4. 阴影相机自动裁剪
light.shadow.camera.autoUpdate = false; // 静态场景
light.shadow.camera.updateProjectionMatrix();
light.shadow.needsUpdate = false; // 光源不动时不更新
```

---

## 总结

| 技术点 | 推荐方案 |
|--------|----------|
| 基础照明 | HemisphereLight + DirectionalLight |
| 室内照明 | RectAreaLight + PointLight 组合 |
| 阴影类型 | PCFSoftShadowMap 默认，VSM 特殊场景 |
| 大场景阴影 | CSM（级联阴影） |
| 性能优化 | 烘焙 LightMap + 假阴影 + ContactShadows |
| 环境反射 | HDR + PMREMGenerator |
| 移动端 | 降低 mapSize、使用假阴影、禁用 PointLight 阴影 |


---

## 在线示例

以下 ShaderToy 示例可以在浏览器中直接运行，建议结合本文章内容对照阅读：

- [Three.js Examples](https://threejs.org/examples/?q=shadow) — Three.js 官方阴影例子
- [Three.js Shadow Editor](https://threejs.org/editor/) — 在线编辑器带阴影

---

## 参考资料

- [Three.js Lighting Guide](https://threejs.org/manual/#en/lights)
- [Three.js Shadows Guide](https://threejs.org/manual/#en/shadows)
---

## 相关阅读

- [阴影技术全景](阴影技术全景.md)
- [光线运算与光照模型](光线运算与光照模型.md)
- [抗锯齿与TAA](抗锯齿与TAA.md)
