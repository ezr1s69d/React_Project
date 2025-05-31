# ScheduleApp 專案介紹

## 專案簡介

**ScheduleApp** 是一個以 React + TypeScript + Vite 為基礎的行事曆/工作流程管理應用，支援多層級細流（子表格）、動態欄位、資料連結與即時編輯。專案結合 Tailwind CSS 進行美觀設計，並以現代化的 React Hooks 與 Context API 管理狀態。

---

## 主要功能

- **多層級工作流程表格**：支援主表與子表（細流）結構，方便複雜流程拆解。
- **動態欄位與資料列**：可隨時新增、刪除欄位與資料列。
- **欄位型別支援**：如時間、負責人、群組、地點、備註等。
- **資料連結**：可將某列連結至子細流表格，並即時同步名稱。
- **自動完成輸入**：人員、群組、連結等欄位支援自動補全。
- **即時編輯**：點擊即可編輯標題、欄位名稱與內容。
- **美觀 UI**：採用 Tailwind CSS，支援深色模式與響應式設計。
- **MySQL 後端（可選）**：提供 Express + MySQL 範例 API，可串接資料庫儲存。

---

## 技術棧

- **前端**：React 19, TypeScript, Vite, Tailwind CSS
- **狀態管理**：React Context + useReducer
- **後端（可選）**： ~~尚未增加~~
- **其他**：Axios, Heroicons

---

## 專案結構

```
scheduleApp/
├── public/
├── src/
│   ├── components/    # 主要元件（表格、按鈕、工作流程樹等）
│   ├── util/          # 型別、工具、AutoComplete 等
│   ├── pages/         # 路由頁面
│   ├── App.tsx        # 入口元件
│   ├── App.css        # 全域樣式
│   ├── index.css      # Tailwind 及全域樣式
│   └── main.tsx       # React 入口
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 快速開始

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **啟動前端開發伺服器**
   ```bash
   npm run dev
   ```

3. （可選）**啟動後端 API**
   ```bash
   node src/server.js
   ```

---

## 主要成員

- 陳威達
- 賴柏均

---

## 其他說明

- 字型可自訂，預設支援 Google Fonts。
- Tailwind CSS 設定於 `tailwind.config.js`，可依需求擴充。
- 若需串接 MySQL，請先建立資料庫並調整 `src/server.js` 連線設定。

---