/* EcoRem API · 演示态数据层
 * 接口形状对齐 one-api / new-api，未来接真后端时：
 *   把 hooks 内的 mock 替换为 fetch('/api/...')，组件零改动。
 * 所有页面只从本文件取数，禁止在组件内硬编码数据。 */

/* ── 用户（演示态免登录） ── */
export const USER = {
  name: 'demo_user',
  role: '普通用户',
  balance: 66.5,
  historyConsumption: 128.35
};

/* ── 看板统计 ── */
export const STATS = {
  requests: 1284,        // 请求次数
  quota: 12.35,          // 统计额度 $
  tokens: 184_620,       // 统计 Tokens
  avgRPM: 3.42,          // 平均 RPM
  avgTPM: 856            // 平均 TPM
};

/* ── 消耗趋势（24h · 2h 一档） ── */
export const TREND = {
  labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  cost: [0.12, 0.05, 0.02, 0.08, 0.42, 0.88, 1.24, 0.96, 1.52, 1.18, 0.74, 0.36],
  tokens: [820, 340, 150, 560, 2980, 6240, 8900, 6850, 10900, 8420, 5300, 2470]
};

/* ── Endpoint 列表（latency: ms，演示态静态值） ── */
export const ENDPOINTS = [
  { tag: '主站', url: 'https://api.ecorem.dev', note: '适合非大陆区域', latency: 186 },
  { tag: '全球', url: 'https://cf.ecorem.dev', note: '稳定可靠 · 生产环境推荐', latency: 342 },
  { tag: '优化', url: 'https://slb.ecorem.dev', note: '优化线路 · 延迟敏感用户推荐', latency: 88 }
];

/* ── 系统公告 ── */
export const NOTICES = [
  { time: '08-15 10:00', type: 'success', text: 'GPT-5 系列模型已上线，分组 auto 自动可用' },
  { time: '08-14 18:30', type: 'accent', text: '优化线路完成扩容，晚高峰延迟下降约 40%' },
  { time: '08-12 09:00', type: 'default', text: 'EcoRem API 公测开启，注册即送 $1 体验额度' }
];

/* ── 令牌（对齐 one-api token 字段） ── */
export const TOKENS = [
  { id: 1, name: 'pi-cli 日常', status: 'enabled', remain: 48.2, total: 50, group: 'default', key: 'sk-ecorem9f2k4x7p1q8w3e5r', ipLimit: '', createdAt: '2025-08-02 14:22', expiredAt: '永久' },
  { id: 2, name: '课程作业助手', status: 'enabled', remain: 9.86, total: 10, group: 'student', key: 'sk-ecorem3m8n2b6v4c1x9z7l', ipLimit: '', createdAt: '2025-08-06 20:11', expiredAt: '2025-09-06' },
  { id: 3, name: '黑客松演示', status: 'disabled', remain: 0, total: 5, group: 'event', key: 'sk-ecorem7q1w5e9r3t6y2u8i', ipLimit: '202.113.0.0/16', createdAt: '2025-07-28 09:47', expiredAt: '已过期' },
  { id: 4, name: '论文润色专用', status: 'enabled', remain: 19.5, total: 20, group: 'default', key: 'sk-ecorem5t8y2u6i1o9p3a7s', ipLimit: '', createdAt: '2025-08-10 16:03', expiredAt: '永久' }
];

export const TOKEN_GROUPS = ['default', 'student', 'event'];

/* ── 用量明细（消费日志） ── */
export const USAGE_LOGS = [
  { time: '08-16 09:42', model: 'gpt-5', prompt: 1820, completion: 640, cost: 0.046 },
  { time: '08-16 09:15', model: 'claude-sonnet-4.5', prompt: 3240, completion: 1180, cost: 0.072 },
  { time: '08-16 08:58', model: 'gpt-5-mini', prompt: 640, completion: 220, cost: 0.004 },
  { time: '08-15 22:31', model: 'gpt-5', prompt: 5120, completion: 2048, cost: 0.128 },
  { time: '08-15 21:07', model: 'gemini-2.5-pro', prompt: 2760, completion: 940, cost: 0.038 },
  { time: '08-15 19:44', model: 'claude-sonnet-4.5', prompt: 1980, completion: 760, cost: 0.045 },
  { time: '08-15 16:20', model: 'gpt-5-mini', prompt: 880, completion: 310, cost: 0.006 },
  { time: '08-15 14:02', model: 'gpt-5', prompt: 4300, completion: 1560, cost: 0.104 }
];

/* ── 充值档位与账单 ── */
export const RECHARGE_TIERS = [10, 30, 50, 100];

export const RECHARGE_RECORDS = [
  { time: '2025-08-10 15:20', amount: 50, method: '微信支付', status: 'success', order: 'EC2025081015203' },
  { time: '2025-08-02 11:08', amount: 30, method: '支付宝', status: 'success', order: 'EC2025080211087' },
  { time: '2025-07-28 09:40', amount: 10, method: '微信支付', status: 'closed', order: 'EC2025072809401' }
];

/* ── 模型广场 ── */
export const MODELS = [
  { name: 'gpt-5', vendor: 'OpenAI', price: 8, tags: ['对话', '编程', '推理'], desc: '旗舰多模态模型，长上下文，编程与推理能力最强', hot: true },
  { name: 'gpt-5-mini', vendor: 'OpenAI', price: 1.6, tags: ['对话', '轻量'], desc: '轻量快速，日常问答与脚本任务的高性价比之选', hot: true },
  { name: 'claude-sonnet-4.5', vendor: 'Anthropic', price: 6, tags: ['对话', '编程', '写作'], desc: '代码与长文写作表现出色，agentic 任务稳定', hot: true },
  { name: 'gemini-2.5-pro', vendor: 'Google', price: 5, tags: ['对话', '多模态'], desc: '百万级上下文，多模态理解能力强', hot: false },
  { name: 'deepseek-v3.2', vendor: 'DeepSeek', price: 0.8, tags: ['对话', '国产'], desc: '国产开源旗舰，中文场景性价比极高', hot: false },
  { name: 'qwen3-max', vendor: '阿里', price: 1.2, tags: ['对话', '国产'], desc: '通义旗舰，中文知识与工具调用均衡', hot: false }
];
