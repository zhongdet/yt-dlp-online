import asyncio
import os
import re

import yt_dlp
from fastapi import BackgroundTasks, FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl
from typing import List
import glob
from yt_dlp.utils import DownloadError

app = FastAPI()

# 解決跨域問題
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# 1. 完善：使用 Pydantic 進行資料驗證，確保傳入的一定是合法的 URL
class VideoRequest(BaseModel):
    url: HttpUrl
    format_id: str | None = None


# 模擬簡單的進度存儲 (正式環境建議用 Redis)
progress_db = {}

# 2. 完善：確保下載目錄存在，避免寫入時發生 FileNotFoundError
DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# 3. 完善：預備正則表達式，用來清除 yt-dlp 進度字串中常見的 ANSI 色彩代碼
ansi_escape = re.compile(r"\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])")


@app.post("/api/info")
async def get_info(data: VideoRequest):
    ydl_opts = {"quiet": True}
    loop = asyncio.get_event_loop()

    try:
        # 使用 str(data.url) 將 Pydantic HttpUrl 物件轉回字串
        with yt_dlp.YoutubeDL({"quite": True}) as ydl:
            info = await loop.run_in_executor(
                None, lambda: ydl.extract_info(str(data.url), download=False)
            )
    except DownloadError as e:
        # 4. 完善：加入錯誤處理，若解析失敗回傳 400 Bad Request
        raise HTTPException(status_code=400, detail=f"無法獲取影片資訊：{str(e)}")
    # print(info)
    return {
        "title": info.get("title"),
        "thumbnail": info.get("thumbnail"),
        "duration": info.get("duration"),
        "id": info.get("id"),
        "author": info.get("uploader"),
        "format": info.get("formats", []),
    }


def download_sync(url: str, task_id: str, format_id: str | None = None):
    def hook(d):
        if d["status"] == "downloading":
            # 5. 完善：清除 ANSI 轉義序列並去除首尾空白，確保前端拿到純粹的 'xx.x%'
            raw_percent = d.get("_percent_str", "0%")
            clean_percent = ansi_escape.sub("", raw_percent).strip()
            progress_db[task_id] = {"status": "downloading", "progress": clean_percent}
        elif d["status"] == "finished":
            progress_db[task_id] = {"status": "finished", "progress": "100%"}
        elif d["status"] == "error":
            error_msg = d.get("info_dict", {}).get("_exception_msg", "Download error")
            progress_db[task_id] = {"status": "error", "progress": "0%", "error": error_msg}

    ydl_opts = {
        "progress_hooks": [hook],
        "outtmpl": os.path.join(
            DOWNLOAD_DIR, f"{task_id}.%(ext)s"
        ),  # 使用 os.path.join 更安全
        "quiet": True,  # 背景下載時建議保持 quiet，減少 Server 終端機雜訊
        "writethumbnail": True,
        "postprocessors": [{"key": "EmbedThumbnail"}],
    }
    if format_id:
        ydl_opts["format"] = format_id

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except Exception as e:
        # 6. 完善：捕捉下載過程中的崩潰，避免卡在某個百分比
        error_msg = str(e)
        progress_db[task_id] = {"status": "error", "progress": "0%", "error": error_msg}


@app.post("/api/download/{task_id}")
async def start_download(
    data: VideoRequest,
    background_tasks: BackgroundTasks,
    # 7. 完善：加入正則驗證，防止「路徑穿越攻擊 (Path Traversal)」，例如傳入 ../../ 這種危險的 ID
    task_id: str = Path(..., pattern="^[a-zA-Z0-9_-]+$"),
):
    # 8. 完善：在背景任務啟動前先初始化進度，避免剛發請求就查詢時拿到預設值或報錯
    progress_db[task_id] = {"status": "downloading", "progress": "0%"}
    background_tasks.add_task(download_sync, str(data.url), task_id, data.format_id)
    return {"message": "Download started", "task_id": task_id}


@app.get("/api/progress/{task_id}")
async def get_progress(task_id: str):
    progress = progress_db.get(task_id)
    # 9. 完善：如果找不到該任務，應該回傳 404 而不是直接當作 0%
    if progress is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return progress

@app.get("/api/file/{task_id}")
async def get_file(task_id: str = Path(..., pattern="^[a-zA-Z0-9_-]+$")):
    # 尋找與 task_id 匹配的檔案 (無視副檔名)
    search_pattern = os.path.join(DOWNLOAD_DIR, f"{task_id}.*")
    matches = glob.glob(search_pattern)
    if not matches:
        raise HTTPException(status_code=404, detail="File not found or still processing")
    
    # 返回找到的第一個檔案 
    # 注意: 如果同時存在 image 和 video，我們會希望返回 video。yt-dlp 下載後有時會留下 .jpg (如果 embed_thumbnail 失敗)
    # 我們將優先選擇 .mp4, .webm, .mkv, .mp3, .m4a 等媒體格式
    media_exts = [".mp4", ".mkv", ".webm", ".mp3", ".m4a", ".ogg", ".wav"]
    target_file = matches[0]
    for m in matches:
        if any(m.endswith(ext) for ext in media_exts):
            target_file = m
            break

    return FileResponse(
        path=target_file,
        media_type="application/octet-stream",
        filename=os.path.basename(target_file)
    )

class CleanupRequest(BaseModel):
    task_ids: List[str]

@app.post("/api/cleanup")
async def cleanup_files(data: CleanupRequest):
    deleted_count = 0
    for task_id in data.task_ids:
        if not re.match("^[a-zA-Z0-9_-]+$", task_id):
            continue
        search_pattern = os.path.join(DOWNLOAD_DIR, f"{task_id}.*")
        for file_path in glob.glob(search_pattern):
            try:
                os.remove(file_path)
                deleted_count += 1
            except OSError:
                pass
        
        # 同時從 progress_db 移除
        progress_db.pop(task_id, None)

    return {"message": f"Cleaned up {deleted_count} files"}
