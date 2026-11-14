(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  let theme = "dark";
  try { theme = localStorage.getItem("bhaai-theme") === "light" ? "light" : "dark"; } catch {}
  function apply(next) {
    theme = next; root.dataset.theme = theme; root.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "light" ? "#faf6f0" : "#0a0a0f";
    if (toggle) { toggle.setAttribute("aria-pressed", String(theme === "dark")); toggle.setAttribute("aria-label", theme === "dark" ? "Switch to day mode" : "Switch to night mode"); toggle.title = theme === "dark" ? "Switch to day mode" : "Switch to night mode"; }
    try { localStorage.setItem("bhaai-theme", theme); } catch {}
  }
  apply(theme);
  toggle?.addEventListener("click", () => apply(theme === "dark" ? "light" : "dark"));
})();

// Responsive navigation: close after selection, outside click, Escape, and desktop resize.
(() => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;
  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  };
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = toggle.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { close(); toggle.focus(); }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) close();
  });
})();
