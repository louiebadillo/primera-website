/**
 * Load shared header and footer from includes/header.html and includes/footer.html
 * into elements with id="header-partial" and id="footer-partial".
 * Uses sync XHR so header/footer are in DOM before other scripts run.
 * Site must be served over HTTP (e.g. local server).
 */
(function () {
    function loadPartialSync(id, url) {
        var el = document.getElementById(id);
        if (!el) return;
        var fullUrl = (url && url[0] === "/") ? url : ("/" + (url || "").replace(/^\.?\//, ""));
        var xhr = new XMLHttpRequest();
        xhr.open('GET', fullUrl, false);
        try {
            xhr.send();
            if (xhr.status === 200) el.innerHTML = xhr.responseText;
        } catch (e) {}
    }

    loadPartialSync('header-partial', '/includes/header.html');
    loadPartialSync('footer-partial', '/includes/footer.html');
})();
