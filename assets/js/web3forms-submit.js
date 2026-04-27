(function () {
    var ENDPOINT = "https://api.web3forms.com/submit";

    function formToPayload(form) {
        var fd = new FormData(form);
        var data = {};
        fd.forEach(function (value, key) {
            data[key] = value;
        });
        return data;
    }

    function getFeedbackEl(form) {
        return form.querySelector(".web3forms-feedback");
    }

    function setFeedback(feedbackEl, type, text) {
        if (!feedbackEl) return;
        feedbackEl.textContent = text;
        feedbackEl.className =
            "web3forms-feedback" + (type ? " web3forms-feedback--" + type : "");
        if (text) {
            feedbackEl.removeAttribute("hidden");
        } else {
            feedbackEl.setAttribute("hidden", "");
        }
    }

    function setButtonLoading(button, loading) {
        if (!button) return;
        if (loading) {
            if (!button.dataset.w3fHtml) {
                button.dataset.w3fHtml = button.innerHTML;
            }
            button.disabled = true;
            button.setAttribute("aria-busy", "true");
            button.innerHTML = "<span>Sending…</span>";
        } else {
            button.disabled = false;
            button.removeAttribute("aria-busy");
            if (button.dataset.w3fHtml) {
                button.innerHTML = button.dataset.w3fHtml;
                delete button.dataset.w3fHtml;
            }
        }
    }

    function bindForm(form) {
        var feedback = getFeedbackEl(form);
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (typeof form.reportValidity === "function" && !form.reportValidity()) {
                return;
            }

            var action = form.getAttribute("action");
            if (action !== ENDPOINT) return;

            setFeedback(feedback, "", "");
            var submitBtn = form.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);

            var payload = formToPayload(form);

            fetch(ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then(function (res) {
                    return res.text().then(function (text) {
                        var parsed = {};
                        try {
                            parsed = text ? JSON.parse(text) : {};
                        } catch (ignore) {
                            parsed = { message: text };
                        }
                        return { ok: res.ok, status: res.status, body: parsed };
                    });
                })
                .then(function (result) {
                    var json = result.body;
                    var msg =
                        (json && json.message) ||
                        (result.ok
                            ? "Thanks — your message was sent."
                            : "Something went wrong. Please try again.");
                    if (json && json.success) {
                        setFeedback(feedback, "success", msg);
                        form.reset();
                    } else {
                        setFeedback(feedback, "error", msg);
                    }
                })
                .catch(function () {
                    setFeedback(
                        feedback,
                        "error",
                        "Could not send your message. Check your connection and try again."
                    );
                })
                .finally(function () {
                    setButtonLoading(submitBtn, false);
                    if (feedback && feedback.textContent) {
                        feedback.focus();
                        feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                });
        });
    }

    function init() {
        document
            .querySelectorAll('form[action="' + ENDPOINT + '"]')
            .forEach(bindForm);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
