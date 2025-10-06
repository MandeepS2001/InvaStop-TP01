from fastapi import APIRouter, UploadFile, Response, Query
from fastapi.responses import JSONResponse
import os
import httpx
from app.core.config import settings

router = APIRouter(prefix="/ai", tags=["ai"])

# Public GPU inference server - proxied via backend so the GPU host stays hidden
GPU_SERVER = os.getenv(
    "GPU_SERVER_URL",
    # Team model endpoint (POST), path is /detect (not /predict)
    "http://ec2-54-252-175-180.ap-southeast-2.compute.amazonaws.com/detect",
)


@router.get("/ping")
async def ping():
    return {"status": "ok"}

@router.post("/predict")
async def proxy_predict(img: UploadFile, model: str | None = Query(default=None)):
    # Validate image content type
    allowed_types = set(settings.ALLOWED_IMAGE_TYPES)
    if img.content_type not in allowed_types:
        return JSONResponse(
            status_code=415,
            content={
                "detail": f"Unsupported media type: {img.content_type}. Allowed: {sorted(list(allowed_types))}"
            },
        )

    # Enforce serverless-friendly size limit (min of configured MAX_FILE_SIZE and 4MB Vercel limit)
    serverless_limit = int(os.getenv("SERVERLESS_FILE_LIMIT", str(4 * 1024 * 1024)))
    max_bytes = min(settings.MAX_FILE_SIZE, serverless_limit)

    # Determine uploaded file size without loading into memory
    try:
        img.file.seek(0, os.SEEK_END)
        size_bytes = img.file.tell()
        img.file.seek(0)
    except Exception:
        # Fallback: read to measure (should be rare)
        data = await img.read()
        size_bytes = len(data)
        await img.seek(0)

    if size_bytes > max_bytes:
        return JSONResponse(
            status_code=413,
            content={
                "detail": "File too large",
                "max_bytes": max_bytes,
                "received_bytes": size_bytes,
            },
        )

    # Ensure we start at the beginning of the uploaded file
    await img.seek(0)
    files = {
        "img": (
            img.filename,
            img.file,
            img.content_type or "application/octet-stream",
        )
    }

    data = {}
    if model:
        data["model"] = model
    # Try the configured URL first; on 404, retry alternate path (/detect <-> /predict)
    async with httpx.AsyncClient(timeout=60.0) as client:
        try_urls = [GPU_SERVER]
        # Add smart fallback if path looks like /detect or /predict or has no path
        try:
            from urllib.parse import urlparse, urlunparse
            parsed = urlparse(GPU_SERVER)
            path = parsed.path or ''
            if path.endswith('/detect'):
                alt = urlunparse(parsed._replace(path=path[:-7] + '/predict'))
                try_urls.append(alt)
            elif path.endswith('/predict'):
                alt = urlunparse(parsed._replace(path=path[:-8] + '/detect'))
                try_urls.append(alt)
            elif path == '' or path == '/':
                # Try both common paths
                try_urls.extend([
                    urlunparse(parsed._replace(path='/detect')),
                    urlunparse(parsed._replace(path='/predict')),
                ])
        except Exception:
            pass

        last_response: httpx.Response | None = None
        for url in try_urls:
            r = await client.post(url, files=files, data=data)
            last_response = r
            if r.status_code != 404:
                break

    # Return upstream response
    return Response(
        content=(last_response.content if last_response else b''),
        status_code=(last_response.status_code if last_response else 502),
        media_type=r.headers.get("content-type", "application/json"),
    )


