function createSettingsPanel() {
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.className = 'settings-overlay';

    const panel = document.createElement('div');
    panel.id = 'settings-panel';
    panel.className = 'settings-panel';

    const title = document.createElement('h3');
    title.textContent = '⚙️ Settings';
    panel.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.className = 'close-btn';
    closeBtn.addEventListener('click', toggleSettingsPanel);
    panel.appendChild(closeBtn);

    // звук

    // темы////
    const themeSection = document.createElement('div');
    themeSection.className = 'setting-section';
    const themeTitle = document.createElement('h4');
    themeTitle.textContent = 'display control ';
    themeSection.appendChild(themeTitle);

    // 
    const lightDarkToggle = document.createElement('button');
    lightDarkToggle.textContent = 'Dark /Light';
    lightDarkToggle.className = 'theme-toggle-btn';
    lightDarkToggle.addEventListener('click', () => switchTheme('dark-light'));
    themeSection.appendChild(lightDarkToggle);

    // 
    const halloweenToggle = document.createElement('button');
    halloweenToggle.textContent = 'Halloween';
    halloweenToggle.className = 'theme-toggle-btn';
    halloweenToggle.addEventListener('click', () => switchTheme('halloween'));
    themeSection.appendChild(halloweenToggle);

    //
    const christmasToggle = document.createElement('button');
    christmasToggle.textContent = 'Сhristmas';
    christmasToggle.className = 'theme-toggle-btn';
    christmasToggle.addEventListener('click', () => switchTheme('christmas'));
    themeSection.appendChild(christmasToggle);

    panel.appendChild(themeSection);
    overlay.appendChild(panel);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            toggleSettingsPanel();
        }
    });

    return overlay;
}

// закрыть панель
export function toggleSettingsPanel() {
    let overlay = document.getElementById('settings-overlay');

    if (!overlay) {
        overlay = createSettingsPanel();
        document.body.appendChild(overlay);
        overlay.setAttribute('data-visible', 'true');
    } else {
        const isVisible = overlay.getAttribute('data-visible') === 'true';
        overlay.setAttribute('data-visible', (!isVisible).toString());
    }
}

//переключение тем
function switchTheme(newTheme) {
    const themeTarget = document.body;
    themeTarget.classList.remove('theme-dark', 'theme-light', 'theme-halloween', 'theme-christmas');

    if (newTheme === 'dark-light') {
        if (themeTarget.classList.contains('theme-dark')) {
            localStorage.setItem('game-theme', 'default');
        } else {
            themeTarget.classList.add('theme-dark');
            localStorage.setItem('game-theme', 'dark');
        }
    } else if (newTheme === 'halloween') {
        themeTarget.classList.add('theme-halloween');
        localStorage.setItem('game-theme', 'halloween');
    } else if (newTheme === 'christmas') {
        themeTarget.classList.add('theme-christmas');
        localStorage.setItem('game-theme', 'christmas');
    }
}

// 
export function applyInitialTheme() {
    const savedTheme = localStorage.getItem('game-theme') || 'default';
    const themeTarget = document.body;

    if (savedTheme !== 'default') {
        themeTarget.classList.add(`theme-${savedTheme}`);
    }
}