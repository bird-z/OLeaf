import QifSiteNav from '../components/QifSiteNav.jsx'
import NewsCarousel from '../components/MainCp/NewsCarousel.jsx'
import Slogan from '../components/MainCp/Slogan.jsx'
import About from '../components/MainCp/About.jsx'
import QifNewsSection from '../components/MainCp/QifNewsSection.jsx'
import Studios from '../components/MainCp/Studios.jsx'
import Members from '../components/MainCp/Members.jsx'
import Join from '../components/MainCp/Join.jsx'
import Footer from '../components/MainCp/Footer.jsx'
import { usePageTurn } from '../components/MainCp/usePageTurn.js'
import ClickSpark from '../components/ClickSpark.jsx'

/* 主站单页：整页翻屏区块。
 * 第一屏 = NewsCarousel（CMS BANNER 满屏轮播），第二屏 = Slogan（品牌首屏）。
 * QifNewsSection（#news）接在 About 后，是轮播点击与导航「快讯」的落点。 */
function Home() {
  /* 轮播 → Slogan 覆盖翻页：写 --page-turn / --page-shift / .page-covered */
  usePageTurn()
  return (
    <ClickSpark sparkSize={9} sparkRadius={26} sparkCount={10}>
      <div className="App">
        <QifSiteNav />
        <NewsCarousel />
        <Slogan />
        <About />
        <QifNewsSection />
        <Studios />
        <Members />
        <Join />
        <Footer />
      </div>
    </ClickSpark>
  )
}

export default Home
