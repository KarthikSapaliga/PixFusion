import os
import subprocess
import shutil
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from pkg.metadata_cleaner import clean_metadata  
from pkg.image_classifier import getClassifiedImagesData
from pkg.img_search import search_similar_images

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return '''
    <center>
        <h1 style="color:green; font-size: 4em; margin-top:50px">
            Server is running...
        </h1>
    </center>
    '''

@app.route('/all-images',methods=['GET'])
def get_all_images():
    IMAGE_FOLDER = 'static/img'
    try:
        image_files = [img for img in os.listdir(IMAGE_FOLDER) if os.path.isfile(os.path.join(IMAGE_FOLDER, img))]
        image_urls = [f"{img}" for img in image_files]
        return jsonify(image_urls)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/search", methods=["POST"])
def img_search():
    data = request.get_json()
    text_query = data.get("query", "")

    if not text_query or index is None:
        return jsonify({"results": []})

    results = search_similar_images(text_query, 10)
    return jsonify({"results": results})


@app.route('/classifier', methods=['GET'])
def get_images():
    data = getClassifiedImagesData()
    return jsonify(data)

@app.route("/metdata-stripper", methods=["POST"])
def upload_file():

    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    # Ensure the uploads directory exists
    os.makedirs("uploads", exist_ok=True)

    # Debug print to verify folder path
    print(f"Uploads folder path: {os.path.abspath('uploads')}")

    # Remove all files and folders in the uploads directory
    for filename in os.listdir("uploads"):
        file_path = os.path.join("uploads", filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"Deleted file: {file_path}")
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
                print(f"Deleted folder: {file_path}")
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")


    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    try:
        result = subprocess.run(["exiftool", file_path], capture_output=True, text=True)
        original_metadata = result.stdout
    except Exception as e:
        return jsonify({"error": f"Failed to read original metadata: {e}"}), 500
    
    cleaned_file_path, metadata_preview = clean_metadata(file_path)

    if cleaned_file_path:
        response = {
            "message": "Metadata cleaned successfully",
            "original_metadata": original_metadata,
            "metadata_preview": metadata_preview,
            "cleaned_file_path": cleaned_file_path
        }
        return jsonify(response), 200
    else:
        return jsonify({"error": "Failed to clean metadata"}), 500
    



if __name__ == "__main__":
    app.run(debug=True)
