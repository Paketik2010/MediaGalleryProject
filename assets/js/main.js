import { mountShell } from "./components/shell.js";

mountShell();

document.querySelectorAll("[data-toast-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  });
});
