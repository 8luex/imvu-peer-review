# Peer Review · Catalog Filter

一个用于 IMVU Peer Review 页面的 **Tampermonkey userscript**。根据 **Catalog Location** 筛选商品：匹配指定关键词时打开 Classic，不匹配时执行 Skip。

> **Warning — 自动投票：** 本脚本会自动勾选 **No issues**，并在随机 **25–35 秒**后尝试点击 **Vote**。它不会检查商品是否符合平台政策，也不能确认 Classic 已成功启动。请先了解实际行为、核对 IMVU 当前规则，并自行完成商品审核；不要把类别匹配当作审核通过的依据。

## Features / 功能

- **Category filter**：只检查 Catalog Location，不检查 Product Name 或 Description。
- **Open in Classic**：匹配时点击页面现有的 `imvuclassic:PeerReview` 链接。
- **Auto vote**：打开链接后自动勾选 No issues，再延迟尝试点击 Vote。
- **Auto skip**：类别不匹配时点击 Skip this product，不为该商品安排投票。
- **Stable selectors**：使用链接协议、input name 和 button class，不依赖页面随机生成的 ID。
- **Missing controls**：缺少必要信息或控件时停止操作，并在 Console 输出警告。

## Supported categories / 支持类别

| | | |
| --- | --- | --- |
| Hair | Heads | Tails |
| Eyebrows | Shoes | Nails |
| Glasses | Eyes | |

匹配 **不区分大小写**，使用 word boundary，不是任意子字符串匹配。例如，`Hair` 可以匹配，`Hairpins` 不会仅因为包含 Hair 就匹配。

```text
Accessories > Glasses                   → Open Classic + Auto vote
Clothing > Clothing for Female > Shoes  → Open Classic + Auto vote
Clothing > Clothing for Male > Hoodies  → Skip
```

## Requirements / 使用条件

- 支持 Tampermonkey 的浏览器，以及已安装并启用的 Tampermonkey 扩展。
- 已登录 IMVU，且账号可以访问 Peer Review。
- 已安装 IMVU Classic，并配置好 `imvuclassic:` 协议处理程序。
- 浏览器可能要求确认是否允许打开外部应用；脚本不会绕过该提示。

## Installation / 安装

### Option A — GitHub Raw

1. 在本仓库打开 [peer_review.user.js](peer_review.user.js)。
2. 点击 **Raw**。
3. 如果 Tampermonkey 显示安装页面，检查代码后点击 **Install**。
4. 如果只显示代码，请使用下面的 Manual install。

### Option B — Manual install

1. 打开 Tampermonkey Dashboard，选择 **Create a new script**。
2. 删除模板内容，粘贴 [peer_review.user.js](peer_review.user.js) 的完整代码。
3. 按 **Ctrl+S** 保存，并确认脚本已启用。
4. 如果之前安装过旧版 Peer Review 脚本，请禁用或移除旧版，避免重复操作。

## Usage / 使用方式

打开 <https://www.imvu.com/peer_review/> 后脚本会自动运行，**没有 Start 按钮或额外确认框**。

1. 读取 Catalog Location。
2. **匹配类别** → 点击 Open in Classic → 勾选 No issues → 等待 25–35 秒 → 尝试点击 Vote。
3. **不匹配类别** → 点击 Skip this product，然后结束本次执行。

**注意：**

- Skip 或 Vote 如果让网站加载下一个商品页面，脚本会在新页面再次自动运行。
- 执行 Skip 前没有额外延迟；在真实账号上使用前，请确认这符合平台当前规则。
- 定时触发时，如果 Vote 按钮为 `disabled` 或包含 `wait` class，就不点击，也不会自动重试。
- 后台标签页的浏览器 timer 可能延迟，25–35 秒不是精确定时保证。
- 脚本无法验证外部客户端是否打开、商品是否加载成功，或投票是否提交成功。
- 如需停止后续自动操作，请禁用 Tampermonkey 中的脚本，并关闭或刷新已打开的 Peer Review 页面；仅禁用脚本不会取消当前页面已经安排的 timer。

## Configuration / 自定义类别

编辑脚本中的 `allowedCategories`，在 `|` 之间增加或移除关键词：

```js
const allowedCategories =
  /\b(?:Hair|Heads|Tails|Eyebrows|Shoes|Nails|Glasses|Eyes)\b/i;
```

保存后刷新页面即可生效。关键词位于正则表达式中；加入包含特殊符号的类别时，需要正确转义。

## Troubleshooting / 排查问题

- **脚本没有运行**：检查 Tampermonkey 是否启用脚本，页面地址是否匹配脚本的 `@match`，以及浏览器是否已授予扩展运行权限。
- **Classic 没有打开**：先停用脚本并刷新页面，再手动测试页面上的 Open in Classic 链接，检查协议关联及浏览器提示。
- **页面没有继续**：在 DevTools → Console 查找 `[Peer Review]` 警告。网站结构变化可能需要更新 selectors；缺少控件时脚本不会重试。

## Project files

```text
peer_review.user.js  # Tampermonkey userscript
README.md            # 使用说明 / Documentation
.gitignore           # 本地文件排除规则
```

## Disclaimer / 免责声明

这是独立的第三方项目，**与 IMVU 无关联，也未获得其认可**。IMVU 名称及相关标识属于其各自权利人。

用户应自行确认自动化行为是否符合平台服务条款及 Peer Review 规则。本项目不保证账号安全、平台兼容性或审核结果。仓库中的测试不代表已在当前线上网站或 Classic 客户端验证通过。

发布 Issue 或分享调试资料时，请移除账号信息、token、cookie 和其他私人数据，不要上传未经检查的登录后 HTML 快照。
