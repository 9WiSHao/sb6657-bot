import { Context, Schema } from 'koishi';

declare module 'koishi' {
    interface User {
        usage: Record<string, number>;
    }
    namespace Command {
        interface Config {
            minInterval?: number;
            maxUsage?: number;
        }
    }
}

export const name = 'sb6657-bot';

// ==========================================
// 1. 定义配置项的 TypeScript 接口 (Interface)
// ==========================================
export interface Config {
    minInterval: number;
    defaultMaxUsage: number;
    customLimits: { userId: string; maxUsage: number }[];
}

// ==========================================
// 2. 定义控制台的可视化配置项面板 (Schema)
// ==========================================
export const Config: Schema<Config> = Schema.object({
    minInterval: Schema.number().default(5000).description('每次指令触发的冷却时间 (毫秒)'),
    defaultMaxUsage: Schema.number().default(10).description('普通群友每天的默认搜索次数'),
    customLimits: Schema.array(
        Schema.object({
            userId: Schema.string().required().description('需要提权的 QQ 号'),
            maxUsage: Schema.number().required().description('该用户每天允许的最高次数'),
        })
    )
        .default([])
        .description('VIP 用户的自定义次数白名单（可在右侧添加多条）'),
});

// ==========================================
// 3. 定义接口返回的数据结构
// ==========================================
interface MemeItem {
    id: number;
    barrage: string;
    cnt: string;
    tags: string;
    submitTime: string;
}

interface MemeResponse {
    code: number;
    msg: string;
    data?: {
        list: MemeItem[];
        total: number;
        lastPage: boolean;
    };
}

// ==========================================
// 4. 插件核心逻辑
// ==========================================
export function apply(ctx: Context, config: Config) {
    const logger = ctx.logger('sb6657-bot');
    const absoluteMax = config.customLimits.reduce((max, item) => Math.max(max, item.maxUsage), config.defaultMaxUsage);

    ctx.command('搜烂梗 <keyword:text>', '根据关键词搜索烂梗', {
        minInterval: config.minInterval,
        maxUsage: absoluteMax,
    })
        .userFields(['usage'])
        .action(async ({ session }, keyword) => {
            if (!keyword || !keyword.trim()) return '请输入搜索关键词';

            if (!session || !session.user) return '无法获取用户信息，请重试';

            const customConfig = config.customLimits.find((c) => c.userId === session.userId);
            const currentLimit = customConfig ? customConfig.maxUsage : config.defaultMaxUsage;

            const todayUsage = (session.user.usage && session.user.usage['搜烂梗']) || 0;

            if (todayUsage >= currentLimit) {
                return `<at id="${session.userId}"/> 今天的 ${currentLimit} 次烂梗搜索额度已经用完，请静待0点刷新`;
            }

            try {
                const payload = {
                    barrage: keyword.trim(),
                    pageNum: 1,
                    pageSize: 5,
                    sort: 1,
                };

                // 指定返回值的类型为 MemeResponse
                const res = await ctx.http.post<MemeResponse>('https://hguofichp.cn:10086/machine/pageSearch', payload);
                const { code, data } = res;

                if (code !== 200 || !data || !data.list || data.list.length === 0) {
                    return `关键词「${keyword.trim()}」没有找到搜索结果。想要补充更多烂梗？请去sb6657首页投稿！`;
                }

                const rawText = data.list.map((item, index) => `${index + 1}. ${item.barrage}`).join('\n');

                if (rawText.length > 150) {
                    const messageNodes = data.list.map((item, index) => `<message>${index + 1}. ${item.barrage}</message>`).join('');

                    return `
                        <message><at id="${session.userId}"/> 关键词「${keyword.trim()}」结果字数较多,见聊天记录:</message>
                        <message forward>
                            ${messageNodes}
                        </message>`;
                } else {
                    return `<at id="${session.userId}"/> 搜到了!关键词「${keyword.trim()}」结果如下：\n${rawText}`;
                }
            } catch (error) {
                logger.error('网络请求炸了:', error);
                return '后端接口炸了，请寻求维护者提供帮助';
            }
        });
}
