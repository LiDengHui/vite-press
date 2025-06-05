# PeerJS 使用说明文档
---

## 目录
1. [概述](#概述)
2. [核心概念](#核心概念)
3. [快速开始](#快速开始)
4. [案例说明](#案例说明)
    - [案例1：文本聊天](#案例1文本聊天)
    - [案例2：视频通话](#案例2视频通话)
5. [架构关系图](#架构关系图)
6. [注意事项](#注意事项)

---

## 概述
PeerJS 是基于 WebRTC 的轻量级库，用于简化浏览器间点对点（P2P）通信的实现。它封装了 WebRTC 的复杂逻辑，提供简洁的 API 支持文本、文件、音视频等数据传输。

---

## 核心概念
1. **Peer**  
   每个客户端实例，拥有唯一 ID（可通过服务器生成或自定义）。
2. **Connection**  
   点对点连接通道，分为 `DataConnection`（数据传输）和 `MediaConnection`（音视频流）。
3. **PeerServer**  
   信令服务器（默认提供或自建），用于协调连接的建立。

---

## 快速开始
### 安装
```bash
npm install peerjs
# 或直接引入 CDN
<script src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>

```

### 初始化 Peer 对象
```javascript
// 创建 Peer 实例（自动生成 ID）
const peer = new Peer({
  host: 'your-peer-server.com', // 自建服务器时替换
  port: 9000,
  path: '/myapp'
});

peer.on('open', (id) => {
  console.log('My Peer ID:', id);
});
```

---

## 案例说明
### 案例1：文本聊天
#### 步骤
1. **用户A** 创建 `Peer` 实例并连接信令服务器。
2. **用户B** 通过已知 ID 发起连接请求。
3. 双方通过 `DataConnection` 收发消息。

#### 代码示例
```javascript
// 用户A（监听连接）
peer.on('connection', (conn) => {
  conn.on('data', (data) => {
    console.log('Received:', data);
  });
});

// 用户B（主动连接）
const conn = peer.connect('userA-id');
conn.on('open', () => {
  conn.send('Hello from UserB!');
});
```

---

### 案例2：视频通话
#### 步骤
1. **用户A** 获取本地媒体流并监听呼叫。
2. **用户B** 通过 `MediaConnection` 呼叫用户A。
3. 双方交换音视频流并渲染到页面。

#### 代码示例
```javascript
// 用户A（应答呼叫）
peer.on('call', (call) => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      call.answer(stream); // 应答并提供本地流
      call.on('stream', (remoteStream) => {
        document.getElementById('videoA').srcObject = remoteStream;
      });
    });
});

// 用户B（发起呼叫）
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    const call = peer.call('userA-id', stream);
    call.on('stream', (remoteStream) => {
      document.getElementById('videoB').srcObject = remoteStream;
    });
  });
```

---

## 架构关系图
### 文本聊天流程
![](https://cdn.nlark.com/yuque/__mermaid_v3/05e3f7b0ac432ec4428a871f7b371bd5.svg)

### 视频通话结构
![](https://cdn.nlark.com/yuque/__mermaid_v3/0157b6425846079f9520e8ba06fa34c3.svg)

---

## 注意事项
1. **信令服务器**  
   默认服务器 `peerjs.com` 仅适用于测试，生产环境需自建（[GitHub 仓库](https://github.com/peers/peerjs-server)）。
2. **安全性**  
   HTTPS 环境下需配置 `secure: true`。
3. **兼容性**  
   部分浏览器需 polyfill（如 `webrtc-adapter`）。
4. **错误处理**  
   监听 `error` 事件处理连接异常：

```javascript
peer.on('error', (err) => {
  console.error('PeerJS Error:', err);
});
```

---

通过本文档，开发人员可快速实现基于 PeerJS 的 P2P 功能。建议参考[官方文档](https://peerjs.com/docs/)获取更多高级配置。
