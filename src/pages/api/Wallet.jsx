import { useState } from 'react';
import { Wallet as WalletIcon } from 'lucide-react';
import DataTable from '../../components/ApiCp/DataTable.jsx';
import EmptyState from '../../components/ApiCp/EmptyState.jsx';
import { USER, RECHARGE_TIERS, RECHARGE_RECORDS } from '../../data/api.js';
import '../../components/ApiCp/api.css';
import './Wallet.css';

/* 钱包页：余额横幅 + 充值档位 + 充值记录（演示态，支付通道未接入） */
function Wallet() {
  const [amount, setAmount] = useState(30);
  const [custom, setCustom] = useState('');

  const pick = v => {
    setAmount(v);
    setCustom('');
  };

  const columns = [
    { key: 'time', title: '时间', mono: true },
    { key: 'order', title: '订单号', mono: true },
    { key: 'method', title: '支付方式' },
    { key: 'amount', title: '金额', align: 'right', mono: true, render: r => `$${r.amount.toFixed(2)}` },
    {
      key: 'status',
      title: '状态',
      render: r =>
        r.status === 'success' ? (
          <span className="dot dot--eco">已完成</span>
        ) : (
          <span className="dot dot--muted">已关闭</span>
        )
    }
  ];

  return (
    <div className="api-page">
      <div className="api-page__head">
        <h1 className="api-page__title">
          钱包管理
          <span className="mono-tag">Wallet</span>
        </h1>
      </div>

      {/* 余额横幅：accent→eco 渐变，与看板大卡同语言 */}
      <section className="wallet-banner" aria-label="当前余额">
        <div>
          <span className="wallet-banner__label">
            <WalletIcon size={15} aria-hidden="true" /> 当前余额
          </span>
          <strong className="wallet-banner__value">${USER.balance.toFixed(2)}</strong>
        </div>
        <span className="wallet-banner__hint">演示态 · 支付通道未接入</span>
      </section>

      {/* 充值额度 */}
      <section className="card" aria-labelledby="tier-title">
        <h2 className="card__title" id="tier-title">选择充值额度</h2>
        <div className="tier-grid">
          {RECHARGE_TIERS.map(t => (
            <button
              key={t}
              className={`tier${amount === t && !custom ? ' is-active' : ''}`}
              onClick={() => pick(t)}
            >
              <span className="tier__amount">${t}</span>
              <span className="tier__cny">≈ ¥{(t * 7.2).toFixed(0)}</span>
            </button>
          ))}
          <div className={`tier tier--custom${custom ? ' is-active' : ''}`}>
            <input
              className="input"
              type="number"
              min="1"
              placeholder="自定义 $"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              aria-label="自定义充值额度"
            />
          </div>
        </div>
        <div className="wallet-actions">
          <button className="btn btn--accent" disabled>
            充值 ${custom || amount}（演示态暂未开放）
          </button>
        </div>
      </section>

      {/* 充值记录 */}
      <section aria-labelledby="record-title">
        <h2 className="card__title" id="record-title" style={{ paddingLeft: 2 }}>充值记录</h2>
        <DataTable
          columns={columns}
          rows={RECHARGE_RECORDS}
          rowKey="order"
          empty={<EmptyState title="暂无充值记录" />}
        />
      </section>
    </div>
  );
}

export default Wallet;
