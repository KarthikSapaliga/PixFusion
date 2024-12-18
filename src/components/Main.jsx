import "./Main.css";

import Search from "./Search";
import Metadata from "./Metadata";
import ImageClassifier from "./ImageClassifier";
import AllImages from "./AllImages";

import { BiSearch } from "react-icons/bi";
import { IoMdImages } from "react-icons/io";
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
                        <div className="all-images">
                            <IoMdImages size={75} className="icons" />
                            <h1>All Images</h1>
                            <p>Access and browse your entire image collection in one place with ease.</p>
                            <button onClick={() => handleSectionChange("allImages")}>Click here</button>
                        </div>
                        <div className="categorizer">
                            <MdCategory size={75} className="icons" />
                            <h1>Image Classification</h1>
                            <p>Organize and categorize your images instantly with advanced AI for better management.</p>
                            <button onClick={() => handleSectionChange("categorizer")}>Click here</button>
                        </div>
                        <div className="metadat-stripper">
                            <MdSecurity size={75} className="icons" />
                            <h1>Metadata Stripping</h1>
                            <p>Remove sensitive metadata from your images to protect your privacy and simplify sharing.</p>
                            <button onClick={() => handleSectionChange("metadata-stripper")}>Click here</button>
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
