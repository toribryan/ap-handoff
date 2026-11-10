/*
 * Shared helpers: escaping, icons, the confidence rule, settings that carry
 * between pages, accessible tabs, and the page header.
 */
window.AP = window.AP || {};

(function () {
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );

  /* Lucide paths, drawn at 24 and scaled. currentColor so they take the text color. */
  const PATHS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    upload:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  };

  const icon = (name, size = 16, extra = "") =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${PATHS[name]}</svg>`;

  /*
   * Confidence is a word, never a color: how sure the result is, from how
   * much of the quiz matched the essay. The instructor decides what to do
   * with it. Thresholds are illustrative; see docs/01-handoff.md.
   */
  const confidence = (correct, total) => {
    const share = total ? correct / total : 0;
    if (share >= 0.8) return "High";
    if (share >= 0.5) return "Medium";
    return "Low";
  };

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;

  /* Settings carry from the setup view to the emails page. Storage can be off. */
  const KEY = "authorproof.settings";
  const loadSettings = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) return { ...AP.data.defaults, ...saved };
    } catch (_) {}
    return { ...AP.data.defaults };
  };
  const saveSettings = (settings) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch (_) {}
  };

  /*
   * Tabs following the ARIA tabs pattern: arrow keys move between tabs,
   * Home and End jump to the ends, and selection follows focus.
   */
  function tabs(list, onChange) {
    const all = () => [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      for (const t of all()) {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      }
      if (focus) tab.focus();
      onChange?.(tab.dataset.value);
    };
    list.addEventListener("click", (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) select(tab, false);
    });
    list.addEventListener("keydown", (event) => {
      const list_ = all();
      const i = list_.indexOf(document.activeElement);
      if (i < 0) return;
      const next = {
        ArrowRight: list_[(i + 1) % list_.length],
        ArrowLeft: list_[(i - 1 + list_.length) % list_.length],
        Home: list_[0],
        End: list_[list_.length - 1],
      }[event.key];
      if (next) {
        event.preventDefault();
        select(next, true);
      }
    });
    return {
      select: (value) => {
        const tab = all().find((t) => t.dataset.value === value);
        if (tab) select(tab, false);
      },
    };
  }

  /* The header every page shares, with the current page marked. */
  function header(current) {
    const links = [
      ["index.html", "Overview"],
      ["flow.html", "Student flow"],
      ["emails.html", "Emails"],
      ["grading.html", "Grading view"],
    ];
    const el = document.querySelector("[data-site-header]");
    el.innerHTML = `
      <a class="t-strong" href="index.html" style="text-decoration:none;white-space:nowrap">AuthorProof <span class="muted">· handoff</span></a>
      <nav aria-label="Pages">
        ${links
          .map(
            ([href, label]) =>
              `<a href="${href}" ${href === current ? 'aria-current="page"' : ""}>${label}</a>`
          )
          .join("")}
      </nav>
      <button class="btn btn--outline btn--icon" type="button" data-theme-toggle aria-label="Switch between light and dark">${icon("sun")}</button>`;
    el.querySelector("[data-theme-toggle]").addEventListener("click", () => {
      const root = document.documentElement;
      const dark =
        root.dataset.theme === "dark" ||
        (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
      root.dataset.theme = dark ? "light" : "dark";
    });
  }

  const FOOTNOTE =
    "Recreated for this handoff with sample data. The original design files are under NDA, so no screen here is a Proctorio or Canvas file.";

  AP.ui = { escape, icon, confidence, formatTime, loadSettings, saveSettings, tabs, header, FOOTNOTE };
})();
