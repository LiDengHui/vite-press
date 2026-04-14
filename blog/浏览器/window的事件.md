# `window` 对象常用事件大全

## 1. 页面生命周期事件
| 事件名                     | 触发条件                                 | 示例代码                                                                           |
|-------------------------|--------------------------------------|--------------------------------------------------------------------------------|
| `load`                  | 窗口及所有资源（图片、脚本等）加载完成时触发。              | ```window.addEventListener('load', () => console.log('页面加载完毕'));```            |
| `DOMContentLoaded`      | HTML 解析完成（无需等待样式/图片）时触发。             | ```document.addEventListener('DOMContentLoaded', initApp);```                  |
| `beforeunload`          | 窗口即将关闭/刷新时触发（可提示用户保存数据）。             | ```window.addEventListener('beforeunload', (e) => e.returnValue = '确认离开？');``` |
| `unload`                | 窗口关闭或导航离开时触发（部分操作受限）。                | ```window.addEventListener('unload', sendAnalytics);```                        |
| `pageshow` / `pagehide` | 页面显示/隐藏时触发（包括从缓存恢复）。                 | ```window.addEventListener('pageshow', restoreState);```                       |
| `visibilitychange`      | 页面可见性变化时触发（通过 `document.hidden` 判断）。 | ```document.addEventListener('visibilitychange', checkTabFocus);```            |

## 2. 窗口与视图事件
| 事件名                | 触发条件            | 示例代码                                                                  |
|--------------------|-----------------|-----------------------------------------------------------------------|
| `resize`           | 窗口大小改变时触发。      | ```window.addEventListener('resize', debounce(handleResize, 200));``` |
| `scroll`           | 窗口滚动时触发（需防抖优化）。 | ```window.addEventListener('scroll', trackScrollPosition);```         |
| `fullscreenchange` | 进入/退出全屏模式时触发。   | ```document.addEventListener('fullscreenchange', syncUI);```          |

## 3. 网络与连接事件
| 事件名                  | 触发条件          | 示例代码                                                         |
|----------------------|---------------|--------------------------------------------------------------|
| `online` / `offline` | 网络连接恢复/丢失时触发。 | ```window.addEventListener('online', syncData);```           |
| `languagechange`     | 用户首选语言变化时触发。  | ```window.addEventListener('languagechange', updateLang);``` |

## 4. 浏览器历史与导航事件
| 事件名          | 触发条件                       | 示例代码                                                      |
|--------------|----------------------------|-----------------------------------------------------------|
| `popstate`   | 前进/后退导航时触发（需 History API）。 | ```window.addEventListener('popstate', restoreView);```   |
| `hashchange` | URL 哈希（`#` 后内容）变化时触发。      | ```window.addEventListener('hashchange', handleRoute);``` |

## 5. 存储与通信事件
| 事件名       | 触发条件                          | 示例代码                                                                                                        |
|-----------|-------------------------------|-------------------------------------------------------------------------------------------------------------|
| `storage` | 同源其他标签页修改 `localStorage` 时触发。 | ```window.addEventListener('storage', (e) => console.log(e.key, e.newValue));```                            |
| `message` | 通过 `postMessage` 接收消息时触发。     | ```window.addEventListener('message', (e) => if (e.origin === 'https://trusted.com') handleMsg(e.data));``` |

## 6. 设备与硬件事件
| 事件名                 | 触发条件             | 示例代码                                                                                     |
|---------------------|------------------|------------------------------------------------------------------------------------------|
| `deviceorientation` | 设备方向变化时触发（需授权）。  | ```window.addEventListener('deviceorientation', (e) => console.log(e.alpha, e.beta));``` |
| `devicemotion`      | 设备加速度变化时触发（如摇动）。 | ```window.addEventListener('devicemotion', handleShake);```                              |
| `gamepadconnected`  | 游戏手柄连接时触发。       | ```window.addEventListener('gamepadconnected', initGamepad);```                          |

## 7. 安全与权限事件
| 事件名                       | 触发条件                | 示例代码                                                                    |
|---------------------------|---------------------|-------------------------------------------------------------------------|
| `securitypolicyviolation` | 违反内容安全策略（CSP）时触发。   | ```window.addEventListener('securitypolicyviolation', logViolation);``` |
| `permissionchange`        | 用户授予/拒绝权限（如摄像头）时触发。 | ```navigator.permissions.query({name:'camera'}).then(...);```           |

## 8. 其他特殊事件
| 事件名                | 触发条件               | 示例代码                                                                                  |
|--------------------|--------------------|---------------------------------------------------------------------------------------|
| `vrdisplayconnect` | VR 设备连接时触发。        | ```window.addEventListener('vrdisplayconnect', setupVR);```                           |
| `animationstart`   | CSS 动画开始时触发（全局监听）。 | ```window.addEventListener('animationstart', (e) => console.log(e.animationName));``` |

---

### **使用说明**
1. **事件绑定**：推荐使用 `addEventListener`（避免 `onload=` 等内联方式）。
2. **性能优化**：高频事件（如 `resize`、`scroll`）需使用 **防抖（debounce）**。
3. **兼容性**：部分事件（如 VR、游戏手柄）需检查浏览器支持：
   ```javascript
   if ('gamepad' in navigator) {
     window.addEventListener('gamepadconnected', handleGamepad);
   }
    ```