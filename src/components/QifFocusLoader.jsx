import { useEffect, useState } from 'react'
import QifMicroscope from './QifMicroscope.jsx'
import './QifFocusLoader.css'

/* 加载界面：自 bioqif「对焦加载」迁移。
 * 显微镜图标从模糊到清晰完成一次调焦，随后遮罩淡出（~1.4s）。
 * prefers-reduced-motion 下由 CSS 直出（display:none），不阻塞首帧。 */
function QifFocusLoader() {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setGone(true), 1400)
    return () => window.clearTimeout(timer)
  }, [])

  if (gone) return null

  return (
    <figure className="qif-loader" role="status" aria-label="正在调焦">
      <QifMicroscope className="qif-loader__icon" />
      <figcaption className="qif-loader__caption">FOCUSING · 正在调焦</figcaption>
    </figure>
  )
}

export default QifFocusLoader
