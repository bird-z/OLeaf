#!/usr/bin/env node
/* 生成 display 子集：用 Node 原生 subset-font 从 fontsource 的 chinese-simplified 分包
 * 抽取 scripts/font-subsets.config.json 的 strings+extra 所需字形，写 woff2。
 *
 * 免 Python（见 docs/fonts.md V9）；跑完用 pnpm fonts:check 复核覆盖。 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(resolve(root, 'scripts/font-subsets.config.json'), 'utf8'));

const text = [...(config.strings ?? []), config.extra ?? ''].join('');
const glyphs = new Set([...text].map((c) => c.codePointAt(0)));

let source;
try {
  source = readFileSync(resolve(root, config.source));
} catch (err) {
  console.error(`[fonts:build] 无法读取源字体 ${config.source}：${err.message}`);
  process.exit(1);
}

const out = await subsetFont(source, text, { targetFormat: 'woff2' });
writeFileSync(resolve(root, config.output), out);

console.log(
  `[fonts:build] ${config.family} 子集 → ${config.output}（${out.length} bytes，目标 ${glyphs.size} 字形）。`
);
