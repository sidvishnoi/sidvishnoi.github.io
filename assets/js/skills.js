// https://stackoverflow.com/a/7220510/3367669
function syntaxHighlight(json) {
  const RE = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?)/g;
  return json.replace(RE, (match) => {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

(() => {
  const isMobile = window.innerWidth < 640;
  const $skills = document.getElementById('skills');
  const content = JSON.parse($skills.innerText);
  let skills = JSON.stringify(content, (k,v) => {
    if (!isMobile && v instanceof Array) return JSON.stringify(v);
    return v;
  }, 2);
  skills = skills.split('"[').join("[")
    .split(']"').join("]")
    .split('\\"').join('"')
    .split('""').join(`"'"'`);
  $skills.innerHTML = syntaxHighlight(skills);
})();
