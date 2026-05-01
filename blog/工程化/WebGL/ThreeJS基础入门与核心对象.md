---
title: Three.js 基础入门与核心对象
tags:
  - WebGL
  - ThreeJS
  - 入门
  - 核心概念
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# Three.js 基础入门与核心对象

> Three.js 是一个基于 WebGL 的 JavaScript 3D 库，封装了底层的 WebGL API，让开发者可以用更直观的方式创建 3D 场景。

---

## 1. Three.js 环境搭建

### 1.1 Vite 方式（推荐）

```bash
npm create vite@latest my-3d-app -- --template vanilla
cd my-3d-app
npm install
npm install three
npm install -D @types/three   # TypeScript 项目需要
js
// main.js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
```

**Vite 优势：**
- 极速冷启动，HMR 热更新
- 原生 ESM，按需导入 Three.js 子模块
- 内置优化，生产构建体积小

### 1.2 Webpack 方式

```bash
npm init -y
npm install three
npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin
js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
    devServer: { static: './dist' },
    mode: 'development',
};
js
// src/index.js
import * as THREE from 'three';
// ... 同上
```

**Webpack 适用场景：**
- 已有 Webpack 工程的项目
- 需要复杂 loader / plugin 链的项目
- 对构建流程有深度定制需求

### 1.3 CDN 方式（快速原型）

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Three.js CDN</title>
    <style>body { margin: 0; overflow: hidden; }</style>
    <!-- Import Map -->
    <script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
    }
    </script>
</head>
<body>
    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);

        camera.position.z = 5;

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    </script>
</body>
</html>
```

**CDN 适用场景：**
- 快速原型验证
- CodePen / JSFiddle / 教学演示
- 无构建工具的简单页面

---

## 2. 三大核心对象详解

Three.js 中最核心的三个类：**Scene（场景）**、**Camera（相机）**、**Renderer（渲染器）**。

### 2.1 Scene —— 场景

Scene 是所有 3D 对象的容器，负责管理场景图（Scene Graph）。

```js
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 设置背景色（支持颜色、纹理、cube map）
scene.background = new THREE.Color(0x87CEEB);      // 天空蓝
// scene.background = new THREE.TextureLoader().load('sky.jpg');

// 设置雾效（远处物体渐变消失，增强深度感）
scene.fog = new THREE.Fog(0x87CEEB, 10, 50);       // 颜色, 近处, 远处
// scene.fog = new THREE.FogExp2(0x87CEEB, 0.02);   // 指数雾

// 场景覆盖材质（用于调试，将所有物体渲染为线框）
// scene.overrideMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

// 遍历场景中的所有对象
scene.traverse((object) => {
    console.log(object.name, object.type);
});

// 按名称获取对象
const myMesh = scene.getObjectByName('myMesh');

// 添加/移除对象
const mesh = new THREE.Mesh(geometry, material);
mesh.name = 'myMesh';
scene.add(mesh);
scene.remove(mesh);

// 清空场景
while(scene.children.length > 0) {
    scene.remove(scene.children[0]);
}
```

**Scene 常用属性：**

| 属性 | 说明 |
|------|------|
| `background` | 场景背景（Color / Texture / CubeTexture） |
| `fog` | 雾效（Fog / FogExp2） |
| `environment` | 环境贴图（影响 PBR 材质反射） |
| `overrideMaterial` | 覆盖所有物体的材质 |
| `children` | 场景中的所有子对象数组 |

### 2.2 Camera —— 相机

相机定义了观察场景的视角和范围。

```js
import * as THREE from 'three';

// ========== PerspectiveCamera（透视相机）==========
// 参数：fov(视角), aspect(宽高比), near(近裁剪面), far(远裁剪面)
const perspectiveCamera = new THREE.PerspectiveCamera(
    75,                          // fov：垂直视角，单位度
    window.innerWidth / window.innerHeight,  // aspect：宽高比
    0.1,                         // near：近裁剪面，小于此距离不渲染
    1000                         // far：远裁剪面，大于此距离不渲染
);

perspectiveCamera.position.set(0, 5, 10);    // 设置位置
perspectiveCamera.lookAt(0, 0, 0);            // 看向原点

// ========== OrthographicCamera（正交相机）==========
// 参数：left, right, top, bottom, near, far
const frustumSize = 10;
const aspect = window.innerWidth / window.innerHeight;
const orthoCamera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,   // left
    frustumSize * aspect / 2,    // right
    frustumSize / 2,             // top
    frustumSize / -2,            // bottom
    0.1,                         // near
    1000                         // far
);

// 相机控制和更新
orthoCamera.position.set(0, 0, 10);
orthoCamera.lookAt(0, 0, 0);

// 更新透视相机投影矩阵（窗口大小变化时必须调用）
perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
perspectiveCamera.updateProjectionMatrix();

// 相机实用方法
const vector = new THREE.Vector3();
perspectiveCamera.getWorldDirection(vector);  // 获取相机朝向向量
console.log(perspectiveCamera.position.clone()); // 复制位置
```

### 2.3 Renderer —— 渲染器

渲染器负责将 Scene + Camera 的内容绘制到屏幕上。

```js
import * as THREE from 'three';

// 创建 WebGL 渲染器
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),  // 可选：指定已有 canvas
    antialias: true,                             // 抗锯齿
    alpha: false,                                // 是否透明背景
    premultipliedAlpha: true,                    // 预乘 alpha
    stencil: true,                               // 模板缓冲
    depth: true,                                 // 深度缓冲
    logarithmicDepthBuffer: false,               // 对数深度缓冲（解决 z-fighting）
    powerPreference: 'high-performance',          // 偏好高性能 GPU
});

// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 设置像素比（DPR，防止高分屏模糊）
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 设置输出颜色空间
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 启用阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // 软阴影

// 启用色调映射（HDR 效果）
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// 插入到 DOM
// 如果未传入 canvas，会自动创建并返回
document.body.appendChild(renderer.domElement);

// 执行渲染（每帧调用）
renderer.render(scene, camera);

// 清除画面
renderer.clear();               // 清除颜色和深度缓冲
renderer.clearDepth();          // 仅清除深度缓冲
renderer.clearColor(0xff0000);  // 用指定颜色清除

// 设置视口（用于分屏、后处理等）
renderer.setViewport(0, 0, width / 2, height);      // 左半屏
renderer.setScissor(0, 0, width / 2, height);
renderer.setScissorTest(true);

// 获取当前帧率信息（调试用）
console.log(renderer.info);
// renderer.info.render.calls   // draw call 次数
// renderer.info.render.triangles // 三角形数量
// renderer.info.memory.geometries // 几何体数量
// renderer.info.memory.textures   // 纹理数量
```

**渲染器常用配置对比：**

| 配置项 | 作用 | 建议 |
|--------|------|------|
| `antialias` | 边缘抗锯齿 | 开启，有性能消耗 |
| `pixelRatio` | 适配高分屏 | 限制最大为 2 |
| `shadowMap.enabled` | 阴影系统 | 需要阴影时开启 |
| `toneMapping` | 色调映射 | PBR 场景建议开启 |
| `logarithmicDepthBuffer` | 深度精度 | 大场景避免 z-fighting |

---

## 3. PerspectiveCamera vs OrthographicCamera

### 3.1 核心区别

```
透视相机 (PerspectiveCamera)          正交相机 (OrthographicCamera)
    \                                   |
     \    ┌───┐                         |    ┌───┐
      \   │   │                         |    │   │
       \  └───┘                         |    └───┘
        \                               |
         \───────────►                   |───────────►
    近大远小，符合人眼                     平行投影，无透视变形
```

### 3.2 对比详解

| 特性 | PerspectiveCamera | OrthographicCamera |
|------|-------------------|-------------------|
| **投影方式** | 锥形投影（近大远小） | 平行投影（大小不变） |
| **参数** | fov, aspect, near, far | left, right, top, bottom, near, far |
| **视觉感受** | 真实、立体 | 扁平、平面化 |
| **适用场景** | 3D 游戏、漫游、写实场景 | 2.5D 游戏、工程图纸、UI、三视图 |
| **距离影响** | 物体越远显示越小 | 距离不影响显示大小 |

### 3.3 完整对比示例

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// ========== 创建两个渲染区域 ==========
const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 辅助网格
const gridHelper = new THREE.GridHelper(20, 20, 0xff0000, 0x444444);
scene.add(gridHelper);

// 创建一排立方体（用于观察透视差异）
for (let i = -5; i <= 5; i++) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: i === 0 ? 0xff0000 : 0x00ff00 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(i * 2, 0.5, -Math.abs(i) * 2);
    mesh.castShadow = true;
    scene.add(mesh);
}

// 添加地面
const planeGeo = new THREE.PlaneGeometry(50, 50);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// 灯光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// ========== 透视相机 ==========
const perspectiveCamera = new THREE.PerspectiveCamera(50, (width / 2) / height, 0.1, 1000);
perspectiveCamera.position.set(0, 5, 10);
perspectiveCamera.lookAt(0, 0, 0);

// ========== 正交相机 ==========
const frustumSize = 15;
const aspect = (width / 2) / height;
const orthographicCamera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000
);
orthographicCamera.position.set(0, 10, 10);
orthographicCamera.lookAt(0, 0, 0);

// 双视口渲染
function render() {
    requestAnimationFrame(render);

    // 左半屏：透视相机
    renderer.setViewport(0, 0, width / 2, height);
    renderer.setScissor(0, 0, width / 2, height);
    renderer.setScissorTest(true);
    renderer.render(scene, perspectiveCamera);

    // 绘制分割线
    renderer.setScissorTest(false);

    // 右半屏：正交相机
    renderer.setViewport(width / 2, 0, width / 2, height);
    renderer.setScissor(width / 2, 0, width / 2, height);
    renderer.setScissorTest(true);
    renderer.render(scene, orthographicCamera);

    renderer.setScissorTest(false);
}
render();
```

### 3.4 使用场景总结

| 场景 | 推荐相机 |
|------|----------|
| FPS / 第三人称游戏 | PerspectiveCamera |
| 建筑漫游 / 室内展示 | PerspectiveCamera |
| 等距游戏（Isometric） | OrthographicCamera |
| 2D 游戏 + 3D 元素（2.5D） | OrthographicCamera |
| CAD / 工程可视化 | OrthographicCamera |
| UI / HUD 渲染 | OrthographicCamera |
| 三视图（前视/侧视/俯视） | OrthographicCamera |

---

## 4. 物体系统：Geometry + Material + Mesh

Three.js 中可见物体 = **Geometry（几何形状）** + **Material（材质外观）** + **Mesh（网格对象）**。

### 4.1 核心关系

```
Mesh
 ├─ geometry: BoxGeometry / SphereGeometry / BufferGeometry ...
 │      ├─ position attribute (顶点位置)
 │      ├─ normal attribute   (顶点法线)
 │      ├─ uv attribute       (纹理坐标)
 │      └─ index              (顶点索引，可选)
 │
 └─ material: MeshBasicMaterial / MeshStandardMaterial / ShaderMaterial ...
        ├─ color / map        (颜色/纹理)
        ├─ transparent / opacity (透明度)
        └─ side               (渲染面：正面/背面/双面)
```

### 4.2 常用 Geometry 类型

```js
import * as THREE from 'three';

// ========== 基础几何体 ==========

// 立方体
// 参数：width, height, depth, widthSegments, heightSegments, depthSegments
const boxGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);

// 球体
// 参数：radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength
const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

// 平面
// 参数：width, height, widthSegments, heightSegments
const planeGeo = new THREE.PlaneGeometry(10, 10, 10, 10);

// 圆形
// 参数：radius, segments, thetaStart, thetaLength
const circleGeo = new THREE.CircleGeometry(1, 32);

// 圆柱体
// 参数：radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 3, 32);

// 圆锥体
// 参数：radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength
const coneGeo = new THREE.ConeGeometry(1, 2, 32);

// 圆环体（甜甜圈）
// 参数：radius, tube, radialSegments, tubularSegments, arc
const torusGeo = new THREE.TorusGeometry(2, 0.5, 16, 100);

// 圆环节（扇形环）
const torusKnotGeo = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);

// 二十面体（适合做低多边形球体）
// 参数：radius, detail（细分级别）
const icosaGeo = new THREE.IcosahedronGeometry(1, 0);

// 十二面体
const dodecaGeo = new THREE.DodecahedronGeometry(1, 0);

// 八面体
const octaGeo = new THREE.OctahedronGeometry(1, 0);

// 四面体
const tetraGeo = new THREE.TetrahedronGeometry(1, 0);

// ========== 高级几何体 ==========

// 文本几何体（需额外加载字体）
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// const textGeo = new TextGeometry('Hello', { font: loadedFont, size: 1, height: 0.2 });

// 挤压几何体（从 2D 形状挤压成 3D）
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(1, 0);
shape.lineTo(1, 1);
shape.lineTo(0, 1);
shape.lineTo(0, 0);
const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 2,
});

// 车削几何体（旋转体，如酒杯）
const points = [];
for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) + 1, (i - 5) * 0.2));
}
const latheGeo = new THREE.LatheGeometry(points, 32);

// 管道几何体（沿曲线生成管道）
const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, -1, 0),
    new THREE.Vector3(2, 0, 0),
]);
const tubeGeo = new THREE.TubeGeometry(path, 64, 0.2, 8, false);

// 参数化几何体（自定义函数生成曲面）
const paramGeo = new THREE.ParametricGeometry((u, v, target) => {
    const x = u * 10 - 5;
    const y = v * 10 - 5;
    const z = Math.sin(x) * Math.cos(y);
    target.set(x, y, z);
}, 50, 50);
```

**Geometry 常用方法：**

```js
// 计算包围盒和包围球
geometry.computeBoundingBox();
geometry.computeBoundingSphere();
console.log(geometry.boundingBox);

// 计算顶点法线（自定义 geometry 后需手动调用）
geometry.computeVertexNormals();

// 居中几何体
geometry.center();

// 缩放几何体（直接修改顶点数据）
geometry.scale(2, 2, 2);

// 平移几何体
geometry.translate(1, 0, 0);

// 旋转几何体
geometry.rotateX(Math.PI / 4);

// 合并几何体（减少 draw call）
// import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
// const merged = mergeGeometries([geo1, geo2, geo3]);

// 释放内存
geometry.dispose();
```

### 4.3 常用 Material 类型

```js
import * as THREE from 'three';

// ========== 基础材质 ==========

// MeshBasicMaterial：不受光照影响，自发光（用于调试、UI、精灵）
const basicMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,           // 颜色
    map: texture,              // 纹理贴图
    wireframe: false,          // 线框模式
    transparent: false,        // 是否透明
    opacity: 1.0,              // 不透明度
    side: THREE.FrontSide,     // 渲染面：FrontSide / BackSide / DoubleSide
    visible: true,             // 是否可见
});

// MeshLambertMaterial：漫反射材质，计算顶点光照（性能较好，效果一般）
const lambertMat = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    emissive: 0x000000,        // 自发光颜色
    emissiveIntensity: 1,      // 自发光强度
    map: texture,
});

// MeshPhongMaterial：镜面反射材质，计算每个像素的光照（有光泽效果）
const phongMat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    specular: 0x111111,        // 高光颜色
    shininess: 30,             // 高光强度（0-100）
    flatShading: false,        // 平面着色
});

// ========== PBR 材质（物理渲染，推荐）==========

// MeshStandardMaterial：标准 PBR 材质
const standardMat = new THREE.MeshStandardMaterial({
    color: 0xff0000,           // 基础颜色（albedo）
    map: diffuseMap,           // 颜色贴图
    roughness: 0.5,            // 粗糙度（0=镜面，1=漫反射）
    roughnessMap: roughMap,    // 粗糙度贴图
    metalness: 0.0,            // 金属度（0=非金属，1=金属）
    metalnessMap: metalMap,    // 金属度贴图
    normalMap: normalMap,      // 法线贴图
    normalScale: new THREE.Vector2(1, 1), // 法线强度
    bumpMap: bumpMap,          // 凹凸贴图
    bumpScale: 1,              // 凹凸强度
    aoMap: aoMap,              // 环境光遮蔽贴图
    aoMapIntensity: 1,         // AO 强度
    emissive: 0x000000,        // 自发光颜色
    emissiveMap: emissiveMap,  // 自发光贴图
    emissiveIntensity: 1,
    envMap: envMap,            // 环境贴图
    alphaMap: alphaMap,        // 透明贴图
    transparent: true,
});

// MeshPhysicalMaterial：扩展 PBR 材质（更多物理参数）
const physicalMat = new THREE.MeshPhysicalMaterial({
    ...standardMat,
    clearcoat: 1.0,            // 清漆层强度（如车漆）
    clearcoatRoughness: 0.1,   // 清漆层粗糙度
    reflectivity: 0.5,         // 反射率
    ior: 1.5,                  // 折射率（Index of Refraction）
    transmission: 0.0,         // 透光率（0-1，玻璃效果）
    thickness: 0.0,            // 厚度（影响次表面散射）
    sheen: 0.0,                // 光泽层（如天鹅绒）
    sheenColor: 0xffffff,
});

// ========== 特殊材质 ==========

// MeshToonMaterial：卡通渲染材质（阶梯式光照）
const toonMat = new THREE.MeshToonMaterial({
    color: 0xff0000,
    gradientMap: gradientTexture,  // 渐变贴图定义色阶
});

// MeshDepthMaterial：深度材质（灰度表示深度）
const depthMat = new THREE.MeshDepthMaterial();

// MeshNormalMaterial：法线材质（RGB 表示法线方向，调试法线用）
const normalMat = new THREE.MeshNormalMaterial();

// PointsMaterial：点材质（用于粒子）
const pointsMat = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 0.1,
    sizeAttenuation: true,     // 点随距离变小
});

// LineBasicMaterial / LineDashedMaterial：线材质
const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });

// SpriteMaterial：精灵材质（始终面向相机）
const spriteMat = new THREE.SpriteMaterial({ map: spriteTexture });

// ShaderMaterial：自定义 Shader 材质
const shaderMat = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xff0000) },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
            gl_FragColor = vec4(color * vUv.x + sin(time), 1.0);
        }
    `,
    transparent: true,
});
```

### 4.4 材质属性速查表

| 属性 | 适用材质 | 说明 |
|------|---------|------|
| `color` | 所有 | 基础颜色 |
| `map` | 所有 | 颜色纹理 |
| `alphaMap` | 支持透明 | 透明纹理（白色=不透明） |
| `transparent` | 所有 | 开启透明渲染 |
| `opacity` | 所有 | 不透明度 |
| `side` | 所有 | `FrontSide` / `BackSide` / `DoubleSide` |
| `visible` | 所有 | 是否可见 |
| `depthTest` | 所有 | 深度测试 |
| `depthWrite` | 所有 | 写入深度缓冲 |
| `roughness` | Standard / Physical | 粗糙度 |
| `metalness` | Standard / Physical | 金属度 |
| `normalMap` | Standard / Physical | 法线贴图 |
| `envMap` | Standard / Physical | 环境反射贴图 |
| `wireframe` | 大多数 | 线框模式 |

### 4.5 完整示例：创建多种物体

```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 灯光
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// 1. 红色标准材质立方体
const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.3, metalness: 0.5 })
);
box.position.set(-2, 0.5, 0);
scene.add(box);

// 2. 绿色光滑球体
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 100 })
);
sphere.position.set(0, 0.6, 0);
scene.add(sphere);

// 3. 蓝色线框圆环
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 16, 50),
    new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
);
torus.position.set(2, 0.5, 0);
scene.add(torus);

// 4. 半透明玻璃质感
const glass = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 0.9,
        thickness: 1,
        transparent: true,
        opacity: 1,
    })
);
glass.position.set(0, 2, 0);
scene.add(glass);

// 5. 地面
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

camera.position.set(0, 3, 5);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    box.rotation.y += 0.01;
    sphere.rotation.x += 0.01;
    torus.rotation.z += 0.01;
    renderer.render(scene, camera);
}
animate();
```

---

## 5. BufferGeometry 手动构建

`BufferGeometry` 是 Three.js 几何体的底层表示，直接操作 GPU 顶点数据。

### 5.1 BufferGeometry 核心概念

```
BufferGeometry
 ├─ attributes
 │   ├─ position: Float32BufferAttribute (x, y, z) * vertexCount
 │   ├─ normal:   Float32BufferAttribute (nx, ny, nz) * vertexCount
 │   ├─ uv:       Float32BufferAttribute (u, v) * vertexCount
 │   ├─ color:    Float32BufferAttribute (r, g, b) * vertexCount
 │   └─ [自定义]:  Float32BufferAttribute
 │
 ├─ index: Uint16BufferAttribute / Uint32BufferAttribute (可选，复用顶点)
 └─ groups: [{ start, count, materialIndex }] (多材质分组)
```

### 5.2 从零构建三角形

```js
import * as THREE from 'three';

// 创建一个 BufferGeometry
const geometry = new THREE.BufferGeometry();

// ========== 定义顶点位置 ==========
// 一个三角形 = 3 个顶点，每个顶点 3 个坐标 (x, y, z)
const vertices = new Float32Array([
    // 顶点 1
    -1.0, -1.0, 0.0,   // 左下
    // 顶点 2
     1.0, -1.0, 0.0,   // 右下
    // 顶点 3
     0.0,  1.0, 0.0,   // 上
]);

// 创建 position attribute
// 参数：每 3 个值组成一个顶点坐标
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// ========== 定义顶点法线 ==========
// 法线用于光照计算，必须归一化
const normals = new Float32Array([
    0, 0, 1,   // 三个顶点都朝向 +Z（因为是 2D 平面）
    0, 0, 1,
    0, 0, 1,
]);
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

// ========== 定义 UV 坐标 ==========
// UV 用于纹理映射，范围 [0, 1]
const uvs = new Float32Array([
    0, 0,   // 左下
    1, 0,   // 右下
    0.5, 1, // 上
]);
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

// ========== 定义顶点颜色 ==========
const colors = new Float32Array([
    1, 0, 0,   // 顶点 1：红色
    0, 1, 0,   // 顶点 2：绿色
    0, 0, 1,   // 顶点 3：蓝色
]);
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// 材质需设置 vertexColors: true
const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

### 5.3 使用索引构建矩形（复用顶点）

```js
import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();

// 只用 4 个顶点定义矩形
const vertices = new Float32Array([
    // 左下    右下    左上    右上
    -1, -1, 0,  1, -1, 0,  -1, 1, 0,  1, 1, 0
]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// 法线
const normals = new Float32Array([
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1
]);
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

// UV
const uvs = new Float32Array([
    0, 0,  1, 0,  0, 1,  1, 1
]);
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

// 索引：两个三角形
// 三角形 1: 0 -> 1 -> 2 (左下 -> 右下 -> 左上)
// 三角形 2: 2 -> 1 -> 3 (左上 -> 右下 -> 右上)
const indices = new Uint16Array([
    0, 1, 2,
    2, 1, 3
]);
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

// 计算法线（如果不手动提供）
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
```

### 5.4 构建彩色立方体（每个面不同颜色）

```js
import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();

// 立方体 8 个顶点
const vertices = new Float32Array([
    // 前面 (z = 1)
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
    // 后面 (z = -1)
    -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,
    // 上面 (y = 1)
    -1,  1, -1,  -1,  1,  1,   1,  1,  1,   1,  1, -1,
    // 下面 (y = -1)
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1,
    // 右面 (x = 1)
     1, -1, -1,   1,  1, -1,   1,  1,  1,   1, -1,  1,
    // 左面 (x = -1)
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1,
]);

// 每个面的颜色
const faceColors = [
    [1, 0, 0], // 前：红
    [0, 1, 0], // 后：绿
    [0, 0, 1], // 上：蓝
    [1, 1, 0], // 下：黄
    [1, 0, 1], // 右：紫
    [0, 1, 1], // 左：青
];

const colors = [];
faceColors.forEach(color => {
    // 每个面 4 个顶点，颜色相同
    for (let i = 0; i < 4; i++) {
        colors.push(...color);
    }
});

// 每个面的索引（6 个顶点 = 2 个三角形）
const indices = [];
for (let i = 0; i < 6; i++) {
    const offset = i * 4;
    indices.push(
        offset, offset + 1, offset + 2,
        offset, offset + 2, offset + 3
    );
}

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
geometry.setIndex(indices);
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.5,
    metalness: 0.1,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

### 5.5 动态更新顶点数据

```js
const geometry = new THREE.PlaneGeometry(10, 10, 50, 50);
const positions = geometry.attributes.position;

// 在动画循环中更新顶点高度（波浪效果）
function animate(time) {
    requestAnimationFrame(animate);

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        // z = sin(x + time) * cos(y + time)
        const z = Math.sin(x * 0.5 + time * 0.001) * Math.cos(y * 0.5 + time * 0.001);
        positions.setZ(i, z);
    }

    // 必须标记需要更新，否则 GPU 不会重新上传数据
    positions.needsUpdate = true;

    // 更新法线（如果光照需要正确）
    geometry.computeVertexNormals();

    renderer.render(scene, camera);
}
animate();
```

### 5.6 BufferGeometry 工具函数

```js
import * as THREE from 'three';

// ========== 高效创建大量粒子 ==========
const particleCount = 10000;
const particleGeo = new THREE.BufferGeometry();

const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    // 随机位置（球形分布）
    const r = 10 * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // 随机颜色
    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();

    // 随机大小
    sizes[i] = Math.random() * 2;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// 使用 ShaderMaterial 渲染粒子
const particleMat = new THREE.ShaderMaterial({
    uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load('spark.png') }
    },
    vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);
```

### 5.7 TypedArray 选择指南

| 数据类型 | 范围 | 用途 |
|----------|------|------|
| `Float32Array` | ±3.4×10³⁸ | 顶点位置、法线、UV、颜色 |
| `Uint16Array` | 0 ~ 65535 | 顶点索引（顶点数 < 65535） |
| `Uint32Array` | 0 ~ 4×10⁹ | 顶点索引（顶点数 >= 65535） |
| `Int8Array` | -128 ~ 127 | 骨骼权重、压缩数据 |
| `Uint8Array` | 0 ~ 255 | 颜色分量（0-255 映射到 0-1） |

---

## 6. Group 组织对象与坐标系变换

### 6.1 Group 场景图组织

```js
import * as THREE from 'three';

// ========== 基础 Group 使用 ==========
const group = new THREE.Group();
group.name = 'car';

// 添加子对象
group.add(bodyMesh);
group.add(wheel1);
group.add(wheel2);

// 将 group 添加到场景
scene.add(group);

// 对 group 进行变换会影响所有子对象
// 相当于局部坐标系
// group.position.set(10, 0, 0);
// group.rotation.y = Math.PI / 4;
// group.scale.set(2, 2, 2);

// 遍历 group
// group.children.forEach(child => console.log(child.name));

// 递归遍历
// group.traverse(obj => { ... });

// 从 group 中移除
// group.remove(wheel1);

// 清空 group
// while(group.children.length > 0) {
//     group.remove(group.children[0]);
// }

// ========== 嵌套 Group（复杂层级）==========
const car = new THREE.Group();
car.name = 'car';

// 车身
const chassis = new THREE.Group();
chassis.name = 'chassis';
chassis.add(bodyMesh);
chassis.add(cabinMesh);
car.add(chassis);

// 前轮组
const frontWheels = new THREE.Group();
frontWheels.position.set(1.5, 0, 0);
frontWheels.name = 'frontWheels';

const flWheel = new THREE.Mesh(wheelGeo, wheelMat);
flWheel.position.set(0, 0, 1);
frontWheels.add(flWheel);

const frWheel = new THREE.Mesh(wheelGeo, wheelMat);
frWheel.position.set(0, 0, -1);
frontWheels.add(frWheel);

car.add(frontWheels);

// 后轮组
const rearWheels = new THREE.Group();
rearWheels.position.set(-1.5, 0, 0);
rearWheels.name = 'rearWheels';

const rlWheel = new THREE.Mesh(wheelGeo, wheelMat);
rlWheel.position.set(0, 0, 1);
rearWheels.add(rlWheel);

const rrWheel = new THREE.Mesh(wheelGeo, wheelMat);
rrWheel.position.set(0, 0, -1);
rearWheels.add(rrWheel);

car.add(rearWheels);

scene.add(car);

// 控制前轮转向（只影响前轮组）
frontWheels.rotation.y = Math.PI / 6;

// 控制整车移动
car.position.x += 1;
```

### 6.2 坐标系变换详解

Three.js 使用**右手坐标系**：
- X 轴向右（红色）
- Y 轴向上（绿色）
- Z 轴朝向屏幕外（蓝色）

```js
import * as THREE from 'three';

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ========== 位置变换 ==========
mesh.position.x = 5;           // 直接设置分量
mesh.position.y = 2;
mesh.position.z = -3;

mesh.position.set(5, 2, -3);   // 一次性设置

mesh.position.add(new THREE.Vector3(1, 0, 0));     // 相对移动
mesh.position.sub(new THREE.Vector3(0, 1, 0));
mesh.position.multiplyScalar(2);                    // 缩放向量

// 朝向某点
mesh.lookAt(new THREE.Vector3(0, 0, 0));

// 沿方向移动
const direction = new THREE.Vector3(1, 0, 0).normalize();
mesh.position.add(direction.clone().multiplyScalar(0.1));

// ========== 旋转变换 ==========
// 注意：旋转顺序默认是 XYZ，可以通过 rotation.order 修改

mesh.rotation.x = Math.PI / 4;     // 绕 X 轴旋转 45 度
mesh.rotation.y = Math.PI / 2;     // 绕 Y 轴旋转 90 度
mesh.rotation.z = 0;

// 使用 setFromVector3 设置弧度
mesh.rotation.set(0, Math.PI / 2, 0, 'XYZ');

// 使用四元数（推荐，避免万向节死锁）
const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
mesh.quaternion.copy(quaternion);

// 或使用 Euler 转 Quaternion
const euler = new THREE.Euler(0, Math.PI / 4, 0, 'YXZ');
mesh.quaternion.setFromEuler(euler);

// ========== 缩放变换 ==========
mesh.scale.set(2, 1, 1);       // X 方向放大 2 倍
mesh.scale.multiplyScalar(1.5); // 整体放大 1.5 倍

// ========== 矩阵变换 ==========
// 直接操作变换矩阵（高级用法）
mesh.matrixAutoUpdate = false;  // 关闭自动更新

const matrix = new THREE.Matrix4();
matrix.makeTranslation(5, 0, 0);    // 平移矩阵
matrix.makeRotationY(Math.PI / 4);  // 旋转矩阵
matrix.makeScale(2, 2, 2);          // 缩放矩阵

// 组合变换：T * R * S
matrix.compose(
    new THREE.Vector3(5, 0, 0),                    // position
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI/4, 0)), // quaternion
    new THREE.Vector3(2, 2, 2)                     // scale
);

mesh.matrix.copy(matrix);
mesh.updateMatrixWorld(true);   // 更新世界矩阵
```

### 6.3 局部坐标系 vs 世界坐标系

```js
import * as THREE from 'three';

// 世界坐标系（scene 坐标系）
// 局部坐标系（parent 的坐标系）

// 获取/设置世界坐标
const worldPosition = new THREE.Vector3();
mesh.getWorldPosition(worldPosition);
console.log(worldPosition);

// 获取/设置世界旋转
const worldQuaternion = new THREE.Quaternion();
mesh.getWorldQuaternion(worldQuaternion);

// 获取世界缩放
const worldScale = new THREE.Vector3();
mesh.getWorldScale(worldScale);

// 将世界坐标转换为局部坐标
const localPos = mesh.worldToLocal(new THREE.Vector3(10, 0, 0));

// 将局部坐标转换为世界坐标
const worldPos = mesh.localToWorld(new THREE.Vector3(1, 0, 0));

// ========== 实用示例：让物体始终面向相机 ==========
function billboard(object, camera) {
    // 在 world space 中让 object 的 -Z 轴指向 camera
    object.lookAt(camera.position);
}

// ========== 实用示例：围绕某点旋转 ==========
function orbitAround(object, center, axis, angle) {
    const offset = object.position.clone().sub(center);
    offset.applyAxisAngle(axis, angle);
    object.position.copy(center).add(offset);
    object.lookAt(center);
}

// 使用：让 mesh 围绕原点 Y 轴旋转
orbitAround(mesh, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 0.01);
```

### 6.4 AxesHelper 可视化坐标系

```js
import * as THREE from 'three';

// 红色 = X 轴, 绿色 = Y 轴, 蓝色 = Z 轴
const axesHelper = new THREE.AxesHelper(5);  // 参数：长度
scene.add(axesHelper);

// 给物体添加局部坐标轴
const localAxes = new THREE.AxesHelper(1);
mesh.add(localAxes);  // 作为子对象，跟随 mesh 变换
```

---

## 7. 基础动画循环

### 7.1 requestAnimationFrame

```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
scene.add(cube);
camera.position.z = 5;

// ========== 基础动画循环 ==========
function animate() {
    // 请求下一帧
    requestAnimationFrame(animate);

    // 每帧更新逻辑
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // 渲染
    renderer.render(scene, camera);
}
animate();

// ========== 带暂停控制的动画循环 ==========
let isRunning = true;
let animationId;

function loop() {
    animationId = requestAnimationFrame(loop);

    if (!isRunning) return;

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// 暂停
function pause() { isRunning = false; }

// 恢复
function resume() {
    if (!isRunning) {
        isRunning = true;
    }
}

// 停止
function stop() {
    cancelAnimationFrame(animationId);
}
```

### 7.2 Clock —— 时间控制

```js
import * as THREE from 'three';

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    // 获取自上一帧以来的时间（秒）
    const delta = clock.getDelta();

    // 获取自时钟启动以来的总时间（秒）
    const elapsed = clock.getElapsedTime();

    // 基于时间的旋转（帧率无关）
    cube.rotation.x += 1 * delta;   // 每秒旋转 1 弧度
    cube.rotation.y += 0.5 * delta; // 每秒旋转 0.5 弧度

    // 正弦波动画
    cube.position.y = Math.sin(elapsed * 2) * 0.5;

    // 圆周运动
    cube.position.x = Math.cos(elapsed) * 2;
    cube.position.z = Math.sin(elapsed) * 2;

    renderer.render(scene, camera);
}
animate();

// ========== Clock 控制方法 ==========
// clock.start();      // 启动/重置时钟
// clock.stop();       // 停止
// clock.getDelta();   // 获取并返回自上次调用的时间差
// clock.getElapsedTime(); // 获取总经过时间
// clock.autoStart = true; // 是否在 getDelta 时自动启动
```

### 7.3 旋转 / 移动 / 缩放动画示例

```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建多个示例物体
const group = new THREE.Group();
scene.add(group);

// 1. 旋转动画物体
const spinner = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
spinner.position.set(-3, 0, 0);
group.add(spinner);

// 2. 移动动画物体
const mover = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
mover.position.set(0, 0, 0);
group.add(mover);

// 3. 缩放动画物体
const scaler = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
);
scaler.position.set(3, 0, 0);
group.add(scaler);

// 灯光
scene.add(new THREE.AmbientLight(0x404040));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

camera.position.set(0, 2, 8);
camera.lookAt(0, 0, 0);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // ========== 旋转 ==========
    // 方式 1：直接修改 rotation（欧拉角）
    spinner.rotation.x = elapsed;
    spinner.rotation.y = elapsed * 0.5;

    // 方式 2：使用 rotateOnAxis（绕任意轴旋转）
    // spinner.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.02);

    // 方式 3：使用 Quaternion（平滑插值）
    const targetQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(elapsed, elapsed * 0.5, 0)
    );
    // spinner.quaternion.slerp(targetQuaternion, 0.1);  // 球形插值

    // ========== 移动 ==========
    // 方式 1：正弦波移动
    mover.position.x = Math.sin(elapsed) * 2;
    mover.position.y = Math.cos(elapsed * 2) * 1;

    // 方式 2：沿路径移动
    const t = (elapsed * 0.2) % 1;
    const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(-1, 2, 0),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(2, 0, 0),
    ]);
    // mover.position.copy(path.getPointAt(t));

    // 方式 3：向目标点移动（lerp 插值）
    const targetPosition = new THREE.Vector3(Math.sin(elapsed) * 3, 0, 0);
    // mover.position.lerp(targetPosition, 0.05);

    // ========== 缩放 ==========
    // 方式 1：正弦波缩放
    const scale = 1 + Math.sin(elapsed * 3) * 0.3;
    scaler.scale.set(scale, scale, scale);

    // 方式 2：脉冲效果
    // const pulse = 1 + Math.max(0, Math.sin(elapsed * 5)) * 0.5;
    // scaler.scale.setScalar(pulse);

    // 方式 3：非均匀缩放
    // scaler.scale.set(1, Math.sin(elapsed) + 1, 1);

    renderer.render(scene, camera);
}
animate();
```

### 7.4 匀速与缓动动画

```js
import * as THREE from 'three';

const clock = new THREE.Clock();

// ========== 线性插值（Lerp）==========
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// Three.js 内置 lerp
const current = new THREE.Vector3(0, 0, 0);
const target = new THREE.Vector3(10, 5, 0);
current.lerp(target, 0.05);  // 每帧向目标移动 5%

// ========== 平滑阻尼（Smooth Damp）==========
// 类似弹簧，越接近目标速度越慢
function smoothDamp(current, target, velocity, smoothTime, deltaTime) {
    const omega = 2 / smoothTime;
    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    const change = current - target;
    const temp = (velocity + omega * change) * deltaTime;
    const newVelocity = (velocity - omega * temp) * exp;
    return target + (change + temp) * exp;
}

// ========== 常用缓动函数 ==========
const Easing = {
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutElastic: t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
};

// ========== 使用缓动函数的动画 ==========
const startPos = new THREE.Vector3(-5, 0, 0);
const endPos = new THREE.Vector3(5, 0, 0);
const duration = 2; // 秒

function animateWithEasing() {
    requestAnimationFrame(animateWithEasing);
    const elapsed = clock.getElapsedTime();

    // 计算进度 [0, 1]
    let t = Math.min(elapsed / duration, 1);

    // 应用缓动
    t = Easing.easeOutCubic(t);

    // 插值位置
    mesh.position.lerpVectors(startPos, endPos, t);

    renderer.render(scene, camera);
}
```

---

## 8. 奇淫技巧

### 8.1 自适应 DPI（像素比管理）

```js
import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({ antialias: true });

// ========== 基础自适应 ==========
function setPixelRatio() {
    const dpr = Math.min(window.devicePixelRatio, 2); // 限制最大为 2
    renderer.setPixelRatio(dpr);
}
setPixelRatio();

// ========== 进阶：根据性能动态调整 ==========
let targetDpr = Math.min(window.devicePixelRatio, 2);
let currentDpr = targetDpr;

function updatePixelRatio() {
    // 平滑过渡 DPR
    currentDpr += (targetDpr - currentDpr) * 0.1;
    renderer.setPixelRatio(currentDpr);
}

// 性能差时降低 DPR
function onPerformanceDrop() {
    targetDpr = 1;
}

// 性能好时恢复 DPR
function onPerformanceRecover() {
    targetDpr = Math.min(window.devicePixelRatio, 2);
}

// ========== 完整自适应管理器 ==========
class PixelRatioManager {
    constructor(renderer, options = {}) {
        this.renderer = renderer;
        this.maxDpr = options.maxDpr || 2;
        this.minDpr = options.minDpr || 1;
        this.currentDpr = this.maxDpr;
        this.targetDpr = this.maxDpr;

        window.addEventListener('resize', () => this.update());
        this.update();
    }

    update() {
        this.targetDpr = Math.min(window.devicePixelRatio, this.maxDpr);
        // 在移动端或弱性能设备上限制
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
            this.targetDpr = Math.min(this.targetDpr, 1.5);
        }
        this.apply();
    }

    apply() {
        this.currentDpr = this.targetDpr;
        this.renderer.setPixelRatio(this.currentDpr);
    }

    setQuality(quality) {
        // quality: 'low' | 'medium' | 'high'
        const map = { low: 1, medium: 1.5, high: this.maxDpr };
        this.targetDpr = map[quality] || this.maxDpr;
        this.apply();
    }
}

// 使用
const prManager = new PixelRatioManager(renderer, { maxDpr: 2 });
```

### 8.2 Resize 防抖

```js
import * as THREE from 'three';

// ========== 基础 Resize 处理 ==========
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== 防抖 Resize（避免频繁重计算）==========
function debounceResize(callback, delay = 200) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => callback.apply(this, args), delay);
    };
}

window.addEventListener('resize', debounceResize(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // 如果有 effect composer / render target，也需要更新
    // composer.setSize(width, height);
}, 100));

// ========== ResizeObserver（更精确，包含 CSS 缩放）==========
const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const { width, height } = entry.contentRect;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
});
resizeObserver.observe(renderer.domElement.parentElement);

// ========== 完整 Resize 管理器 ==========
class ResizeManager {
    constructor(camera, renderer, options = {}) {
        this.camera = camera;
        this.renderer = renderer;
        this.delay = options.delay || 100;
        this.timer = null;
        this.observer = null;

        if (options.useObserver && renderer.domElement.parentElement) {
            this.observer = new ResizeObserver((entries) => this.handle(entries));
            this.observer.observe(renderer.domElement.parentElement);
        } else {
            window.addEventListener('resize', () => this.onWindowResize());
        }
    }

    handle(entries) {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            this.resize(width, height);
        }
    }

    onWindowResize() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.resize(window.innerWidth, window.innerHeight);
        }, this.delay);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        } else {
            window.removeEventListener('resize', this.onWindowResize);
        }
        clearTimeout(this.timer);
    }
}

// 使用
// const resizeManager = new ResizeManager(camera, renderer, { useObserver: true });
```

### 8.3 极速创建场景函数

```js
import * as THREE from 'three';

/**
 * 极速创建标准 Three.js 场景
 * @param {Object} options
 * @returns {Object} { scene, camera, renderer, controls, clock }
 */
export function createScene(options = {}) {
    const {
        container = document.body,
        bgColor = 0x000000,
        fov = 75,
        near = 0.1,
        far = 1000,
        cameraPosition = [0, 0, 5],
        antialias = true,
        shadows = true,
        orbitControls = false,
        lights = true,
    } = options;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(...cameraPosition);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = shadows;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lights
    if (lights) {
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = shadows;
        scene.add(dirLight);
    }

    // Controls
    let controls = null;
    if (orbitControls) {
        // 动态导入避免未使用时的打包体积
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
    }

    // Clock
    const clock = new THREE.Clock();

    // Auto resize
    const resizeHandler = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', resizeHandler);

    // Render loop helper
    const callbacks = [];
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        callbacks.forEach(cb => cb({ delta, elapsed, scene, camera, renderer }));

        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    animate();

    return {
        scene,
        camera,
        renderer,
        controls,
        clock,
        onUpdate: (cb) => callbacks.push(cb),
        destroy: () => {
            window.removeEventListener('resize', resizeHandler);
            renderer.dispose();
            container.removeChild(renderer.domElement);
        },
    };
}

// ========== 使用示例 ==========
// const { scene, camera, renderer, onUpdate } = createScene({
//     container: document.getElementById('canvas-container'),
//     bgColor: 0x87CEEB,
//     orbitControls: true,
//     shadows: true,
// });
//
// const mesh = new THREE.Mesh(
//     new THREE.BoxGeometry(),
//     new THREE.MeshStandardMaterial({ color: 0xff0000 })
// );
// scene.add(mesh);
//
// onUpdate(({ elapsed }) => {
//     mesh.rotation.y = elapsed;
// });
```

### 8.4 扩展 Mesh 原型方法

```js
import * as THREE from 'three';

// ========== 安全地扩展 Mesh 原型 ==========

/**
 * 设置网格材质属性（链式调用）
 */
THREE.Mesh.prototype.setMaterial = function(material) {
    this.material = material;
    return this;
};

/**
 * 快速设置位置（支持链式调用）
 */
THREE.Mesh.prototype.setPosition = function(x, y, z) {
    this.position.set(x, y, z);
    return this;
};

/**
 * 快速设置旋转（弧度）
 */
THREE.Mesh.prototype.setRotation = function(x, y, z) {
    this.rotation.set(x, y, z);
    return this;
};

/**
 * 快速设置缩放
 */
THREE.Mesh.prototype.setScale = function(x, y, z) {
    if (y === undefined && z === undefined) {
        this.scale.setScalar(x);
    } else {
        this.scale.set(x, y, z ?? x);
    }
    return this;
};

/**
 * 设置阴影
 */
THREE.Mesh.prototype.setShadow = function(cast = true, receive = true) {
    this.castShadow = cast;
    this.receiveShadow = receive;
    return this;
};

/**
 * 设置名称
 */
THREE.Mesh.prototype.setName = function(name) {
    this.name = name;
    return this;
};

/**
 * 添加到指定父对象（默认 scene）
 */
THREE.Mesh.prototype.addTo = function(parent) {
    parent.add(this);
    return this;
};

/**
 * 深拷贝网格
 */
THREE.Mesh.prototype.deepClone = function() {
    const clone = this.clone();
    if (this.geometry) clone.geometry = this.geometry.clone();
    if (this.material) {
        clone.material = Array.isArray(this.material)
            ? this.material.map(m => m.clone())
            : this.material.clone();
    }
    return clone;
};

/**
 * 获取世界空间尺寸
 */
THREE.Mesh.prototype.getWorldSize = function() {
    const box = new THREE.Box3().setFromObject(this);
    return box.getSize(new THREE.Vector3());
};

/**
 * 居中几何体
 */
THREE.Mesh.prototype.centerGeometry = function() {
    this.geometry.center();
    return this;
};

/**
 * 销毁网格（释放内存）
 */
THREE.Mesh.prototype.dispose = function() {
    if (this.geometry) {
        this.geometry.dispose();
    }
    if (this.material) {
        if (Array.isArray(this.material)) {
            this.material.forEach(m => m.dispose());
        } else {
            this.material.dispose();
        }
    }
    if (this.parent) {
        this.parent.remove(this);
    }
};

// ========== 链式调用示例 ==========
// const mesh = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshStandardMaterial({ color: 0xff0000 })
// )
// .setPosition(2, 0, 0)
// .setRotation(0, Math.PI / 4, 0)
// .setScale(2)
// .setShadow(true, true)
// .setName('hero')
// .addTo(scene);

// ========== Object3D 通用扩展 ==========

/**
 * 朝向目标但限制轴向（如只沿 Y 轴旋转）
 */
THREE.Object3D.prototype.lookAtY = function(target) {
    const pos = this.position.clone();
    const targetPos = target instanceof THREE.Vector3 ? target : target.position;
    const dx = targetPos.x - pos.x;
    const dz = targetPos.z - pos.z;
    this.rotation.y = Math.atan2(dx, dz);
    return this;
};

/**
 * 平滑移动到目标位置
 */
THREE.Object3D.prototype.moveTowards = function(target, speed, delta) {
    const direction = new THREE.Vector3().subVectors(target, this.position);
    const distance = direction.length();
    if (distance > 0) {
        const moveDistance = Math.min(distance, speed * delta);
        direction.normalize().multiplyScalar(moveDistance);
        this.position.add(direction);
    }
    return this;
};
```

### 8.5 性能监控辅助

```js
import * as THREE from 'three';

/**
 * 简单的性能监控面板
 */
class Stats {
    constructor() {
        this.dom = document.createElement('div');
        this.dom.style.cssText = `
            position: fixed; top: 0; left: 0; background: rgba(0,0,0,0.7);
            color: #0f0; font-family: monospace; font-size: 12px;
            padding: 8px; pointer-events: none; z-index: 9999;
        `;
        document.body.appendChild(this.dom);

        this.frames = 0;
        this.prevTime = performance.now();
        this.fps = 0;
    }

    update(renderer) {
        this.frames++;
        const time = performance.now();
        if (time >= this.prevTime + 1000) {
            this.fps = Math.round((this.frames * 1000) / (time - this.prevTime));
            this.frames = 0;
            this.prevTime = time;
        }

        const info = renderer.info;
        this.dom.innerHTML = `
            FPS: ${this.fps}<br>
            Calls: ${info.render.calls}<br>
            Triangles: ${info.render.triangles}<br>
            Geometries: ${info.memory.geometries}<br>
            Textures: ${info.memory.textures}
        `;
    }
}

// 使用
// const stats = new Stats();
// function animate() {
//     requestAnimationFrame(animate);
//     // ... 渲染逻辑
//     renderer.render(scene, camera);
//     stats.update(renderer);
// }
```

---

## 总结

| 知识点 | 核心要点 |
|--------|---------|
| 环境搭建 | Vite（现代项目）、Webpack（旧项目）、CDN（快速原型） |
| 三大核心 | Scene 管理场景图，Camera 定义视角，Renderer 执行绘制 |
| 相机对比 | Perspective 真实透视，Orthographic 平行投影 |
| 物体系统 | Geometry（形状）+ Material（外观）= Mesh（可渲染物体） |
| BufferGeometry | 直接操作 GPU 顶点数据，掌握 position/normal/uv/index |
| Group | 组织层级结构，理解局部/世界坐标系转换 |
| 动画循环 | requestAnimationFrame + Clock 实现帧率无关动画 |
| 实用技巧 | DPI 自适应、Resize 防抖、快速创建函数、原型扩展 |

---

## 参考链接

- [Three.js 官方文档](https://threejs.org/docs/)
- [Three.js 官方示例](https://threejs.org/examples/)
- [Three.js Journey 教程](https://threejs-journey.com/)



---

## 相关阅读

- [帧缓冲与后处理管线](帧缓冲与后处理管线.md)
- [GPU 性能优化与着色器调试](GPU 性能优化与着色器调试.md)
- [WebGPU 与 Compute Shader 入门](WebGPU 与 Compute Shader 入门.md)

- [ThreeJS光照与阴影系统](./ThreeJS光照与阴影系统.md) — 光照是 Three.js 核心功能
- [ThreeJS交互与性能优化](./ThreeJS交互与性能优化.md) — 交互系统进阶
- [ThreeJS物理引擎实战](./ThreeJS物理引擎实战.md) — 物理引擎基于核心对象

---

## 在线示例

- [Three.js Basic Examples](https://threejs.org/examples/) — Three.js 官方示例大全
- [Hello Cube](https://threejs.org/manual/#en/fundamentals) — Three.js 官方教程
- [Scene Graph](https://threejs.org/examples/?q=scene) — 场景图示例

---

## 参考资料

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Journey](https://threejs-journey.com/)