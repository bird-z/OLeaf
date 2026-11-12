/* 板块独立页注册表：板块/栏目页元数据 + 数据字段契约的单一来源。
 * route —— App.jsx 路由路径；no —— PageShell 节序；
 * fields —— 该板块未来数据的字段契约，占位面板逐条列出供供稿方对照；
 * 接入真实数据时由 useSection（src/lib/sectionData.js）消费本表。 */

export const SECTIONS = {
  about: {
    route: '/about',
    no: '07',
    title: '协会概况',
    en: 'About',
    accent: 'eco',
    lede: '协会简介、章程与发展历程。',
    fields: [
      { name: 'intro', type: 'markdown', note: '协会简介正文' },
      { name: 'charter', type: 'url', note: '章程文件或正文链接' },
      { name: 'milestones', type: '{year,event}[]', note: '发展历程大事记' },
    ],
  },
  studios: {
    route: '/studios',
    no: '08',
    title: '特色工作室',
    en: 'Studios',
    accent: 'accent',
    lede: '生生不息、DATASEEK 等特色工作室的档案与发起入口。',
    fields: [
      { name: 'studios', type: '{name,desc,cover,members}[]', note: '工作室档案' },
      { name: 'apply', type: 'url', note: '发起工作室入口' },
    ],
  },
  join: {
    route: '/join',
    no: '09',
    title: '加入我们',
    en: 'Join',
    accent: 'accent',
    lede: '部门介绍与报名渠道。',
    fields: [
      { name: 'channel', type: 'string', note: '报名渠道说明（表单/邮箱/问卷）' },
      { name: 'url', type: 'url', note: '报名入口链接' },
      { name: 'depts', type: '{name,desc,link}[]', note: '部门介绍与入口' },
    ],
  },
};
