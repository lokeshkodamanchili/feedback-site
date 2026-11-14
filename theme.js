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