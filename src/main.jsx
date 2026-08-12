import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


// const promise2 = axios.get('http://localhost:3001/0/url')
// console.log(promise2)

// const promise3 = axios.get('http://localhost:3001/0/flow')
// console.log(promise3)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
