import raw from '../assets/icons/microscope.svg?raw'

/* 显微镜图标（自 ~/work/bioqif.com/assets/icons/microscope.svg 迁移）。
 * 原 SVG 硬编码 bioqif 四色，这里在注入前把 fill 换为 shnda 令牌变量，
 * 保留四色可辨识度的同时跟随明暗主题。 */
const COLOR_MAP = [
  ['fill="#2E7D5B"', 'style="fill:var(--color-eco)"'],
  ['fill="#5B2A86"', 'style="fill:var(--color-accent-bright)"'],
  ['fill="#C2402E"', 'style="fill:var(--color-brass)"'],
  ['fill="#0C3B2E"', 'style="fill:var(--color-eco)"'],
  ['fill="#1A5741"', 'style="fill:var(--color-eco)"'],
  ['fill="#FFFFFF"', 'style="fill:var(--color-paper-dark)"'],
  ['fill=""', 'style="fill:var(--color-photo-ink)"'],
]

const svg = COLOR_MAP.reduce((acc, [from, to]) => acc.replaceAll(from, to), raw)

function QifMicroscope({ className = '' }) {
  return (
    <span
      className={`qif-microscope ${className}`.trim()}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default QifMicroscope
