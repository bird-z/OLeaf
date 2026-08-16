import { useMemo } from 'react';
import { Zap, Send, CircleDollarSign } from 'lucide-react';
import StatCard from '../../components/ApiCp/StatCard.jsx';
import DataTable from '../../components/ApiCp/DataTable.jsx';
import EmptyState from '../../components/ApiCp/EmptyState.jsx';
import { USAGE_LOGS } from '../../data/api.js';
import '../../components/ApiCp/api.css';

/* 用量明细页：汇总由明细推导，单一事实源 */
function Usage() {
  const summary = useMemo(() => {
    const cost = USAGE_LOGS.reduce((s, l) => s + l.cost, 0);
    const tokens = USAGE_LOGS.reduce((s, l) => s + l.prompt + l.completion, 0);
    return { cost, tokens, count: USAGE_LOGS.length };
  }, []);

  const columns = [
    { key: 'time', title: '时间', mono: true },
    { key: 'model', title: '模型', mono: true },
    { key: 'prompt', title: 'Prompt', align: 'right', mono: true, render: l => l.prompt.toLocaleString() },
    { key: 'completion', title: 'Completion', align: 'right', mono: true, render: l => l.completion.toLocaleString() },
    {
      key: 'cost',
      title: '费用',
      align: 'right',
      mono: true,
      render: l => <span style={{ color: 'var(--color-eco-bright)' }}>${l.cost.toFixed(3)}</span>
    }
  ];

  return (
    <div className="api-page">
      <div className="api-page__head">
        <h1 className="api-page__title">
          用量明细
          <span className="mono-tag">近 {summary.count} 次调用</span>
        </h1>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard icon={CircleDollarSign} label="费用合计" unit="$" value={summary.cost.toFixed(3)} tone="eco" />
        <StatCard icon={Zap} label="Tokens 合计" value={summary.tokens.toLocaleString()} tone="accent" />
        <StatCard icon={Send} label="调用次数" value={summary.count} />
      </div>

      <DataTable
        columns={columns}
        rows={USAGE_LOGS}
        rowKey="time"
        empty={<EmptyState title="暂无调用记录" hint="使用令牌发起一次 API 请求后出现在这里" />}
      />
    </div>
  );
}

export default Usage;
