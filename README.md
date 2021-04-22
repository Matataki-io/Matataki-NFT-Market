<h1> Maven NFT </h1>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## FAQ

### 部署相关

#### 部署在 Vercel (推荐)

最简单的部署方法就是使用 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) ，因为他们是 Next.js 框架的作者。

Vercel 是一个前端托管平台，在全球都有 CDN 节点。只需要在网页上配置好，即可根据你的 GitHub 更新来自动部署。

这篇文档有更多详情 👉 [Next.js deployment documentation（英文）](https://nextjs.org/docs/deployment) .

#### 部署在 Netlify

另外一种相对简单的部署方法，就是使用 [Netlify](https://www.netlify.com/with/nextjs/)

Netlify 是一个前端托管平台，在全球都有 CDN 节点。只需要在网页上配置好，即可根据你的 GitHub 更新来自动部署。

这篇文档有更多详情 👉 [Next.js 在 Netlify 需要设置的事项（英文）](https://docs.netlify.com/configure-builds/common-configurations/next-js/) .

#### 自行部署

喜欢自主控制？没问题，当然是可以的。（但是真心不便捷）

很简单，只需要准备以下工具:

- node.js (v12 以上) + npm
- yarn (可选)

获取代码后，我们要先安装项目所需的依赖

```bash
npm i
# 或者用 yarn （更快）
yarn
```

安装好依赖后，构建代码为静态文件。

```bash
npm run build
# 或者用 yarn
yarn build
```

构建需要几分钟的时间，让我们稍等一会，喝杯咖啡，做个体操啥的。

如果代码没问题，项目目录应该会出现一个叫 `` 的文件夹。

这时候，执行以下命令就可以启动前端服务器了

```bash
npm run start
# 或者用 yarn
yarn start
```

正常输出如下：

```bash
➜  maven-nft-market ✗ yarn start
yarn run v1.22.4
$ next start
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from /Users/frankwei/Codes/maven-nft-market/.env.production
```

现在你可以在服务器本地访问 `localhost:3000` 啦。

### 小问题

#### 如何用命令行测试服务状态

如前端的 `localhost:3000` 为例

```bash
curl http://localhost:3000
```

#### 如何把服务器的前端暴露到外网？ (自己部署)

> 这里假设你是一个知道如何配置 HTTP(S) 服务器的工程师

你需要在 Web Server （如 Nginx、Apache 等）设定反向代理。

这里以 [nginxconfig.io](http://nginxconfig.io/) （提供在线生成 Nginx 配置） 为例，讲解反向代理的要领。

> 其他项目（SSL 证书等），本文不再赘述，请参考网上的教程，谢谢。

![image.png](https://i.loli.net/2021/04/22/FkQyp5OCTiNDfdJ.png)

![image.png](https://i.loli.net/2021/04/22/nF1wAr6RUTxEvWP.png)
