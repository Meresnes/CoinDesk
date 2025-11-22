import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../config";
import {type Article, type ArticleListQueryPayload, type ArticleListResponse} from "../types/News";

export const newsService = createApi({
    reducerPath: "newsService",
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: (builder) => ({
        getLatestArticles: builder.query<ArticleListResponse, ArticleListQueryPayload>({
            query: (paramsKeys: ArticleListQueryPayload) => ({
                url: "/news/v1/article/list",
                method: "GET",
                params: {
                    lang: "EN",
                    limit: 12,
                    ...paramsKeys
                }
            }),
            transformResponse: (data: {Data: Article[]}) => {
                return {
                    Data: data.Data
                };
            }
        }),
    })
});

export const {useGetLatestArticlesQuery} = newsService;