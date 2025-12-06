import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { Article, Source } from '../../types/news-api';

class App {
    private controller: AppController = new AppController();
    private view: AppView = new AppView();
    constructor() {}

    start(): void {
        const sourcesElement = document.querySelector('.sources');
        if (sourcesElement) {
            sourcesElement.addEventListener('click', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                this.controller.getNews(mouseEvent, (data: Article[]) => this.view.drawNews(data));
            });
        }
        this.controller.getSources((data: Source[]) => this.view.drawSources(data));
    }
}

export default App;
