---
title: 建立blog：Namesilo + Cloudflare域名购买及部署流程
date: 2026-11-25
tags: [建站, Namesilo, Cloudflare]
summary: 在 Namesilo 买下 kikivibes.blog，再用 Cloudflare Pages 从 GitHub 构建并绑到自己的域名。
---

打开 [kikivibes.blog](https://kikivibes.blog) 时，浏览器先根据域名找到 Cloudflare，再向 Cloudflare 请求页面。Namesilo 只负责这个域名归谁；网站文件放在 Cloudflare Pages 上。

## 两边各管什么

- **Namesilo = 域名零售商**：只负责域名购买，保管域名所有权、续费；它本身**不存网站代码、
不提供网站访问**。
- **Cloudflare Pages = 静态网站托管平台**：用来存放打包好的网站文件（dist），提供服务
器，让浏览器能拿到页面；同时 Cloudflare 还兼做 DNS、CDN、HTTPS 加速防护

## 为什么用这两家

- Namesilo价格便宜，界面没有广告，上手容易，而且提供免费Whois保护（Whois 是公开域名信息查
询库；Whois 保护就是把你的真实注册信息，在公开查询结果里隐藏掉）。
- 网络上很多人选择Vercel托管和cloudflare进行dns和sdn加速。但是Vercel实在是太难注册，非常
容易被`Your account requires further verification`。即使使用国外邮箱或者github链接登录
都会有这个验证问题，解决方法是联系 registration@vercel.com 进行人工审核。。。真是太复杂
了。遂放弃。之所以网络上选择二者搭配是因为vercel构建部署体验非常舒服，但是目前看来
cloudflare对于构建blog足矣，如果后面写一些复杂服务端渲染项目的话，cloudflare的ssr支持
弱，可能就不方便了。（SSR即Server-Side Rendering，服务端渲染。用户点开页面的那一刻，收到
请求的服务器临时跑代码、查数据、拼接出当前这个用户专属的 HTML，再发给浏览器。举例：打开一
个电商详情页，实时读取库存；打开个人中心，读取你的登录信息，每个人看到内容不一样。）

## 购买域名

打开 [www.namesilo.com](https://www.namesilo.com)，完成注册并登录。在首页搜索框中查询准备使用的域名，确认该域名可以注册后加入订单并付款。付款完成后，域名会出现在 Namesilo 的账户中，此后续费和域名设置都在这里进行。

![NameSilo 首页，搜索要购买的域名](/study/cloudflare-yarn-lock/screenshot_2026-11-26_10-48-48.png)

购买只解决域名归属。此时直接访问该域名，还不会打开博客，因为 Namesilo 并不保存网站文件。

## 部署到 Cloudflare Pages

打开 [www.cloudflare.com](https://www.cloudflare.com)，完成注册并登录。在左侧进入 **Workers & Pages**，点击 **Create application**，新建一个托管项目。

![在 Workers & Pages 中创建应用](/study/cloudflare-yarn-lock/screenshot_2026-11-26_10-56-37.png)

当前的创建页面默认创建 Workers。本站由 Vite 构建为静态文件，应点击页面底部的 **Continue to Pages**，进入 Pages 的创建流程。

![创建时选择 Continue to Pages，而不是默认的 Workers](/study/cloudflare-yarn-lock/screenshot_2026-11-26_10-58-05.png)

进入 Pages 后，选择通过 GitHub 连接仓库。如果 Cloudflare 尚未获得授权，需要先同意它读取对应的 GitHub 账户，再选中博客仓库。项目名称可按仓库命名。构建配置不要沿用页面上的默认值，改为下面两项：

- 构建命令：`yarn build`
- 输出目录：`dist`

保存后，Cloudflare 会拉取仓库并执行构建。第一次部署完成前，站点只有 Cloudflare 分配的 `*.pages.dev` 地址。应先打开这个地址，确认页面可以正常访问，再继续绑定自己的域名。构建失败时，自定义域名即使添加成功，打开的也不是可用页面。

## 把 DNS 交给 Cloudflare

`*.pages.dev` 只能证明项目已经部署。要让 `kikivibes.blog` 指向该项目，还需要把这个域名的 DNS 从 Namesilo 交到 Cloudflare。

在 Cloudflare 中选择 **Add a site**。这里有三项，应选择 **Connect a domain**，表示只把已有域名接入 Cloudflare。**Transfer a domain** 会把域名的注册商从 Namesilo 转到 Cloudflare，**Buy a domain** 则是在 Cloudflare 重新购买，这两项都不是本次操作。

![添加已有域名时选择 Connect a domain](/study/cloudflare-yarn-lock/2.png)

提交 `kikivibes.blog` 后，Cloudflare 会提供两组 Nameserver。回到 Namesilo，打开该域名的名称服务器设置，删除原来的 Namesilo 默认 NS，把 Cloudflare 给出的两组全部填入。只替换其中一组时，解析不能稳定生效。

保存后回到 Cloudflare，点击 **I updated my nameservers**。Cloudflare 会检查公共 DNS 是否已经改到它提供的服务器。这一步需要等待，完成前不要认为域名已经可用。

## 绑定到 Pages 项目

Nameserver 生效后，域名已经由 Cloudflare 解析，但还没有指到 Pages 里的博客项目。打开该项目，进入 **Custom domains**，点击 **Set up a custom domain**。

![Pages 项目的 Custom domains](/study/cloudflare-yarn-lock/0.png)

在域名输入框中填写 `kikivibes.blog`，这是不带 `www` 的主域名。点击继续后进入 DNS 配置。由于该域名已经添加在同一个 Cloudflare 账户中，Cloudflare 会自动创建指向这个 Pages 项目的解析记录，不需要再回 Namesilo 添加。

![填写自定义域名 kikivibes.blog](/study/cloudflare-yarn-lock/3.png)

记录生效后，Custom domains 中的状态变为可用，Cloudflare 同时为该域名签发 HTTPS 证书。此后访问 [kikivibes.blog](https://kikivibes.blog)，请求会先到达 Cloudflare，再返回 Pages 上已经构建好的页面。`www.kikivibes.blog` 是另一个主机名，本次没有添加；如果也需要这个地址，应在 Custom domains 中再添加一次。

## DNS 和 CDN

**DNS**（Domain Name System，域名系统）负责把域名换成服务器地址。浏览器不能直接用 `kikivibes.blog` 找机器，它要先问 DNS：这个名字现在指向哪里。回答这个问题的服务器就是 Nameserver。域名买下来时，Namesilo 提供自己的 Nameserver；把它换成 Cloudflare 的两组之后，同样的问题改由 Cloudflare 回答，它再告诉浏览器去访问 Pages 上的站点。只修改其中一组时，不同地区的查询可能得到不同结果，所以两组都要替换，并等待公共 DNS 完成更新。

**CDN**（Content Delivery Network，内容分发网络）把网站的静态文件复制到多个地点，让访客从较近的节点获取页面，而不是每次都访问存放源文件的那一台服务器。这个博客构建后的 HTML、JavaScript、CSS 和图片都是静态文件。域名交给 Cloudflare 之后，访客的请求先进入 Cloudflare 的节点，节点再向 Pages 取回页面，并可以缓存这些文件。因此 Cloudflare 在这里同时做两件事：用 DNS 说明 `kikivibes.blog` 该找谁，用 CDN 就近返回已经构建好的页面。
