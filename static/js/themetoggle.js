(function () {
    const storageKey = "theme-storage";
    const script = document.currentScript;
    const configuredTheme = (script && script.dataset.theme) || "toggle";

    function getStoredTheme() {
        try {
            return localStorage.getItem(storageKey);
        } catch (_error) {
            return null;
        }
    }

    function storeTheme(mode) {
        try {
            localStorage.setItem(storageKey, mode);
        } catch (_error) {
            // Theme still applies for the current page when storage is unavailable.
        }
    }

    function getPreferredTheme() {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }

        return "light";
    }

    function normalizeTheme(mode) {
        return mode === "dark" ? "dark" : "light";
    }

    function getSavedTheme() {
        return normalizeTheme(getStoredTheme() || getPreferredTheme());
    }

    function getActiveTheme() {
        if (configuredTheme === "dark" || configuredTheme === "light") {
            return configuredTheme;
        }

        if (configuredTheme === "auto") {
            return getPreferredTheme();
        }

        return getSavedTheme();
    }

    function applyTheme(mode) {
        const activeMode = normalizeTheme(mode);
        const darkCodeStyle = document.getElementById("darkCodeStyle");

        if (darkCodeStyle) {
            darkCodeStyle.disabled = activeMode === "light";
        }

        const sunIcon = document.getElementById("sun-icon");
        const moonIcon = document.getElementById("moon-icon");
        const isDark = activeMode === "dark";

        if (sunIcon && moonIcon) {
            sunIcon.hidden = !isDark;
            moonIcon.hidden = isDark;
        }

        const toggleButton = document.getElementById("dark-mode-toggle");
        if (toggleButton) {
            toggleButton.setAttribute("aria-pressed", activeMode === "dark" ? "true" : "false");
        }

        const htmlElement = document.documentElement;
        htmlElement.classList.toggle("dark", activeMode === "dark");
        htmlElement.classList.toggle("light", activeMode === "light");

        window.dispatchEvent(new CustomEvent("redux:themechange", { detail: { mode: activeMode } }));
    }

    function setTheme(mode) {
        const activeMode = normalizeTheme(mode);
        storeTheme(activeMode);
        applyTheme(activeMode);
    }

    function toggleTheme(event) {
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }

        setTheme(getActiveTheme() === "dark" ? "light" : "dark");
    }

    function updateItemToggleTheme() {
        applyTheme(getActiveTheme());
    }

    function bindThemeToggle() {
        const toggleButton = document.getElementById("dark-mode-toggle");
        if (toggleButton) {
            toggleButton.addEventListener("click", toggleTheme);
        }

        updateItemToggleTheme();
    }

    if (configuredTheme === "auto" && window.matchMedia) {
        const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        if (colorSchemeQuery.addEventListener) {
            colorSchemeQuery.addEventListener("change", updateItemToggleTheme);
        } else if (colorSchemeQuery.addListener) {
            colorSchemeQuery.addListener(updateItemToggleTheme);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindThemeToggle, { once: true });
    } else {
        bindThemeToggle();
    }

    window.setTheme = setTheme;
    window.toggleTheme = toggleTheme;
    window.updateItemToggleTheme = updateItemToggleTheme;
    window.getSavedTheme = getSavedTheme;
})();
