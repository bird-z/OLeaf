import { useEffect, useState } from 'react'
import { getArticles } from './payload.js'

/* 契约与 bioqif 一致：{ articles, loading, error } */
export function useArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    getArticles()
      .then((items) => {
        if (active) setArticles(items)
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : '新闻加载失败')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { articles, loading, error }
}
