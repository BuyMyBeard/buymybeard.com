
const footer = fetch('partial/footer.html', {credentials: 'same-origin'}).then(response => response.text());
const navigation = fetch('partial/navigation.html', {credentials: 'same-origin'}).then(response => response.text());

$(document).ready(() => {
  footer.then(data => {
    $('#footer').html(data);
  });

  navigation.then(data => {
    $('#navigation').html(data);
  });

  function loadTranslations(lang) {
    $.i18n().locale = lang;
    $.i18n().load({
        'en': './i18n/en.json',
        'fr': './i18n/fr.json'
    }).done(async () => {
      const body = $('body');
      body.i18n();
      await new Promise(resolve => setTimeout(resolve), 500);
      body.show();
    });
  }

  const userLang = localStorage.getItem('lang') || navigator.language || navigator.userLanguage;
  const lang = userLang.startsWith('fr') ? 'fr' : 'en';
  loadTranslations(lang);
  $('#language-select').val(lang);

  $('#language-select').change((event) => {
    const selectedLang = $(event.target).val();
    loadTranslations(selectedLang);
    localStorage.setItem('lang', selectedLang);
  });
});

let theme;
let codeTheme;
let dark = false;

function setTheme(style) {
  theme.attr("href", style);
  localStorage.setItem('theme', style);
}

function setCodeTheme(style) {
  localStorage.setItem('codeTheme', style);
  if (codeTheme != null) {
    codeTheme.attr("href", style);
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

$(document).ready(() => {
  theme = $("#theme");
  codeTheme = $("#codeTheme");
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