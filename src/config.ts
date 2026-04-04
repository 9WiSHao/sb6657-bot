import { Schema } from 'koishi';

// 1. 定义配置项的接口
export interface Config {
    minInterval: number;
    defaultMaxUsage: number;
    customLimits: { userId: string; maxUsage: number }[];
}

// 2. 定义可视化面板
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
