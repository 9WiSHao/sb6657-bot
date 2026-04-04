// 0: 按id排序, 1: 按复制次数排序
export enum SortType {
    ID = 0,
    COPY = 1,
}
export interface searchMeme_req {
    barrage: string;
    tags?: string;
    submitTime?: [string, string];
    sort: SortType;
    pageSize: number;
    pageNum: number;
}
export interface searchMemeElement {
    id: number;
    barrage: string;
    cnt: string;
    tags: string;
    submitTime: string;
}
export interface searchMeme_res {
    total: number;
    list: searchMemeElement[];
    isLastPage: boolean;
}
