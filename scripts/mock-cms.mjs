#!/usr/bin/env node
/* mock-cms.mjs — 本地 CMS 测试接口（仅用于前端联调，不参与构建产线）。
 * 严格复刻 docs/api.md 契约：GET /api/public-articles、POST /api/article-view/{id}
 * 用法：node scripts/mock-cms.mjs [port]   默认 3001
 * 联调：临时把 src/lib/payload.js 的 CMS_URL 指向 http://localhost:3001（测完必须还原，
 *       接口冻结规则见 design.md / docs/api.md）。 */
import { createServer } from 'node:http';

const PORT = Number(process.argv[2] || process.env.PORT || 3001);

/* 覆盖 NewsCarousel 关注的场景：多张 BANNER（上限 5）、多分类、单分类、无封面、
 * 数组/单值 cover、缺失 published_at、非 BANNER 会被前端过滤掉。 */
const ARTICLES = [
  {
    id: '3',
    slug: 'bioqif_new',
    title: '生物启扉协会第一届全体（扩大）会议顺利召开',
    summary: '6月12日，江西农业大学生物启扉协会第一届全体（扩大）会议在生物科学与工程学院楼201室顺利召开。',
    content: '<div class="payload-richtext"><p>会议审议并通过了协会章程与年度工作计划。</p></div>',
    cover: 'https://picsum.photos/seed/bioqif1/1600/900',
    category: [
      { name: '工作动态', slug: 'association-news' },
      { name: 'BANNER', slug: 'banner' },
    ],
    author: '易家乐、王鑫宇',
    source: '宣传部',
    editor: '易家乐',
    reviewer: '陈小红、易家乐',
    published_at: '2026-06-12T12:00:00.000Z',
    featured: true,
    views: 62,
    date_created: '2026-06-24T06:45:50.640Z',
  },
  {
    id: '4',
    slug: 'recruit-2026',
    title: '2026 年秋季招新正式启动',
    summary: '生物启扉协会面向全校招募新成员，欢迎热爱生命科学的同学加入。',
    content: '<div class="payload-richtext"><p>报名截止至 9 月 30 日。</p></div>',
    cover: { url: '/api/media/file/psc.jpg' }, // 相对路径 → 触发 CMS_URL 拼接分支
    category: [{ name: 'BANNER', slug: 'banner' }],
    author: '宣传部',
    published_at: '2026-09-01T08:00:00.000Z',
    views: 0,
    date_created: '2026-09-01T08:00:00.000Z',
  },
  {
    id: '5',
    slug: 'field-trip',
    title: '鄱阳湖湿地科考记',
    summary: '协会成员赴鄱阳湖开展为期三天的生物多样性调查。',
    content: '<div class="payload-richtext"><p>共记录鸟类 42 种。</p></div>',
    cover: 'psc.jpg', // 裸文件名 → 触发 /assets/ 分支
    category: [{ name: 'BANNER', slug: 'banner' }],
    published_at: '2026-08-20T02:30:00.000Z',
    views: 128,
    date_created: '2026-08-20T02:30:00.000Z',
  },
  {
    id: '6',
    slug: 'no-cover',
    title: '无封面 BANNER（测兜底图）',
    summary: 'cover 缺失时应回落到本地兜底图 psc.jpg。',
    cover: null,
    category: [{ name: 'BANNER', slug: 'banner' }],
    date_created: '2026-08-15T00:00:00.000Z', // 无 published_at
  },
  {
    id: '7',
    slug: 'plain-news',
    title: '普通通知：不是 BANNER，应被前端过滤',
    summary: '这条用于验证 NewsCarousel 的 BANNER 过滤逻辑。',
    category: [{ name: '通知公告', slug: 'notice' }],
    published_at: '2026-08-10T00:00:00.000Z',
  },
];

const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
  });
  res.end(payload);
};

const server = createServer((req, res) => {
  const { method, url } = req;
  const path = url.split('?')[0];

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Accept, Content-Type',
    });
    return res.end();
  }

  // 契约：Payload v3 形态 { data: [...] }，前端 data || docs 兼容
  if (method === 'GET' && path === '/api/public-articles') {
    return json(res, 200, { data: ARTICLES });
  }

  // 契约：{docs} 历史形态兜底，便于测兼容分支
  if (method === 'GET' && path === '/api/public-articles-docs') {
    return json(res, 200, { docs: ARTICLES });
  }

  // 契约：浏览量 +1，仅接受纯数字 id，2xx 即成功
  const view = path.match(/^\/api\/article-view\/(.+)$/);
  if (method === 'POST' && view) {
    if (!/^\d+$/.test(view[1])) return json(res, 400, { error: 'invalid id' });
    return json(res, 200, { ok: true, id: view[1] });
  }

  return json(res, 404, { error: 'not found', method, path });
});

server.listen(PORT, () => {
  console.log(`mock CMS → http://localhost:${PORT}`);
  console.log(`  GET  /api/public-articles       (${ARTICLES.length} 篇，4 条 BANNER)`);
  console.log(`  GET  /api/public-articles-docs  (docs 形态兼容)`);
  console.log('  POST /api/article-view/{id}');
});
