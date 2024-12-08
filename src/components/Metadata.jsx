import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import './Metadata.css'

import { BiSolidCloudUpload } from "react-icons/bi";
import ReactLoading from 'react-loading';

const Metadata = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [originalMetadata, setOriginalMetadata] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [cleanedFileUrl, setCleanedFileUrl] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setLoading(true)
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
        } catch (err) {
            setError("Error fetching data: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="metadata-stripper">
            <div className="image-select">
                <input type="file" onChange={handleFileChange} id='fileInput' />
                <label htmlFor="fileInput">
                    <BiSolidCloudUpload size={120} />
                    <h1>Upload the Image</h1>
                </label>

            </div>
            {selectedFile && (
                <button onClick={handleUpload}>Process Metadata</button>
            )}

            {loading && (
                <div className='loading'>
                    <ReactLoading type='bars' color={"#aaa"} width={80} />
                </div>
            )}
            
            {error && <div className='error'>{error}</div>}

            { metadata && (
                <div className="metadata-container">
                    <div className="original-metadata">
                        <h1>Original Metadata</h1>
                        <pre>
                            {originalMetadata}
                        </pre>
                    </div>
                    <div className="cleaned-metadata">
                        <h1>
                            <>Cleaned Metadata</>
                            {cleanedFileUrl && (
                                <a href={downloadUrl} download="cleaned">Download Cleaned Image</a>
                            )}
                        </h1>
                        <pre>
                            {metadata}
                        </pre>
                    </div>
                </div>
            ) }
        </div>
    )
}

export default Metadata