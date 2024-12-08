import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from 'react-loading';

import './AllImages.css'

const AllImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch images from the API
        axios
            .get("http://localhost:5000/all-images")
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    setImages(response.data); // Assuming response.data is an array of image URLs
                } else {
                    setError("Unexpected data format received");
                }
            })
            .catch((err) => {
                setError("Error fetching images: " + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="image-conatiner">
            {loading && <div><ReactLoading type='spin' /></div>}
            {error && <div className="error">{error}</div>}
            {images.map((image, index) => (
                <img
                    key={index}
                    src={`static/img/${image}`}
                    alt={`Image ${index + 1}`}
                />

            ))}
        </div>
    );
};

export default AllImages