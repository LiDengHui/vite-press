# LaTex公式

以下是一份使用 **Markdown 语法**编写的大学及以上常用公式说明书，涵盖微积分、线性代数、概率统计、微分方程、物理学等领域的核心公式。所有公式均采用 **LaTeX 语法**，可直接在支持 MathJax/Katex 的 Markdown 环境中渲染。

```markdown
# 大学及以上常用数学公式说明书

## 目录
1. [微积分](#微积分)  
2. [线性代数](#线性代数)  
3. [概率与统计](#概率与统计)  
4. [微分方程](#微分方程)  
5. [物理学基础](#物理学基础)  
6. [Markdown 公式语法指南](#markdown-公式语法指南)

---

## 微积分
### 1. 极限
$$ \lim_{x \to a} f(x) = L $$

### 2. 导数定义
$$ f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} $$

### 3. 常见导数
- 指数函数：  
  $$ \frac{d}{dx} e^{ax} = ae^{ax} $$
- 三角函数：  
  $$ \frac{d}{dx} \sin(ax) = a\cos(ax) $$

### 4. 积分
- 不定积分：  
  $$ \int x^n \, dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1) $$
- 定积分（牛顿-莱布尼茨公式）：  
  $$ \int_a^b f(x) \, dx = F(b) - F(a) $$

### 5. 泰勒展开
$$ f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!} (x-a)^n $$

---

## 线性代数
### 1. 矩阵乘法
$$ (AB)_{ij} = \sum_{k=1}^{n} a_{ik} b_{kj} $$

### 2. 行列式
$$ \det(A) = \sum_{\sigma \in S_n} \text{sgn}(\sigma) \prod_{i=1}^n a_{i,\sigma(i)} $$

### 3. 特征方程
$$ \det(A - \lambda I) = 0 $$

### 4. 向量内积
$$ \mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^n u_i v_i $$

---

## 概率与统计
### 1. 条件概率
$$ P(A|B) = \frac{P(A \cap B)}{P(B)} $$

### 2. 贝叶斯定理
$$ P(A|B) = \frac{P(B|A)P(A)}{P(B)} $$

### 3. 正态分布 PDF
$$ f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} $$

### 4. 期望值
$$ E[X] = \int_{-\infty}^{\infty} x f(x) \, dx $$

---

## 微分方程
### 1. 一阶线性方程
$$ \frac{dy}{dx} + P(x)y = Q(x) $$

### 2. 二阶常系数齐次
$$ y'' + py' + qy = 0 $$
解的形式：  
$$ y = e^{rx} \quad (r^2 + pr + q = 0) $$

### 3. 热传导方程
$$ \frac{\partial u}{\partial t} = \alpha \nabla^2 u $$

---

## 物理学基础
### 1. 牛顿第二定律
$$ \mathbf{F} = m \mathbf{a} $$

### 2. 麦克斯韦方程组（积分形式）
$$ \oint_S \mathbf{E} \cdot d\mathbf{A} = \frac{Q}{\varepsilon_0} $$  
$$ \oint_C \mathbf{B} \cdot d\mathbf{l} = \mu_0 I + \mu_0\varepsilon_0 \frac{d}{dt}\int_S \mathbf{E} \cdot d\mathbf{A} $$

### 3. 薛定谔方程
$$ i\hbar \frac{\partial}{\partial t} \Psi = \hat{H} \Psi $$

### 4. 质能方程
$$ E = mc^2 $$

---

## Markdown 公式语法指南
### 行内公式
用 `$ 公式 $` 包裹：  
`$ \nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0} $` → $ \nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0} $

### 块级公式
用 `$$ 公式 $$` 包裹：  
```latex
$$ 
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi} 
$$
```
→  
$$ \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi} $$

### 常用符号
| 类型       | 语法             | 示例         |
|------------|------------------|--------------|
| 上下标     | `x^{a}`, `x_{b}` | $x^{a}$, $x_{b}$ |
| 分数       | `\frac{a}{b}`    | $\frac{a}{b}$    |
| 希腊字母   | `\alpha \Omega`  | $\alpha$, $\Omega$ |
| 矢量       | `\vec{v}`        | $\vec{v}$        |
| 矩阵       | `\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}` | $\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ |

> **提示**：在 VS Code 中安装 **Markdown+Math** 插件可实时预览公式。
```

---

**使用说明**：
1. 复制此内容到 `.md` 文件中
2. 在支持 LaTeX 的 Markdown 编辑器（如 Typora、Obsidian、GitHub）中打开
3. 物理公式需结合上下文使用，注意单位制（SI/CGS）
4. 部分复杂公式需导入特定宏包（如 `\usepackage{amsmath}`）

> 公式语法遵循 **LaTeX 数学标准**，完整符号表参考：[LaTeX 数学符号大全](https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols)
