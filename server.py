import os
import shutil
import subprocess
import tempfile
import time
import platform
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pkg.metadata_cleaner import clean_metadata  

app = Flask(__name__)
CORS(app)

@app.route("/metdata-stripper", methods=["POST"])
def upload_file():

    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    file_path = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
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
