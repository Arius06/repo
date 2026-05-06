(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const stageImages = {
    1: [
      "./photos/j1/482A0917.webp",
      "./photos/j1/igiena-salamer.webp",
      "./photos/j1/tehn1.webp",
    ],
    2: [
      "./photos/j2/evidenta-salamer.webp",
      "./photos/j2/tehn2.webp",
      "./photos/j2/IMG_0986.webp",
      "./photos/j2/IMG_1005.webp",
      "./photos/j2/IMG_1615.webp",
    ],
    3: ["./photos/j3/transportare-semicarcase.webp"],
    4: [
      "./photos/j4/cuter-salamer.webp",
      "./photos/j4/transare2-salamer.webp",
      "./photos/j4/transare-salamer.webp",
      "./photos/j4/IMG_1039.webp",
      "./photos/j4/IMG_1893.webp",
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
    ],
    6: [
      "./photos/j6/IMG_0714.webp",
      "./photos/j6/pregatire-salamer.webp",
      "./photos/j6/IMG_1262.webp",
      "./photos/j6/IMG_3264.webp",
    ],
    7: [
      "./photos/j7/crud-afumat-salamer.webp",
      "./photos/j7/umplere-salamer.webp",
    ],
    8: ["./photos/j8/IMG_0646.webp", "./photos/j8/IMG_1613.webp"],
    9: ["./photos/j9/tehn1.webp", "./photos/j9/tehn2.webp"],
    10: ["./photos/j10/tehn1.webp", "./photos/j10/tehn2.webp"],
  };

  const CYCLE_DELAY = 4800;
  const FADE_MS = 700;

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
