import{_ as e,c as a,o as n,a3 as i}from"./chunks/framework.DWgr2bMN.js";const u=JSON.parse('{"title":"前端统计如何实现数据传递","description":"","frontmatter":{"title":"前端统计如何实现数据传递","date":"2019-08-09T23:40:43.000Z","tags":null},"headers":[],"relativePath":"浏览器/前端统计如何实现数据传递.md","filePath":"浏览器/前端统计如何实现数据传递.md","lastUpdated":1749107541000}'),r={name:"浏览器/前端统计如何实现数据传递.md"};function o(l,t,g,d,s,h){return n(),a("div",null,t[0]||(t[0]=[i(`<p>百度，google，友盟等的统计都用的是 <code>&lt;img src=&quot;...&quot;&gt;</code> 的方式来统计信息，</p><h2 id="前端用gif打点" tabindex="-1">前端用GIF打点 <a class="header-anchor" href="#前端用gif打点" aria-label="Permalink to “前端用GIF打点”">​</a></h2><p>why，从原理说起</p><h2 id="前端监控原理" tabindex="-1">前端监控原理 <a class="header-anchor" href="#前端监控原理" aria-label="Permalink to “前端监控原理”">​</a></h2><p>由Web页面将用户信息(UA/鼠标点击位置/页面报错/停留时长/etc)等 上报给服务器</p><p>上报数据url_encode(百度统计/CNZZ)或JSON编码(神策/诸葛io)为字符串，通过url参数传递给后台服务器</p><p>关键在于两点</p><ol><li>收集用户信息</li><li>上报数据，只要能上报，其实选择有多种，如下图</li></ol><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190810002049.png" alt="20190810002049.png"></p><p>因此需要一种方式，尽可能的满足一下条件</p><ol><li>不关注返回结构</li><li>传递信息尽可能小</li><li>不能阻塞web的正常业务，且影响最小</li></ol><h2 id="用排除法来看-大家都用git是有原因的" tabindex="-1">用排除法来看(大家都用git是有原因的) <a class="header-anchor" href="#用排除法来看-大家都用git是有原因的" aria-label="Permalink to “用排除法来看(大家都用git是有原因的)”">​</a></h2><h3 id="不用get-post-head请求上报" tabindex="-1">不用GET/POST/HEAD请求上报？ <a class="header-anchor" href="#不用get-post-head请求上报" aria-label="Permalink to “不用GET/POST/HEAD请求上报？”">​</a></h3><p>请求都会涉及跨域。而跨域请求很容易出现由于配置不当，被浏览器拦截并报错。所以排除，且对于后端而言开放所有的跨域拦截是有安全风险的，并且由于要做跨域校验，是有性能消耗的。</p><h3 id="为什么不用其他文件-js-css-ttf" tabindex="-1">为什么不用其他文件(js/css/ttf) <a class="header-anchor" href="#为什么不用其他文件-js-css-ttf" aria-label="Permalink to “为什么不用其他文件(js/css/ttf)”">​</a></h3><p>js等的加载只能插入到html文档内部，才能被加载，这个会阻塞浏览器的页面渲染，且改变dom结构，即使之删除了，操作dom也是相当消耗浏览器性能的，影响用户体验。所以排除。</p><h2 id="所以选择图片" tabindex="-1">所以选择图片 <a class="header-anchor" href="#所以选择图片" aria-label="Permalink to “所以选择图片”">​</a></h2><p>图片不仅不用插入DOM元素内，且在JS中直接new一个Image就能发起请求。而且还没有阻塞问题。就是没有js的环境下也能通过直接加载img标签来正常打点。这是其他资源所做不到的。</p><h3 id="为什么选择gif" tabindex="-1">为什么选择GIF <a class="header-anchor" href="#为什么选择gif" aria-label="Permalink to “为什么选择GIF”">​</a></h3><p>原因: GIF是传输最小的合法图片格式(详情参考：图片类型解析)。</p><h2 id="总结-用gif的原因" tabindex="-1">总结：用GIF的原因 <a class="header-anchor" href="#总结-用gif的原因" aria-label="Permalink to “总结：用GIF的原因”">​</a></h2><ol><li>没有跨域问题</li><li>不会阻塞页面加载，影响用户体验</li><li>在所有的图片中提及最小，比较BMP/PNG，可以节省41%/35%的网络资源</li></ol><h2 id="以为一切完了吗-没有好戏才真正开始-上代码" tabindex="-1">以为一切完了吗？没有好戏才真正开始，上代码 <a class="header-anchor" href="#以为一切完了吗-没有好戏才真正开始-上代码" aria-label="Permalink to “以为一切完了吗？没有好戏才真正开始，上代码”">​</a></h2><pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot; /&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot; /&gt;
    &lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;ie=edge&quot; /&gt;
    &lt;title&gt;Document&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;img src=&quot;http://0.0.0.0:8000/logo.png?from=0&quot; id=&quot;image0&quot; /&gt;
    &lt;img src=&quot;http://0.0.0.0:8000/logo.png?from=1&quot; id=&quot;image1&quot; /&gt;
  &lt;/body&gt;
  &lt;script&gt;
    var unique = (function() {
      var time = new Date().getTime() + &#39;-&#39;,
        i = 0;
      return function() {
        return time + i++;
      };
    })();

    window.addEventListener(&#39;beforeunload&#39;, function(e) {
      var data = window[&#39;imgLogData&#39;] || (window[&#39;imgLogData&#39;] = {});

      var uid = unique();
      image0.src = &#39;http://0.0.0.0:8000/logo.png&#39; + &#39;?from=2_uid=&#39; + uid;
      data[uid] = image0;
      image0.onload = image0.onerror = function() {
        image0.onload = image0.onerror = null;
        image0 = null;
        delete data[uid];
      };

      var uid = unique();
      image1.src = &#39;http://0.0.0.0:8000/logo.png&#39; + &#39;?from=3_uid=&#39; + uid;
      data[uid] = image1;
      image1.onload = image1.onerror = function() {
        image1.onload = image1.onerror = null;
        image1 = null;
        delete data[uid];
      };

      xhr2 = new XMLHttpRequest();
      xhr2.open(
        &#39;GET&#39;,
        &#39;http://0.0.0.0:8000/logo.png&#39; + &#39;?from=4&amp;_uid=&#39; + unique(),
        true
      );
      xhr2.send(null);
      xhr3 = new XMLHttpRequest();
      xhr3.open(
        &#39;GET&#39;,
        &#39;http://0.0.0.0:8000/logo.png&#39; + &#39;?from=5&amp;_uid=&#39; + unique(),
        true
      );
      xhr3.send(null);
      xhr4 = new XMLHttpRequest();
      xhr4.open(
        &#39;GET&#39;,
        &#39;http://0.0.0.0:8000/logo.png&#39; + &#39;?from=6&amp;_uid=&#39; + unique(),
        true
      );
      xhr4.send(null);
      return ((e | window.event).returnValue = &#39;123&#39;);
    });
    window.addEventListener(&#39;unload&#39;, function(e) {
      console.dir(123);
    });
  &lt;/script&gt;
&lt;/html&gt;v
</code></pre><p>这个代码，就是检测统计时在刷新时的图片加载顺序情况。如图(注：logo是随便的一个普通图片，可以替换成其他的，加uid是为了每次有用新的图片)</p><h3 id="chrome-测一下" tabindex="-1">chrome 测一下 <a class="header-anchor" href="#chrome-测一下" aria-label="Permalink to “chrome 测一下”">​</a></h3><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190810004819.png" alt="20190810004819.png"></p><p>form: <code>4-&gt;5-&gt;6-&gt;2-&gt;3-&gt;0-&gt;1</code> 发现什么了吗？xhr竟然比js内src要先发出(实效性很小，目前没搞清楚为什么，可能和浏览器事件执行有关系，xhr的队列比js内src请求队列，要有先执行，dom内src请求队列最后执行)，而dom内src最后才发出。如果不考虑安全，跨域因素，真的用ajax要更好，而且ajax后端能返回204状态码，没有返回内容，这更好。</p><h3 id="safari-测一下" tabindex="-1">safari 测一下 <a class="header-anchor" href="#safari-测一下" aria-label="Permalink to “safari 测一下”">​</a></h3><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190810013434.png" alt="20190810013434.png"></p><p>form: <code>2-&gt;3-&gt;4-&gt;5-&gt;6-&gt;0-&gt;1</code> 调整xhr的调用顺序</p><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190810014238.png" alt="20190810014238.png"> form: <code>4-&gt;2-&gt;3-&gt;5-&gt;6-&gt;0-&gt;1</code> 从图中看出safari对xhr和js内部src没有做区分，但是报错了，浏览器任务不安全，应为request的请求头中没有指名服务器信息，和请求格式等。由安全性问题，所以选择js内src最好，</p>`,32)]))}const c=e(r,[["render",o]]);export{u as __pageData,c as default};
