import{_ as n,c as t,o as s,a6 as r}from"./chunks/framework.mq8cK8gF.js";const h=JSON.parse('{"title":"ES6设计模式","description":"使用ES6完成各种设计模式","frontmatter":{"title":"ES6设计模式","date":"2016-04-22T10:33:05.000Z","tags":["前端","javascript"],"categories":"技术文档","description":"使用ES6完成各种设计模式"},"headers":[],"relativePath":"语言/JavaScript/ES6设计模式.md","filePath":"语言/JavaScript/ES6设计模式.md","lastUpdated":null}'),a={name:"语言/JavaScript/ES6设计模式.md"};function o(c,e,i,l,d,p){return s(),t("div",null,e[0]||(e[0]=[r(`<p>我认为设计模式虽然不长用,特别是在js这种函数式编程中,但是如果我们掌握了这些东西,会使我们的代码结构更优美,看起来更流畅,不一定比其他方式更好,但是会更符合个人的开发风格,我的开发风格就是_懒_.</p><h2 id="单例模式" tabindex="-1">单例模式 <a class="header-anchor" href="#单例模式" aria-label="Permalink to “单例模式”">​</a></h2><p>单例模式主要是在类new之后调用同一份数据,有点想其他语言的静态类，主意的是，ES6中所有的类都必须new了之后才能使用。所以单例模式就比较重要。</p><pre><code>    &quot;use strict&quot;;

    let __instance = function(){
        let instance ;
        return (newInstance) =&gt; {
            if(newInstance) instance = newInstance;
            return instance;
        };                                                                                                   
    }();

    class Singleton {
      constructor() {
        if(__instance()) return __instance();
        __instance(this);
      }

    }

    class test extends Singleton {
        constructor(){
            super();
            this.foo = &#39;bar&#39;;
        }
    }


    let u1 = new test();
    let u2 = new test();

    console.dir(u1); //&#39;bar&#39;
    console.log(u1 === u2); //true
</code></pre><h2 id="订阅-发布模式-事件" tabindex="-1">订阅／发布模式（事件） <a class="header-anchor" href="#订阅-发布模式-事件" aria-label="Permalink to “订阅／发布模式（事件）”">​</a></h2><p>这个没什么好说的，我在自己写了之后才发现原生的node本身有自己的事件，一下是代码,采用nodejs 的继承机制我觉得会在一个的过程中特别方便，唯一觉得比较坑的就是在事件的删除上，自己写的时候想的太复杂，后来想了一下，有些时候排序能解决很多问题；就比如这句：</p><pre><code>    indexs.sort().reverse().forEach((item, index, array) =&gt; {
        subs.get(type).splice(item - 1, 1);
    });
</code></pre><p>在删除中，如果排序那么，在删除的过程中就会产生数组的长度的变化，从而影响到传入数组indexs无法匹配原有数组的情况，所以这里采用先排序后反转，从大到小，依次处理就不会影响indexs 中值得索引变化。</p><h3 id="nodejs" tabindex="-1">nodejs <a class="header-anchor" href="#nodejs" aria-label="Permalink to “nodejs”">​</a></h3><pre><code>    const EventEmitter = require(&#39;events&#39;);

    class MyEmitter extends EventEmitter {}

    const myEmitter = new MyEmitter();
    myEmitter.on(&#39;event&#39;, () =&gt; {
      console.log(&#39;an event occurred!&#39;);
    });
    myEmitter.emit(&#39;event&#39;);
</code></pre><h3 id="macl" tabindex="-1">macl <a class="header-anchor" href="#macl" aria-label="Permalink to “macl”">​</a></h3><pre><code>    &#39;use strict&#39;;
    class Event {
        constructor() {
            this.subscribers = new Map([
                [&#39;any&#39;, []]
            ]);
        }

        on(type = &#39;any&#39;, fn) {
            let subs = this.subscribers;
            if (!subs.get(type)) return subs.set(type, [fn]);
            subs.get(type).push(fn);
            // subs.set(type, );
        }

        emit(type = &#39;any&#39;, content) {
            if (!this.subscribers.get(type)) return;
            for (let fn of this.subscribers.get(type)) {
                fn(content);
            }
        }

        remove(type = &#39;any&#39;, ...indexs) {
            let subs = this.subscribers;
            if (indexs.length === 0) return subs.delete(type)
            indexs.sort().reverse().forEach((item, index, array) =&gt; {
                subs.get(type).splice(item - 1, 1);
            });
        }


        get(type = &#39;any&#39;) {
            let subs = this.subscribers;
            return subs.get(type);
        }
    }

    export default Event;

    // class Test extends Event {
    //     constructor() {
    //         super();
    //     }
    // }

    // let event = new Test();


    // event.on(&#39;myEvent&#39;, (content) =&gt; console.log(\`1get published content: \${content}\`));
    // event.on(&#39;myEvent&#39;, (content) =&gt; console.log(\`2get published content: \${content}\`));
    // event.on(&#39;myEvent&#39;, (content) =&gt; console.log(\`3get published content: \${content}\`));
    // event.on(&#39;myEvent&#39;, (content) =&gt; console.log(\`4get published content: \${content}\`));
    // event.on(&#39;myEvent&#39;, (content) =&gt; console.log(\`5get published content: \${content}\`));

    // event.remove(&#39;myEvent&#39;, 1, 4, 3);

    // event.emit(&#39;myEvent&#39;, &#39;jaja&#39;); //get published content: jaja
</code></pre><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to “总结”">​</a></h2><p>设计模式只是为了编程的更加优美，并不是说所有的都能被固化，从而在所有的地方都被用到，而要结合具体的环境而编写适合的模式，这里列出的都只是目前我能将之抽象出来的，还有很多以后会补上。</p>`,14)]))}const m=n(a,[["render",o]]);export{h as __pageData,m as default};
