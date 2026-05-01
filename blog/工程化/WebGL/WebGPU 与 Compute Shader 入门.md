---
title: WebGPU 与 Compute Shader 入门
tags:
  - WebGPU
  - Compute Shader
  - GPGPU
  - 并行计算
categories:
  - 技术文档
  - 前端
  - WebGL
date: 2025-04-30
---

# WebGPU 与 Compute Shader 入门

[[toc]]

---

## 一、WebGPU 是什么

WebGPU 是 WebGL 的继任者，基于 Vulkan/Metal/D3D12 的现代图形 API，支持：
- **Compute Shader** — 不用绘制任何像素，纯通用并行计算
- **强大的资源管理** — 显式的缓冲区、纹理、绑定组
- **更精确的控制** — 渲染管线状态不再隐式
- **更好的资源利用** — 支持次代配合

---

## 二、WebGPU vs WebGL

| 特性 | WebGL 2 | WebGPU |
|------|---------|--------|
| 基于 API | OpenGL ES 3.0 | Vulkan/Metal/D3D12 |
| Compute | ❌ 无 | ✅ 原生支持 |
| 资源管理 | 隐式自动 | 显式绁结 |
| 多线程 | ❌ | ✅ 支持多 queue |
| 性能 | 一般 | 高（特别是 CPU 开销低） |
| 文法 | GLSL | WGSL |
| 浏览器支持 | 全部现代浏览器 | Chrome 113+, Firefox, Safari |

---

## 三、WGSL 语法入门

### 3.1 基础结构

```wgsl
// 缓冲区定义
struct Uniforms {
    resolution: vec2f,
    time: f32,
};

@binding(0) @group(0) var<uniform> uniforms: Uniforms;
@binding(1) @group(0) var<storage, read> inputBuffer: array<f32>;
@binding(2) @group(0) var<storage, read_write> outputBuffer: array<f32>;

// 计算着色器
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
    let index = id.x;
    if (index >= arrayLength(&outputBuffer)) {
        return;
    }

    outputBuffer[index] = inputBuffer[index] * 2.0;
}
```

### 3.2 片段着色器

```wgsl
@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
    // 全屏三角形
    var pos = array<vec2f, 3>(
        vec2f(-1.0, -1.0),
        vec2f( 3.0, -1.0),
        vec2f(-1.0,  3.0)
    );
    return vec4f(pos[vertexIndex], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
    let uv = fragCoord.xy / uniforms.resolution;
    return vec4f(uv, 0.5, 1.0);
}
```

---

## 四、JavaScript API 入门

### 4.1 初始化

```js
async function initWebGPU() {
    // 请求 adapter（物理 GPU）
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error('WebGPU not supported');

    // 请求 device（逻辑 GPU）
    const device = await adapter.requestDevice();

    // 获取 canvas context
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('webgpu');

    // 配置 swap chain
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format,
        alphaMode: 'premultiplied'
    });

    return { device, context, format };
}
```

### 4.2 Compute Shader 完整示例

```js
// WGSL 代码
const shaderCode = `
    @binding(0) @group(0) var<storage, read> data: array<f32>;
    @binding(1) @group(0) var<storage, read_write> result: array<f32>;

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) id: vec3u) {
        let i = id.x;
        if (i >= arrayLength(&result)) { return; }
        result[i] = data[i] * data[i] + 1.0;
    }
`;

async function runCompute() {
    const { device } = await initWebGPU();

    // 创建 shader module
    const shaderModule = device.createShaderModule({ code: shaderCode });

    // 创建缓冲区
    const dataSize = 1024 * 4;  // 1024 个 f32
    const inputBuffer = device.createBuffer({
        size: dataSize,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const outputBuffer = device.createBuffer({
        size: dataSize,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    const readBuffer = device.createBuffer({
        size: dataSize,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    // 写入数据
    const data = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) data[i] = i;
    device.queue.writeBuffer(inputBuffer, 0, data);

    // 绑定组布局
    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
            { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        ]
    });

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: inputBuffer } },
            { binding: 1, resource: { buffer: outputBuffer } },
        ]
    });

    // 管线布局
    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    });

    const pipeline = device.createComputePipeline({
        layout: pipelineLayout,
        compute: { module: shaderModule, entryPoint: 'main' }
    });

    // 提交命令
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil(1024 / 256));  // 4 个 workgroup
    pass.end();

    // 复制结果到可读缓冲区
    encoder.copyBufferToBuffer(outputBuffer, 0, readBuffer, 0, dataSize);
    device.queue.submit([encoder.finish()]);

    // 读取结果
    await readBuffer.mapAsync(GPUMapMode.READ);
    const result = new Float32Array(readBuffer.getMappedRange());
    console.log(result.slice(0, 10));
    readBuffer.unmap();
}
```

---

## 五、WebGPU 渲染

```js
// 简单的全屏渲染
const renderShaderCode = `
    @vertex
    fn vs_main(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
        var pos = array(vec2f(-1, -1), vec2f(3, -1), vec2f(-1, 3));
        return vec4f(pos[i], 0, 1);
    }

    @fragment
    fn fs_main() -> @location(0) vec4f {
        return vec4f(1.0, 0.5, 0.2, 1.0);
    }
`;

async function render() {
    const { device, context, format } = await initWebGPU();
    const module = device.createShaderModule({ code: renderShaderCode });

    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module, entryPoint: 'vs_main' },
        fragment: { module, entryPoint: 'fs_main', targets: [{ format }] },
        primitive: { topology: 'triangle-list' }
    });

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store',
            clearValue: { r: 0, g: 0, b: 0, a: 1 }
        }]
    });
    pass.setPipeline(pipeline);
    pass.draw(3);
    pass.end();

    device.queue.submit([encoder.finish()]);
}
```

---

## 六、Compute Shader 实战：粒子系统

```wgsl
struct Particle {
    position: vec3f,
    velocity: vec3f,
    life: f32,
};

@binding(0) @group(0) var<storage, read> particlesIn: array<Particle>;
@binding(1) @group(0) var<storage, read_write> particlesOut: array<Particle>;
@binding(2) @group(0) var<uniform> dt: f32;

@compute @workgroup_size(64)
fn update(@builtin(global_invocation_id) id: vec3u) {
    let i = id.x;
    if (i >= arrayLength(&particlesIn)) { return; }

    var p = particlesIn[i];
    p.velocity += vec3f(0.0, -9.8, 0.0) * dt;  // 重力
    p.position += p.velocity * dt;
    p.life -= dt;

    if (p.life <= 0.0 || p.position.y < 0.0) {
        // 重生
        p.position = vec3f(0.0, 5.0, 0.0);
        p.velocity = vec3f(
            (f32(i % 100) - 50.0) * 0.1,
            5.0 + fract(f32(i) * 0.123) * 3.0,
            (f32(i % 100) - 50.0) * 0.1
        );
        p.life = 3.0 + fract(f32(i) * 0.456) * 2.0;
    }

    particlesOut[i] = p;
}
```

---

## 七、从 WebGL 迁移

### 7.1 语法对照

| GLSL | WGSL |
|------|------|
| `vec3` | `vec3f` |
| `mat4` | `mat4x4f` |
| `uniform` | `var<uniform>` |
| `in/out` | `@location(n)` |
| `gl_Position` | `@builtin(position)` |
| `gl_FragCoord` | `@builtin(position)` |
| `texture2D` | `textureSample` |

### 7.2 三角形引擎封装

推荐使用 **Three.js WebGPU Renderer** 或 **Babylon.js** 来避免手写 WebGPU API：

```js
import * as THREE from 'three/webgpu';

const renderer = new THREE.WebGPURenderer();
await renderer.init();
```

- WebGPU 的 setBindGroup 可以分离绑定，先绑定静态资源，只在每帧更新动态 uniform，减少帧准备开销
- Compute Shader 中使用 workgroupBarrier() 而非 storageBarrier() 大都能满足需求，后者多余的同步开销会降低并行度
## 八、奇淫技巧

### 8.1 双缓冲区 ping-pong

```wgsl
// 交替读写避免同步
// Frame N: read A, write B
// Frame N+1: read B, write A
```

### 8.2 共享绑定组

```js
// 一个绑定组被多个 pipeline 共享
const sharedLayout = device.createBindGroupLayout({
    entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT, buffer: {} }
    ]
});
```

### 8.3 常量缓冲区

```wgsl
// 只读的大量数据用 storage 而不是 uniform
@binding(0) @group(0) var<storage, read> lookupTable: array<vec4f>;
```


### 4.1 将 Compute Shader 结果直接读取到 CPU

用 `mapAsync` 与 `getMappedRange` 可以在不创建中间缓冲区的情况下直接读取 GPU 计算结果

### 5.1 使用 pipeline cache 加载时间

在首次创建 pipeline 后将其缓存，后续会话直接从缓存恢复，减少 90% 的编译时间

---

## 相关阅读

- [GPU 性能优化与着色器调试](./GPU 性能优化与着色器调试.md) — WebGPU 的性能优化思想
- [帧缓冲与后处理管线](./帧缓冲与后处理管线.md) — Compute Shader 可用于后处处理

---

## 在线示例

以下 ShaderToy 示例可以在浏览器中直接运行，建议结合本文章内容对照阅读：

- [WebGPU Samples](https://webgpu.github.io/webgpu-samples/) — WebGPU 官方例子
- [Compute Shader Particles](https://webgpu.github.io/webgpu-samples/?sample=computeBoids) — Compute Boids 例子

---

## 参考资料

- [WebGPU Spec](https://www.w3.org/TR/webgpu/)
- [WGSL Spec](https://www.w3.org/TR/WGSL/)
- [WebGPU Fundamentals](https://webgpufundamentals.org/)
- [Three.js WebGPU Examples](https://threejs.org/examples/?q=webgpu)
