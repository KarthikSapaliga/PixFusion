import torch
from transformers import AutoProcessor, AutoModelForZeroShotImageClassification
import faiss
import numpy as np
from multiprocessing import Pool
import os
from pathlib import Path
from PIL import Image

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

processor = AutoProcessor.from_pretrained("zer0int/CLIP-GmP-ViT-L-14")
model = AutoModelForZeroShotImageClassification.from_pretrained("zer0int/CLIP-GmP-ViT-L-14")

# Directory for storing features
feature_dir = Path("static/features")
feature_dir.mkdir(exist_ok=True)

def extract_image_features(image_path):
    print(f"Extracting features for image: {image_path}")  
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        image_features = model.get_image_features(**inputs)
    return image_features.squeeze().numpy()

def load_images_and_extract_features(image_dir):
    print(f"Loading images from directory: {image_dir}")  
    image_paths = list(Path(image_dir).glob("*.jpg"))
    print(f"Found {len(image_paths)} images.")  
    
    feature_list = []
    for image_path in image_paths:
        feature_path = feature_dir / f"{image_path.stem}.npy"
        if feature_path.exists():
            feature = np.load(feature_path)
        else:
            feature = extract_image_features(image_path)
            np.save(feature_path, feature)
            print(f"Saved features for {image_path}.")  
        feature_list.append(feature)
    feature_matrix = np.vstack(feature_list) if feature_list else np.empty((0, model.config.projection_dim))
    print(f"Feature matrix shape: {feature_matrix.shape}")  
    return image_paths, feature_matrix

def extract_text_features(text_query):
    inputs = processor(text=[text_query], return_tensors="pt")
    with torch.no_grad():
        text_features = model.get_text_features(**inputs)
    return text_features.squeeze().numpy()

def create_faiss_index(feature_matrix):
    index = faiss.IndexFlatL2(feature_matrix.shape[1])
    index.add(feature_matrix.astype('float32'))
    return index

image_dir = "static/img"
image_paths, feature_matrix = load_images_and_extract_features(image_dir)

if feature_matrix.shape[0] > 0:
    index = create_faiss_index(feature_matrix)
else:
    print("No features extracted. Index is None.")  
    index = None

def search_similar_images(text_query, top_k=5):
    query_embedding = extract_text_features(text_query).reshape(1, -1).astype('float32')
    distances, indices = index.search(query_embedding, top_k)
    similar_images = [(image_paths[idx].as_posix(), float(distances[0][i])) for i, idx in enumerate(indices[0]) if idx < len(image_paths)]
    return similar_images

if __name__ == "__main__":
    print(search_similar_images(input("Query: "),12))
