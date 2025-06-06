# VitePress配置

以下是 VitePress 支持的常见 Frontmatter 字段及其类型和用途的详细说明，结合官方文档和实际用例整理：

---

### 📌 一、核心布局字段
| **字段名** | **类型** | **用途** | **示例** |  
|------------|----------|----------|----------|  
| `layout` | `'doc' | 'page' | 'home' | false` | 定义页面布局模式：<br>- `doc`（默认）：文档样式布局<br>- `page`：无默认样式的空白页<br>- `home`：主页模板布局<br>- `false`：完全禁用布局（无导航/侧边栏） | `layout: home` |  
| `title` | `string` | 页面标题（覆盖文件名默认标题） | `title: 入门指南` |  

---

### 🏠 二、主页布局专属字段 (`layout: home`)
| **字段名** | **类型** | **用途** | **示例** |  
|------------|----------|----------|----------|  
| `hero` | `object` | 配置主页顶部横幅区域 |
| `hero.name` | `string` | 主标题文本 | `name: VitePress` |  
| `hero.text` | `string` | 副标题文本 | `text: 静态站点生成器` |  
| `hero.tagline` | `string` | 标语描述 | `tagline: 基于 Vite & Vue` |  
| `hero.image` | `object` | 横幅图片配置 | `image: { src: /logo.png, alt: Logo }` |  
| `hero.actions` | `array` | 按钮组配置（最多2个） |
| `actions.theme` | `'brand' | 'alt'` | 按钮主题（品牌色/备用色） | `theme: brand` |  
| `actions.text` | `string` | 按钮文本 | `text: 开始使用` |  
| `actions.link` | `string` | 跳转链接（支持站内/外部） | `link: /guide/start` |  
| `features` | `array` | 特性展示区块 |
| `features.title` | `string` | 特性标题 | `title: 高性能` |  
| `features.details` | `string` | 特性描述 | `details: 基于 Vite 构建` |  
| `features.link` | `string` | 特性跳转链接 | `link: https://vitejs.dev` |  

---

### ⚙️ 三、基础配置字段
| **字段名** | **类型** | **用途** | **示例** |  
|------------|----------|----------|----------|  
| `editLink` | `boolean` | 是否显示“编辑此页”链接 | `editLink: true` |  
| `lang` | `string` | 页面语言（影响`<html lang>`属性） | `lang: zh-CN` |  
| `description` | `string` | 页面描述（SEO 元数据） | `description: VitePress 使用指南` |  

---

### 🛠️ 四、自定义字段
可自由定义任意字段，用于页面逻辑或组件通信：
```yaml  
author: John Doe  
priority: 1  
tags: [vue, vitepress]  
```  
**访问方式**：
1. **模板中**：通过 `{{ $frontmatter.author }}` 插入
2. **Vue 组件中**：

```vue  
<script setup>  
import { useData } from 'vitepress'  
const { frontmatter } = useData()  
console.log(frontmatter.value.tags) // ["vue", "vitepress"]  
</script>  
```   

---

### 💡 五、其他特性
1. **JSON Frontmatter 支持**：
   ```json  
   {  
     "title": "JSON 示例",  
     "layout": "page"  
   }  
   ```   
2. **优先级规则**：Frontmatter 字段 > 主题配置 > 全局配置。
3. **自定义布局**：通过 `layout: customName` 注册 Vue 组件实现。

> 完整字段参考见 [VitePress Frontmatter 配置文档](https://vitepress.dev/zh/guide/frontmatter)。

## 插件配置

### 配置 Math Latex 公式

```js
import mathjax3 from 'markdown-it-mathjax3';

const customElements = [
  'mjx-container',
  'mjx-assistive-mml',
  'math',
  'maction',
  'maligngroup',
  'malignmark',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mi',
  'mlongdiv',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'ms',
  'mscarries',
  'mscarry',
  'mscarries',
  'msgroup',
  'mstack',
  'mlongdiv',
  'msline',
  'mstack',
  'mspace',
  'msqrt',
  'msrow',
  'mstack',
  'mstack',
  'mstyle',
  'msub',
  'msup',
  'msubsup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'semantics',
  'math',
  'mi',
  'mn',
  'mo',
  'ms',
  'mspace',
  'mtext',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'msqrt',
  'mstyle',
  'mmultiscripts',
  'mover',
  'mprescripts',
  'msub',
  'msubsup',
  'msup',
  'munder',
  'munderover',
  'none',
  'maligngroup',
  'malignmark',
  'mtable',
  'mtd',
  'mtr',
  'mlongdiv',
  'mscarries',
  'mscarry',
  'msgroup',
  'msline',
  'msrow',
  'mstack',
  'maction',
  'semantics',
  'annotation',
  'annotation-xml',
];

export default {
  markdown: {
    config: (md) => {
      md.use(mathjax3);
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },
};
```

### Mermaid 配置

在 VitePress 中如果想要画流程图，饼图，UML类图等一系列图的话，VitePress 原生是不支持的，但是我们可以使用 Mermaid 的vitepress插件，名字是 vitepress-plugin-mermaid。下面介绍如何安装和使用

[插件的 Github 地址](https://github.com/emersonbottero/vitepress-plugin-mermaid)
[插件使用文档](https://emersonbottero.github.io/vitepress-plugin-mermaid/)
```bash
npm i vitepress-plugin-mermaid mermaid -D
```
```js
// .vitepress/config.js
//import { defineConfig } from "vitepress";// [!code --]
import { withMermaid } from "vitepress-plugin-mermaid";// [!code ++]

//export default defineConfig({// [!code --]
export default withMermaid({
   // [!code ++]
  // 你的原本配置
  // 可选地，可以传入MermaidConfig
  mermaid: {
    // 配置参考： https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults
  },
  // 可选地使用MermaidPluginConfig为插件本身设置额外的配置
  mermaidPlugin: {
   
    class: "mermaid my-class" // 为父容器设置额外的CSS类
  }
});

```
