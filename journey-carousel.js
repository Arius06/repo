(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const stageImages = {
    1: ["./photos/j1/482A0288.webp", "./photos/j1/tehn1.webp"],
    2: ["./photos/j2/482A0288.webp", "./photos/j2/tehn2.webp"],
    3: ["./photos/j3/news_thumbnail2.webp", "./photos/j3/tehn1.webp"],
    4: ["./photos/j4/482A0288.webp", "./photos/j4/news_thumbnail1.webp"],
    5: ["./photos/j5/IMG_0705.webp", "./photos/j5/IMG_0722.webp"],
    6: ["./photos/j6/IMG_0714.webp", "./photos/j6/news_thumbnail1.webp"],
    7: ["./photos/j7/482A0288.webp", "./photos/j7/tehn1.webp"],
    8: ["./photos/j8/IMG_0646.webp", "./photos/j8/tehn2.webp"],
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
