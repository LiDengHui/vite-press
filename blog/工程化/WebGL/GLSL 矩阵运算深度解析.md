---
title: GLSL 矩阵运算深度解析
tags:
  - WebGL
  - GLSL
  - 矩阵
  - 线性代数
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# GLSL 矩阵运算深度解析

[[toc]]

---

## 一、为什么 GPU 用 4×4 矩阵

3D 空间中的点是三维的 `vec3`，但**平移**不是线性变换（无法用 3×3 矩阵表示）。引入**齐次坐标**（Homogeneous Coordinates）后，用 `vec4(x, y, z, w)` 表示点，`w=1` 时为点，`w=0` 时为方向向量。

```glsl
// 点：w = 1，会被平移影响
vec4 point    = vec4(1.0, 2.0, 3.0, 1.0);

// 方向向量：w = 0，平移不影响方向
vec4 direction = vec4(1.0, 0.0, 0.0, 0.0);
```

4×4 矩阵可以同时编码**旋转、缩放、平移、透视投影**，一次乘法完成所有变换。

---

## 二、四大核心矩阵的数学推导

### 2.1 Model Matrix（模型矩阵）

将局部坐标系中的顶点转换到世界坐标系：

```
M = T · R · S    // 先缩放 → 再旋转 → 最后平移（从右往左应用）
glsl
// 手动构建平移矩阵
mat4 translate(vec3 t) {
    return mat4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        t.x, t.y, t.z, 1   // 最后一行是平移
    );
}

// 手动构建缩放矩阵
mat4 scale(vec3 s) {
    return mat4(
        s.x, 0, 0, 0,
        0, s.y, 0, 0,
        0, 0, s.z, 0,
        0, 0, 0, 1
    );
}

// 绕 Y 轴旋转矩阵
mat4 rotateY(float θ) {
    float c = cos(θ), s = sin(θ);
    return mat4(
         c, 0, s, 0,
         0, 1, 0, 0,
        -s, 0, c, 0,
         0, 0, 0, 1
    );
}
```

**注意 GLSL 矩阵是列主序！** 上面写法是逻辑上的，实际内存布局是列优先。Three.js 提供的 `modelMatrix` 已经帮你算好了。

### 2.2 View Matrix（视图矩阵）

将世界坐标转换到相机坐标系。本质是**将相机移回原点并旋转到标准朝向**。

```glsl
// 手动构建 LookAt 矩阵
mat4 lookAt(vec3 eye, vec3 target, vec3 up) {
    vec3 zAxis = normalize(eye - target);   // 相机朝向（指向屏幕内）
    vec3 xAxis = normalize(cross(up, zAxis)); // 右向量
    vec3 yAxis = cross(zAxis, xAxis);         // 上向量（已正交化）

    return mat4(
        xAxis.x, yAxis.x, zAxis.x, 0,
        xAxis.y, yAxis.y, zAxis.y, 0,
        xAxis.z, yAxis.z, zAxis.z, 0,
        -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1
    );
}
```

### 2.3 Projection Matrix（投影矩阵）

#### 透视投影（Perspective）

模拟人眼近大远小的效果。核心参数：FOV（视野角）、宽高比、近裁剪面 `n`、远裁剪面 `f`。

```glsl
// 透视投影矩阵（OpenGL 标准，裁剪空间 z ∈ [-1, 1]）
mat4 perspective(float fov, float aspect, float n, float f) {
    float tanHalfFov = tan(fov / 2.0);
    return mat4(
        1.0 / (aspect * tanHalfFov), 0, 0, 0,
        0, 1.0 / tanHalfFov, 0, 0,
        0, 0, -(f + n) / (f - n), -1,
        0, 0, -(2.0 * f * n) / (f - n), 0
    );
}
```

**为什么 `gl_Position.w` 很重要？**

GPU 在顶点着色器后会做**透视除法**：`gl_Position.xyz / gl_Position.w`。这个 `w` 分量存储了顶点的深度信息，让远处的物体被压缩变小。

#### 正交投影（Orthographic）

无透视变形，平行线保持平行。常用于 2D UI、等距游戏。

```glsl
mat4 orthographic(float left, float right, float bottom, float top, float n, float f) {
    return mat4(
        2.0 / (right - left), 0, 0, 0,
        0, 2.0 / (top - bottom), 0, 0,
        0, 0, -2.0 / (f - n), 0,
        -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(f + n) / (f - n), 1
    );
}
```

### 2.4 Normal Matrix（法线矩阵）

**为什么不能直接用 `modelMatrix` 变换法线？**

因为法线不是普通向量，它需要始终垂直于表面。非均匀缩放会破坏正交性。

```
如果 M 将切线 t 变换为 t'，那么法线 n 应该满足：n' · t' = 0
即：(N · n) · (M · t) = 0
即：n^T · N^T · M · t = 0
因为 n^T · t = 0，所以需要 N^T · M = I
即：N = (M^{-1})^T   // 逆转置矩阵
glsl
// Three.js 提供的 normalMatrix 已经是 3x3 的逆转置
vec3 worldNormal = normalize(normalMatrix * normal);

// 如果没有 normalMatrix，可以用逆矩阵转置（代价高）
// vec3 worldNormal = normalize(transpose(inverse(mat3(modelMatrix))) * normal);
```

**关键点：**
- 法线矩阵是 3×3（去掉平移）
- 对于**均匀缩放**，`normalMatrix` 就是 `modelMatrix` 的旋转部分
- 对于**非均匀缩放**，必须用逆转置

---

## 三、矩阵组合的顺序陷阱

```glsl
// 正确：P · V · M（从右到左应用）
// 先模型变换 → 再视图变换 → 最后投影
gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

// 等价于预计算 MVP 矩阵
mat4 mvp = projectionMatrix * viewMatrix * modelMatrix;
gl_Position = mvp * vec4(position, 1.0);
```

**常见错误：顺序颠倒**

```glsl
// ❌ 错误：这会先投影再移动，结果完全错误
gl_Position = modelMatrix * projectionMatrix * vec4(position, 1.0);
```

**变换顺序影响结果：**

```glsl
// 先旋转 90° 再平移 (1,0,0)：物体绕原点旋转后移到右侧
vec3 result1 = translate(vec3(1,0,0)) * rotateY(PI/2) * position;

// 先平移 (1,0,0) 再旋转 90°：物体先移走再绕原点旋转，轨迹是圆弧
vec3 result2 = rotateY(PI/2) * translate(vec3(1,0,0)) * position;
```

---

## 四、从裁剪空间反推世界坐标

有时需要在片段着色器里知道像素对应的世界坐标（比如做雾效、边缘检测）：

```glsl
// 顶点着色器：把世界坐标传给片段着色器
varying vec3 vWorldPosition;
void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}

// 片段着色器：直接用法
float fog = exp(-distance(vWorldPosition, cameraPosition) * fogDensity);
```

**如果不传 varying，可以从深度反推（Reconstruct Position）：**

```glsl
// 从深度缓冲 + 逆 MVP 矩阵恢复世界坐标
uniform sampler2D uDepthTexture;
uniform mat4 uInverseProjectionMatrix;
uniform mat4 uInverseViewMatrix;

vec3 reconstructWorldPosition(vec2 uv, float depth) {
    // NDC 空间：xy ∈ [-1,1], z ∈ [0,1] 或 [-1,1]
    vec4 ndc = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    vec4 viewPos = uInverseProjectionMatrix * ndc;
    viewPos /= viewPos.w;  // 透视除法
    vec4 worldPos = uInverseViewMatrix * viewPos;
    return worldPos.xyz;
}
```

---

## 五、四元数与矩阵

旋转用欧拉角会有**万向节死锁**问题。四元数是更好的旋转表示。

```glsl
// 四元数乘法
vec4 quatMul(vec4 a, vec4 b) {
    return vec4(
        a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz),
        a.w * b.w - dot(a.xyz, b.xyz)
    );
}

// 四元数旋转点：q * v * q^{-1}
vec3 quatRotate(vec4 q, vec3 v) {
    vec4 qv = quatMul(quatMul(q, vec4(v, 0)), vec4(-q.xyz, q.w));
    return qv.xyz;
}

// 轴角 → 四元数
vec4 quatFromAxisAngle(vec3 axis, float angle) {
    float halfAngle = angle * 0.5;
    return vec4(normalize(axis) * sin(halfAngle), cos(halfAngle));
}

// 四元数 → 3x3 旋转矩阵
mat3 quatToMat3(vec4 q) {
    vec3 q2 = q.xyz * q.xyz * 2.0;
    float qxy = q.x * q.y * 2.0;
    float qxz = q.x * q.z * 2.0;
    float qyz = q.y * q.z * 2.0;
    float qwx = q.w * q.x * 2.0;
    float qwy = q.w * q.y * 2.0;
    float qwz = q.w * q.z * 2.0;
    return mat3(
        1.0 - q2.y - q2.z, qxy + qwz, qxz - qwy,
        qxy - qwz, 1.0 - q2.x - q2.z, qyz + qwx,
        qxz + qwy, qyz - qwx, 1.0 - q2.x - q2.y
    );
}
```

---

## 六、完整示例：自定义 MVP + 法线变换

```js
import * as THREE from 'three';

const vertexShader = `
    uniform mat4 uCustomModelMatrix;
    uniform mat3 uNormalMatrix;

    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
        // 使用自定义模型矩阵（比如做实例化变换）
        vec4 worldPos = uCustomModelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;

        // 正确变换法线
        vNormal = normalize(uNormalMatrix * normal);

        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);

        // 基于世界坐标的颜色变化
        vec3 color = vec3(0.5) + 0.5 * cos(vWorldPos * 0.5 + vec3(0, 2, 4));
        gl_FragColor = vec4(color * (diff + 0.2), 1.0);
    }
`;

const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uCustomModelMatrix: { value: new THREE.Matrix4() },
        uNormalMatrix: { value: new THREE.Matrix3() }
    }
});

// 动画中更新
function animate() {
    const t = clock.getElapsedTime();
    const matrix = new THREE.Matrix4()
        .makeRotationY(t)
        .multiply(new THREE.Matrix4().makeScale(1 + 0.3 * Math.sin(t), 1, 1));

    material.uniforms.uCustomModelMatrix.value = matrix;
    material.uniforms.uNormalMatrix.value =
        new THREE.Matrix3().getNormalMatrix(matrix);
}
```

---

## 七、奇淫技巧

### 7.1 不用逆矩阵求 `modelMatrix` 的旋转部分

```glsl
// 如果知道 modelMatrix 只有旋转和平移（无缩放），旋转部分是正交矩阵
// 正交矩阵的逆 = 转置
mat3 rotationOnly = mat3(modelMatrix);  // 去掉平移
mat3 inverseRotation = transpose(rotationOnly);
```

### 7.2 提取相机位置（从 viewMatrix）

```glsl
// viewMatrix = [R | -R·eye]，所以 eye = -transpose(R) * 平移部分
vec3 cameraPosition = -transpose(mat3(viewMatrix)) * vec3(viewMatrix[3]);
// Three.js 直接提供了 cameraPosition 全局变量
```

### 7.3 TBN 矩阵（切线空间变换）

```glsl
// 从法线贴图读取的法线是在切线空间，需要转换到世界空间
varying vec3 vTangent, vBitangent, vNormal;

mat3 TBN = mat3(
    normalize(vTangent),
    normalize(vBitangent),
    normalize(vNormal)
);

vec3 normalFromMap = texture2D(uNormalMap, uv).xyz * 2.0 - 1.0;
vec3 worldNormal = normalize(TBN * normalFromMap);
```

### 7.4 矩阵动画插值

```glsl
// 不能直接在矩阵间 lerp！先分解为 TRS 或四元数再插值
// 简单近似：只插值平移，旋转用四元数 slerp
vec3 mixPosition = mix(posA, posB, t);
vec4 mixRotation = slerp(quatA, quatB, t);  // 需自己实现 slerp
mat4 result = translate(mixPosition) * mat4(quatToMat3(mixRotation));
```

### 7.5 避免矩阵乘法的技巧

```glsl
// 如果只是平移，别用完整 4x4 乘法
vec3 translateOnly = position + offset;

// 如果只是绕 Y 轴旋转，手动计算比矩阵乘法快
float c = cos(angle), s = sin(angle);
vec3 rotated = vec3(
    position.x * c + position.z * s,
    position.y,
    -position.x * s + position.z * c
);
```


---

## 相关阅读

- [GLSL 常用函数](./GLSL 常用函数.md) — 矩阵运算是 GLSL 常用函数的深化
- [光线追踪与 SDF 渲染原理](./光线追踪与 SDF 渲染原理.md) — SDF 渲染中广泛使用矩阵变换
- [光线运算与光照模型](./光线运算与光照模型.md) — 法线变换与 TBN 矩阵

---

## 在线示例

- [Matrix Transformations](https://www.shadertoy.com/view/4dfGzs) — 2D/3D 矩阵变换演示
- [Projection Matrix](https://www.shadertoy.com/view/4dK3zD) — 透视矩阵可视化
- [Rotation Matrices](https://www.shadertoy.com/view/XtBfzK) — 旋转矩阵演示

---

## 参考资料

- [Essence of Linear Algebra (3Blue1Brown)](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)
- [OpenGL Projection Matrix](http://www.songho.ca/opengl/gl_projectionmatrix.html)
- [Normal Matrix derivation](https://www.lighthouse3d.com/tutorials/glsl-12-tutorial/the-normal-matrix/)
