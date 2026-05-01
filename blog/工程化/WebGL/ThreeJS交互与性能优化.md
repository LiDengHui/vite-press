---
title: ThreeJS 交互与性能优化
tags:
  - WebGL
  - ThreeJS
  - 交互
  - 性能优化
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# ThreeJS 交互与性能优化

> 全面梳理 Three.js 中高频交互方案与生产级性能优化手段，覆盖控制器、射线检测、实例化、LOD、纹理压缩及进阶 Trick。

---

## 1. OrbitControls 详解

`OrbitControls` 是最常用的相机轨道控制器，支持旋转、平移、缩放，并带有平滑阻尼效果。

### 基础引入

```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
```

### 核心配置项

```js
// 阻尼与惯性（必须配合 controls.update() 在动画循环中调用）
controls.enableDamping = true;
controls.dampingFactor = 0.05;   // 阻尼系数，越小越慢

// 缩放
controls.enableZoom = true;
controls.minDistance = 2;        // 最近距离
controls.maxDistance = 100;      // 最远距离
controls.zoomSpeed = 1.0;

// 旋转
controls.enableRotate = true;
controls.rotateSpeed = 1.0;
controls.autoRotate = false;     // 自动旋转
controls.autoRotateSpeed = 2.0;  // 自动旋转速度（弧度/秒）

// 平移
controls.enablePan = true;
controls.panSpeed = 1.0;
controls.screenSpacePanning = true; // true: 水平/垂直平移; false: 沿相机方向

// 视角限制（极角限制）
controls.minPolarAngle = 0;          // 顶部（弧度）
controls.maxPolarAngle = Math.PI / 2; // 只允许到水平面（地面视角）

// 水平角限制（可选）
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;

// 目标点（轨道中心）
controls.target.set(0, 0, 0);
controls.update();

// 键盘控制
controls.keys = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  BOTTOM: 'ArrowDown'
};

// 鼠标按键映射
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN
};
```

### 事件监听

```js
controls.addEventListener('change', () => {
  console.log('相机状态改变');
});

controls.addEventListener('start', () => { /* 交互开始 */ });
controls.addEventListener('end', () => { /* 交互结束 */ });
```

### 动画循环中的更新

```js
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 开启 damping 后必须调用
  renderer.render(scene, camera);
}
```

---

## 2. Raycaster 鼠标点击拣取

Raycaster 用于从屏幕发射射线，检测与场景中物体的相交。

### 屏幕坐标转换

```js
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // 将鼠标像素坐标转换为 NDC（-1 ~ +1）
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // 检测相交（递归检测子对象）
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0];
    console.log('命中对象:', hit.object.name);
    console.log('命中点:', hit.point);
    console.log('命中面索引:', hit.faceIndex);
  }
}

window.addEventListener('click', onMouseClick);
```

### 高亮/选中效果

```js
const selectedObjects = new Set();
const highlightMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  transparent: true,
  opacity: 0.5
});
const originalMaterials = new Map();

function highlightObject(mesh) {
  if (!originalMaterials.has(mesh)) {
    originalMaterials.set(mesh, mesh.material);
  }
  mesh.material = highlightMaterial;
  selectedObjects.add(mesh);
}

function clearHighlight() {
  selectedObjects.forEach(mesh => {
    if (originalMaterials.has(mesh)) {
      mesh.material = originalMaterials.get(mesh);
    }
  });
  selectedObjects.clear();
}

// 在点击事件中调用
if (intersects.length > 0) {
  clearHighlight();
  const target = intersects[0].object;
  if (target.isMesh) highlightObject(target);
}
```

### 性能优化：指定检测对象

```js
// 避免递归检测整个场景，使用白名单
const pickableObjects = [meshA, meshB, meshC];
const intersects = raycaster.intersectObjects(pickableObjects, false);
```

---

## 3. 其他控制器简介

### TrackballControls

自由旋转，无正上/正下限制，适合 360° 查看模型。

```js
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.staticMoving = false;   // true 时无惯性
controls.dynamicDampingFactor = 0.05;
```

### FlyControls

类似飞行模拟器，适合第一人称漫游。

```js
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 10;
controls.rollSpeed = Math.PI / 6;
controls.dragToLook = true; // 需要拖拽才能看向不同方向
```

### PointerLockControls

锁定鼠标指针，用于 FPS 游戏。

```js
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const controls = new PointerLockControls(camera, document.body);

document.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => console.log('锁定'));
controls.addEventListener('unlock', () => console.log('释放'));

// 在动画循环中处理移动
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function animate() {
  const delta = clock.getDelta();

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  renderer.render(scene, camera);
}
```

---

## 4. 加载器系统

### GLTFLoader（加载 3D 模型）

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const loader = new GLTFLoader();

// 接入 Draco 解压（大幅降低体积）
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);

loader.load(
  'model.gltf',
  (gltf) => {
    scene.add(gltf.scene);
  },
  (progress) => {
    const percent = (progress.loaded / progress.total) * 100;
    console.log(`加载进度: ${percent.toFixed(2)}%`);
  },
  (error) => {
    console.error('加载失败:', error);
  }
);
```

### TextureLoader

```js
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('texture.jpg', (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
});
```

### LoadingManager 统一进度条

```js
const manager = new THREE.LoadingManager();

manager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`开始加载: ${url}`);
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const progress = (itemsLoaded / itemsTotal) * 100;
  updateProgressBar(progress);
};

manager.onLoad = () => {
  console.log('所有资源加载完成');
  hideLoadingScreen();
};

manager.onError = (url) => {
  console.error('加载失败:', url);
};

// 所有 Loader 共享同一个 manager
const gltfLoader = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
```

---

## 5. 实例化渲染 InstancedMesh

`InstancedMesh` 通过单次 draw call 渲染大量相同几何体，极大提升性能。

### 基础用法

```js
const count = 10000;
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

const dummy = new THREE.Object3D();
const color = new THREE.Color();

for (let i = 0; i < count; i++) {
  dummy.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  dummy.scale.setScalar(Math.random() * 2 + 0.5);
  dummy.updateMatrix();

  instancedMesh.setMatrixAt(i, dummy.matrix);
  instancedMesh.setColorAt(i, color.setHex(Math.random() * 0xffffff));
}

instancedMesh.instanceMatrix.needsUpdate = true;
instancedMesh.instanceColor.needsUpdate = true;

scene.add(instancedMesh);
```

### 动态更新

```js
function updateInstance(index, position, rotation, scale) {
  dummy.position.copy(position);
  dummy.rotation.set(rotation.x, rotation.y, rotation.z);
  dummy.scale.copy(scale);
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(index, dummy.matrix);
  instancedMesh.instanceMatrix.needsUpdate = true;
}
```

### 预算与限制

| 方案 | Draw Calls | 适用场景 |
|------|-----------|---------|
| 普通 Mesh x 1000 | 1000 | 独立动画、独立材质 |
| InstancedMesh x 1000 | 1 | 相同几何+材质，仅变换不同 |
| 合并几何体 | 1 | 静态场景，无单独选中需求 |

> **注意**：`InstancedMesh` 的数量上限约为 `2^24`（1600万），受限于 GPU 显存与索引类型。移动端建议单批次不超过 10 万实例。

### 性能对比

```
普通 Mesh x 10,000:   ~5 FPS (CPU 瓶颈，draw call 爆炸)
InstancedMesh x 10,000: ~60 FPS (单次 draw call，GPU 吞吐)
```

---

## 6. LOD（Level of Detail）详解

根据相机距离自动切换不同精度的模型，减少远处物体的面数。

### 基础用法

```js
import { LOD } from 'three';

const lod = new THREE.LOD();

// 高模（近处）
const highDetail = new THREE.Mesh(
  new THREE.IcosahedronGeometry(5, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);

// 中模
const midDetail = new THREE.Mesh(
  new THREE.IcosahedronGeometry(5, 2),
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);

// 低模（远处）
const lowDetail = new THREE.Mesh(
  new THREE.IcosahedronGeometry(5, 0),
  new THREE.MeshStandardMaterial({ color: 0x0000ff })
);

// 添加层级与距离阈值
lod.addLevel(highDetail, 0);    // 0 ~ 20
lod.addLevel(midDetail, 20);    // 20 ~ 50
lod.addLevel(lowDetail, 50);    // > 50

scene.add(lod);

// 动画循环中更新 LOD（通常 Object3D 遍历已自动处理）
function animate() {
  requestAnimationFrame(animate);
  lod.update(camera); // 手动调用或在场景遍历中自动触发
  renderer.render(scene, camera);
}
```

### 进阶：自动生成 LOD 层级

```js
function createLOD(geometry, material, levels = 3) {
  const lod = new THREE.LOD();
  for (let i = 0; i < levels; i++) {
    const simplified = geometry.clone();
    // 使用第三方库如 @gltf-transform/functions 进行减面
    const ratio = 1 / Math.pow(2, i);
    const mesh = new THREE.Mesh(simplified, material);
    lod.addLevel(mesh, i === 0 ? 0 : 10 * Math.pow(2, i));
  }
  return lod;
}
```

---

## 7. 几何体合并与 BufferGeometryUtils

合并静态几何体，减少 draw call，适合不常变动的场景元素（如地形、建筑）。

### 安装/引入

```js
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
```

### 合并几何体

```js
const geometries = [];

for (let i = 0; i < 1000; i++) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.translate(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  geometries.push(geometry);
}

// 合并为单一 BufferGeometry
const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
const mergedMesh = new THREE.Mesh(
  mergedGeometry,
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);

scene.add(mergedMesh);
```

### 带材质的合并（按材质分组）

```js
// 不同材质无法直接合并，需按材质分组后分别合并
const materialGroups = new Map();

meshes.forEach(mesh => {
  const matId = mesh.material.uuid;
  if (!materialGroups.has(matId)) {
    materialGroups.set(matId, { material: mesh.material, geometries: [] });
  }
  const geom = mesh.geometry.clone();
  geom.applyMatrix4(mesh.matrixWorld);
  materialGroups.get(matId).geometries.push(geom);
});

materialGroups.forEach(({ material, geometries }) => {
  const merged = BufferGeometryUtils.mergeGeometries(geometries);
  scene.add(new THREE.Mesh(merged, material));
});
```

### 注意事项

- 合并后失去对单个子对象的独立控制（无法单独移动/删除）。
- 合并前使用 `geometry.applyMatrix4(matrix)` 固化变换。
- 超大几何体可能超出 GPU 索引限制（Uint16 为 65535 顶点），需使用 `BufferGeometryUtils.mergeGeometries(geometries, true)` 强制使用 Uint32 索引。

---

## 8. 纹理压缩与加载

### KTX2Loader（推荐）

`.ktx2` 格式支持 Basis Universal 压缩，跨平台兼容 ASTC/ETC/BC/S3TC。

```js
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('/basis/');
ktx2Loader.detectSupport(renderer);

ktx2Loader.load('texture.ktx2', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  material.map = texture;
});
```

### BasisTextureLoader（旧版，推荐迁移到 KTX2）

```js
import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js';

const basisLoader = new BasisTextureLoader();
basisLoader.setTranscoderPath('/basis/');
basisLoader.detectSupport(renderer);

basisLoader.load('texture.basis', (texture) => {
  material.map = texture;
});
```

### HDR / EXR 环境贴图加载

```js
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

new RGBELoader().load('env.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; // 作为 PBR 环境光
  scene.background = texture;  // 作为背景
});
```

### CubeTextureLoader（六面体贴图）

```js
const cubeLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeLoader.load([
  'px.jpg', 'nx.jpg',
  'py.jpg', 'ny.jpg',
  'pz.jpg', 'nz.jpg'
]);
scene.background = cubeTexture;
scene.environment = cubeTexture;
```

### 纹理优化建议

| 手段 | 效果 |
|------|------|
| KTX2/Basis 压缩 | 显存占用降低 ~75%，首包更小 |
| 限制纹理尺寸 | 移动端不超过 2048x2048 |
| Mipmap | 开启 `texture.generateMipmaps = true`，减少远处锯齿与带宽 |
| 格式选择 | 非透明用 `RGB`，透明用 `RGBA`；法线贴图用 `RG` |
| 颜色空间 | 贴图设置 `texture.colorSpace = THREE.SRGBColorSpace`，避免过曝 |

---

## 9. 阴影优化方案汇总

### 基础阴影配置

```js
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //  softer shadow

directionalLight.castShadow = true;
mesh.castShadow = true;
mesh.receiveShadow = true;
```

### 阴影质量与性能平衡

```js
// 1. 限制阴影贴图分辨率（默认 512x512）
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;

// 2. 限制阴影相机视锥（越小越清晰）
light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 200;

// 3. 阴影偏差（消除阴影痤疮）
light.shadow.bias = -0.0005;
light.shadow.normalBias = 0.02; // 法线偏差，更现代的方案

// 4. 阴影贴图类型选择
THREE.BasicShadowMap      // 最快，质量最低
THREE.PCFShadowMap        // 默认，性能均衡
THREE.PCFSoftShadowMap    // 柔和阴影，性能稍低
THREE.VSMShadowMap        // 软阴影，边缘更好，但有光晕
```

### 级联阴影贴图（Cascaded Shadow Maps）

Three.js r163+ 支持 `Csm` 插件，适合大场景。

```js
import { CSM } from 'three/examples/jsm/csm/CSM.js';

const csm = new CSM({
  maxFar: 1000,
  cascades: 4,
  shadowMapSize: 2048,
  shadowBias: 0.0001,
  lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
  camera: camera,
  parent: scene
});

csm.setupMaterial(material);

function animate() {
  csm.update();
  renderer.render(scene, camera);
}
```

### 替代方案：烘焙阴影

- 静态场景优先使用 Lightmap 烘焙，关闭实时阴影。
- 使用 `ShadowMaterial` + 预渲染的透明阴影贴图，作为地面假阴影。

```js
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.ShadowMaterial({ opacity: 0.3 })
);
shadowPlane.receiveShadow = true;
scene.add(shadowPlane);
```

---

## 10. 奇淫技巧

### 10.1 IntersectionObserver 暂停离屏渲染

当 Canvas 不在视口内时，暂停渲染循环，节省 GPU/CPU。

```js
const canvas = renderer.domElement;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isVisible = true;
      animate();
    } else {
      isVisible = false;
    }
  });
}, { threshold: 0 });

observer.observe(canvas);

let isVisible = true;

function animate() {
  if (!isVisible) return;
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
```

### 10.2 WebWorker 加载大模型

避免解析大模型阻塞主线程 UI。

```js
// worker.js
self.importScripts('/three.min.js');
self.importScripts('/GLTFLoader.js');

self.onmessage = function(e) {
  const { url } = e.data;
  const loader = new THREE.GLTFLoader();
  loader.load(url, (gltf) => {
    // 序列化后传回主线程
    const sceneJson = gltf.scene.toJSON();
    self.postMessage({ type: 'loaded', scene: sceneJson }, [sceneJson]);
  });
};

// main.js
const worker = new Worker('worker.js');
worker.postMessage({ url: 'heavy-model.glb' });

worker.onmessage = (e) => {
  if (e.data.type === 'loaded') {
    const loader = new THREE.ObjectLoader();
    const scene = loader.parse(e.data.scene);
    // 接入主场景
  }
};
```

> 注意：Three.js 对象含闭包与 DOM 引用，不能直接用 `postMessage` 传输，需 `toJSON()` / `ObjectLoader` 配合。

### 10.3 Transform Feedback GPU 粒子

利用 WebGL2 `Transform Feedback` 在 GPU 端更新粒子位置，避免 CPU↔GPU 数据回读。

```glsl
// vertex shader (update)
attribute vec3 position;
attribute vec3 velocity;
attribute float life;

uniform float dt;
varying vec3 vPosition;
varying vec3 vVelocity;
varying float vLife;

void main() {
  vPosition = position + velocity * dt;
  vVelocity = velocity + vec3(0.0, -9.8, 0.0) * dt; // 重力
  vLife = life - dt;
}
js
// 使用 Three.js 的 WebGLRenderer + raw GL 或 Three.js Buffers
// Three.js 内置不直接暴露 Transform Feedback，需通过 renderer.getContext() 操作 raw WebGL2
// 或使用第三方库如 `three-transformfeedback` 简化封装
```

核心思路：
1. 创建两个 `TransformFeedback` 缓冲，交替读写（ping-pong）。
2. 每帧绑定 `gl.bindBufferBase` 到 `TRANSFORM_FEEDBACK_BUFFER`。
3. 调用 `gl.beginTransformFeedback(PRIMITIVE)` 后 `gl.drawArrays`。
4. 交换读写缓冲，实现纯 GPU 粒子模拟。

### 10.4 自动化性能监控面板

集成 `stats.js` + `renderer.info` 做实时性能看板。

```js
import Stats from 'three/examples/jsm/libs/stats.module.js';

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  stats.begin();

  controls.update();
  renderer.render(scene, camera);

  stats.end();
  logRendererInfo();
}

function logRendererInfo() {
  const info = renderer.info;
  console.table({
    calls: info.render.calls,
    triangles: info.render.triangles,
    points: info.render.points,
    lines: info.render.lines,
    geometries: info.memory.geometries,
    textures: info.memory.textures
  });
}
```

### 自定义性能预算告警

```js
const PERF_BUDGET = {
  drawCalls: 100,
  triangles: 500000,
  textures: 50
};

function checkBudget() {
  const { render, memory } = renderer.info;
  if (render.calls > PERF_BUDGET.drawCalls) {
    console.warn(`Draw calls 超标: ${render.calls}`);
  }
  if (render.triangles > PERF_BUDGET.triangles) {
    console.warn(`面数超标: ${render.triangles}`);
  }
}
```

---

## 总结速查表

| 优化方向 | 关键方案 | 适用场景 |
|---------|---------|---------|
| 交互控制 | OrbitControls + 阻尼/限制 | 通用 3D 查看器 |
| 点击拣取 | Raycaster + 白名单 | 编辑器、数据可视化 |
| 海量物体 | InstancedMesh | 树木、粒子、建筑 |
| 远距离优化 | LOD | 大场景地形/模型 |
| 减少 Draw Call | BufferGeometryUtils 合并 | 静态场景 |
| 纹理 | KTX2 + Mipmap | 所有贴图 |
| 阴影 | CSM / 烘焙 / ShadowMaterial | 室内外场景 |
| 离屏优化 | IntersectionObserver | 长页面滚动 |
| 加载体验 | WebWorker + LoadingManager | 大模型应用 |
| 粒子 | Transform Feedback | 雨雪、特效 |

---

> **参考文档**
> - [Three.js Manual - Optimization](https://threejs.org/manual/#en/optimization)
> - [Three.js Examples](https://threejs.org/examples/)
> - [Google Web Fundamentals - Rendering Performance](https://web.dev/rendering-performance/)



---

## 相关阅读

- [抗锯齿与TAA](抗锯齿与TAA.md)
- [GPU 性能优化与着色器调试](GPU 性能优化与着色器调试.md)
- [帧缓冲与后处理管线](帧缓冲与后处理管线.md)

- [ThreeJS基础入门与核心对象](./ThreeJS基础入门与核心对象.md) — 交互功能的基础对象使用
- [ThreeJS光照与阴影系统](./ThreeJS光照与阴影系统.md) — 光照与阴影对性能的影响
- [ThreeJS骨骼动画系统](./ThreeJS骨骼动画系统.md) — 骨骼动画的交互实现

---

## 在线示例

- [Three.js Interaction](https://threejs.org/examples/?q=controls) — Three.js 交互控制例子
- [Raycaster Demo](https://threejs.org/examples/?q=raycaster) — 光线检测示例
- [Instancing Performance](https://threejs.org/examples/?q=instancing) — InstancedMesh 性能示例

---

## 参考资料

- [Three.js Documentation - Controls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
- [Three.js Documentation - Raycaster](https://threejs.org/docs/#api/en/core/Raycaster)