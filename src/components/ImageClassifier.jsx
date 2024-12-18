import React from 'react'
import { useState,useEffect,useRef } from 'react';
import axios from 'axios'
import ReactLoading from 'react-loading';

import './ImageClassifier.css'

const ImageClassifier = () => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const categoryRefs = useRef({})

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

    const scrollToCategory = (categoryName) => {
        if (categoryRefs.current[categoryName]) {
            categoryRefs.current[categoryName].scrollIntoView({ behavior: "smooth" });
        }
    }; 

    if (loading) return <div>
        <ReactLoading type='spin'/>
    </div>;
    if (error) return <div className='error'>{error}</div>;

    return (
        <div id='categorizer'>
            <h1>Image Categorizer</h1>
            {/* Buttons to scroll to categories */}
            <div className="category-buttons">
                {category.map(({ category_name }) => (
                    <button
                        className='goto-btns'
                        key={category_name}
                        onClick={() => scrollToCategory(category_name)}
                        >
                        {category_name}
                    </button>
                ))}
            </div>
            {/* Display categories */}
            {category && category.map(({ category_name, img_list }) => (
                <div key={category_name} className='category'>
                    <h1 ref={(ele) => (categoryRefs.current[category_name] = ele)}>{category_name}</h1>
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