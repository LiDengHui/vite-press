---
title: webpack插件
tags:
  - webpack
categories:
  - 技术文档
  - 前端
  - webpack
date: 2020-09-20 14:34:29
---

# 知识点
1. 一个简单的插件构成
2. webpack构建流程
3. Tapable是如何把各个插件串联到一起的
4. compiler以及compileation对象的使用以及它们对应的事件钩子


# 插件的基本构成

`plugins` 是可以用自身原型方法apply来实例化的对象, apply只在安装插件被webpack compiler执行一次. apply方法传入一个webpack compiler 的应用,来访问编译器回调

一个简单的插件结构:

```js
class HelloPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {

  }

  // webpack 会调用 HelloPlugin函数,用来特定时机处理额外的逻辑
  apply(compiler) {
    compiler.hooks.emit.tap('HelloPlugin', (compilation)=>{
      // 在功能流程完成后可以调用webpack提供的回调
    })

    //如果事件是异步的,会带两个参数, 第二个参数为回调函数,在插件处理完任务时需要调用回调函数通知webpack处理完毕,才能进入下一个流程
    compiler.plugin('emit', function(compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行callback以通知webpack
      // 如果不执行callback, 运行流程将会一直卡在这里不往下执行
      callback()

    })
  }
}
```
插件安装时, 只需要将它的一个实例放到webpack.config.js的plugins数组里面
```js

const HelloPlugin = require('./hello-plugin.js')

var webpackConfig = {
  plugins: [
    new HelloPlugin({
      options:true
    })
  ]
}
```

## webpack Plugin的工作原理

1. 读取配置过程中,开会先执行 new HelloPlugin(options)初始化一个HelloPlugin 获取其实例
2. 初始化 compiler 对象后调用 HelloPlugin.apply(compiler)给插件实例传入compiler对象
3. 插件实例在获取到compiler对象后,就可以通过compiler.plugin(事件名,回调函数)监听到webpack广播出来的事件,并且可以通过compiler对象去操作webpack

## webpack 构建流程

webpack的基本构建流程如下:

1. 校验配置文件: 读取命令传入或webpack.config.js文件,初始化本次构建配置参数
2. 生成Compiler对象: 执行配置文件中的价差实例化语句 new MyWebpackPlugin(),为webpack事件流挂上自定义hooks
3. 引入entryOption阶段: webpack开始读取配置的Entires,递归遍历所有的入口文件
4. run/watch: 如果运行在watch模式则执行watch方法,否则执行run方法
5. compileation: 创建Compilation对象回调compilation相关钩子,依次进入每一个入口文件(entry),使用loader对文件进行编译.通过compilation 我可以读取到module的resource(资源路径)、loaders(使用loader)等信息.在将编译好的文件内容使用acorn 解析成AST静态语法数.然后递归、重复的执行这个过程,所有模块和依赖分析完成后,执行compilation的seal放大对每个chunk进行整理、优化、封装__webpack_require__来模拟模块化操作
6. emit: 所有文件的编译及转化都已经完成,包含了最终输出的资源,我梦可以在传入事件回调的compilation.asstes上拿到所需要的数据,其中包括即将输出的资源、代码块Chunk等信息

```js
//修改或添加资源
compilation.assets[`new-file.js`] = {
  source() {
    return `var a= 1;`
  }
  size() {
    return this.source().length;
  }
}
```
7. afterEmit: 文件已经写入磁盘完成
8. done: 完成编译

# webpack流程图

webpack编译

1. webpack 配置处理 
   1. 错误检查、增加默认配置等
2. 编译前的准备工作
   1. 处理webpack配置中的plugin、webpack自己一堆的plugin、初始化compiler等等
3. 开始编译主入口
4. resolve阶段: 解析文件路径&loaders
   1. 将文件的绝对路径解析出;同时解析出inline和我们配置在webpack.config.js中匹配的loaders,将loaders解析为固定的格式以及loaders执行文件的路径
5. loaders逐个执行
6. parse阶段 
   1. 将文件转换为ast树,解析出import和export等
7. 递归处理依赖
8. module一些优化&增加id
9. 生成chunk,决定每个chunk中包含的module
10. 生成文件
    1.  耕具模板生成文件名称;生成文件,这里会再次用到前面parse阶段的内容,将`import xxx``export xxx` 替换成webpack的写法
11. 写文件,结束

## 参考
[webpack插件机制](https://blog.didiyun.com/index.php/2019/03/01/webpack/)
# 理解事件流机制tapable

webpkac本质上是一种事件流机制, 他的工作流程就是将各个插件串联起来,而实现这一切的核心就是Tapable

webpack的tapable事件流机制保证了插件的有序性, 将各个插件串联起来,webpack 在运行过程中会广播事件, 插件知识需要监听它所关心的事件,就能加入到这条webpack机制中去,去去改变webpack的运作,使得整个系统的扩展性良好

tapable 也是一个小型的library, 是webpakc的核心工具. 类似于node中的events库,核心原理就是一个订阅发布模式,作用是提供类似的插件接口

webpack中最核心的负责编译的Compiler和负责构建bundles的Compilation都是Tapable的实例,可以直接在Compiler和Compilation对象上广播和监听事件,方法如下:

```js
/**
 * 广播事件
 * event-name 为事件名称,注意不要和现有的事件名重复
 * 
 */ 

compiler.apply('event-name', params)
compilation.apply('event-name', params)

/**
 * 监听事件
 */
compiler.plugin("event-name", function(params) {})
compilation.plugin("event-name", function(params){}),
```

Tabable 类暴露了 tap、tapAsync、和tapPromise 方法,可以根据钩子的同步/异步方式来选择一个函数注入逻辑

tap同步钩子

```js
compiler.hooks.compile.tap("MyPlugin", params =>{
  console.log('以同步方式出发compile钩子')
})
```
tapAsync 异步钩子, 通过 callback回调告诉webpack异步执行完毕tapPromise 异步钩子,返回一个Promise告诉webpack异步执行完毕

```js
compiler.hooks.run.tapAsync("MyPlugin",(compiler,callback) =>{
  console.log("异步方式触及 run 钩子。");
  callback();
})

compiler.hooks.run.tapPromise("MyPlugin", compiler =>{
  return new Promise(resolve=> setTImeojut(resolve,1000)).then=>{
    console.log("以具有延迟的异步方式触及 run 钩子")
  }
}),
```

## Tapable 用法

```js
const { 
  SyncHook, // 同步钩子
  SyncBailHook, // 同步保险钩子
  SyncWaterfallHook, // 同步瀑布沟组 
  SyncLoopHook,  // 同步循环钩子
  AsyncParallelHook, // 异步
  AsyncParallelBailHook, // 异步并醒保险钩子
  AsyncSeriesHook, // 异步串行钩子
  AsyncSeriesBailHook, // 异步串行保险钩子
  AsyncSeriesWaterfallHook // 异步串行瀑布钩子
} = require("tapable")
```

## 简单实现一个SyncHook

```js
class Hook {
  constructor(args) {
    this.taps = [];
    this.interceptors = [];
    this._args = args;
  }

  tap(name, fn) {
    this.taps.push({name, fn})
  }
}

class SyncHook extends Hook {
  call(name, fn) {
    try { 
      this.taps.forEach(tap =>tap.fn(name))
      fn(null, name)
    } catch(error) {
      fn(error)
    }
  }
}
```

## 关联 Tapable 和 webpack 插件

Compiler.js
```js
const {AsyncSeriesHook, SyncHook} = reuqire("tapable");

// 创建类
class Compiler {
  constructor() {
    this.hooks = {
      run : new AsyncSeriesHook(["compiler“]), // 异步钩子
      compile: new SyncHook(["params"]) // 同步钩子
    };
  }

  run() {
    // 执行异步钩子
    this.hooks.run.callAsync(this, err => {
      this.comile(onCompiled)
    })
  }

  compile() {
    // 执行同步钩子, 并传参
    this.hooks.compile.call(params);
  }

}

module.exports = Compiler
```

MyPlugin.js
```js

const Compiler = require("./Compiler");

class MyPlugin  {
  apply(compiler) { // 接收compiler参数
    compiler.hooks.run.tap("MyPlugin", ()=> console.log("开始编译...."))
    compiler.hooks.compiler.tapAsync("MyPlugin",(name,age)=>{
      setTimeout(()=> {
        console.log("编译中")
      },1000)
    })
  }
}

// 这里类似webpack.config.js的plugin配置
// 向 plugins属性传入new 实例

const myPlugin = new MyPlugin();

const options = {
  plugins: [myPlugin]
}

let compiler = new Compiler(options)
compiler.run();
```

## 参考
[tapable 源码解析](https://www.cnblogs.com/tugenhua0707/p/11317557.html)

# 理解Compiler(负责编译)

Compiler 对象包含了当前运行webpack的配置,包括entry、 output、loaders等配置,这个对象在启动webpack时被实例化, 而且全局唯一的,plugin可以通过对象获取到webpack配置星系进行处理

```js
// Compiler 结构
Compiler {
  _pluginCompat: SyncBailHook {
    ...
  },
  hooks: {
    shouldEmit: SyncBailHook {
     ...
    },
    done: AsyncSeriesHook {
     ...
    },
    additionalPass: AsyncSeriesHook {
     ...
    },
    beforeRun: AsyncSeriesHook {
     ...
    },
    run: AsyncSeriesHook {
     ...
    },
    emit: AsyncSeriesHook {
     ...
    },
    assetEmitted: AsyncSeriesHook {
     ...
    },
    afterEmit: AsyncSeriesHook {
     ...
    },
    thisCompilation: SyncHook {
     ...
    },
    compilation: SyncHook {
     ...
    },
    normalModuleFactory: SyncHook {
     ...
    },
    contextModuleFactory: SyncHook {
     ...
    },
    beforeCompile: AsyncSeriesHook {
      ...
    },
    compile: SyncHook {
     ...
    },
    make: AsyncParallelHook {
     ...
    },
    afterCompile: AsyncSeriesHook {
     ...
    },
    watchRun: AsyncSeriesHook {
     ...
    },
    failed: SyncHook {
     ...
    },
    invalid: SyncHook {
     ...
    },
    watchClose: SyncHook {
     ...
    },
    infrastructureLog: SyncBailHook {
     ...
    },
    environment: SyncHook {
     ...
    },
    afterEnvironment: SyncHook {
     ...
    },
    afterPlugins: SyncHook {
     ...
    },
    afterResolvers: SyncHook {
     ...
    },
    entryOption: SyncBailHook {
     ...
    },
    infrastructurelog: SyncBailHook {
     ...
    }
  },
  ...
  outputPath: '',//输出目录
  outputFileSystem: NodeOutputFileSystem {
   ...
  },
  inputFileSystem: CachedInputFileSystem {
    ...
  },
  ...
  options: {
    //Compiler对象包含了webpack的所有配置信息，entry、module、output、resolve等信息
    entry: [
      'babel-polyfill',
      '/Users/frank/Desktop/fe/fe-blog/webpack-plugin/src/index.js'
    ],
    devServer: { port: 3000 },
    output: {
      ...
    },
    module: {
      ...
    },
    plugins: [ MyWebpackPlugin {} ],
    mode: 'production',
    context: '/Users/frank/Desktop/fe/fe-blog/webpack-plugin',
    devtool: false,
    ...
    performance: {
      maxAssetSize: 250000,
      maxEntrypointSize: 250000,
      hints: 'warning'
    },
    optimization: {
      ... 
    },
    resolve: {
      ...
    },
    resolveLoader: {
      ...
    },
    infrastructureLogging: { level: 'info', debug: false }
  },
  context: '/Users/frank/Desktop/fe/fe-blog/webpack-plugin',//上下文，文件目录
  requestShortener: RequestShortener {
    ...
  },
  ...
  watchFileSystem: NodeWatchFileSystem {
    //监听文件变化列表信息
     ...
  }
}
```

## Compiler 源码精简版代码解析

`https://github.com/webpack/webpack/blob/master/lib/Compiler.js`

```js
const { SyncHook, SyncBailHook, AsyncSeriesHook } = require("tapable");
class Compiler {
  constructor() {
    // 1. 定义生命周期钩子
    this.hooks = Object.freeze({
      // ...只列举几个常用的常见钩子，更多hook就不列举了，有兴趣看源码
      done: new AsyncSeriesHook(["stats"]),//一次编译完成后执行，回调参数：stats
      beforeRun: new AsyncSeriesHook(["compiler"]),
      run: new AsyncSeriesHook(["compiler"]),//在编译器开始读取记录前执行
      emit: new AsyncSeriesHook(["compilation"]),//在生成文件到output目录之前执行，回调参数： compilation
      afterEmit: new AsyncSeriesHook(["compilation"]),//在生成文件到output目录之后执行
      compilation: new SyncHook(["compilation", "params"]),//在一次compilation创建后执行插件
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),//在一个新的compilation创建之前执行
      make:new AsyncParallelHook(["compilation"]),//完成一次编译之前执行
      afterCompile: new AsyncSeriesHook(["compilation"]),
      watchRun: new AsyncSeriesHook(["compiler"]),
      failed: new SyncHook(["error"]),
      watchClose: new SyncHook([]),
      afterPlugins: new SyncHook(["compiler"]),
      entryOption: new SyncBailHook(["context", "entry"])
    });
    // ...省略代码
  }
  newCompilation() {
    // 创建Compilation对象回调compilation相关钩子
    const compilation = new Compilation(this);
    //...一系列操作
    this.hooks.compilation.call(compilation, params); //compilation对象创建完成 
    return compilation
  }
  watch() {
    //如果运行在watch模式则执行watch方法，否则执行run方法
    if (this.running) {
      return handler(new ConcurrentCompilationError());
    }
    this.running = true;
    this.watchMode = true;
    return new Watching(this, watchOptions, handler);
  }
  run(callback) {
    if (this.running) {
      return callback(new ConcurrentCompilationError());
    }
    this.running = true;
    process.nextTick(() => {
      this.emitAssets(compilation, err => {
        if (err) {
          // 在编译和输出的流程中遇到异常时，会触发 failed 事件 
          this.hooks.failed.call(err)
        };
        if (compilation.hooks.needAdditionalPass.call()) {
          // ...
          // done：完成编译
          this.hooks.done.callAsync(stats, err => {
            // 创建compilation对象之前   
            this.compile(onCompiled);
          });
        }
        this.emitRecords(err => {
          this.hooks.done.callAsync(stats, err => {

          });
        });
      });
    });

    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.readRecords(err => {
          this.compile(onCompiled);
        });
      });
    });

  }
  compile(callback) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params);
      //触发make事件并调用addEntry，找到入口js，进行下一步
      this.hooks.make.callAsync(compilation, err => {
        process.nextTick(() => {
          compilation.finish(err => {
            // 封装构建结果（seal），逐次对每个module和chunk进行整理，每个chunk对应一个入口文件
            compilation.seal(err => {
              this.hooks.afterCompile.callAsync(compilation, err => {
                // 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，
                // 不然运行流程将会一直卡在这不往下执行
                return callback(null, compilation);
              });
            });
          });
        });
      });
    });
  }
  emitAssets(compilation, callback) {
    const emitFiles = (err) => {
      //...省略一系列代码
      // afterEmit：文件已经写入磁盘完成
      this.hooks.afterEmit.callAsync(compilation, err => {
        if (err) return callback(err);
        return callback();
      });
    }

    // emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(这是最后一次修改最终文件的机会)
    this.hooks.emit.callAsync(compilation, err => {
      if (err) return callback(err);
      outputPath = compilation.getPath(this.outputPath, {});
      mkdirp(this.outputFileSystem, outputPath, emitFiles);
    });
  }
  // ...省略代码
}

```

apply 方法中插入钩子的一般形式如下;

```js
// compiler提供了compiler.hooks,可以根据这些不同的时刻去让插件做不同的事情
compiler.hooks.阶段.tap函数("插件名称", (阶段回调参数)=>{

})

compiler.run(callback)
```

# 理解Compilation (负责创建Bundles) 

Compilation对象代表了一次资源版本构建.当运行webpack开发环境中间件时,每当检测到一个文件的变化,就会创建一个新的compilation,从而生成一组新的编译资源,一个Compilation对象表现了当前的模块资源、编译生成资源、编译文件、以及被跟踪依赖的状态信息, 简单来讲就是把本次打包编译的内容存到内存里,Compilation对象也提供了插件需要自定义功能的回调,以插件做自定义处理时选择使用拓展.

简单来说,Compilation的职责就是构建模块和Chunk, 并利用插件优化构建过程.

和Compiler用法相同,钩子类型不同名,也可以在某些钩子上访问tapAsync和taoPromsie

参考:
[](https://github.com/webpack/webpack/blob/master/lib/Compilation.js)

## 常见的Compilation Hooks区别

| 钩子                 | 类型            | 什么时候调用                                                                                                                                                                                     |
| -------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| buildModule          | SyncHook        | 在模块开始编译前触发名可以用于修改模块                                                                                                                                                           |
| successModule        | SyncHook        | 在一个模块被修改成功编译,会执行这个钩子                                                                                                                                                          |
| finishMoudles        | AsyncSeriesHook | 当所有模块都编译成功后调用                                                                                                                                                                       |
| seal                 | SyncHook        | 当一次compilation停止接收新模块时触发                                                                                                                                                            |
| optimizeDependencies | SyncBailHook    | 当依赖优化开始执行                                                                                                                                                                               |
| optimize             | SyncHook        | 在优化阶段开始执行                                                                                                                                                                               |
| optimizeMoudules     | SyncBailHook    | 在模块优化阶段开始时执行, 插件可以在这个钩子颗粒执行的模块的优化,回调参数modules                                                                                                                 |
| optimizeChunks       | SyncBailHook    | 在代码块优化阶段开始执行, 插件可以在这个钩子里执行对代码快的优化,回调参数chunks                                                                                                                  |
| optimizeChunkAssets  | AsyncSeriesHook | 优化任何代码快资源,在这些资源存放在compilation.assets上,一个chunk有一个files属性,他指向有一个chunk创建的所有文件,任何额外的chunk资源都存放在compilation.additionalChunkAssets上.回调参数: chunks |
| optimizeAssets       | AsyncSeriesHook | 优化说有存放在compilation.assets的所有资源,回调参数assets                                                                                                                                        |

# Compiler 和 Compilation 的区别

Compilaer 代表了整个webpack从启动到关闭的生命周期,而Compilation只代表了一次新的编译,只要文件有改动,compilation就会被重新创建


# 常用 API
插件可以用来修改输出文件、增加输出文件、甚至可以提升webpack性能、总之插件可以通过调用webpack提供的API能完成很多事情,由于webpack提供的API非常多,

## 读取输出资源、代码块、模块以及依赖

有些插件可能需要读取webpack的处理结果,例如输出资源、代码块、模块及其依赖,以便做下一步处理、在emit事件发生时, 代表源文件的转换和组装已经完成,在这里可以读取到最终将输出的资源、代码块、模块及其依赖,并且可以修改输出资源的内容.

```js
class Plugin {
  apply(compiler) {
    compiler.plugin('emit', function (compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function (chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function (module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function (filepath) {
          });
        });

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function (filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      callback();
    })
  }
}

```

## 监听文件变化

webpack会从配置入口模块触发, 依次找出所有依赖模块,当入口模块或则其依赖的模块发生变化时, 就会触发一次新的Compilation

在开发插件时经常需要知道哪个文件发生变化导致了新的Compilation,为此可以使用如下代码
```js
// 当依赖的文件发生变化时会触发 watch-run 事件
compiler.hooks.watchRun.tap('MyPlugin', (watching, callback) => {
  // 获取发生变化的文件列表
  const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
  // changedFiles 格式为键值对，键为发生变化的文件路径。
  if (changedFiles[filePath] !== undefined) {
    // filePath 对应的文件发生了变化
  }
  callback();
});

```

默认情况下webpack只会监控入口文件及其依赖的模块是否发生变化,在有些情况下项目可能需要引入新文件, 例如引入一个HTML文件.由于javascript文件不会去导入HTML文件,webpack就不会监听HTML文件的变化,编辑HTML文件就不会重新触发新的Compilation.为了监听HTML文件的变化,我们需要把HTML文件加入到依赖列表中,

```js
compiler.hooks.afterCompile.tap('MyPlugin', (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
  compilation.fileDependencies.push(filePath);
  callback();
});
```

## 修改输出资源

在有些场景下插件需要修改、增加、删除输出的资源, 要做到这点需要监听emit事件,因为发出emit事件时所有模块的转换和代码对应的文件已经生成好了,需要输出的资源即将输出,因此emit事件是修改webpack输出资源的最后的时机

所有的需要输出的资源都会存放在compilation.assets中, compilation.assets是一个键值对,键为需要输出的文件名称,值为文件对应的内容
设置Comilation.assets的代码如下
```js
// 设置名称为 fileName 的输出资源
  compilation.assets[fileName] = {
    // 返回文件内容
    source: () => {
      // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
      return fileContent;
      },
    // 返回文件大小
      size: () => {
      return Buffer.byteLength(fileContent, 'utf8');
    }
  };
  callback();

```
## 判断webpack使用了哪些插件

```js
// 判断当前配置使用使用了 ExtractTextPlugin，
// compiler 参数即为 Webpack 在 apply(compiler) 中传入的参数
function hasExtractTextPlugin(compiler) {
  // 当前配置所有使用的插件列表
  const plugins = compiler.options.plugins;
  // 去 plugins 中寻找有没有 ExtractTextPlugin 的实例
  return plugins.find(plugin=>plugin.__proto__.constructor === ExtractTextPlugin) != null;
}
```
参考:
[webpack学习-pluign](http://wushaobin.top/2019/03/15/webpackPlugin/)

## 管理Warnings和 Errors

如果在apply函数内插入throw new Error("Message"), 终端会打印出Unhandle rejection Error:Message. 然后webpack中断执行.为了不影响compilation.warnings和compilation.errors

```js
compilation.warnings.push("warning");
compilation.errors.push("error");

```

# 参考

<https://juejin.im/post/6844904161515929614>
