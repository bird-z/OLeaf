import { useTheme } from '../lib/useTheme.js';
import './ThemeToggle.css';

/* ThemeToggle —— 导航栏的主题切换按钮
 *
 * 图标来自 src/assets/font_f3y78zakpcq（iconfont 导出 · 单字形「主题切换」U+E6E8），
 * 字形经 ThemeToggle.css 的 @font-face 直接引用 ttf，不加载其 iconfont.css，
 * 以免 .iconfont 的 font-size:16px !important 与项目字体/尺寸体系冲突。
 *
 * 交互：单击在昼夜之间切换；右键 / 长按回到「跟随系统」。
 */
function ThemeToggle({ className = '' }) {
  const { theme, resolvedTheme, toggle, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleClick = () => {
    /* 过渡策略由 setTheme 内部统一处理：
     * 支持 View Transitions 时整页交叉淡入，否则回退到一次性颜色过渡。 */
    toggle();
  };

  const handleContextMenu = event => {
    event.preventDefault();
    setTheme('system');
  };

  const currentName = isDark ? '夜间 · 星轨暗场' : '昼间 · 图鉴纸本';
  const nextName = isDark ? '昼间 · 图鉴纸本' : '夜间 · 星轨暗场';

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      data-mode={resolvedTheme}
      data-follow={theme === 'system' || undefined}
      aria-label={`当前为${currentName}，切换到${nextName}`}
      title={`${currentName}（右键跟随系统）`}
    >
      <span className="theme-toggle__icon" aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;
