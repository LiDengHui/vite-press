import{_ as n,c as e,o,a6 as a}from"./chunks/framework.mq8cK8gF.js";const g=JSON.parse('{"title":"beforeupload和upload","description":"","frontmatter":{"title":"beforeupload和upload","date":"2019-08-09T23:40:12.000Z","tags":null},"headers":[],"relativePath":"浏览器/beforeupload和upload.md","filePath":"浏览器/beforeupload和upload.md","lastUpdated":1749107541000}'),r={name:"浏览器/beforeupload和upload.md"};function l(u,t,i,d,c,s){return o(),e("div",null,t[0]||(t[0]=[a(`<h2 id="beforeunload-和-unload-的触发时间" tabindex="-1"><code>beforeunload</code> 和 <code>unload</code> 的触发时间 <a class="header-anchor" href="#beforeunload-和-unload-的触发时间" aria-label="Permalink to “beforeunload 和 unload 的触发时间”">​</a></h2><pre><code>// beforeunload在新资源开始跳转或老资源刷新之前之前，可以取消加载
window.addEventListener(&#39;beforeunload&#39;, function (e) {
  //返回值之后，会弹出是否关闭当前页面的提示框
  return (e|window).returnValue = &#39;123&#39;
})

//unload是在老资源卸载后，(？新资源请求发出后触发)不能取消加载
window.addEventListener(&#39;unload&#39;, function(e) {
});
</code></pre><p>猜测点: 浏览器在资源卸载后最后一步，有可能存在<code>调优</code>,如取消事件系统，比如micotask和macotask等.<code>unload</code>的可能性要比<code>beforeunlaod</code>高。</p><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190809234916.png" alt="20190809234916.png" data-zoomable="true" loading="lazy"></p><h3 id="测试代码" tabindex="-1">测试代码 <a class="header-anchor" href="#测试代码" aria-label="Permalink to “测试代码”">​</a></h3><pre><code>  &lt;!DOCTYPE html&gt;
  &lt;html&gt;
      &lt;head&gt;
          &lt;meta charset=&quot;utf-8&quot;/&gt;
          &lt;title&gt; beforeunload vs unload &lt;/title&gt;
      &lt;/head&gt;
      &lt;body&gt;
          请手工关闭当前浏览器窗口。&lt;br/&gt;
          请手工在地址栏输入其他页面地址或从收藏夹、历史记录中将页面导航其他站点。&lt;br/&gt;
          请手工单击后退，前进，刷新，或主页按钮。&lt;br/&gt;
          &lt;a href=&quot;http://www.baidu.com&quot; id=&quot;A&quot;&gt;点击一个链接到新页面&lt;/a&gt;&lt;br /&gt;
          &lt;button onclick=&quot;document.getElementById(&#39;A&#39;).click()&quot;&gt;调用 anchor.click 方法&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;document.write(&#39;A&#39;)&quot;&gt;调用 document.write 方法&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;document.open(&#39;http://baidu.com&#39;)&quot;&gt;调用 document.open 方法&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;document.close()&quot;&gt;调用 document.close 方法&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;window.open(&#39;http://www.baidu.com&#39;,&#39;_self&#39;)&quot;&gt;调用 window.open方法，窗口名称设置值为 _self&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;try{window.navigate(&#39;http://www.baidu.com&#39;)}catch(e){alert(&#39;不支持此方法&#39;)}&quot;&gt;调用 window.navigate 方法&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;try{window.external.NavigateAndFind(&#39;http://www.baidu.com&#39;,&#39;&#39;,&#39;&#39;)}catch(e){alert(&#39;不支持此方法&#39;)}&quot;&gt;调用 NavigateAndFind 方法&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;location.replace(&#39;http://www.baidu.com&#39;)&quot;&gt;调用 location.replace 方法&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;location.reload()&quot;&gt;调用 location.reload 方法&lt;/button&gt;&lt;br /&gt;
          &lt;button onclick=&quot;location.href=&#39;http://www.baidu.com&#39;&quot;&gt;指定一个 location.href 属性的新值&lt;/button&gt;&lt;br /&gt;
          &lt;form action=&quot;http://www.baidu.com&quot; id=&quot;B&quot;&gt;
          &lt;input type=&quot;submit&quot; value=&quot;提交具有 action 属性的一个表单&quot;&gt;
          &lt;/form&gt;
          &lt;button onclick=&quot;document.getElementById(&#39;B&#39;).submit()&quot;&gt;调用 form.submit 方法&lt;/button&gt;&lt;br /&gt;
          &lt;a href=&quot;javascript:void(0)&quot;&gt;调用 javascipt: 伪协议&lt;/a&gt;&lt;br /&gt;
          &lt;a href=&quot;mailto:&quot;&gt;调用 mailto: 伪协议&lt;/a&gt;&lt;br /&gt;
          &lt;a href=&quot;custom:&quot;&gt;调用自定义伪协议&lt;/a&gt;

          &lt;script&gt;
          function wait(ms) {
              var now = new Date().getTime();
              while(new Date() - ms &lt;= now) {}
          }
          window.onunload = function () {
              //wait(2000);
              var img = new Image();
              img.src = &#39;http://10.209.12.214:1234/log?rand=&#39; + (new Date()).getTime() + &#39;&amp;a=&#39; + navigator.userAgent;
          };
          // window.onbeforeunload = function () {
          //     //wait(2000);
          //     var img = new Image();
          //     img.src = &#39;http://10.209.12.214:1234/log?rand=&#39; + (new Date()).getTime() + &#39;&amp;a=&#39; + navigator.userAgent;
          // };
          &lt;/script&gt;
      &lt;/body&gt;
  &lt;/html&gt;
</code></pre><h3 id="通过向server发送请求查看server日志来观察是否正常触发" tabindex="-1">通过向server发送请求查看server日志来观察是否正常触发 <a class="header-anchor" href="#通过向server发送请求查看server日志来观察是否正常触发" aria-label="Permalink to “通过向server发送请求查看server日志来观察是否正常触发”">​</a></h3><pre><code>var PORT = 1234;

var http = require(&#39;http&#39;);
var url = require(&#39;url&#39;);
var path = require(&#39;path&#39;);

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var params = url.parse(request.url, true).query;
    switch (pathname) {
        case &#39;/&#39;:
            var pdpss = params.adunitid.split(&#39;,&#39;);
            
            if (&#39;string&#39; === typeof pdpss) {
                pdpss = [pdpss];
            }
            var adContent = {};
            pdpss.forEach(function (pdps) {
                adContent[pdps] = {
                    id: pdps,
                    type: &#39;an&#39;,
                    content: &#39;i am &#39; + pdps + &#39; content&#39;
                };
            });
            var contentType = &quot;application/json&quot;;
            response.writeHead(200, {
                &#39;Content-Type&#39;: contentType
            });
            response.write(params.callback + &#39;(&#39; + JSON.stringify(adContent) + &#39;)&#39;);
            response.end();
            break;
        default:
            console.log(pathname, params);
            response.writeHead(404, {
                &#39;Content-Type&#39;: &#39;text/plain&#39;
            });

            response.write(&quot;This request URL &quot; + pathname + &quot; was not found on this server.&quot;);
            response.end();
            break;
    }
});
server.listen(PORT);
console.log(&quot;Server runing at port: &quot; + PORT + &quot;.&quot;);
</code></pre><h2 id="测试结果" tabindex="-1">测试结果 <a class="header-anchor" href="#测试结果" aria-label="Permalink to “测试结果”">​</a></h2><h3 id="beforeunload" tabindex="-1">beforeunload <a class="header-anchor" href="#beforeunload" aria-label="Permalink to “beforeunload”">​</a></h3><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190809235806.png" alt="20190809235806.png" data-zoomable="true" loading="lazy"></p><h3 id="unload" tabindex="-1">unload <a class="header-anchor" href="#unload" aria-label="Permalink to “unload”">​</a></h3><p><img src="https://raw.githubusercontent.com/LiDengHui/images/master/img20190809235836.png" alt="20190809235836.png" data-zoomable="true" loading="lazy"></p><h2 id="结论" tabindex="-1">结论 <a class="header-anchor" href="#结论" aria-label="Permalink to “结论”">​</a></h2><p>beforeunload支持力度更广一些，unload会释放一些资源。 unload在safari上缓存有影响</p>`,15)]))}const b=n(r,[["render",l]]);export{g as __pageData,b as default};
