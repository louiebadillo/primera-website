# Adding Clients & Facilities Sections – Potential Issues

When adding **Clients** and **Facilities** sections to the about page (or elsewhere), watch for these patterns from our previous fixes:

---

## 1. **Client section** (using `client__area-8` / `client__*` from master.css)

| Issue | Details | Fix |
|-------|---------|-----|
| **Broken background image** | `client__area-8` uses `url("../imgs/essential-img/bg-axtra.png")` – this file does **not** exist in this project | Override in `style.css`: use your own image (e.g. `assets/imgs/about/1/bg-team.jpg`) or a solid color |
| **Dark theme** | Default client area is dark (black background, white text) | Add your own modifier class if you want a different look |
| **Structure** | Expects `.section_wrapper`, `.react_border`, `.client__section`, `.client__logo` | Copy the HTML structure from the template or adapt to your content |

---

## 2. **Facilities section** (no template exists)

| Issue | Details | Fix |
|-------|---------|-----|
| **New section** | No `facility__*` classes in master.css | Use existing patterns: `service__area-2`, `feature__area-2`, or `team__area` structure |
| **Animations** | Reuse `animation__service-2`, `animation__feature2`, or `fade_bottom` | Add the same wrapper/child classes so GSAP animations run (e.g. `animation__feature2` + `feature__item`) |
| **Background** | No default styling | Add a modifier class (e.g. `facilities__area--gray`) and style in `style.css` |

---

## 3. **General pitfalls (from past fixes)**

| Pitfall | What happened | Prevention |
|---------|---------------|------------|
| **Hidden items** | `master.css` hides `.portfolio__item` with `rotateX(90deg)`, `opacity: 0`, `position: fixed` | If reusing portfolio-like markup, add overrides in `style.css` or avoid those classes |
| **GSAP null targets** | Animations target missing elements | `gsap.config({ nullTargetWarn: false })` is set; animations on `.fade_left`, `.fade_bottom`, etc. are safe when elements don’t exist |
| **Modal errors** | `addEventListener` on null modal triggers | Modal code has null checks; avoid `modal-trigger` unless you add the modal markup |
| **Background images** | Content hidden under overlay | Use `position: relative`, `z-index: 1` on content; `::before` overlay with `z-index: 0` |

---

## 4. **Suggested structure for new sections**

- Use patterns that already work: **team section** (feature__area-2 + feature__list + feature__item) or **goal section** (service__area-2 + service__list-2).
- Add a modifier class (e.g. `--gray`, `--bg`) for custom backgrounds.
- For animations, use `animation__feature2` + `feature__item` or `fade_bottom` on items.
- Define styles in `style.css` so you can tweak without editing `master.css`.
