import { useMemo, useState } from 'react';
import { Plus, Copy, Trash2, Check } from 'lucide-react';
import DataTable from '../../components/ApiCp/DataTable.jsx';
import EmptyState from '../../components/ApiCp/EmptyState.jsx';
import { TOKENS, TOKEN_GROUPS } from '../../data/api.js';
import '../../components/ApiCp/api.css';
import './Tokens.css';

/* 密钥打码：sk-xxx•••••• 尾 4 位，点击复制完整值 */
const maskKey = k => `${k.slice(0, 9)}••••${k.slice(-4)}`;

function Tokens() {
  const [tokens, setTokens] = useState(TOKENS);
  const [selected, setSelected] = useState(new Set());
  const [keyword, setKeyword] = useState('');
  const [group, setGroup] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const filtered = useMemo(
    () =>
      tokens.filter(
        t =>
          (group === 'all' || t.group === group) &&
          (!keyword || t.name.toLowerCase().includes(keyword.toLowerCase()) || t.key.includes(keyword))
      ),
    [tokens, keyword, group]
  );

  const toggle = id => {
    setSelected(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = allChecked =>
    setSelected(allChecked ? new Set() : new Set(filtered.map(t => t.id)));

  /* 演示态：本地增删，不接后端 */
  const addToken = () => {
    const id = Math.max(...tokens.map(t => t.id), 0) + 1;
    setTokens(ts => [
      ...ts,
      {
        id,
        name: `新令牌 ${id}`,
        status: 'enabled',
        remain: 50,
        total: 50,
        group: 'default',
        key: `sk-ecorem${Math.random().toString(36).slice(2, 16)}`,
        ipLimit: '',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        expiredAt: '永久'
      }
    ]);
  };

  const removeSelected = () => {
    setTokens(ts => ts.filter(t => !selected.has(t.id)));
    setSelected(new Set());
  };

  const copyKey = async t => {
    try {
      await navigator.clipboard.writeText(t.key);
      setCopiedId(t.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch { /* 剪贴板权限失败：演示态忽略 */ }
  };

  const columns = [
    { key: 'name', title: '名称' },
    {
      key: 'status',
      title: '状态',
      render: t => (
        <span className={`dot ${t.status === 'enabled' ? 'dot--eco' : 'dot--muted'}`}>
          {t.status === 'enabled' ? '启用' : '停用'}
        </span>
      )
    },
    {
      key: 'quota',
      title: '剩余 / 总额度',
      align: 'right',
      mono: true,
      render: t => `$${t.remain.toFixed(2)} / $${t.total.toFixed(2)}`
    },
    { key: 'group', title: '分组', mono: true },
    {
      key: 'key',
      title: '密钥',
      mono: true,
      render: t => (
        <span className="key-cell">
          <code>{maskKey(t.key)}</code>
          <button className="key-cell__copy" onClick={() => copyKey(t)} aria-label={`复制密钥 ${t.name}`}>
            {copiedId === t.id ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </span>
      )
    },
    { key: 'ipLimit', title: 'IP 限制', mono: true, render: t => t.ipLimit || '—' },
    { key: 'createdAt', title: '创建时间', mono: true },
    { key: 'expiredAt', title: '过期时间', mono: true }
  ];

  return (
    <div className="api-page">
      <div className="api-page__head">
        <h1 className="api-page__title">
          令牌管理
          <span className="mono-tag">{tokens.length} tokens</span>
        </h1>
      </div>

      <div className="toolbar">
        <button className="btn btn--accent" onClick={addToken}>
          <Plus size={14} aria-hidden="true" /> 添加令牌
        </button>
        <button
          className="btn btn--danger"
          disabled={selected.size === 0}
          onClick={removeSelected}
        >
          <Trash2 size={14} aria-hidden="true" /> 删除所选{selected.size > 0 && ` (${selected.size})`}
        </button>
        <span className="toolbar__spacer" />
        <input
          className="input"
          type="search"
          placeholder="搜索名称 / 密钥"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          aria-label="搜索令牌"
        />
        <select className="input" value={group} onChange={e => setGroup(e.target.value)} aria-label="选择分组">
          <option value="all">全部分组</option>
          {TOKEN_GROUPS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey="id"
        selectable
        selected={selected}
        onToggle={toggle}
        onToggleAll={toggleAll}
        empty={
          <EmptyState
            title={keyword || group !== 'all' ? '搜索无结果' : '还没有令牌'}
            hint="点击「添加令牌」创建你的第一个 API Key"
          />
        }
      />
    </div>
  );
}

export default Tokens;
