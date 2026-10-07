(() => {
  if (!window.MG) return;

  const page = MG.page;
  const catalogTypes = {
    "gallery.html": "",
    "images.html": "image",
    "videos.html": "video",
    "audio.html": "audio"
  };

  async function loadCatalog() {
    if (!(page in catalogTypes)) return;

    const type = catalogTypes[page];
    const query = type ? "?type=" + encodeURIComponent(type) : "";
    const result = await MG.api("materials", { query });

    document.querySelectorAll(".desktop-view,.mobile-view").forEach((scope) => {
      MG.renderCards(scope, result.materials);
      updateMobileCatalogSummary(scope, result.materials, type);
      setupMobileCatalog(scope, result.materials, type);
    });

    if (window.MediaGalleryRefreshFilters) {
      window.MediaGalleryRefreshFilters();
    }
  }

  function searchStats(scope, count, query) {
    let word = "материалов";
    if (count === 1) word = "материал";
    if (count >= 2 && count <= 4) word = "материала";

    const mobileCount = scope.querySelector("#results-count");
    if (mobileCount) {
      mobileCount.textContent = "Найдено: " + count + " " + word;

      const queryLabel = mobileCount.parentElement?.parentElement?.querySelector(":scope > span:last-child");
      if (queryLabel) {
        queryLabel.textContent = query ? "по запросу «" + query + "»" : "";
        queryLabel.style.display = query ? "" : "none";
      }
      return;
    }

    const line = [...scope.querySelectorAll("div")].find((div) => {
      const children = [...div.children];
      const hasCounterText = children.some((child) =>
        /^Найдено:\s*\d+\s*материал/i.test(child.textContent.trim())
      );
      const hasDot = children.some((child) =>
        child.classList?.contains("rounded-full") &&
        child.classList?.contains("bg-primary")
      );

      return hasCounterText && hasDot;
    });

    if (!line) return;

    line.innerHTML =
      '<span class="w-2 h-2 rounded-full bg-primary inline-block"></span>' +
      '<span>Найдено: <strong class="text-on-surface font-title-md">' + count + " " + word + "</strong>" +
      (query ? ' по запросу <span class="text-primary font-title-md">«' + MG.esc(query) + '»</span>' : "") +
      "</span>";
  }

  function buttonType(button) {
    const text = button.textContent.toLowerCase();
    if (text.includes("изображ")) return "image";
    if (text.includes("видео")) return "video";
    if (text.includes("аудио")) return "audio";
    return "";
  }

  function updateMobileCatalogSummary(scope, materials, type) {
    if (!scope.classList.contains("mobile-view")) return;

    const total = materials.length;

    if (!type) {
      const counts = {
        all: total,
        image: materials.filter((item) => item.type === "image").length,
        video: materials.filter((item) => item.type === "video").length,
        audio: materials.filter((item) => item.type === "audio").length
      };

      const subtitle = [...scope.querySelectorAll("p")].find((node) =>
        /^Все материалы пользователей\s+\d+/i.test(node.textContent.replace(/\s+/g, " ").trim())
      );
      const subtitleCount = subtitle?.querySelector("span");
      if (subtitleCount) subtitleCount.textContent = counts.all;

      scope.querySelectorAll("button[data-type]").forEach((button) => {
        const key = button.dataset.type || "all";
        if (!(key in counts)) return;

        const number = [...button.querySelectorAll("span")].find((span) =>
          /^\d+$/.test(span.textContent.trim())
        );
        if (number) number.textContent = counts[key];
      });

      scope.querySelectorAll("span").forEach((node) => {
        const text = node.textContent.replace(/\s+/g, " ").trim();
        if (/^Показано\s+\d+\s+из\s+\d+\s+материал/i.test(text)) {
          node.textContent = "Показано " + total + " из " + total + " материалов";
        }
      });

      const applyButton = scope.querySelector("#applyFiltersBtn");
      if (applyButton) applyButton.textContent = "Применить (" + total + ")";

      scope.querySelectorAll("button").forEach((button) => {
        if (/Загрузить еще|Показать еще/i.test(button.textContent)) {
          button.style.display = "none";
        }
      });
      return;
    }

    const label = type === "image" ? "ФОТО" : type === "video" ? "ВИДЕО" : "ТРЕКА";

    scope.querySelectorAll("span").forEach((node) => {
      const text = node.textContent.replace(/\s+/g, " ").trim();

      if (/^\d+\s+(ФОТО|ВИДЕО|ТРЕКА)$/i.test(text)) {
        node.textContent = total + " " + label;
      }

      if (/^Показано\s+\d+(?:–\d+)?\s+из\s+\d+/i.test(text)) {
        const noun = type === "image"
          ? "изображений"
          : type === "video"
            ? "видео"
            : "аудиофайлов";
        node.textContent = "Показано " + total + " из " + total + " " + noun;
      }
    });

    scope.querySelectorAll("p").forEach((node) => {
      const text = node.textContent.replace(/\s+/g, " ").trim();
      if (/\(\d+\)\s*$/.test(text)) {
        node.textContent = text.replace(/\(\d+\)\s*$/, "(" + total + ")");
      }
    });

    scope.querySelectorAll("button").forEach((button) => {
      if (/Загрузить еще|Показать еще/i.test(button.textContent)) {
        button.style.display = "none";
      }
    });
  }

  function normalizeMobileCards(container) {
    container.querySelectorAll(".mg-card").forEach((card) => {
      const type = card.dataset.materialType;
      const badge = card.querySelector(".mg-card__type");
      const save = card.querySelector(".mg-card__save");
      const saveIcon = save?.querySelector(".material-symbols-outlined");

      if (save && !save.hasAttribute("data-api-delete")) {
        save.setAttribute("aria-label", "В избранное");
        if (saveIcon) saveIcon.textContent = "favorite_border";
      }

      if (type === "image") {
        if (badge) badge.textContent = "ФОТО";
      } else if (type === "video") {
        if (badge) badge.textContent = "ВИДЕО";
      } else if (type === "audio") {
        if (badge) badge.textContent = "АУДИО";
      }
    });
  }

  function renderMobileCards(container, materials) {
    if (!materials.length) {
      container.innerHTML =
        '<div class="mg-mobile-empty">' +
          '<span class="material-symbols-outlined text-[34px] text-outline">search_off</span>' +
          '<h3 class="font-headline-sm text-headline-sm text-on-surface mt-2">Ничего не найдено</h3>' +
          '<p class="font-body-md text-body-md text-on-surface-variant mt-1">Измени поиск или категорию.</p>' +
        '</div>';
      return;
    }

    container.innerHTML = materials.map((item) => MG.cardHtml(item)).join("");
    normalizeMobileCards(container);
  }

  function setupMobileCatalog(scope, materials, fixedType) {
    if (!scope.classList.contains("mobile-view")) return;
    if (scope.dataset.mgMobileCatalogMounted === "1") return;

    const firstCard = scope.querySelector(".mg-card");
    const container = firstCard?.parentElement;
    if (!container) return;

    scope.dataset.mgMobileCatalogMounted = "1";

    const allMaterials = [...materials];
    const state = {
      query: "",
      type: fixedType || "",
      category: "",
      categories: new Set(),
      sort: "newest",
      limit: page === "gallery.html" ? 6 : Number.POSITIVE_INFINITY,
      list: false
    };

    const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const search = page === "gallery.html"
      ? scope.querySelector("#gallerySearchInput")
      : [...scope.querySelectorAll('input[type="text"],input[type="search"]')].find((input) =>
          /поиск/i.test(input.placeholder || "")
        );
    const clearSearch = scope.querySelector("#clearSearchBtn");
    const loadMore = scope.querySelector("#loadMoreBtn");
    const status = [...scope.querySelectorAll("p,span")].find((node) =>
      /^Показано\s+/i.test(clean(node.textContent))
    );

    const paginationRoot = status?.parentElement;
    if (paginationRoot) {
      [...paginationRoot.children].forEach((child) => {
        if (child !== status && child.querySelectorAll?.("button").length) {
          child.style.display = "none";
        }
      });
    }

    function filteredList(categoryOverride = null) {
      const q = state.query.toLowerCase();
      const selectedCategories = categoryOverride || state.categories;
      let list = allMaterials.filter((item) => {
        const typeOk = !state.type || item.type === state.type;
        const categoryOk = !selectedCategories.size || selectedCategories.has(item.category);
        const haystack = clean([
          item.title,
          item.description,
          item.category,
          ...(item.tags || []),
          item.author?.name,
          item.author?.username
        ].join(" ")).toLowerCase();
        return typeOk && categoryOk && (!q || haystack.includes(q));
      });

      if (state.sort === "oldest") {
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (state.sort === "popular") {
        list.sort((a, b) =>
          (Number(b.views || 0) + Number(b.likes || 0) * 10) -
          (Number(a.views || 0) + Number(a.likes || 0) * 10)
        );
      } else if (state.sort === "likes") {
        list.sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0));
      } else if (state.sort === "name") {
        list.sort((a, b) => clean(a.title).localeCompare(clean(b.title), "ru"));
      } else {
        list.sort((a, b) => {
          const diff = new Date(b.createdAt) - new Date(a.createdAt);
          return diff || Number(b.id || 0) - Number(a.id || 0);
        });
      }

      return list;
    }

    function updateStatus(total, shown) {
      if (status) {
        const noun = fixedType === "image"
          ? "изображений"
          : fixedType === "video"
            ? "видео"
            : fixedType === "audio"
              ? "аудиоматериалов"
              : "материалов";
        status.textContent = "Показано " + shown + " из " + total + " " + noun;
      }
    }

    function render() {
      const filtered = filteredList();
      const shown = Number.isFinite(state.limit)
        ? filtered.slice(0, state.limit)
        : filtered;

      renderMobileCards(container, shown);
      container.classList.toggle("mg-mobile-catalog-list", state.list);
      updateStatus(filtered.length, shown.length);

      if (loadMore) {
        const canLoad = shown.length < filtered.length;
        loadMore.style.display = canLoad ? "" : "none";
        loadMore.hidden = !canLoad;
      }

      const applyButton = scope.querySelector("#applyFiltersBtn");
      if (applyButton) {
        applyButton.textContent = "Применить (" + filtered.length + ")";
      }
    }

    if (search) {
      search.addEventListener("input", () => {
        state.query = search.value.trim();
        state.limit = page === "gallery.html" ? 6 : Number.POSITIVE_INFINITY;
        render();
      });
    }

    clearSearch?.addEventListener("click", () => {
      state.query = "";
      if (search) search.value = "";
      state.limit = page === "gallery.html" ? 6 : Number.POSITIVE_INFINITY;
      render();
    });

    if (loadMore) {
      loadMore.addEventListener("click", () => {
        state.limit += 6;
        render();
      });
    }

    if (page === "gallery.html") {
      const typeChips = [...scope.querySelectorAll(".filter-chip[data-type]")];

      function setActiveTypeChip(active) {
        typeChips.forEach((chip) => {
          const isActive = chip === active;
          chip.classList.toggle("bg-primary-container", isActive);
          chip.classList.toggle("text-on-primary", isActive);
          chip.classList.toggle("shadow-sm", isActive);
          chip.classList.toggle("bg-surface-container", !isActive);
          chip.classList.toggle("text-on-surface-variant", !isActive);
        });
      }

      typeChips.forEach((chip) => {
        chip.type = "button";
        chip.addEventListener("click", () => {
          state.type = chip.dataset.type === "all" ? "" : chip.dataset.type;
          state.limit = 6;
          setActiveTypeChip(chip);
          render();
        });
      });

      const sortOptions = [...scope.querySelectorAll(".sort-option")];
      const sortLabel = scope.querySelector("#currentSortLabel");
      sortOptions.forEach((option) => {
        option.type = "button";
        option.addEventListener("click", () => {
          const value = option.dataset.value;
          state.sort = value === "popular"
            ? "popular"
            : value === "likes"
              ? "likes"
              : "newest";
          if (sortLabel) sortLabel.textContent = clean(option.textContent);
          render();
        });
      });

      const viewToggle = scope.querySelector("#viewToggleBtn");
      viewToggle?.addEventListener("click", () => {
        state.list = !state.list;
        const icon = viewToggle.querySelector(".material-symbols-outlined");
        if (icon) icon.textContent = state.list ? "grid_view" : "view_agenda";
        viewToggle.setAttribute("aria-label", state.list ? "Показать сеткой" : "Показать списком");
        render();
      });

      const drawer = scope.querySelector("#filterDrawerBackdrop");
      const categoryHeading = drawer
        ? [...drawer.querySelectorAll("span")].find((node) => clean(node.textContent) === "Тематика")
        : null;
      const categoryHost = categoryHeading?.parentElement?.querySelector(".flex.flex-wrap");
      const categories = [...new Set(allMaterials.map((item) => item.category).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "ru"));

      if (categoryHost) {
        categoryHost.innerHTML = categories.map((category) =>
          '<label class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container font-label-md text-label-md cursor-pointer">' +
            '<input class="accent-primary rounded" type="checkbox" data-mobile-drawer-category="' + MG.esc(category) + '">' +
            '<span>' + MG.esc(category) + '</span>' +
          '</label>'
        ).join("");

        categoryHost.querySelectorAll("[data-mobile-drawer-category]").forEach((input) => {
          input.addEventListener("change", () => {
            const draft = new Set(
              [...categoryHost.querySelectorAll("[data-mobile-drawer-category]:checked")]
                .map((item) => item.dataset.mobileDrawerCategory)
            );
            const count = filteredList(draft).length;
            const applyButton = scope.querySelector("#applyFiltersBtn");
            if (applyButton) applyButton.textContent = "Применить (" + count + ")";
          });
        });
      }

      const qualityHeading = drawer
        ? [...drawer.querySelectorAll("span")].find((node) => clean(node.textContent) === "Качество контента")
        : null;
      if (qualityHeading?.parentElement) {
        qualityHeading.parentElement.style.display = "none";
      }

      scope.querySelector("#applyFiltersBtn")?.addEventListener("click", () => {
        state.categories = categoryHost
          ? new Set(
              [...categoryHost.querySelectorAll("[data-mobile-drawer-category]:checked")]
                .map((item) => item.dataset.mobileDrawerCategory)
            )
          : new Set();
        state.limit = 6;
        render();
      });

      scope.querySelector("#resetFiltersBtn")?.addEventListener("click", () => {
        state.query = "";
        state.type = "";
        state.categories = new Set();
        state.sort = "newest";
        state.limit = 6;
        if (search) {
          search.value = "";
          search.dispatchEvent(new Event("input", { bubbles: true }));
        }
        categoryHost?.querySelectorAll("[data-mobile-drawer-category]").forEach((input) => {
          input.checked = false;
        });
        if (typeChips[0]) setActiveTypeChip(typeChips[0]);
        if (sortLabel) sortLabel.textContent = "Сначала новые";
        render();
      });
    } else {
      const searchBox = search?.closest("div.relative.w-full");
      const categoryRow = searchBox?.nextElementSibling;
      const categories = [...new Set(allMaterials.map((item) => item.category).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "ru"));

      if (categoryRow && categoryRow.querySelector("button")) {
        categoryRow.classList.add("mg-mobile-category-row");
        categoryRow.innerHTML = [
          '<button type="button" data-mobile-category="" class="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm whitespace-nowrap">Все</button>',
          ...categories.map((category) =>
            '<button type="button" data-mobile-category="' + MG.esc(category) + '" class="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md whitespace-nowrap">' +
              MG.esc(category) +
            '</button>'
          )
        ].join("");

        const categoryButtons = [...categoryRow.querySelectorAll("[data-mobile-category]")];
        categoryButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const value = button.dataset.mobileCategory;
            state.categories = value ? new Set([value]) : new Set();
            categoryButtons.forEach((item) => {
              const active = item === button;
              item.classList.toggle("bg-primary", active);
              item.classList.toggle("text-on-primary", active);
              item.classList.toggle("shadow-sm", active);
              item.classList.toggle("bg-surface-container", !active);
              item.classList.toggle("text-on-surface-variant", !active);
            });
            render();
          });
        });

        const filterButton = searchBox.querySelector('button[aria-label="Фильтры"]');
        filterButton?.addEventListener("click", () => {
          categoryRow.scrollIntoView({ behavior: "smooth", block: "center" });
          categoryRow.scrollTo({ left: 0, behavior: "smooth" });
        });
      }

      const sortCaption = [...scope.querySelectorAll("span")].find((node) =>
        /^Сортировка:/i.test(clean(node.textContent))
      );
      const sortWrap = sortCaption?.parentElement;
      const sortButton = sortWrap?.querySelector("button");
      const controlRow = sortWrap?.parentElement;

      if (controlRow && sortWrap) {
        [...controlRow.children].forEach((child) => {
          if (child !== sortWrap) child.remove();
        });

        const viewControls = document.createElement("div");
        viewControls.className = "flex items-center gap-1.5";
        viewControls.innerHTML =
          '<button type="button" data-mobile-view="grid" aria-label="Вид сеткой" aria-pressed="true" class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm transition-colors">' +
            '<span class="material-symbols-outlined text-[18px]">grid_view</span>' +
          '</button>' +
          '<button type="button" data-mobile-view="list" aria-label="Вид списком" aria-pressed="false" class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors">' +
            '<span class="material-symbols-outlined text-[18px]">view_agenda</span>' +
          '</button>';
        controlRow.appendChild(viewControls);

        const gridButton = viewControls.querySelector('[data-mobile-view="grid"]');
        const listButton = viewControls.querySelector('[data-mobile-view="list"]');

        const syncViewButtons = () => {
          [[gridButton, !state.list], [listButton, state.list]].forEach(([button, active]) => {
            if (!button) return;
            button.setAttribute("aria-pressed", active ? "true" : "false");
            button.classList.toggle("bg-primary", active);
            button.classList.toggle("text-on-primary", active);
            button.classList.toggle("shadow-sm", active);
            button.classList.toggle("bg-surface-container-low", !active);
            button.classList.toggle("text-on-surface-variant", !active);
          });
        };

        gridButton?.addEventListener("click", () => {
          state.list = false;
          syncViewButtons();
          render();
        });

        listButton?.addEventListener("click", () => {
          state.list = true;
          syncViewButtons();
          render();
        });

        syncViewButtons();
      }

      if (sortWrap && sortButton) {
        sortWrap.style.position = "relative";
        const label = [...sortButton.querySelectorAll("span")].find((node) =>
          !node.classList.contains("material-symbols-outlined")
        );

        const menu = document.createElement("div");
        menu.className = "mg-mobile-sort-menu";
        menu.hidden = true;
        menu.innerHTML =
          '<button type="button" data-mobile-sort="newest" class="is-active">Сначала новые</button>' +
          '<button type="button" data-mobile-sort="popular">По популярности</button>' +
          '<button type="button" data-mobile-sort="name">По названию</button>';
        sortWrap.appendChild(menu);

        sortButton.type = "button";
        sortButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          menu.hidden = !menu.hidden;
        });

        menu.querySelectorAll("[data-mobile-sort]").forEach((option) => {
          option.addEventListener("click", (event) => {
            event.preventDefault();
            state.sort = option.dataset.mobileSort;
            menu.querySelectorAll("[data-mobile-sort]").forEach((item) => {
              item.classList.toggle("is-active", item === option);
            });
            if (label) label.textContent = clean(option.textContent);
            menu.hidden = true;
            render();
          });
        });

        document.addEventListener("click", (event) => {
          if (!sortWrap.contains(event.target)) menu.hidden = true;
        });
      }
    }

    render();
  }

  async function setupSearch() {
    if (page !== "search.html") return;

    const initialQuery = new URLSearchParams(location.search).get("q") || "";
    const all = await MG.api("materials");
    const counts = {
      all: all.materials.length,
      image: all.materials.filter((item) => item.type === "image").length,
      video: all.materials.filter((item) => item.type === "video").length,
      audio: all.materials.filter((item) => item.type === "audio").length
    };

    document.querySelectorAll(".desktop-view,.mobile-view").forEach((scope) => {
      const input = scope.querySelector("#searchInput, #search-input, input[aria-label='Поисковый запрос']");
      const firstCard = scope.querySelector(".mg-card");

      if (!input || !firstCard) return;

      const container = firstCard.parentElement;
      const typeButtons = [...scope.querySelectorAll("button")].filter((button) => {
        return /Все\s*\(\d+\)|Изображения\s*\(\d+\)|Видео\s*\(\d+\)|Аудио\s*\(\d+\)/i.test(button.textContent);
      });
      const category = scope.querySelector("select");
      const findButton = [...scope.querySelectorAll("button")].find((button) => {
        return button.textContent.trim() === "Найти";
      });
      const loadMoreButton = [...scope.querySelectorAll("button")].find((button) => {
        return /Показать еще/i.test(button.textContent);
      });

      let activeType = "";
      let timer;

      typeButtons.forEach((button) => {
        const type = buttonType(button);
        const label = type === "image"
          ? "Изображения"
          : type === "video"
            ? "Видео"
            : type === "audio"
              ? "Аудио"
              : "Все";
        const count = type ? counts[type] : counts.all;

        button.innerHTML = button.innerHTML.replace(
          /(Все|Изображения|Видео|Аудио)\s*\(\d+\)/i,
          label + " (" + count + ")"
        );

        button.addEventListener("click", () => {
          activeType = type;
          typeButtons.forEach((item) => {
            item.classList.remove("bg-primary-container", "text-on-primary");
          });
          button.classList.add("bg-primary-container", "text-on-primary");
          runSearch();
        });
      });

      async function runSearch() {
        const params = new URLSearchParams();
        const q = input.value.trim();

        if (q) params.set("q", q);
        if (activeType) params.set("type", activeType);

        if (category) {
          const selected = category.options[category.selectedIndex]?.text || "";
          if (selected && !/все категор/i.test(selected)) {
            params.set("category", selected);
          }
        }

        const query = params.toString() ? "?" + params.toString() : "";
        const result = await MG.api("materials", { query });

        container.innerHTML = result.materials.length
          ? result.materials.map((item) => MG.cardHtml(item)).join("")
          : '<div class="col-span-full w-full rounded-2xl bg-surface-container-lowest p-space-xl text-center shadow-sm">' +
              '<span class="material-symbols-outlined text-[36px] text-outline">search_off</span>' +
              '<h3 class="font-headline-sm text-headline-sm text-on-surface mt-2">Ничего не найдено</h3>' +
              '<p class="font-body-md text-body-md text-on-surface-variant mt-1">Попробуйте изменить запрос или фильтры.</p>' +
            '</div>';

        if (loadMoreButton) {
          loadMoreButton.style.display = result.materials.length ? "" : "none";
        }

        searchStats(scope, result.total, q);
      }

      input.value = initialQuery;

      input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(runSearch, 250);
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          runSearch();
        }
      });

      category?.addEventListener("change", runSearch);
      findButton?.addEventListener("click", runSearch);

      runSearch();
    });
  }

  loadCatalog().catch((error) => MG.toast(error.message, true));
  setupSearch().catch((error) => MG.toast(error.message, true));
})();
