import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MembersCarousel.css';

/* MembersCarousel — 单卡中心聚焦 + 两侧 peek 的深度轮转
 * 新建容器（不动 DepthCarousel：它是图片卡专用，About 在用）
 * 交互: autoplay / 指示菱形 / 前后按钮 / 拖拽 / 点击邻卡聚焦
 * 协作: 不接管鼠标滚轮（滚轮交给页面翻页，useFullpage 已不再对 .members-carousel 逃逸）
 * 无障碍: reduced-motion 关 autoplay、过渡降级；非激活卡 aria-hidden
 */

const SWIPE_MIN = 48; // 拖拽/轻扫最小位移 px（与 useFullpage 一致）
const DRAG_CAPTURE_MIN = 8; // 位移超过该值才接管指针：轻点不被捕获，click 仍能落到卡片上
const TAP_MAX = 10; // 轻点容许的最大横/纵向抖动 px（超出即视为滑动手势，不触发切换）

function MembersCarousel({
  items,
  renderItem,
  getLabel = item => item?.name ?? '',
  autoplayDelay = 4000,
  ariaLabel = '成员轮播'
}) {
  const count = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [compact, setCompact] = useState(false);
  /* 触摸设备会合成 pointerType='mouse' 事件，用粗指针判定排除，避免误暂停 autoplay */
  const coarsePointer = useMemo(
    () =>
      typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches,
    []
  );
  const hoverPause = e => e.pointerType === 'mouse' && !coarsePointer;

  const dragXRef = useRef(null);
  const dragYRef = useRef(null);
  const dragPointerRef = useRef(null);
  const dragCardRef = useRef(null);
  /* 用时间窗（而非布尔标志）抑制拖拽/轻点后跟随的 click，避免残留状态吞掉下一次点击 */
  const suppressClickUntilRef = useRef(0);

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const go = useCallback(
    dir => setActive(a => (a + dir + count) % count),
    [count]
  );

  /* 小屏性能：去掉卡片内联 filter（blur 会强制合成层重绘，切卡时最费） */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 60rem)');
    const onChange = e => setCompact(e.matches);
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* autoplay：悬停/聚焦/reduced-motion 时暂停 */
  useEffect(() => {
    if (reduceMotion || paused || count < 2) return;
    const timer = window.setInterval(() => go(1), autoplayDelay);
    return () => window.clearInterval(timer);
  }, [reduceMotion, paused, count, go, autoplayDelay]);

  /* 鼠标滚轮不再切换成员：滚轮事件交给页面滚动（见 useFullpage）。 */

  const onPointerDown = e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragXRef.current = e.clientX;
    dragYRef.current = e.clientY;
    dragPointerRef.current = e.pointerId;
    const card = e.target.closest?.('.mc-card');
    dragCardRef.current = card ? Number(card.dataset.index) : null;
  };

  /* 捕获时机推迟到位移阈值之后：若在 pointerdown 立即捕获，
   * 浏览器会把 pointerup/click 的 target 改写为 stage，卡片上的 onClick 永远触发不到。 */
  const onPointerMove = e => {
    if (dragXRef.current === null || dragPointerRef.current !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) return;
    if (Math.abs(e.clientX - dragXRef.current) < DRAG_CAPTURE_MIN) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerUp = e => {
    if (dragXRef.current === null || dragPointerRef.current !== e.pointerId) return;
    const dx = e.clientX - dragXRef.current;
    const dy = e.clientY - (dragYRef.current ?? e.clientY);
    const cardIndex = dragCardRef.current;
    dragXRef.current = null;
    dragYRef.current = null;
    dragPointerRef.current = null;
    dragCardRef.current = null;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (Math.abs(dx) >= SWIPE_MIN) {
      suppressClickUntilRef.current = performance.now() + 400; // 拖拽后吞掉紧随的 click，避免又按起点卡片回切
      go(dx < 0 ? 1 : -1);
      return;
    }

    /* 只有横、纵向位移都很小才算轻点：
     * 否则用户按住卡片上下滚动页面（纵向位移大）时会误触发切卡。 */
    if (Math.abs(dx) >= TAP_MAX || Math.abs(dy) >= TAP_MAX) return;

    /* 轻点：不依赖浏览器合成 click（触摸端手势层可能不派发），只用 pointer 事件。 */
    if (Number.isFinite(cardIndex)) {
      suppressClickUntilRef.current = performance.now() + 400;
      if (cardIndex !== active) {
        setActive(cardIndex); // 点邻卡（桌面可见时）→ 直接聚焦该卡
      } else {
        /* 点当前卡：左半 → 上一张，右半 → 下一张。
         * 小屏下邻卡会被当前卡完全遮挡（实测可见宽度 0），
         * 这是触屏上唯一可行的“点卡片移动”手势；桌面同样适用。 */
        const rect = e.target.closest?.('.mc-card')?.getBoundingClientRect();
        if (rect) go(e.clientX < rect.left + rect.width / 2 ? -1 : 1);
      }
    }
  };

  const onPointerCancel = () => {
    dragXRef.current = null;
    dragPointerRef.current = null;
  };

  /* 最短路径偏移：-2..+2，超出隐藏 */
  const offsetOf = i => {
    let off = (i - active + count) % count;
    if (off > count / 2) off -= count;
    return off;
  };

  return (
    <div
      className="members-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
      }}
      onPointerEnter={e => {
        if (hoverPause(e)) setPaused(true);
      }}
      onPointerLeave={e => {
        if (hoverPause(e)) setPaused(false);
      }}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="mc-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={e => {
          if (performance.now() >= suppressClickUntilRef.current) return;
          e.stopPropagation(); // 拖拽/轻点已处理，吞掉这次 click
        }}
      >
        {items.map((item, i) => {
          const off = offsetOf(i);
          const abs = Math.abs(off);
          const hidden = abs > 2;
          return (
            <div
              key={getLabel(item) || i}
              className="mc-card"
              data-index={i}
              aria-hidden={off !== 0}
              style={{
                transform: `translateX(-50%) translateY(-50%) translateX(calc(${off} * var(--mc-spacing))) scale(${1 - Math.min(abs * 0.14, 0.3)})`,
                opacity: hidden ? 0 : 1 - abs * 0.25,
                filter: compact
                  ? 'none'
                  : `blur(${Math.min(abs * 1.5, 3)}px) brightness(${1 - Math.min(abs * 0.18, 0.4)})`,
                zIndex: 10 - abs,
                pointerEvents: hidden ? 'none' : 'auto'
              }}
              onClick={off !== 0 ? () => setActive(i) : undefined}
            >
              {renderItem(item, i)}
            </div>
          );
        })}
      </div>

      <div className="mc-controls">
        <button
          type="button"
          className="mc-arrow"
          onClick={() => go(-1)}
          aria-label="上一位成员"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <span className="mc-count" aria-hidden="true">
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>

        <div className="mc-dots" role="tablist" aria-label="选择成员">
          {items.map((item, i) => (
            <button
              key={getLabel(item) || i}
              type="button"
              role="tab"
              aria-selected={i === active}
              className="mc-dot"
              data-active={i === active || undefined}
              onClick={() => setActive(i)}
              aria-label={`第 ${i + 1} 位：${getLabel(item)}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="mc-arrow"
          onClick={() => go(1)}
          aria-label="下一位成员"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {/* 切卡播报（屏幕阅读器） */}
      <p className="mc-sr" aria-live="polite">
        {getLabel(items[active])}
      </p>
    </div>
  );
}

export default MembersCarousel;
