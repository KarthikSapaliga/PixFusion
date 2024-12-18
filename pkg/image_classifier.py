import torch
import numpy as np
from PIL import Image
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity
from transformers import CLIPProcessor, CLIPModel
import sys

# Initialize the CLIP model and processor
model = CLIPModel.from_pretrained("zer0int/CLIP-GmP-ViT-L-14")
processor = CLIPProcessor.from_pretrained("zer0int/CLIP-GmP-ViT-L-14")

# Define categories (labels) for classification
categories = [
    "Animals & Wildlife",  
    "Landscapes & Nature",  
    "People & Portraits",  
    "Food & Beverages",  
    "Buildings & Architecture",  
    "Vehicles & Transportation",  
    "Sports & Fitness",  
    "Technology & Gadgets",  
    "Clothing & Fashion",  
    "Space & Astronomy",  
    "Art & Creativity",
    "Abstract & Patterns",   
    "Events & Celebrations",  
    "Historical & Cultural",
]

# Function to extract image features
def extract_image_features(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        image_features = model.get_image_features(**inputs)
    return image_features.squeeze().numpy()

# Function to load images and extract their features
def load_images_and_extract_features(image_dir, feature_dir):
    image_paths = list(Path(image_dir).glob("*.jpg"))
    feature_list = []
    for image_path in image_paths:
        feature_path = feature_dir / f"{image_path.stem}.npy"
        if feature_path.exists():
            feature = np.load(feature_path)
        else:
            feature = extract_image_features(image_path)
            np.save(feature_path, feature)
        feature_list.append(feature)
    
    feature_matrix = np.vstack(feature_list) if feature_list else np.empty((0, model.config.projection_dim))
    return image_paths, feature_matrix

# Function to extract features for a text query (category labels)
def extract_text_features(text_query):
    inputs = processor(text=[text_query], return_tensors="pt")
    with torch.no_grad():
        text_features = model.get_text_features(**inputs)
    return text_features.squeeze().numpy()

# Function to classify images based on text labels
def classify_images(image_features, category_features):
    similarities = cosine_similarity(image_features, category_features)
    predicted_indices = np.argmax(similarities, axis=1)
    
    # Map predicted indices to category names
    predicted_labels = [categories[index] for index in predicted_indices]
    return predicted_labels

# Main function to process images, classify them, and launch PyQt app
def getClassifiedImagesData():
    image_dir = "static/img/"  
    feature_dir = Path("static/features")

    image_paths, image_features = load_images_and_extract_features(image_dir, feature_dir)
    image_paths = [path.as_posix() for path in image_paths]

    category_features = np.array([extract_text_features(category) for category in categories])

    predicted_labels = classify_images(image_features, category_features)

    grouped_dict={}
    for img, label in zip(image_paths, predicted_labels):
        if label not in grouped_dict:
            grouped_dict[label] = []
        grouped_dict[label].append(img)

    grouped_list=[{'category_name': category, 'img_list': images} for (category,images) in grouped_dict.items()]
    return grouped_list

if __name__ == "__main__":
    result = getClassifiedImagesData()
    import json

    print(json.dumps(result,indent=4))
