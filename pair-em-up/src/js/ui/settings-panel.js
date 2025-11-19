export function createSettingsPanel() {
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.className = 'settings-overlay';

    const panel = document.createElement('div');
    panel.className = 'settings-panel';

    const title = document.createElement('h3');
    title.textContent = '⚙️ Settings';
    panel.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.className = 'close-btn';
    closeBtn.addEventListener('click', toggleSettingsPanel);
    panel.appendChild(closeBtn);

    const themeSection = document.createElement('div');
    themeSection.className = 'setting-section';

    const themeTitle = document.createElement('h4');
    themeTitle.textContent = 'Display control';
    themeSection.appendChild(themeTitle);

    const lightDarkBtn = document.createElement('button');
    lightDarkBtn.textContent = 'Dark / Light';
    lightDarkBtn.addEventListener('click', () => switchTheme('dark-light'));
    themeSection.appendChild(lightDarkBtn);

    const halloweenBtn = document.createElement('button');
    halloweenBtn.textContent = 'Halloween';
    halloweenBtn.addEventListener('click', () => switchTheme('halloween'));
    themeSection.appendChild(halloweenBtn);


    const christmasBtn = document.createElement('button');
    christmasBtn.textContent = 'Christmas';
    christmasBtn.addEventListener('click', () => switchTheme('christmas'));
    themeSection.appendChild(christmasBtn);

    panel.appendChild(themeSection);
    overlay.appendChild(panel);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) toggleSettingsPanel();
    });

    return overlay;
}

export function toggleSettingsPanel() {
    let overlay = document.getElementById('settings-overlay');

    if (!overlay) {
        overlay = createSettingsPanel();
        document.body.appendChild(overlay);
    }

    const isVisible = overlay.getAttribute('data-visible') === 'true';
    overlay.setAttribute('data-visible', (!isVisible).toString());
}


function switchTheme(theme) {
    const body = document.body;

    if (theme === 'dark-light') {
        body.classList.remove('theme-halloween', 'theme-christmas');
        body.classList.toggle('theme-dark');
        localStorage.setItem('game-theme', body.classList.contains('theme-dark') ? 'dark' : 'default');
        return;
    }

    body.classList.remove('theme-dark', 'theme-halloween', 'theme-christmas');

    if (theme === 'halloween') {
        body.classList.add('theme-halloween');
        localStorage.setItem('game-theme', 'halloween');
    } else if (theme === 'christmas') {
        body.classList.add('theme-christmas');
        localStorage.setItem('game-theme', 'christmas');
    }
}


export function applyInitialTheme() {
    const savedTheme = localStorage.getItem('game-theme');
    if (!savedTheme || savedTheme === 'default') return;

    document.body.classList.add(`theme-${savedTheme}`);
}
