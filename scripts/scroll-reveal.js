(() => {
  const REVEAL_SELECTOR = ".fade-in-on-scroll";
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function markVisible(element) {
    element.classList.add("is-visible");
  }

  function processNode(node, revealElement) {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    if (node.matches(REVEAL_SELECTOR)) {
      revealElement(node);
    }

    node.querySelectorAll(REVEAL_SELECTOR).forEach(revealElement);
  }

  function setupReveal() {
    const supportsObserver = "IntersectionObserver" in window;

    if (reduceMotion || !supportsObserver) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(markVisible);

      const fallbackMutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((addedNode) => {
            processNode(addedNode, markVisible);
          });
        });
      });

      fallbackMutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return;
    }

    const observedElements = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          markVisible(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    function observeRevealElement(element) {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      if (
        element.classList.contains("is-visible") ||
        observedElements.has(element)
      ) {
        return;
      }

      observedElements.add(element);
      observer.observe(element);
    }

    document.querySelectorAll(REVEAL_SELECTOR).forEach(observeRevealElement);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          processNode(addedNode, observeRevealElement);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupReveal, { once: true });
  } else {
    setupReveal();
  }
})();
