# HOW

一直想着要做一个 stars 管理工具（粗略想法见 [这里](https://www.v2ex.com/t/477168)，OAuth 是必须的一步。

<https://github.com/hanzichi/github-oauth-demo> 简单实现了 web 端的 OAuth，本项目简单实现基于 electron 的 GitHub OAuth。（OAuth Apps 用了同一个配置）

和 Web 端相似的不赘述，可以先看下 [这里](https://github.com/hanzichi/github-oauth-demo/blob/master/HOW.md)

electron-app 部分是基于 [electron-quick-start](https://github.com/electron/electron-quick-start) 项目改的，运行该项目，打开的是 index.html 页面（mainWindow 打开），该页面在 demo 中用来存储 token，展示 GitHub user 信息。

启动 electron-app 部分，首先定位到 index.html（mainWindow 打开），如果该页面没有 token，则表示还未授权过，在该页面与主进程通信，告诉主进程还未授权，于是打开授权页面（authWindow 中打开 auth.html），和 Web 端一样，需要打开这个链接 <https://github.com/login/oauth/authorize?client_id=a3144def15f37b5cdf23>，开始我是直接在 auth.html 中插入一个 A 标签的，不生效，改用 js 事件搞定。根据设定的 callback URL，继续跳转到类似 http://localhost:3000/cb?code=xxxxx 这样的页面，然后将 code 发送给服务器换取 token，这一步比较简单，获得 token 后问题来了，如何将 token 发送到 mainWindow 中的 index.html 页面？

以下为个人解决方案：（不知道有没有更好的做法？）

首先，这个 token 可以在 koa 后端服务器以及 http://localhost:3000/cb?code=xxxxx 页面中获取到，而 index.html 页面属于 electron 部分，electron 可以向后端请求接口获取数据，但是后端得到 token 貌似不能主动发送给 electron。于是我想了个办法，主进程中用 `will-navigate` 一直监听 authWindow 的 url 变化，当 http://localhost:3000/cb?code=xxxxx 页面得到 token 后，跳转到 http://localhost:3000/app?token=xxxxx 页面（一个简单的中间页面，路由随便设置的），这时 `will-navigate` 中能获取到 url，解析得到 token，获取后和渲染进程通信，这样 index.html 页面就能获取到 token 了，再利用 token 请求服务器获取 GitHub user 数据。

