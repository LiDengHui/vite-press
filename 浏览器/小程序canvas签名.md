# 小程序Canvas签名

在 uni-app 中使用 canvas 实现用户签名绘制的关键在于正确初始化 canvas、捕获触摸事件并实时将用户的绘制轨迹呈现出来。下面详细描述整个过程：

---

## 1. 页面结构与 canvas 组件

首先，在页面模板中添加 canvas 元素，并绑定触摸事件。示例代码如下：

```html
<template>
  <view class="signature-container">
    <!-- canvas 用于用户签名绘制 -->
    <canvas
      id="signature"
      canvas-id="signature"
      class="signature-canvas"
      @touchstart="startDrawing"
      @touchmove="continueDrawing"
      @touchend="endDrawing">
    </canvas>
    <!-- 可选：清除和保存按钮 -->
    <view class="button-group">
      <view class="btn" @click="clearCanvas">清除</view>
      <view class="btn" @click="saveSignature">保存</view>
    </view>
  </view>
</template>
```

> **说明**：
> - 使用 `@touchstart`、`@touchmove` 和 `@touchend` 分别监听触摸开始、移动和结束事件。
> - 样式部分需要设置 canvas 的尺寸和位置，确保用户手指在上面滑动时能正确捕获。

---

## 2. Canvas 初始化

在组件的逻辑部分，需要获取 canvas 节点并初始化 2D 绘图上下文。考虑到不同设备的像素比（dpr），需要对 canvas 进行适配。

```js
export default {
  data() {
    return {
      ctx: null,           // canvas 的 2d 绘图上下文
      isDrawing: false,    // 标识当前是否在绘制中
      lastX: 0,            // 上一次触摸的 X 坐标
      lastY: 0,            // 上一次触摸的 Y 坐标
      dpr: 1,              // 设备像素比
    };
  },
  mounted() {
    // 使用 uni.createSelectorQuery 获取 canvas 节点及尺寸
    uni.createSelectorQuery().select('#signature').fields({ node: true, size: true }).exec((res) => {
      const canvas = res[0].node;
      // 获取设备像素比
      this.dpr = uni.getSystemInfoSync().pixelRatio;
      // 设置 canvas 的实际宽高，确保在高清屏上显示清晰
      canvas.width = res[0].width * this.dpr;
      canvas.height = res[0].height * this.dpr;
      // 获取 2D 绘图上下文，并做缩放处理
      this.ctx = canvas.getContext('2d');
      this.ctx.scale(this.dpr, this.dpr);
      // 设置默认绘制样式
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#000';
    });
  },
  methods: {
    // 后续在此处添加事件处理函数
  }
}
```

> **注意**：
> - `uni.getSystemInfoSync().pixelRatio` 用于获取设备像素比；
> - 调整 canvas 的宽高和对上下文进行缩放，可以避免模糊问题。

---

## 3. 处理触摸事件

### 3.1 开始绘制（touchstart）

当用户开始触摸 canvas 时，记录初始点，并调用 `beginPath` 开始一条新路径。

```js
function  startDrawing(e) {
    // 设置正在绘制标识为 true
    this.isDrawing = true;
    const touch = e.touches[0];
    // 记录初始触摸点（注意乘以 dpr 以保持一致性）
    this.lastX = touch.x;
    this.lastY = touch.y;
    // 开启一条新路径，并移动到起始点
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
  }
  // 后续添加 continueDrawing 与 endDrawing
```

### 3.2 绘制过程（touchmove）

在用户滑动手指时，不断获取当前触摸点，并用 `lineTo` 连接上一个点，从而形成连续线条。

```js

  function continueDrawing(e) {
    if (!this.isDrawing) return;
    const touch = e.touches[0];
    const x = touch.x;
    const y = touch.y;
    // 绘制从上一个点到当前点的直线
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    // 更新上一个触摸点为当前点
    this.lastX = x;
    this.lastY = y;
  }
```

### 3.3 结束绘制（touchend）

当触摸结束时，将绘制标识设为 false，结束当前路径。

```js

  function endDrawing(e) {
    this.isDrawing = false;
    // 可选：这里可对绘制轨迹进行平滑处理或存储轨迹数据
  }
```

> **提示**：  
> 为了使签名效果更加平滑，可以使用贝塞尔曲线（quadraticCurveTo 或 bezierCurveTo）来平滑曲线，但基本原理都是捕获触摸坐标，然后绘制曲线。

---

## 4. 附加功能：清除与保存

### 4.1 清除画布

通过调用 `clearRect` 方法可以清除整个 canvas 内容。

```js

  function clearCanvas() {
    // 清除整个 canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
```

### 4.2 保存签名

使用 uni-app 提供的 API `uni.canvasToTempFilePath` 将 canvas 内容保存为图片文件，再传递给后续业务使用。

```js
  function saveSignature() {
    uni.canvasToTempFilePath({
      canvasId: 'signature',
      // 传入 canvas 对象，保证获取正确内容
      canvas: this.ctx.canvas,
      fileType: 'png',
      quality: 1,
      success: (res) => {
        // 保存成功后，可将图片路径传递给父组件或进行其他处理
        console.log('保存成功，图片路径：', res.tempFilePath);
      },
      fail: (err) => {
        console.error('保存失败：', err);
      }
    }, this);
  }
```

> **注意**：  
> 在调用 `uni.canvasToTempFilePath` 时，要确保 canvas 已经完全绘制好，且传入正确的 canvas 对象。
