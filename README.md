# JEETOO 双平台前端原型

基于 React、TypeScript、Vite 和 React Router 的前端初始化项目，包含开发者平台与内部客户管理平台两套独立布局。当前页面以导航骨架和占位内容为主，不连接后端、数据库或真实 API。

## 环境要求

- Node.js 20.19+ 或 22.12+
- npm

## 启动

```bash
npm install
npm run dev
```

Vite 会在终端显示本地访问地址（通常为 `http://localhost:5173`）。

## 其他命令

```bash
npm run build    # TypeScript 检查并构建生产静态文件
npm run preview  # 本地预览生产构建
```

## 路由

- `/developer/*`：开发者平台，深色科技风格
- `/admin/*`：客户管理平台，企业后台布局
- `/admin/applications/:applicationId`：申请详情占位路由

项目入口在 `src/main.tsx`，路由定义在 `src/router/index.tsx`，两个平台的布局分别位于 `src/platforms/developer` 与 `src/platforms/admin`。
