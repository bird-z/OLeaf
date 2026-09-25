import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import { QifScaleBar } from '../components/qifObs.jsx'
import { useArticles } from '../lib/useArticles.js'
import { incrementArticleView } from '../lib/payload.js'
import { categoryTone, TONE } from '../lib/tone.js'
import { useAnchorScroll } from '../lib/scrollTo.js'
import './NewsDetailPage.css'

/* 新闻详情页：自 bioqif Article.tsx 迁移并兼容 shnda。
 * - query ?id= 改为路由参数 /news/:id
 * - SiteLayout（header+footer）改为 SiteHeader + 本页阅读骨架
 * - 正文继续用 CMS contentHtml 渲染 */
function NewsDetailPage() {
  const { id } = useParams()
  const { articles, loading, error } = useArticles()
  const anchorScroll = useAnchorScroll()
  const item = useMemo(
    () => articles.find((article) => article.id === id || article.slug === id),
    [articles, id],
  )
  const index = item ? articles.findIndex((article) => article.id === item.id) : -1
  const [viewDelta, setViewDelta] = useState(0)

  useEffect(() => {
    document.title = item
      ? `${item.title} - 生物启扉协会`
      : loading
        ? '新闻详情 - 生物启扉协会'
        : '新闻未找到 - 生物启扉协会'
  }, [item, loading])

  useEffect(() => {
    if (!item) return
    let active = true
    incrementArticleView(item.id)
      .then((incremented) => {
        if (active && incremented) setViewDelta(1)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [item])

  const tone = item ? categoryTone(item) : 'leaf'
  const previous = index > 0 ? articles[index - 1] : undefined
  const next = index >= 0 && index < articles.length - 1 ? articles[index + 1] : undefined

  return (
    <div className="qif-news-detail">
      <SiteHeader />

      <div className="qif-news-detail__breadcrumb">
        <div className="qif-news-detail__breadcrumb-inner">
          <Link to="/">首页</Link>
          <i>›</i>
          <a href="#/" onClick={anchorScroll('news')}>启扉快讯</a>
          <i>›</i>
          <span>正文</span>
        </div>
      </div>

      <main className="qif-news-detail__main">
        {loading ? (
          <div className="qif-empty qif-news-detail__state">
            <h2>正在调焦</h2>
            <p>正在连接标本库，请稍候。</p>
          </div>
        ) : error || !item ? (
          <div className="qif-news-detail__missing">
            <h1 className="qif-news-detail__missing-title">新闻未找到</h1>
            <p className="qif-news-detail__missing-text">
              {error ? '标本库暂时不可用' : '这篇新闻可能尚未发布、已经归档，或者链接有误。'}
            </p>
            <a className="qif-news-detail__back" href="#/" onClick={anchorScroll('news')}>
              返回启扉快讯
            </a>
          </div>
        ) : (
          <article className="qif-news-detail__article">
            <header>
              <p className="qif-news-detail__kicker" style={{ color: TONE[tone].hex }}>
                {item.category} · DOC-{item.id.padStart(3, '0')}
              </p>
              <h1 className="qif-news-detail__title">{item.title}</h1>
              <p className="qif-news-detail__meta">
                <time dateTime={item.date}>发布 {item.date.replaceAll('-', '.')}</time>
                <span>来源 {item.source}</span>
                <span>浏览 {item.views + viewDelta}</span>
              </p>
              <QifScaleBar className="qif-news-detail__scale" />
            </header>

            {item.summary && (
              <section className="qif-news-detail__summary">
                <p className="qif-news-detail__summary-label">摘要 · ABSTRACT</p>
                <p className="qif-news-detail__summary-text">{item.summary}</p>
              </section>
            )}

            <figure className="qif-news-detail__figure">
              <div className="qif-field-mask qif-news-detail__cover">
                <img src={item.image} alt="" />
              </div>
              <figcaption>FIG. A — 封面视野</figcaption>
            </figure>

            <div className="qif-article-body" dangerouslySetInnerHTML={{ __html: item.contentHtml }} />

            <div className="qif-specimen qif-news-detail__credit">
              采集人 COLL. {item.author}
              <br />
              鉴定人 DET. {item.editor}
              <br />
              入库人 REG. {item.reviewer}
            </div>

            <footer className="qif-news-detail__pager">
              {previous ? (
                <Link className="qif-news-detail__pager-link" to={`/news/${encodeURIComponent(previous.id)}`}>
                  <small>‹ 上一篇 PREV</small>
                  <p>{previous.title}</p>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  className="qif-news-detail__pager-link qif-news-detail__pager-link--next"
                  to={`/news/${encodeURIComponent(next.id)}`}
                >
                  <small>下一篇 NEXT ›</small>
                  <p>{next.title}</p>
                </Link>
              )}
            </footer>
          </article>
        )}
      </main>
    </div>
  )
}

export default NewsDetailPage
