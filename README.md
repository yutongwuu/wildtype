# Wildtype — Yutong Wu

静态个人网站。无需安装依赖或运行构建，保留已确认的渐变背景、16px 左侧文字、30px 顶部留白和八个项目顺序。

## 修改文字

在 GitHub 打开 `content.json` → 铅笔 Edit → 修改 `text` 下的文字 → Commit changes。保留 JSON 的双引号和逗号；字符串内换行写成 `\n`。`settings` 管理排版。

## 上传动物 PNG / logo

1. 打开 `assets/images/`，选择 Add file → Upload files，上传 PNG 并提交。
2. 在 `content.json` 相应项目的 `image` 中填写 `assets/images/salticid.png` 等路径；`imageAlt` 填写图片描述。
3. `site.logo` 可以填写 `assets/images/logo.png`，留空时不显示 logo。logo 会在原左上角空位显示。
4. `projects` 的顺序就是网页项目顺序；可用 `url` 关联实际项目页面，留空时不产生链接。

## 发布

仓库 Settings → Pages → Deploy from a branch → main → /(root) → Save。
默认网址：https://yutongwuu.github.io/wildtype/ 。启用 Pages 后，以 GitHub 返回的网址和部署结果为准。

## 原可视化编辑器

`editor.html` 是当前版本的独立可编辑备份。它的更改只存在当前浏览器或下载的 HTML 中，不会自动修改 `content.json`、提交 GitHub 或更新公开网站。推荐以 `content.json` 为公开内容的唯一来源。

## 本地预览

在目录内运行 `python3 -m http.server 8000`，访问 http://localhost:8000/ 。公开版本通过 HTTP 读取 `content.json`；双击文件时只能显示导出时的静态备用内容。

## 页面与可访问性

目前 Engineering Work / Arts / Readings / Blog 显示可编辑的占位内容，项目详情尚未补齐。使用语义标题、有序列表、键盘焦点和替代文字；仍需实际 NVDA、键盘和手机测试，未声称通过完整可访问性审计。
