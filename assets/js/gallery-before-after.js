(function () {
  function toAbsUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path[0] === "/") return path;
    return "/" + path.replace(/^\.?\//, "");
  }

  var MANIFEST_URL = toAbsUrl("assets/gallery/before-after-manifest.json");

  var lightboxEl = document.getElementById("gallery_lightbox");
  var lightboxCloseEl = document.getElementById("gallery_lightbox_close");
  var lightboxTitleEl = document.getElementById("gallery_lightbox_title");
  var lightboxSwiperEl = document.getElementById("gallery_lightbox_swiper");

  if (typeof Swiper === "undefined" || !lightboxEl || !lightboxSwiperEl) return;

  function normalizeProject(p) {
    if (!p) return null;
    if (Array.isArray(p.photos) && p.photos.length)
      return { mode: "gallery", photos: p.photos, title: p.title, id: p.id };
    if (p.mode === "gallery")
      return { mode: "gallery", photos: p.photos || [], title: p.title, id: p.id };
    if (p.mode === "pair" && p.before && p.after)
      return {
        mode: "pair",
        before: p.before,
        after: p.after,
        title: p.title,
        id: p.id,
      };
    if (p.before && p.after)
      return {
        mode: "pair",
        before: p.before,
        after: p.after,
        title: p.title,
        id: p.id,
      };
    return null;
  }

  function buildSlides(project, wrap) {
    if (!wrap) return;
    wrap.innerHTML = "";

    function addSlide(src, captionText) {
      var slide = document.createElement("div");
      slide.className = "swiper-slide";
      var figure = document.createElement("figure");
      figure.className = "gallery-lightbox__figure";
      var img = document.createElement("img");
      img.src = toAbsUrl(src);
      img.alt = [project.title || project.id || "", captionText].filter(Boolean).join(" — ");
      var fc = document.createElement("figcaption");
      fc.textContent = captionText;
      figure.appendChild(img);
      figure.appendChild(fc);
      slide.appendChild(figure);
      wrap.appendChild(slide);
    }

    if (project.mode === "gallery") {
      var urls = project.photos || [];
      var total = urls.length;
      urls.forEach(function (src, i) {
        addSlide(src, "Photo " + (i + 1) + (total > 1 ? " / " + total : ""));
      });
      return;
    }

    addSlide(project.before, "Before");
    addSlide(project.after, "After");
  }

  var lightboxSwiper = null;

  function destroyLightboxSwiper() {
    if (!lightboxSwiper) return;
    try {
      lightboxSwiper.destroy(true, true);
    } catch (e) {
      /* noop */
    }
    lightboxSwiper = null;
  }

  function openLightbox(project) {
    var normalized = normalizeProject(project);
    if (!normalized) return;
    if (normalized.mode === "pair" && (!normalized.before || !normalized.after)) return;
    if (normalized.mode === "gallery" && !(normalized.photos && normalized.photos.length)) return;

    if (lightboxTitleEl) lightboxTitleEl.textContent = normalized.title || normalized.id || "";

    var wrap = lightboxSwiperEl.querySelector(".swiper-wrapper");
    destroyLightboxSwiper();
    buildSlides(normalized, wrap);

    try {
      lightboxSwiper = new Swiper(lightboxSwiperEl, {
        slidesPerView: 1,
        spaceBetween: 18,
        loop: false,
        threshold: 8,
        resistanceRatio: 0.85,
        navigation: {
          nextEl: lightboxEl.querySelector(".gallery-lightbox-control--next .gallery-lightbox-control-btn"),
          prevEl: lightboxEl.querySelector(".gallery-lightbox-control--prev .gallery-lightbox-control-btn"),
        },
      });
    } catch (err) {
      console.warn("[gallery-before-after] Lightbox Swiper init failed:", err);
    }

    lightboxEl.classList.add("is-open");
    lightboxEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightboxEl.classList.remove("is-open");
    lightboxEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    destroyLightboxSwiper();
    // clear slides for memory
    var wrap = lightboxSwiperEl.querySelector(".swiper-wrapper");
    if (wrap) wrap.innerHTML = "";
  }

  function thumbSrc(p) {
    var n = normalizeProject(p);
    if (!n) return "";
    if (n.mode === "gallery") return toAbsUrl(n.photos[0] || "");
    return toAbsUrl(n.after || "");
  }

  function renderCategoryGrid(gridEl, list) {
    gridEl.innerHTML = "";

    var ul = document.createElement("ul");
    ul.className = "gallery-grid";

    list.forEach(function (p) {
      var norm = normalizeProject(p);
      if (!norm) return;

      var li = document.createElement("li");

      var a = document.createElement("a");
      a.href = "#";
      a.className = "gallery-grid__link";
      a.setAttribute("data-ba-title", p.title || "");
      a.setAttribute("data-ba-id", p.id || "");
      a.setAttribute("data-ba-mode", norm.mode);

      if (norm.mode === "pair") {
        a.setAttribute("data-ba-before", norm.before || "");
        a.setAttribute("data-ba-after", norm.after || "");
      } else {
        a.setAttribute(
          "data-ba-photos",
          encodeURIComponent(JSON.stringify(norm.photos || [])),
        );
      }

      var figure = document.createElement("figure");
      figure.className = "gallery-grid__figure";

      var img = document.createElement("img");
      img.src = thumbSrc(p);
      img.alt = p.title || p.id || "";
      img.loading = "lazy";
      img.className = "gallery-grid__img";
      img.draggable = false;

      var figcaption = document.createElement("figcaption");
      figcaption.className = "gallery-grid__caption";
      figcaption.textContent = p.title || p.id || "";

      figure.appendChild(img);
      figure.appendChild(figcaption);
      a.appendChild(figure);
      li.appendChild(a);
      ul.appendChild(li);
    });

    gridEl.appendChild(ul);
  }

  function groupByCategory(projects) {
    var map = {};
    projects.forEach(function (p) {
      var cat = p.category || "feature-walls";
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    return map;
  }

  fetch(MANIFEST_URL)
    .then(function (r) {
      if (!r.ok) throw new Error("manifest " + r.status);
      return r.json();
    })
    .then(function (data) {
      var projects = data.projects || [];
      var byCat = groupByCategory(projects);

      document.querySelectorAll("[data-gallery-category]").forEach(function (section) {
        var key = section.getAttribute("data-gallery-category");
        var gridEl = section.querySelector(".before-after-category__grid");
        var emptyEl = section.querySelector(".before-after-category__empty");
        var list = byCat[key] || [];

        if (!gridEl) return;

        if (!list.length) {
          gridEl.innerHTML = "";
          if (emptyEl) emptyEl.hidden = false;
        } else {
          if (emptyEl) emptyEl.hidden = true;
          renderCategoryGrid(gridEl, list);
        }
      });
    })
    .catch(function () {
      document.querySelectorAll("[data-gallery-category]").forEach(function (section) {
        var gridEl = section.querySelector(".before-after-category__grid");
        var emptyEl = section.querySelector(".before-after-category__empty");
        if (gridEl) gridEl.innerHTML = "";
        if (emptyEl) {
          emptyEl.hidden = false;
          emptyEl.textContent =
            "Could not load the gallery list. Serve this site over HTTP (not file://) and ensure assets/gallery/before-after-manifest.json exists.";
        }
      });
    });

  function projectFromItem(item) {
    var mode = item.getAttribute("data-ba-mode");
    var title = item.getAttribute("data-ba-title") || "";
    var id = item.getAttribute("data-ba-id") || "";
    if (mode === "gallery") {
      try {
        var photos = JSON.parse(decodeURIComponent(item.getAttribute("data-ba-photos") || ""));
        return { mode: "gallery", title: title, id: id, photos: photos };
      } catch (e) {
        return null;
      }
    }
    return {
      mode: "pair",
      title: title,
      id: id,
      before: item.getAttribute("data-ba-before"),
      after: item.getAttribute("data-ba-after"),
    };
  }

  document.addEventListener("click", function (e) {
    var item = e.target.closest(".gallery__section a[data-ba-mode]");
    if (!item) return;
    e.preventDefault();
    var p = projectFromItem(item);
    if (p) openLightbox(p);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var item = e.target.closest(".gallery__section a[data-ba-mode]");
    if (!item) return;
    e.preventDefault();
    var p = projectFromItem(item);
    if (p) openLightbox(p);
  });

  if (lightboxCloseEl)
    lightboxCloseEl.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });
  lightboxEl.addEventListener("click", function (e) {
    if (e.target === lightboxEl) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightboxEl.classList.contains("is-open")) closeLightbox();
  });
})();
