import { BiSearch } from "react-icons/bi";

const Main = ({ handleSectionChange, activeSection }) => {
    return (
        <div className='container'>
            { activeSection==='home' && (
                <div id="home">
                    <div className="search-box">
                        <BiSearch />
                        <span>Search here...</span>
                    </div>
                    <div className="all-images">All Images</div>
                    <div className="categorize">Categorize</div>
                    <div className="metadat-stripp">Metadata</div>
                </div>
            ) }
            { activeSection==='search' && (
                <div id="search">
                    <h1>Search</h1>
                </div>
            ) }
            { activeSection==='categorizer' && (
                <div id="categorizer">
                    <h1>Categorizer</h1>
                </div>
            ) }
            { activeSection==='metadata-stripper' && (
                <div id="metadata-stripper">
                    <h1>Metadata Stripper</h1>
                </div>
            ) }
            { activeSection==='settings' && (
                <div>
                    <h1>Settings</h1>
                </div>
            ) }
        </div>
    )
}

export default Main