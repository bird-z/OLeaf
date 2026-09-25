import { useEffect, useRef } from 'react'
import { TONE } from '../lib/tone.js'
import './qifObs.css'

/* 器物原语（自 ~/work/bioqif.com/src/components/Shared.tsx 迁移并兼容 shnda 令牌）。
 * 类名统一加 qif- 前缀，避免与 shnda 全局类（如 .empty-state）冲突。 */

/* 滚动显现容器：仅上浮 + 淡入，reduced-motion 下直出 */
export function QifReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => el.classList.add('is-visible'), delay)
            ob.unobserve(el)
          }
        })
      },
      { threshold: 0.12 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [delay])
  return (
    <div ref={ref} className={`qif-reveal ${className}`.trim()}>
      {children}
    </div>
  )
}

/* 比例尺：label 为真实尺度语义，不装饰 */
export function QifScaleBar({ label = '10 mm', className = '' }) {
  return (
    <div className={`qif-scale-bar ${className}`.trim()} aria-hidden="true">
      <span className="qif-scale-bar__line" />
      <span>{label}</span>
      <span className="qif-scale-bar__line" />
    </div>
  )
}

/* 标本签：编号 + 坐标 */
export function QifSpecimenLabel({ code = 'JXAU-QIF · 2026', className = '' }) {
  return (
    <span className={`qif-specimen ${className}`.trim()}>
      {code}
      <br />
      N28.11° E115.83° · JIANGXI AGRI. UNIV.
    </span>
  )
}

/* 栏目头：观察日志条目。tone 默认叶绿；学术类传 crystal，活动类传 safran。 */
export function QifObsHeader({ no, en, title, desc, tone = 'leaf' }) {
  return (
    <QifReveal className="qif-obs">
      <p className="qif-obs-kicker" style={{ color: TONE[tone].hex }}>
        OBS-{no} · {en}
      </p>
      <div className="qif-obs__row">
        <h2 className="qif-obs-title">{title}</h2>
        {desc && <p className="qif-obs-desc">{desc}</p>}
      </div>
      <QifScaleBar className="qif-obs__scale" />
    </QifReveal>
  )
}
