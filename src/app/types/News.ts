import {type IBaseItemWithUpdated} from "./Common";

export interface ArticleListQueryPayload {
    lang?: string,
    limit?: number,
    page?: number,
    page_size?: number
}

export interface ArticleListResponse {
    Data: Article[]
}

export interface Article extends IBaseItemWithUpdated {
    GUID: string,
    PUBLISHED_ON: number,
    IMAGE_URL: string,
    TITLE: string,
    SUBTITLE: string | null,
    AUTHORS: string,
    URL: string,
    SOURCE_ID: number,
    BODY: string,
    LANG: string,
    UPVOTES: number,
    DOWNVOTES: number,
    SCORE: number
}
