// мой запрос- его статус (чтобы если что обработать ошибку)
export enum Status {
    Ok = 'ok',
    Error = 'error',
}
//для фильтрации данных, чтоб выводить новости по категориям
export enum Category {
    General = 'general',
    Business = 'business',
    Technology = 'technology',
}
//выводить при запросе новостей по определенному языку или стране
export type Language = 'en' | 'ar' | 'it' | 'no' | 'ud';
export type Country = 'us' | 'au' | 'no' | 'it' | 'sa' | 'pk' | 'gb';
//описываю источник новостей (с какого сайта)
export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: Category;
    language: Language;
    country: Country;
}
//интерфейс для ответа на запрос, тут статус запроса и массив источников
// мы получаем список доступных источников для последщего выбора
export interface SourcesResponse {
    status: Status;
    sources: Source[];
}
//описывает источник конкрет статьи,
//поможет нам привязать статью к её источнику
export interface ArticleSource {
    id: string | null;
    name: string;
}
//описание статьи - основн интерфейс для работы с отдельными новост в проекте
// для отображения данных на фронтенде
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
//интерфейс для ответа на запрос, который возвращает статьи.
// статус запроса, колво найденных результатов и массив самих статей.
export interface ArticlesResponse {
    status: Status;
    totalResults: number;
    articles: Article[];
}
//Интерфейс для обработки ошибок в коде и информировании пользоват.
// если получаем смс об ошибке от API.
export interface ErrorResponse {
    status: Status;
    message: string;
}
