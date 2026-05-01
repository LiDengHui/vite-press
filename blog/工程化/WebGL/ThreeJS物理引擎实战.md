---
title: Three.js 物理引擎实战
tags:
  - WebGL
  - ThreeJS
  - 物理引擎
  - cannon-es
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# Three.js 物理引擎实战

> 本文基于 `cannon-es` 讲解如何在 Three.js 中接入物理引擎，从基础概念到性能优化，覆盖完整开发链路。

---

## 1. 为什么 Three.js 需要外挂物理引擎？

Three.js 是**纯渲染引擎**，只负责把 Mesh 画到屏幕上，它本身不处理：

- 重力与加速度
- 碰撞检测与反弹
- 刚体动力学（动量、角速度、摩擦力）
- 约束（铰链、弹簧、绳索）

如果手写这些，你需要实现：
- 包围盒/包围球检测
- 空间分割加速（BVH、八叉树）
- 接触流形求解器（Contact Solver）
- 积分器（Euler / RK4）

工程量巨大且容易出 Bug，因此必须引入**专门的物理引擎**。

### 主流物理引擎对比

| 引擎 | 语言/绑定 | 特点 | 适用场景 |
|------|-----------|------|----------|
| **cannon-es** | TypeScript | 轻量、API 友好、现代模块、文档全 | Web 中小型 3D 项目 |
| **ammo.js** | C++ → Emscripten | Bullet 的 WebAssembly 移植，功能最全 | 复杂刚体/软体/布料 |
| **@dimforge/rapier3d** | Rust → WASM | 性能极佳、SIMD、多线程友好 | 高性能游戏、大量刚体 |
| **matter.js** | JavaScript | 2D 专用、API 极简 | 2D 物理小游戏 |

**选型建议**：
- 快速原型 / 中小型 3D → `cannon-es`
- 追求极致性能 → `rapier`
- 需要软体/布料 → `ammo.js`
- 纯 2D → `matter.js`

---

## 2. cannon-es 安装与初始化

```bash
npm install cannon-es three
npm install -D @types/three
```

### 核心：World

```ts
import * as CANNON from 'cannon-es'

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

// 宽相（Broadphase）：负责快速筛选可能碰撞的物体对
world.broadphase = new CANNON.SAPBroadphase(world)

// 允许休眠：静止物体不再参与计算，大幅提升性能
world.allowSleep = true
```

| 参数 | 说明 |
|------|------|
| `gravity` | 全局重力向量，默认 `y = -9.82` |
| `broadphase` | 可选 `NaiveBroadphase` / `SAPBroadphase` / `GridBroadphase` |
| `allowSleep` | 开启后速度低于阈值会自动休眠 |

---

## 3. Body 与 Shape 详解

### Body（刚体）

```ts
const body = new CANNON.Body({
  mass: 1,            // kg，0 表示静态（无限质量）
  position: new CANNON.Vec3(0, 5, 0),
  quaternion: new CANNON.Quaternion(),
  velocity: new CANNON.Vec3(0, 0, 0),
  angularVelocity: new CANNON.Vec3(0, 0, 0),
  linearDamping: 0.1, // 线性阻尼，模拟空气阻力
  angularDamping: 0.1,// 角阻尼，让旋转逐渐停止
})
```

| 属性 | 含义 |
|------|------|
| `mass` | 质量（kg）。设为 `0` 则不受力影响，用于地面/墙壁 |
| `position` | 世界坐标 |
| `quaternion` | 旋转（四元数，避免万向节死锁） |
| `velocity` | 线速度（m/s） |
| `angularVelocity` | 角速度（rad/s） |
| `type` | `CANNON.Body.DYNAMIC` / `STATIC` / `KINEMATIC` |

> **KINEMATIC**：不受力影响，但可以通过代码驱动位置（如电梯、移动平台），并能推开 DYNAMIC 物体。

---

## 4. 常用 Shape 创建

Shape 是碰撞体几何，**必须与视觉 Mesh 分开管理**。

```ts
// 1. 立方体
const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)) // 半尺寸！

// 2. 球体
const sphereShape = new CANNON.Sphere(1)

// 3. 无限平面
const planeShape = new CANNON.Plane()

// 4. 圆柱（cannon-es 原生支持）
const cylinderShape = new CANNON.Cylinder(1, 1, 2, 20)

// 5. 凸包（ConvexPolyhedron）
const vertices = [
  new CANNON.Vec3(0, 1, 0),
  new CANNON.Vec3(-1, -1, 1),
  new CANNON.Vec3(1, -1, 1),
  new CANNON.Vec3(1, -1, -1),
  new CANNON.Vec3(-1, -1, -1),
]
const faces = [[0,1,2],[0,2,3],[0,3,4],[0,4,1],[1,4,3,2]]
const convexShape = new CANNON.ConvexPolyhedron({ vertices, faces })

// 6. 三角网格（Trimesh）—— 用于复杂静态地形
const trimeshShape = new CANNON.Trimesh(verticesArray, indicesArray)
```

> ⚠️ **Trimesh 与 Trimesh 碰撞不稳定**，通常只做“静态地形 vs 动态物体”。

---

## 5. 刚体与 Mesh 同步

每一帧将物理引擎的位置/旋转同步给 Three.js：

```ts
function syncMesh(body: CANNON.Body, mesh: THREE.Mesh) {
  mesh.position.copy(body.position as any)
  mesh.quaternion.copy(body.quaternion as any)
}

// 渲染循环
function animate() {
  requestAnimationFrame(animate)

  // 固定时间步长，保证物理确定性
  world.fixedStep(1 / 60)

  // 同步所有物体
  for (const { body, mesh } of objectPairs) {
    syncMesh(body, mesh)
  }

  renderer.render(scene, camera)
}
```

> `cannon-es` 的 `Vec3` / `Quaternion` 与 Three.js 结构几乎一致，可直接 `.copy()`。

---

## 6. 重力系统

### 基础重力

```ts
world.gravity.set(0, -9.82, 0) // 地球重力
world.gravity.set(0, -3.72, 0) // 火星重力
```

### 局部浮力/水浮力模拟

```ts
// 简单浮力：检测物体是否进入水面，施加向上的力
const waterLevel = 0
const waterDensity = 1000 // kg/m³

world.addEventListener('postStep', () => {
  objects.forEach(({ body }) => {
    if (body.position.y < waterLevel) {
      const depth = waterLevel - body.position.y
      const volume = depth * 1.0 // 简化排水体积
      const buoyancyForce = volume * waterDensity * 9.82

      // 施加到物体中心
      body.applyForce(new CANNON.Vec3(0, buoyancyForce, 0), body.position)

      // 增加水阻力
      body.linearDamping = 0.8
      body.angularDamping = 0.8
    } else {
      body.linearDamping = 0.1
      body.angularDamping = 0.1
    }
  })
})
```

> 更精确的方案：用 `ConvexPolyhedron` 近似排水体积，或改用 `rapier` 的流体插件。

---

## 7. 碰撞检测

### collide 事件

```ts
body.addEventListener('collide', (e: CANNON.CollideEvent) => {
  const contactNormal = new CANNON.Vec3()
  const upAxis = new CANNON.Vec3(0, 1, 0)

  // e.contact 是 ContactEquation
  const contact = e.contact

  // 获取碰撞法线（指向当前 body）
  contact.ni.negate(contactNormal)

  // 碰撞冲量大小
  const impactVelocity = contact.getImpactVelocityAlongNormal()

  console.log('碰撞速度:', impactVelocity)

  if (Math.abs(impactVelocity) > 3) {
    // 播放撞击音效 / 粒子特效
  }
})
```

### ContactEquation 关键属性

| 属性 | 说明 |
|------|------|
| `contact.bi` / `contact.bj` | 碰撞的两个 Body |
| `contact.ri` / `contact.rj` | 碰撞点在局部坐标系下的位置 |
| `contact.ni` | 碰撞法线（从 bj 指向 bi） |
| `contact.getImpactVelocityAlongNormal()` | 沿法线方向的相对速度 |

---

## 8. 材料与摩擦

### Material & ContactMaterial

```ts
// 1. 定义材料
const groundMat = new CANNON.Material('ground')
const boxMat = new CANNON.Material('box')

// 2. 定义接触材料（当两个材料碰撞时生效）
const contactMat = new CANNON.ContactMaterial(groundMat, boxMat, {
  friction: 0.4,      // 摩擦系数（0 ~ 1+）
  restitution: 0.3,   // 弹性（0 = 完全非弹性，1 = 完全弹性）
  contactEquationStiffness: 1e8,
  contactEquationRelaxation: 3,
})

world.addContactMaterial(contactMat)

// 3. 赋给 Body
const groundBody = new CANNON.Body({ mass: 0, material: groundMat })
const boxBody = new CANNON.Body({ mass: 1, material: boxMat })
```

| 参数 | 含义 |
|------|------|
| `friction` | 摩擦力。0 = 冰面，1+ = 橡胶 |
| `restitution` | 反弹系数。0 = 沙袋，0.9 = 超级弹球 |
| `ContactMaterial` | 两两组合管理，比单 Body 材料更灵活 |

---

## 9. 约束（Constraints）

约束用于连接两个刚体，模拟铰链、绳索、车轮等。

### LockConstraint（完全锁死）

两个物体相对位置/旋转完全固定：

```ts
const lock = new CANNON.LockConstraint(bodyA, bodyB)
world.addConstraint(lock)
```

### HingeConstraint（铰链）

模拟门、车轮、关节：

```ts
const hinge = new CANNON.HingeConstraint(bodyA, bodyB, {
  pivotA: new CANNON.Vec3(0, 1, 0),   // bodyA 局部锚点
  pivotB: new CANNON.Vec3(0, -1, 0),  // bodyB 局部锚点
  axisA: new CANNON.Vec3(0, 0, 1),    // bodyA 局部旋转轴
  axisB: new CANNON.Vec3(0, 0, 1),    // bodyB 局部旋转轴
})

// 开启马达驱动
hinge.enableMotor()
hinge.setMotorSpeed(5)

world.addConstraint(hinge)
```

### PointToPointConstraint（点对点）

绳索/链式连接：

```ts
const p2p = new CANNON.PointToPointConstraint(
  bodyA, new CANNON.Vec3(0.5, 0, 0),
  bodyB, new CANNON.Vec3(-0.5, 0, 0)
)
world.addConstraint(p2p)
```

---

## 10. 性能优化

### 1. 简化碰撞体

| 视觉模型 | 物理碰撞体 |
|----------|------------|
| 高精度角色模型 | 胶囊体 (Capsule) 或圆柱+球组合 |
| 复杂建筑 | 包围盒 (Box) 或凸包 |
| 地形 | Trimesh（静态） |
| 大量小物件 | 球体（计算最快） |

```ts
// 用一组简单 Shape 代替复杂 Mesh
const body = new CANNON.Body({ mass: 1 })
body.addShape(new CANNON.Sphere(0.5), new CANNON.Vec3(0, 0, 0))   // 头
body.addShape(new CANNON.Cylinder(0.3, 0.3, 1.2, 8), new CANNON.Vec3(0, -1, 0)) // 躯干
```

### 2. 休眠机制

```ts
world.allowSleep = true

// 自定义休眠阈值
body.sleepSpeedLimit = 0.1    // 速度低于此值可进入休眠
body.sleepTimeLimit = 1       // 持续低速 1 秒后休眠

body.wakeUp()   // 手动唤醒
body.sleep()    // 强制休眠
```

### 3. SAPBroadphase

```ts
// 轴对齐包围盒排序算法，O(n log n)，适合大量静态/动态混合物体
world.broadphase = new CANNON.SAPBroadphase(world)
```

> `NaiveBroadphase` 是 O(n²)，超过 100 个物体必换 `SAPBroadphase`。

---

## 11. 奇淫技巧

### 1. 视觉高模 + 物理低模

```ts
// 视觉：高精度 GLTF
const visualMesh = await loadHighPolyModel()

// 物理：简化包围盒
const physicsBody = new CANNON.Body({ mass: 1 })
physicsBody.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)))

// 每帧只同步物理到视觉
syncMesh(physicsBody, visualMesh)
```

### 2. 远离视野物理冻结

```ts
const cameraPos = camera.position

for (const { body, mesh } of objects) {
  const dist = mesh.position.distanceTo(cameraPos)

  if (dist > 50) {
    body.sleep()
  } else if (dist < 45 && body.isSleeping) {
    body.wakeUp()
  }
}
```

### 3. 碰撞体半透明调试

```ts
// 为每个 Shape 创建半透明线框 Mesh
function createDebugMesh(body: CANNON.Body): THREE.Group {
  const group = new THREE.Group()

  for (const shape of body.shapes) {
    let geo: THREE.BufferGeometry

    if (shape instanceof CANNON.Box) {
      const { x, y, z } = shape.halfExtents
      geo = new THREE.BoxGeometry(x * 2, y * 2, z * 2)
    } else if (shape instanceof CANNON.Sphere) {
      geo = new THREE.SphereGeometry(shape.radius, 16, 16)
    }

    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    })

    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)
  }

  return group
}
```

### 4. 使用 Debug Renderer

社区有现成方案，推荐 `cannon-es-debugger`：

```bash
npm install cannon-es-debugger
ts
import { CannonDebugger } from 'cannon-es-debugger'

const cannonDebugger = new CannonDebugger(scene, world, {
  color: 0x00ff00,
  scale: 1,
})

function animate() {
  world.fixedStep()
  cannonDebugger.update() // 自动渲染所有物理 Shape 的线框
  renderer.render(scene, camera)
}
```

> 开发阶段必开，上线后移除，可节省大量手动对齐时间。

### 5.1 物理模拟与渲染分离

物理计算和渲染分开线程执行，物理线程固定 60fps，渲染线程用 requestAnimationFrame 的可变帧率

---

## 总结

| 阶段 | 要点 |
|------|------|
| 选型 | cannon-es 轻量易上手，rapier 性能最强 |
| 初始化 | World + gravity + SAPBroadphase + allowSleep |
| 建模 | 视觉高模、物理低模，Shape 尽量简化 |
| 同步 | `fixedStep` + 每帧 `position/quaternion.copy()` |
| 调参 | Material/ContactMaterial 控制摩擦与弹性 |
| 优化 | 休眠、视野裁剪、Debug Renderer 辅助 |

> 物理引擎是 Three.js 的“灵魂外挂”，掌握它才能做出有重量感、可交互的 3D 世界。



---

## 相关阅读

- [体积渲染与大气效果](体积渲染与大气效果.md)
- [GPU 性能优化与着色器调试](GPU 性能优化与着色器调试.md)

- [ThreeJS基础入门与核心对象](./ThreeJS基础入门与核心对象.md) — 物理引擎需要场景和几何体
- [ThreeJS交互与性能优化](./ThreeJS交互与性能优化.md) — 物理交互与性能优化
- [ThreeJS骨骼动画系统](./ThreeJS骨骼动画系统.md) — 物理与动画结合

---

## 在线示例

- [Cannon.js Examples](https://pmndrs.github.io/cannon-es/) — Cannon-es 官方示例
- [Rapier.js Demo](https://rapier.rs/demos3d/index.html) — Rapier 在线演示
- [Three.js + Physics](https://threejs.org/examples/?q=physics) — Three.js 物理示例

---

## 参考资料

- [cannon-es GitHub](https://github.com/pmndrs/cannon-es)
- [Rapier Physics Engine](https://rapier.rs/)