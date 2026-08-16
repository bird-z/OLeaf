import Nav from '../components/MainCp/Nav.jsx'
import Slogan from '../components/MainCp/Slogan.jsx'
import About from '../components/MainCp/About.jsx'
import Studios from '../components/MainCp/Studios.jsx'
import Members from '../components/MainCp/Members.jsx'
import Join from '../components/MainCp/Join.jsx'
import Footer from '../components/MainCp/Footer.jsx'
import ClickSpark from '../components/ClickSpark.jsx'

/* 主站单页：整页翻屏的五个区块 */
function Home() {
  return (
    <ClickSpark sparkSize={9} sparkRadius={26} sparkCount={10}>
      <div className="App">
        <Nav />
        <Slogan />
        <About />
        <Studios />
        <Members />
        <Join />
        <Footer />
      </div>
    </ClickSpark>
  )
}

export default Home
