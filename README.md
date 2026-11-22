# 天才会

天才会是一个只做一件事的协会：会员之间互相称呼天才。这个仓库是它的官网。

页面是一整屏一整屏的印刷版面：群青、纸色和一枚印章黄，一组公有领域的历史图像被处理成群青单色，摆在版心两侧。滚动到底部可以写下名字，给自己开一张称号授予书，存成图片带走。

## 本地预览

没有构建步骤，也不依赖任何包管理器。用浏览器直接打开 `index.html` 即可；如果想让 `fetch`、字体和模块行为都跟线上一致，起一个静态服务器：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署

整站是三个静态文件加一个 `assets` 目录，放到任意静态托管即可（GitHub Pages、Cloudflare Pages、Netlify 都可以）。仓库根目录就是站点根目录，不需要打包。

GitHub Pages：Settings → Pages → Source 选 `Deploy from a branch`，分支选 `master`，目录选 `/ (root)`。

## 目录

```
index.html      页面结构
styles.css      全部样式，含响应式与动效
script.js       入场动效、授予书生成、导出 PNG
favicon.svg     站点图标
assets/         处理过的馆藏图像
```

## 字体

拉丁文用 EB Garamond，中文用思源宋体，都从 Google Fonts 加载。字体拿不到时会退回系统衬线体（宋体、Songti SC），版面不会塌。

## 图像

`assets/` 里的六张图来自大都会博物馆开放资源，均为公有领域（CC0），经过群青双色调处理：

- Marble portrait head of the philosopher Chrysippos，罗马，1 世纪
- Interior of a Library，Daniel Marot，1703 或 1712
- Portrait of Dante Alighieri，Stradanus，约 1595
- Royal Institution, Albemarle Street，Thomas Rowlandson，1809
- Marble portrait head of an elderly man，罗马，公元前 1 世纪
- Portrait of Baldassare Castiglione，Henri Dubouchet，1870

## 许可

GNU General Public License v3.0，见 [LICENSE](LICENSE)。
