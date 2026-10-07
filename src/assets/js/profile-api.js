(() => {
  if (!window.MG || MG.page !== "profile.html") return;

  function updateText(scope, user) {
    scope.querySelectorAll("h1,h2,h3,p,span").forEach((node) => {
      const text = node.textContent.trim();

      if (text === "Алексей Смирнов") node.textContent = user.name;
      if (text === "@alex_smirnov") node.textContent = "@" + user.username;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) node.textContent = user.email;
    });
  }

  function setMetric(scope, labelText, value) {
    const label = [...scope.querySelectorAll("span")].find((node) => {
      return node.textContent.trim() === labelText;
    });

    if (!label) return;

    const card = label.closest(".bg-surface-container-lowest");
    const count = card?.querySelector(".font-headline-lg, .font-headline-sm");

    if (count) count.textContent = value;
  }

  function updateCounters(scope, materials) {
    const total = materials.length;
    const images = materials.filter((item) => item.type === "image").length;
    const videos = materials.filter((item) => item.type === "video").length;
    const audio = materials.filter((item) => item.type === "audio").length;

    setMetric(scope, "Всего материалов", total);
    setMetric(scope, "Всего файлов", total);
    setMetric(scope, "Изображений", images);
    setMetric(scope, "Изображения", images);
    setMetric(scope, "Видео", videos);
    setMetric(scope, "Аудио / Хранилище", audio);
    setMetric(scope, "Аудио", audio);

    const title = [...scope.querySelectorAll("h2")].find((node) => {
      return node.textContent.trim() === "Мои материалы";
    });

    if (title) {
      const badge = title.parentElement?.querySelector("span");
      if (badge) {
        badge.textContent = badge.textContent.includes("(") ? "(" + total + ")" : String(total);
      }
    }

    scope.querySelectorAll("button").forEach((button) => {
      const text = button.textContent.trim();

      if (/^Все\s*\(/.test(text)) button.textContent = "Все (" + total + ")";
      if (/^Изображения\s*\(/.test(text)) button.textContent = "Изображения (" + images + ")";
      if (/^Видео\s*\(/.test(text)) button.textContent = "Видео (" + videos + ")";
      if (/^Аудио\s*\(/.test(text)) button.textContent = "Аудио (" + audio + ")";
    });
  }

  function setupFilters(scope) {
    const search = scope.querySelector('input[placeholder="Поиск по моим файлам..."]');
    const buttons = [...scope.querySelectorAll("button")].filter((button) => {
      return /^(Все|Изображения|Видео|Аудио)\s*\(/.test(button.textContent.trim());
    });

    let type = "";

    function apply() {
      const query = (search?.value || "").trim().toLowerCase();

      scope.querySelectorAll(".mg-card").forEach((card) => {
        const cardType = card.dataset.materialType || "";
        const text = (card.dataset.mgSearchText || card.textContent).toLowerCase();

        card.hidden =
          (type && cardType !== type) ||
          (query && !text.includes(query));
      });
    }

    search?.addEventListener("input", apply);

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const text = button.textContent.trim();

        type =
          text.startsWith("Изображения") ? "image" :
          text.startsWith("Видео") ? "video" :
          text.startsWith("Аудио") ? "audio" :
          "";

        buttons.forEach((item) => {
          item.style.opacity = item === button ? "1" : ".72";
        });

        apply();
      });
    });

    const addButton = [...scope.querySelectorAll("button")].find((button) => {
      return button.textContent.trim() === "Добавить";
    });

    addButton?.addEventListener("click", () => {
      location.href = MG.pageFile("upload.html");
    });
  }

  async function run() {
    const user = await MG.getUser(true);

    if (!user) {
      location.href = MG.pageFile("login.html");
      return;
    }

    const result = await MG.api("materials", { query: "?mine=1" });

    document.querySelectorAll(".stitch-desktop-view,.stitch-mobile-view").forEach((scope) => {
      updateText(scope, user);
      MG.renderCards(scope, result.materials, true);
      updateCounters(scope, result.materials);
      setupFilters(scope);
    });
  }

  run().catch((error) => MG.toast(error.message, true));
})();