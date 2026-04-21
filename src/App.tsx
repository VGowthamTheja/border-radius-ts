import { useState } from 'react';
import './App.css'
import BorderRadiusPreviewer from './components/BorderRadiusPreviewer'

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="header">
        <h1>Border Radius Previewer</h1>
        <span onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      </div>
      <BorderRadiusPreviewer />
    </div>
  )
}

export default App
