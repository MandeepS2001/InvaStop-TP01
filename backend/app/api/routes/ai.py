"""
AI Plant Identification API Routes

This module handles plant identification requests by proxying image uploads
to an external GPU server running a machine learning model. The backend acts
as a secure proxy to hide the GPU server details from the frontend.

Key Features:
- Image validation and size limits
- Content type checking
- Automatic endpoint fallback (/detect vs /predict)
- Serverless deployment compatibility
"""

from fastapi import APIRouter, UploadFile, Response, Query
from fastapi.responses import JSONResponse
import os
import httpx
from app.core.config import settings

# Initialize FastAPI router for AI-related endpoints
router = APIRouter(prefix="/ai", tags=["ai"])

# GPU inference server configuration
# This server runs the actual plant identification model
# The backend proxies requests to keep the GPU server URL hidden from frontend
GPU_SERVER = os.getenv(
    "GPU_SERVER_URL",
    # Default team model endpoint (POST), path is /detect (not /predict)
    "http://ec2-54-252-175-180.ap-southeast-2.compute.amazonaws.com/detect",
)


@router.get("/ping")
async def ping():
    """
    Health check endpoint for the AI service.
    
    Returns:
        dict: Status confirmation that the AI service is running
    """
    return {"status": "ok"}

@router.post("/predict")
async def proxy_predict(img: UploadFile, model: str | None = Query(default=None)):
    """
    Proxy plant identification requests to the GPU inference server.
    
    This endpoint acts as a secure proxy between the frontend and the GPU server,
    handling image validation, size limits, and automatic endpoint fallback.
    
    Args:
        img (UploadFile): The uploaded image file for plant identification
        model (str, optional): Specific model to use for prediction
        
    Returns:
        Response: The GPU server's prediction response or error
        
    Raises:
        415: Unsupported media type
        413: File too large
        502: GPU server unavailable
    """
    
    # === IMAGE VALIDATION ===
    # Check if the uploaded file is an allowed image type
    allowed_types = set(settings.ALLOWED_IMAGE_TYPES)
    if img.content_type not in allowed_types:
        return JSONResponse(
            status_code=415,
            content={
                "detail": f"Unsupported media type: {img.content_type}. Allowed: {sorted(list(allowed_types))}"
            },
        )

    # === FILE SIZE VALIDATION ===
    # Enforce serverless-friendly size limit (min of configured MAX_FILE_SIZE and 4MB Vercel limit)
    # This prevents memory issues in serverless deployments
    serverless_limit = int(os.getenv("SERVERLESS_FILE_LIMIT", str(4 * 1024 * 1024)))
    max_bytes = min(settings.MAX_FILE_SIZE, serverless_limit)

    # Determine uploaded file size without loading into memory for efficiency
    try:
        # Try to get file size by seeking to end (most efficient method)
        img.file.seek(0, os.SEEK_END)
        size_bytes = img.file.tell()
        img.file.seek(0)  # Reset file pointer
    except Exception:
        # Fallback: read to measure (should be rare, only if seeking fails)
        data = await img.read()
        size_bytes = len(data)
        await img.seek(0)  # Reset file pointer

    # Check if file exceeds size limit
    if size_bytes > max_bytes:
        return JSONResponse(
            status_code=413,
            content={
                "detail": "File too large",
                "max_bytes": max_bytes,
                "received_bytes": size_bytes,
            },
        )

    # === PREPARE REQUEST DATA ===
    # Ensure we start at the beginning of the uploaded file
    await img.seek(0)
    
    # Format file data for the GPU server request
    files = {
        "img": (
            img.filename,
            img.file,
            img.content_type or "application/octet-stream",
        )
    }

    # Add optional model parameter if specified
    data = {}
    if model:
        data["model"] = model
    
    # === SMART ENDPOINT FALLBACK ===
    # Try the configured URL first; on 404, retry alternate path (/detect <-> /predict)
    # This handles cases where the GPU server endpoint might be different
    async with httpx.AsyncClient(timeout=60.0) as client:
        try_urls = [GPU_SERVER]
        
        # Add smart fallback if path looks like /detect or /predict or has no path
        try:
            from urllib.parse import urlparse, urlunparse
            parsed = urlparse(GPU_SERVER)
            path = parsed.path or ''
            
            # Generate alternative URLs based on common endpoint patterns
            if path.endswith('/detect'):
                alt = urlunparse(parsed._replace(path=path[:-7] + '/predict'))
                try_urls.append(alt)
            elif path.endswith('/predict'):
                alt = urlunparse(parsed._replace(path=path[:-8] + '/detect'))
                try_urls.append(alt)
            elif path == '' or path == '/':
                # Try both common paths if no specific path is set
                try_urls.extend([
                    urlunparse(parsed._replace(path='/detect')),
                    urlunparse(parsed._replace(path='/predict')),
                ])
        except Exception:
            # If URL parsing fails, continue with just the original URL
            pass

        # === MAKE REQUEST TO GPU SERVER ===
        last_response: httpx.Response | None = None
        for url in try_urls:
            try:
                r = await client.post(url, files=files, data=data)
                last_response = r
                # If we get a successful response (not 404), use it
                if r.status_code != 404:
                    break
            except Exception as e:
                # Log error but continue to next URL if available
                print(f"Error connecting to {url}: {e}")
                continue

    # === RETURN RESPONSE ===
    # Return the GPU server's response directly to the frontend
    # This maintains the original response format and status codes
    return Response(
        content=(last_response.content if last_response else b''),
        status_code=(last_response.status_code if last_response else 502),
        media_type=r.headers.get("content-type", "application/json") if last_response else "application/json",
    )


