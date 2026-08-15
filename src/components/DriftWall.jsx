import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './DriftWall.css';

/* DriftWall · ReactBits 本地改造版（成员墙）
 * 保留: 3D 透视平面 / 指针视差 / 邻列反向无限漂移 / hover 浮起
 * 改造:
 *   1. 瓷砖双形态 —— image（活动照）| char（行楷姓氏字卡，无真人照片决策的延伸）
 *   2. 轴切换 —— 桌面竖向列漂移；小屏（≤60rem）自动改横向行漂移
 *   3. 性能 —— IntersectionObserver 滚出视口暂停 rAF
 *   4. 无障碍 —— 无限复制副本 aria-hidden；瓷砖无 href 目标，不作 tab 停靠
 *   5. 令牌化 —— 遮罩/圆角/缓动走 tokens（见 DriftWall.css）
 */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const laneFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items,
  lanes = 5, // 桌面列数；小屏行数自动减 2
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 26,
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = true,
  axis = 'auto', // 'vertical' | 'horizontal' | 'auto'（小屏横向）
  className = '',
  ariaLabel = '成员照片墙',
  style
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);
  const visibleRef = useRef(true);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredLaneRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  const [containerSize, setContainerSize] = useState({ w: 1200, h: 600 });
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(false);
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* 轴解析：auto 时 ≤60rem 横向 */
  useEffect(() => {
    if (axis !== 'auto') {
      setHorizontal(axis === 'horizontal');
      return;
    }
    const mq = window.matchMedia('(max-width: 60rem)');
    const onChange = e => setHorizontal(e.matches);
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [axis]);

  const laneCount = horizontal ? Math.max(3, lanes - 2) : lanes;

  const laneItems = useMemo(() => {
    const ls = Array.from({ length: laneCount }, () => []);
    items.forEach((item, i) => ls[i % laneCount].push(item));
    return ls.map(l => (l.length ? l : items.slice(0, 1)));
  }, [items, laneCount]);

  /* 单轨长度与复制份数：竖向看高，横向看宽 */
  const laneMeta = useMemo(() => {
    const unit = (horizontal ? tileWidth : tileHeight) + gap;
    const viewLen = horizontal ? containerSize.w : containerSize.h;
    return laneItems.map(lane => {
      const copyLen = Math.max(unit, lane.length * unit);
      const copies = Math.max(2, Math.ceil((viewLen * 1.6) / copyLen) + 1);
      return { copyLen, copies };
    });
  }, [laneItems, horizontal, tileWidth, tileHeight, gap, containerSize]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ w: width || 1200, h: height || 600 });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* 滚出视口暂停 rAF（性能决策） */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const baseVelocities = useMemo(
    () =>
      laneItems.map((_, c) => {
        const altSign = c % 2 === 0 ? 1 : -1;
        return speed * laneFactor(c, variance) * altSign;
      }),
    [laneItems, speed, variance]
  );

  useEffect(() => {
    offsetsRef.current = laneMeta.map((meta, c) => meta.copyLen * ((c * 0.37) % 1));
    velocitiesRef.current = laneItems.map(() => 0);
  }, [laneMeta, laneItems]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = ts => {
      rafRef.current = null;
      if (!visibleRef.current) return; // 视口外：停表，IO 再次可见时由下方 watcher 重启

      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      for (let c = 0; c < trackRefs.current.length; c++) {
        const meta = laneMeta[c];
        const el = trackRefs.current[c];
        if (!meta || !el) continue;

        if (!reduced) {
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredLaneRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;
          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyLen) + meta.copyLen) % meta.copyLen;
          offsetsRef.current[c] = next;
        }

        const off = offsetsRef.current[c] ?? 0;
        el.style.transform = horizontal
          ? `translate3d(${-off}px, 0, 0)`
          : `translate3d(0, ${-off}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    /* 可见性 watcher：可见时确保 rAF 在跑 */
    const el = containerRef.current;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !rafRef.current) {
        lastTsRef.current = null;
        rafRef.current = requestAnimationFrame(animate);
      }
    });
    if (el) io.observe(el);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, laneMeta, pauseOnHover, parallax, reduced, horizontal, applyPlaneTransform]);

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredLaneRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    e => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredLaneRef.current = Number(tile.dataset.lane);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style
    }),
    [tileWidth, tileHeight, gap, perspective, lift, dim, grayscale, fade, style]
  );

  const renderTile = (item, id, laneIndex, isCopy) => {
    /* 复制副本对辅助技术隐藏（同一内容无限重复，不应多次暴露） */
    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-lane': laneIndex,
      'aria-hidden': isCopy || undefined
    };
    return (
      <div key={id} {...commonProps}>
        <span className="drift-wall__inner">
          {item.kind === 'image' ? (
            <>
              <img src={item.image} alt={isCopy ? '' : (item.title ?? '')} loading="lazy" decoding="async" draggable={false} />
              <span className="drift-wall__overlay" aria-hidden="true" />
            </>
          ) : (
            <span className="drift-wall__char" data-accent={item.accent} aria-hidden="true">
              {item.char}
            </span>
          )}
        </span>
      </div>
    );
  };

  const rootClass = [
    'drift-wall',
    horizontal ? 'drift-wall--horizontal' : '',
    reduced ? 'drift-wall--reduced' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label={ariaLabel}
    >
      <div ref={planeRef} className="drift-wall__plane">
        {laneItems.map((lane, c) => {
          const meta = laneMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__lane" key={`lane-${c}`}>
              <div className="drift-wall__track" ref={el => (trackRefs.current[c] = el)}>
                {copies.map((_, copyIndex) =>
                  lane.map((item, itemIndex) =>
                    renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c, copyIndex > 0)
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
