import ScrollMask from './ScrollMask.jsx';
import MembersCarousel from './MembersCarousel.jsx';
import ProfileCard from '../ProfileCard.jsx';
import DriftWall from '../DriftWall.jsx';
import pscImg from '../../assets/psc.jpg';
import hackathonImg from '../../assets/hackathon.jpg';
import lifeImg from '../../assets/生命.jpeg';
import './Members.css';

/* 数据驱动·可扩展：新增成员只需在数组末尾加一项。
 * accent 仅支持 'eco' | 'accent' 两档（对应全站双 accent 提亮版），交替排布。
 * 排序：会长 → 副会长 → 主任 → 部长（职务优先，非幻灯片出现顺序）。
 * 文案：用户幻灯片「OUR MEMBERS」两页真实文案。 */
const MEMBERS = [
  {
    name: '林沛然',
    pinyin: 'Lin Peiran',
    avatarChar: '林',
    role: '会长',
    dept: '主席团',
    org: '农学院 · 农学 2023级',
    quote: '在显微镜下第一次看清花粉的形态时，我知道自己来对了地方。',
    honor: '2025年度优秀会员 · 校生命科学竞赛二等奖',
    tags: ['植物分类', '显微摄影'],
    accent: 'eco'
  },
  {
    name: '苏晚晴',
    pinyin: 'Su Wanqing',
    avatarChar: '苏',
    role: '副会长',
    dept: '活动服务部',
    org: '林学院 · 园林 2022级',
    quote: '每一片叶子都有自己的名字，认识它们是认识世界的开始。',
    honor: '校园植物图鉴项目主理人',
    tags: ['自然观察', '生态调查'],
    accent: 'accent'
  },
  {
    name: '叶蓁蓁',
    pinyin: 'Ye Zhenzhen',
    avatarChar: '叶',
    role: '主任',
    dept: '秘书部',
    org: '理学院 · 应用化学 2024级',
    quote: '把每一次活动安排得妥妥帖帖，就是我的实验艺术。',
    honor: '优秀干事 · 档案整理能手',
    tags: ['活动统筹', '档案管理'],
    accent: 'eco'
  },
  {
    name: '陈屿舟',
    pinyin: 'Chen Yuzhou',
    avatarChar: '陈',
    role: '部长',
    dept: '学术实践部',
    org: '生物科学与工程学院 · 生物技术 2023级',
    quote: '把论文读薄，把问题读厚。',
    honor: '合成生物学读书会发起人',
    tags: ['论文速读', '文献分享'],
    accent: 'accent'
  },
  {
    name: '何田田',
    pinyin: 'He Tiantian',
    avatarChar: '何',
    role: '部长',
    dept: '宣传部',
    org: '食品科学与工程学院 · 食品质量与安全 2024级',
    quote: '让科学的浪漫被更多人看见。',
    honor: '协会视觉主笔 · 年度最佳推送',
    tags: ['科普写作', '视觉设计'],
    accent: 'eco'
  },
  {
    name: '高蕴哲',
    pinyin: 'Gao Yunzhe',
    avatarChar: '高',
    role: '部长',
    dept: '活动服务部',
    org: '动物科学技术学院 · 动物科学 2022级',
    quote: '科普的意义，是把答案交给提问的人。',
    honor: '公益科普讲师 · 志愿服务标兵',
    tags: ['公益科普', '校园讲解'],
    accent: 'accent'
  }
];

/* 成员墙瓷砖：6 张行楷姓氏字卡 × 3 张活动照混排（决策：字卡+照片混排）。
 * 交错排序让各列/各行字卡与照片均匀分布；DriftWall 内部无限复制，重复天然成立。 */
const WALL_ITEMS = [
  { kind: 'char', char: '林', accent: 'eco', title: '林沛然' },
  { kind: 'image', image: pscImg, title: '第一次全体（扩大）会议合影' },
  { kind: 'char', char: '苏', accent: 'accent', title: '苏晚晴' },
  { kind: 'char', char: '叶', accent: 'eco', title: '叶蓁蓁' },
  { kind: 'image', image: hackathonImg, title: '第一届「黑客松」AI 创作大赛合影' },
  { kind: 'char', char: '陈', accent: 'accent', title: '陈屿舟' },
  { kind: 'char', char: '何', accent: 'eco', title: '何田田' },
  { kind: 'image', image: lifeImg, title: '校园星轨夜景' },
  { kind: 'char', char: '高', accent: 'accent', title: '高蕴哲' }
];

function Members() {
  return (
    <section className="members" id="members" aria-labelledby="members-title">
      <ScrollMask>
        <header className="members__head">
          <h2 className="members__title" id="members-title">
            繁花
          </h2>
          <div className="members__head-side">
            <span className="members__index" aria-hidden="true">03 · Members</span>
            <p className="members__gloss">
              每一份好奇，都值得被看见——他们来自不同学院与专业，因为同一份对生命的好奇相聚在启扉。
            </p>
          </div>
        </header>

        <div className="members__wall">
          <DriftWall
            items={WALL_ITEMS}
            lanes={5}
            speed={26}
            grayscale
            ariaLabel="成员墙：六张姓氏字卡与三张活动照片交替漂移"
          />
          <p className="members__wall-caption" aria-hidden="true">
            The Wall · 字卡为序，更多同路人持续生长
          </p>
        </div>

        <MembersCarousel
          items={MEMBERS}
          ariaLabel="协会成员介绍"
          renderItem={member => (
            <ProfileCard
              accent={member.accent}
              avatarChar={member.avatarChar}
              name={member.name}
              pinyin={member.pinyin}
              role={member.role}
              dept={member.dept}
              org={member.org}
              quote={member.quote}
              honor={member.honor}
              tags={member.tags}
              enableMobileTilt={false}
            />
          )}
        />
      </ScrollMask>
    </section>
  );
}

export default Members;
