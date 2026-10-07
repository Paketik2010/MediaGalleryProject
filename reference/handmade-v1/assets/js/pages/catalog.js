import { mediaItems } from "../data/media.js";
import { mediaCard } from "../components/media-card.js";

const grid = document.querySelector("[data-media-grid]");
if (grid) {
  const type = document.body.dataset.filter || "all";
  const items = type === "all"
    ? mediaItems
    : mediaItems.filter((item) => item.type === type);

  grid.innerHTML = items.map(mediaCard).join("");
}
