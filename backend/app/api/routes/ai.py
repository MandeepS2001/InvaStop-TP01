from fastapi import APIRouter, UploadFile, Response, Query
import os
import httpx

router = APIRouter(prefix="/ai", tags=["ai"])

# Public GPU inference server - proxied via backend so the GPU host stays hidden
GPU_SERVER = os.getenv(
    "GPU_SERVER_URL",
    # Team model endpoint (POST), path is /detect (not /predict)
    "http://ec2-54-252-175-180.ap-southeast-2.compute.amazonaws.com/detect",
)


@router.post("/predict")
async def proxy_predict(img: UploadFile, model: str | None = Query(default=None)):
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


