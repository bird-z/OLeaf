#!/usr/bin/env node
/* 缺字校验：确认 display 子集覆盖 scripts/font-subsets.config.json 的 strings+extra。
 *
 * 用 fontkit 直接读 woff2 的 cmap（免 Python），与 pnpm fonts:build 互为呼应。
 * 任何必需字形缺失 → 非零退出并逐条列出（防 tofu）。见 docs/fonts.md V9。 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const fontkit = createRequire(import.meta.url)('fontkit'); // CJS 包，无 default ESM 导出

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(resolve(root, 'scripts/font-subsets.config.json'), 'utf8'));

const required = new Set();
for (const s of config.strings ?? []) {
  for (const ch of s) required.add(ch.codePointAt(0));
}
for (const ch of config.extra ?? '') required.add(ch.codePointAt(0));

let font;
try {
  font = fontkit.openSync(resolve(root, config.output));
} catch (err) {
  console.error(`[fonts:check] 无法读取 ${config.output}：${err.message}`);
  process.exit(1);
}

const have = new Set(font.characterSet);
const missing = [...required].filter((cp) => !have.has(cp));

if (missing.length) {
  console.error(`[fonts:check] ${config.output} 缺少 ${missing.length} 个必需字形：`);
  console.error(
    '  ' +
      missing
        .map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')} ${String.fromCodePoint(cp)}`)
        .join('  ')
  );
  console.error('[fonts:check] 修复：把新增 display 文案加入 config.strings 后运行 pnpm fonts:build。');
  process.exit(1);
}

console.log(
  `[fonts:check] ${config.output} 覆盖全部 ${required.size} 个必需字形（${font.familyName}）。`
);
