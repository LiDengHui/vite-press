# avn自动切换node版本


## 安装nvm

> curl -o- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

在`~/.bashrc`添加
```
export NVM_DIR="$HOME/.nvm" 
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```    
> source ~/.bashrc

## 安装avn

```bash
npm install -g avn avn-nvm avn-n
avn setup
```

## 自动切换node

在项目目录下建文件`.nvmrc`

```
10.16.3
```

## 更新文件版本

```bash
npm i npm-check-updates
ncu
```
