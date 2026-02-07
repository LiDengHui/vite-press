# cn-font-split 的 DLL 为什么没下载

## 现象

`dist` 下没有 `libffi-x86_64-pc-windows-msvc.dll`，运行时报错：

```
ERR_FFI: Failed to load shared library: 找不到指定的模块。
lib: '...\cn-font-split\dist\libffi-x86_64-pc-windows-msvc.dll'
```

该 DLL **不会随 npm 包发布**，需要由安装后的 **postinstall 脚本** 从 GitHub Releases 下载到 `cn-font-split/dist/`。  
若 postinstall 没成功执行或下载失败，`dist` 下就不会有该文件。

---

## 可能原因

### 1. postinstall 失败被“吞掉”（最常见）

`cn-font-split` 的 `package.json` 里：

```json
"postinstall": "node ./dist/cli.js i default || node -v"
```

含义是：先执行 `node ./dist/cli.js i default` 下载 DLL，**若失败就执行 `node -v`**。  
因此只要 `node -v` 能跑，整个脚本的退出码就是 0，pnpm 会认为安装成功，**下载失败时不会报错**。

- 若网络不通、PowerShell 报错、写入权限等问题导致下载失败，你这边看不到任何安装错误，但 DLL 不会出现。

### 2. pnpm 未执行依赖的 postinstall（pnpm 10+）

从 pnpm 10 起，出于安全考虑，**依赖包的生命周期脚本（含 postinstall）默认不执行**。  
只有通过配置允许的包才会跑脚本。

- 若未为 `cn-font-split` 或全局开启“允许构建/脚本”，其 postinstall **根本不会运行**，DLL 也就不会下载。
- 项目当前没有 `.npmrc` 或 `pnpm-workspace.yaml` 里的 等配置，在 pnpm 10+ 下就会属于“未允许”的依赖。

### 3. 从 store 恢复时未再跑 postinstall

pnpm 从**本地 store 恢复**已缓存的包时，有可能**不再执行**该包的 postinstall（视 pnpm 版本与配置而定）。

- 第一次安装时若因上述 1 或 2 导致没下载成功，之后多次 `pnpm install` 可能一直用缓存的包，且不再跑 postinstall，DLL 会一直缺失。

### 4. 网络或环境

- 下载地址为：`https://github.com/KonghaYao/cn-font-split/releases/download/<version>/libffi-x86_64-pc-windows-msvc.dll`（版本号由 init.ps1 里请求 ungh.cc 得到）。
- 若 GitHub / ungh.cc 访问不了或被拦截，下载会失败；同样因为 `|| node -v`，安装不会报错。
- Windows 下 postinstall 会通过 `powershell -ExecutionPolicy Bypass -File ...\init.ps1 i default` 执行；若 PowerShell 策略或路径异常，也可能静默失败。

---

## 处理办法

### 办法一：手动下载 DLL（推荐，立刻可用）

在项目根目录执行（会往当前项目使用的 `cn-font-split` 的 `dist` 里下载）：

```bash
npx cn-font-split i default
```

或直接指定包路径：

```bash
node node_modules/.pnpm/cn-font-split@7.4.1/node_modules/cn-font-split/dist/cli.js i default
```

执行成功后，`node_modules\.pnpm\cn-font-split@7.4.1\node_modules\cn-font-split\dist\` 下会出现 `libffi-x86_64-pc-windows-msvc.dll`。

若 GitHub 访问不稳定，可先设置镜像再执行（示例）：

```bash
set CN_FONT_SPLIT_GH_HOST=https://ghproxy.com/https://github.com
npx cn-font-split i default
```

### `allowBuilds` / `onlyBuiltDependencies` 区别（pnpm 10+）

| 名称 | 含义 | 说明 |
|------|------|------|
| **onlyBuiltDependencies** | 配置项（白名单） | 写在 `pnpm-workspace.yaml` 或 `.npmrc` 里。**只有**列在此处的包才会在安装时执行生命周期脚本（如 postinstall）；未列出的依赖默认不执行。适合只允许少数信任的包跑脚本。 |
| **allowBuilds** | 操作/概念 | 不是单独一个配置键，而是「允许某包执行构建脚本」这一行为。通过 `pnpm approve-builds` 或 `pnpm add --allow-build <pkg>` 会把包**写入** `onlyBuiltDependencies`。文档里说的 “use allowBuilds” 即指：用白名单方式允许构建，而白名单就是 onlyBuiltDependencies。 |
| **dangerouslyAllowAllBuilds** | 配置项（全局放开） | 设为 `true` 时，**所有**依赖都会执行 postinstall 等脚本。安全风险大，不推荐。 |
| **ignoredBuiltDependencies** | 配置项（黑名单） | 显式禁止执行构建脚本的包列表；与 onlyBuiltDependencies 二选一使用。 |

总结：要允许 `cn-font-split` 跑 postinstall，应配置 **onlyBuiltDependencies**（或通过 approve-builds 间接写入）；不要用 dangerouslyAllowAllBuilds。

---

### 办法二：让 pnpm 每次安装时都跑 postinstall（pnpm 10+）

若希望以后 `pnpm install` 时自动下载 DLL，需要让 pnpm 对 `cn-font-split` 执行生命周期脚本。

在项目根目录新建或修改 **`.npmrc`** 或 **`package.json`**。

**单个模块（.npmrc）：**

```ini
onlyBuiltDependencies=cn-font-split
```

**多个模块** 有两种写法：

1. **.npmrc**（数组写法，每行一个）：

```ini
onlyBuiltDependencies[]=cn-font-split
onlyBuiltDependencies[]=esbuild
onlyBuiltDependencies[]=@swc/core
```

2. **package.json**（在根目录的 `package.json` 里增加 `pnpm` 字段）：

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["cn-font-split", "esbuild", "@swc/core"]
  }
}
```

然后删除 `node_modules` 和 lockfile 中对该包的缓存后重新安装（或先执行一次 `pnpm rebuild cn-font-split`），这样会在安装/重建时再次跑 postinstall 并尝试下载 DLL。  
若仍因网络等原因失败，再用手动命令（办法一）补下即可。

### 办法三：开发环境不依赖该 DLL（当前项目已采用）

本站已在 `.vitepress/config.ts` 中配置：**仅在 production 构建时启用 `vite-plugin-font`**（即仅 build 时用 `cn-font-split`），dev 时不用。

因此：

- **开发**：`pnpm dev` 不加载该 DLL，可直接跑。
- **构建**：若需要本地也执行 `pnpm build` 且要用字体子集化，再按办法一或办法二确保 DLL 存在即可。

---

## 小结

| 原因 | 说明 |
|------|------|
| postinstall 用 `\|\| node -v` | 下载失败时脚本仍返回 0，安装“成功”但 DLL 未下载 |
| pnpm 10+ 默认不跑依赖脚本 | 未配置 allowBuilds/onlyBuiltDependencies 时，cn-font-split 的 postinstall 不会执行 |
| 从 store 恢复不重复跑脚本 | 缓存包可能不再执行 postinstall，DLL 一直缺失 |
| 网络 / PowerShell | GitHub 或 ungh.cc 不可达，或 init.ps1 执行异常，同样会静默失败 |

**建议**：先执行一次 `npx cn-font-split i default` 确认能下载到 DLL；若需要长期自动下载，再在 `.npmrc` 中配置 `onlyBuiltDependencies=cn-font-split` 并视情况配合 `pnpm rebuild`。
