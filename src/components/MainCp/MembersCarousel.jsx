import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MembersCarousel.css';

/* MembersCarousel — 单卡中心聚焦 + 两侧 peek 的深度轮转
 * 新建容器（不动 DepthCarousel：它是图片卡专用，About 在用）
 * 交互: autoplay / 指示菱形 / 前后按钮 / 拖拽 / 滚轮 / 点击邻卡聚焦
 * 协作: 滚轮与触摸归轮播（useFullpage 已对 .members-carousel 逃逸，不翻页）
 * 无障碍: reduced-motion 关 autoplay、过渡降级；非激活卡 aria-hidden
 */

const SWIPE_MIN = 48; // 拖拽/轻扫最小位移 px（与 useFullpage 一致）
const WHEEL_MIN = 12; // 滚轮噪声阈值
const WHEEL_COOLDOWN = 600; // 滚轮换卡冷却 ms（吸收惯性尾流）

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

  const stageRef = useRef(null);
  const dragXRef = useRef(null);
  const wheelLockRef = useRef(0);

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

  /* autoplay：悬停/聚焦/reduced-motion 时暂停 */
  useEffect(() => {
    if (reduceMotion || paused || count < 2) return;
    const timer = window.setInterval(() => go(1), autoplayDelay);
    return () => window.clearInterval(timer);
  }, [reduceMotion, paused, count, go, autoplayDelay]);

  /* 滚轮换卡：原生监听以便 preventDefault（阻止整页滚动），冷却吸收触控板尾流 */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || count < 2) return;

    const onWheel = e => {
      const now = performance.now();
      if (now - wheelLockRef.current < WHEEL_COOLDOWN) {
        e.preventDefault();
        return;
      }
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < WHEEL_MIN) return;
      wheelLockRef.current = now;
      go(delta > 0 ? 1 : -1);
      e.preventDefault();
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [go, count]);

  const onPointerDown = e => {
    dragXRef.current = e.clientX;
  };

  const onPointerUp = e => {
    if (dragXRef.current === null) return;
    const dx = e.clientX - dragXRef.current;
    dragXRef.current = null;
    if (Math.abs(dx) >= SWIPE_MIN) go(dx < 0 ? 1 : -1);
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
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={stageRef}
        className="mc-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {items.map((item, i) => {
          const off = offsetOf(i);
          const abs = Math.abs(off);
          const hidden = abs > 2;
          return (
            <div
              key={getLabel(item) || i}
              className="mc-card"
              aria-hidden={off !== 0}
              style={{
                transform: `translateX(-50%) translateY(-50%) translateX(calc(${off} * var(--mc-spacing))) scale(${1 - Math.min(abs * 0.14, 0.3)})`,
                opacity: hidden ? 0 : 1 - abs * 0.25,
                filter: `blur(${Math.min(abs * 1.5, 3)}px) brightness(${1 - Math.min(abs * 0.18, 0.4)})`,
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
