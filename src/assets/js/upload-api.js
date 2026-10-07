(() => {
  if (!window.MG || MG.page !== "upload.html") return;

  function showError(scope, text) {
    let box = scope.querySelector("[data-upload-error]");

    if (!box) {
      box = document.createElement("div");
      box.dataset.uploadError = "1";
      box.style.cssText = "padding:12px 14px;border-radius:12px;background:#ffdad6;color:#93000a;font:500 13px/18px Inter,sans-serif";
      scope.prepend(box);
    }

    box.textContent = text;
  }

  function currentType(scope) {
    const radio = scope.querySelector('input[name="media_type"]:checked');
    if (radio) return radio.value;
    return scope.dataset.uploadType || "video";
  }

  function setupTypeButtons(scope) {
    scope.querySelectorAll('input[name="media_type"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) scope.dataset.uploadType = radio.value;
      });
    });

    [...scope.querySelectorAll("span")].forEach((span) => {
      const text = span.textContent.trim();
      if (!["Фото", "Видео", "Аудио"].includes(text)) return;

      const card = span.closest(".cursor-pointer");
      if (!card) return;

      const type = text === "Фото" ? "image" : text === "Аудио" ? "audio" : "video";
      card.dataset.uploadTypeButton = type;

      card.addEventListener("click", () => {
        scope.dataset.uploadType = type;

        scope.querySelectorAll("[data-upload-type-button]").forEach((item) => {
          item.style.outline = item === card ? "2px solid #4f46e5" : "";
          item.style.outlineOffset = item === card ? "1px" : "";
        });
      });
    });
  }

  function setupFilePicker(scope) {
    const label = [...scope.querySelectorAll("p,h4")].find((node) => {
      return /Перетащите файл сюда|Нажмите для выбора файла/i.test(node.textContent);
    });

    const dropzone = label?.closest(".cursor-pointer") || label?.parentElement;
    if (!dropzone) return;

    const input = document.createElement("input");
    input.type = "file";
    input.hidden = true;
    input.dataset.uploadFile = "1";
    dropzone.appendChild(input);

    function updateAccept() {
      const type = currentType(scope);
      input.accept = type === "image" ? "image/*" : type === "audio" ? "audio/*" : "video/*";
    }

    function showFile(file) {
      scope._selectedUploadFile = file || null;
      if (file && label) label.textContent = file.name;
    }

    dropzone.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      updateAccept();
      input.click();
    });

    input.addEventListener("change", () => {
      showFile(input.files?.[0]);
    });

    dropzone.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      showFile(event.dataTransfer?.files?.[0]);
    });
  }

  function setupLink(scope) {
    [...scope.querySelectorAll("button")].forEach((button) => {
      if (!/Указать ссылку/i.test(button.textContent)) return;

      button.addEventListener("click", () => {
        let input = scope.querySelector("[data-upload-link]");

        if (!input) {
          input = document.createElement("input");
          input.type = "url";
          input.placeholder = "https://example.com/media.mp4";
          input.dataset.uploadLink = "1";
          input.className = "w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm outline-none focus:shadow-md mt-2";
          button.parentElement?.insertAdjacentElement("afterend", input);
        }

        input.focus();
      });
    });
  }

  async function setupScope(scope, categories) {
    setupTypeButtons(scope);
    setupFilePicker(scope);
    setupLink(scope);

    scope.querySelectorAll("#assetCategory,#category-select").forEach((select) => {
      select.innerHTML = categories.map((category) => {
        return '<option value="' + MG.esc(category.name) + '">' + MG.esc(category.name) + '</option>';
      }).join("");
    });

    const form = scope.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData();
      data.set("title", scope.querySelector("#assetTitle,#material-title")?.value || "");
      data.set("description", scope.querySelector("#assetDescription,#material-desc")?.value || "");
      data.set("category", scope.querySelector("#assetCategory,#category-select")?.value || "Другое");
      data.set("type", currentType(scope));

      if (scope._selectedUploadFile) {
        data.set("file", scope._selectedUploadFile);
      }

      const source = scope.querySelector("[data-upload-link]")?.value.trim();
      if (source) data.set("source_url", source);

      try {
        const result = await MG.api("add_material", {
          method: "POST",
          form: data
        });

        MG.toast("Материал опубликован");

        setTimeout(() => {
          location.href = MG.pageFile("detail.html", "?id=" + result.material.id);
        }, 300);
      } catch (error) {
        showError(form, error.message);
      }
    });
  }

  async function run() {
    const user = await MG.getUser(true);

    if (!user) {
      location.href = MG.pageFile("login.html");
      return;
    }

    const categories = (await MG.api("categories")).categories;

    for (const scope of document.querySelectorAll(".stitch-desktop-view,.stitch-mobile-view")) {
      await setupScope(scope, categories);
    }
  }

  run().catch((error) => MG.toast(error.message, true));
})();