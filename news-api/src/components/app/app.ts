import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
    private controller = new AppController();
    private view = new AppView();
    constructor() {}

    start(): void {
        const sourcesElement = document.querySelector('.sources') as HTMLElement | null;
        if (sourcesElement) {
            sourcesElement.addEventListener('click', (e: MouseEvent) =>
                this.controller.getNews(e, (data) => this.view.drawNews(data))
            );
        }
        this.controller.getSources((data) => this.view.drawSources(data));
    }
}

export default App;
