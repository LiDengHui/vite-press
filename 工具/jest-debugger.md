---
layout: posts
title: jest-debugger
date: 2020-07-26 12:33:09
tags: ['jest', 'vscode']
categories: ['工具']
---

# jest 配置 vscode 断点调试

## 方式一 使用 vscode 调试

1.  安装 jest
2.  配置 launch.json

```json
{
    // 使用 IntelliSense 了解相关属性。
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Jest Tests",
            "type": "node",
            "request": "launch",
            "runtimeArgs": [
                "--inspect-brk",
                "${workspaceRoot}/node_modules/.bin/jest",
                "--runInBand"
            ],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
        }
    ]
}
```

## 方式二 使用浏览器调试

配置 package.json 命令

> "debugger": "node --inspect-brk ./node_modules/jest/bin/jest --runInBand --no-cache --no-watchman"
