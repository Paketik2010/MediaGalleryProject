(() => {
  const CONFIG = {
    gallery: {
      typeLabel:"Все материалы",
      typeIcon:"grid_view",
      count:342,
      types:[["all","Все материалы"],["image","Изображения"],["video","Видео"],["audio","Аудио"]],
      categories:[
        "Все категории","Фотографии","Музыка","Обучение","Развлечения",
        "Архитектура","Город","Дизайн","Путешествия","Технологии",
        "Подкасты","Звуковые эффекты","Другое"
      ]
    },
    images: {
      typeLabel:"Изображения",
      typeIcon:"image",
      count:180,
      categories:["Все категории","Фотографии","Архитектура","Город","Дизайн","Другое"]
    },
    videos: {
      typeLabel:"Видео",
      typeIcon:"videocam",
      count:98,
      categories:["Все категории","Обучение","Развлечения","Путешествия","Технологии","Другое"]
    },
    audio: {
      typeLabel:"Аудио",
      typeIcon:"graphic_eq",
      count:64,
      categories:["Все категории","Музыка","Подкасты","Обучение","Развлечения","Звуковые эффекты","Другое"]
    }
  };

  const clean = v => (v || "").replace(/\s+/g," ").trim();

  function key() {
    const p = location.pathname.toLowerCase();
    if (p.endsWith("/gallery.html")) return "gallery";
    if (p.endsWith("/images.html")) return "images";
    if (p.endsWith("/videos.html")) return "videos";
    if (p.endsWith("/audio.html")) return "audio";
    return "";
  }

  function esc(v) {
    const d=document.createElement("div");
    d.textContent=v||"";
    return d.innerHTML;
  }

  function commonAncestor(nodes) {
    if (!nodes.length) return null;
    let a=nodes[0];
    while (a) {
      if (nodes.every(n=>a.contains(n))) return a;
      a=a.parentElement;
    }
    return null;
  }

  function localSearch(scope) {
    const inputs=[...scope.querySelectorAll("input")];
    return inputs.find(i=>/автор|видео|трек|материал/i.test(i.placeholder||"")) || inputs[inputs.length-1] || null;
  }

  function hideElement(el) {
    if (!el) return;
    el.hidden=true;
    el.dataset.mgOldFilter="1";
    el.style.setProperty("display","none","important");
  }

  function hideOld(scope, cardContainer) {
    const isSearch=location.pathname.toLowerCase().endsWith("/search.html");

    if (isSearch && scope.classList.contains("stitch-desktop-view")) {
      const parent=cardContainer && cardContainer.parentElement;
      if (parent) {
        [...parent.children].forEach(child=>{
          if (child!==cardContainer) hideElement(child);
        });
      }
      return;
    }

    scope.querySelectorAll("span").forEach(span=>{
      if (clean(span.textContent) !== "Активные фильтры:") return;
      const row=span.closest("div.flex.items-center.justify-between") || span.parentElement;
      if (!row || row.querySelector(".mg-card")) return;
      hideElement(row);
    });

    const input=localSearch(scope);
    const selects=[...scope.querySelectorAll("select")];
    if (input) {
      let candidate=commonAncestor([input,...selects].filter(Boolean)) || input.parentElement;
      if (candidate) {
        let best=candidate, probe=candidate.parentElement;
        while (
          probe && probe!==scope && !probe.querySelector(".mg-card") && !probe.querySelector("h1") &&
          probe.getBoundingClientRect().height>0 && probe.getBoundingClientRect().height<260
        ) {
          best=probe;
          probe=probe.parentElement;
        }
        hideElement(best);
      }
    }

    const parent=cardContainer && cardContainer.parentElement;
    if (parent) {
      [...parent.children].forEach(child=>{
        if (child===cardContainer || child.dataset.mgOldFilter==="1" || child.querySelector(".mg-card")) return;
        const text=clean(child.textContent);
        const h=child.getBoundingClientRect().height;
        if (
          /search|Все категории|Сортиров|Активные фильтры|Применено|filter_list|swap_vert/i.test(text) &&
          h>0 && h<260 && !child.querySelector("h1")
        ) {
          hideElement(child);
        }
      });
    }
  }

  function html(c) {
    const categoryOptions=c.categories.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join("");
    const typeControl=c.types
      ? '<label class="mg-filter-control mg-filter-control--select mg-filter-control--type">'+
          '<span class="material-symbols-outlined">perm_media</span>'+
          '<select class="mg-filter-select" data-mg-type>'+
            c.types.map(([value,label])=>'<option value="'+esc(value)+'">'+esc(label)+'</option>').join("")+
          '</select>'+
        '</label>'
      : '';

    return ''+
      '<div class="mg-filter-panel__main'+(c.types?' mg-filter-panel__main--with-type':'')+'">'+
        '<label class="mg-filter-control mg-filter-control--search">'+
          '<span class="material-symbols-outlined">search</span>'+
          '<input class="mg-filter-input" data-mg-search type="search" placeholder="Поиск по названию или автору...">'+
        '</label>'+
        typeControl+
        '<label class="mg-filter-control mg-filter-control--select mg-filter-control--category">'+
          '<span class="material-symbols-outlined">folder_open</span>'+
          '<select class="mg-filter-select" data-mg-category>'+categoryOptions+'</select>'+
        '</label>'+
        '<label class="mg-filter-control mg-filter-control--select mg-filter-control--sort">'+
          '<span class="material-symbols-outlined">sort</span>'+
          '<select class="mg-filter-select" data-mg-sort>'+
            '<option value="newest">Сначала новые</option>'+
            '<option value="oldest">Сначала старые</option>'+
            '<option value="name">По названию</option>'+
            '<option value="popular">По популярности</option>'+
          '</select>'+
        '</label>'+
        '<div class="mg-filter-view">'+
          '<button class="mg-filter-view__button is-active" type="button" data-mg-view="grid" aria-label="Сетка"><span class="material-symbols-outlined">grid_view</span></button>'+
          '<button class="mg-filter-view__button" type="button" data-mg-view="list" aria-label="Список"><span class="material-symbols-outlined">view_list</span></button>'+
        '</div>'+
      '</div>'+
      '<div class="mg-filter-panel__applied" data-mg-applied>'+
        '<span class="mg-filter-panel__label">Применено:</span>'+
        '<div class="mg-filter-chips">'+
          '<span class="mg-filter-chip" data-mg-type-chip hidden><span class="material-symbols-outlined">'+c.typeIcon+'</span><span data-mg-type-chip-text>Тип: '+c.typeLabel+'</span></span>'+
          '<span class="mg-filter-chip" data-mg-category-chip><span data-mg-category-chip-text>Категория: Все</span><button class="mg-filter-chip__close" type="button" data-mg-clear-category aria-label="Сбросить категорию"><span class="material-symbols-outlined">close</span></button></span>'+
        '</div>'+
        '<button class="mg-filter-reset" type="button" data-mg-reset>Сбросить все</button>'+
      '</div>';
  }

  function metricNumber(text) {
    const m=clean(text).toLowerCase().match(/([\d.,]+)\s*([kк])?/);
    if (!m) return 0;
    let n=parseFloat(m[1].replace(",","."));
    if (m[2]) n*=1000;
    return Number.isFinite(n)?n:0;
  }

  function popularity(card) {
    return [...card.querySelectorAll(".mg-card__metric")]
      .map(el=>metricNumber(el.textContent))
      .reduce((a,b)=>a+b,0);
  }

  function cardType(card) {
    const text=clean(card.querySelector(".mg-card__type")?.textContent).toLowerCase();
    if (text.includes("видео")) return "video";
    if (text.includes("аудио")) return "audio";
    return "image";
  }

  function mount(scope,c) {
    if (scope.dataset.mgFiltersMounted==="1") return;
    const cards=[...scope.querySelectorAll(".mg-card")];
    if (!cards.length) return;
    const container=cards[0].parentElement;
    if (!container) return;

    hideOld(scope,container);

    if (scope.classList.contains("stitch-desktop-view")) {
      const root=scope.querySelector("main > div");
      if (root) root.style.setProperty("padding-top","24px","important");
    }

    const panel=document.createElement("section");
    panel.className="mg-filter-panel";
    panel.innerHTML=html(c);
    container.insertAdjacentElement("beforebegin",panel);

    if (scope.classList.contains("stitch-desktop-view")) {
      const host=panel.parentElement;
      if (host) host.style.setProperty("padding-top","0","important");
      if (host && getComputedStyle(host).display === "flex" && getComputedStyle(host).flexDirection === "column") {
        host.style.setProperty("row-gap","24px","important");
        panel.style.setProperty("margin-bottom","0","important");
      } else {
        panel.style.setProperty("margin-bottom","24px","important");
      }
    }

    const search=panel.querySelector("[data-mg-search]");
    const type=panel.querySelector("[data-mg-type]");
    const category=panel.querySelector("[data-mg-category]");
    const sort=panel.querySelector("[data-mg-sort]");
    const appliedRow=panel.querySelector("[data-mg-applied]");
    const typeChip=panel.querySelector("[data-mg-type-chip]");
    const typeChipText=panel.querySelector("[data-mg-type-chip-text]");
    const categoryChip=panel.querySelector("[data-mg-category-chip]");
    const categoryChipText=panel.querySelector("[data-mg-category-chip-text]");
    const reset=panel.querySelector("[data-mg-reset]");
    const clear=panel.querySelector("[data-mg-clear-category]");
    const viewButtons=[...panel.querySelectorAll("[data-mg-view]")];
    const original=new Map(cards.map((card,i)=>[card,i]));

    function matches(card) {
      const q=clean(search.value).toLowerCase();
      const selectedCategory=category.value;
      const selectedType=type ? type.value : "all";
      const cat=clean(card.querySelector(".mg-card__category")?.textContent);
      const searchable=clean([
        card.dataset.mgSearchText,
        card.querySelector(".mg-card__title")?.textContent,
        card.querySelector(".mg-card__description")?.textContent,
        card.querySelector(".mg-card__author-name")?.textContent,
        cat
      ].join(" ")).toLowerCase();

      return (!q || searchable.includes(q)) &&
        (selectedCategory==="Все категории" || cat.toLowerCase()===selectedCategory.toLowerCase()) &&
        (selectedType==="all" || cardType(card)===selectedType);
    }

    function sortCards() {
      const ordered=[...cards];
      if (sort.value==="oldest") ordered.sort((a,b)=>original.get(b)-original.get(a));
      else if (sort.value==="name") ordered.sort((a,b)=>clean(a.querySelector(".mg-card__title")?.textContent).localeCompare(clean(b.querySelector(".mg-card__title")?.textContent),"ru"));
      else if (sort.value==="popular") ordered.sort((a,b)=>popularity(b)-popularity(a));
      else ordered.sort((a,b)=>original.get(a)-original.get(b));
      ordered.forEach(card=>container.appendChild(card));
    }

    function updateAppliedState() {
      const typeActive=type && type.value!=="all";
      const categoryActive=category.value!=="Все категории";

      appliedRow.hidden=false;

      if (typeChip) {
        typeChip.hidden=!typeActive;
        if (typeActive && typeChipText) {
          typeChipText.textContent="Тип: "+clean(type.options[type.selectedIndex]?.text);
        }
      }

      categoryChip.hidden=false;
      categoryChipText.textContent=categoryActive
        ? "Категория: "+category.value
        : "Категория: Все";
    }

    function apply() {
      sortCards();
      cards.forEach(card=>{
        card.hidden=!matches(card);
      });
      updateAppliedState();
    }

    function setView(mode) {
      container.classList.toggle("mg-filter-list-mode",mode==="list");
      viewButtons.forEach(btn=>btn.classList.toggle("is-active",btn.dataset.mgView===mode));
    }

    search.addEventListener("input",apply);
    type?.addEventListener("change",apply);
    category.addEventListener("change",apply);
    sort.addEventListener("change",apply);
    clear.addEventListener("click",()=>{category.value="Все категории";apply();});
    reset.addEventListener("click",()=>{
      search.value="";
      if (type) type.value="all";
      category.value="Все категории";
      sort.value="newest";
      setView("grid");
      apply();
    });
    viewButtons.forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.mgView)));

    scope.dataset.mgFiltersMounted="1";
    apply();
  }

  function run() {
    const k=key();
    if (!k) return;

    document.querySelectorAll(".stitch-desktop-view,.stitch-mobile-view").forEach(scope=>mount(scope,CONFIG[k]));
  }

  run();

  window.MediaGalleryRefreshFilters = function () {
    document.querySelectorAll(".stitch-desktop-view,.stitch-mobile-view").forEach(scope => {
      scope.dataset.mgFiltersMounted = "";
      scope.querySelectorAll(".mg-filter-panel").forEach(panel => panel.remove());
    });
    run();
  };
})();