import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  getServerSnapshot,
  getSnapshot,
  resolveTheme,
  setTheme as persistTheme,
  subscribe
} from './theme.js';

/**
 * useTheme —— 读取 / 切换主题
 * @returns {{ theme: 'light'|'dark'|'system', resolvedTheme: 'light'|'dark', setTheme, toggle }}
 *
 * theme：用户的选择（含 system）；resolvedTheme：实际生效值，供需要按主题分支的 JS 使用
 * （例如 About 相册的昼夜双图）。CSS 侧不需要它，直接由 [data-theme] 选择器驱动。
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(getSnapshot()));

  useEffect(() => {
    const sync = () => setResolvedTheme(resolveTheme(theme));
    sync();

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [theme]);

  const toggle = useCallback(() => {
    persistTheme(resolveTheme(getSnapshot()) === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, resolvedTheme, setTheme: persistTheme, toggle };
}
