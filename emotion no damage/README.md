# MediaPipe 即時表情辨識專案

## 專案說明
這個專案是一個使用 MediaPipe Face Mesh 的瀏覽器即時表情辨識系統。它可以透過相機偵測臉部特徵，並依據嘴巴與眼睛比例判斷使用者現在的表情狀態。

## 主要功能
- 即時臉部偵測與特徵點繪製
- 根據嘴巴與眼睛特徵判斷表情
- 顯示中文狀態提示
- 使用語音朗讀狀態回饋
- 提供「開啟 / 關閉 語音回饋」按鈕

## 檔案說明
- `index.html`：專案前端頁面
- `script.js`：表情偵測與語音回饋邏輯
- `style.css`：頁面樣式設定
- `serve.bat`：本機伺服器啟動腳本
- `main.py`：原本用於 MediaPipe Python 的初始化程式（此專案主要透過瀏覽器前端執行）
- `pose_landmarker_lite.task`：MediaPipe 模型檔案

## 使用方式
### 1. 直接開啟網頁
老師可以直接打開 `index.html`，看到專案的介面與說明，即使沒有啟動相機也能閱讀內容。

### 2. 若要執行實際辨識
1. 雙擊 `serve.bat`
2. 在瀏覽器中開啟 `http://localhost:8000`
3. 允許瀏覽器存取相機

## 網址持續可用（部署到 GitHub Pages）
如果希望網址不依賴這台電腦，可以把專案上傳到 GitHub，並啟用 GitHub Pages。這樣即使電腦關掉，也能透過固定網址打開專案。

部署步驟：
1. 建立 GitHub 倉庫，例如 `emotion-no-damage`。
2. 將專案所有檔案推送到倉庫。
3. 在 GitHub 倉庫設定中開啟 Pages，選擇 `main` 或 `gh-pages` 分支，目錄選 `/(root)`。
4. GitHub 會自動產生一個網址，通常是 `https://<你的使用者名稱>.github.io/<倉庫名稱>/`。

> 你的專案已經是靜態網站格式，`index.html`、`script.js`、`style.css` 已經可以直接部署。

## 特別說明
- 如果程式沒有執行，`index.html` 仍然可以開啟，老師可以看到專案的畫面佈局與說明。
- 若要展示功能，請再啟動 `serve.bat` 並允許相機存取。

## 給老師看的重點
1. 專案目的：用瀏覽器即時辨識表情
2. 使用技術：MediaPipe Face Mesh + JavaScript
3. 功能展示：臉部特徵繪製、狀態文字、語音回饋
4. 操作方式：開啟 `index.html` 或用 `serve.bat` 啟動伺服器
