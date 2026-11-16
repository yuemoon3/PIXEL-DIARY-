# PIXEL DIARY 2.0｜心情花園

從粉色像素生活小空間延伸的心情日記網站，使用 HTML、CSS、原生 JavaScript 與 localStorage，無需建置或登入。

## 本次新增
- 五種每日心情＋最多 300 字短記，同日更新與刪除。
- 可切換月份、點日期回顧或補寫的心情月曆。
- 本月紀錄天數、累計天數、心情分布與本月手札。
- 首頁心情摘要、JSON v2 備份，以及 v1 資料相容。

保留每日扭蛋、紙條、記帳與接星星遊戲。

## 預覽
在本目錄執行 `python3 -m http.server 8000`，開啟 http://localhost:8000/ 。亦可開啟 index.html 快速預覽；正式使用建議使用本機伺服器或 GitHub Pages，以維持一致的瀏覽器儲存來源。

## 部署
將本目錄根層的 HTML、CSS、JS 與文件上傳到 yuemoon3/PIXEL-DIARY- 的 main 分支根目錄，覆蓋同名檔案。GitHub Pages 設定維持 main / root。

Repository：https://github.com/yuemoon3/PIXEL-DIARY-
網站：https://yuemoon3.github.io/PIXEL-DIARY-/

本專案為 2.0 心情花園版本，透過 GitHub Pages 提供靜態網站。

## 資料說明
資料儲存在相同來源的同一瀏覽器，不支援雲端或跨裝置同步。部署到原網址並以原瀏覽器使用時，保留舊版的 pixel-diary-v1 資料。從本機預覽或其他網址開啟時會使用不同儲存空間。

JSON 匯入會完整取代目前所有資料；匯入舊備份會將心情列表設為空白，請先匯出新版備份。

維護規範見 AGENTS.md，需求見 SPEC.md，本次差異與檢查範圍見 本次更新與驗證.txt。
