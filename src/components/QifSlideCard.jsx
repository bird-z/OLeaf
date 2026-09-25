import { Link } from 'react-router-dom'
import { categoryTone, TONE } from '../lib/tone.js'
import './QifSlideCard.css'

/* 载玻片卡：自 bioqif SlideCard 迁移。
 * 左标签区（染色条编码内容类型）+ 右视野图（目镜渐晕）；移动端上下结构。
 * 链接自 article.html?id= 改为 shnda 路由 /news/:id。 */
function QifSlideCard({ article }) {
  const tone = categoryTone(article)
  const to = `/news/${encodeURIComponent(article.id)}`

  return (
    <Link
      to={to}
      className="qif-slide-card"
      style={{ '--qif-tone': TONE[tone].hex }}
      aria-label={`阅读文章：${article.title}`}
    >
      <div className="qif-slide-card__label">
        <p className="qif-slide-card__category" style={{ color: TONE[tone].hex }}>
          {article.category}
        </p>
        <h3 className="qif-slide-card__title">{article.title}</h3>
        <time className="qif-slide-card__date" dateTime={article.date}>
          {article.date.replaceAll('-', '.')}
        </time>
        <span className="qif-slide-card__more">阅读文章 ›</span>
      </div>
      <div className="qif-slide-card__field qif-field-mask">
        <img src={article.image} alt="" loading="lazy" decoding="async" />
      </div>
    </Link>
  )
}

export default QifSlideCard
