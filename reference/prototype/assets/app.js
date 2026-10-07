
const routes = {
  home:'index.html', gallery:'gallery.html', images:'images.html', videos:'videos.html',
  audio:'audio.html', search:'search.html', add:'upload.html', profile:'profile.html',
  login:'login.html', register:'register.html', admin:'admin.html'
};
const current = document.body.dataset.page || 'home';
function header(){
  return `
  <header class="header"><div class="container header-inner">
    <a class="brand" href="${routes.home}"><span class="brand-mark"><span class="mi">perm_media</span></span><span>MediaGallery</span></a>
    <nav class="nav">
      <a class="${current==='home'?'active':''}" href="${routes.home}">Главная</a>
      <a class="${current==='gallery'?'active':''}" href="${routes.gallery}">Галерея</a>
      <a class="${current==='images'?'active':''}" href="${routes.images}">Изображения</a>
      <a class="${current==='videos'?'active':''}" href="${routes.videos}">Видео</a>
      <a class="${current==='audio'?'active':''}" href="${routes.audio}">Аудио</a>
    </nav>
    <div class="actions">
      <form class="search-mini" action="${routes.search}"><span class="mi">search</span><input name="q" placeholder="Поиск по названию..."></form>
      <a class="btn btn-primary" href="${routes.add}"><span class="mi">add</span><span class="btn-label">Добавить материал</span></a>
      <a href="${routes.profile}"><img class="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCortXDnH4229Wyuq4kQRmeCjfHBd0fIuvd385D952_JsAIxdMBTKsPFIEONrBfupvgORfyB31HCBd_oY3FMrrQz0xgBQ5A3P5sE9vXG2LaQ59Jn7NzX5h4WQbd7YMcCyomhwy4cBVMotDE59FXcFvjiu8JfvxxSBLo9XQ5XmRSDU9SmcAsWFkjr5XxIfvZgeHSIymGWgbuci_DEQwYS25jFVDgu3t70goY_jqYQIw" alt=""></a>
      <button class="btn btn-secondary mobile-menu" onclick="document.querySelector('.mobile-sheet').classList.toggle('open')"><span class="mi">menu</span></button>
    </div>
  </div></header>
  <div class="mobile-sheet" style="display:none"></div>`;
}
function bottom(){
 return `<nav class="bottom-nav">
   <a class="${current==='home'?'active':''}" href="${routes.home}"><span class="mi">home</span>Главная</a>
   <a class="${['gallery','images','videos','audio'].includes(current)?'active':''}" href="${routes.gallery}"><span class="mi">grid_view</span>Галерея</a>
   <a class="${current==='search'?'active':''}" href="${routes.search}"><span class="mi">search</span>Поиск</a>
   <a class="${current==='add'?'active':''}" href="${routes.add}"><span class="mi">add_circle</span>Добавить</a>
   <a class="${current==='profile'?'active':''}" href="${routes.profile}"><span class="mi">person</span>Профиль</a>
 </nav>`;
}
document.addEventListener('DOMContentLoaded',()=>{
  const h=document.getElementById('site-header'); if(h) h.innerHTML=header();
  const b=document.getElementById('site-bottom'); if(b) b.innerHTML=bottom();
  document.querySelectorAll('[data-toast]').forEach(el=>el.addEventListener('click',()=>{
    const t=document.querySelector('.toast'); if(t){t.style.display='block';setTimeout(()=>t.style.display='none',2200)}
  }));
});
