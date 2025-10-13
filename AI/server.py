from typing import Union
import os, shutil

from fastapi import FastAPI, status, File, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI(redoc_url=None, docs_url=None)

@app.post("/predict")
def detect(img: UploadFile, model:str=None):
    """
    Use a model `model` to do the object detection job.
    Default model: os.environ["DEFAULT_MODEL"]

    TODO: Only allow requests from main server IP, listed in os.environ["WHITELIST"]
    """
    payload = {} # JSON response payload

    # TODO: Only allow requests from main server IP, listed in os.environ["WHITELIST"]
    # TODO: Add rate control

    # Check if the model exists
    if model is None:
        model = os.environ.get("DEFAULT_MODEL")
    print(f"model={model}")
    if (model is None) or (not os.path.exists(model)):
        payload["error"] = "Model is not available."
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content=payload)

    # Do the detection
    from run import predict
    with open(img.filename, "wb") as f:
        f.write(img.file.read())
    print(f"Start predicting: <{img.filename}> with model [{model}].")
    payload = predict(model=model, img=img.filename, visualize=False)
    os.remove(img.filename)

    return JSONResponse(status_code=status.HTTP_200_OK, content=payload)

if __name__ == "__main__":
    import uvicorn
    os.environ["DEFAULT_MODEL"]=os.environ.get("DEFAULT_MODEL", "latest.pt")
    uvicorn.run(app, host="localhost", port=55219)
