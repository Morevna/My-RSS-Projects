import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://rss-news-api.onrender.com', {
            apiKey: '',
        });
    }
}

export default AppLoader;
