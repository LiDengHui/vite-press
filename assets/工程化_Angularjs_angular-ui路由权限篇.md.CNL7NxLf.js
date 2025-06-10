import{_ as s,c as n,o as e,a5 as l}from"./chunks/framework.Basl2YsL.js";const u=JSON.parse('{"title":"angularjs-ui路由权限篇","description":"前端框架angularjs-ui路由权限的三种方法","frontmatter":{"title":"angularjs-ui路由权限篇","date":"2016-06-03T11:15:20.000Z","tags":["前端","框架","angularjs"],"categories":"技术文档","description":"前端框架angularjs-ui路由权限的三种方法"},"headers":[],"relativePath":"工程化/Angularjs/angular-ui路由权限篇.md","filePath":"工程化/Angularjs/angular-ui路由权限篇.md","lastUpdated":1749107541000}'),p={name:"工程化/Angularjs/angular-ui路由权限篇.md"};function t(r,a,i,o,c,d){return e(),n("div",null,a[0]||(a[0]=[l(`<h2 id="事件捕获" tabindex="-1">事件捕获 <a class="header-anchor" href="#事件捕获" aria-label="Permalink to “事件捕获”">​</a></h2><p>用户是否可以进入哪个页面,最好在页面加载还未渲染跳转页面时进行判断, 第一种解决办法:在全局简历MainController</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>$rootScope.$on(&#39;$stateChangeStart&#39;,function(event, toState, toParams, fromState, fromParams){</span></span>
<span class="line"><span>    if(toState.name==&#39;login&#39;)return;// 如果是进入登录界面则允许</span></span>
<span class="line"><span>    // 如果用户不存在</span></span>
<span class="line"><span>    if(!$rootScope.user || !$rootScope.user.token){</span></span>
<span class="line"><span>        event.preventDefault();// 取消默认跳转行为</span></span>
<span class="line"><span>        $state.go(&quot;login&quot;,{from:fromState.name,w:&#39;notLogin&#39;});//跳转到登录界面</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span></code></pre></div><h2 id="路由跳转配置" tabindex="-1">路由跳转配置 <a class="header-anchor" href="#路由跳转配置" aria-label="Permalink to “路由跳转配置”">​</a></h2><p>在config中配置$stateProvider.state()中的reslove中如果接收的是一个promise对象若抛出的是deferred.reject()页面是不跳转的.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>$stateProvider.state(&#39;default&#39;,{</span></span>
<span class="line"><span>    url:&#39;&#39;,</span></span>
<span class="line"><span>    resolve:{</span></span>
<span class="line"><span>        guarder:function($q,$http){</span></span>
<span class="line"><span>            var allowed = false;</span></span>
<span class="line"><span>            var deferred = $q.defer();</span></span>
<span class="line"><span>            if(allowed){</span></span>
<span class="line"><span>                deferred.resolve();</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                deferred.reject();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            return deferred.promise;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    templateUrl:&#39;controllers/home/index.html&#39;,</span></span>
<span class="line"><span>    controller:&#39;HomeIndexController as vm&#39;</span></span>
<span class="line"><span>});</span></span></code></pre></div><h2 id="controller中-location判断" tabindex="-1">Controller中$location判断 <a class="header-anchor" href="#controller中-location判断" aria-label="Permalink to “Controller中$location判断”">​</a></h2><p>在controller中手动判断用户登陆状态,一般将用户数据存储在rootscope中,保持html模板和controller都能调用到且相互独立,当然也能放到自己定义的service中.</p><h2 id="总结" tabindex="-1">总结: <a class="header-anchor" href="#总结" aria-label="Permalink to “总结:”">​</a></h2><p>三种方式各有优缺点,需要更具具体需求,判断要用哪个.</p>`,10)]))}const g=s(p,[["render",t]]);export{u as __pageData,g as default};
