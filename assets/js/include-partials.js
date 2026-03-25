/**
 * Load shared header and footer from includes/header.html and includes/footer.html
 * into elements with id="header-partial" and id="footer-partial".
 * Uses sync XHR so header/footer are in DOM before other scripts run.
 * Site must be served over HTTP (e.g. local server).
 */
(function () {
    function getBasePath() {
        var path = window.location.pathname;
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash <= 0) return '';
        return path.substring(0, lastSlash + 1);
    }

    function loadPartialSync(id, url) {
        var el = document.getElementById(id);
        if (!el) return;
        var base = getBasePath();
        var fullUrl = (base ? base : '') + url;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', fullUrl, false);
        try {
            xhr.send();
            if (xhr.status === 200) el.innerHTML = xhr.responseText;
        } catch (e) {}
    }

    loadPartialSync('header-partial', 'includes/header.html');
    loadPartialSync('footer-partial', 'includes/footer.html');
})();
