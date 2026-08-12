import { useState, useEffect } from 'react'
import axios from 'axios'
import AnimatedList from './components/AnimatedList.jsx'
import NewsCard from './components/NewsCard.jsx'

const BASE_URL = 'https://server-lm30.onrender.com'
const LOCAL_URL = 'http://localhost:3001'
const currentUrl = LOCAL_URL 
const TOTAL_ITEMS = 100

function Mapp() {
    const [items, setItems] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ids = Array.from({ length: TOTAL_ITEMS + 1 }, (_, i) => i)

        Promise.allSettled(
            ids.map(id =>
                axios.get(`${currentUrl}/api/news/${id}`)
                    .then(res => ({ id, ...res.data }))
            )
        ).then(results => {
            const news = results
                .filter(r => r.status === 'fulfilled' && r.value)
                .map(r => r.value)
                .sort((a, b) => (b.flow || 0) - (a.flow || 0))

            if (news.length === 0) {
                setError('No data loaded. Is the server running?')
            }
            setItems(news)
            setLoading(false)
        })
    }, [])

    return (
        <div id="center">

            {error && <p className="error-msg">{error}</p>}

            {loading && (
                <div className="loading-spinner">
                    <div className="spinner" />
                    <p>Loading...</p>
                </div>
            )}

            {!loading && (
                <AnimatedList items={items}>
                    {(item, i) => <NewsCard item={item} index={i} />}
                </AnimatedList>
            )}
        </div>
    )
}

export default Mapp