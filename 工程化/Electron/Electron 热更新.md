# Electron 热更新

Electron 应用实现在线更新（也称为热更新），能让你的应用在不需要用户重新下载完整安装包的情况下，获取新功能或修复问题，显著提升用户体验。目前主流的实现方式有
**使用 electron-updater 模块**、**依托 Electron 内置的 autoUpdater 模块**等方案。

下面是一个对比表格，帮助你快速了解几种主要方式的特点：

| 更新方式               | 优点                                                  | 缺点                                                          | 适用场景                                                                 |
| :--------------------- | :---------------------------------------------------- | :------------------------------------------------------------ | :----------------------------------------------------------------------- |
| **electron-updater**   | 功能丰富，支持增量更新，与 electron-builder 集成度高        | 需要配置打包工具 (如 electron-builder)                            | 大多数商业项目，尤其是需要稳定、可靠更新流程和可能涉及大量文件变动的项目               |
| **内置 autoUpdater**   | Electron 原生支持，无需额外安装                            | 不同平台行为不一（macOS 需签名），需自建更新服务器并提供特定格式的更新信息          | 对更新流程有高度定制需求，愿意自行处理各平台差异和服务器逻辑的项目                     |
| **手动实现热更新**     | 极度灵活，可控性强，可只更新渲染进程相关文件                      | 实现复杂，需自行处理版本对比、下载、替换、校验等所有环节，可靠性需自行保障          | 更新内容极少（如仅修改 HTML/CSS/JS）、希望深度定制更新逻辑或学习研究                 |
| **update-electron-app** | 设置简单，无需自建服务器（使用 Electron 官方服务），适合开源项目 | 仅适用于公开的 GitHub Releases，功能相对简单，可能不满足复杂需求            | 开源项目，且版本发布通过 GitHub Releases 进行                                |

ℹ️ **注意**：无论采用哪种方式，**应用签名**和**版本管理**都至关重要。应用必须有有效签名，否则更新后可能无法运行或被杀毒软件误报。版本号应遵循语义化版本控制（Semantic
Versioning），以便正确判断是否需要更新。

### 🔧 方案一：使用 electron-updater（推荐）

[electron-updater](https://www.npmjs.com/package/electron-updater) 是 electron-builder 内置的模块，功能强大，支持**自动差分更新
**（delta updates），只需下载变更部分，节省用户流量和时间。

1. **安装与配置**
   如果你在使用 electron-builder，通常已经内置。否则，确保已安装 electron-builder：
   ```bash
   npm install electron-builder --save-dev
   ```

2. **主进程配置**
   在主进程文件（如 `main.js`）中引入并配置：
   ```javascript
   const { app, BrowserWindow, ipcMain } = require('electron');
   const { autoUpdater } = require('electron-updater'); // 注意：从 electron-updater 引入，而非 electron 自带模块
   
   // 保持窗口对象的全局引用, 避免被垃圾回收时窗口自动关闭
   let mainWindow;
   
   function createWindow() {
     // 创建浏览器窗口
     mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true, contextIsolation: false } });
     // 加载应用的 index.html
     mainWindow.loadFile('index.html');
   
     // 开发环境下可能需要设置一些调试或特殊配置
     if (process.env.NODE_ENV === 'development') {
       // 例如，在开发环境下指向一个本地打包后的更新配置文件路径（可选，解决开发环境找不到更新配置的问题）
       // autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml'); // 具体路径根据你的项目结构调整
     }
   
     // 可选：检查更新（应用启动后立即检查）
     autoUpdater.checkForUpdatesAndNotify();
   }
   
   app.whenReady().then(createWindow);
   
   // 设置更新服务器的 URL
   // 如果你使用 electron-builder 配置的 publish 字段，通常不需要手动调用 setFeedURL
   // 但如果你需要自定义，可以这样做：
   // autoUpdater.setFeedURL({
   //   provider: 'generic',
   //   url: 'https://your-update-server.com/updates' // 你的更新服务器地址，需提供 latest.yml 等文件
   // });
   
   // 监听更新事件
   autoUpdater.on('update-available', (info) => {
     // 当发现有可用更新时
     console.log('Update available.', info);
     // 可以发送事件到渲染进程，提示用户
     mainWindow.webContents.send('update_available', info);
   });
   
   autoUpdater.on('update-downloaded', (info) => {
     // 更新下载完毕
     console.log('Update downloaded.', info);
     // 发送事件到渲染进程，提示用户准备重启安装
     mainWindow.webContents.send('update_downloaded', info);
     // 你也可以选择自动退出并安装
     // autoUpdater.quitAndInstall();
   });
   
   autoUpdater.on('error', (err) => {
     // 更新过程中发生错误
     console.error('Error in auto-updater.', err);
     mainWindow.webContents.send('update_error', err);
   });
   
   autoUpdater.on('download-progress', (progressObj) => {
     // 下载进度信息
     let log_message = "Download speed: " + progressObj.bytesPerSecond;
     log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
     log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
     console.log(log_message);
     // 发送下载进度到渲染进程，用于显示进度条
     mainWindow.webContents.send('download_progress', progressObj);
   });
   
   // 通过 IPC 接收渲染进程的检查更新或安装更新的请求
   ipcMain.on('restart_app', () => {
     autoUpdater.quitAndInstall();
   });
   
   // 其他应用生命周期代码...
   ```

3. **渲染进程交互**
   在渲染进程（如你的网页 UI）中，可以通过 IPC 与主进程通信，向用户展示更新状态和触发操作：
   ```javascript
   const { ipcRenderer } = require('electron');
   
   // 监听主进程发送的更新事件
   ipcRenderer.on('update_available', (event, info) => {
     // 告知用户有更新可用，是否下载
     if (confirm(`版本 ${info.version} 可用！是否现在下载？`)) {
       // 如果需要用户确认后才开始下载，可以通过 IPC 通知主进程
       // ipcRenderer.send('start_download'); 主进程需监听此事件并调用 autoUpdater.downloadUpdate()
     }
   });
   
   ipcRenderer.on('update_downloaded', (event, info) => {
     // 告知用户更新已下载完成，是否重启应用
     if (confirm('更新已下载，是否立即重启应用？')) {
       ipcRenderer.send('restart_app');
     }
   });
   
   ipcRenderer.on('download_progress', (event, progressObj) => {
     // 更新进度条 UI
     const progressBar = document.getElementById('update-progress');
     const progressPercent = document.getElementById('progress-percent');
     progressBar.value = progressObj.percent;
     progressPercent.innerText = `下载中: ${Math.floor(progressObj.percent)}%`;
   });
   
   ipcRenderer.on('update_error', (event, err) => {
     console.error('更新出错:', err);
     alert('自动更新失败，请检查网络或稍后重试。');
   });
   
   // 按钮点击手动检查更新
   document.getElementById('check-for-updates').addEventListener('click', () => {
     ipcRenderer.send('check_for_updates'); // 主进程需监听此事件并调用 autoUpdater.checkForUpdates()
   });
   ```

4. **打包与发布**
   在 `package.json` 中配置 electron-builder 的 `publish` 字段，告知打包工具如何发布版本和生成更新信息：
   ```json
   {
     "build": {
       "appId": "com.yourcompany.yourapp",
       "productName": "YourApp",
       "directories": {
         "output": "dist"
       },
       "publish": [
         {
           "provider": "generic", // 也可以是 'github', 's3' 等
           "url": "https://your-update-server.com/updates/" // 更新文件存放的基础 URL
         }
       ]
     }
   }
   ```
   使用 electron-builder 打包时，它会生成 `latest.yml`（或 `latest-mac.yml` 等）、`blockmap` 等文件。你需要*
   *将这些文件连同打包生成的安装程序（如 `.exe`, `.dmg`, `.AppImage`）一起上传到你的更新服务器**（`publish` 中 `url`
   所指向的地址）。

### 🌐 方案二：使用 Electron 内置的 autoUpdater 模块

Electron 本身提供了 [`autoUpdater`](https://www.electronjs.org/docs/latest/api/auto-updater) 模块，但其本身*
*只负责检查更新、下载和安装**，需要你**自行搭建更新服务器**并提供特定格式的更新信息。

1. **主进程配置**
   ```javascript
   const { autoUpdater } = require('electron'); // 注意：这里是 Electron 自带的模块
   
   // 设置更新服务器的 URL，URL 应指向一个提供更新信息的 JSON 文件（如 updates.json）
   autoUpdater.setFeedURL({
     url: 'https://your-update-server.com/updates?version=' + app.getVersion() + '&platform=' + process.platform
   });
   
   // 检查更新
   autoUpdater.checkForUpdates();
   
   // 监听事件（与 electron-updater 类似）
   autoUpdater.on('update-available', () => {
     console.log('Update available.');
   });
   autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
     console.log('Update downloaded.');
     // 提示用户重启
     autoUpdater.quitAndInstall(); // 或者让用户选择时机
   });
   autoUpdater.on('error', (error) => {
     console.error('Error in auto-updater.', error);
   });
   ```

2. **搭建更新服务器**
   你需要一个服务器，根据客户端请求（通常包含当前版本和平台）返回一个 [Squirrel](https://github.com/Squirrel) 兼容的 JSON
   响应。例如，对于 Windows (`url` 参数中 `platform=win32`)，返回内容可能类似：
   ```json
   {
     "url": "https://your-update-server.com/releases/YourApp-1.2.0-full.nupkg",
     "name": "1.2.0",
     "notes": "修复了若干问题，增加了新功能",
     "pub_date": "2023-04-01T12:00:00.000Z"
   }
   ```
   服务器需要根据请求的版本号判断是否有更新，并返回对应新版安装包（如 `.nupkg` for Windows, `.zip` for macOS）的信息。macOS
   还需处理 `RELEASES` 文件。

### 📝 方案三：手动实现热更新（适用于渲染进程）

如果你的更新**只涉及渲染进程的代码**（HTML, CSS, JS）且**主进程代码未变化**，可以考虑更轻量的手动热更新。

1. **原理**：应用启动时或定期从远程服务器（如 GitHub Raw Content、自建 CDN）**检查一个版本描述文件**（如 `package.json` 或自定义的
   `version.json`）。**比较远程版本与本地版本**。如果远程版本更新，则**逐个下载有变动的渲染进程文件**（或一个增量包）到临时目录，
   **验证后覆盖**本地文件，最后**刷新页面**或**提示用户重启渲染进程**。

2. **简单示例**：
   ```javascript
   // 在渲染进程或主进程中（需考虑安全性和权限）
   const https = require('https');
   const fs = require('fs');
   const path = require('path');
   
   function checkForUpdates() {
     // 1. 获取远程版本信息
     const remoteVersionUrl = 'https://raw.githubusercontent.com/yourusername/yourrepo/master/version.json';
     https.get(remoteVersionUrl + '?t=' + Date.now(), (res) => { // 加时间戳避免缓存
       let data = '';
       res.on('data', (chunk) => data += chunk);
       res.on('end', () => {
         const remoteInfo = JSON.parse(data);
         const localVersion = require('./package.json').version; // 本地版本
         
         // 2. 比较版本
         if (isNewerVersion(remoteInfo.version, localVersion)) {
           // 3. 下载更新文件列表中的文件
           downloadUpdateFiles(remoteInfo.files); // remoteInfo.files 可能是一个需要更新的文件列表
         }
       });
     }).on('error', (err) => {
       console.error('Failed to check for updates:', err);
     });
   }
   
   function isNewerVersion(remote, local) {
     // 简单的版本比较逻辑，可使用 semver 库更严谨
     const remoteParts = remote.split('.').map(Number);
     const localParts = local.split('.').map(Number);
     for (let i = 0; i < Math.max(remoteParts.length, localParts.length); i++) {
       const r = remoteParts[i] || 0;
       const l = localParts[i] || 0;
       if (r > l) return true;
       if (r < l) return false;
     }
     return false;
   }
   
   function downloadUpdateFiles(filesToUpdate) {
     filesToUpdate.forEach((filePath) => {
       const remoteFileUrl = `https://raw.githubusercontent.com/yourusername/yourrepo/master/${filePath}`;
       const localFilePath = path.join(__dirname, filePath);
       // 创建目录（如果不存在）
       fs.mkdirSync(path.dirname(localFilePath), { recursive: true });
       
       https.get(remoteFileUrl, (res) => {
         let fileData = '';
         res.setEncoding('utf8');
         res.on('data', (chunk) => fileData += chunk);
         res.on('end', () => {
           // 将更新文件写入临时位置，全部成功后进行替换（最好有校验，如哈希）
           const tempFilePath = localFilePath + '.tmp';
           fs.writeFileSync(tempFilePath, fileData);
           // 验证文件完整性（可选但推荐）
           // if (validateFile(tempFilePath)) {
             fs.renameSync(tempFilePath, localFilePath); // 原子替换
             console.log(`Updated: ${filePath}`);
             // 所有文件更新完成后，提示用户刷新或应用已自动更新
           // }
         });
       }).on('error', (err) => {
         console.error(`Failed to download ${filePath}:`, err);
       });
     });
   }
   
   // 应用启动时检查
   checkForUpdates();
   ```
   ⚠️ **注意**：此方法**安全性较低**，需要谨慎处理文件下载和覆盖，避免安全漏洞。**仅适用于简单场景**。

### 💎 方案四：使用 update-electron-app（针对开源项目）

如果你的 Electron 应用是**开源项目**，并且使用 **GitHub Releases** 发布版本，可以考虑 Electron 官方提供的 [
`update-electron-app`](https://github.com/electron/update-electron-app) 模块。

1. **安装**：
   ```bash
   npm install update-electron-app
   ```

2. **使用**：
   在主进程的任何地方调用：
   ```javascript
   require('update-electron-app')();
   ```
   该模块会在应用启动时和之后每隔一段时间（如10分钟）自动检查更新。它使用 GitHub Releases 中的信息，发现更新后会自动下载并在就绪时提示用户。

### ⚠️ 注意事项与常见问题

1. **代码签名**（Code Signing）：**至关重要**！无论是 macOS 还是 Windows，**没有正确签名的应用将无法正常进行自动更新**
   ，甚至可能无法运行。macOS 通常需要 Apple Developer 证书，Windows 则可以使用代码签名证书（如来自 DigiCert, Sectigo 等）。
2. **更新服务器配置**：确保你的服务器正确提供了更新文件（如 `latest.yml`）并且其 **MIME 类型**设置正确。例如，对于 `.yml`
   文件，服务器应返回 `text/plain` 或 `application/x-yaml`，否则客户端可能无法解析。
3. **权限问题**：在 macOS 和 Linux 上，应用目录可能没有写权限。更新文件通常应**先下载到临时目录**（如 `app.getPath('temp')`
   或 `app.getPath('userData')`），验证后再进行替换操作。
4. **版本管理**：使用语义化版本（Semantic Versioning），并确保打包配置和服务器上的版本信息准确无误。
5. **测试**：务必在**所有目标平台**上充分测试更新流程，包括从旧版本升级到新版本、网络中断、更新失败回滚等场景。
6. **错误处理**：做好网络错误、服务器错误、文件校验失败等情况的处理和用户提示。
7. **增量更新**：electron-updater 支持生成差分更新包，可以显著减小下载体积。确保在 electron-builder 配置中启用相关功能。
8. **macOS 沙盒限制**：如果应用启用了沙盒（Sandbox），可能会对更新操作产生限制，需要仔细测试。

### 💎 总结

选择哪种方案主要取决于你的具体需求：

* **追求功能完善、省心可靠**：直接使用 **electron-updater** (配合 electron-builder)。
* **应用开源且发布在 GitHub**：可以尝试 **update-electron-app**。
* **需要极度定制化的更新服务器逻辑**：研究内置的 **autoUpdater** 并自建服务器。
* **仅更新渲染进程资源且希望轻量**：可以考虑**手动热更新**，但务必注意安全性。

