export declare enum Status {
    Ok = "ok",
    Error = "error"
}
export declare enum Category {
    General = "general",
    Business = "business",
    Technology = "technology"
}
export type Language = 'en' | 'ar' | 'it' | 'no' | 'ud';
export type Country = 'us' | 'au' | 'no' | 'it' | 'sa' | 'pk' | 'gb';
export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: Category;
    language: Language;
    country: Country;
}
export interface SourcesResponse {
    status: Status;
    sources: Source[];
}
export interface ArticleSource {
    id: string | null;
    name: string;
}
export interface Article {
    source: ArticleSource;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}
export interface ArticlesResponse {
    status: Status;
    totalResults: number;
    articles: Article[];
}
export interface ErrorResponse {
    status: Status;
    message: string;
}
//# sourceMappingURL=news-api.d.ts.map