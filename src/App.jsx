import Mapp from './Mapp.jsx'
import Nav from './components/MainCp/Nav.jsx'
import Slogan from './components/MainCp/Slogan.jsx'
import About from './components/MainCp/About.jsx'
import Studios from './components/MainCp/Studios.jsx'
import Members from './components/MainCp/Members.jsx'
import Join from './components/MainCp/Join.jsx'
import Footer from './components/MainCp/Footer.jsx'
import './App.css'
import './components/CardNav.css'
function App() {
  return (
    <div className="App">
      <Nav />
      <Slogan />
      <About />
      <Studios />
      <Members />
      <Join />
      <Footer />
    </div>
  )
}

export default App