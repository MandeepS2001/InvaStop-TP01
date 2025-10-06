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
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(GPU_SERVER, files=files, data=data)

    return Response(
        content=r.content,
        status_code=r.status_code,
        media_type=r.headers.get("content-type", "application/json"),
    )


