(() => {
  if (!window.MG || MG.page !== "upload.html") return;

  function showError(scope, text) {
    let box = scope.querySelector("[data-upload-error]");

    if (!box) {
      box = document.createElement("div");
      box.dataset.uploadError = "1";
      box.style.cssText =
        "padding:12px 14px;border-radius:12px;background:#ffdad6;color:#93000a;" +
        "font:500 13px/18px Inter,sans-serif";
      scope.prepend(box);
    }

    box.textContent = text;
  }

  function typeFromFile(file) {
    const mime = String(file?.type || "").toLowerCase();

    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";

    const name = String(file?.name || "").toLowerCase();

    if (/\.(jpg|jpeg|png|webp|gif)$/.test(name)) return "image";
    if (/\.(mp4|webm|ogv|ogg)$/.test(name)) return "video";
    if (/\.(mp3|wav|m4a|aac|flac|oga)$/.test(name)) return "audio";

    return "";
  }

  function currentType(scope) {
    if (scope._selectedUploadFile) {
      return typeFromFile(scope._selectedUploadFile) || scope.dataset.uploadType || "video";
    }

    const radio = scope.querySelector('input[name="media_type"]:checked');
    if (radio) return radio.value;

    return scope.dataset.uploadType || "video";
  }

  function selectType(scope, type) {
    if (!["image", "video", "audio"].includes(type)) return;

    scope.dataset.uploadType = type;

    scope.querySelectorAll('input[name="media_type"]').forEach((radio) => {
      radio.checked = radio.value === type;
    });

    scope.querySelectorAll("[data-upload-type-button]").forEach((item) => {
      const active = item.dataset.uploadTypeButton === type;
      item.style.outline = active ? "2px solid #4f46e5" : "";
      item.style.outlineOffset = active ? "1px" : "";
    });
  }

  function setupTypeButtons(scope) {
    scope.querySelectorAll('input[name="media_type"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;

        if (scope._selectedUploadFile) {
          const detected = typeFromFile(scope._selectedUploadFile);
          if (detected && detected !== radio.value) {
            selectType(scope, detected);
            MG.toast("Тип определяется по загруженному файлу");
            return;
          }
        }

        selectType(scope, radio.value);
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
        if (scope._selectedUploadFile) {
          const detected = typeFromFile(scope._selectedUploadFile);

          if (detected && detected !== type) {
            selectType(scope, detected);
            MG.toast("Тип уже определён по файлу");
            return;
          }
        }

        selectType(scope, type);
      });
    });
  }

  function makeVideoThumbnail(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      let done = false;

      function finish(result) {
        if (done) return;
        done = true;
        URL.revokeObjectURL(url);
        video.remove();
        resolve(result || null);
      }

      video.muted = true;
      video.preload = "metadata";
      video.playsInline = true;

      video.addEventListener("loadedmetadata", () => {
        const target = Number.isFinite(video.duration) && video.duration > 1
          ? Math.min(1, video.duration / 3)
          : 0;
        try {
          video.currentTime = target;
        } catch (_) {
          finish(null);
        }
      }, { once: true });

      video.addEventListener("seeked", () => {
        if (!video.videoWidth || !video.videoHeight) {
          finish(null);
          return;
        }

        const maxWidth = 1280;
        const scale = Math.min(1, maxWidth / video.videoWidth);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));

        const context = canvas.getContext("2d");
        if (!context) {
          finish(null);
          return;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (!blob) {
            finish(null);
            return;
          }

          finish(new File([blob], "video-preview.jpg", {
            type: "image/jpeg"
          }));
        }, "image/jpeg", 0.82);
      }, { once: true });

      video.addEventListener("error", () => finish(null), { once: true });
      video.src = url;
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
    input.accept = "image/*,video/*,audio/*";
    input.hidden = true;
    input.dataset.uploadFile = "1";
    dropzone.appendChild(input);

    async function showFile(file) {
      scope._selectedUploadFile = file || null;
      scope._videoThumbnail = null;

      if (!file) return;

      const detected = typeFromFile(file);

      if (!detected) {
        showError(scope, "Поддерживаются только изображения, видео и аудио");
        scope._selectedUploadFile = null;
        return;
      }

      selectType(scope, detected);

      if (label) {
        label.textContent = file.name;
      }

      if (detected === "video") {
        scope._videoThumbnail = await makeVideoThumbnail(file);

        if (!scope._videoThumbnail) {
          MG.toast("Видео загрузится, но кадр-превью создать не удалось");
        }
      }
    }

    dropzone.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
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
          input.className =
            "w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest text-on-surface " +
            "font-body-md text-body-md shadow-sm outline-none focus:shadow-md mt-2";
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
        return '<option value="' + MG.esc(category.name) + '">' +
          MG.esc(category.name) + '</option>';
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

      if (scope._videoThumbnail) {
        data.set("thumbnail", scope._videoThumbnail);
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