---
title: ThreeJS 骨骼动画系统
tags:
  - WebGL
  - ThreeJS
  - 骨骼动画
  - GLTF
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# ThreeJS 骨骼动画系统

骨骼动画（Skeletal Animation）是 3D 实时渲染中最核心的动画技术之一。ThreeJS 提供了完整的骨骼动画 API，涵盖从模型加载、动画播放到程序化生成的完整链路。本文将从原理到实践，全面解析 ThreeJS 骨骼动画系统。

---

## 一、骨骼动画原理：SkinnedMesh、Skeleton、Bone 关系详解

### 1.1 核心概念

骨骼动画的本质是**顶点蒙皮（Vertex Skinning）**： mesh 的顶点不再由单一矩阵驱动，而是由多根骨骼的变换矩阵按权重混合驱动。

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  SkinnedMesh │────▶│  Skeleton   │────▶│    Bone     │
│  (蒙皮网格)   │     │  (骨骼系统)  │     │   (骨骼)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  geometry   │     │   material  │
│skinIndex/   │     │ (支持骨骼的)│
│skinWeight   │     │             │
└─────────────┘     └─────────────┘
```

### 1.2 Bone（骨骼）

`Bone` 继承自 `Object3D`，是骨骼层级中的节点。每根骨骼都有一个**本地变换矩阵**和通过层级累积的**世界变换矩阵**。

```js
// 骨骼的创建与层级关系
const spine = new THREE.Bone();      // 脊柱
const neck = new THREE.Bone();       // 脖子
const head = new THREE.Bone();       // 头

spine.add(neck);                     // 建立父子关系
neck.add(head);

// 设置骨骼的初始姿态（绑定姿势，Bind Pose）
neck.position.set(0, 1.5, 0);
head.position.set(0, 0.5, 0);
```

### 1.3 Skeleton（骨骼系统）

`Skeleton` 是 `Bone` 的扁平化集合，负责管理骨骼矩阵并上传 GPU。它维护两个核心数据：

| 属性 | 类型 | 说明 |
|------|------|------|
| `bones` | `Bone[]` | 骨骼数组，保持层级引用 |
| `boneInverses` | `Matrix4[]` | 每根骨骼绑定姿势世界矩阵的**逆矩阵** |

```js
const skeleton = new THREE.Skeleton(bones);

// boneInverses 在构造函数中自动计算：
// boneInverses[i] = bones[i].matrixWorld.inverse()
// 用于将顶点从世界空间转换到骨骼的局部空间
```

**关键理解**：
- `boneInverses` 在绑定时刻（bind time）计算并固定
- 运行时顶点位置 = 当前骨骼世界矩阵 × `boneInverse` × 顶点绑定位置

### 1.4 SkinnedMesh（蒙皮网格）

`SkinnedMesh` 是骨骼动画的载体，继承自 `Mesh`。核心属性：

```js
const skinnedMesh = new THREE.SkinnedMesh(geometry, material);

// 绑定骨骼
skinnedMesh.bind(skeleton, bindMatrix);

// 关键属性
skinnedMesh.skeleton      // Skeleton 实例
skinnedMesh.bindMode      // "attached" | "detached"
skinnedMesh.bindMatrix    // 绑定时的世界矩阵
skinnedMesh.bindMatrixInverse // bindMatrix 的逆
```

**bindMode 详解**：
- `"attached"`（默认）：SkinnedMesh 的世界矩阵影响骨骼，骨骼跟随 mesh 移动
- `"detached"`：SkinnedMesh 的世界矩阵不影响骨骼，骨骼独立存在于世界空间

### 1.5 顶点蒙皮数学原理

顶点最终位置计算公式：

```
vertex_final = Σ (weight_i × boneMatrix_i × boneInverse_i × vertex_bind)
              i=0..3
```

其中：
- `vertex_bind`：绑定姿势下的顶点位置（模型空间）
- `boneInverse_i`：第 i 根骨骼绑定姿势世界矩阵的逆
- `boneMatrix_i`：第 i 根骨骼当前的世界矩阵
- `weight_i`：顶点受第 i 根骨骼影响的权重（`skinWeight`）

GPU 中每顶点通常支持 **4 根骨骼**（RGBA 四个通道存储）。

---

## 二、GLTFLoader 加载骨骼模型

GLTF（GL Transmission Format）是目前 Web 端骨骼动画的标准格式，ThreeJS 推荐优先使用。

### 2.1 基础加载流程

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

loader.load(
  'models/character.glb',
  (gltf) => {
    // gltf 对象结构
    // {
    //   scene: Group,        // 场景根节点
    //   scenes: [Group],     // 所有场景
    //   cameras: [Camera],   // 相机
    //   animations: [AnimationClip], // 动画剪辑
    //   asset: {...},        // 元数据
    //   parser: GLTFParser   // 内部解析器
    // }

    const model = gltf.scene;
    const animations = gltf.animations;

    // 添加到场景
    scene.add(model);

    // 设置动画
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(animations[0]);
      action.play();
    }
  },
  (progress) => {
    console.log(`${(progress.loaded / progress.total * 100).toFixed(0)}% loaded`);
  },
  (error) => {
    console.error('GLTF 加载失败:', error);
  }
);
```

### 2.2 获取 SkinnedMesh 和 Skeleton

```js
function findSkinnedMeshes(object) {
  const result = [];
  object.traverse((child) => {
    if (child.isSkinnedMesh) {
      result.push(child);
      console.log('找到 SkinnedMesh:', child.name);
      console.log('  Skeleton:', child.skeleton);
      console.log('  Bones数量:', child.skeleton.bones.length);
    }
  });
  return result;
}

const skinnedMeshes = findSkinnedMeshes(gltf.scene);
```

### 2.3 处理多场景与多动画

```js
// 自动播放所有动画（循环）
const mixers = [];

gltf.animations.forEach((clip, index) => {
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(clip);
  
  // 设置动画名称便于后续控制
  action.name = clip.name || `animation_${index}`;
  action.play();
  
  mixers.push(mixer);
});

// 在渲染循环中更新所有 mixer
function animate(deltaTime) {
  mixers.forEach(mixer => mixer.update(deltaTime));
  renderer.render(scene, camera);
}
```

### 2.4 Draco/KTX2 压缩模型加载

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const loader = new GLTFLoader();

// Draco 压缩支持
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/'); // Draco 解码器路径
loader.setDRACOLoader(dracoLoader);

// KTX2/Basis 纹理压缩支持
const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('/basis/');
ktx2Loader.detectSupport(renderer);
loader.setKTX2Loader(ktx2Loader);

loader.load('models/compressed.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

---

## 三、AnimationMixer 详解

`AnimationMixer` 是骨骼动画的**时间轴控制器**，管理所有动画片段的混合与更新。

### 3.1 创建

```js
// root 可以是 SkinnedMesh、Skeleton 或包含骨骼的 Group
const mixer = new THREE.AnimationMixer(skinnedMesh);

// 或者对整个模型创建 mixer（推荐）
const mixer = new THREE.AnimationMixer(gltf.scene);
```

### 3.2 update：驱动动画的核心

```js
// 方式一：固定时间步长（不推荐用于生产环境）
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // 上一帧到当前帧的时间（秒）
  mixer.update(delta);
  renderer.render(scene, camera);
}

// 方式二：固定帧率（更稳定）
const FIXED_TIME_STEP = 1 / 60;
let accumulator = 0;

function animate(deltaTime) {
  accumulator += deltaTime;
  while (accumulator >= FIXED_TIME_STEP) {
    mixer.update(FIXED_TIME_STEP);
    accumulator -= FIXED_TIME_STEP;
  }
}

// 方式三：带时间缩放的全局控制
const globalTimeScale = 1.0;

function animate() {
  const delta = clock.getDelta();
  mixer.update(delta * globalTimeScale); // 0.5 = 慢放, 2.0 = 快放
}
```

### 3.3 销毁与内存管理

```js
// 停止所有动画
mixer.stopAllAction();

// 注销特定 action
const action = mixer.clipAction(clip);
action.stop();
mixer.uncacheAction(clip); // 从缓存中移除

// 彻底销毁 mixer
mixer.stopAllAction();
gltf.animations.forEach(clip => {
  mixer.uncacheClip(clip);
});
mixer.uncacheRoot(rootObject);
```

**内存泄漏警示**：
- 切换模型时必须 `stopAllAction()` + `uncacheAction()`
- `AnimationMixer` 会缓存创建的 `clipAction`，重复创建相同 clip 的 action 会返回缓存实例

### 3.4 事件监听

```js
// 动画开始
mixer.addEventListener('loop', (e) => {
  console.log('动画循环:', e.action.getClip().name);
});

// 动画结束（非循环动画）
mixer.addEventListener('finished', (e) => {
  console.log('动画结束:', e.action.getClip().name);
  e.action.reset(); // 重置以便再次播放
});
```

---

## 四、clipAction 控制

`AnimationMixer.clipAction(clip)` 返回 `AnimationAction`，这是动画控制的**最细粒度单元**。

### 4.1 基础状态控制

```js
const action = mixer.clipAction(clip);

// 播放
action.play();

// 暂停（保持当前时间）
action.paused = true;   // 暂停
action.paused = false;  // 恢复

// 停止（重置到起始状态）
action.stop();

// 重置（时间归零，不自动播放）
action.reset();

// 是否有效
action.isRunning();  // 是否正在播放且未暂停
action.isScheduled(); // 是否被 mixer 调度
```

### 4.2 时间控制

```js
// 当前播放时间（秒）
action.time = 2.5; // 跳到 2.5 秒处

// 时间缩放：负数实现反向播放
action.timeScale = 1.0;   // 正常速度
action.timeScale = 2.0;   // 2 倍速
action.timeScale = 0.5;   // 半速
action.timeScale = -1.0;  // 反向播放
action.timeScale = 0;     // 冻结

// 受全局 mixer.timeScale 影响：
// 实际速度 = action.timeScale * mixer.timeScale

// 循环模式
action.loop = THREE.LoopOnce;      // 播放一次
action.loop = THREE.LoopRepeat;    // 循环（默认）
action.loop = THREE.LoopPingPong;  // 往返循环

// 循环次数（LoopRepeat 模式下）
action.repetitions = 3; // 循环 3 次

// 是否首尾无缝衔接（解决循环时的卡顿）
action.zeroSlopeAtEnd = true;
action.zeroSlopeAtBegin = true;
```

### 4.3 权重与混合

```js
// 权重：0 = 完全无效，1 = 完全生效
action.weight = 1.0;
action.setEffectiveWeight(0.5); // 受全局权重影响后的实际权重

// 有效时间缩放
action.setEffectiveTimeScale(-1.0);

// 启用/禁用
action.enabled = true;

// 淡化控制（平滑改变 weight）
action.fadeIn(0.5);   // 0.5 秒内 weight 从 0 渐变到 1
action.fadeOut(0.5);  // 0.5 秒内 weight 从 当前值 渐变到 0
```

### 4.4 完整控制示例

```js
class AnimationController {
  constructor(mixer) {
    this.mixer = mixer;
    this.actions = new Map();
  }

  register(name, clip) {
    const action = this.mixer.clipAction(clip);
    action.name = name;
    action.clampWhenFinished = true; // 播放结束后保持最后一帧
    this.actions.set(name, action);
    return action;
  }

  play(name, fadeDuration = 0.2) {
    const action = this.actions.get(name);
    if (!action) return;

    // 停止其他动画（带淡出）
    this.actions.forEach((otherAction, otherName) => {
      if (otherName !== name && otherAction.isRunning()) {
        otherAction.fadeOut(fadeDuration);
      }
    });

    action.reset().fadeIn(fadeDuration).play();
  }

  pause(name) {
    const action = this.actions.get(name);
    action?.halt(fadeDuration); // 暂停并淡出
  }

  setTimeScale(name, scale) {
    this.actions.get(name)?.setEffectiveTimeScale(scale);
  }
}
```

---

## 五、动画过渡与混合

### 5.1 fadeIn / fadeOut

最简单的过渡方式，适合单动画切换场景：

```js
const idleAction = mixer.clipAction(idleClip);
const runAction = mixer.clipAction(runClip);

// 从 idle 切换到 run
idleAction.fadeOut(0.5);   // 0.5 秒内淡出
runAction.reset().fadeIn(0.5).play(); // 0.5 秒内淡入
```

### 5.2 crossFadeFrom / crossFadeTo

更精确的交叉淡化，自动处理时间同步：

```js
// 方式一：从指定 action 交叉淡化
runAction.reset().play();
runAction.crossFadeFrom(idleAction, 0.5, false); // 0.5 秒过渡，不同步时间

// 方式二：向指定 action 交叉淡化
idleAction.crossFadeTo(runAction, 0.5, true); // 0.5 秒过渡，同步 warp

// 第三个参数 warp（布尔值）：
// true = 在过渡期间调整两个动画的播放速度，使它们在同一时刻结束
// false = 保持各自原有速度
```

### 5.3 多动画同时播放（混合树）

```js
// 同时播放多个动画，通过 weight 控制混合比例
const baseAction = mixer.clipAction(walkClip);
const additiveAction = mixer.clipAction(waveHandClip);

baseAction.play();
additiveAction.play();

// 基础动画全权重
baseAction.weight = 1.0;

// 叠加动画部分权重
additiveAction.weight = 0.5;

// 在渲染循环中动态调整
function updateBlend(value) {
  // value: 0~1，控制走和跑的混合
  walkAction.weight = 1 - value;
  runAction.weight = value;
}
```

### 5.4 动画层级（Animation Blending Layers）

```js
// 上半身和下半身分别控制
const lowerBodyBones = ['Hips', 'LeftLeg', 'RightLeg', 'LeftFoot', 'RightFoot'];
const upperBodyBones = ['Spine', 'Chest', 'Neck', 'Head', 'LeftArm', 'RightArm'];

// ThreeJS 本身没有内置 layer 系统，但可以通过以下方式实现：
// 1. 分离骨骼为不同的 Skeleton
// 2. 或使用多个 SkinnedMesh（不推荐）

// 实际方案：自定义混合器，按骨骼名过滤 tracks
function createMaskedAction(mixer, clip, boneNames) {
  const tracks = clip.tracks.filter(track => {
    const boneName = track.name.split('.')[0];
    return boneNames.includes(boneName);
  });
  
  const maskedClip = new THREE.AnimationClip(clip.name + '_masked', clip.duration, tracks);
  return mixer.clipAction(maskedClip);
}
```

---

## 六、程序化创建骨骼

从头创建骨骼动画是理解底层原理的最佳方式。

### 6.1 创建 Bone 层级

```js
function createSkeleton() {
  // 根骨骼
  const hips = new THREE.Bone();
  hips.name = 'Hips';
  hips.position.set(0, 1.0, 0);

  // 脊柱
  const spine = new THREE.Bone();
  spine.name = 'Spine';
  spine.position.set(0, 0.3, 0);
  hips.add(spine);

  // 头
  const head = new THREE.Bone();
  head.name = 'Head';
  head.position.set(0, 0.5, 0);
  spine.add(head);

  // 左臂
  const leftArm = new THREE.Bone();
  leftArm.name = 'LeftArm';
  leftArm.position.set(0.3, 0.2, 0);
  spine.add(leftArm);

  const leftForeArm = new THREE.Bone();
  leftForeArm.name = 'LeftForeArm';
  leftForeArm.position.set(0, -0.4, 0);
  leftArm.add(leftForeArm);

  // 右臂
  const rightArm = new THREE.Bone();
  rightArm.name = 'RightArm';
  rightArm.position.set(-0.3, 0.2, 0);
  spine.add(rightArm);

  // 腿部...

  // 扁平化骨骼数组（按遍历顺序）
  const bones = [];
  hips.traverse(bone => bones.push(bone));

  return { root: hips, bones };
}
```

### 6.2 创建 Skeleton

```js
const { root, bones } = createSkeleton();
const skeleton = new THREE.Skeleton(bones);

// boneInverses 自动计算完成
console.log(skeleton.boneInverses); // [Matrix4, Matrix4, ...]
```

### 6.3 创建 SkinnedMesh 几何体

**核心难点**：为每个顶点分配 `skinIndex`（受哪些骨骼影响）和 `skinWeight`（影响权重）。

```js
function createSkinnedGeometry() {
  const geometry = new THREE.BoxGeometry(1, 2, 0.5, 4, 8, 2);
  const positionAttribute = geometry.attributes.position;
  const vertexCount = positionAttribute.count;

  // 每个顶点最多受 4 根骨骼影响（RGBA）
  const skinIndices = new Float32Array(vertexCount * 4);
  const skinWeights = new Float32Array(vertexCount * 4);

  // 骨骼映射：假设 bones 数组为 [Hips, Spine, Head, LeftArm, LeftForeArm, RightArm]
  const boneIndexMap = {
    'Hips': 0,
    'Spine': 1,
    'Head': 2,
    'LeftArm': 3,
    'LeftForeArm': 4,
    'RightArm': 5
  };

  for (let i = 0; i < vertexCount; i++) {
    const y = positionAttribute.getY(i);
    
    // 简化示例：按 Y 坐标分配骨骼
    let boneIndex1, boneIndex2;
    let weight1, weight2;

    if (y < 0.5) {
      // 下半部分：主要受 Hips 影响
      boneIndex1 = boneIndexMap['Hips'];
      weight1 = 1.0;
      boneIndex2 = 0;
      weight2 = 0;
    } else if (y < 1.3) {
      // 中部：Spine 和 Hips 混合
      boneIndex1 = boneIndexMap['Spine'];
      boneIndex2 = boneIndexMap['Hips'];
      const t = (y - 0.5) / 0.8; // 0~1
      weight1 = t;
      weight2 = 1 - t;
    } else {
      // 上部：Head 和 Spine 混合
      boneIndex1 = boneIndexMap['Head'];
      boneIndex2 = boneIndexMap['Spine'];
      const t = (y - 1.3) / 0.7;
      weight1 = t;
      weight2 = 1 - t;
    }

    // 设置 skinIndex（必须是 float，但在 shader 中按 int 读取）
    skinIndices[i * 4 + 0] = boneIndex1;
    skinIndices[i * 4 + 1] = boneIndex2;
    skinIndices[i * 4 + 2] = 0;
    skinIndices[i * 4 + 3] = 0;

    // 设置 skinWeight（必须归一化，和为 1）
    const sum = weight1 + weight2;
    skinWeights[i * 4 + 0] = weight1 / sum;
    skinWeights[i * 4 + 1] = weight2 / sum;
    skinWeights[i * 4 + 2] = 0;
    skinWeights[i * 4 + 3] = 0;
  }

  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

  return geometry;
}
```

### 6.4 skinIndex 和 skinWeight 详解

| 属性 | 格式 | 说明 |
|------|------|------|
| `skinIndex` | `Uint16BufferAttribute(itemSize=4)` | 每顶点 4 个整数索引，指向 `skeleton.bones` 数组 |
| `skinWeight` | `Float32BufferAttribute(itemSize=4)` | 每顶点 4 个浮点数权重，通常需满足 `w0+w1+w2+w3 = 1` |

**计算原则**：

1. **距离判断**：顶点受距离最近的 N 根骨骼影响（通常 4 根）
2. **权重衰减**：权重可按距离反比或余弦衰减计算
3. **归一化**：4 个权重之和应为 1.0

```js
// 自动权重计算（基于顶点与骨骼点的距离）
function computeSkinWeights(geometry, bones, bonePositions) {
  const MAX_INFLUENCES = 4;
  const count = geometry.attributes.position.count;
  const indices = new Float32Array(count * MAX_INFLUENCES);
  const weights = new Float32Array(count * MAX_INFLUENCES);

  for (let i = 0; i < count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(geometry.attributes.position, i);

    // 计算到每根骨骼的距离
    const influences = bones.map((bone, index) => {
      const dist = vertex.distanceTo(bonePositions[index]);
      return { index, dist, weight: 1 / (dist * dist + 0.001) };
    });

    // 取最近的 4 根
    influences.sort((a, b) => a.dist - b.dist);
    const nearest = influences.slice(0, MAX_INFLUENCES);

    // 归一化权重
    const totalWeight = nearest.reduce((s, v) => s + v.weight, 0);
    
    for (let j = 0; j < MAX_INFLUENCES; j++) {
      if (j < nearest.length) {
        indices[i * MAX_INFLUENCES + j] = nearest[j].index;
        weights[i * MAX_INFLUENCES + j] = nearest[j].weight / totalWeight;
      } else {
        indices[i * MAX_INFLUENCES + j] = 0;
        weights[i * MAX_INFLUENCES + j] = 0;
      }
    }
  }

  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, MAX_INFLUENCES));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, MAX_INFLUENCES));
}
```

### 6.5 完整组装流程

```js
const geometry = createSkinnedGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0x44aa88,
  skinning: true // 必须开启！
});

const { root, bones } = createSkeleton();
const skeleton = new THREE.Skeleton(bones);

const skinnedMesh = new THREE.SinnedMesh(geometry, material);
skinnedMesh.add(root);          // 将骨骼层级添加到 mesh
skinnedMesh.bind(skeleton);     // 绑定骨骼

scene.add(skinnedMesh);

// 创建测试动画
const tracks = [
  new THREE.QuaternionKeyframeTrack(
    'Spine.quaternion',
    [0, 1, 2],
    [
      ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
      ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.3)).toArray(),
      ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray()
    ]
  )
];

const clip = new THREE.AnimationClip('sway', 2, tracks);
const mixer = new THREE.AnimationMixer(skinnedMesh);
const action = mixer.clipAction(clip);
action.play();
```

---

## 七、骨骼绑定与解绑

### 7.1 bind（绑定）

```js
// 绑定骨骼到 SkinnedMesh
skinnedMesh.bind(skeleton, bindMatrix);

// 参数说明：
// skeleton: Skeleton 实例
// bindMatrix (可选): 绑定时刻的基矩阵，默认 skinnedMesh.matrixWorld

// 绑定后 ThreeJS 会：
// 1. 设置 skinnedMesh.skeleton = skeleton
// 2. 计算并存储 skeleton.boneInverses
// 3. 在 shader 中使用 boneMatrices 纹理/UBO 传递骨骼矩阵
```

### 7.2 pose（重置姿势）

```js
// 将所有骨骼重置到绑定姿势（恢复 matrix 到初始状态）
skinnedMesh.pose();

// 等价于：
skeleton.bones.forEach((bone, i) => {
  bone.matrix.copy(bone.userData.bindMatrix || bone.matrix);
});
```

### 7.3 解绑与重新绑定

```js
// 解绑（ThreeJS 没有 unbind 方法，需手动实现）
function unbindSkinnedMesh(mesh) {
  mesh.skeleton = null;
  // 注意：几何体中的 skinIndex/skinWeight 仍然保留
}

// 重新绑定新骨骼
function rebind(mesh, newSkeleton) {
  mesh.bind(newSkeleton, mesh.matrixWorld);
}
```

### 7.4 共享 Skeleton

```js
// 多个 SkinnedMesh 共享同一套 Skeleton（换装系统）
const bodyMesh = new THREE.SkinnedMesh(bodyGeometry, bodyMaterial);
const clothesMesh = new THREE.SkinnedMesh(clothesGeometry, clothesMaterial);

bodyMesh.bind(skeleton);
clothesMesh.bind(skeleton); // 共享骨骼

// 只需一个 mixer 控制
const mixer = new THREE.AnimationMixer(bodyMesh); // 或者任一 mesh
// 动画会同时作用于两个 mesh，因为它们共享 skeleton
```

---

## 八、骨骼调试可视化：SkeletonHelper

`SkeletonHelper` 用于在场景中可视化骨骼层级和当前姿态，是调试骨骼动画的必备工具。

### 8.1 基础使用

```js
import { SkeletonHelper } from 'three';

// 为 SkinnedMesh 创建骨骼辅助线
const helper = new THREE.SkeletonHelper(skinnedMesh);
helper.material.linewidth = 2; // 线宽（WebGLRenderer 中可能无效）
scene.add(helper);

// 或者为任意 Object3D 创建（会自动查找子 SkinnedMesh）
const helper = new THREE.SkeletonHelper(gltf.scene);
scene.add(helper);
```

### 8.2 样式定制

```js
const helper = new THREE.SkeletonHelper(skinnedMesh);

// 修改颜色
helper.material.color.set(0xff0000); // 红色骨骼线

// 是否可见
helper.visible = true;

// 更新（每帧自动更新，无需手动调用）
// helper.update();
```

### 8.3 交互式骨骼调试

```js
// 显示骨骼名称标签
function createBoneLabels(skeleton, scene, camera) {
  const labels = [];
  
  skeleton.bones.forEach(bone => {
    const div = document.createElement('div');
    div.className = 'bone-label';
    div.textContent = bone.name;
    div.style.cssText = 'position:absolute;color:#0f0;font-size:12px;pointer-events:none;';
    document.body.appendChild(div);
    labels.push({ bone, element: div });
  });

  return {
    update: () => {
      labels.forEach(({ bone, element }) => {
        const pos = bone.getWorldPosition(new THREE.Vector3());
        pos.project(camera);
        const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
        element.style.transform = `translate(${x}px, ${y}px)`;
        element.style.display = pos.z < 1 ? 'block' : 'none';
      });
    },
    dispose: () => labels.forEach(l => l.element.remove())
  };
}
```

---

## 九、奇淫技巧

### 9.1 动画反向播放

```js
// 方式一：设置负 timeScale
action.timeScale = -1;
action.play();

// 注意：需确保 action.time 在有效范围内
action.time = clip.duration; // 从结尾开始

// 方式二：手动逐帧倒推（适合精确控制）
function playReverse(action) {
  action.paused = true;
  const duration = action.getClip().duration;
  
  return (delta) => {
    action.time -= delta;
    if (action.time <= 0) {
      action.time = 0;
      return false; // 结束
    }
    return true;
  };
}
```

### 9.2 循环动画无缝衔接

循环动画在首尾帧不连续时会出现 "跳变"，解决方案：

```js
// 1. 在 Blender 等工具中确保首尾帧一致

// 2. 代码层使用 zeroSlope
action.zeroSlopeAtBegin = true;
action.zeroSlopeAtEnd = true;

// 3. 自定义插值（ThreeJS 已内置 CatmullRom）
// 使用 THREE.InterpolateSmooth 确保首尾切线一致
const track = new THREE.VectorKeyframeTrack(
  'bone.position',
  [0, 0.5, 1.0],
  [0, 0, 0,  1, 0, 0,  0, 0, 0],
  THREE.InterpolateSmooth // 使用平滑插值
);
```

### 9.3 动态骨骼名映射表情（MorphTarget 替代方案）

当模型没有 BlendShape/MorphTarget 时，可通过骨骼驱动表情：

```js
class FacialExpressionController {
  constructor(skeleton) {
    this.bones = {};
    const boneNames = [
      'browLeft', 'browRight',
      'eyeLeft', 'eyeRight',
      'mouthUpper', 'mouthLower',
      'cheekLeft', 'cheekRight'
    ];
    
    boneNames.forEach(name => {
      this.bones[name] = skeleton.getBoneByName(name);
    });
  }

  // 表情预设
  expressions = {
    smile: {
      'mouthUpper': { y: 0.05 },
      'mouthLower': { y: -0.02 },
      'cheekLeft': { x: 0.03 },
      'cheekRight': { x: 0.03 }
    },
    angry: {
      'browLeft': { y: -0.03, z: 0.02 },
      'browRight': { y: -0.03, z: -0.02 },
      'mouthLower': { y: 0.02 }
    },
    surprised: {
      'browLeft': { y: 0.04 },
      'browRight': { y: 0.04 },
      'eyeLeft': { z: 0.02 },
      'eyeRight': { z: 0.02 },
      'mouthUpper': { y: 0.05 },
      'mouthLower': { y: -0.04 }
    }
  };

  apply(expressionName, intensity = 1.0) {
    const expr = this.expressions[expressionName];
    if (!expr) return;

    Object.entries(expr).forEach(([boneName, offsets]) => {
      const bone = this.bones[boneName];
      if (!bone) return;

      // 在绑定姿势基础上叠加偏移
      Object.entries(offsets).forEach(([axis, value]) => {
        bone.position[axis] = bone.userData.bindPosition?.[axis] || 0 + value * intensity;
      });
    });
  }

  reset() {
    Object.values(this.bones).forEach(bone => {
      if (bone.userData.bindPosition) {
        bone.position.copy(bone.userData.bindPosition);
      }
    });
  }
}

// 初始化时保存绑定姿势
skeleton.bones.forEach(bone => {
  bone.userData.bindPosition = bone.position.clone();
});

const faceCtrl = new FacialExpressionController(skeleton);
faceCtrl.apply('smile', 0.8);
```

### 9.4 在线动画压缩工具

骨骼动画文件往往体积庞大，推荐以下优化方案：

| 工具 | 功能 | 地址 |
|------|------|------|
| **gltf-pipeline** | Cesium 官方 GLTF 压缩/优化 | [GitHub](https://github.com/CesiumGS/gltf-pipeline) |
| **gltfpack** | meshopt 优化（强力推荐） | [GitHub](https://github.com/zeux/meshoptimizer) |
| **Draco** | Google 几何压缩 | [GitHub](https://github.com/google/draco) |
| **KTX2/Basis** | 纹理压缩 | [KhronosGroup](https://github.com/KhronosGroup/KTX-Software) |

**gltfpack 使用示例**：

```bash
# 安装
npm install -g gltfpack

# 压缩（大幅减少体积，同时保持动画质量）
gltfpack -i model.glb -o model-compressed.glb \
  -cc              # 压缩颜色属性
  -tc              # 压缩纹理坐标
  -ac              # 压缩动画
  -c               # 使用 Draco/Quantization
  -si 0.5          # 简化到 50% 三角形
  -sa              # 简化动画（减少关键帧）
```

**ThreeJS 加载 gltfpack 压缩模型**：

```js
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// 必须先初始化 decoder
MeshoptDecoder.setWasmBinary?(await fetch('/meshopt_decoder.wasm').then(r => r.arrayBuffer()));

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
loader.load('model-compressed.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

### 9.5 性能优化 checklist

```js
// 1. 骨骼数量控制
// 移动端建议 < 50 根骨骼
// 每个 SkinnedMesh 的顶点最大影响骨骼数建议为 2（减少 GPU 计算）

// 2. 减少动画关键帧
// 使用 gltfpack -sa 自动简化

// 3. 多角色共享 Skeleton
// 同类型角色使用同一 Skeleton 实例

// 4. 使用 InstancedSkinnedMesh（ThreeJS 示例中查找）
// 大量相同角色动画时，使用实例化渲染

// 5. LOD 策略
// 远距离角色关闭骨骼动画或降低更新频率
let frameCount = 0;
function animate() {
  frameCount++;
  if (frameCount % 2 === 0) { // 隔帧更新
    mixer.update(delta * 2);
  }
}
```

---

## 总结

ThreeJS 骨骼动画系统的核心链路：

```
GLTF/程序创建
    │
    ▼
┌─────────┐    ┌──────────┐    ┌────────────┐    ┌─────────────┐
│  Bone   │───▶│ Skeleton │───▶│SkinnedMesh │───▶│  Scene      │
│ 层级结构 │    │矩阵管理   │    │ 顶点蒙皮    │    │ 渲染        │
└─────────┘    └──────────┘    └────────────┘    └─────────────┘
                                     │
                                     ▼
                              ┌────────────┐
                              │Animation   │
                              │Mixer/Action│
                              │ 时间轴控制  │
                              └────────────┘
```

掌握 `Bone → Skeleton → SkinnedMesh → AnimationMixer → AnimationAction` 这条主线，配合 `skinIndex/skinWeight` 的底层理解，即可应对从简单播放到复杂混合的各类骨骼动画需求。



---

## 相关阅读

- [GPU 性能优化与着色器调试](GPU 性能优化与着色器调试.md)

- [ThreeJS基础入门与核心对象](./ThreeJS基础入门与核心对象.md) — 骨骼动画需要理解对象结构
- [ThreeJS物理引擎实战](./ThreeJS物理引擎实战.md) — 骨骼与物理的联合使用
- [ThreeJS交互与性能优化](./ThreeJS交互与性能优化.md) — 动画交互的性能考量

---

## 在线示例

- [Three.js Animation](https://threejs.org/examples/?q=animation) — 动画系统示例
- [Skinning Demo](https://threejs.org/examples/?q=skinning) — 骨骼绑定示例
- [Mixamo to Three.js](https://threejs.org/examples/?q=fbx) — FBX 骨骼动画示例

---

## 参考资料

- [Three.js Animation System](https://threejs.org/docs/#manual/en/introduction/Animation-system)
- [glTF Specification](https://www.khronos.org/gltf/)