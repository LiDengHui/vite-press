---
title: beforeupload和upload
date: 2019-08-09 23:40:12
tags:
---

## `beforeunload` 和 `unload` 的触发时间
    
    // beforeunload在新资源开始跳转或老资源刷新之前之前，可以取消加载
    window.addEventListener('beforeunload', function (e) {
      //返回值之后，会弹出是否关闭当前页面的提示框
      return (e|window).returnValue = '123'
    })

    //unload是在老资源卸载后，(？新资源请求发出后触发)不能取消加载
    window.addEventListener('unload', function(e) {
    });

猜测点: 浏览器在资源卸载后最后一步，有可能存在`调优`,如取消事件系统，比如micotask和macotask等.`unload`的可能性要比`beforeunlaod`高。

![20190809234916.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190809234916.png)

### 测试代码

      <!DOCTYPE html>
      <html>
          <head>
              <meta charset="utf-8"/>
              <title> beforeunload vs unload </title>
          </head>
          <body>
              请手工关闭当前浏览器窗口。<br/>
              请手工在地址栏输入其他页面地址或从收藏夹、历史记录中将页面导航其他站点。<br/>
              请手工单击后退，前进，刷新，或主页按钮。<br/>
              <a href="http://www.baidu.com" id="A">点击一个链接到新页面</a><br />
              <button onclick="document.getElementById('A').click()">调用 anchor.click 方法</button><br />
              <button onclick="document.write('A')">调用 document.write 方法</button><br />
              <button onclick="document.open('http://baidu.com')">调用 document.open 方法</button><br />
              <button onclick="document.close()">调用 document.close 方法</button><br />
              <button onclick="window.open('http://www.baidu.com','_self')">调用 window.open方法，窗口名称设置值为 _self</button><br />
              <button onclick="try{window.navigate('http://www.baidu.com')}catch(e){alert('不支持此方法')}">调用 window.navigate 方法</button><br />
              <button onclick="try{window.external.NavigateAndFind('http://www.baidu.com','','')}catch(e){alert('不支持此方法')}">调用 NavigateAndFind 方法</button><br />
              <button onclick="location.replace('http://www.baidu.com')">调用 location.replace 方法</button><br />
              <button onclick="location.reload()">调用 location.reload 方法</button><br />
              <button onclick="location.href='http://www.baidu.com'">指定一个 location.href 属性的新值</button><br />
              <form action="http://www.baidu.com" id="B">
              <input type="submit" value="提交具有 action 属性的一个表单">
              </form>
              <button onclick="document.getElementById('B').submit()">调用 form.submit 方法</button><br />
              <a href="javascript:void(0)">调用 javascipt: 伪协议</a><br />
              <a href="mailto:">调用 mailto: 伪协议</a><br />
              <a href="custom:">调用自定义伪协议</a>

              <script>
              function wait(ms) {
                  var now = new Date().getTime();
                  while(new Date() - ms <= now) {}
              }
              window.onunload = function () {
                  //wait(2000);
                  var img = new Image();
                  img.src = 'http://10.209.12.214:1234/log?rand=' + (new Date()).getTime() + '&a=' + navigator.userAgent;
              };
              // window.onbeforeunload = function () {
              //     //wait(2000);
              //     var img = new Image();
              //     img.src = 'http://10.209.12.214:1234/log?rand=' + (new Date()).getTime() + '&a=' + navigator.userAgent;
              // };
              </script>
          </body>
      </html>

### 通过向server发送请求查看server日志来观察是否正常触发

    var PORT = 1234;

    var http = require('http');
    var url = require('url');
    var path = require('path');

    var server = http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;
        var params = url.parse(request.url, true).query;
        switch (pathname) {
            case '/':
                var pdpss = params.adunitid.split(',');
                
                if ('string' === typeof pdpss) {
                    pdpss = [pdpss];
                }
                var adContent = {};
                pdpss.forEach(function (pdps) {
                    adContent[pdps] = {
                        id: pdps,
                        type: 'an',
                        content: 'i am ' + pdps + ' content'
                    };
                });
                var contentType = "application/json";
                response.writeHead(200, {
                    'Content-Type': contentType
                });
                response.write(params.callback + '(' + JSON.stringify(adContent) + ')');
                response.end();
                break;
            default:
                console.log(pathname, params);
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
                break;
        }
    });
    server.listen(PORT);
    console.log("Server runing at port: " + PORT + ".");

## 测试结果

### beforeunload

![20190809235806.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190809235806.png)

### unload

![20190809235836.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190809235836.png)

## 结论

beforeunload支持力度更广一些，unload会释放一些资源。 unload在safari上缓存有影响