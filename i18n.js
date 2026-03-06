(() => {
  const STORAGE_KEY = "siteLanguage";
  const SUPPORTED_LANGUAGES = ["ro", "en", "ru"];
  let currentLanguage = "ro";

  function normalizeLanguage(lang) {
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : "ro";
  }

  function placeholderForLanguage(lang, key = "placeholder") {
    return `[${lang.toUpperCase()}] ${key}`;
  }

  function getDictionary() {
    return window.SITE_TRANSLATIONS || {};
  }

  function getTranslation(key, lang = currentLanguage, fallback = "") {
    const dictionary = getDictionary();
    const langDict = dictionary[lang] || {};
    const roDict = dictionary.ro || {};

    if (key && Object.prototype.hasOwnProperty.call(langDict, key)) {
      return langDict[key];
    }

    if (key && Object.prototype.hasOwnProperty.call(roDict, key)) {
      return lang === "ro" ? roDict[key] : placeholderForLanguage(lang, key);
    }

    return lang === "ro" ? fallback : placeholderForLanguage(lang, key);
  }

  function applyKeyedTranslations() {
    // Only apply to non-form-control elements
    document
      .querySelectorAll(
        "[data-i18n]:not(button[type='submit']), [data-i18n-text]",
      )
      .forEach((element) => {
        const key = element.dataset.i18n || element.dataset.i18nText;
        if (!key) {
          return;
        }

        const fallback =
          element.dataset.i18nFallback || element.textContent || "";
        const translated = getTranslation(key, currentLanguage, fallback);
        if (translated) {
          element.textContent = translated;
        }
      });

    const attributeBindings = [
      {
        selector: "[data-i18n-placeholder]",
        dataKey: "i18nPlaceholder",
        attrName: "placeholder",
      },
      {
        selector: "[data-i18n-title]",
        dataKey: "i18nTitle",
        attrName: "title",
      },
      {
        selector: "[data-i18n-aria-label]",
        dataKey: "i18nAriaLabel",
        attrName: "aria-label",
      },
      {
        selector: "[data-i18n-alt]",
        dataKey: "i18nAlt",
        attrName: "alt",
      },
    ];

    attributeBindings.forEach(({ selector, dataKey, attrName }) => {
      document.querySelectorAll(selector).forEach((element) => {
        const key = element.dataset[dataKey];
        if (!key) {
          return;
        }

        const fallback =
          element.dataset.i18nFallback || element.getAttribute(attrName) || "";
        const translated = getTranslation(key, currentLanguage, fallback);

        if (translated) {
          element.setAttribute(attrName, translated);
        }
      });
    });
  }

  function applyLanguage(lang) {
    currentLanguage = normalizeLanguage(lang);
    document.documentElement.lang = currentLanguage;
    localStorage.setItem(STORAGE_KEY, currentLanguage);

    applyKeyedTranslations();

    document.querySelectorAll("[data-language-switcher]").forEach((button) => {
      const isActive = button.dataset.lang === currentLanguage;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    document.dispatchEvent(
      new CustomEvent("languagechange", {
        detail: { language: currentLanguage },
      }),
    );
  }

  function setupLanguageSwitcher() {
    const switchers = document.querySelectorAll("[data-language-switcher]");
    switchers.forEach((button) => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.lang);
      });
    });
  }

  function initialize() {
    setupLanguageSwitcher();

    const savedLanguage = normalizeLanguage(localStorage.getItem(STORAGE_KEY));
    applyLanguage(savedLanguage);
  }

  window.I18N = {
    t: (key, fallback = "") => getTranslation(key, currentLanguage, fallback),
    getLanguage: () => currentLanguage,
    setLanguage: applyLanguage,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
