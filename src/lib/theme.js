/* 主题控制器 —— light | dark | system
 *
 * 设计：
 *   · 真值落在 <html data-theme="light|dark">，CSS 据此切换令牌；同时镜像 .dark class
 *     以复用 Tailwind / shadcn 的 dark 变体（@custom-variant dark 已在 index.css 定义）。
 *   · 不引入 Context/Provider：用 useSyncExternalStore 订阅，任何组件可直接读。
 *   · localStorage 只存用户显式选择；'system' 时删除键，交由 prefers-color-scheme。
 *
 * 首屏防闪不在这里，而是 index.html <head> 的内联脚本（必须早于 CSS 生效）。
 */

export const THEME_STORAGE_KEY = 'shnda-theme';
export const THEME_CHANGE_EVENT = 'shnda:themechange';

const DARK_MEDIA = '(prefers-color-scheme: dark)';

/* 浏览器 UI 配色（移动端地址栏 / 状态栏），与 --color-paper-dark 的昼夜值对应 */
const THEME_COLOR = { dark: '#0b0b12', light: '#fbfafd' };

const canUseDOM = typeof window !== 'undefined';

export function getStoredTheme() {
  if (!canUseDOM) return 'system';
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return raw === 'light' || raw === 'dark' ? raw : 'system';
  } catch {
    return 'system';
  }
}

export function systemPrefersDark() {
  return canUseDOM && window.matchMedia(DARK_MEDIA).matches;
}

export function resolveTheme(theme) {
  if (theme === 'light' || theme === 'dark') return theme;
  return systemPrefersDark() ? 'dark' : 'light';
}

/** 把主题落到 DOM。幂等，可在任意时机重复调用。 */
export function applyTheme(theme) {
  if (!canUseDOM) return 'light';
  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  root.dataset.theme = resolved;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLOR[resolved]);

  return resolved;
}

export function setTheme(theme) {
  if (!canUseDOM) return;
  try {
    if (theme === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* 隐私模式下 localStorage 可能不可写：本次会话仍然生效 */
  }

  const commit = () => {
    applyTheme(theme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* View Transitions：整页旧/新快照在合成器层交叉淡入。
   * 不产生逐元素的颜色动画，因而不会触发大规模 paint —— 页面再重也不掉帧，
   * 这是目前最“丝滑”的切换路径。 */
  if (typeof document.startViewTransition === 'function' && !reduceMotion) {
    document.startViewTransition(commit);
    return;
  }

  /* 回退（如 Firefox）：就地颜色过渡，用一次性类限定作用域 */
  if (!reduceMotion) {
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 300);
  }

  commit();
}

/* ── useSyncExternalStore 契约 ── */

export function subscribe(onChange) {
  if (!canUseDOM) return () => {};

  const mq = window.matchMedia(DARK_MEDIA);

  /* 系统偏好变化：仅当用户未显式指定时同步 DOM，并通知订阅者重算 resolvedTheme */
  const onSystemChange = () => {
    if (getStoredTheme() === 'system') applyTheme('system');
    onChange();
  };

  /* 跨标签页同步 */
  const onStorage = event => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(getStoredTheme());
    onChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  mq.addEventListener('change', onSystemChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
    mq.removeEventListener('change', onSystemChange);
  };
}

export function getSnapshot() {
  return getStoredTheme();
}

export function getServerSnapshot() {
  return 'system';
}
