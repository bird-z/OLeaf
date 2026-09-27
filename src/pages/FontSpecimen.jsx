import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../lib/useTheme.js';
import {
  FONT_ASSETS,
  TYPE_ROLES,
  TYPE_SCALE,
  TRACKING_LEADING,
  OFF_SCALE,
  VALIDATION_ITEMS,
  SPECIMEN_COPY
} from '../data/fontCatalog.js';
import './FontSpecimen.css';

/* 字体资产档案 · dev-only 样张页
 *
 * 这是全站字体规划（design.md §4.3）的唯一验证载体：识别结果、候选对照、字阶/字距
 * 候选、离群字号映射、V1–V10 待验证项都在这里。生产构建通过 App.jsx 的
 * import.meta.env.DEV 条件动态 import 排除本页，见 docs/fonts.md。
 */

const FONT_CLASS = {
  'zhi-mang-xing': 'fs-zmx',
  'lemie-qiuxu': 'fs-qiuxu',
  'alimama-shuhei': 'fs-shuhei',
  'ibm-plex-mono': 'fs-plex',
  'geist-variable': 'fs-geist',
  'noto-sans-sc': 'fs-noto',
  'geist-mono': 'fs-geistmono',
  iconfont: 'fs-icon'
};

const WIDTHS = [320, 375, 414, 768, 1440];

const ROLE_CLASS = {
  '--font-display': 'fs-zmx',
  '--font-body': 'fs-geist',
  '--font-mono': 'fs-geistmono'
};

const MONO_SAMPLE = `${SPECIMEN_COPY.numerals}`;

function Section({ title, note, children }) {
  return (
    <section className="fs-section">
      <header className="fs-section__head">
        <h2>{title}</h2>
      </header>
      {note && <p className="fs-note">{note}</p>}
      {children}
    </section>
  );
}

export default function FontSpecimen() {
  const { resolvedTheme, setTheme } = useTheme();
  const [width, setWidth] = useState(1440);
  const [rootSize, setRootSize] = useState('18');
  const prevRoot = useRef('');

  /* 根字号演示：临时改 documentElement 行内 font-size，离开本页还原。
   * 站内 rem 令牌全部以根字号换算，这里是 V5/V7 两档对照的唯一办法。 */
  useEffect(() => {
    const root = document.documentElement;
    prevRoot.current = root.style.fontSize;
    root.style.fontSize = `${rootSize}px`;
    return () => {
      root.style.fontSize = prevRoot.current;
    };
  }, [rootSize]);

  const themeLabel = resolvedTheme === 'dark' ? '星轨暗场' : '图鉴纸本';

  const offScaleGrouped = useMemo(() => {
    const order = ['template', 'orphan', 'live', 'root'];
    return [...OFF_SCALE].sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  }, []);

  return (
    <div className="font-specimen">
      <div className="fs-bar">
        <h1>
          字体样张
          <span className="fs-devflag">dev only</span>
        </h1>
        <span className="fs-bar__spacer" />

        <div className="fs-bar__group">
          <span className="fs-bar__label">主题</span>
          <button
            type="button"
            className="fs-btn"
            data-active={resolvedTheme === 'dark'}
            onClick={() => setTheme('dark')}
          >
            暗场
          </button>
          <button
            type="button"
            className="fs-btn"
            data-active={resolvedTheme === 'light'}
            onClick={() => setTheme('light')}
          >
            纸本
          </button>
        </div>

        <div className="fs-bar__group">
          <span className="fs-bar__label">根字号</span>
          {['18', '16'].map((s) => (
            <button
              key={s}
              type="button"
              className="fs-btn"
              data-active={rootSize === s}
              onClick={() => setRootSize(s)}
            >
              {s}px
            </button>
          ))}
        </div>

        <div className="fs-bar__group">
          <span className="fs-bar__label">视口</span>
          {WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              className="fs-btn"
              data-active={width === w}
              onClick={() => setWidth(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="fs-viewport" style={{ maxWidth: width, margin: '0 auto' }}>
        <p className="fs-viewport__ruler">
          当前：{width}px · 根字号 {rootSize}px · {themeLabel}（{resolvedTheme}）
        </p>

        <Section
          title="一 · 字体资产总表（识别结果）"
          note="数据由 fontTools 读取 woff2/ttf 的 name / cmap / OS-2 表得到。status：in-use 生产在用 / unreferenced 全站无人引用 / icon 图标字形。"
        >
          <div className="fs-tablewrap">
            <table className="fs-table">
              <thead>
                <tr>
                  <th>字体</th>
                  <th>类别</th>
                  <th>字样</th>
                  <th>文件 · 来源</th>
                  <th>体积</th>
                  <th>字形</th>
                  <th>许可</th>
                  <th>现状</th>
                  <th>判决项</th>
                </tr>
              </thead>
              <tbody>
                {FONT_ASSETS.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <strong>{f.family}</strong>
                      <br />
                      <span className="fs-spec__meta">{f.cn}</span>
                    </td>
                    <td>{f.kind}</td>
                    <td>
                      <span className={FONT_CLASS[f.id]}>
                        {f.kind === 'icon' ? (
                          <span className="fs-icon" style={{ fontSize: 18 }}>
                            {'\ue6e8'}
                          </span>
                        ) : (
                          '生物启扉 Aa 0123'
                        )}
                      </span>
                    </td>
                    <td>
                      {f.file}
                      <br />
                      <span className="fs-spec__meta">{f.origin}</span>
                    </td>
                    <td>{f.size}</td>
                    <td>{f.codepoints}</td>
                    <td>{f.license}</td>
                    <td>
                      <span className="fs-status" data-status={f.status}>
                        {f.status}
                      </span>
                    </td>
                    <td>{f.verdict || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="fs-note fs-note--warn">
            注意：lemie-qiuxu 版权声明为“All rights reserved”，仓库内无许可文件 —— 默认不接入生产。
          </p>

          <div className="fs-grid">
            {FONT_ASSETS.filter((f) => f.style).map((f) => (
              <article className="fs-spec" key={f.id}>
                <header className="fs-spec__head">
                  <span className="fs-spec__name">{f.family}</span>
                  <span className="fs-spec__meta">{f.cn}</span>
                </header>
                <div className={`fs-spec__sample ${FONT_CLASS[f.id]}`}>生物启扉 · 生命</div>
                <ul className="fs-item__alts">
                  <li>骨架：{f.style.skeleton}</li>
                  <li>对比：{f.style.contrast}</li>
                  <li>端点：{f.style.terminals}</li>
                  <li>中宫：{f.style.counter}</li>
                  <li>字宽：{f.style.width}</li>
                  <li>语气：{f.style.mood}</li>
                  <li>混排：{f.style.mix}</li>
                </ul>
                {f.styleNote && <p className="fs-note fs-note--warn">{f.styleNote}</p>}
              </article>
            ))}
          </div>
        </Section>

        <Section
          title="二 · 候选对照台"
          note="同一组真实站内文案并排，比较 display / mono / body 三类候选。"
        >
          <h3 className="fs-spec__meta">Display 台</h3>
          <div className="fs-grid">
            {[
              { key: 'zhi-mang-xing', name: 'Zhi Mang Xing（现用）' },
              { key: 'lemie-qiuxu', name: 'Lemie QiuXu（未授权）' },
              { key: 'alimama-shuhei', name: 'Alimama ShuHeiTi' },
              { key: 'noto-sans-sc', name: 'Noto Sans SC 900', weight: 900 }
            ].map((c) => (
              <article className="fs-spec" key={c.key}>
                <header className="fs-spec__head">
                  <span className="fs-spec__name">{c.name}</span>
                </header>
                <div
                  className={`fs-spec__sample ${FONT_CLASS[c.key]}`}
                  style={c.weight ? { fontWeight: c.weight } : undefined}
                >
                  {SPECIMEN_COPY.d1Lines.join(' ')}
                </div>
                <div
                  className={`fs-spec__sub ${FONT_CLASS[c.key]}`}
                  style={c.weight ? { fontWeight: c.weight } : undefined}
                >
                  {SPECIMEN_COPY.sectionTitles.join(' · ')}
                </div>
              </article>
            ))}
          </div>

          <h3 className="fs-spec__meta" style={{ marginTop: 'var(--space-md)' }}>
            Mono 台
          </h3>
          <div className="fs-grid">
            {[
              { key: 'geist-mono', name: 'Geist Mono（现用）', weight: 400 },
              { key: 'geist-mono', name: 'Geist Mono 500', weight: 500 },
              { key: 'ibm-plex-mono', name: 'IBM Plex Mono 400', weight: 400 },
              { key: 'ibm-plex-mono', name: 'IBM Plex Mono 500', weight: 500 }
            ].map((c, i) => (
              <article className="fs-spec" key={`${c.key}-${c.weight}-${i}`}>
                <header className="fs-spec__head">
                  <span className="fs-spec__name">{c.name}</span>
                </header>
                <div
                  className={`fs-spec__sample fs-spec__sample--mono ${FONT_CLASS[c.key]}`}
                  style={{ fontWeight: c.weight }}
                >
                  {MONO_SAMPLE}
                </div>
                <div className={`fs-spec__sub ${FONT_CLASS[c.key]}`} style={{ fontWeight: c.weight }}>
                  {SPECIMEN_COPY.monoLabels.join(' / ')}
                </div>
              </article>
            ))}
          </div>

          <h3 className="fs-spec__meta" style={{ marginTop: 'var(--space-md)' }}>
            Body 台（中英混排）
          </h3>
          <div className="fs-grid">
            {[
              { key: 'geist', family: 'Geist Variable', weight: 400, cls: 'fs-geist' },
              { key: 'geist-600', family: 'Geist 600', weight: 600, cls: 'fs-geist' },
              { key: 'noto', family: 'Noto Sans SC 400', weight: 400, cls: 'fs-noto' },
              { key: 'noto-700', family: 'Noto Sans SC 700', weight: 700, cls: 'fs-noto' },
              { key: 'noto-800', family: 'Noto Sans SC 800', weight: 800, cls: 'fs-noto' }
            ].map((c) => (
              <article className="fs-spec" key={c.key}>
                <header className="fs-spec__head">
                  <span className="fs-spec__name">{c.family}</span>
                </header>
                <div className={`fs-spec__sub ${c.cls}`} style={{ fontWeight: c.weight }}>
                  {SPECIMEN_COPY.cardNames.join(' · ')}
                  <br />
                  BioQif Association · 2026
                </div>
              </article>
            ))}
          </div>
          <p className="fs-note">{SPECIMEN_COPY.body}</p>
        </Section>

        <Section
          title="三 · 真实角色复刻 D1–M"
          note="用真实站内文案与真实底色，按 design.md §4.1 的六级角色陈列。"
        >
          {TYPE_ROLES.map((r) => (
            <article className="fs-role" key={r.id}>
              <header className="fs-role__head">
                <span className="fs-role__id">{r.id}</span>
                <span className="fs-role__name">{r.name}</span>
                <span className="fs-role__spec">
                  {r.family} · {r.size} · {r.weight} · {r.tracking} · {r.cases} · {r.color}
                </span>
                <span className="fs-role__spec">锚点：{r.anchor}</span>
              </header>
              <div className={`fs-surface ${r.id.startsWith('D') ? 'fs-surface--photo' : 'fs-surface--paper'}`}>
                <div className={ROLE_CLASS[r.family]}>
                  <div style={{ fontSize: r.id === 'D1' ? 'var(--text-display)' : undefined, color: 'inherit' }}>
                    {r.sample}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </Section>

        <Section title="四 · 字阶候选（V5）" note="每个候选令牌渲染一次，核对 1.25 主三度是否连续。">
          <div className="fs-scale">
            {TYPE_SCALE.map((t) => (
              <div className="fs-scale__row" key={t.token}>
                <span className="fs-scale__id">
                  {t.token} · {t.value} · {t.px18}
                  {t.note ? ` · ${t.note}` : ''}
                </span>
                <span
                  className={`fs-scale__sample ${
                    t.token.includes('display') ? 'fs-scale__sample--display' : ''
                  }`}
                  style={{ fontSize: `var(${t.token})` }}
                >
                  启迪生命 BioQif 0123
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="五 · 字距 / 行高候选（V6）" note="按 D/T/L/U/M 每级一档 tracking / leading。">
          <div className="fs-tablewrap">
            <table className="fs-table">
              <thead>
                <tr>
                  <th>级</th>
                  <th>字族</th>
                  <th>tracking</th>
                  <th>leading</th>
                  <th>样例</th>
                </tr>
              </thead>
              <tbody>
                {TRACKING_LEADING.map((t) => (
                  <tr key={t.role}>
                    <td>{t.role}</td>
                    <td>{t.family}</td>
                    <td>{t.tracking}</td>
                    <td>{t.leading}</td>
                    <td>
                      <span
                        className={ROLE_CLASS[`--font-${t.family}`]}
                        style={{
                          letterSpacing: t.tracking,
                          lineHeight: t.leading,
                          display: 'inline-block',
                          maxWidth: '38ch',
                          textTransform: t.role === 'M' ? 'uppercase' : 'none'
                        }}
                      >
                        {t.role === 'M'
                          ? SPECIMEN_COPY.monoLabels[0]
                          : t.role === 'D'
                            ? SPECIMEN_COPY.sectionTitles[0]
                            : SPECIMEN_COPY.ui.slice(0, 3).join(' · ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="六 · 刻度外 font-size 映射（V7）"
          note="kind：live 生产在用 / orphan Mapp 演示页孤儿样式（无人 import）/ template Vite 模板遗留 / root 根字号定义。"
        >
          <div className="fs-tablewrap">
            <table className="fs-table">
              <thead>
                <tr>
                  <th>来源</th>
                  <th>值</th>
                  <th>上下文</th>
                  <th>kind</th>
                  <th>建议</th>
                  <th>映射后</th>
                </tr>
              </thead>
              <tbody>
                {offScaleGrouped.map((o) => (
                  <tr key={`${o.file}-${o.line}`} data-kind={o.kind}>
                    <td>
                      {o.file}:{o.line}
                    </td>
                    <td>{o.value}</td>
                    <td>{o.context}</td>
                    <td>
                      <span className="fs-tag" data-kind={o.kind}>
                        {o.kind}
                      </span>
                    </td>
                    <td>{o.proposal}</td>
                    <td>
                      {o.proposal.startsWith('--text-') ? (
                        <span style={{ fontSize: `var(${o.proposal.split(/[（(]/)[0].trim()})` }}>
                          Aa 生物启扉
                        </span>
                      ) : (
                        <span className="fs-spec__meta">{o.proposal}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="七 · 待验证项 V1–V10"
          note="逐项确认后把状态写回 docs/fonts.md；未确认项不实现。"
        >
          <div className="fs-items">
            {VALIDATION_ITEMS.map((v) => (
              <article className="fs-item" key={v.id} data-item={v.id}>
                <div className="fs-item__top">
                  <span className="fs-item__id">{v.id}</span>
                  <span className="fs-item__title">{v.title}</span>
                  <span className="fs-badge">待验证</span>
                </div>
                <p className="fs-item__q">{v.question}</p>
                <p className="fs-item__rec">
                  <strong>推荐：</strong>
                  {v.recommendation}
                </p>
                <ul className="fs-item__alts">
                  {v.alternatives.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
