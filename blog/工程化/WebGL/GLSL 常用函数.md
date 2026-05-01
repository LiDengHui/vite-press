---
title: GLSL 常用函数分类手册
tags:
  - WebGL
  - GLSL
  - 函数参考
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# GLSL 常用函数分类手册

[[toc]]

以下是 GLSL 中常用函数的分类整理，适用于 **GLSL ES 3.0+**（OpenGL ES 3.0/WebGL 2 及以上版本）。按功能分为 7 大类：

---

## **1. 数学计算函数**

| 函数                  | 参数类型      | 说明                              | 示例                          |
| --------------------- | ------------- | --------------------------------- | ----------------------------- |
| `abs(x)`              | 所有标量/向量 | 绝对值                            | `abs(-2.5) = 2.5`             |
| `sign(x)`             | 所有标量/向量 | 符号（-1, 0, 1）                  | `sign(-3.0) = -1.0`           |
| `floor(x)`            | 所有标量/向量 | 向下取整                          | `floor(2.7) = 2.0`            |
| `ceil(x)`             | 所有标量/向量 | 向上取整                          | `ceil(2.1) = 3.0`             |
| `round(x)`            | 所有标量/向量 | 四舍五入                          | `round(2.4) = 2.0`            |
| `fract(x)`            | 所有标量/向量 | 小数部分                          | `fract(2.7) = 0.7`            |
| `mod(x, y)`           | 所有标量/向量 | 取模运算                          | `mod(5.0, 3.0) = 2.0`         |
| `min(x, y)`           | 所有标量/向量 | 最小值                            | `min(2.0, 5.0) = 2.0`         |
| `max(x, y)`           | 所有标量/向量 | 最大值                            | `max(2.0, 5.0) = 5.0`         |
| `clamp(x, min, max)`  | 所有标量/向量 | 限制在 [min, max] 区间            | `clamp(10.0, 0.0, 1.0) = 1.0` |
| `mix(x, y, a)`        | 所有标量/向量 | 线性插值：`x*(1-a) + y*a`         | `mix(0.0, 10.0, 0.5) = 5.0`   |
| `step(edge, x)`       | 所有标量/向量 | 阶跃函数：`x >= edge ? 1.0 : 0.0` | `step(0.5, 0.7) = 1.0`        |
| `smoothstep(e0,e1,x)` | 所有标量/向量 | 平滑过渡：`x` 在 [e0, e1] 间插值  | `smoothstep(0.0,1.0,0.5)=0.5` |

---

## **2. 三角函数**

| 函数         | 参数类型 | 说明               | 注意                     |
| ------------ | -------- | ------------------ | ------------------------ |
| `sin(x)`     | 弧度     | 正弦               | 输入为弧度（非角度）     |
| `cos(x)`     | 弧度     | 余弦               | 同上                     |
| `tan(x)`     | 弧度     | 正切               | 同上                     |
| `asin(x)`    | [-1,1]   | 反正弦（返回弧度） | 返回值范围 `[-π/2, π/2]` |
| `acos(x)`    | [-1,1]   | 反余弦（返回弧度） | 返回值范围 `[0, π]`      |
| `atan(y, x)` | 标量     | 反正切（返回弧度） | 正确处理所有象限         |
| `radians(x)` | 角度     | 角度 → 弧度        | `radians(180.0) = π`     |
| `degrees(x)` | 弧度     | 弧度 → 角度        | `degrees(π) = 180.0`     |

---

## **3. 指数与对数函数**

| 函数             | 参数类型        | 说明               |
| ---------------- | --------------- | ------------------ |
| `pow(x, y)`      | 标量/向量       | 幂运算 `x^y`       |
| `exp(x)`         | 标量/向量       | 自然指数 `e^x`     |
| `exp2(x)`        | 标量/向量       | `2^x`              |
| `log(x)`         | 标量/向量 (x>0) | 自然对数 `ln(x)`   |
| `log2(x)`        | 标量/向量 (x>0) | 以 2 为底的对数    |
| `sqrt(x)`        | 标量/向量 (x≥0) | 平方根             |
| `inversesqrt(x)` | 标量/向量 (x>0) | 平方根倒数（高效） |

---

## **4. 几何函数**

| 函数                       | 参数类型    | 说明                         |
| -------------------------- | ----------- | ---------------------------- |
| `length(v)`                | 向量        | 向量长度 `\|v\|`             |
| `distance(a, b)`           | 向量        | 两点距离 `\|a-b\|`           |
| `dot(a, b)`                | 同维度向量  | 点积 `a·b`                   |
| `cross(a, b)`              | `vec3`      | 叉积（仅 3D 向量）           |
| `normalize(v)`             | 向量        | 单位化向量 `v / \|v\|`       |
| `faceforward(n, i, n_ref)` | 向量        | 确保法线朝向观察者           |
| `reflect(i, n)`            | 向量        | 反射向量：`i - 2·dot(n,i)·n` |
| `refract(i, n, eta)`       | 向量 + 标量 | 折射向量（eta=折射率比）     |

---

## **5. 向量操作函数**

| 函数                | 参数类型      | 说明                         |
| ------------------- | ------------- | ---------------------------- |
| `any(v)`            | `bvec`        | 任意分量为 true 则返回 true  |
| `all(v)`            | `bvec`        | 所有分量为 true 则返回 true  |
| `not(v)`            | `bvec`        | 分量逻辑非                   |
| `lessThan(a, b)`    | 数值向量      | 逐分量 `<` 比较，返回 `bvec` |
| `greaterThan(a, b)` | 数值向量      | 逐分量 `>` 比较              |
| `equal(a, b)`       | 任意向量      | 逐分量 `==` 比较             |
| `vec4(v, a)`        | `vec3` + 标量 | 扩展向量（如 `vec3`→`vec4`） |

---

## **6. 纹理采样函数**

| 函数                                 | 说明                                       |
| ------------------------------------ | ------------------------------------------ |
| `texture(sampler, uv)`               | 基础 2D 纹理采样                           |
| `texture(sampler, uv, bias)`         | 带 LOD 偏置的采样（片段着色器）            |
| `textureLod(sampler, uv, lod)`       | 指定 LOD 级别采样（顶点着色器可用）        |
| `textureProj(sampler, projCoord)`    | 投影纹理采样（自动除 `projCoord.w`）       |
| `textureOffset(sampler, uv, offset)` | 带整数偏移的采样（如 `offset=ivec2(1,0)`） |
| `texelFetch(sampler, coord, lod)`    | 直接通过整数坐标获取纹素（不滤波）         |

> **采样器类型**：`sampler2D`, `samplerCube`, `sampler2DArray` 等。

---

## **7. 特殊函数**

| 函数                  | 说明                                                             |
| --------------------- | ---------------------------------------------------------------- |
| `dFdx(p)` / `dFdy(p)` | 求屏幕空间偏导数（片段着色器专用，用于计算梯度）                 |
| `noise(x)`            | **已废弃** 旧版 GLSL 的噪声函数（现代 GPU 通常用自定义算法替代） |

---

## 使用说明

1. **向量化操作**：所有函数均支持标量和向量参数（如 `sin(vec2)` 返回 `vec2`）。
2. **精度限定符**：实际使用时需结合精度（`highp`, `mediump`, `lowp`）。
3. **纹理采样**：WebGL 1 需用 `texture2D`，WebGL 2+ 统一为 `texture`。

> 此手册覆盖 90% 常用场景，完整函数列表参考 [GLSL ES 3.0 规范](https://www.khronos.org/registry/OpenGL/specs/es/3.0/GLSL_ES_Specification_3.00.pdf)。



---

## 相关阅读

- [GLSL 噪声函数与程序化生成](./GLSL 噪声函数与程序化生成.md) — 噪声函数是 GLSL 函数的高级应用
- [光线运算与光照模型](./光线运算与光照模型.md) — 光照计算中常用 GLSL 函数
- [帧缓冲与后处理管线](./帧缓冲与后处理管线.md) — 后处处理着色器的函数使用

---

## 奇淫技巧

### 快速查询

```glsl
// 在 VS Code 中使用 GLSL 插件获取智能提示和语法高亮
// 推荐: Shader languages support for VS Code
```

### 函数片段

```glsl
// 将常用函数封装成可复用的 snippet
#define saturate(x) clamp(x, 0.0, 1.0)
#define lerp(a, b, t) mix(a, b, t)
#define rcp(x) (1.0 / (x))
```



### 3.1 将 length / distance 封装为可内联的函数

length 和 distance 在大量调用时会有开销，可以封装为 `vec2 dist = dot(p,p);` 等形式避免函数调用开销

### 4.1 利用 step 替代 if 分支

`step(edge, x)` 和 `smoothstep` 可以替代简单的 if-else，在 GPU 上避免波动分支，提高执行效率

---

## 在线示例

- [GLSL Built-in Functions](https://www.shadertoy.com/view/4dK3zD) — GLSL 内置函数对照表
- [Smoothstep vs Step](https://www.shadertoy.com/view/ltS3zK) — step 与 smoothstep 对比
- [Mix Interpolation](https://www.shadertoy.com/view/4tlSRn) — mix 函数各种插值演示
- [Distance Functions](https://www.shadertoy.com/view/4tlSRn) — distance / dot / length 演示

---

## 参考资料

- [GLSL Spec - Khronos](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)
- [The Book of Shaders - GLSL Functions](https://thebookofshaders.com/glossary/)