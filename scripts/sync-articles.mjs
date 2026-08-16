#!/usr/bin/env node
/* sync-articles.mjs — 扫描本地 Obsidian 仓库，生成科普文章索引 JSON
 * 用法：node scripts/sync-articles.mjs（笔记更新后重跑）
 * 提取：文件名 → 标题（去后缀/-笔记）；首段正文 → 摘要（去 markdown 语法，≤90 字）
 * 目录名 → 分类；字数估算 → 阅读时长 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const VAULT = '/home/bird/note/los';
const OUT = new URL('../src/data/articles.json', import.meta.url);
const BODY_DIR = new URL('../src/data/articles/', import.meta.url);
const SKIP_DIRS = new Set(['.obsidian', '.claudian', '.git']);

const stripMd = s =>
  s
    .replace(/!\[\[.*?\]\]|\[\[.*?\]\]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>*`~\-]|\|/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const articles = [];
for (const dir of readdirSync(VAULT)) {
  const dirPath = join(VAULT, dir);
  if (SKIP_DIRS.has(dir) || !statSync(dirPath).isDirectory()) continue;
  for (const file of readdirSync(dirPath)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(join(dirPath, file), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, ''); // 去 YAML frontmatter
    const title = basename(file, '.md').replace(/-?笔记$/, '');
    const paragraph =
      raw
        .split(/\n\s*\n/)
        .map(p => stripMd(p))
        .find(p => p.length > 20 && !p.startsWith('!')) || '';
    const words = raw.replace(/\s/g, '').length;
    // 正文落盘：分类__标题.md（文件名净化，供 import.meta.glob 读取）
    const fileName = `${dir}__${title}`.replace(/[\\/:*?"<>|]/g, '_') + '.md';
    writeFileSync(new URL(fileName, BODY_DIR), raw);
    articles.push({
      title,
      category: dir,
      excerpt: paragraph.slice(0, 90) + (paragraph.length > 90 ? '…' : ''),
      minutes: Math.max(1, Math.round(words / 400)),
      path: join(dir, file),
      file: fileName
    });
  }
}

articles.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title, 'zh'));
writeFileSync(OUT, JSON.stringify(articles, null, 2));
console.log(`✓ ${articles.length} 篇文章 → src/data/articles.json`);
