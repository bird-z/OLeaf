import Mapp from './Mapp.jsx'
import Nav from './components/MainCp/Nav.jsx'
import Slogan from './components/MainCp/Slogan.jsx'
import About from './components/MainCp/About.jsx'
import ScrollExpand from './components/ScrollExpand.jsx'
import hackathonImg from './assets/hackathon.jpg'
import { useFullpage } from './components/MainCp/useFullpage.js'
import './App.css'
import './components/CardNav.css'
function App() {
  useFullpage()
  return (
    <div className="App">
      <Nav />
      <Slogan />
      <ScrollExpand
        src={hackathonImg}
        alt="生物启扉协会成员在第一届「黑客松」AI 创作大赛合影"
        title="生物启扉协会"
        scrollHint="向下滚动"
        useWindowScroll
      >
        <div className="scroll-expand__end">
          <p className="scroll-expand__statement">让科学走出课本，让热爱真正发生</p>
          <span className="scroll-expand__motto">Observe · Explore · Share</span>
        </div>
      </ScrollExpand>
      <About />
    </div>
  )
}

export default App