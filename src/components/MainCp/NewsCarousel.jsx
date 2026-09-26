import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAnchorScroll } from '../../lib/scrollTo.js';
import { useArticles } from '../../lib/useArticles.js';
import { categoryTone, TONE } from '../../lib/tone.js';
import './NewsCarousel.css';

/* 首页第一屏 · 启扉快讯全屏轮播。
 * 数据 = public-articles 的 BANNER 栏目（接口冻结：纯客户端筛选，不新增请求/参数；
 * 封面图走 payload.js 归一化后的 article.image）。
 * 点击底部字幕 → 滚动到 #news（启扉快讯节）；
 * 接口失败 / 无 BANNER 文章时整节卸载，Slogan 回到第一屏。 */

const MAX_SLIDES = 5;
const TOUCH_SWIPE_MIN = 48; // 横滑最小位移 px（与 useFullpage 一致）

/* 自动播放间隔的唯一事实源是 tokens.css 的 --dur-carousel（秒/ms）；
 * 读不到令牌时回退 6s，保证组件独立可用。 */
const readAutoplayMs = () => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--dur-carousel')
    .trim();
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return 6000;
  return raw.endsWith('ms') ? value : value * 1000;
};

function NewsCarousel() {
  const { articles, loading, error } = useArticles();
  const anchorScroll = useAnchorScroll();
  const reduceMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [autoplayMs] = useState(readAutoplayMs);

  const slides = useMemo(() => {
    if (error) return [];
    return articles
      .filter(article =>
        article.categoryTerms.some(term => term.includes('BANNER'))
      )
      .slice(0, MAX_SLIDES);
  }, [articles, error]);

  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [covered, setCovered] = useState(false);
  const rootRef = useRef(null);
  const touchStart = useRef(null);

  const go = useCallback(
    step => setIndex(value => (value + step + count) % count),
    [count]
  );

  /* 幻灯片数量变化时回到第一张 */
  useEffect(() => {
    setIndex(0);
  }, [count]);

  /* 离开视口暂停自动播放（滚到 Slogan 及以下时不再空转） */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [count]);

  /* 被 Slogan 完全覆盖时休眠：usePageTurn 在进度到 1 时翻 documentElement
   * 的 .page-covered，这里读回 React 态 → 暂停自动播放 + is-covered/inert */
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setCovered(root.classList.contains('page-covered'));
    sync();
    const ob = new MutationObserver(sync);
    ob.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => ob.disconnect();
  }, []);

  const canPlay =
    count > 1 &&
    inView &&
    !covered &&
    !hoverPaused &&
    !focusPaused &&
    !reduceMotion.current;

  /* 自动播放：每次切换（含手动）重置读秒 */
  useEffect(() => {
    if (!canPlay) return;
    const timer = window.setInterval(() => go(1), autoplayMs);
    return () => window.clearInterval(timer);
  }, [canPlay, go, autoplayMs, index]);

  const onKeyDown = event => {
    if (count < 2) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
  };

  /* 横滑切换；useFullpage 只吃纵向滑动，互不接管 */
  const onTouchStart = event => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = event => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || count < 2) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < TOUCH_SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  /* 加载态：占位满屏暗底，接口返回前页面结构稳定（不产生跳动） */
  if (loading) {
    return (
      <section
        className="news-carousel news-carousel--loading"
        aria-busy="true"
        aria-label="启扉快讯"
      >
        <div className="news-carousel__state">
          <p className="news-carousel__state-label">正在调焦</p>
          <p className="news-carousel__state-sub">Loading</p>
        </div>
      </section>
    );
  }

  /* 接口失败 / 无 BANNER 文章：整节卸载，Slogan 回到第一屏 */
  if (error || count === 0) return null;

  const current = slides[index] || slides[0];

  return (
    <section
      ref={rootRef}
      className={`news-carousel${covered ? ' is-covered' : ''}`}
      inert={covered || undefined}
      aria-roledescription="carousel"
      aria-label="启扉快讯"
      aria-live={canPlay ? 'off' : 'polite'}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={() => setFocusPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 全屏背景轨道：交叉淡入；激活张缓慢缩放（reduced-motion 关闭） */}
      <div className="news-carousel__media">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`news-carousel__slide${i === index ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            aria-hidden={i !== index}
          >
            <img
              src={slide.image}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
              draggable={false}
              className="news-carousel__img"
            />
          </div>
        ))}
      </div>

      {/* 底部字幕块：点击滚动到 #news。key 随当前张变化重挂载，播放入场动效 */}
      <a
        key={current.id}
        className="news-carousel__caption"
        href="#news"
        onClick={anchorScroll('news')}
        aria-label={`查看快讯：${current.title}`}
      >
        <p className="news-carousel__meta">
          <span style={{ color: TONE[categoryTone(current)].hex }}>
            {current.category}
          </span>
          {current.date && (
            <time dateTime={current.date}>
              {current.date.replaceAll('-', '.')}
            </time>
          )}
        </p>
        <h2 className="news-carousel__title">{current.title}</h2>
        {current.summary && (
          <p className="news-carousel__sub">{current.summary}</p>
        )}
        <span className="news-carousel__cta">
          查看快讯 <span aria-hidden="true">→</span>
        </span>
      </a>

      {/* 控制：上一张 | 计数 + 进度 | 下一张（仅多张时渲染） */}
      {count > 1 && (
        <div className="news-carousel__controls">
          <button
            type="button"
            className="news-carousel__arrow"
            onClick={() => go(-1)}
            aria-label="上一张"
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <div className="news-carousel__status" aria-hidden="true">
            <span className="news-carousel__count">
              {String(index + 1).padStart(2, '0')} /{' '}
              {String(count).padStart(2, '0')}
            </span>
            <span className="news-carousel__progress">
              {canPlay && (
                <span
                  key={index}
                  className="news-carousel__progress-fill"
                  style={{ animationDuration: `${autoplayMs}ms` }}
                />
              )}
            </span>
          </div>
          <button
            type="button"
            className="news-carousel__arrow"
            onClick={() => go(1)}
            aria-label="下一张"
          >
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

export default NewsCarousel;
