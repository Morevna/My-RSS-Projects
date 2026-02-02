import './components.css';
export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  const logo = document.createElement('a');
  logo.href = 'https://rs.school/';
  logo.target = '_blank';
  logo.rel = 'noopener noreferrer';
  const logoImg = document.createElement('img');
  logoImg.src = 'rss-logo.svg';
  logoImg.alt = 'logo RS School';
  const rssName = document.createElement('div');
  rssName.textContent = 'RS School';

  logo.append(logoImg, rssName);

  const authorName = document.createElement('div');
  authorName.textContent = 'Maria';
  const githubLink = document.createElement('a');
  githubLink.href = 'https://github.com/Morevna/';
  githubLink.textContent = 'my GH';
  githubLink.target = '_blank';
  githubLink.rel = 'noopener noreferrer';
  const year = document.createElement('span');
  year.textContent = '2026';

  footer.append(logo, authorName, githubLink, year);

  return footer;
}
