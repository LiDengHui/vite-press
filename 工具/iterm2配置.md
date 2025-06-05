---
title: iterm2配置
tags:
  - iterm2
  - mac
categories:
  - 技术文档
  - 工具
  - iterm2
date: 2020-08-24 00:28:36
---

# iterm2配置
1. 安装 Powerlevel10k

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k
```

克隆下来之后，在 zsh 的配置文件 **~/.zshrc** 中设置 
`ZSH_THEME=powerlevel10k/powerlevel10k` 
即可
2. 安装 Nerd Font 字体

https://github.com/ryanoasis/nerd-fonts/releases/tag/v2.1.0

3. 使用`p10k configure` 配置

