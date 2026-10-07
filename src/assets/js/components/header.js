import { routes } from "../paths.js";
import { images } from "../data/media.js";

const link = (key, label, current) =>
  `<a class="site-nav__link ${current === key ? "is-active" : ""}" href="${routes[key]}">${label}</a>`;

export function renderHeader(current) {
  return `
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="site-brand" href="${routes.home}">
          <span class="site-brand__mark"><span class="material-symbol">perm_media</span></span>
          <span class="site-brand__name">MediaGallery</span>
        </a>

        <nav class="site-nav" aria-label="Основная навигация">
          ${link("home","Главная",current)}
          ${link("gallery","Галерея",current)}
          ${link("images","Изображения",current)}
          ${link("videos","Видео",current)}
          ${link("audio","Аудио",current)}
        </nav>

        <div class="site-actions">
          <form class="site-search" action="${routes.search}">
            <span class="material-symbol">search</span>
            <input name="q" placeholder="Поиск по названию...">
          </form>

          <a class="btn btn--primary" href="${routes.upload}">
            <span class="material-symbol">add</span>
            <span class="btn-label">Добавить материал</span>
          </a>

          <a href="${routes.profile}" aria-label="Личный кабинет">
            <img class="avatar" src="${images.avatar}" alt="">
          </a>

          <button class="btn btn--secondary btn--icon mobile-only" type="button" data-menu-button aria-label="Открыть меню">
            <span class="material-symbol">menu</span>
          </button>
        </div>
      </div>
    </header>

    <nav class="mobile-drawer" data-mobile-drawer aria-label="Мобильное меню">
      <a class="mobile-drawer__link ${current==="home"?"is-active":""}" href="${routes.home}">Главная</a>
      <a class="mobile-drawer__link ${current==="gallery"?"is-active":""}" href="${routes.gallery}">Галерея</a>
      <a class="mobile-drawer__link ${current==="images"?"is-active":""}" href="${routes.images}">Изображения</a>
      <a class="mobile-drawer__link ${current==="videos"?"is-active":""}" href="${routes.videos}">Видео</a>
      <a class="mobile-drawer__link ${current==="audio"?"is-active":""}" href="${routes.audio}">Аудио</a>
      <a class="mobile-drawer__link" href="${routes.search}">Поиск</a>
      <a class="mobile-drawer__link" href="${routes.admin}">Админ-панель</a>
    </nav>
  `;
}
