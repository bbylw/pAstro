# WebNav Hub

个人常用网站导航集合，按分类整理 AI 工具、社交媒体、实用工具、科技资讯、云存储、电子邮箱等，内置站点搜索。

基于 [Astro](https://astro.build) 构建，静态生成，部署到任何静态托管即可。客户端 JS 仅用于锚点平滑滚动与实时搜索，开箱即用且兼容 [View Transitions](https://docs.astro.build/zh/guides/view-transitions/)。

## 功能

- 分类导航 + 锚点平滑滚动，自动同步 URL hash
- 顶部实时搜索框，按站点名称过滤，无匹配的分类自动折叠
- 卡片悬停上浮、图标放大、键盘 `:focus-visible` 聚焦样式
- 5 级响应式断点（1200 / 768 / 480 / 360px），移动端导航自动换行
- 零运行时框架，构建产物为纯静态 HTML/CSS/JS

## 技术栈

- [Astro 5](https://astro.build) — 静态站点生成
- TypeScript — 链接数据、导航与搜索脚本
- 原生 CSS — 响应式样式（移动端优先）
- [Font Awesome 7](https://fontawesome.com) — 图标（CDN 引入）

## 目录结构

```
.
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── CNAME                 # 自定义域名（GitHub Pages 用，勿删）
└── src/
    ├── data/
    │   └── links.ts          # 链接数据（分类 + 站点）
    ├── layouts/
    │   └── Layout.astro      # 基础布局
    ├── components/
    │   ├── Header.astro      # 顶部标题
    │   ├── Search.astro      # 搜索框
    │   ├── Nav.astro         # 锚点导航（自动从数据生成）
    │   ├── CategorySection.astro
    │   ├── LinkCard.astro    # 单个卡片
    │   └── Footer.astro
    ├── scripts/
    │   ├── navigation.ts     # 平滑滚动 + hash 同步（兼容 View Transitions）
    │   └── search.ts         # 实时搜索过滤（兼容 View Transitions）
    ├── styles/
    │   └── global.css
    └── pages/
        └── index.astro       # 主页
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:4321）
npm run dev

# 构建静态产物到 dist/
npm run build

# 本地预览构建结果
npm run preview
```

## 添加 / 修改链接

所有链接集中在 `src/data/links.ts`：

```ts
export interface LinkItem {
  title: string;   // 显示名称
  url: string;     // 目标地址
  icon: string;    // Font Awesome 类名，如 "fa-brands fa-github"
}

export interface Category {
  id: string;      // 锚点 id，需与导航对应
  title: string;   // 分类标题
  links: LinkItem[];
}
```

新增链接：在对应 `Category.links` 数组中追加一项即可。
新增分类：在 `categories` 数组中追加一项，导航会自动出现。

图标类名参考 [Font Awesome 图标库](https://fontawesome.com/icons)。

## 部署

构建产物在 `dist/`，可直接部署到任意静态托管。本项目无需环境变量、无服务端代码、无构建参数。

通用前置：

```bash
npm install
npm run build      # 产物在 dist/
```

部署成功后，访问 `https://<你的域名>/` 即可。

---

### 1. Cloudflare Pages

**方式 A：Git 集成（推荐）**

1. 把项目推送到 GitHub / GitLab。
2. 登录 [Cloudflare 仪表盘](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
3. 选择仓库，点 **Begin setup**。
4. 填写构建设置：
   - **Framework preset**：选 `Astro`（若无，选 `None`）
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
   - **Root directory**：（留空）
   - **Node version**：环境变量 `NODE_VERSION=22`（Pages 仪表盘 → Settings → Environment variables）
5. 点 **Save and Deploy**。首次部署约 1-2 分钟。
6. 之后每次 `git push` 自动重新部署。

**方式 B：直接上传 dist**

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist --project-name=webnav-hub
```

首次会要求登录 Cloudflare 账号。部署后访问 `https://webnav-hub.pages.dev`。

**绑定自定义域名**

Pages 项目 → **Custom domains** → **Set up a custom domain** → 输入域名（如 `nav.example.com`）。Cloudflare 会自动添加 CNAME 记录。若域名托管在 Cloudflare，一键即可；若在其它注册商，按提示到 DNS 添加 CNAME。

---

### 2. Vercel

**方式 A：Git 集成（推荐）**

1. 把项目推送到 GitHub。
2. 登录 [Vercel](https://vercel.com/) → **Add New…** → **Project**。
3. 选仓库，点 **Import**。
4. Vercel 自动识别 Astro，配置已默认填好：
   - **Build Command**：`astro build`（等价于 `npm run build`）
   - **Output Directory**：`dist`
   - **Install Command**：`npm install`
5. 点 **Deploy**。约 1 分钟完成。
6. 之后 `git push` 自动部署（main 分支为生产）。

**方式 B：CLI 部署**

```bash
npm i -g vercel
vercel login
vercel              # 首次：按提示配置项目；部署到预览环境
vercel --prod       # 部署到生产
```

**绑定自定义域名**

Project → **Settings** → **Domains** → 输入域名 → 按提示到 DNS 添加 A 记录（`76.76.21.21`）或 CNAME（`cname.vercel-dns.com`）。

---

### 3. Netlify

**方式 A：Git 集成（推荐）**

1. 把项目推送到 GitHub。
2. 登录 [Netlify](https://app.netlify.com/) → **Add new site** → **Import an existing project**。
3. 选择 Git 提供商并授权，选仓库。
4. 填写构建设置：
   - **Build command**：`npm run build`
   - **Publish directory**：`dist`
   - **Base directory**：（留空）
5. 点 **Deploy site**。
6. 之后 `git push` 自动部署。

**方式 B：拖拽部署**

无需 Git：

```bash
npm install -g netlify-cli
npm run build
netlify deploy --dir=dist --prod
```

首次会要求登录。预览 URL 类似 `https://random-name-123.netlify.app`。

**绑定自定义域名**

Site → **Domain settings** → **Add custom domain** → 输入域名 → 按提示添加 DNS 记录（CNAME 指向 `<site-name>.netlify.app`）。

**Netlify 专用配置（可选）**

如需自定义重定向/缓存头，在项目根目录创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

---

### 4. GitHub Pages

**方式 A：GitHub Actions 自动部署（推荐）**

1. 把项目推送到 GitHub。
2. 编辑 `astro.config.mjs`，把 `site` 改为你的 Pages 域名：

   ```js
   export default defineConfig({
     site: "https://<用户名>.github.io",
     base: "/<仓库名>",   // 仅项目页需要；用户页（<用户名>.github.io）留空
     // ...
   });
   ```

3. 创建 `.github/workflows/deploy.yml`：

   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: withastro/action@v5
         - uses: actions/configure-pages@v5
         - uses: actions/upload-pages-artifact@v3
           with:
             path: ./dist
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - uses: actions/deploy-pages@v4
   ```

4. 仓库 **Settings** → **Pages** → **Source** 选 **GitHub Actions**。
5. `git push` 后在 Actions 标签页查看进度，约 1-2 分钟完成。
6. 访问 `https://<用户名>.github.io/<仓库名>/`。

**方式 B：本地推 dist 到 gh-pages 分支**

```bash
npm install -D gh-pages
npm run build
npx gh-pages -d dist
```

仓库 **Settings** → **Pages** → **Branch** 选 `gh-pages` / root。

**绑定自定义域名**

仓库 **Settings** → **Pages** → **Custom domain** → 输入域名 → 在仓库根目录创建 `CNAME` 文件写入域名。DNS 添加 CNAME 记录指向 `<用户名>.github.io`。

---

### 5. 其他静态服务器

任何能托管静态文件的服务器都行。以 Nginx 为例：

```nginx
server {
    listen 80;
    server_name nav.example.com;
    root /var/www/webnav-hub/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

上传 `dist/` 内容到服务器根目录即可。

## 设计说明

- **配色**：黑色背景（`#0d0d0d`）+ 橙色主色（`#ff9000`）
- **搜索**：顶部输入框实时过滤所有卡片，无匹配的分类区块自动隐藏
- **交互**：卡片悬停上浮、图标轻微放大；导航锚点平滑滚动并同步 hash；脚本以 `astro:page-load` 为主、`DOMContentLoaded` 兜底，开启 View Transitions 也不会重复绑定
- **无障碍**：卡片以 `<a>` 包裹图标与标题，链接文本可被 SEO/屏幕阅读器识别；键盘 Tab 聚焦时有 `:focus-visible` 高亮轮廓；图标统一 `aria-hidden`
- **移动端**：5 级响应式断点，导航在窄屏自动换行

## License

MIT