import { mediaItems } from "../data/media.js";
import { mediaCard } from "../components/media-card.js";

const featured = document.querySelector("[data-featured-media]");
if (featured) {
  featured.innerHTML = mediaItems.slice(0, 4).map(mediaCard).join("");
}
