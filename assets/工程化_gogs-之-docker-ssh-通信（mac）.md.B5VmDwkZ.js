import{_ as o,c as t,o as c,j as s}from"./chunks/framework.t6yJIVLk.js";const p=JSON.parse('{"title":"gogs 之 docker ssh 通信（mac）","description":"在使用docker布置gogs时遇到的ssh链接问题","frontmatter":{"title":"gogs 之 docker ssh 通信（mac）","date":"2017-02-25T22:18:25.000Z","tags":["docker","gogs"],"description":"在使用docker布置gogs时遇到的ssh链接问题"},"headers":[],"relativePath":"工程化/gogs-之-docker-ssh-通信（mac）.md","filePath":"工程化/gogs-之-docker-ssh-通信（mac）.md","lastUpdated":1749107541000}'),r={name:"工程化/gogs-之-docker-ssh-通信（mac）.md"};function a(n,e,l,g,d,i){return c(),t("div",null,e[0]||(e[0]=[s("p",null,"打算用docker布置一下gogs，用来给公司建立代码库",-1),s("p",null,"在连接ssh时遇到要输入密码的问题",-1),s("p",null,"后来才发线 docker 在配置gogs是会对端口进行映射导致端口被改变所以需要用./ssh/config,来更改配置的端口号修改代码如下 ~/.ssh/config",-1),s("pre",null,[s("code",null,`	Host	www.macl.com

	Port	32781
`)],-1),s("p",null,"然后再下载：",-1),s("pre",null,[s("code",null,`	git clone git@www.macl.com:lidenghui/test.git
`)],-1)]))}const _=o(r,[["render",a]]);export{p as __pageData,_ as default};
