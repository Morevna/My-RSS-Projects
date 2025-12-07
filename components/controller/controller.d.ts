import AppLoader from './appLoader';
import { Article, Source } from '../../types/news-api';
declare class AppController extends AppLoader {
    getSources(callback: (data: Source[]) => void): void;
    getNews(e: MouseEvent, callback: (data: Article[]) => void): void;
}
export default AppController;
//# sourceMappingURL=controller.d.ts.map