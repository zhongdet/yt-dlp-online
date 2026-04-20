## 說明
### 項目說明

這是一個youtube影片下載器，可解析多種格式包含 `".mp4", ".mkv", ".webm", ".mp3", ".m4a", ".wav"`。下載邏輯用python package: yt-dlp實現。另外，前端有好看的星空效果 :)
##### 技術棧
- React
- Vite
- TaildindCSS
- Shadcn/ui (React組件庫)
- fastapi (python後端)
### 環境依賴
- python runtime 3.11
- uv
- node runtime
- ffmpeg shared
### 啟動方式
#### fronted :
1. `npm install`
2. `npm run dev`
#### backend:
1. `uv sync`
2. `uv run uvicorn main:app --reload`

> 由於不考慮部署，用開發方式分別啟動即可，部署時預計在python後端引用前端build後的static file
