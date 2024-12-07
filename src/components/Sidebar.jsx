import { useState } from 'react'
import "./Sidebar.css"

import { HiMenu } from "react-icons/hi";
import { BiHome } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";
import { BiCategory } from "react-icons/bi";
import { BiShield } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";

const Sidebar = ({ handleSectionChange, activeSection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen((isOpen) => !isOpen);

    return (
        <section className={`sidebar-container ${isOpen ? 'open' : 'close'}`}>
            <div className='title-section'>
                <h1>PixFusion</h1>
                <HiMenu className='sidebar-toggle-btn' onClick={toggleSidebar} size={30} />
            </div>
            <ul>
                <li onClick={()=>handleSectionChange('home')} className={activeSection==='home'?'active-section':''}>
                    <div>
                        <BiHome className='icons' />
                        <span>Home</span>
                    </div>
                </li>
                <li onClick={() => handleSectionChange('search')} className={activeSection === 'search' ? 'active-section' : ''}>
                    <div>
                        <BiSearch className='icons' />
                        <span>Search</span>
                    </div>
                </li>
                <li onClick={() => handleSectionChange('categorizer')} className={activeSection === 'categorizer' ? 'active-section' : ''}>
                    <div>
                        <BiCategory className='icons' />
                        <span>Categorize</span>
                    </div>
                </li>
                <li onClick={() => handleSectionChange('metadata-stripper')} className={activeSection === 'metadata-stripper' ? 'active-section' : ''}>
                    <div>
                        <BiShield className='icons' />
                        <span>Metadata Strip</span>
                    </div>
                </li>
            </ul>
            <div onClick={() => handleSectionChange('settings')} className={activeSection === 'settings' ? 'settings active-section' : 'settings'}>
                
                    <IoSettingsOutline className='icons' />
                    <span>Settings</span>
             
            </div>
        </section>
    )
}

export default Sidebar