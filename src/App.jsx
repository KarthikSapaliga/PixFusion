import { useState } from 'react'

import Sidebar from './components/Sidebar'
import Main from './components/Main'

import './App.css'

const App = () => {
	const [activeSection, setActiveSection] = useState('home')

	const handleSectionChange = (section) => setActiveSection(section);

	return (
		<main>
			<Sidebar handleSectionChange={handleSectionChange} activeSection={activeSection}/>
			<Main handleSectionChange={handleSectionChange} activeSection={activeSection} />
		</main>
	)
}

export default App