import { renderHeader } from "./header.js";
import { renderBottomNav } from "./bottom-nav.js";
import { renderFooter } from "./footer.js";

export function mountShell() {
  const current = document.body.dataset.page || "home";

  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  const bottom = document.querySelector("[data-site-bottom]");

  if (header) header.innerHTML = renderHeader(current);
  if (footer) footer.innerHTML = renderFooter();
  if (bottom) bottom.innerHTML = renderBottomNav(current);

  const menuButton = document.querySelector("[data-menu-button]");
  const drawer = document.querySelector("[data-mobile-drawer]");

  menuButton?.addEventListener("click", () => {
    drawer?.classList.toggle("is-open");
  });
}
