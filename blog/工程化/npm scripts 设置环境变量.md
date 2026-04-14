在 npm scripts 中设置环境变量有几种常用方法，以下是详细说明：

### 方法 1：使用 `cross-env`（跨平台推荐）
适用于 Windows/Mac/Linux 的通用方案：
```bash
npm install cross-env --save-dev
```
在 `package.json` 中：
```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development API_KEY=12345 node app.js",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

### 方法 2：类 Unix 系统原生语法（Mac/Linux）
```json
{
  "scripts": {
    "dev": "NODE_ENV=development API_KEY=12345 node app.js"
  }
}
```

### 方法 3：Windows 原生语法
```json
{
  "scripts": {
    "dev": "set NODE_ENV=development&& set API_KEY=12345&& node app.js",
    // 或使用引号避免空格问题
    "build": "set \"NODE_ENV=production\" && webpack"
  }
}
```

### 方法 4：使用 `.env` 文件（需配合工具）
1. 安装依赖：
```bash
npm install dotenv --save-dev
```
2. 创建 `.env` 文件：
```
API_KEY=your_api_key
DEBUG=true
```
3. 在脚本中使用：
```json
{
  "scripts": {
    "start": "node -r dotenv/config app.js"
  }
}
```

### 方法 5：使用 `env-cmd` 包
```bash
npm install env-cmd --save-dev
```
```json
{
  "scripts": {
    "start": "env-cmd node app.js",
    "test": "env-cmd -f .env.test jest"
  }
}
```

### 多变量设置技巧
```json
{
  "scripts": {
    "deploy": "cross-env APP_ENV=prod AWS_REGION=us-east-1 node deploy.js"
  }
}
```

### 在脚本中访问变量
```javascript
// app.js
console.log('Environment:', process.env.NODE_ENV);
console.log('API Key:', process.env.API_KEY);
```

### 注意事项：
1. **空格敏感**：
    - ✅ 正确：`NODE_ENV=test node app.js`
    - ❌ 错误：`NODE_ENV = test node app.js`

2. **变量优先级**：
    - 命令行变量 > `.env` 文件变量 > 系统环境变量

3. **安全建议**：
    - 敏感信息（如 API Key）应添加到 `.gitignore`
    - 使用 `.env` 文件时不要提交到版本库

**推荐方案**：
- 跨平台项目使用 `cross-env`
- 需要管理多环境时使用 `env-cmd` + `.env` 文件
- 简单项目可直接在脚本中声明变量

> 💡 提示：对于 Vue/React 等框架，通常内置了 `.env` 文件支持，无需额外配置（如 `.env.production` 文件会被自动加载）
