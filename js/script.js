const $id = id => document.getElementById(id);

const preferences = document.forms.namedItem('preferences');

const setTheme = theme => {
  localStorage.setItem('theme', theme);
  document.documentElement.dataset.theme = theme;
};

const currentTheme =
  localStorage.getItem('theme') ||
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
preferences.theme.value = currentTheme;
setTheme(currentTheme);

preferences.addEventListener('change', event => {
  if (event.target.name === 'theme') {
    setTheme(preferences.theme.value);
  }
});

$id('preferences-menu-toggle').addEventListener('click', () => {
  const isVisible = $id('preferences').hidden;
  $id('preferences').hidden = !isVisible;
  if (isVisible) {
    preferences.tabIndex = 0;
    preferences.focus();
  }
});
