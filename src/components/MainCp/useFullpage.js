import { useEffect } from 'react';

/**
 * useFullpage — 每次滑动弹性切换到下一页
 *
 * 不劫持滚动位置：把每次滑动/轻扫转换成一次带弹性缓动的
 * 平滑滚动到下一个停靠点，ScrollExpand 等滚动驱动组件完全兼容。
 *
 * 停靠点：Hero → ScrollExpand 闭合 → ScrollExpand 全开 → About → 文档底部
 * 无障碍逃生：prefers-reduced-motion 下不接管，保持原生滚动。
 */

const DURATION = 850; // 弹性滚动时长 ms
const COOLDOWN = 280; // 动画结束后的冷却（吸收触控板惯性尾流）
const SWIPE_MIN = 48; // 触摸轻扫最小位移 px
const SNAP_TOL = 8; // 判定「当前位于某停靠点」的容差 px

/* easeOutBack：过冲回弹，即「弹性」手感 */
const easeOutBack = (t, s = 1.35) =>
  1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function useFullpage() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // 无障碍逃生：原生滚动

    let raf = 0;
    let animating = false;
    let cooldownUntil = 0;
    let touchStartY = null;

    const computeStops = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const stops = [0];

      const track = document.querySelector('.scroll-expand__track');
      if (track) {
        const top = track.getBoundingClientRect().top + y;
        const stage = track.querySelector('.scroll-expand__stage');
        const stageH = stage ? stage.offsetHeight : vh;
        stops.push(top); // 转场闭合（照片小窗）
        stops.push(top + stageH * 1.2); // 转场全开（scrollDistance = 1.2）
      }

      const about = document.querySelector('.about');
      if (about) stops.push(about.getBoundingClientRect().top + y);

      const max = document.documentElement.scrollHeight - vh;
      stops.push(max);

      return [...new Set(stops.map(s => clamp(Math.round(s), 0, max)))].sort((a, b) => a - b);
    };

    const animateTo = target => {
      animating = true;
      const start = window.scrollY;
      const dist = target - start;
      const t0 = performance.now();

      const step = now => {
        const t = Math.min(1, (now - t0) / DURATION);
        window.scrollTo(0, start + dist * easeOutBack(t));
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          window.scrollTo(0, target); // 消除过冲后的浮点残差
          animating = false;
          cooldownUntil = performance.now() + COOLDOWN;
        }
      };
      raf = requestAnimationFrame(step);
    };

    /** dir: 1 下一页 / -1 上一页；返回是否接管了本次滑动 */
    const go = dir => {
      const stops = computeStops();
      const y = window.scrollY;

      // 当前位置：最近的停靠点；不在停靠点上则按方向找下一个
      let idx = stops.findIndex(s => Math.abs(s - y) <= SNAP_TOL);
      if (idx === -1) {
        idx = dir === 1 ? stops.findIndex(s => s > y + SNAP_TOL) - 1 : stops.findLastIndex(s => s < y - SNAP_TOL);
        if (idx < -1) idx = -1;
      }
      const next = stops[clamp(idx + dir, 0, stops.length - 1)];
      if (next === undefined || Math.abs(next - y) <= SNAP_TOL) return false;

      animateTo(next);
      return true;
    };

    const onWheel = e => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 横向滚动不接管
      if (animating || performance.now() < cooldownUntil) {
        e.preventDefault(); // 动画与冷却期间吞掉惯性尾流
        return;
      }
      if (Math.abs(e.deltaY) < 4) return; // 触控板抖动噪声
      if (go(e.deltaY > 0 ? 1 : -1)) e.preventDefault();
    };

    const onTouchStart = e => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = e => {
      if (animating) e.preventDefault(); // 动画期间锁死原生滚动
    };

    const onTouchEnd = e => {
      if (touchStartY === null || animating) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      touchStartY = null;
      if (Math.abs(delta) < SWIPE_MIN) return;
      go(delta > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}
