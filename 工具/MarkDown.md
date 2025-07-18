# Markdown

## 快捷键

| 快捷键 | 操作     |
| ------ | -------- |
| Ctrl+B | 加粗     |
| Ctrl+I | 斜体     |
| Ctrl+Q | 引用     |
| Ctrl+L | 插入链接 |
| Ctrl+K | 插入代码 |
| Ctrl+G | 插入图片 |
| Ctrl+H | 提升标题 |
| Ctrl+O | 有序列表 |
| Ctrl+U | 无序列表 |
| Ctrl+R | 横线     |
| Ctrl+Z | 撤销     |
| Ctrl+Y | 重做     |

# Markdown 语法速查手册

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

## 文本样式

```markdown
*斜体文本*  
_另一种斜体写法_

**粗体文本**  
__另一种粗体写法__

~~删除线文本~~

行内`代码`效果

==高亮文本==（部分平台支持）
```

## 列表

### 无序列表
```markdown
- 项目一
- 项目二
  - 子项目（缩进2空格）
* 替代符号
```

### 有序列表
```markdown
1. 第一项
2. 第二项
   1. 子项（缩进3空格）
```

## 链接与图片

```markdown
[文字链接](https://example.com)
![图片描述](图片地址.png)

直接显示链接：<https://example.com>
```

## 引用与代码块

```markdown
> 引用文本
>> 嵌套引用

单行代码：`print("Hello World")`

代码块（指定语言）：
```python
def hello():
    print("Hello Markdown!")
```
（实际使用需去掉反引号转义）
```

## 表格

```markdown
| 左对齐 | 居中对齐 | 右对齐 |
| :----- | :------: | -----: |
| 单元格 |  单元格  |  单元格 |
| 第二行 |  内容    |    $100 |
```

## 其他元素

```markdown
水平分割线：
---
或
***

脚注[^1]
[^1]: 脚注说明文字

任务列表：
- [ ] 未完成任务
- [x] 已完成任务
```

## 特殊技巧

```markdown
转义字符：\* 显示星号而非斜体

自动链接：https://example.com

HTML支持：<kbd>Ctrl</kbd>+<kbd>C</kbd>
```

> 💡 **使用提示**：
> 1. 段落间用空行分隔
> 2. 多数符号后需加空格
> 3. 不同平台可能有渲染差异
> 4. 支持直接嵌套HTML代码

## checkbox

- [ ] 吃饭
- [ ] 睡觉
- [x] 打豆豆


## 时间线

::: timeline 2023-04-24
- 一个非常棒的开源项目 H5-Dooring 目前 star 3.1k
    - 开源地址 https://github.com/MrXujiang/h5-Dooring
    - 基本介绍 http://h5.dooring.cn/doc/zh/guide/
- 《深入浅出webpack》 http://webpack.wuhaolin.cn/
  :::

::: timeline 2023-04-23
:::

📌 **推荐工具**：
- Typora（实时预览编辑器）
- Markdown Here（浏览器插件）
- VS Code + Markdown插件
