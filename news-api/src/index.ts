import App from './components/app/app';
import './global.css';
import rssLogo from './rss-logo.svg';

window.addEventListener('DOMContentLoaded', () => {
    const footerImg = document.querySelector<HTMLImageElement>('footer img');
    if (footerImg) {
        footerImg.src = rssLogo;
    }

    const app = new App();
    app.start();
});
