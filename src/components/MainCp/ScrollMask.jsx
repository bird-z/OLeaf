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
