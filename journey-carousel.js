(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const stageImages = {
    1: [
      "./photos/j1/482A0917.webp",
      "./photos/j1/standarde-bn2.webp",
      "./photos/j1/standarde.webp",
      "./photos/j1/calitate.webp",
      "./photos/j1/standarde-bn.webp",
    ],
    2: [
      "./photos/j2/evidenta-salamer.webp",
      "./photos/j2/IMG_0986.webp",
      "./photos/j2/IMG_1005.webp",
      "./photos/j2/IMG_1615.webp",
    ],
    3: [
      "./photos/j3/transportare-semicarcase.webp",
      "./photos/j3/depozitare1.webp",
      "./photos/j3/depozitare2.webp",
      "./photos/j3/depozitare3.webp",
    ],
    4: [
      "./photos/j4/cuter-salamer.webp",
      "./photos/j4/transare2-salamer.webp",
      "./photos/j4/transare-bn.webp",
      "./photos/j4/transare-salamer.webp",
      "./photos/j4/IMG_1039.webp",
      "./photos/j4/IMG_1893.webp",
      "./photos/j2/taiere-salamer.webp",
      "./photos/j2/prelucrare-filetti-2.webp",
    ],
    5: [
      "./photos/j5/IMG_0705.webp",
      "./photos/j5/IMG_0722.webp",
      "./photos/j5/afumate-salamer.webp",
      "./photos/j5/condimentare-salamer.webp",
      "./photos/j5/IMG_1338.webp",
      "./photos/j5/IMG_1379.webp",
      "./photos/j5/IMG_1685.webp",
      "./photos/j5/IMG_3244.webp",
      "./photos/j5/IMG_3253.webp",
      "./photos/j5/tocatura-bn.webp",
      "./photos/j5/fung-produs.webp",
    ],
    6: [
      "./photos/j6/IMG_0714.webp",
      "./photos/j6/pregatire-salamer.webp",
      "./photos/j6/termica-filetti.webp",
      "./photos/j6/IMG_1262.webp",
      "./photos/j6/IMG_3264.webp",
    ],
    7: [
      "./photos/j3/inspectie-salamer.webp",
      "./photos/j7/crud-afumat-salamer.webp",
      "./photos/j7/umplere-salamer.webp",
      "./photos/j7/control-calitate.webp",
    ],
    8: [
      "./photos/j8/IMG_0646.webp",
      "./photos/j8/IMG_1613.webp",
      "./photos/j8/produse2-salamer.webp",
      "./photos/j8/salamer-dacia.webp",
      "./photos/j8/ambalare.webp",
    ],
    9: [
      "./photos/j9/igiena-calcat.webp",
      "./photos/j9/igiena-new.webp",
      "./photos/j9/igiena-pers-new.webp",
      "./photos/j9/igiena-pers-new1.webp",
      "./photos/j9/alta-igiena.webp",
    ],
    10: [
      "./photos/j10/livrare-carcase.webp",
      "./photos/j10/livrare-new.webp",
      "./photos/j10/livrare-new2.webp",
      "./photos/j10/livrare-new3.webp",
      "./photos/j10/livrare-new4.webp",
      "./photos/j10/livrare-new-frigidere.webp",
      "./photos/j10/truck-rampa.webp",
      "./photos/j10/livrare-rampa.webp",
      "./photos/j10/parcare-alta.webp",
      "./photos/j10/masini-bn.webp",
    ],
  };

  const CYCLE_DELAY = 6800;
  const FADE_MS = 800;

  function preloadImages(imageSources) {
    imageSources.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }

  function transitionToSource(panelElement, imageElement, nextSource) {
    if (
      !panelElement ||
      !imageElement ||
      imageElement.getAttribute("src") === nextSource ||
      panelElement.querySelector(".journey-image-overlay")
    ) {
      return;
    }

    const imageContainer = imageElement.closest(".journey-image");
    if (!imageContainer) {
      imageElement.src = nextSource;
      return;
    }

    const overlayImage = document.createElement("img");
    overlayImage.className = "journey-image-overlay";
    overlayImage.alt = imageElement.alt;
    overlayImage.src = nextSource;

    const finalizeSwap = () => {
      imageElement.src = nextSource;
      window.setTimeout(() => {
        overlayImage.remove();
      }, FADE_MS + 30);
    };

    overlayImage.addEventListener(
      "load",
      () => {
        imageContainer.appendChild(overlayImage);

        window.requestAnimationFrame(() => {
          overlayImage.classList.add("is-visible");
        });

        window.setTimeout(finalizeSwap, FADE_MS);
      },
      { once: true },
    );

    overlayImage.addEventListener(
      "error",
      () => {
        overlayImage.remove();
      },
      { once: true },
    );

    if (overlayImage.complete && overlayImage.naturalWidth > 0) {
      imageContainer.appendChild(overlayImage);
      window.requestAnimationFrame(() => {
        overlayImage.classList.add("is-visible");
      });
      window.setTimeout(finalizeSwap, FADE_MS);
    }
  }

  function setupCarousel(panelElement) {
    const stage = panelElement.dataset.stage;
    const imageElement = panelElement.querySelector(".journey-image img");
    const sources = stageImages[stage] || [];

    if (!imageElement || sources.length < 2) {
      return;
    }

    imageElement.dataset.carouselIndex = "0";
    preloadImages(sources);

    if (reduceMotion) {
      return;
    }

    window.setInterval(() => {
      const currentIndex = Number(imageElement.dataset.carouselIndex || "0");
      const nextIndex = (currentIndex + 1) % sources.length;

      imageElement.dataset.carouselIndex = String(nextIndex);
      transitionToSource(panelElement, imageElement, sources[nextIndex]);
    }, CYCLE_DELAY);
  }

  function initJourneyCarousels() {
    document.querySelectorAll(".journey-panel-content").forEach(setupCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJourneyCarousels, {
      once: true,
    });
  } else {
    initJourneyCarousels();
  }
})();
