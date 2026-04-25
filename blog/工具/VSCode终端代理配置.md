# VS Code / Cursor 终端代理配置教程

本文档指导如何在 VS Code 或 Cursor 编辑器的集成终端中配置代理环境变量，使其通过本地代理服务器（如 Clash、V2Ray 等）访问网络。

## 背景说明

许多开发者使用代理工具（如 Clash）来访问受限网络资源。默认情况下，VS Code 的集成终端不会继承系统的代理设置。本教程通过配置工作区设置来自动设置终端的代理环境变量。

## 配置步骤

### 1. 创建或编辑工作区设置文件

在项目根目录下创建 `.vscode` 文件夹（如果不存在），然后创建 `settings.json` 文件。

文件路径：`.vscode/settings.json`

添加以下配置内容：

```json
{
    "terminal.integrated.env.windows": {
        "HTTP_PROXY": "http://127.0.0.1:7890",
        "HTTPS_PROXY": "http://127.0.0.1:7890",
        "ALL_PROXY": "http://127.0.0.1:7890",
        "NO_PROXY": "localhost,127.0.0.1,::1"
    },
    "terminal.integrated.env.linux": {
        "HTTP_PROXY": "http://127.0.0.1:7890",
        "HTTPS_PROXY": "http://127.0.0.1:7890",
        "ALL_PROXY": "http://127.0.0.1:7890",
        "NO_PROXY": "localhost,127.0.0.1,::1"
    },
    "terminal.integrated.env.osx": {
        "HTTP_PROXY": "http://127.0.0.1:7890",
        "HTTPS_PROXY": "http://127.0.0.1:7890",
        "ALL_PROXY": "http://127.0.0.1:7890",
        "NO_PROXY": "localhost,127.0.0.1,::1"
    }
}
```

**说明：**

- `HTTP_PROXY` 和 `HTTPS_PROXY`：设置 HTTP 和 HTTPS 代理服务器地址。
- `ALL_PROXY`：设置所有协议的代理（备用）。
- `NO_PROXY`：指定不走代理的地址，如本地服务。
- 端口 `7890` 是 Clash 等工具的常见 HTTP 代理端口，根据你的代理工具实际端口调整。

### 2. 重启终端

配置完成后，关闭当前集成终端，然后重新打开一个新的终端窗口。环境变量只在新终端中生效。

### 3. 验证配置

在新的终端中运行以下命令验证代理是否生效：

```bash
# 检查环境变量
echo $HTTP_PROXY
echo $HTTPS_PROXY

# 测试网络连接（例如访问 Google）
curl -I https://www.google.com
```

如果代理正常工作，你应该能看到代理服务器的响应。

## Git 代理配置

如果 Git 命令仍无法通过代理访问远程仓库，需要单独配置 Git 代理。

### 设置 Git 代理（全局）

```powershell
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

### 取消 Git 代理

```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 验证 Git 代理

```bash
git config --global --list | grep proxy
```

## 常见问题与故障排除

### 代理端口不是 7890

- 检查你的代理工具（如 Clash）的 HTTP 代理端口。
- 如果是 SOCKS5 代理，将 `http://` 替换为 `socks5://`，例如：`socks5://127.0.0.1:7890`

### 代理工具未启动

- 确保代理软件（如 Clash）已运行并启用系统代理或 HTTP 代理。

### 特定域名不走代理

- 在 `NO_PROXY` 中添加更多域名，例如：`"NO_PROXY": "localhost,127.0.0.1,::1,.local,.internal"`

### Windows 特定配置

- 如果使用 PowerShell，确保代理设置正确应用。
- 某些情况下可能需要重启 VS Code。

### 环境变量不生效

- 确认 `.vscode/settings.json` 文件语法正确（无 JSON 错误）。
- 检查是否有其他配置文件覆盖了这些设置。

## 注意事项

- 此配置仅影响当前工作区的集成终端，不影响系统其他部分。
- 敏感信息（如代理密码）不应硬编码在配置文件中。
- 定期检查代理工具的更新，以确保兼容性。

通过以上配置，你的 VS Code / Cursor 终端将能够正常使用代理访问网络。
