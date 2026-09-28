import { useMemo } from 'react';
import { SECTIONS } from '../data/sectionRegistry.js';

/* 板块页数据接口（当前为占位实现，恒返回 pending，不发任何请求）。
 * 未来接入 CMS 或本地 JSON 时只改此函数，页面与注册表不动；
 * CMS 请求必须经 src/lib/payload.js 收敛出口（PRD §5.4 红线，
 * 禁止在页面/本文件内直接 fetch）。 */

/** @returns {{ status: 'pending'|'ready'|'error', meta: object, fields: Array, data: object|null }} */
export function useSection(key) {
  return useMemo(
    () => ({
      status: 'pending',
      meta: SECTIONS[key],
      fields: SECTIONS[key]?.fields ?? [],
      data: null,
    }),
    [key],
  );
}
