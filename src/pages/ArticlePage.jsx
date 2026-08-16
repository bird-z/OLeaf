import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageShell from '../components/MainCp/PageShell.jsx';
import ARTICLES from '../data/articles.json';
import './ArticlePage.css';

/* 文章正文：构建期由 sync-articles.mjs 落盘到 src/data/articles/，
 * 通过 import.meta.glob 以 raw 形式打包（零运行时 IO）。 */
const BODIES = import.meta.glob('../data/articles/*.md', { query: '?raw', import: 'default', eager: true });

function ArticlePage() {
  const { category, title } = useParams();

  const article = useMemo(
    () => ARTICLES.find(a => a.category === category && a.title === title),
    [category, title]
  );

  if (!article) {
    return (
      <PageShell no="05" id="popular" title="文章未找到" en="Not Found" lede="这篇文章可能已被移动或重命名。" accent="eco">
        <Link className="article__back" to="/popular">← 返回知识普及</Link>
      </PageShell>
    );
  }

  const body = BODIES[`../data/articles/${article.file}`] || '';

  return (
    <PageShell
      no={article.category}
      id="article"
      title={article.title}
      en={`${article.minutes} min read`}
      lede=""
      accent="eco"
      displayTitle={false}
    >
      <Link className="article__back" to="/popular">← 返回知识普及</Link>
      <article className="article__body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </article>
    </PageShell>
  );
}

export default ArticlePage;
