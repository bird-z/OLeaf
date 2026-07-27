import { StrictMode , useState,useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import Mapp from './Mapp.jsx'



// const promise2 = axios.get('http://localhost:3001/0/url')
// console.log(promise2)

// const promise3 = axios.get('http://localhost:3001/0/flow')
// console.log(promise3)

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Mapp/>
  </StrictMode>,
)
