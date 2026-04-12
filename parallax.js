(function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    return;
  }

  const EXCLUDED_SRC_PARTS = [
    "logo-companii/",
    "icons/",
    "website-favicon",
    "news_thumbnail",
  ];

  const EXCLUDED_CONTAINERS = [
    ".logo",
    ".member-avatar",
    ".member-grid-logo",
    ".modal-logo",
    ".news-image",
    ".news-modal-banner",
    ".journey-image",
    ".modal-social-links",
    ".hero-image",
    "footer",
    "nav",
  ];

  function isEligibleImage(imageElement) {
    if (!(imageElement instanceof HTMLImageElement)) {
      return false;
    }

    if (imageElement.id === "logo-hero-section") {
      return false;
    }

    if (imageElement.dataset.noParallax !== undefined) {
      return false;
    }

    const src = (imageElement.getAttribute("src") || "").toLowerCase();
    if (EXCLUDED_SRC_PARTS.some((part) => src.includes(part))) {
      return false;
    }

    if (
      EXCLUDED_CONTAINERS.some((selector) => imageElement.closest(selector))
    ) {
      return false;
    }

    return true;
  }

  const parallaxImages = Array.from(document.querySelectorAll("img")).filter(
    isEligibleImage,
  );
  const heroAboutGlow = document.querySelector(".hero-about-glow");
  const heroAboutStage = document.querySelector(".hero-about-stage");

  if (!parallaxImages.length && !heroAboutGlow) {
    return;
  }

  const strength = window.innerWidth < 768 ? 30 : 62;
  let ticking = false;
  const parallaxItems = parallaxImages.map((imageElement) => ({
    imageElement,
    documentCenterY: 0,
  }));

  if (heroAboutGlow) {
    heroAboutGlow.style.willChange = "transform";
  }

  function measureItems() {
    parallaxItems.forEach((item) => {
      const rect = item.imageElement.getBoundingClientRect();
      item.documentCenterY = rect.top + window.scrollY + rect.height / 2;
    });
  }

  parallaxImages.forEach((imageElement) => {
    imageElement.style.willChange = "transform";
    imageElement.style.transformOrigin = "center center";
    imageElement.addEventListener("load", measureItems, { once: true });
  });

  measureItems();

  function updateParallax() {
    const viewportHeight = window.innerHeight;
    const viewportCenterY = window.scrollY + viewportHeight / 2;

    parallaxItems.forEach((item) => {
      const { imageElement, documentCenterY } = item;
      const rect = imageElement.getBoundingClientRect();

      if (rect.bottom < -80 || rect.top > viewportHeight + 80) {
        return;
      }

      const progress = (documentCenterY - viewportCenterY) / viewportHeight;
      const aboutImageBoost = imageElement.closest(".about-image") ? 2.8 : 1;
      const offset = progress * strength * aboutImageBoost * -1;

      const scale = imageElement.closest(".about-image") ? 1.2 : 1;

      if (imageElement.closest(".news-banner-image")) {
        scale = 1.4;
      }

      imageElement.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(${scale})`;
    });

    if (heroAboutGlow && heroAboutStage) {
      const stageRect = heroAboutStage.getBoundingClientRect();
      const isInView = stageRect.bottom > 0 && stageRect.top < viewportHeight;

      if (isInView) {
        const stageProgress =
          (viewportCenterY - (stageRect.top + window.scrollY)) /
          Math.max(stageRect.height, 1);
        const clamped = Math.max(-0.6, Math.min(1.2, stageProgress));
        const glowOffset =
          (clamped - 0.28) * (window.innerWidth < 768 ? 1300 : 600);

        heroAboutGlow.style.transform = `translate3d(0, ${glowOffset.toFixed(2)}px, 0)`;
      }
    }

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => {
    measureItems();
    requestUpdate();
  });

  if (document.readyState === "complete") {
    requestUpdate();
  } else {
    window.addEventListener("load", requestUpdate, { once: true });
  }
})();
