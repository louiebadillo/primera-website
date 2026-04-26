(function () {
  var MANIFEST_URL = "assets/gallery/about-carousel-manifest.json";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function createImg(src, alt, opts) {
    var img = document.createElement("img");
    img.src = src;
    img.alt = alt || "Primera project photo";
    img.loading = (opts && opts.loading) || "lazy";
    img.decoding = "async";
    return img;
  }

  function renderMarquee(groupEl, photos) {
    if (!groupEl) return;
    groupEl.innerHTML = "";
    photos.forEach(function (src) {
      // Marquee uses transforms/animation; lazy-loading can fail to trigger.
      groupEl.appendChild(createImg(src, "", { loading: "eager" }));
    });
  }

  function renderGrid(gridEl, photos) {
    if (!gridEl) return;
    gridEl.innerHTML = "";

    photos.forEach(function (src) {
      var fig = document.createElement("figure");
      fig.appendChild(createImg(src));

      // keep the same caption behavior (shown only on wider items)
      var cap = document.createElement("figcaption");
      var h3 = document.createElement("h3");
      h3.textContent = "Project";
      var p = document.createElement("p");
      p.textContent = "View more in our gallery.";
      cap.appendChild(h3);
      cap.appendChild(p);
      fig.appendChild(cap);

      gridEl.appendChild(fig);
    });
  }

  fetch(MANIFEST_URL)
    .then(function (r) {
      if (!r.ok) throw new Error("manifest " + r.status);
      return r.json();
    })
    .then(function (data) {
      var photos = (data && data.photos) || [];
      if (!photos.length) return;

      // Marquee rows (two rows, each needs two groups for seamless loop)
      renderMarquee(qs("[data-about-marquee='row1-a']"), photos);
      renderMarquee(qs("[data-about-marquee='row1-b']"), photos);
      renderMarquee(qs("[data-about-marquee='row2-a']"), photos.slice().reverse());
      renderMarquee(qs("[data-about-marquee='row2-b']"), photos.slice().reverse());

      // Grid gallery
      renderGrid(qs("[data-about-grid]"), photos);
    })
    .catch(function (e) {
      // eslint-disable-next-line no-console
      console.warn("[about-carousel] failed to load manifest", e);
    });
})();

