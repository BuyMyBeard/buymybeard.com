
const footer = fetch('partial/footer.html', {credentials: 'same-origin'}).then(response => response.text());
const navigation = fetch('partial/navigation.html', {credentials: 'same-origin'}).then(response => response.text());

async function loadTranslations(lang) {
  $.i18n().locale = lang;
  $.i18n().load({
      'en': './i18n/en.json',
      'fr': './i18n/fr.json'
  }).done(async () => {
    const body = $('body');
    body.i18n();
    body.show();
  });
}

$(document).ready(() => {
  footer.then(data => {
    $('#footer').html(data);
  });

  navigation.then(data => {
    $('#navigation').html(data);

    const userLang = localStorage.getItem('lang') || navigator.language || navigator.userLanguage;
    const lang = userLang.startsWith('fr') ? 'fr' : 'en';
    loadTranslations(lang);
    $('#language-select').val(lang);

    $('#language-select').change((event) => {
      const selectedLang = $(event.target).val();
      loadTranslations(selectedLang);
      localStorage.setItem('lang', selectedLang);
    });

    const themeElement = $("#theme");
    const codeThemeElement = $("#codeTheme");

    const localStorageTheme = localStorage.getItem('theme') ?? 'light';
    setTheme(localStorageTheme);
    $('#theme-select').val(localStorageTheme);

    $('#theme-select').change((event) => {
      const selectedTheme = $(event.target).val();
      setTheme(selectedTheme);
      localStorage.setItem('theme', selectedTheme);
    });

    function setTheme(style) {
      if (style == "dark") {
        themeElement.attr('href', 'css/sakura-dark.css');
        codeThemeElement?.attr('href', './highlight.js/styles/dark.min.css');
      }
      else {
        themeElement.attr('href', 'css/sakura.css');
        codeThemeElement?.attr('href', './highlight.js/styles/default.min.css');
      }
    }
  });
});