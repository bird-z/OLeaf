/* 首页融合导航（QifSiteNav）的导航数据源。
 * nav1（页顶两行头部）用 PRIMARY_LINKS / ARCHIVE_LINKS / JOIN_LINK；
 * nav2（CardNav 胶囊）用 CARD_GROUPS（3 张卡片）。
 * 锚点值对应首页各 section 的 id，站内路由值对应 HashRouter 的 to。 */

export const PRIMARY_LINKS = [
  { key: 'about', label: '概况', anchor: 'about' },
  { key: 'news', label: '快讯', anchor: 'news' },
  { key: 'members', label: '成员', anchor: 'members' },
];

export const ARCHIVE_LINKS = [
  { key: 'studios', label: '特色工作室', anchor: 'studios' },
  { key: 'science', label: '科学与工程', to: '/science' },
  { key: 'popular', label: '知识普及', to: '/popular' },
  { key: 'events', label: '教育活动', to: '/events' },
];

export const JOIN_LINK = { key: 'join', label: '加入我们', anchor: 'join' };

/* 两行头部（slogan 态）第二行的平铺导航项（9 项横排，参考 bioqif 原版）。
 * home 键 —— 平滑滚动回页顶；anchor 项走 useAnchorScroll；to 项走 <Link>；
 * 无独立页面的栏目锚到承载其内容的最近区块（组织机构→概况，校园墙→成员照片墙）。 */
export const HERO_LINKS = [
  { key: 'home', label: '首页', home: 'top' },
  { key: 'about', label: '协会概况', anchor: 'about' },
  { key: 'org', label: '组织机构', anchor: 'about' },
  { key: 'science', label: '学术科创', to: '/science' },
  { key: 'events', label: '品牌活动', to: '/events' },
  { key: 'members', label: '会员风采', anchor: 'members' },
  { key: 'wall', label: '校园墙', anchor: 'members' },
  { key: 'popular', label: '知识普及', to: '/popular' },
  JOIN_LINK,
];

/* CardNav 的 items 结构：{ label, links: [{ label, href, ariaLabel }] }。
 * 锚点 href 以 # 开头，由 CardNav 内部走 useAnchorScroll 的 JS 滚动。 */
export const CARD_GROUPS = [
  {
    label: '主站',
    links: [
      { label: '概况', href: '#about', ariaLabel: '协会概况' },
      { label: '快讯', href: '#news', ariaLabel: '启扉快讯' },
      { label: '成员', href: '#members', ariaLabel: '成员风采' },
    ],
  },
  {
    label: '档案',
    links: [
      { label: '特色工作室', href: '#studios', ariaLabel: '特色工作室' },
      { label: '科学与工程', href: '/science', ariaLabel: '科学与工程' },
      { label: '知识普及', href: '/popular', ariaLabel: '知识普及' },
      { label: '教育活动', href: '/events', ariaLabel: '教育活动' },
    ],
  },
  {
    label: '加入',
    links: [
      { label: '加入我们', href: '#join', ariaLabel: '加入我们' },
      { label: '联系我们', href: '#contact', ariaLabel: '联系我们' },
    ],
  },
];
