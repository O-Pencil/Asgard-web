/**
 * [WHO]: Provides React application entry point, mounts App component to DOM root element with StrictMode
 * [FROM]: Depends on React for StrictMode and createRoot, wired-elements for web components, App component for main app
 * [TO]: Invoked by browser when index.html loads, serves as single entry point for entire frontend
 * [HERE]: packages/web/src/main.jsx - Application entry point; initializes React and mounts root component
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'wired-elements'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
