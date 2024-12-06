import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import './Metadata.css'

import { FaCloudUploadAlt } from "react-icons/fa";

const Metadata = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [originalMetadata, setOriginalMetadata] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [cleanedFileUrl, setCleanedFileUrl] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post("http://localhost:5000/metdata-stripper", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { original_metadata, metadata_preview, cleaned_file_path } = response.data;

            setOriginalMetadata(original_metadata);
            setMetadata(metadata_preview);
            const filename = cleaned_file_path.split("/").pop();
            setCleanedFileUrl(filename);
            setDownloadUrl(filename);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        }
    };

    return (
        <div id="metadata-stripper">
            <div className="image-select">
                <div className="select">
                    <input type="file" onChange={handleFileChange} id='fileInput' />
                    <label htmlFor="fileInput">
                        <div>
                            <FaCloudUploadAlt size={300} />
                            <span>Upload the Image</span>
                        </div>
                    </label>
                    { selectedFile && (
                        <button onClick={handleUpload}>Process Metadata</button>
                    ) }
                </div>
            </div>
            <div className="view-metadata">
                <div className="prev-metadata">
                    <h1>Original Metadata</h1>
                    <pre>{originalMetadata}</pre>
                </div>
                <div className="cleaned-metadata">
                    <h1>
                        <span>Cleaned Metadata</span>
                        {cleanedFileUrl && (
                            <a href={downloadUrl} download="cleaned">Download</a>
                        )}
                    </h1>
                    <pre>{metadata}</pre>
                </div>
            </div>
        </div>
    )
}

export default Metadata