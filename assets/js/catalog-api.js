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
    });

    if (window.MediaGalleryRefreshFilters) {
      window.MediaGalleryRefreshFilters();
    }
  }

  function searchStats(scope, count, query) {
    const line = [...scope.querySelectorAll("div")].find((div) => {
      return /Найдено:\s*\d+\s*материал/i.test(div.textContent) && !div.querySelector(".mg-card");
    });

    if (!line) return;

    let word = "материалов";
    if (count === 1) word = "материал";
    if (count >= 2 && count <= 4) word = "материала";

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
