# Primera Website

Website for **Primera Restoration and Renovation** — restoration and renovation services in Calgary and surrounding areas.

---

## Tech stack

- **HTML** · **CSS** · **JavaScript**
- No build step; static files ready to deploy (e.g. Vercel).

---

## Pages

- **Home** (`index.html`) — Hero, intro, CTA
- **About** (`about.html`) — Who we are, team, services
- **Renovation** (`renovation.html`) — Renovation services
- **Gallery** (`application.html`) — Project gallery, workflow, contact form, testimonials
- **Contact** (`contact.html`) — Contact and quote

---

## Run locally

1. **Clone the repo** (after you create it on GitHub as `primera-website`):
   ```bash
   git clone https://github.com/YOUR_USERNAME/primera-website.git
   cd primera-website
   ```

2. **Serve over HTTP** (required for header/footer partials):
   - **VS Code:** Right‑click `index.html` → “Open with Live Server”
   - **Or:** `npx serve .` then open http://localhost:3000

   Do not open HTML files with `file://` — the includes won’t load.

---

## Deploy (Vercel)

- Framework: **Other**
- Build command: leave empty
- Output directory: leave empty  
- Optional: `vercel.json` rewrites give clean URLs (`/about`, `/gallery`, etc.)

---

## Repo name

This project is intended to be pushed to GitHub as **`primera-website`**. To rename your local folder to match:

```bash
cd ..
mv Website-HealthHup primera-website
cd primera-website
```

Then add your GitHub remote and push (e.g. `git remote add origin https://github.com/YOUR_USERNAME/primera-website.git`).
