import { BiSearch } from "react-icons/bi";
import "./Main.css";

import Search from "./Search";
import Metadata from "./Metadata";
import ImageClassifier from "./ImageClassifier";
import AllImages from "./AllImages";


const Main = ({ handleSectionChange, activeSection }) => {
    return (
        <div className="container">
            {activeSection === "home" && (
                <div id="home">
                    <div
                        className="search-box"
                        onClick={() => handleSectionChange("search")}
                    >
                        <BiSearch />
                        <span>Search here...</span>
                    </div>
                    <div className="feature-container">
                        <div 
                            className="all-images"
                            onClick={() => handleSectionChange("allImages")}
                        >All Images</div>
                        <div
                            className="categorizer"
                            onClick={() => handleSectionChange("categorizer")}
                        >
                            Categorize
                        </div>
                        <div
                            className="metadat-stripper"
                            onClick={() => handleSectionChange("metadata-stripper")}
                        >
                            Metadata
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
