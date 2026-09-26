import { useCallback, useEffect, useMemo, useState } from 'react'
import oiIcons from '@iconify-json/oi/icons.json'
import { BRAND_HERO } from '../data/content'
import { responsiveImageProps } from '../data/responsive-images'
import type { Article } from '../services/payload'

interface OiIconData { body: string; width?: number; height?: number }
const OI = oiIcons as { icons: Record<string, OiIconData>; width: number; height: number }

/** 内联使用 @iconify-json/oi 图标（currentColor，随文字色） */
function OiIcon({ name, className }: { name: string; className?: string }) {
  const icon = OI.icons[name]
  if (!icon) return null
  return (
    <svg
      className={className}
      viewBox={`0 0 ${icon.width || OI.width} ${icon.height || OI.height}`}
      fill="currentColor"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  )
}

interface HeroSlide {
  image: string
  kicker: string
  title: string
  sub: string
  date: string
  href: string
}

/** 自动播放间隔（指示器进度条与其同步） */
const AUTOPLAY_MS = 7000

/** fa7-solid:angle-left / angle-right（路径取自 @iconify-json/fa7-solid，viewBox 640×640，避免引入 1.1MB 全量图标包） */
const FA7_ANGLE_PATHS = {
  left: 'M201.4 297.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 320l137.3-137.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z',
  right: 'M439.1 297.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L371.2 320L233.9 182.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z',
} as const

function Fa7AngleIcon({ dir, className }: { dir: 'left' | 'right'; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 640" fill="currentColor" aria-hidden="true">
      <path d={FA7_ANGLE_PATHS[dir]} />
    </svg>
  )
}

export function Hero({ articles }: { articles: Article[] }) {
  const slides = useMemo<HeroSlide[]>(() => {
    // 仅读取「新闻栏目包含 BANNER」的新闻（栏目可多选），取前三条
    const bannerArticles = articles.filter((article) =>
      article.categoryTerms.some((term) => term.includes('BANNER')),
    )
    if (bannerArticles.length === 0) {
      return [{ ...BRAND_HERO, date: '', href: 'about.html' }]
    }
    return bannerArticles.slice(0, 3).map((article) => ({
      image: article.image,
      kicker: article.category.toUpperCase(),
      title: article.title,
      sub: article.summary,
      date: article.date,
      href: `article.html?id=${encodeURIComponent(article.id)}`,
    }))
  }, [articles])

  // 首尾各克隆一张：末位克隆接回首位（右进）、首位克隆接回末位（左进），无缝循环
  const looped = useMemo(
    () => (slides.length > 1 ? [slides[slides.length - 1], ...slides, slides[0]] : slides),
    [slides],
  )

  const [index, setIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const [epochs, setEpochs] = useState<number[]>([])

  // 幻灯片数量变化（兜底 1 张 → 真实 N 张）时回到正位
  useEffect(() => {
    const timer = window.setTimeout(() => setIndex(slides.length > 1 ? 1 : 0), 0)
    return () => window.clearTimeout(timer)
  }, [slides.length])

  // 每次激活：重置该张的缩放状态（仅激活时重挂载，退场张保持当前缩放被顶走）
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEpochs((prev) => {
        const nextEpochs = [...prev]
        nextEpochs[index] = (nextEpochs[index] || 0) + 1
        return nextEpochs
      })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [index])

  // 停在克隆位一帧后无动画瞬移回正位，形成无缝循环
  useEffect(() => {
    if (slides.length < 2) return
    const atStartClone = index === 0
    const atEndClone = index === looped.length - 1
    if (!atStartClone && !atEndClone) return
    const timer = window.setTimeout(() => {
      setInstant(true)
      setIndex(atStartClone ? slides.length : 1)
      requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)))
    }, 950)
    return () => window.clearTimeout(timer)
  }, [index, looped.length, slides.length])

  // 边界钳制：快速连点时索引不越界（克隆位即端点），
  // 多余的同值 setState 不会重渲染，瞬移回正定时器不会被误取消
  const next = useCallback(() => setIndex((value) => Math.min(value + 1, looped.length - 1)), [looped.length])
  const prev = useCallback(() => setIndex((value) => Math.max(value - 1, 0)), [])

  // 自动播放：每次切换（含手动）都重置读秒，避免刚手动切完又立刻自动切
  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(next, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [next, slides.length, index])

  const displayIndex = slides.length > 1 ? ((index - 1 + slides.length) % slides.length) + 1 : 1
  const current = slides[displayIndex - 1]

  return (
    <section
      id="home"
      className="relative z-0 h-screen h-svh min-h-[560px] w-full overflow-hidden bg-[#03241a]"
      aria-roledescription="carousel"
      aria-label="协会焦点新闻"
    >
      {/* 全屏幻灯片轨道：整体匀速推动——下一张把当前张向左顶出、上一张向右顶回，无淡入淡出 */}
      <div className="hero-track" style={{ width: `${looped.length * 100}%`, transform: `translateX(-${(index * 100) / looped.length}%)`, transition: instant ? 'none' : undefined }}>
        {looped.map((slide, slideIndex) => (
          <div key={`${slide.href}-${slideIndex}`} className="hero-slide" style={{ width: `${100 / looped.length}%` }} aria-hidden={slideIndex !== index}>
            <img
              key={`${slideIndex}-${epochs[slideIndex] || 0}`}
              {...responsiveImageProps(slide.image, '100vw')}
              alt=""
              loading={slideIndex <= 1 ? 'eager' : 'lazy'}
              fetchPriority={slideIndex === index ? 'high' : 'auto'}
              decoding="async"
              className="kenburns kenburns-run h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 标题 + 按钮：底部全宽水平遮罩带（#75878A 下→上渐变，带内一行布局） */}
      <div className="hero-panel absolute inset-x-0 bottom-0 z-20">
        <div key={displayIndex} className="flex h-[100px] w-full items-center gap-6 px-[4vw] md:gap-10">
          <div className="min-w-0 flex-1">
            <h2 className="hero-title hero-text-in truncate text-xl font-bold tracking-wide md:text-3xl">{current.title}</h2>
            {current.date && <time className="font-techmono hero-text-in mt-1 block text-xs tracking-[0.2em] text-white/75" style={{ animationDelay: '0.1s' }}>{current.date}</time>}
          </div>
          <div className="hero-text-in flex flex-none items-center" style={{ animationDelay: '0.18s' }}>
            <a href={current.href} className="group relative inline-flex items-center gap-2 overflow-hidden rounded-sm bg-[color:var(--hf-blue)] px-4 py-2.5 text-[max(1.04166vw,12px)] font-bold tracking-[0.2em] text-white shadow-[0_8px_24px_var(--hf-btn-shadow)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--hf-green-deep)] hover:shadow-[0_10px_32px_var(--hf-btn-shadow-hover)] md:px-7 md:py-3 md:tracking-[0.25em]">
              查看详情
              <OiIcon name="external-link" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 底部居中：上一张 | 当前页/总页 + 读条 | 下一张（两钮恒显） */}
      <div className="absolute inset-x-0 bottom-[116px] z-30 flex items-center justify-center gap-4">
        <button onClick={prev} aria-label="上一张" className="hero-nav-btn"><Fa7AngleIcon dir="left" className="h-5 w-5" /></button>
        <button onClick={next} aria-label="下一张" className="hero-dot">
          <span className="hero-dot-num font-techmono">0{displayIndex}/0{slides.length}</span>
          <span className="hero-dot-line">
            {slides.length > 1 && (
              <span key={displayIndex} className="hero-progress-fill" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />
            )}
          </span>
        </button>
        <button onClick={next} aria-label="下一张" className="hero-nav-btn"><Fa7AngleIcon dir="right" className="h-5 w-5" /></button>
      </div>
    </section>
  )
}
