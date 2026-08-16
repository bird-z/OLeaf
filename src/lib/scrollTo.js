import { useNavigate, useLocation } from 'react-router-dom';

/* HashRouter 下原生 #anchor 会被当作 hash 路由（#/join → 无匹配 → 白屏），
 * 所有页内锚点必须走 JS 滚动。跨页时先回 Home 再滚动。 */

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const scrollToId = id => {
  document.getElementById(id)?.scrollIntoView({
    behavior: reduceMotion() ? 'auto' : 'smooth',
    block: 'start'
  });
};

/* 返回 onClick 处理器：当前在 Home 直接滚；在子页先 navigate('/') 再滚 */
export function useAnchorScroll() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return id => e => {
    e?.preventDefault();
    if (pathname === '/') {
      scrollToId(id);
    } else {
      navigate('/');
      setTimeout(() => scrollToId(id), 120); // 等 Home 区块挂载
    }
  };
}
