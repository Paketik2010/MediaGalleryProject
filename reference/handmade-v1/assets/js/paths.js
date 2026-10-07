export const isSubpage = window.location.pathname.includes("/pages/");

export const root = isSubpage ? "../" : "./";

export const routes = {
  home: root + "index.html",
  gallery: root + "pages/gallery.html",
  images: root + "pages/images.html",
  videos: root + "pages/videos.html",
  audio: root + "pages/audio.html",
  search: root + "pages/search.html",
  register: root + "pages/register.html",
  login: root + "pages/login.html",
  profile: root + "pages/profile.html",
  upload: root + "pages/upload.html",
  detail: root + "pages/detail.html",
  admin: root + "pages/admin.html"
};
