import { useState } from 'react';
import { Wallet, Send, Zap, Gauge, Copy, Check, Bell } from 'lucide-react';
import StatCard from '../../components/ApiCp/StatCard.jsx';
import LineChart from '../../components/ApiCp/LineChart.jsx';
import { USER, STATS, TREND, ENDPOINTS, NOTICES } from '../../data/api.js';
import '../../components/ApiCp/api.css';
import './Dashboard.css';

const RANGES = ['24小时', '当天', '7天', '30天'];

/* 延迟徽章语义：<200ms eco / <500ms accent / 超时 danger */
const latencyTone = ms => (ms < 200 ? 'dot--eco' : ms < 500 ? 'dot--accent' : 'dot--danger');

function Dashboard() {
  const [range, setRange] = useState('24小时');
  const [copied, setCopied] = useState('');

  const hour = new Date().getHours();
  const greet = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  const copy = async text => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 1500);
    } catch { /* 演示态忽略剪贴板权限失败 */ }
  };

  return (
    <div className="api-page">
      <div className="api-page__head">
        <h1 className="api-page__title">
          {greet}，{USER.name}
          <span className="mono-tag">EcoRem API · Console</span>
        </h1>
        <div className="toolbar" role="tablist" aria-label="统计时间范围">
          {RANGES.map(r => (
            <button
              key={r}
              role="tab"
              aria-selected={range === r}
              className={`btn ${range === r ? 'btn--accent' : 'btn--ghost'}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 1 大 3 小：余额为业务核心，放大处理（对参考站四卡平铺的改进） */}
      <div className="stat-grid">
        <StatCard
          icon={Wallet}
          label="当前余额"
          unit="$"
          value={USER.balance.toFixed(2)}
          size="lg"
          extra={`历史消耗 $${USER.historyConsumption.toFixed(2)}`}
        />
        <StatCard icon={Send} label="请求次数" value={STATS.requests.toLocaleString()} tone="accent" extra={range} />
        <StatCard icon={Zap} label="统计 Tokens" value={STATS.tokens.toLocaleString()} tone="eco" extra={`消耗 $${STATS.quota.toFixed(2)}`} />
        <StatCard icon={Gauge} label="平均 RPM" value={STATS.avgRPM.toFixed(2)} extra={`TPM ${STATS.avgTPM}`} />
      </div>

      {/* 消耗趋势 */}
      <section className="panel" aria-labelledby="trend-title">
        <h2 className="panel__title" id="trend-title">消耗趋势 · {range}</h2>
        <LineChart
          labels={TREND.labels}
          series={[{ name: 'cost', color: 'chart-1', data: TREND.cost }]}
          formatY={v => `$${v.toFixed(1)}`}
        />
      </section>

      <div className="dash-cols">
        {/* Endpoint 列表 */}
        <section className="panel" aria-labelledby="ep-title">
          <h2 className="panel__title" id="ep-title">API 信息</h2>
          <div className="ep-list">
            {ENDPOINTS.map(ep => (
              <div className="ep-item" key={ep.url}>
                <div className="ep-item__main">
                  <span className="ep-item__tag">{ep.tag}</span>
                  <code className="ep-item__url">{ep.url}</code>
                  <span className="ep-item__note">{ep.note}</span>
                </div>
                <div className="ep-item__ops">
                  <span className={`dot ${latencyTone(ep.latency)}`}>{ep.latency}ms</span>
                  <button className="btn btn--ghost" onClick={() => copy(ep.url)}>
                    {copied === ep.url ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                    {copied === ep.url ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 系统公告 */}
        <section className="panel" aria-labelledby="notice-title">
          <h2 className="panel__title" id="notice-title">
            <Bell size={15} aria-hidden="true" /> 系统公告
          </h2>
          <ul className="notice-list">
            {NOTICES.map(n => (
              <li key={n.time}>
                <span className={`dot dot--${n.type === 'default' ? 'muted' : n.type}`} />
                <span className="notice-list__time">{n.time}</span>
                <span>{n.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
