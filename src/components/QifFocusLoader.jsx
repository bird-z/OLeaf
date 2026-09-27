import { useEffect, useRef, useState } from 'react'
import QifMicroscope from './QifMicroscope.jsx'
import logo2 from '../assets/logo2.png'
import './QifFocusLoader.css'

/* 冷启动加载界面：对焦揭示会徽。
 * 会徽 logo2 从模糊到清晰完成一次调焦，显微镜图标作小角标点缀。
 * 退场时机 = window load + 最短展示 MIN_MS（品牌保底），
 * MAX_MS 兜底防慢网/异常资源卡住遮罩；ready 后 .is-done 淡出再卸载。
 * 展示期间锁根节点滚动；prefers-reduced-motion 下直出内容不渲染遮罩。 */
const MIN_MS = 900
const MAX_MS = 4000
const FADE_MS = 380

function QifFocusLoader() {
  const [reducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    if (reducedMotion) return

    const mountedAt = performance.now()
    const pending = timers.current
    const later = (fn, ms) => {
      pending.push(window.setTimeout(fn, ms))
    }

    /* 遮罩期间锁滚动；注意组件靠 return null 隐去而不卸载，
     * cleanup 不会触发，必须在淡出开始时原地恢复。 */
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const unlock = () => {
      root.style.overflow = prevOverflow
    }

    /* ready → 补足最短展示 → is-done 淡出 + 解除滚动锁 → gone 卸载 */
    const release = () => {
      const remain = Math.max(0, MIN_MS - (performance.now() - mountedAt))
      later(() => {
        setDone(true)
        unlock()
        later(() => setGone(true), FADE_MS)
      }, remain)
    }

    let ready = false
    const markReady = () => {
      if (ready) return
      ready = true
      release()
    }

    if (document.readyState === 'complete') {
      markReady()
    } else {
      window.addEventListener('load', markReady, { once: true })
    }
    later(markReady, MAX_MS)

    return () => {
      pending.forEach(window.clearTimeout)
      window.removeEventListener('load', markReady)
      unlock()
    }
  }, [reducedMotion])

  if (reducedMotion || gone) return null

  return (
    <figure
      className={`qif-loader${done ? ' is-done' : ''}`}
      role="status"
      aria-label="正在调焦"
    >
      <img src={logo2} alt="生物启扉协会会徽" className="qif-loader__logo" />
      <QifMicroscope className="qif-loader__icon" />
      <figcaption className="qif-loader__caption">FOCUSING · 正在调焦</figcaption>
    </figure>
  )
}

export default QifFocusLoader
