import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAnchorScroll } from '../lib/scrollTo.js'
import ThemeToggle from './ThemeToggle.jsx'
import logo from '../assets/logo2.png'
import './SiteHeader.css'

/* 站点头部：自 bioqif SiteHeader 迁移并兼容 shnda。
 * - 替换 shnda 原 CardNav（首页 + 子页统一）。
 * - MPA 链接 *.html 改为 HashRouter 路由/页内锚点；当前项改用 useLocation。
 * - 精简导航：概况 · 快讯 · 成员 · 档案 ▾ · 加入；子页入口收进「档案」。 */

const PRIMARY = [
  { key: 'about', label: '协会概况', anchor: 'about' },
  { key: 'news', label: '启扉快讯', anchor: 'news' },
  { key: 'members', label: '成员风采', anchor: 'members' },
]

const ARCHIVE = [
  { key: 'studios', label: '特色工作室', anchor: 'studios' },
  { key: 'science', label: '科学与工程', to: '/science' },
  { key: 'popular', label: '知识普及', to: '/popular' },
  { key: 'events', label: '教育活动', to: '/events' },
]

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const anchorScroll = useAnchorScroll()
  const { pathname } = useLocation()
  const archiveRef = useRef(null)

  /* 路由变化后收起所有浮层 */
  useEffect(() => {
    setOpen(false)
    setArchiveOpen(false)
  }, [pathname])

  /* 档案下拉：点击外部 / Esc 关闭 */
  useEffect(() => {
    if (!archiveOpen) return
    const onDocClick = (event) => {
      if (archiveRef.current && !archiveRef.current.contains(event.target)) setArchiveOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setArchiveOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [archiveOpen])

  const anchorLink = (anchor, close) => ({
    href: `#${anchor}`,
    onClick: (event) => {
      if (close) close()
      anchorScroll(anchor)(event)
    },
  })

  return (
    <header className="qif-header">
      <div className="qif-header__bar">
        <Link to="/" className="qif-header__brand" aria-label="返回首页">
          <img src={logo} alt="生物启扉协会会徽" className="qif-header__logo" />
          <span className="qif-header__names">
            <span className="qif-header__cn">生物启扉协会</span>
            <span className="qif-header__en">JXAU · EST. 2026</span>
          </span>
        </Link>

        <nav className="qif-header__nav" aria-label="主导航">
          {PRIMARY.map((item) => (
            <a key={item.key} className="qif-header__link" {...anchorLink(item.anchor)}>
              {item.label}
            </a>
          ))}

          <div className="qif-header__archive" ref={archiveRef}>
            <button
              type="button"
              className={`qif-header__link qif-header__archive-btn${archiveOpen ? ' is-open' : ''}`}
              aria-expanded={archiveOpen}
              aria-haspopup="true"
              onClick={() => setArchiveOpen((value) => !value)}
            >
              档案 <span aria-hidden="true">▾</span>
            </button>
            {archiveOpen && (
              <div className="qif-header__menu" role="menu">
                {ARCHIVE.map((item) =>
                  item.to ? (
                    <Link
                      key={item.key}
                      to={item.to}
                      role="menuitem"
                      className={`qif-header__menu-item${pathname === item.to ? ' is-active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a key={item.key} role="menuitem" className="qif-header__menu-item" {...anchorLink(item.anchor, () => setArchiveOpen(false))}>
                      {item.label}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>

          <a className="qif-header__cta" {...anchorLink('join')}>
            加入我们
          </a>
        </nav>

        <div className="qif-header__actions">
          <ThemeToggle />
          <button
            type="button"
            className="qif-header__toggle"
            aria-expanded={open}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="qif-header__drawer" aria-label="移动端导航">
          {PRIMARY.map((item) => (
            <a key={item.key} className="qif-header__drawer-link" {...anchorLink(item.anchor, () => setOpen(false))}>
              {item.label}
            </a>
          ))}
          {ARCHIVE.map((item) =>
            item.to ? (
              <Link key={item.key} to={item.to} className="qif-header__drawer-link">
                {item.label}
              </Link>
            ) : (
              <a key={item.key} className="qif-header__drawer-link" {...anchorLink(item.anchor, () => setOpen(false))}>
                {item.label}
              </a>
            ),
          )}
          <a className="qif-header__cta qif-header__cta--drawer" {...anchorLink('join', () => setOpen(false))}>
            加入我们
          </a>
        </nav>
      )}
    </header>
  )
}

export default SiteHeader
