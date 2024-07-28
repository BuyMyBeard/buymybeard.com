let theme;
let codeTheme;
let dark = false;
function setTheme(style) {
    theme.href = style;
    localStorage.setItem('theme', style);
}

function setCodeTheme(style) {
    localStorage.setItem('codeTheme', style);
    if (codeTheme != null) {
        codeTheme.href = style;
    }
}

function toggleTheme() {
    if (!dark) {
        setTheme('css/sakura-dark.css');
        setCodeTheme('./highlight.js/styles/dark.min.css')
    }
    else {
        setTheme('css/sakura.css');
        setCodeTheme('./highlight.js/styles/default.min.css');
    }
    dark = !dark;
}

document.addEventListener("DOMContentLoaded", () => {
    theme = document.getElementById("theme");
    codeTheme = document.getElementById("codeTheme");
    const localStorageTheme = localStorage.getItem('theme');
    if (localStorageTheme) {
        dark = localStorageTheme == 'css/sakura-dark.css';
        setTheme(localStorageTheme);
    }
    const localStorageCodeTheme = localStorage.getItem('codeTheme');
    if (localStorageCodeTheme) {
        setCodeTheme(localStorageCodeTheme);
    }
});