import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://rss-news-api.onrender.com', {
            apiKey: '2a0a38fdb687463ab03c46fdb20faee1',
        });
    }
}

export default AppLoader;
