const carousel = document.querySelector("[data-carousel]");
const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav-principal");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
        });
    });
}

if (carousel) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-dot]"));
    const autoplayMs = Number(carousel.dataset.autoplayMs) || 7000;

    let activeIndex = 0;
    let rafId = 0;
    let cycleStartedAt = performance.now();
    let pauseStartedAt = null;
    const pauseReasons = new Set();

    const syncDots = (progress = 0) => {
        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === activeIndex);
            dot.setAttribute("aria-current", String(index === activeIndex));
            dot.style.setProperty("--dot-progress", index === activeIndex ? `${progress * 100}%` : "0%");
        });
    };

    const setSlide = (nextIndex, now = performance.now()) => {
        slides[activeIndex].classList.remove("is-active");
        activeIndex = (nextIndex + slides.length) % slides.length;
        slides[activeIndex].classList.add("is-active");
        cycleStartedAt = now;
        syncDots(0);
    };

    const setPause = (reason, shouldPause) => {
        const now = performance.now();

        if (shouldPause) {
            if (!pauseReasons.size) {
                pauseStartedAt = now;
            }

            pauseReasons.add(reason);
            return;
        }

        const hadReason = pauseReasons.delete(reason);

        if (hadReason && !pauseReasons.size && pauseStartedAt !== null) {
            cycleStartedAt += now - pauseStartedAt;
            pauseStartedAt = null;
        }
    };

    const tick = (now) => {
        const effectiveNow = pauseReasons.size && pauseStartedAt !== null ? pauseStartedAt : now;
        const progress = Math.min((effectiveNow - cycleStartedAt) / autoplayMs, 1);

        syncDots(progress);

        if (!pauseReasons.size && progress >= 1) {
            setSlide(activeIndex + 1, now);
        }

        rafId = window.requestAnimationFrame(tick);
    };

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => setSlide(index));
    });

    carousel.addEventListener("mouseenter", () => setPause("hover", true));
    carousel.addEventListener("mouseleave", () => setPause("hover", false));
    carousel.addEventListener("focusin", () => setPause("focus", true));
    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            setPause("focus", false);
        }
    });
    carousel.addEventListener("pointerdown", () => setPause("pointer", true));
    carousel.addEventListener("pointerup", () => setPause("pointer", false));
    carousel.addEventListener("pointercancel", () => setPause("pointer", false));

    document.addEventListener("visibilitychange", () => {
        setPause("hidden", document.hidden);
    });

    syncDots(0);

    if (!reduceMotion && slides.length > 1) {
        rafId = window.requestAnimationFrame(tick);
    }

    window.addEventListener("beforeunload", () => {
        if (rafId) {
            window.cancelAnimationFrame(rafId);
        }
    });
}
