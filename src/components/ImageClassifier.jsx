import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios'
import ReactLoading from 'react-loading';

import './ImageClassifier.css'

const ImageClassifier = () => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/classifier")
            .then((response) => {
                setCategory(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching images:", err);
                setError("Failed to load images");
                setLoading(false);
            });
    }, []);

    if (loading) return <div>
        <ReactLoading type='spin'/>
    </div>;
    if (error) return <div className='error'>{error}</div>;

    return (
        <div id='categorizer'>
            <h1>Image Categorizer</h1>
            {category && category.map(({ category_name, img_list }) => (
                <div key={category_name} className='category'>
                    <h1>{category_name}</h1>
                    <div>
                        {img_list.map((img) => (
                            <img
                                src={img}
                                key={img}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ImageClassifier