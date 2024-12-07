import "./Main.css";

import Search from "./Search";
import Metadata from "./Metadata";
import ImageClassifier from "./ImageClassifier";
import AllImages from "./AllImages";

import { BiSearch } from "react-icons/bi";
import { IoImages } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { MdSecurity } from "react-icons/md";


const Main = ({ handleSectionChange, activeSection }) => {
    return (
        <div className="container">
            {activeSection === "home" && (
                <div id="home">
                    <div
                        className="search-box"
                        onClick={() => handleSectionChange("search")}
                    >
                        <BiSearch size={20}/>
                        <span>Search here...</span>
                    </div>
                    <div className="feature-container">
                        <div
                            className="all-images"
                            onClick={() => handleSectionChange("allImages")}
                        >
                            <IoImages size={60} />
                            <h1>All Images</h1>
                        </div>
                        <div
                            className="categorizer"
                            onClick={() => handleSectionChange("categorizer")}
                        >
                            <MdCategory size={60} />
                            <h1>Categorize</h1>
                        </div>
                        <div
                            className="metadat-stripper"
                            onClick={() => handleSectionChange("metadata-stripper")}
                        >
                            <MdSecurity size={60} />
                            <h1>Metadata Stripp</h1>
                        </div>
                    </div>
                </div>
            )}
            {activeSection === "allImages" && (
                <div id="all-images">
                    <div className="header">
                        <button onClick={() => handleSectionChange("home")}>Back</button>
                        <h1>All Images</h1>
                    </div>
                    <AllImages />
                </div>
            )}
            {activeSection === "search" && (
                <Search />
            )}
            {activeSection === "categorizer" && (
                <ImageClassifier />
            )}
            {activeSection === "metadata-stripper" && (
                <Metadata />
            )}
            {activeSection === "settings" && (
                <div>
                    <h1>Settings</h1>
                </div>
            )}
        </div>
    );
};

export default Main;
