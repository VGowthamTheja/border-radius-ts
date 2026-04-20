import './App.css'
import BorderRadiusPreviewer from './components/BorderRadiusPreviewer'

function App() {
  return (
    <div className="App">
      <h1>Welcome to Border Radius Previewer</h1>
      <p>Use the controls below to adjust the border radius of the preview box.</p>
      <BorderRadiusPreviewer />
    </div>
  )
}

export default App
