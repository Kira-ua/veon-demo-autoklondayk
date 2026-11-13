// Page behaviour: finder tabs, VIN ruler groups, header state, mobile menu, bottom bar, VIN build-in.
// Everything works without this file: content stays visible, tabs show all three ways stacked.

const root = document.documentElement;

/* ---------- Finder tabs (WAI-ARIA tabs, automatic activation) ---------- */
const tabsRoot = document.querySelector<HTMLElement>("[data-tabs]");
if (tabsRoot) {
  const tabs = Array.from(tabsRoot.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls") ?? ""));
  const select = (index: number, focus = false) => {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      const panel = panels[i];
      if (panel) {
        panel.hidden = !on;
        if (on) {
          panel.classList.remove("is-entering");
          void panel.offsetWidth;
          panel.classList.add("is-entering");
        }
      }
    });
    tabsRoot.style.setProperty("--tab-index", String(index));
    if (focus) tabs[index]?.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const last = tabs.length - 1;
      let next = -1;
      if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
      else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next >= 0) { e.preventDefault(); select(next, true); }
    });
  });
  panels.forEach((p, i) => { if (p) p.tabIndex = 0; if (p && i !== 0) p.hidden = true; });
  tabsRoot.classList.add("is-ready");
}

/* ---------- VIN ruler: highlight a group and explain it ---------- */
const vinRoot = document.querySelector<HTMLElement>("[data-vin]");
if (vinRoot) {
  const explain = vinRoot.querySelector<HTMLElement>("[data-vin-explain]");
  const defaultText = explain?.textContent ?? "";
  const buttons = Array.from(vinRoot.querySelectorAll<HTMLButtonElement>(".vin__group"));
  let pinned: string | null = null;
  const show = (group: string | null) => {
    if (group) vinRoot.dataset.active = group; else delete vinRoot.dataset.active;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.group === pinned)));
    const btn = buttons.find((b) => b.dataset.group === group);
    if (explain) explain.textContent = btn?.dataset.text ?? defaultText;
  };
  buttons.forEach((b) => {
    const g = b.dataset.group ?? null;
    b.addEventListener("mouseenter", () => show(g));
    b.addEventListener("mouseleave", () => show(pinned));
    b.addEventListener("focus", () => show(g));
    b.addEventListener("blur", () => show(pinned));
    b.addEventListener("click", () => { pinned = pinned === g ? null : g; show(pinned ?? g); });
  });
  // Build-in: cells appear left to right once (CSS does the stagger; reduced motion shows them at once).
  requestAnimationFrame(() => requestAnimationFrame(() => vinRoot.classList.add("is-built")));
  window.setTimeout(() => vinRoot.classList.add("is-done"), 1200);
}

/* ---------- Header: blue over the first screen, white after it; bottom bar on phones ---------- */
const header = document.querySelector<HTMLElement>("[data-header]");
const hero = document.getElementById("pidbir");
const bar = document.querySelector<HTMLElement>("[data-mbar]");
if (hero && "IntersectionObserver" in window) {
  const headerH = () => header?.offsetHeight ?? 0;
  let io: IntersectionObserver | null = null;
  const watch = () => {
    io?.disconnect();
    io = new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting;
      header?.classList.toggle("is-solid", past);
      bar?.classList.toggle("is-shown", past);
    }, { rootMargin: `-${headerH()}px 0px 0px 0px`, threshold: 0 });
    io.observe(hero);
  };
  watch();
  window.addEventListener("resize", () => watch(), { passive: true });
}
if (bar) root.classList.add("has-mbar");

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const menu = document.querySelector<HTMLElement>("[data-menu]");
const label = document.querySelector<HTMLElement>("[data-menu-label]");
if (toggle && menu) {
  const setOpen = (open: boolean, returnFocus = true) => {
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Закрити меню" : "Відкрити меню";
    menu.classList.toggle("is-open", open);
    header?.classList.toggle("is-menu", open);
    root.classList.toggle("menu-open", open);
    if (open) menu.querySelector<HTMLElement>("a, [tabindex]")?.focus({ preventScroll: true });
    else if (returnFocus) toggle.focus({ preventScroll: true });
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll<HTMLElement>("[data-menu-close]").forEach((a) => a.addEventListener("click", () => setOpen(false, false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) setOpen(false);
  });
  window.matchMedia("(min-width: 1200px)").addEventListener("change", (e) => { if (e.matches) setOpen(false, false); });
}

/* ---------- FutureLink note: keep it inside the screen ---------- */
const placeNote = (link: HTMLElement) => {
  const note = link.querySelector<HTMLElement>(".future-link__note");
  if (!note) return;
  link.classList.remove("future-link--end");
  requestAnimationFrame(() => {
    const r = note.getBoundingClientRect();
    if (r.right > document.documentElement.clientWidth - 8) link.classList.add("future-link--end");
  });
};
document.querySelectorAll<HTMLElement>(".future-link").forEach((link) => {
  const fixed = link.classList.contains("future-link--end");
  if (fixed) return;
  link.addEventListener("pointerenter", () => placeNote(link));
  link.addEventListener("focus", () => placeNote(link));
});

export {};
