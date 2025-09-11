import os
import json

import requests as rq

DEFAULT_DATASET = 'raw'

## internal functions
def __convert(x1:float, y1:float, x2:float, y2:float, w:int, h:int) -> tuple:
    """
    Convert (x1, y1, x2, y2) to (x_center, y_center, width, height)
    """
    if x1 > x2:
        x1, x2 = x2, x1
    if y1 > y2:
        y1, y2 = y2, y1
    width = x2 - x1
    height = y2 - y1
    x_center = (x1 + width / 2)/w
    y_center = (y1 + height / 2)/h
    width /= w
    height /= h
    return x_center, y_center, width, height

## exported functions
def downloadImage(category, *urls, file:str=None, dataset:str=DEFAULT_DATASET):
    """
    Download an image, change its name to its category, save it.
    """
    from tqdm import tqdm
    category = category.replace(' ', '_').lower()

    # Decide its number
    next_num = 1
    for a, b, c in os.walk(dataset):
        for name in c:
            if name.startswith(category):
                num = int(name.split('_')[-1].split('.')[0])
                if num >= next_num:
                    next_num = num + 1

    # If a file is given, read urls from it
    if file is not None and os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f.readlines() if line.strip().startswith('http')]
    
    # Download the image first as now its extension is unknown
    # Flow download
    for no in range(len(urls)):
        url = urls[no]
        print(f"Downloading image[{no+1}] : {url}")

        with rq.get(url, stream=True) as resp:
            # Check if the response is ok
            resp.raise_for_status()

            # File size = ?
            chunk_size = int(resp.headers.get("content-length", -1))
            unit = "B"
            if 1024 <= chunk_size < 1024**2:
                chunk_size /= 1024
                unit = "KB"
            elif 1024**2 <= chunk_size < 1024**3:
                chunk_size /= 1024**2
                unit = "MB"
            print(f"Total file size: {chunk_size:.2f} {unit}")

            # Download with progress bar
            raw_filename = os.path.join(dataset, url.split("/")[-1])
            with open(raw_filename, "wb") as file, tqdm(
                desc=raw_filename,
                total=chunk_size,
                unit="B",
                unit_scale=True,
                unit_divisor=1024,
            ) as bar:
                for chunk in resp.iter_content(chunk_size=1024):
                    size = file.write(chunk)
                    bar.update(size)
            
            # Rename the image
            ext = raw_filename.split('.')[-1]
            filename = os.path.join(dataset, f"{category}_{next_num}.{ext}")
            os.rename(raw_filename, filename)
            print(f"Image[{no+1}] has been saved as {filename}\n-----------\n")

            # Update the number
            next_num += 1
    
    return 0

def removeImageData(dataset:str=DEFAULT_DATASET):
    """
    Remove all image data in the json files in `dataset`.
    More precisely, the `"imageData"` field in each json file.
    """
    
    for a, b, c in os.walk(dataset):
        for name in c:
            if name.endswith('.json'):
                json_path = os.path.join(a, name)
                with open(json_path, 'r', encoding="utf-8") as f:
                    data = json.load(f)
                if "imageData" in data:
                    data["imageData"] = None
                with open(json_path, 'w', encoding="utf-8") as f:
                    json.dump(data, f)
                print(f"Removed imageData in {json_path}.")

def buildNDJson(dataset:str=DEFAULT_DATASET, update_file:str=None):
    """
    Build a ndjson file from all json files in `dataset`.
    Format of NDJson file:
        Row 1:
        {
            "type": "dataset",
            "task": "detect",
            "name": "Example",
            "description": "COCO NDJSON example dataset",
            "url": "https://app.ultralytics.com/user/datasets/example",
            "class_names": { "0": "person", "1": "bicycle", "2": "car" },
            "bytes": 426342,
            "version": 0,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:00Z"
        }
        
        Row 2~n:
        {
            "type": "image",
            "file": "image1.jpg",
            "url": "https://www.url.com/path/to/image1.jpg",
            "width": 640,
            "height": 480,
            "split": "train",
            "annotations": {
                "boxes": [
                    [0, 0.52481, 0.37629, 0.28394, 0.41832],
                    [1, 0.73526, 0.29847, 0.19275, 0.33691]
                ]
            }
        }
    
    See also: https://docs.ultralytics.com/zh/datasets/detect/?utm_source=chatgpt.com#__tabbed_2_1
    """
    import time
    if update_file is not None:
        # Update an existing ndjson file
        ndjson = json.load(open(update_file, 'r', encoding='utf-8'))
    else:
        # Create a new ndjson file
        ndjson = {
                "type": "dataset",
                "task": "detect",
                "name": dataset,
                "description": "COCO NDJSON example dataset",
                #"url": "https://app.ultralytics.com/user/datasets/example",
                "class_names": {},
                #"bytes": 426342,
                "version": 0,
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
        
    # Update timestamp
    ndjson["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    # Prepare what to write in
    contents = ""

    # Create label-id mapping
    labels = []

    # Iterate all json files in the dataset folder
    for a, b, c in os.walk(dataset):
        for name in c:
            if name.endswith('.json'):
                json_path = os.path.join(a, name)
                with open(json_path, 'r', encoding="utf-8") as f:
                    data = json.load(f)
                
                # Update this label to labels
                # It is ensured that there is at most one shape in each json file
                shapes = data.get("shapes", [{}])

                # Extend new labels to array `labels`.
                for s in shapes:
                    label = s.get("label")
                    if label not in labels:
                        labels.append(label)

                # Build an ndjson row
                entry = {
                    "type": "image",
                    "file": data.get("imagePath", ""),
                    "url": data.get("imageUrl", ""),
                    "width": data.get("imageWidth", 0),
                    "height": data.get("imageHeight", 0),
                    "annotations": {
                        "boxes": [[
                            labels.index(s.get("label")),
                            *__convert(
                                *s.get("points")[0], # x1, y1
                                *s.get("points")[1], # x2, y2
                                data["imageWidth"], data["imageHeight"]
                            ) # Change x1, y1, x2, y2 to x_center, y_center, width, height
                        ] for s in shapes ]
                    }, 
                }

                # Append to contents
                contents += json.dumps(entry, ensure_ascii=False) + '\n'
        
    # Update class_names
    ndjson["class_names"] = {str(i): name for i, name in enumerate(labels)}
    contents = json.dumps(ndjson, ensure_ascii=False) + '\n' + contents

    # Write to file
    ndjson_path = os.path.join(dataset, f"{dataset}.ndjson")
    with open(ndjson_path, 'w', encoding='utf-8') as f:
        f.write(contents)
    print("Complete. Preparing NDJson file...")
    prepareNDJson(dataset=dataset)

def prepareNDJson(dataset:str=DEFAULT_DATASET, train_ratio:float=0.85, val_ratio:float=0.15, test_ratio:float=0):
    """
    Prepare the dataset for training by creating train, val, test splits and building ndjson file.
    Mostly update the `split` field in each image entry in the ndjson file.
    """
    import random
    ndjson_path = os.path.join(dataset, f"{dataset}.ndjson")
    if not os.path.exists(ndjson_path):
        print(f"NDJson file {ndjson_path} does not exist. Please run `python3 tools.py buildNDJson` first.")
        return
    
    # Load the ndjson file
    with open(ndjson_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Now, each line is a json entry
    entries = [json.loads(line) for line in lines]
    header = entries.pop(0)

    # Shuffle the entries
    random.shuffle(entries)

    # Do the split
    trains = int(len(entries) * train_ratio)
    vals = int(len(entries) * val_ratio)
    tests = len(entries) - trains - vals
    train_entries = entries[:trains]
    val_entries = entries[trains:trains+vals]
    test_entries = entries[trains+vals:]
    print(f"Train: {len(train_entries)}, Val: {len(val_entries)}, Test: {len(test_entries)}")

    # Update the split field
    for entry in train_entries:
        entry['split'] = 'train'
    for entry in val_entries:
        entry['split'] = 'val'
    for entry in test_entries:
        entry['split'] = 'test'
    
    # Write back to ndjson file
    with open(ndjson_path, 'w', encoding='utf-8') as f:
        f.write(
            json.dumps(header, ensure_ascii=False) + '\n' +
            "\n".join(json.dumps(entry, ensure_ascii=False) for entry in train_entries + val_entries + test_entries) + '\n'
        )
    
def train(dataset:str=DEFAULT_DATASET, model_name:str="yolo11m", epochs:int=50, batch_size:int=16, img_size:int=640, project:str='detect', name:str='main'):
    """
    Train a model using the dataset.
    """
    from ultralytics import YOLO, settings

    # Config files
    yaml_path = os.path.join(dataset, f"{dataset}.yaml")
    ndjson_path = os.path.join(dataset, f"{dataset}.ndjson")

    # Check them one by one
    if os.path.exists(yaml_path):
        print(f" [ Using YAML config: {yaml_path} ]")
        config_path = yaml_path
    elif os.path.exists(ndjson_path):
        print(f" [ Using NDJson config: {ndjson_path} ]")
        config_path = ndjson_path
    
    # Load a model
    print(f" [ Loading model {model_name}.pt ... ]")
    model = YOLO(f"{model_name}.pt")  # load a pretrained model (recommended for training)
    print(" [ Complete. ]\n")

    # Train the model
    name = f"{name}_{model_name}_e{epochs}_b{batch_size}"
    print(f" [ Training with config: ] \n  dataset:\t {dataset}\n  config file:\t{config_path}\n  model:\t{model_name}\n  epochs:\t{epochs}\n  batch_size:\t{batch_size}\n  img_size:\t{img_size}\n  project:\t{project}\n  name:\t{name}")
    train_setting = {
        "data": config_path,
        "imgsz": img_size,
        "epochs": epochs,
        "batch": batch_size,
        "rect": True,
        "auto_augment": None,
        "erasing": 0.1,
        "mosaic": 0.5,
        "mixup": 0.0,
        "copy_paste": 0.0,
        "lr0": 0.003,
        "warmup_epochs": 5,
        "freeze": 10,
        "patience": 100,
        "plots": True,
        "project": project,
        "name": name,
    }
    try:
        model.train(**train_setting)

    except FileNotFoundError as e:
        # Cannot copy images; copy them manually
        # Read the ndjson file
        from shutil import copyfile, rmtree
        with open(ndjson_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        entries = [json.loads(line) for line in lines[1:]]
        for entry in entries:
            src = os.path.join(dataset, entry['file'])
            dst = os.path.join(settings["datasets_dir"], dataset, "images", entry["split"], entry['file'])
            copyfile(src, dst)
        # delete the config folder created by the first failed training in detect/
        rmtree(os.path.join(project, name), ignore_errors=True)

        # Now start training again
        model.train(**train_setting)

    print(f" [ Complete training task <{name}>. ]\n")

def predict(model, img, visualize:bool=True):
    """
    Do a prediction using a given model.
    If visualize=True, show the result after prediction finishes.
    """
    from PIL import Image, ImageDraw, ImageFont
    from ultralytics import YOLO

    im = Image.open(img)
    w, h = im.size
    model = YOLO(model)  # load a pretrained model (recommended for training)
    results = model.predict(source=im, conf=0.25, save=False, save_txt=False, save_crop=False, line_width=3, hide_labels=False, hide_conf=False, verbose=False)
    result = json.loads(results[0].to_json())

    if visualize:
        draw = ImageDraw.Draw(im)
        for pred in result:
            # Draw box
            #x_center, y_center, width, height = box
            #x1 = int((x_center - width/2) * w)
            #y1 = int((y_center - height/2) * h)
            #x2 = int((x_center + width/2) * w)
            #y2 = int((y_center + height/2) * h)
            box = pred["box"]
            x1 = int(box["x1"])
            x2 = int(box["x2"])
            y1 = int(box["y1"])
            y2 = int(box["y2"])
            draw.rectangle([x1, y1, x2, y2], outline="blue", width=3)

            # Write name and prob
            text = f"{pred['name']}({pred['class']}): {pred['confidence']:.2f}"
            font = ImageFont.truetype("arial.ttf", 16)
            draw.rectangle(draw.textbbox((x1,y1), text, font=font), fill="blue")
            draw.text((x1,y1), text, fill=(255,255,255), font=font)

        im.show()

    return result

if __name__ == "__main__":
    import fire
    fire.Fire()
