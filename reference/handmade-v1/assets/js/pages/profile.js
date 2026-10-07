import { mediaItems } from "../data/media.js";
import { mediaCard } from "../components/media-card.js";

const own = document.querySelector("[data-profile-media]");
if (own) {
  own.innerHTML = mediaItems.slice(0, 4).map(mediaCard).join("");
}
