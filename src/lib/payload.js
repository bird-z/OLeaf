import fallbackCover from '../assets/psc.jpg'

/* CMS 接口层（自 ~/work/bioqif.com/src/services/payload.ts 迁移并兼容 shnda）。
 * 接口冻结：地址/请求方式/参数/归一化规则/防刷机制均不做改动，仅去掉 TS 类型。 */
export const CMS_URL = 'https://cms.bioqif.com'

/**
 * @typedef {Object} Article
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} date
 * @property {string} category
 * @property {string} categorySlug
 * @property {string[]} categoryTerms
 * @property {boolean} featured
 * @property {string} image
 * @property {string} summary
 * @property {string} author
 * @property {string} source
 * @property {string} editor
 * @property {string} reviewer
 * @property {number} views
 * @property {string} contentHtml
 */

function plainText(value = '') {
  const container = document.createElement('div')
  container.innerHTML = value
  return container.textContent?.trim() || ''
}

function assetUrl(cover) {
  const value = typeof cover === 'string' ? cover : cover?.url
  if (!value) return fallbackCover
  if (value.startsWith('http')) return value
  if (value.startsWith('/')) return `${CMS_URL}${value}`
  return `${CMS_URL}/assets/${value}`
}

function categoryList(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

/** @param {any} item @returns {Article} */
function normalizeArticle(item) {
  const id = String(item.id)
  const categories = categoryList(item.category)
  const names = categories.map((entry) => entry?.name).filter(Boolean)
  const slugs = categories.map((entry) => entry?.slug).filter(Boolean)
  return {
    id,
    slug: item.slug || id,
    title: item.title || '',
    date: (item.published_at || item.date_created || '').slice(0, 10),
    category: names[0] || '新闻动态',
    categorySlug: slugs[0] || '',
    categoryTerms: [...names, ...slugs].map((term) => term.toUpperCase()),
    featured: Boolean(item.featured),
    image: assetUrl(item.cover),
    summary: item.summary || plainText(item.content).slice(0, 120),
    author: item.author || '生物启扉协会',
    source: item.source || '生物启扉协会',
    editor: item.editor || item.author || '生物启扉协会',
    reviewer: item.reviewer || '生物启扉协会',
    views: Number(item.views || 0),
    contentHtml: item.content || '',
  }
}

let articlesPromise
const pendingViewRequests = new Set()

/** @returns {Promise<Article[]>} */
export function getArticles() {
  if (!articlesPromise) {
    articlesPromise = fetch(`${CMS_URL}/api/public-articles`, {
      headers: { Accept: 'application/json' },
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Payload request failed: ${response.status}`)
      const result = await response.json()
      const items = result.data || result.docs
      if (!Array.isArray(items)) throw new Error('Payload returned an invalid article list')
      return items.map(normalizeArticle)
    })
  }
  return articlesPromise
}

/** @param {string} id @returns {Promise<boolean>} */
export async function incrementArticleView(id) {
  if (!/^\d+$/.test(id)) return false
  const storageKey = `bioqif:view:${id}`
  const lastViewed = Number(localStorage.getItem(storageKey) || 0)
  if (Date.now() - lastViewed < 30 * 60 * 1000 || pendingViewRequests.has(id)) return false

  pendingViewRequests.add(id)
  try {
    const response = await fetch(`${CMS_URL}/api/article-view/${id}`, { method: 'POST' })
    if (!response.ok) throw new Error(`View counter failed: ${response.status}`)
    localStorage.setItem(storageKey, String(Date.now()))
    return true
  } finally {
    pendingViewRequests.delete(id)
  }
}
