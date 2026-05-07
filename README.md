# 青岚洞府

一个可直接托管的网页挂机修仙小游戏。

## 当前玩法

- 自动吐纳灵气和离线收益
- 多阶段境界、突破成功率、心魔压力
- 洞府升级：蒲团、灵田、剑阵
- 炼丹、服丹、灵草和灵石经营
- 历练任务和多路线秘境战斗，产出妖核与法器
- 历练任务可设置自动重复
- 修仙目标可领取一次性奖励
- 完成 3 个新手目标后解锁日常任务
- 坊市可购买材料、装备和阵法资源

## 本地打开

直接用浏览器打开 `index.html`。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个公开仓库，例如 `qinglan-dongfu`。
2. 上传本文件夹里的所有文件。
3. 进入仓库 `Settings` -> `Pages`。
4. `Build and deployment` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main`，目录选择 `/root`，保存。
6. 等待部署完成后，GitHub 会给出一个可分享的网址。

## 发布到 Netlify 或 Vercel

把整个文件夹拖到 Netlify，或导入到 Vercel。构建命令留空，发布目录选择项目根目录。

## 文件说明

- `index.html`: 游戏入口页面
- `styles.css`: 页面样式
- `src/browserGame.js`: 浏览器直接运行的游戏版本
- `src/gameCore.mjs`: 可测试的核心规则
- `tests/game.test.mjs`: 核心规则测试
