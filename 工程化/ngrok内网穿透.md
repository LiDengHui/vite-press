---
title: ngrok内网穿透
tags:
  - 网络
categories: 技术文档
description: 使用ngrok从外网访问内网
date: 2016-11-07 10:33:36
---


# ngrok 内网穿透利器

　　由于开发Web项目，经常需要将本地部署的网站让外网能直接访问到，最便捷的做法当然是在ADSL路由器上直接做端口映射，很不幸大部分运营商都屏蔽了80等常用端口，曾经的做法是在公网一台VPS上架设OpenVPN，将笔记本和VPS连到一个虚拟局域网，再用iptables做端口转发来达到目的，虽然可行，但速度比较慢，由于线路不稳定造成掉线几率较高。偶然发现还有个叫ngrok的神器专门做了这件事，不但提供了一个在外网能够安全的访问内网Web主机，还能捕获所有请求的http内容，方便调试，甚至还支持tcp层端口映射，不局限于某一特定的服务。支持Mac OS X，Linux，Windows平台。

## . ngrok下载运行

　　体积很小，官网下载后直接解压得到一个二进制文件，在shell中执行./ngrok 80即可，默认会分配随机的二级域名来访问，转发到本机的80端口。可以通过-help参数来查看详细的说明，运行后如下提示：

        Tunnel Status                 online
        Version                       1.6/1.5
        Forwarding                    http://steven-mbp.ngrok.com -> 127.0.0.1:8080
        Forwarding                    https://steven-mbp.ngrok.com -> 127.0.0.1:8080
        Web Interface                 127.0.0.1:4040
        # Conn                        16
        Avg Conn Time                 558ms
　　我这里是使用了自定义二级域名，意味着访问http://steven-mbp.ngrok.com就如同访问内网的http://127.0.0.1:8080，很方便吧。通过ngrok提供的管理界面(127.0.0.1:4040)可以清楚的看到当前有哪些连接，以及请求的url，可以进行replay。

## 2. ngrok常用示例
> 1. 采用自定义二级域名steven-mbp.ngrok.com转发到本机的8080端口。

        ./ngrok -subdomain steven-mbp 8080
> 2. tcp端口转发，这意味着可以在外网ssh到本机了，当然外网端口是随机分配的。

        ./ngrok -proto=tcp 22
> 3. 转发到局域网其他的机器

        ./ngrok 192.168.0.1:80
> 4. 绑定顶级域名(付费才可用)，在dashboard中添加域名，将域名cname解析到ngrok.com即可。

        ./ngrok -hostname test.dorole.com 8080
## 3. ngrok配置文件

　　ngrok可以将参数写到文件中，默认是放在~/.ngrok。例如：

        tunnels:
        client:
            auth: "user:password"
            proto:
            https: 8080
        ssh:
            proto: 
            tcp: 22
        test.dorole.com
            proto:
            http: 9090
　　这里定义了三个隧道，client表示转发http到本机8080，同时要求验证，ssh表示支持远程访问，第三个是绑定了域名转发到9090。这时候只需要一个./ngrok start client ssh test.dorole.com即可快速启动这三个隧道服务。

　　每一个隧道的配置节点都有五个参数，proto，subdomain，auth，hostname和remote_port，每个隧道必须有proto参数来指定本地地址和端口。auth参数用于在http(s)中身份认证，而remote_port用于在tcp隧道中指定远程服务器端口。如果没有配置subdomain参数，ngrok会默认一个二级域名与隧道节点一样的名字。

## 4. 配置文件中的其他参数

        authtoken: abc123
        inspect_addr: "0.0.0.0:8888"
        tunnels:
        ...
　　authtoken用于设置登录ngrok的授权码，可以在ngrok首页的dashboard中查看到。inspect_addr用于设置监听ip，比如设置为0.0.0.0:8080意味着监听本机所有ip的8080端口上。ngrok也支持自己架设ngrokd服务器，在配置中通过server_addr: “dorole.com:8081″来指定自己搭建的服务器地址。设置trust_host_root_certs: true来支持TLS加密协议的证书信任。ngrok支持http proxy，可以将ngrok配置成一个http代理，这在本机网络受限制的地方用比较合适。


# 域名

> 3w429299t4.zicp.vip
http://34ji293130.wicp.vip/github-webhook/