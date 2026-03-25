# Strategy Platform Frontend

加密/量化策略平台前端，连接 `strategy_platform_service` 后端 API。

## 功能

- 策略排行榜浏览与详情页
- 交易信号查看与筛选
- 回测报告展示
- AI 市场研究报告
- 策略说明与指标定义
- 分级会员权益系统（guest → free → member → admin）
- 付费墙与权限门控

## 技术栈

- React 18 + TypeScript
- Vite (构建 + 开发服务器)
- Tailwind CSS 3
- Zustand (状态管理)
- React Router v7
- Vitest + Testing Library (测试)

## 快速开始

```bash
# 安装依赖（自动配置 git hooks）
npm install

# 复制环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

默认访问 http://localhost:5173，API 默认连接 `http://localhost:8000/api/v1`。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run check` | 仅 TypeScript 类型检查 |
| `npm run lint` | ESLint 检查 |
| `npm test` | 运行全部测试 |
| `npx vitest run src/path/to/file.test.ts` | 运行单个测试 |

## Git Hooks

通过 husky + lint-staged 自动执行：

- **pre-commit**: 对暂存的 `.ts/.tsx` 文件运行 ESLint（`--max-warnings 0`）
- **pre-push**: 运行 `tsc --noEmit` 类型检查 + 全量测试

`npm install` 时自动配置，无需手动设置。

## 项目结构

```
src/
├── api/          # API 客户端、类型定义、领域模块
├── components/   # UI 组件（按功能分组）
│   ├── layout/   # AppShell、ErrorBoundary、PageContainer
│   ├── nav/      # TopNav
│   ├── paywall/  # Gated、PaywallModal、LockBadge 等
│   ├── strategy/ # 策略卡片、图表、回测面板
│   └── methodology/
├── hooks/        # 自定义 hooks（useApi、useEntitlements、usePaywall）
├── lib/          # 工具函数（entitlements、format、utils）
├── pages/        # 路由页面组件
├── stores/       # Zustand stores（auth、paywall、locale）
└── data/         # 静态数据（策略介绍）
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `http://localhost:8000/api/v1` |

## 会员与升级

当前阶段采用联系销售模式，所有升级操作通过后端管理。前端不包含自助升级/支付流程。
