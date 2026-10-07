import { mediaItems } from "../data/media.js";
import { mediaCard } from "../components/media-card.js";

const params = new URLSearchParams(window.location.search);
const query = (params.get("q") || "природа").trim();

const input = document.querySelector("[data-search-input]");
const count = document.querySelector("[data-search-count]");
const grid = document.querySelector("[data-search-results]");
const empty = document.querySelector("[data-search-empty]");

if (input) input.value = query;

const normalized = query.toLowerCase();
const results = query
  ? mediaItems.filter((item) =>
      [item.title, item.description, item.category, item.author]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
  : mediaItems;

if (count) count.textContent = String(results.length);
if (grid) grid.innerHTML = results.map(mediaCard).join("");
if (empty) empty.hidden = results.length !== 0;
if (grid) grid.hidden = results.length === 0;
