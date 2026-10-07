import { routes } from "../paths.js";

const item = (key, icon, label, current, aliases=[]) => {
  const active = current === key || aliases.includes(current);
  return `<a class="mobile-bottom-nav__link ${active ? "is-active" : ""}" href="${routes[key]}">
    <span class="material-symbol">${icon}</span>
    <span>${label}</span>
  </a>`;
};

export function renderBottomNav(current) {
  return `
    <nav class="mobile-bottom-nav scroll-x snap-x" aria-label="Нижняя мобильная навигация">
      ${item("home","home","Главная",current)}
      ${item("gallery","grid_view","Галерея",current,["images","videos","audio"])}
      ${item("search","search","Поиск",current)}
      ${item("upload","add_circle","Добавить",current)}
      ${item("profile","person","Профиль",current)}
    </nav>
  `;
}
