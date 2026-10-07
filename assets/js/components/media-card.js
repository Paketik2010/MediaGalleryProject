import { routes } from "../paths.js";
import { typeLabel } from "../data/media.js";

export function mediaCard(item) {
  const isPlayable = item.type === "video" || item.type === "audio";
  return `
    <article class="media-card snap-start">
      <a href="${routes.detail}">
        <div class="media-card__preview media-card__preview--${item.type}">
          <img src="${item.image}" alt="">
          <span class="media-card__badge">${typeLabel[item.type]}</span>
          ${isPlayable ? '<span class="media-card__play material-symbol">play_arrow</span>' : ""}
          ${item.duration ? `<span class="media-card__duration">${item.duration}</span>` : ""}
        </div>
      </a>
      <div class="media-card__body">
        <h3 class="media-card__title">${item.title}</h3>
        <p class="media-card__description">${item.description}</p>
        <div class="media-card__meta">
          <span>${item.category} · ${item.author}</span>
          <span>${item.date}</span>
        </div>
      </div>
    </article>
  `;
}
