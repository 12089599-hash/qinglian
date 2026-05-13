# 青岚洞府 Supabase 后端

这组文件是云端账号、云存档和排行榜的第一版后端骨架。玩家仍可游客本地游玩；只有配置 Supabase 后，云端按钮才会真正发起请求。

## 需要的 Supabase 配置

在 Supabase 项目中准备：

- `SUPABASE_URL`: 项目 URL，例如 `https://xxxx.supabase.co`
- `SUPABASE_ANON_KEY`: 浏览器端公开 anon key，用于 `index.html` 的 meta 配置或 `window.QINGLAN_CLOUD_CONFIG`
- `SUPABASE_SERVICE_ROLE_KEY`: Edge Function 环境变量，仅在 Supabase 函数端保存，不要放入网页

网页端配置示例：

```html
<meta name="qinglan-supabase-url" content="https://xxxx.supabase.co" />
<meta name="qinglan-supabase-anon-key" content="public-anon-key" />
```

## 部署步骤

1. 在 Supabase SQL editor 运行 `schema.sql`。
2. 部署 `functions/qinglan-save`，用于登录用户上传和读取云端进度。
3. 部署 `functions/qinglan-leaderboard`，用于读取公开排行榜。
4. 部署 `functions/qinglan-account-delete`，用于记录应用内账号删除申请。
5. 在 Supabase Edge Function 设置中加入 `SUPABASE_SERVICE_ROLE_KEY`。
6. 打开 Auth 的 Email provider，并确认站点 URL、邮件模板和跳转域名。

示例命令：

```sh
supabase functions deploy qinglan-save
supabase functions deploy qinglan-leaderboard
supabase functions deploy qinglan-account-delete
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
```

## 数据边界

- `profiles`: 账号展示名和删除申请时间。
- `cloud_saves`: 用户每次被服务器接受的存档快照。
- `leaderboard_snapshots`: 服务器写入的排行榜快照，只公开 `verified = true` 的行。
- `audit_events`: 云存档、删除申请等安全审计记录。

当前 `qinglan-save` 会从客户端上传的 `meta` 中提取境界、秘境层数和道威，做基础边界检查后写入排行榜。后续如果要增强反作弊，应把更多游戏规则移到服务端，用动作事件重放替代直接信任完整资源总量。

## App Store 注意事项

如果 App Store 版本允许注册账号，应用内必须保留账号删除入口。`qinglan-account-delete` 会写入 `profiles.deletion_requested_at` 和审计事件；正式运营时还需要后台流程定期处理这些申请，删除 Supabase Auth 用户和关联数据。
