import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import './styles/variables.css'
import './styles/base.css'
import './styles/chrome.css'
import './styles/projects.css'
import './styles/illustrations.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
