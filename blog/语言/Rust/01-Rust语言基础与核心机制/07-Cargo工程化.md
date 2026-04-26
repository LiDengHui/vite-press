# Cargo工程化

## 1. 这是什么

`Cargo` 是 Rust 官方提供的包管理器和构建工具。  
如果说 Rust 语言本身解决的是“代码怎么安全高效地写”，那 Cargo 解决的就是：

- 项目怎么创建
- 依赖怎么管理
- 构建怎么执行
- 测试怎么运行
- 发布怎么组织

一句话理解：

- Rust 是语言
- Cargo 是围绕 Rust 项目的工程化入口

学 Rust 如果只停留在单文件语法练习，很容易一直像在刷题；真正进入项目开发，Cargo 基本绕不过去。

## 2. 为什么重要

一个现代语言如果没有统一工程工具链，项目很快就会变乱。  
Cargo 重要就在于，它把很多工程动作统一成了清晰约定：

- 目录结构有默认规范
- 依赖写在 `Cargo.toml`
- 构建、测试、运行命令统一
- 社区库生态围绕 crates.io 和 Cargo 运转

这意味着：

- 你接别人项目时更容易上手
- 团队协作时约定成本更低
- 工具链和生态配合更顺畅

所以 Cargo 不只是“一个命令工具”，而是 Rust 工程文化的一部分。

## 3. 先建立直觉

先看最常见的几个命令：

```bash
cargo new hello_rust
cargo run
cargo build
cargo test
```

可以这样理解：

- `cargo new`：创建一个有标准结构的项目
- `cargo run`：构建并运行
- `cargo build`：只构建
- `cargo test`：跑测试

Cargo 的价值就在于，它把很多零散动作收口成一个统一入口。

## 4. 核心内容

### 4.1 Cargo 项目的基本结构

执行：

```bash
cargo new hello_rust
```

通常会得到类似结构：

```text
hello_rust/
├── Cargo.toml
└── src/
    └── main.rs
```

这里：

- `Cargo.toml` 是项目清单文件
- `src/main.rs` 是二进制程序默认入口

如果你创建的是库项目：

```bash
cargo new my_lib --lib
```

则更常见的是：

```text
my_lib/
├── Cargo.toml
└── src/
    └── lib.rs
```

所以最基本的认知是：

- `main.rs` 更偏可执行程序
- `lib.rs` 更偏可复用库代码

### 4.2 `Cargo.toml` 在做什么

`Cargo.toml` 是 Cargo 工程的核心配置文件，例如：

```toml
[package]
name = "hello_rust"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = "1"
```

这里最关键的是两块：

- `[package]`：项目自身元信息
- `[dependencies]`：外部依赖

也就是说，一个 Rust 项目要依赖什么库、版本大概是什么，都在这里显式声明。

### 4.3 依赖管理的基本直觉

当你写：

```toml
[dependencies]
rand = "0.8"
```

可以理解为：

- 项目需要 `rand`
- Cargo 会帮你解析依赖图、下载合适版本、参与构建

这比手动去各处下载源码、拼接编译参数的方式稳定太多。

另外常见还会看到：

- `[dev-dependencies]`：测试或开发期依赖
- `[build-dependencies]`：构建脚本依赖

这也体现了 Cargo 在工程边界上的清晰分层。

### 4.4 常用命令的语义别只背表面

#### `cargo run`

```bash
cargo run
```

语义是：

- 构建项目
- 然后运行生成的可执行文件

适合快速迭代。

#### `cargo build`

```bash
cargo build
cargo build --release
```

区别可以理解为：

- 默认 build 偏开发体验
- `--release` 偏正式优化产物

也就是说，性能测试、发布产物、真实压测，通常不能只看默认构建。

#### `cargo test`

```bash
cargo test
```

Cargo 会统一发现并执行测试。  
这让 Rust 项目“代码 / 测试 / 工具链”之间结合得很自然。

#### `cargo check`

```bash
cargo check
```

它会做类型检查等编译前检查，但不生成完整最终产物。  
在日常开发里，这通常比完整 build 更快，适合高频反馈。

### 4.5 Cargo 不只是构建，还在组织工程习惯

学习一段时间后你会发现，Cargo 真正厉害的不只是“命令多”，而是它把项目习惯统一了：

- 大家都知道入口在哪
- 大家都知道依赖写哪
- 大家都知道测试怎么跑
- 大家都知道版本信息放哪

这类统一约定会极大降低协作摩擦。

### 4.6 crates.io 与生态协作

Rust 社区的大量第三方库会发布到 crates.io。  
Cargo 与它天然配套，所以你在项目里引入生态库时，通常流程非常顺：

- 找 crate
- 加到 `Cargo.toml`
- `cargo build` / `cargo check`
- 在代码里 `use`

这也是为什么 Rust 的工程体验虽然严格，但整体并不割裂。

### 4.7 lock 文件与可重复构建

Rust 项目里通常还会看到 `Cargo.lock`。  
它的核心作用可以理解为：

- 把这次依赖解析后的具体版本结果固定下来
- 提升构建可重复性

这对团队协作、CI 和部署都很重要，因为“同样的代码在不同机器上构建出不同依赖组合”会制造很多隐性问题。

### 4.8 workspace：多 crate 项目组织

当项目变大后，一个仓库里可能不止一个 crate。  
这时 Cargo 的 workspace 能帮助你统一组织：

- 多个库
- 多个可执行程序
- 共享依赖或统一构建流程

初学时不必一上来就深挖，但要先知道：

- Rust 大项目不是只能靠一个 `src/main.rs` 硬撑
- Cargo 已经为多模块、多 crate 协作准备好了结构化工具

## 5. 常见误区

### 5.1 误区一：Cargo 只是“安装依赖的工具”

不对。  
它当然管依赖，但更重要的是它承载了 Rust 项目的整体工程化流程。

### 5.2 误区二：会 `cargo run` 就算会 Cargo

那只是刚摸到表面。  
真正要理解的是：

- 项目结构
- 依赖分层
- build / check / test / release 的语义区别
- lock 文件和 workspace 的作用

### 5.3 误区三：开发环境和发布环境没区别

默认 `cargo build` 和 `cargo build --release` 面向的目标并不一样。  
如果你不区分这两者，对性能判断和产物预期很容易出偏差。

### 5.4 误区四：目录结构可以随便乱放

理论上可以做很多定制，但如果一开始就乱改默认约定，后面读代码和协作成本会明显上升。

Rust 社区工具链之所以顺手，很大程度上就是因为大家愿意尊重 Cargo 约定。

## 6. 一个更实用的判断思路

当你准备把 Rust 从“语法练习”推进到“项目实践”时，可以先问自己：

1. 这个项目是可执行程序还是库
2. 依赖应该写进 `[dependencies]` 还是 `[dev-dependencies]`
3. 当前是需要快速检查，还是需要完整构建
4. 现在关注的是开发调试，还是发布优化产物
5. 这个仓库未来会不会成长为多 crate 结构

只要这些判断清楚，很多工程问题都会顺很多。

## 7. 学习建议

学习 Cargo 时，建议按这个顺序：

1. 先自己 `cargo new` 一个最小项目
2. 熟悉 `run / build / check / test`
3. 给项目加一两个依赖
4. 看懂 `Cargo.toml` 和 `Cargo.lock`
5. 再接触 library crate 和 workspace

这样你对 Rust 工程化会有非常扎实的第一层直觉。

## 8. 自测标准

- 能解释 Cargo 在 Rust 生态里负责什么
- 能看懂 `Cargo.toml` 的基本结构
- 能区分 `cargo run`、`cargo build`、`cargo check`、`cargo test` 的用途
- 能说明 `Cargo.lock` 为什么重要
- 能理解 workspace 是为多 crate 项目组织准备的
