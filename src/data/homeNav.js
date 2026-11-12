/* 首页融合导航（QifSiteNav）的导航数据源。
 * nav1（页顶两行头部）用 HERO_LINKS + JOIN_LINK；nav2（CardNav 胶囊）用 CARD_GROUPS（3 张卡片）。
 * 板块项走站内路由（to，各板块独立页面）；首页锚点值对应首页各 section 的 id，
 * 由 useAnchorScroll 处理。新闻详情页（/news/:id）由内容入口进入，不在导航。 */

export const JOIN_LINK = { key: 'join', label: '加入我们', to: '/join' };

/* 两行头部（slogan 态）第二行的平铺导航项（6 项横排：首页 + 协会概况 + 三大板块 + 加入我们）。
 * home 键 —— 平滑滚动回页顶；anchor 项走 useAnchorScroll；to 项走 <Link>；
 * 栏目对应独立页面：/about /studios /join 为占位壳，/science /events /popular 为正式档案页。 */
export const HERO_LINKS = [
  { key: 'home', label: '首页', home: 'top' },
  { key: 'about', label: '协会概况', to: '/about' },
  { key: 'science', label: '科学与工程', to: '/science' },
  { key: 'events', label: '教育活动', to: '/events' },
  { key: 'popular', label: '知识普及', to: '/popular' },
  JOIN_LINK,
];

/* CardNav 的 items 结构：{ label, links: [{ label, href, ariaLabel }] }。
 * 锚点 href 以 # 开头，由 CardNav 内部走 useAnchorScroll 的 JS 滚动。 */
export const CARD_GROUPS = [
  {
    label: '主站',
    links: [
      { label: '首页', href: '/', ariaLabel: '返回首页' },
      { label: 'API', href: 'http://localhost:3000', ariaLabel: 'EcoRem API 中转站控制台' },
      { label: 'OLD', href: 'https://bioqif.com', ariaLabel: '旧版官网（外部链接）' },
    ],
  },
  {
    label: '档案',
    links: [
      { label: '特色工作室', href: '/studios', ariaLabel: '特色工作室' },
      { label: '科学与工程', href: '/science', ariaLabel: '科学与工程' },
      { label: '知识普及', href: '/popular', ariaLabel: '知识普及' },
      { label: '教育活动', href: '/events', ariaLabel: '教育活动' },
    ],
  },
  {
    label: '加入',
    links: [
      { label: '加入我们', href: '/join', ariaLabel: '加入我们' },
      { label: '联系我们', href: '#contact', ariaLabel: '联系我们' },
    ],
  },
];
