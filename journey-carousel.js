(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const SWIPE_THRESHOLD = 42;

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
  const carouselState = new WeakMap();

  function preloadImages(imageSources) {
    imageSources.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }

  function getCarouselState(panelElement) {
    if (!carouselState.has(panelElement)) {
      carouselState.set(panelElement, {
        timerId: null,
        pointerId: null,
        startX: 0,
        startY: 0,
      });
    }

    return carouselState.get(panelElement);
  }

  function clearCarouselTimer(panelElement) {
    const state = getCarouselState(panelElement);

    if (state.timerId) {
      window.clearTimeout(state.timerId);
      state.timerId = null;
    }
  }

  function scheduleNextAdvance(panelElement, delay = CYCLE_DELAY) {
    const state = getCarouselState(panelElement);

    clearCarouselTimer(panelElement);
    state.timerId = window.setTimeout(() => {
      advanceImage(panelElement, 1, { fromUser: false });
    }, delay);
  }

  function updatePagination(panelElement, activeIndex, sourcesLength) {
    const pagination = panelElement.querySelector(".journey-pagination");

    if (!pagination) {
      return;
    }

    pagination.querySelectorAll(".journey-pagination-dot").forEach((dot) => {
      const dotIndex = Number(dot.dataset.index || "0");
      const isActive = dotIndex === activeIndex;

      dot.classList.toggle("is-active", isActive);
      dot.classList.toggle("is-first", dotIndex === 0);
      dot.classList.toggle("is-last", dotIndex === sourcesLength - 1);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function createControls(panelElement) {
    const imageContainer = panelElement.querySelector(".journey-image");

    if (
      !imageContainer ||
      imageContainer.querySelector(".journey-image-controls")
    ) {
      return imageContainer;
    }

    const controls = document.createElement("div");
    controls.className = "journey-image-controls";

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.className =
      "journey-image-control journey-image-control-prev";
    previousButton.setAttribute("aria-label", "Previous image");
    previousButton.textContent = "‹";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "journey-image-control journey-image-control-next";
    nextButton.setAttribute("aria-label", "Next image");
    nextButton.textContent = "›";

    previousButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      advanceImage(panelElement, -1, { fromUser: true });
    });

    nextButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      advanceImage(panelElement, 1, { fromUser: true });
    });

    controls.append(previousButton, nextButton);
    imageContainer.appendChild(controls);

    return imageContainer;
  }

  function createPagination(panelElement, sourcesLength) {
    const imageContainer = panelElement.querySelector(".journey-image");

    if (
      !imageContainer ||
      imageContainer.querySelector(".journey-pagination") ||
      sourcesLength < 2
    ) {
      return;
    }

    const pagination = document.createElement("div");
    pagination.className = "journey-pagination";
    pagination.setAttribute("aria-label", "Image pagination");

    for (let index = 0; index < sourcesLength; index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "journey-pagination-dot";
      dot.dataset.index = String(index);
      dot.setAttribute(
        "aria-label",
        `Go to image ${index + 1} of ${sourcesLength}`,
      );

      dot.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        goToImage(panelElement, index, { fromUser: true });
      });

      pagination.appendChild(dot);
    }

    imageContainer.appendChild(pagination);
  }

  function transitionToSource(panelElement, imageElement, nextSource) {
    if (
      !panelElement ||
      !imageElement ||
      imageElement.getAttribute("src") === nextSource ||
      imageElement.dataset.transitioning === "true"
    ) {
      return false;
    }

    imageElement.dataset.transitioning = "true";
    imageElement.classList.add("journey-image-fading");

    const clearTransitionState = () => {
      imageElement.dataset.transitioning = "false";
      imageElement.classList.remove("journey-image-fading");
    };

    const onLoad = () => {
      clearTransitionState();
    };

    const onError = () => {
      clearTransitionState();
    };

    imageElement.addEventListener("load", onLoad, { once: true });
    imageElement.addEventListener("error", onError, { once: true });

    imageElement.src = nextSource;

    return true;
  }

  function advanceImage(panelElement, direction, options = {}) {
    const imageElement = panelElement.querySelector(".journey-image img");
    const sources = stageImages[panelElement.dataset.stage] || [];

    if (!imageElement || sources.length < 2) {
      return;
    }

    clearCarouselTimer(panelElement);

    const currentIndex = Number(imageElement.dataset.carouselIndex || "0");
    const nextIndex =
      (currentIndex + direction + sources.length) % sources.length;
    const started = transitionToSource(
      panelElement,
      imageElement,
      sources[nextIndex],
    );

    if (started) {
      imageElement.dataset.carouselIndex = String(nextIndex);
      updatePagination(panelElement, nextIndex, sources.length);
      scheduleNextAdvance(panelElement);
      return;
    }

    scheduleNextAdvance(panelElement, options.fromUser ? 350 : CYCLE_DELAY);
  }

  function goToImage(panelElement, targetIndex, options = {}) {
    const imageElement = panelElement.querySelector(".journey-image img");
    const sources = stageImages[panelElement.dataset.stage] || [];

    if (!imageElement || targetIndex < 0 || targetIndex >= sources.length) {
      return;
    }

    clearCarouselTimer(panelElement);

    const started = transitionToSource(
      panelElement,
      imageElement,
      sources[targetIndex],
    );

    if (started) {
      imageElement.dataset.carouselIndex = String(targetIndex);
      updatePagination(panelElement, targetIndex, sources.length);
      scheduleNextAdvance(panelElement);
      return;
    }

    scheduleNextAdvance(panelElement, options.fromUser ? 350 : CYCLE_DELAY);
  }

  function setupCarousel(panelElement) {
    const stage = panelElement.dataset.stage;
    const imageElement = panelElement.querySelector(".journey-image img");
    const sources = stageImages[stage] || [];
    const imageContainer = createControls(panelElement);

    if (!imageElement || sources.length < 2) {
      return;
    }

    preloadImages(sources);
    createPagination(panelElement, sources.length);

    if (!imageElement.dataset.carouselIndex) {
      imageElement.dataset.carouselIndex = "0";
    }

    updatePagination(
      panelElement,
      Number(imageElement.dataset.carouselIndex || "0"),
      sources.length,
    );

    if (imageContainer) {
      imageContainer.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        if (event.target.closest(".journey-image-control")) {
          return;
        }

        const state = getCarouselState(panelElement);
        state.pointerId = event.pointerId;
        state.startX = event.clientX;
        state.startY = event.clientY;

        try {
          imageContainer.setPointerCapture(event.pointerId);
        } catch {
          // Some browsers and synthetic events do not support pointer capture here.
        }
      });

      imageContainer.addEventListener("pointerup", (event) => {
        const state = getCarouselState(panelElement);

        if (state.pointerId !== event.pointerId) {
          return;
        }

        const deltaX = event.clientX - state.startX;
        const deltaY = event.clientY - state.startY;

        state.pointerId = null;

        if (
          Math.abs(deltaX) < SWIPE_THRESHOLD ||
          Math.abs(deltaX) < Math.abs(deltaY)
        ) {
          return;
        }

        advanceImage(panelElement, deltaX < 0 ? 1 : -1, { fromUser: true });
      });

      imageContainer.addEventListener("pointercancel", () => {
        const state = getCarouselState(panelElement);
        state.pointerId = null;
      });
    }

    if (!reduceMotion) {
      scheduleNextAdvance(panelElement);
    }
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
