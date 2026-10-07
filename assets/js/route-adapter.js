(() => {
  const inPages = window.location.pathname.includes('/pages/');
  const root = inPages ? '../' : './';
  const routes = {
    'main': root + 'index.html',
    'glavnaya': root + 'index.html',
    'glavnaya-stranitsa': root + 'index.html',
    'gallery': root + 'pages/gallery.html',
    'galereya': root + 'pages/gallery.html',
    'obshchaya-galereya': root + 'pages/gallery.html',
    'images': root + 'pages/images.html',
    'izobrazheniya': root + 'pages/images.html',
    'videos': root + 'pages/videos.html',
    'video': root + 'pages/videos.html',
    'audio': root + 'pages/audio.html',
    'search': root + 'pages/search.html',
    'poisk': root + 'pages/search.html',
    'register': root + 'pages/register.html',
    'login': root + 'pages/login.html',
    'vhod': root + 'pages/login.html',
    'profile': root + 'pages/profile.html',
    'lichnyy-kabinet': root + 'pages/profile.html',
    'add-asset': root + 'pages/upload.html',
    'dobavlenie-materiala': root + 'pages/upload.html',
    'admin-panel': root + 'pages/admin.html',
    'panel-administratora': root + 'pages/admin.html'
  };

  const ensureDesktopSearchLink = () => {
    document.querySelectorAll('.desktop-view header nav').forEach((nav) => {
      if (nav.querySelector('a[data-path="search"]')) return;

      const audioLink = nav.querySelector('a[data-path="audio"]');
      if (!audioLink) return;

      const searchLink = document.createElement('a');
      searchLink.href = '#';
      searchLink.dataset.path = 'search';
      searchLink.textContent = 'Поиск';
      searchLink.className = 'px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors';

      if (window.location.pathname.toLowerCase().endsWith('/search.html')) {
        searchLink.classList.remove('text-on-surface-variant');
        searchLink.classList.add('bg-surface-container-high', 'text-primary', 'font-title-md');
        searchLink.setAttribute('aria-current', 'page');
      }

      audioLink.insertAdjacentElement('afterend', searchLink);
    });
  };

  const ensureMobileNav = () => {
    const mobile = document.querySelector('.mobile-view');
    if (!mobile || mobile.querySelector('.mg-mobile-nav')) return;

    const pathname = window.location.pathname.toLowerCase();
    const active = pathname.endsWith('/images.html') ? 'images'
      : pathname.endsWith('/videos.html') ? 'videos'
      : pathname.endsWith('/search.html') ? 'search'
      : pathname.endsWith('/audio.html') ? 'audio'
      : /\/(login|register|profile)\.html$/.test(pathname) ? 'account'
      : '';

    const item = (path, icon, label, key, extra = '') => {
      const current = active === key;
      return '<a class="mg-mobile-nav__link ' + extra + (current ? ' is-active' : '') + '" data-path="' + path + '" href="#"' +
        (current ? ' aria-current="page"' : '') + '>' +
        '<span class="material-symbols-outlined">' + icon + '</span>' +
        '<span>' + label + '</span>' +
      '</a>';
    };

    const nav = document.createElement('nav');
    nav.className = 'mg-mobile-nav';
    nav.setAttribute('aria-label', 'Мобильная навигация');
    nav.innerHTML = '<div class="mg-mobile-nav__inner">' +
      item('images', 'image', 'Фото', 'images') +
      item('videos', 'movie', 'Видео', 'videos') +
      item('search', 'search', 'Поиск', 'search', ' mg-mobile-nav__search') +
      item('audio', 'audiotrack', 'Аудио', 'audio') +
      item('login', 'account_circle', 'Войти', 'account', ' mg-mobile-nav__account') +
    '</div>';

    mobile.appendChild(nav);
  };

  ensureDesktopSearchLink();
  ensureMobileNav();

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-path]');
    if (!link) return;
    const path = link.dataset.path;
    if (!routes[path]) return;
    event.preventDefault();
    window.location.href = location.hostname.endsWith("github.io") ? routes[path] + (routes[path].includes("?") ? "&" : "?") + "v=20261007c" : routes[path];
  });
})();
