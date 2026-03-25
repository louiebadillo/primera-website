# Quick Start Guide - HealthHup Website

## 🚀 Running Locally

### Option 1: Python HTTP Server (Recommended)
```bash
cd Website-HealthHup
python3 -m http.server 3000
```
Then open: http://localhost:3000

**Troubleshooting**: If port 3000 is busy, try: `python3 -m http.server 8080` or any other port.

### Option 2: Node.js HTTP Server
```bash
cd Website-HealthHup
npx http-server -p 3000
```
Then open: http://localhost:3000

### Option 3: VS Code Live Server (Easiest!)
- Install "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"
- Automatically opens in browser and refreshes on file changes

### Option 4: Open Directly (Quick Test)
- Simply double-click `index.html` to open in your default browser
- ⚠️ Note: Some features may not work due to CORS restrictions
- Use a local server (options 1-3) for full functionality

## 📁 Project Structure

```
Website-HealthHup/
├── index.html          # Homepage
├── about.html          # About page
├── contact.html        # Contact page
├── service.html        # Services page
├── application.html    # App download page
├── intro.html          # Intro/landing page
├── style.css           # Main custom styles
│
├── assets/
│   ├── css/            # All CSS files (Bootstrap, plugins, etc.)
│   ├── js/             # All JavaScript files (jQuery, GSAP, etc.)
│   ├── imgs/           # All images organized by section
│   ├── fonts/          # Custom fonts
│   ├── scss/           # SCSS source files (if you want to modify)
│   └── video/          # Video files
```

## 🎨 Key Files to Modify

### Content Changes
- **Text Content**: Edit HTML files directly (index.html, about.html, etc.)
- **Images**: Replace files in `assets/imgs/` folders
- **Colors**: Edit `style.css` or `assets/css/master.css`

### Styling
- `style.css` - Main custom styles
- `assets/css/master.css` - Template master styles
- `assets/scss/` - SCSS source files (compile to CSS if modifying)

### JavaScript
- `assets/js/main.js` - Main JavaScript logic
- `assets/js/scripts.js` - Additional scripts
- `assets/js/ifteam.js` - Team-related scripts

## 🔧 Technologies Used

- **HTML5** - Structure
- **CSS3/SCSS** - Styling
- **Bootstrap 5** - Layout framework
- **jQuery** - DOM manipulation
- **GSAP** - Animations
- **Swiper** - Sliders/carousels
- **Font Awesome** - Icons

## ⚠️ Important Notes

1. **No Build Process**: This is a static site - no compilation needed
2. **No Package Manager**: All dependencies are included in `assets/`
3. **Browser Compatibility**: Works in modern browsers (Chrome, Firefox, Safari, Edge)
4. **CORS**: Some features may not work when opening HTML files directly (use a local server)

## 🎯 Common Modifications

### Change Logo
1. Replace `assets/imgs/logo/favicon.png`
2. Find logo in HTML: `<div class="navigation__logo">` (around line 201 in index.html)
3. Update SVG or image path

### Change Colors
1. Open `style.css`
2. Search for color values (hex codes like `#F3EF6A`)
3. Replace with your brand colors

### Add New Page
1. Copy an existing HTML file (e.g., `about.html`)
2. Rename it (e.g., `newpage.html`)
3. Update navigation links in all HTML files
4. Modify content as needed

### Update Navigation
- Navigation is in each HTML file around line 200-250
- Update links in `<ul class="menu-anim">` sections

## 🚀 Converting to Next.js (Optional)

If you want to convert this to a modern Next.js app:
- Would require creating React components from HTML
- Setting up Next.js project structure
- Converting CSS to Tailwind/modern CSS solution
- Replacing jQuery with React hooks
- Converting GSAP animations to React-compatible versions

This would be a significant refactor but would give you:
- Component reusability
- Better developer experience
- Modern tooling
- SEO optimization
- Better performance
