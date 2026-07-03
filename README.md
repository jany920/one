# 紫微斗数排盘 Web 项目

这是一个可运行的 Node.js 原生 Web 项目，用于根据公历出生资料生成紫微斗数命盘 JSON，并在页面渲染十二宫、主星、辅星、四化、命宫与身宫等信息。

> 说明：本项目用于规格书验收、研究和娱乐展示，不构成医学、法律、投资或人生决策建议。

## 功能

- 前端输入：出生日期时间、性别、出生地经度、时区、年龄范围。
- 核心排盘：计算农历、真太阳时、四柱、五行局、命身宫、十四主星、常用辅星、生年四化、自化、神煞、大限、小限、流年。
- JSON 输出：`POST /api/chart` 返回完整结构化命盘，包含 `palaces` 十二宫与 `fate_periods` 十二个大限 / 一百二十个流年。
- 页面渲染：摘要、十二宫卡片、主星、辅星、四化标签、命身宫标记和完整 JSON。
- 验收测试：包含规格书第 8 节对应的 1983 金四局样例，以及用户给出的 1992 辛未女命样例。

## 本地开发

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

## 测试

```bash
npm test
```

## API 示例

```bash
curl -X POST http://localhost:3000/api/chart \
  -H 'Content-Type: application/json' \
  -d '{
    "gender":"female",
    "calendar":"solar",
    "datetime":"1992-01-18T02:15",
    "longitude":108.933,
    "timezone":"+08:00",
    "options":{"true_solar_time":true,"equation_of_time":true,"age_range":[1,60]}
  }'
```

## 部署说明

### 普通 Node 服务器

1. 安装 Node.js 20 或更高版本。
2. 在服务器执行 `npm ci --omit=dev`。
3. 设置端口并启动：`PORT=3000 npm start`。
4. 用 Nginx/Caddy 将域名反向代理到 `http://127.0.0.1:3000`。

### Render / Railway / Fly.io 等平台

- Build Command：`npm ci`
- Start Command：`npm start`
- 环境变量：可选 `PORT`，平台通常会自动注入。

## 项目结构

- `engine/`：核心排盘模块。
- `public/`：前端页面、样式与交互脚本。
- `server.js`：静态文件与 API 服务。
- `test/`：验收与服务测试。
