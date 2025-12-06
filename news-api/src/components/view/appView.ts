import News from './news/news';
import Sources from './sources/sources';
import { Article, Source } from '../../types/news-api';

export class AppView {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: Article[]): void {
        this.news.draw(data);
    }

    drawSources(data: Source[]): void {
        this.sources.draw(data);
    }
}

export default AppView;
