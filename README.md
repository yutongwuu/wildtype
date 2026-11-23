# Wildtype — Yutong Wu

最新版网站，保留确认的比例、渐变背景、富文本介绍、错落圆圈和6张原始照片。

## 修改内容

- `content.json` 的 `bioBlocks`：左侧段落的 HTML。保留 `<strong>` 加粗和 `<a href="…">` 链接。
- `projects`：项目顺序、名称、caption、highlights、图片路径与详情网址。
- `settings`：页面宽1241px、左栏46.5%、间距90px；`bubbles`：白环10px、图片裁切和动态开关。
- 原始图片在 `assets/images/`。图片路径填写 `assets/images/filename.png`，JPG也支持。
- `personal/`：摄影、古筝、戏剧、德语文章、NGO及文献库的占位页面。
- `projects/`：项目详情 HTML，可在 GitHub 中直接编辑。

## 本地可视化编辑

`editor.html` 是完整独立的可视化版本，照片已内嵌。修改后下载 HTML 保存，再交回用于同步公开网站。浏览器编辑不会自动提交 GitHub。

之后的改版流程：先本地修改和确认，再由用户明确要求 push。

## 发布

Settings → Pages → Deploy from a branch → main → /(root)。网站内容由 `content.json` 驱动；HTML有无JavaScript时均可读取的备用内容。新增详情页面时请使用相对路径。

目前详情页正文和个人分类页仍有占位内容；未声称完成 NVDA 审计。BioSignals Personal Agent 尚待图片。
