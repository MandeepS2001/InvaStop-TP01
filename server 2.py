from typing import Union
import os

from fastapi import FastAPI, status, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"service": "ai-predict", "endpoints": ["POST /predict", "GET /health"]}

@app.post("/predict")
async def predict(img: UploadFile, model:str=None, remove:bool=True):
    """
    Use a model `model` to do the object detection job.
    model(str, Default: os.environ["DEFAULT_MODEL"]): path to the model file.
    remove(bool, default: True): whether to delete the image file after predtion is finished.
    

    TODO: Only allow requests from main server IP, listed in os.environ["WHITELIST"]
    """
    payload = {} # JSON response payload

    # TODO: Only allow requests from main server IP, listed in os.environ["WHITELIST"]
    # TODO: Add rate control

    # Check if the model exists
    if model is None:
        model = os.environ.get("DEFAULT_MODEL")
    if (model is None) or (not os.path.exists(model)):
        payload["error"] = "Model is not available."
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content=payload)

    # Do the detection
    from run import predict
    with open(img.filename, "wb") as f:
        f.write(await img.read())
    print(f"Start predicting: <{img.filename}> with model [{model}].")
    payload = predict(model=model, img=img.filename, visualize=False)
    if remove:
        os.remove(img.filename)

    return JSONResponse(status_code=status.HTTP_200_OK, content=payload)

if __name__ == "__main__":
    import uvicorn
    os.environ["DEFAULT_MODEL"] = os.environ.get("DEFAULT_MODEL", "main_yolo11m_e50_b16.pt")
    port = int(os.environ.get("AI_PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)
