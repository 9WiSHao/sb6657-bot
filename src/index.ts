import { Context } from 'koishi';
import { Config } from './config';

import { useSearchCommand } from './commands/search';
import { useRandomCommand } from './commands/random';

export const name = 'sb6657-bot';
export { Config };

export function apply(ctx: Context, config: Config) {
    const logger = ctx.logger('sb6657-bot');
    logger.info('sb6656烂梗机器人开始初始化');

    // 搜烂梗命令
    useSearchCommand(ctx, config);
    // 随机一条烂梗命令
    useRandomCommand(ctx, config);
    // TODO 投稿命令

    // TODO 布雷德十五勇士命令
}
