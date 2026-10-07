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
    document.querySelectorAll('.stitch-desktop-view header nav').forEach((nav) => {
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

  ensureDesktopSearchLink();

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-path]');
    if (!link) return;
    const path = link.dataset.path;
    if (!routes[path]) return;
    event.preventDefault();
    window.location.href = routes[path];
  });
})();
