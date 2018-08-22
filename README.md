# GitHub OAuth demo with Electron

首先启动后端服务（注意 3000 端口不能被其他服务占用）：

```bash
cd koa-backend
npm install
npm start
```

然后打开 electron app：

```bash
cd electron-app
npm install
npm start
```

大概效果：

![](https://ws2.sinaimg.cn/large/006lOxA2gy1fuimiyov9ng313l0kwhau)

具体实现请参考 [HOW.md](./HOW.md)