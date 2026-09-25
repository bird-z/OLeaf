/* 内容类型色编码（自 ~/work/bioqif.com/src/utils/tone.ts 迁移并兼容 shnda）。
   字典 + 兜底逻辑不变；颜色改为引用 shnda tokens.css 令牌，随 data-theme 明暗切换。 */

const CRYSTAL_TERMS = ['RESEARCH', 'ACADEMIC', 'SCIENCE', 'STUDY', '学术', '科创', '研究', '论文']
const SAFRAN_TERMS = ['ACTIVITY', 'ACTIVITIES', 'EVENT', 'VOLUNTEER', '活动', '实践', '志愿', '科普', '自然']

/** @param {{ categoryTerms?: string[] }} article */
export function categoryTone(article) {
  const terms = article.categoryTerms || []
  if (terms.some((term) => CRYSTAL_TERMS.some((key) => term.includes(key)))) return 'crystal'
  if (terms.some((term) => SAFRAN_TERMS.some((key) => term.includes(key)))) return 'safran'
  return 'leaf'
}

/* shnda 无红色令牌，safran/amber 统一落 --color-brass（黄铜金）。 */
export const TONE = {
  crystal: {
    text: 'qif-tone-crystal',
    hex: 'var(--color-accent-bright)',
    softBg: 'color-mix(in oklch, var(--color-accent) 10%, transparent)',
  },
  safran: {
    text: 'qif-tone-safran',
    hex: 'var(--color-brass)',
    softBg: 'color-mix(in oklch, var(--color-brass) 12%, transparent)',
  },
  leaf: {
    text: 'qif-tone-leaf',
    hex: 'var(--color-eco-bright)',
    softBg: 'color-mix(in oklch, var(--color-eco) 10%, transparent)',
  },
  amber: {
    text: 'qif-tone-amber',
    hex: 'var(--color-brass)',
    softBg: 'color-mix(in oklch, var(--color-brass) 12%, transparent)',
  },
  azure: {
    text: 'qif-tone-azure',
    hex: 'var(--color-accent-bright)',
    softBg: 'color-mix(in oklch, var(--color-accent) 10%, transparent)',
  },
}
