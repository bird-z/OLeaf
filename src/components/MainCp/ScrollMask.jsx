import { useEffect, useRef, useState } from 'react';
import './ScrollMask.css';

/**
 * ScrollMask — 滚动遮罩打开（等效 ReactBits scroll-mask）
 * 进入视口时 clip-path 幕布展开，一次性触发，不重复。
 */
function ScrollMask({ children, className = '', threshold = 0.15 }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* 同步兜底：挂载时已在视口内 → 直接揭开。
     * 原因：整页包装（PageShell）高度常超 4000px，IO 初始回调在个别环境
     * 会带回 ratio:0/isIntersecting:false 且不再重发，页面永久隐形。 */
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setOpen(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true);
          io.disconnect(); // 一次性，不随滚动反复
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`scroll-mask ${open ? 'is-open' : ''} ${className}`}>
      {children}
    </div>
  );
}

export default ScrollMask;
