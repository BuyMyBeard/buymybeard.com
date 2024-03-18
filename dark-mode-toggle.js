let theme;
let dark = false;
function setTheme(style) {
    theme.href = style;
    localStorage.setItem('theme', style);
}

function toggleTheme() {
    if (!dark) setTheme('css/sakura-dark.css');
    else setTheme('css/sakura.css');
    dark = !dark;
}

document.addEventListener("DOMContentLoaded", () => {
    theme = document.getElementById("theme");
    const localStorageTheme = localStorage.getItem('theme');
    if (localStorageTheme) {
        dark = localStorageTheme == 'css/sakura-dark.css';
        setTheme(localStorageTheme);
    }
});