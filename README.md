# 🛋️ wowoFurniture - 線上傢俱購物網站

一個以 **MVC 架構** 開發的前端練習專案，模擬線上傢俱電商平台。
本專案以 **JavaScript + Axios + SweetAlert2** 為主要技術，
實作商品列表、購物車操作、訂單送出與管理端訂單查詢等功能。

---
👉 專案連結： [前台網站](https://wayne0917.github.io/Wayne0917-project-wowoFurniture.io/)
 ｜ [後台管理系統](https://wayne0917.github.io/Wayne0917-project-wowoFurnitureBackstage.io/)
## 🚀 專案特色

### 🧠 架構設計

* 採用 **MVC 模式**：

  * **Model**：責載 API 串接與資料處理（axios）
  * **View**：動態演算商品、購物車與訂單內容（DOM 操作）
  * **Controller**：統一管理事件代理與資料流邏輯
* 程式結構模組化，維護性高，易於擴充

### 🛍️ 前台功能

* 取得商品列表並演算至畫面
* 篩選商品分類（全部 / 單一分類）
* 加入購物車、修改數量、刪除單筆或全部品項
* 表單驗證：確認使用者必填欄位
* SweetAlert2 彈窗提示操作狀態（加入成功、送出中、訂單完成）

### 🧾 後台功能

* 管理端可透過 API 查詢訂單資料
* 含訂單狀態（已處理 / 未處理）、使用者資訊、購買項目
* 支援 API Token 驗證（授權保護）

---

## 🧹 使用技術

| 類別     | 技術                           |
| ------ | ---------------------------- |
| 前端語言   | HTML5、CSS3、JavaScript (ES6+) |
| API 串接 | Axios                        |
| UI 提示  | SweetAlert2                  |
| 架構設計   | MVC 模式                       |
| 工具     | Git / GitHub                 |

---

## 🔗 API 文件

使用 [HexSchool LiveJS API](https://livejs-api.hexschool.io/)
提供商品列表、購物車、訂單相關功能。

### Customer API

```
https://livejs-api.hexschool.io/api/livejs/v1/customer/{api_path}
```

### Admin API

```
https://livejs-api.hexschool.io/api/livejs/v1/admin/{api_path}/orders

---

## 📦 專案執行方式

1. Clone 專案

   ```bash
   git clone https://github.com/Wayne0917/Wayne0917-project-wowoFurniture.io.git
   
2. 開啟專案資料夾

   ```bash
   cd Wayne0917-project-wowoFurniture.io
   
3. 以 Live Server 或任意靜態伺服器開啟 `index.html`

---

