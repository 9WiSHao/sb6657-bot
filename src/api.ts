import { Context } from 'koishi';
import { searchMeme_req, searchMeme_res } from './types';
import { Res, post } from './utils/request';

const BACK_END_URL = 'https://hguofichp.cn:10086';

export async function searchMemes(ctx: Context, keyword: string): Promise<Res<searchMeme_res>> {
    const payload: searchMeme_req = {
        barrage: keyword.trim(),
        pageNum: 1,
        pageSize: 5,
        sort: 1,
    };
    return await post<searchMeme_req, searchMeme_res>(ctx, {
        url: `${BACK_END_URL}/machine/pageSearch`,
        data: payload,
    });
}
