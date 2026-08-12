import { motion } from 'framer-motion'

const formatFlow = (n) => {
  const num = Number(n)
  if (num >= 1e4) return (num / 1e4).toFixed(1) + '万'
  return num.toLocaleString()
}

const NewsCard = ({ item, index }) => {
  if (!item) return null

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
    >
      <span className="card-rank">#{index + 1}</span>
      <div className="card-body">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-link"
          >
            <h2 className="news-title">{item.name}</h2>
          </a>
        ) : (
          <h2 className="news-title">{item.title}</h2>
        )}
        <p className="news-desc">热度 {formatFlow(item.flow)}</p>
      </div>
    </motion.div>
  )
}

export default NewsCard
