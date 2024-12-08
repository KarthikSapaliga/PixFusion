import React from 'react'
import { useState,useEffect,useRef } from 'react';
import axios from 'axios'

import './Search.css'
import ReactLoading from 'react-loading';

const Search = () => {

    const input = useRef(null);

    useEffect(()=>{
        input.current.focus();
    },[])

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/search", {
                query,
            });
            setResults(response.data.results);
        } catch (error) {
            setError("Error fetching search results: "+ error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id='search'>
            <div className='searchbar'>
                <input
                    ref={input}
                    type="text"
                    placeholder="Enter your query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="results">
                {loading && <ReactLoading type='spin' /> }
                {error && <div className='error'>{error}</div>}
                {results.map((result, index) => (
                    <img src={`http://127.0.0.1:5000/${result[0]}`} alt="Result" key={index}/>
                ))}
            </div>
        </div>
    );
}

export default Search