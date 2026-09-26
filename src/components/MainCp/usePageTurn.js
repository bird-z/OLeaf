import { useEffect } from 'react';

/**
 * usePageTurn — 第一屏（NewsCarousel）⇄ 第二屏（Slogan）的离散翻页
 *
 * 形态：滚轮向下 / 触摸上滑 / 点击轮播非控件区域 → 轮播淡出，
 * Slogan 直接在场（位置瞬移，不做滑动跟手——全程滚动 scrub 会抖）。
 * 反向对称：在 Slogan 顶向上滚/下滑 → 回到轮播并淡入。
 *
 * 机制：
 *  - NewsCarousel 用 position:sticky 钉在视口顶（合成器钉屏，无 JS 几何 → 不抖）；
 *    Slogan 依 DOM 顺序 + 轮播自身淡出覆盖其上。
 *  - 翻页 = 瞬时 scrollTo（粘在视口顶的轮播遮住位移，用户看到的是淡入/淡出），
 *    滚动期间 LOCK_MS 内吞掉后续滚轮/触摸（吸收触控板惯性尾流）。
 *  - documentElement 的 .page-covered 类 = 唯一覆盖状态（scrollY ≥ heroTop），
 *    NewsCarousel 用 MutationObserver 读回 covered 态（is-covered/inert/停播）。
 *    滚动条/键盘等原生路径也走同一个 scroll 监听，行为一致。
 *  - heroTop ≤ 0（轮播卸载/hero 未挂载）→ 全部放行原生滚动。
 *  - prefers-reduced-motion：直接返回，CSS 侧同步塌缩为原生文档流。
 */

const SNAP_TOL = 8; // 「位于停靠点」容差 px（与 useFullpage 一致）
const LOCK_MS = 900; // 翻页动画锁：≈ --dur-turn(720ms) + 余量；改时长先改 tokens.css
const SWIPE_MIN = 48; // 触摸轻扫最小位移 px（与 useFullpage 一致）
const NOISE_MIN = 4; // 触控板抖动噪声下限（与 useFullpage 一致）

export function usePageTurn() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    let raf = 0;
    let lockedUntil = 0;
    let touchStart = null;

    const heroTop = () => {
      const hero = document.querySelector('.hero');
      return hero ? hero.getBoundingClientRect().top + window.scrollY : 0;
    };

    const locked = () => performance.now() < lockedUntil;
    const lock = () => {
      lockedUntil = performance.now() + LOCK_MS;
    };

    /* 覆盖状态唯一事实源：scrollY ≥ heroTop → Slogan 已整屏在场 */
    const update = () => {
      raf = 0;
      const top = heroTop();
      root.classList.toggle(
        'page-covered',
        top > 0 && window.scrollY >= top - SNAP_TOL
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    /* 翻页都是瞬时位移：sticky 钉住的轮播遮住跳卷，
     * 淡出/淡入由 .page-covered → is-covered 的 CSS transition 完成 */
    const toSlogan = top => {
      lock();
      window.scrollTo(0, top);
      update();
    };
    const toCarousel = () => {
      lock();
      window.scrollTo(0, 0);
      update();
    };

    const onWheel = e => {
      const top = heroTop();
      if (top <= 0) return; // 轮播卸载：完全原生
      if (e.target.closest?.('.depth-carousel')) return; // 图片轮播内部滚轮归轮播
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 横向滚动不接管
      if (locked()) {
        e.preventDefault(); // 翻页动画期间吞掉惯性尾流
        return;
      }
      const y = window.scrollY;
      if (e.deltaY > NOISE_MIN && y < top - SNAP_TOL) {
        e.preventDefault();
        toSlogan(top);
      } else if (
        e.deltaY < -NOISE_MIN &&
        y > SNAP_TOL &&
        y <= top + SNAP_TOL
      ) {
        e.preventDefault();
        toCarousel();
      }
    };

    /* 点击轮播的非控件区域 = 翻页（字幕链接/箭头按钮保持原行为） */
    const onClick = e => {
      const top = heroTop();
      if (top <= 0 || locked()) return;
      if (window.scrollY >= top - SNAP_TOL) return; // 只在第一屏响应
      const carousel = document.querySelector('.news-carousel');
      if (!carousel || !carousel.contains(e.target)) return;
      if (
        e.target.closest(
          'a, button, input, textarea, select, [role="button"]'
        )
      )
        return;
      toSlogan(top);
    };

    const onTouchStart = e => {
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    };

    /* 边界区内的纵向滑动不放行原生滚动，等 touchend 判定是否翻页；
     * 已停在 Slogan 顶时只拦「下拉回轮播」，上滑继续原生向下滚动 */
    const onTouchMove = e => {
      const top = heroTop();
      if (top <= 0 || !touchStart) return;
      const y = window.scrollY;
      if (locked() || y < top - SNAP_TOL) {
        e.preventDefault();
        return;
      }
      const dy = touchStart.y - e.touches[0].clientY;
      if (y <= top + SNAP_TOL && dy < -NOISE_MIN) e.preventDefault();
    };

    const onTouchEnd = e => {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      const dx = touchStart.x - t.clientX;
      const dy = touchStart.y - t.clientY; // >0 = 上滑 = 下一屏
      touchStart = null;
      if (Math.abs(dx) > Math.abs(dy)) return; // 横滑归轮播自身切换
      if (locked() || Math.abs(dy) < SWIPE_MIN) return;
      const top = heroTop();
      if (top <= 0) return;
      const y = window.scrollY;
      if (dy > 0 && y < top - SNAP_TOL) toSlogan(top);
      else if (dy < 0 && y > SNAP_TOL && y <= top + SNAP_TOL) toCarousel();
    };

    const onTouchCancel = () => {
      touchStart = null;
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
      root.classList.remove('page-covered');
    };
  }, []);
}
