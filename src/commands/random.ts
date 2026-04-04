import { Context } from 'koishi';
import { Config } from '../config';
import { getRandomMeme } from '../api';
import { easyFormatTime } from '../utils/day';
import { getDisplayTags } from '../utils/tag';

export function useRandomCommand(ctx: Context, config: Config) {
    const logger = ctx.logger('sb6657-bot-random');

    ctx.command('随机', '随机一条烂梗', {
        minInterval: config.minInterval,
    })
        .alias('random', '随机烂梗', '抽烂梗')
        .action(async ({ session }) => {
            if (!session || !session.user) return '无法获取用户信息，请重试';

            const { flatData, _failure, err } = await getRandomMeme(ctx);
            if (_failure || !flatData?.barrage) {
                logger.error('网络请求炸了:', err);
                return `随机烂梗 后端接口炸了，请寻求维护者提供帮助。错误信息: ${err}`;
            }
            return `<at id="${session.userId}"/> #${flatData.tags}
${flatData.barrage}
tag: ${getDisplayTags(flatData.tags)
                .map((t) => t.label)
                .join(' ')}
复制数${flatData.cnt} - 投稿日期${easyFormatTime(flatData.submitTime)}`;
        });
}
