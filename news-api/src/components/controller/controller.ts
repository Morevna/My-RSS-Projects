import AppLoader from './appLoader';
import { Article, ArticlesResponse, Source, SourcesResponse } from '../../types/news-api';

class AppController extends AppLoader {
    //Получает список источников новостей и отдаёт их в callback.
    getSources(callback: (data: Source[]) => void): void {
        super.getResp<SourcesResponse>({ endpoint: 'mocks/sources' }, (data) => {
            callback(data.sources);
        });
    }
    //вызывается при клике по списку источников
    // возвращает массив новостей
    getNews(e: MouseEvent, callback: (data: Article[]) => void): void {
        let target = e.target as HTMLElement;
        const newsContainer = e.currentTarget as HTMLElement;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId as string);

                    super.getResp<ArticlesResponse>(
                        {
                            endpoint: 'everything',
                            options: { sources: sourceId ?? '' },
                        },
                        (data) => {
                            callback(data.articles);
                        }
                    );
                }
                return;
            }
            target = target.parentElement as HTMLElement;
        }
    }
}

export default AppController;
