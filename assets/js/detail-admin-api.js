(() => {
  if (!window.MG) return;

  function player(material) {
    const source = MG.mediaUrl(material.fileUrl || material.sourceUrl || "");
    const poster = MG.mediaUrl(material.thumbnailUrl || "");

    if (material.type === "image") {
      return source
        ? '<img class="w-full max-h-[70vh] object-contain rounded-2xl bg-surface-container-lowest shadow-sm" src="' + MG.esc(source) + '" alt="' + MG.esc(material.title) + '">'
        : '<div class="aspect-video rounded-2xl bg-surface-container flex items-center justify-center"><span class="material-symbols-outlined text-[64px] text-outline">image</span></div>';
    }

    if (material.type === "video") {
      return source
        ? '<video class="w-full rounded-2xl bg-black shadow-xl" controls preload="metadata"' + (poster ? ' poster="' + MG.esc(poster) + '"' : "") + ' src="' + MG.esc(source) + '"></video>'
        : '<div class="aspect-video rounded-2xl bg-inverse-surface flex items-center justify-center text-white"><span class="material-symbols-outlined text-[64px]">videocam</span></div>';
    }

    return '<div class="rounded-2xl bg-surface-container-lowest shadow-sm p-space-xl flex flex-col items-center gap-space-lg">' +
      (poster
        ? '<img class="w-48 h-48 rounded-2xl object-cover shadow-md" src="' + MG.esc(poster) + '" alt="">'
        : '<div class="w-48 h-48 rounded-2xl bg-tertiary-fixed flex items-center justify-center"><span class="material-symbols-outlined text-[64px] text-tertiary">headphones</span></div>') +
      (source
        ? '<audio class="w-full" controls preload="metadata" src="' + MG.esc(source) + '"></audio>'
        : '<p class="text-outline">Аудиофайл недоступен</p>') +
      '</div>';
  }

  function detailHtml(material, user) {
    const info = MG.typeInfo(material.type);
    const canDelete = user && (user.role === "admin" || Number(user.id) === Number(material.author.id));

    return '<div class="max-w-[1180px] mx-auto w-full px-margin py-space-lg">' +
      '<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">' +
        '<div class="lg:col-span-8 flex flex-col gap-space-lg">' +
          player(material) +
          '<section class="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm">' +
            '<div class="flex flex-wrap items-center gap-2 mb-space-sm">' +
              '<span class="px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps uppercase font-semibold">' + MG.esc(info.label) + '</span>' +
              '<span class="px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-label-caps text-label-caps uppercase font-semibold">' + MG.esc(material.category) + '</span>' +
            '</div>' +
            '<h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">' + MG.esc(material.title) + '</h1>' +
            '<div class="flex flex-wrap gap-4 mt-2 text-body-sm text-outline">' +
              '<span>Автор: <strong class="text-on-surface">' + MG.esc(material.author.name) + '</strong></span>' +
              '<span>' + MG.esc(MG.dateText(material.createdAt)) + '</span>' +
              '<span>' + Number(material.views || 0) + ' просмотров</span>' +
            '</div>' +
            '<p class="font-body-lg text-body-lg text-on-surface-variant mt-space-lg whitespace-pre-line">' + MG.esc(material.description || "Без описания") + '</p>' +
          '</section>' +
        '</div>' +
        '<aside class="lg:col-span-4">' +
          '<div class="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm">' +
            '<h2 class="font-headline-sm text-headline-sm text-on-surface mb-space-md">О материале</h2>' +
            '<div class="flex flex-col gap-3 text-body-md">' +
              '<div class="flex justify-between gap-4"><span class="text-outline">Тип</span><strong>' + MG.esc(info.label) + '</strong></div>' +
              '<div class="flex justify-between gap-4"><span class="text-outline">Категория</span><strong>' + MG.esc(material.category) + '</strong></div>' +
              '<div class="flex justify-between gap-4"><span class="text-outline">Автор</span><strong>' + MG.esc(material.author.name) + '</strong></div>' +
              '<div class="flex justify-between gap-4"><span class="text-outline">Лайки</span><strong>' + Number(material.likes || 0) + '</strong></div>' +
            '</div>' +
            '<button class="mt-space-lg w-full h-11 rounded-xl bg-primary-container text-on-primary font-label-lg flex items-center justify-center gap-2" data-api-like="' + material.id + '" aria-pressed="' + (material.liked ? "true" : "false") + '">' +
              '<span class="material-symbols-outlined">' + (material.liked ? "favorite" : "favorite_border") + '</span>' +
              '<span data-like-count>' + Number(material.likes || 0) + '</span>' +
              '<span>Нравится</span>' +
            '</button>' +
            (canDelete
              ? '<button class="mt-space-sm w-full h-11 rounded-xl bg-error-container text-on-error-container font-label-lg flex items-center justify-center gap-2" data-api-delete="' + material.id + '"><span class="material-symbols-outlined">delete</span><span>Удалить материал</span></button>'
              : '') +
          '</div>' +
        '</aside>' +
      '</div>' +
    '</div>';
  }

  async function loadDetail() {
    if (MG.page !== "detail.html") return;

    const id = Number(new URLSearchParams(location.search).get("id") || 0);
    if (!id) return;

    const [result, user] = await Promise.all([
      MG.api("material", { query: "?id=" + id }),
      MG.getUser(true).catch(() => null)
    ]);

    document.querySelectorAll(".stitch-desktop-view main,.stitch-mobile-view main").forEach((main) => {
      main.innerHTML = detailHtml(result.material, user);
    });
  }

  function adminHtml(users, materials) {
    const userRows = users.map((user) => {
      return '<tr class="border-b border-outline-variant/20">' +
        '<td class="py-3 pr-4 font-medium">' + MG.esc(user.name) + '</td>' +
        '<td class="py-3 pr-4 text-on-surface-variant">@' + MG.esc(user.username) + '</td>' +
        '<td class="py-3 pr-4 text-on-surface-variant">' + MG.esc(user.email) + '</td>' +
        '<td class="py-3 pr-4">' + MG.esc(user.role) + '</td>' +
        '<td class="py-3 text-right">' + Number(user.materials_count || 0) + '</td>' +
      '</tr>';
    }).join("");

    const materialRows = materials.map((material) => {
      return '<tr class="border-b border-outline-variant/20">' +
        '<td class="py-3 pr-4 font-medium">' + MG.esc(material.title) + '</td>' +
        '<td class="py-3 pr-4">' + MG.esc(MG.typeInfo(material.type).label) + '</td>' +
        '<td class="py-3 pr-4">' + MG.esc(material.category) + '</td>' +
        '<td class="py-3 pr-4">' + MG.esc(material.author.name) + '</td>' +
        '<td class="py-3 text-right"><button class="w-9 h-9 rounded-lg text-error hover:bg-error-container" data-api-delete="' + material.id + '"><span class="material-symbols-outlined text-[18px]">delete</span></button></td>' +
      '</tr>';
    }).join("");

    return '<div class="max-w-[1200px] mx-auto px-margin py-space-lg flex flex-col gap-space-lg">' +
      '<div><h1 class="font-headline-lg text-headline-lg text-on-surface">Админ-панель</h1><p class="text-on-surface-variant mt-1">Управление пользователями и материалами</p></div>' +
      '<section class="rounded-2xl bg-surface-container-lowest shadow-sm p-space-lg overflow-x-auto">' +
        '<h2 class="font-headline-sm text-headline-sm mb-space-md">Пользователи (' + users.length + ')</h2>' +
        '<table class="w-full text-left min-w-[700px]"><thead><tr class="text-outline"><th class="pb-3 pr-4">Имя</th><th class="pb-3 pr-4">Логин</th><th class="pb-3 pr-4">Email</th><th class="pb-3 pr-4">Роль</th><th class="pb-3 text-right">Материалы</th></tr></thead><tbody>' + userRows + '</tbody></table>' +
      '</section>' +
      '<section class="rounded-2xl bg-surface-container-lowest shadow-sm p-space-lg overflow-x-auto">' +
        '<h2 class="font-headline-sm text-headline-sm mb-space-md">Все материалы (' + materials.length + ')</h2>' +
        '<table class="w-full text-left min-w-[700px]"><thead><tr class="text-outline"><th class="pb-3 pr-4">Название</th><th class="pb-3 pr-4">Тип</th><th class="pb-3 pr-4">Категория</th><th class="pb-3 pr-4">Автор</th><th class="pb-3 text-right">Действия</th></tr></thead><tbody>' + materialRows + '</tbody></table>' +
      '</section>' +
    '</div>';
  }

  async function loadAdmin() {
    if (MG.page !== "admin.html") return;

    const user = await MG.getUser(true);

    if (!user || user.role !== "admin") {
      location.href = MG.pageFile("login.html");
      return;
    }

    const [usersResult, materialsResult] = await Promise.all([
      MG.api("admin_users"),
      MG.api("admin_materials")
    ]);

    document.querySelectorAll(".stitch-desktop-view main,.stitch-mobile-view main").forEach((main) => {
      main.innerHTML = adminHtml(usersResult.users, materialsResult.materials);
    });
  }

  loadDetail().catch((error) => MG.toast(error.message, true));
  loadAdmin().catch((error) => MG.toast(error.message, true));
})();