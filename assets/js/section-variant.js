(() => {
  const PATH = location.pathname.toLowerCase();

  const IMAGE_DATA = [
    {
      title: "Рассвет на плато Бермамыт",
      category: "Фотографии",
      author: "Дмитрий К.",
      date: "Сегодня, 08:30",
      likes: "248",
      views: "1.4k",
      description: "Первые лучи восходящего солнца над Эльбрусом и плотное туманное море в ущелье.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWkPJVf3E1o367LQ0mmVZdrEGxc4VNhomssK5qKXpe1xxZVmYJOqK48KLaD1ed__fZ5ZbGAw3pAqNElIM1QW0k2CNmBKI4vCV4QrLGuuMEZYsrxU6lcXBnfZCValFWzOtFW0hrY4EghVEV6htnfxWKoyGv47LaL0x-wrbB8oalCMaVdhiyeA7UQ_w4omTxYM4SmF5F6lGkTYtkWLR52pSOGnujtfoy7ABjXD17szU"
    },
    {
      title: "Геометрия бетона: Музей",
      category: "Архитектура",
      author: "Мария Волкова",
      date: "Вчера",
      likes: "167",
      views: "920",
      description: "Минималистичный брутализм, ритмичные тени и геометрические световые люки в атриуме.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfTKEpW6gfGSeIsbVwj0ejNyN97BcbadEdJs78EYhJfUtVaahkgSeEvpcSk93U4FhJUl--J43Uvjl_bHw-5GvDtnmRMJBwbJzZ_7ja9c-S-hHOb67KNF_SczN90j0VZikAv-OoRA0ojlaWHRrQz-jOQEbcDtMTfJLI_JCBYc7riQ1kHXNYaYAx3Ug1AxX-heUqEKcc90Og6FC5xib6MklQZKu3dDZVL3EvFFVdv8w"
    },
    {
      title: "Утренняя роса на клевере",
      category: "Фотографии",
      author: "Максим И.",
      date: "3 дня назад",
      likes: "142",
      views: "780",
      description: "Макросъемка капель с преломлением солнечных лучей на рассвете в саду.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG0MDGYKl-GGooNSmSbRvAE7qcJLvhxl7Xm9QRy-l2SemNLOAA5VNFP4awMCU0uBgAjjrYFJ0gPhhXyVF_9TQJjXzYXUlg9nSNLrsAVbodjjnfF6xMGPli9kTTulWt5Y5n_3P0CbjSNBEY7Y80Zqmd56Z4ldF7SCXjrRsMHdp2VF14zKFex0RwDKbToKlcPr3LimLh6HklTYmN0j1ersQQecpB90DhK8AeLoGH2nc"
    },
    {
      title: "Неоновые отражения Синдзюку",
      category: "Город",
      author: "Kenji Sato",
      date: "4 дня назад",
      likes: "512",
      views: "2.1k",
      description: "Атмосферный ночной Токио под дождем: зеркальные лужи и неоновые вывески.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZQ7NRSMOxZi2q224SvFix_9ZAQ2GtFXQ1Z9bUyZJWxH80EXkQYjSTcu2sa1R7SC15dn3vwQSXZZZYy7O5WKmqHZCSx0dpfhl21FUzvemixD_1P-xIH8QsF8eoXz5P5sgUgroENUCeyk1HcSX4ugt7nxWLedo7KyUkiOmRrnRf_djd40-FlAFouZd6jDbMXV6GYIrddZETKT0GkAYD7nPPE_lGj5GD5Qit6Pf6tdg"
    },
    {
      title: "Скандинавская студия",
      category: "Дизайн",
      author: "Эмма Линд",
      date: "5 дней назад",
      likes: "210",
      views: "1.1k",
      description: "Минималистичное жилое пространство в теплых естественных тонах с обилием света.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3R1IC7373pVcA_qHejQ5gclXm8F8Rhpcjr1NXRiQaOWw8IU3ec9hXzzM4IVDGIcprofnpmOzrV_TIJ7g0FHvYokmgoFczLeA_2wxxZJxHfC_OtBm_nsZBVju1XQS2CLQbCpZ2oXdVWmHMnCXvkewEZzRr1IkD0yku-h699E6D3jnRd-d95MmwuaaJr1L8XzDy2rDk-YZXcl1AmN0xXNJoZjE1Ht0fu1gdnLqQvKc"
    },
    {
      title: "Минимализм в архитектуре",
      category: "Архитектура",
      author: "Артем Романов",
      date: "1 неделю назад",
      likes: "98",
      views: "640",
      description: "Ритм стеклянных панелей и четкие фасадные линии высотного делового квартала.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfi9rLgLdD6ZZ1H9Mu5vAUguJ4hYjhbeqA3wUoTdW84vPbkM1w3AJAldoEltR5HhD0KhpsrPqRmpnOsU6pQcnI2zzGdxkM0rJLnj-01itRv114pAeTh76Bh29IzoijTYgpgpwdtPZnQ2V3_oirNSqCQQEjuwT_nO12RjB6mDVlvtGjlF-3eC8aYUJjnyCdqpkBwEpQLHPUcdtvzF4y3UppUofhW15B1ycQJTNIQhE"
    },
    {
      title: "Альпийский рассвет над озером",
      category: "Фотографии",
      author: "Ольга Ветрова",
      date: "1 неделю назад",
      likes: "880",
      views: "3.4k",
      description: "Зеркальная гладь воды и розовое сияние первых лучей на заснеженных вершинах.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTQ0gx9JR0Z2YbZzu4JGag4U6w6KMf7UGmreWzTo3ZFklx2i9N9CFOc06ZMUSVlnMT5IeK1Kcz8oFGRJRvv6oUwtstz7mrnXqSWgwhuB544bcVChbv1FwXUY5cBJ0GaEQeXhhwyIjtSIGoGk2ZgLw8oD1f4JasU9yQ5hvDoMQleQRhh0_bt-o4CiszQB1yZwWkYfIeZoW4tHi_yQsOtbJEu1IpX0W1u5Dq7OZ2_24"
    },
    {
      title: "Рабочее место дизайнера",
      category: "Дизайн",
      author: "Илья Чернов",
      date: "2 недели назад",
      likes: "340",
      views: "1.8k",
      description: "Минималистичный сетап с ультрашироким дисплеем, механической клавиатурой и лампой.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTaZQorv5USegapvLumOcsZfV99V08KYJgS73EmC4rz9uq6wFxk6LpBCi6RzW01sjhw5DHxynrX7UYhqwEGCfMTPbgSnf0Ft5wRFISuuGrJxnBoM9VtxSe7gz75jhf_kqPCdfjAGuF1478alprdiPP3AL8w_wYqUR9V0vBtI6IavtawcCbq6swglJKcP7GrczzBPCD0GQVvLUe5Uhmo_2cnv8234saSYjJpZTwIII"
    }
  ];

  const VIDEO_DATA = [
    {
      title: "Введение в CSS Grid и Flexbox: полное руководство",
      category: "Обучение",
      author: "Михаил Воронов",
      date: "Вчера, 18:30",
      likes: "348",
      views: "4.2k",
      description: "Пошаговый разбор современной адаптивной верстки и практических приемов.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDYYzIhFiBbi7d_OcIrplj5M4tOwTSpEPhdGP3iQVopdk_QWjVDseG74b5nJRR4eyI9X0FGIWdzqr1RpDc9TaRfr3dcIJbfXSSTlclt-8WEqcUVPCEdUolmO43Uiw4lmrkcL1D_GWpO4cenrNPNqSDIkmVQY3AJ6uTBiFOJNd-xju-QeToSzPbpxcS_kKTAqV82ctFjLMkAR94FmcEnxR4Djm5Z7n5lp7LwMChvbs"
    },
    {
      title: "Дикая Исландия: Аэросъемка ледников и водопадов",
      category: "Путешествия",
      author: "Елена Романова",
      date: "3 дня назад",
      likes: "1.2k",
      views: "12.8k",
      description: "Кинематографическая аэросъемка ледников, черных пляжей и мощных водопадов.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQwFctFDmnyjlferD-7Z8C_wkOsc6cB6xzYr5NYB4WFnWOTx5SM4z5uebFAPSrzCULnMWGSDS5YQm9Phkb7igYoVpKpH6whF8sQs4n_1mCBvMdrurfGxoXNLgzU_HOKDeEBtDrgI-q6PLQy2dawf5DC8M3mmTO6joWSRv0HdMZyBovYkzHEHuleGoz32FyY9gxLk2vrzXDIVZcQ8oWt2_z-iBaqJ55O0-k0xs7AbM"
    },
    {
      title: "Архитектура дизайн-систем: масштабирование токенов",
      category: "Обучение",
      author: "Артем Васильев",
      date: "Неделю назад",
      likes: "512",
      views: "6.4k",
      description: "Как строить масштабируемые дизайн-системы и поддерживать единый визуальный язык.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMp8I3eqGYuaDvoACoxecviAHOBEfCiqamKVGwCvkxqTGZ2I2FYpJR7wL4-iY-vFkgi0qnxhkdkq4_tuRD2ywQeT9PHXfFAdiC7ECNpLUwhJ90TgF9Yd5kdZFhij7PJ0BXpi8BRSLAO8dJxdcmJTI_oZAIijibylTWayOdNrLqQg3DJqTt7cr379pngviMy2Tm3e-BlqJdZcq7fO3OvahRLN3iBo1qHulL1kW0KUU"
    },
    {
      title: "Таймлапс: ночное побережье и звездное небо",
      category: "Путешествия",
      author: "Сергей Кузнецов",
      date: "2 недели назад",
      likes: "840",
      views: "9.1k",
      description: "Медленный ночной таймлапс побережья под ярким звездным небом.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrhYAuR2EHfRe1gClA_r_SjwaZDS6O5FZtJG40T6eJgq1-xPv-JwroOl7QoAKUHySBn6RC1qfuxSZwusuYtwN8QaO3MCLOj2mQ1pAWsfPqVm0JtbgWA-PO1szrbI4KslybCn80o_rEhDdPrG2MZk9pKr3tfwi5qX8hI7uUfbUzHDhIWp0RIRB-ktq0sTTKgnrMoXc1MPfS8jo0USOUuQrabfoF0rKTb1IlMMLHhCk"
    },
    {
      title: "Шоурил моушн-дизайна 2026",
      category: "Развлечения",
      author: "Анна Соколова",
      date: "Вчера",
      likes: "2.1k",
      views: "18.5k",
      description: "Подборка 3D-анимации, кинетической типографики и экспериментального моушна.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuC62_XcWaSRsjdGc0O22Nq3P69nGlBxROP7J7v9NtRzAwX-BJtOMEnjiyN6Ozi7HpPcNTntAWQ8H5YKt4_M1ufI0ahU0tWfRXKx0QmsjOjrCzPLw9gSE23ai48VCIid3FZA_a_hFoRyi7d5KzTklG1pqlC0kLnGhsynjchpB6mSPKoBReFO-UCsacKr_Ln-b_3V9Sj_i_PmaF56Odvz8emuJSwgmqB7_68kxKHqe7A"
    },
    {
      title: "Основы UI-анимации: физика жестов и тайминги",
      category: "Обучение",
      author: "Дмитрий Лебедев",
      date: "4 дня назад",
      likes: "610",
      views: "7.3k",
      description: "Практика плавных интерфейсных переходов, жестов и естественной физики движения.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoKoNI1CnRF1yU582IbFOttdIeVE83wdYm-FbI-cqpEybD80OAJoxGg9PP-rWeZiWL8DIev7xCdEIW26w0OJvHI9vcseV9P05dbUKW5HXMM8O6A9cc5At7ylIR13iBM05PJnB1NismWKGIYcGSZvjLVQGbrv0T0OUcqGpsqmKuLecRDGfuMYO9E3BAAQ7srSB2XzihhUtu3exWzElldMsx60NZJb1diJ5G6JjoXY"
    },
    {
      title: "Утро в кофейне: кинематографичный слоу-моушн",
      category: "Развлечения",
      author: "Ольга Ильина",
      date: "5 дней назад",
      likes: "490",
      views: "5.8k",
      description: "Мягкий утренний свет, кофе и спокойная кинематографичная съемка в слоу-моушн.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTJ6Rs4bTQM7M8smClC1G3QsgOSHKchfKSCzrGOWh4nwY8TY_BiUxZAT6b1vjRQBqyuqu28083zobQmA55YPAJxz4p2dSki6a2u6Sreg1TnAASnc4K1u83KZze5BKkN1b6CDdTGz2Ea_AFXcO7F983yqkdJ1ezZ62qvgWrttAkWOSeoxangsCJC36fjfhteMXU4PKNiJa4qWgiayIKERA87mamfBsG4MKR4TpUAi0"
    },
    {
      title: "Как устроен квантовый процессор",
      category: "Технологии",
      author: "Константин Власов",
      date: "1 неделю назад",
      likes: "970",
      views: "11.2k",
      description: "Наглядный разбор архитектуры квантового процессора и базовых принципов его работы.",
      preview: "https://lh3.googleusercontent.com/aida-public/AB6AXuAt1n6Po3qWVS6x6zuTx8nk0q_x7THJ6Jc9VRDiMqThxfJyxXbf6iEJtitgQrpxQohaLtzrXdQpAj3oGpzK3zrhB8_QQsPr3RKb83FIwgrgK-ezlxh7UK7TmNj3kf51FCgmN7Zn8hUHlO0778Ehomdu6BTeUl6j5vccd0tv9hnb57IAApR8o91Py4v8Q4437v45Au6LO7TLo98UpqwQTkA4Xhfyn7KVewrF6DTTu_A"
    }
  ];

  const CONFIG = {
    images: {
      title: "Изображения",
      subtitle: "Фотографии и графические материалы пользователей",
      mobileSubtitle: "Фотографии и графические материалы пользователей (180)",
      mobileCount: "180 ФОТО",
      icon: "image",
      typeText: "Изображения (180)",
      summary: "Всего файлов: 180",
      shownDesktop: "Показано 1–8 из 180 изображений",
      shownMobile: "Показано 4 из 180 изображений",
      uploadTitle: "Есть свои изображения?",
      uploadText: "Загрузите JPG, PNG или WEBP",
      data: IMAGE_DATA
    },
    videos: {
      title: "Видео",
      subtitle: "Видео пользователей галереи",
      mobileSubtitle: "Видео пользователей галереи (98)",
      mobileCount: "98 ВИДЕО",
      icon: "videocam",
      typeText: "Видео (98)",
      summary: "Всего видео: 98",
      shownDesktop: "Показано 1–8 из 98 видео",
      shownMobile: "Показано 4 из 98 видео",
      uploadTitle: "Есть свое видео?",
      uploadText: "Загрузите MP4 или WEBM",
      data: VIDEO_DATA
    }
  };

  function pageKey() {
    if (PATH.endsWith("/images.html")) return "images";
    if (PATH.endsWith("/videos.html")) return "videos";
    return "";
  }

  function clean(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function replaceExact(scope, from, to) {
    [...scope.querySelectorAll("*")].forEach((el) => {
      if (el.children.length === 0 && clean(el.textContent) === from) {
        el.textContent = to;
      }
    });
  }

  function updateHeader(scope, cfg) {
    const h1 = scope.querySelector("h1");
    if (h1) h1.textContent = cfg.title;

    if (h1?.parentElement) {
      const mobile = scope.classList.contains("mobile-view");
      const headerBlock = mobile ? h1.parentElement.parentElement : h1.parentElement;
      const subtitle = headerBlock
        ? [...headerBlock.children].find((el) => el.tagName === "P")
        : null;

      if (subtitle) {
        subtitle.textContent = mobile ? cfg.mobileSubtitle : cfg.subtitle;

        if (!mobile) {
          subtitle.classList.remove("font-body-md", "text-body-md");
          subtitle.classList.add("font-body-lg", "text-body-lg");
          subtitle.style.setProperty("font-size", "16px", "important");
          subtitle.style.setProperty("line-height", "24px", "important");
          subtitle.style.setProperty("font-weight", "400", "important");
        }
      }

      if (!mobile) {
        const typeIcon = h1.parentElement.querySelector(".material-symbols-outlined");
        if (typeIcon) typeIcon.textContent = cfg.icon;
      }
    }

    if (scope.classList.contains("mobile-view")) {
      const badge = h1?.parentElement?.querySelector("span");
      if (badge) badge.textContent = cfg.mobileCount;
    }

    replaceExact(scope, "Тип: Аудио (64 трека)", "Тип: " + cfg.typeText);
    replaceExact(scope, "Суммарно: 18 ч 40 мин", cfg.summary);
    replaceExact(scope, "Показано 1–8 из 64 аудиоматериалов", cfg.shownDesktop);
    replaceExact(scope, "Показано 4 из 64 аудиофайлов", cfg.shownMobile);
    replaceExact(scope, "Есть свой трек?", cfg.uploadTitle);
    replaceExact(scope, "Загрузите MP3, WAV или FLAC", cfg.uploadText);

    const quickChip = [...scope.querySelectorAll("strong")]
      .find((el) => clean(el.textContent) === "Аудио (64 трека)");
    if (quickChip) quickChip.textContent = cfg.typeText;

    const quickChipWrap = quickChip?.closest("div");
    const quickChipIcon = quickChipWrap?.querySelector(".material-symbols-outlined");
    if (quickChipIcon) quickChipIcon.textContent = cfg.icon;
  }

  function updateCard(card, data) {
    if (!card || !data) return;

    const preview = card.querySelector(".mg-card__preview");
    const image = preview?.querySelector("img");
    const placeholder = preview?.querySelector(".mg-card__placeholder");

    if (data.preview) {
      if (image) {
        image.src = data.preview;
      } else if (preview) {
        const img = document.createElement("img");
        img.src = data.preview;
        img.alt = "";
        if (placeholder) placeholder.replaceWith(img);
        else preview.prepend(img);
      }
    }

    const title = card.querySelector(".mg-card__title");
    const category = card.querySelector(".mg-card__category");
    const author = card.querySelector(".mg-card__author-name");
    const date = card.querySelector(".mg-card__date");
    const description = card.querySelector(".mg-card__description");
    const metrics = [...card.querySelectorAll(".mg-card__metric")];

    if (title) title.textContent = data.title;
    if (category) category.textContent = data.category;
    if (author) author.textContent = data.author;
    if (date) date.textContent = data.date;
    if (description) description.textContent = data.description;

    const likes = card.querySelector(".mg-card__metric--likes");
    if (likes) {
      const icon = likes.querySelector(".material-symbols-outlined");
      likes.textContent = data.likes;
      if (icon) likes.prepend(icon);
    }

    const views = metrics.find((el) => !el.classList.contains("mg-card__metric--likes"));
    if (views) {
      const icon = views.querySelector(".material-symbols-outlined");
      views.textContent = data.views;
      if (icon) views.prepend(icon);
    }

    const save = card.querySelector(".mg-card__save");
    if (save) save.setAttribute("aria-label", "Сохранить " + data.title);
  }

  function updateCards(scope, cfg) {
    [...scope.querySelectorAll(".mg-card")].forEach((card, index) => {
      updateCard(card, cfg.data[index % cfg.data.length]);
    });
  }

  function updateDesktopNav(scope, key) {
    const targetPath = key === "images" ? "images" : key === "videos" ? "videos" : "audio";
    const header = scope.querySelector("header");
    if (!header) return;

    const links = [...header.querySelectorAll('a[data-path="images"], a[data-path="videos"], a[data-path="audio"]')];

    links.forEach((link) => {
      const active = link.dataset.path === targetPath;

      link.classList.remove(
        "bg-surface-container-high",
        "text-primary",
        "font-title-md"
      );

      link.classList.add(
        "rounded-lg",
        "transition-colors",
        "hover:bg-surface-container",
        "hover:text-on-surface"
      );

      if (active) {
        link.classList.remove("text-on-surface-variant");
        link.classList.add(
          "bg-surface-container-high",
          "text-primary",
          "font-title-md"
        );
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.add("text-on-surface-variant");
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateBottomNav(scope, key) {
    const wantedPaths = key === "images"
      ? ["images", "izobrazheniya"]
      : key === "videos"
        ? ["videos", "video"]
        : ["audio"];

    const nav = scope.querySelector("nav.fixed.bottom-0");
    if (!nav) return;

    [...nav.querySelectorAll("a[data-path]")].forEach((link) => {
      const active = wantedPaths.includes(link.dataset.path);
      link.classList.remove("text-primary", "font-semibold");
      link.removeAttribute("aria-current");

      if (active) {
        link.classList.add("text-primary", "font-semibold");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function run() {
    const key = pageKey();
    if (!key) return;
    const cfg = CONFIG[key];

    document.title = cfg.title + " — MediaGallery";

    document.querySelectorAll(".desktop-view, .mobile-view").forEach((scope) => {
      updateHeader(scope, cfg);
      updateCards(scope, cfg);
      updateDesktopNav(scope, key);
      updateBottomNav(scope, key);
    });
  }

  run();
})();
