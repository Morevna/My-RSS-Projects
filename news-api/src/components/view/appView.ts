import News from './news/news';
import Sources from './sources/sources';
import { Article, Source, ArticlesResponse, SourcesResponse } from '../../types/news-api';

export class AppView {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: ArticlesResponse): void {
        const values: Article[] = data?.articles ?? [];
        this.news.draw(values);
    }
    drawSources(data: SourcesResponse): void {
        const values: Source[] = data?.sources ?? [];
        this.sources.draw(values);
    }
}

export default AppView;
