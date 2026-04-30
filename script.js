const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav-principal");
const form = document.querySelector("#form-fale_conosco");
const formStatus = document.querySelector("#form-status");
const submitButton = document.querySelector("#botao-fale_conosco");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const impactoCarousel = document.querySelector("[data-impacto-carousel]");

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

faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) {
            return;
        }

        faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
                otherItem.open = false;
            }
        });
    });
});

if (impactoCarousel) {
    const impactoSlides = Array.from(impactoCarousel.querySelectorAll("[data-impacto-slide]"));
    const impactoDots = Array.from(document.querySelectorAll("[data-impacto-dot]"));
    const prevButton = impactoCarousel.querySelector("[data-impacto-prev]");
    const nextButton = impactoCarousel.querySelector("[data-impacto-next]");
    let activeImpactoIndex = 0;

    const syncImpacto = (nextIndex) => {
        activeImpactoIndex = (nextIndex + impactoSlides.length) % impactoSlides.length;

        impactoSlides.forEach((slide, index) => {
            slide.classList.toggle("is-active", index === activeImpactoIndex);
        });

        impactoDots.forEach((dot, index) => {
            const isActive = index === activeImpactoIndex;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-current", String(isActive));
        });
    };

    prevButton?.addEventListener("click", () => {
        syncImpacto(activeImpactoIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        syncImpacto(activeImpactoIndex + 1);
    });

    impactoDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            syncImpacto(index);
        });
    });
}

if (form && formStatus && submitButton) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        formStatus.className = "form-status";

        if (!form.checkValidity()) {
            form.reportValidity();
            formStatus.textContent = "Revise os campos obrigatórios antes de enviar.";
            formStatus.classList.add("is-error");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        formStatus.textContent = "Preparando sua mensagem...";

        window.setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = "Enviar";
            form.reset();
            formStatus.textContent =
                "Fluxo validado com sucesso. Agora basta conectar este formulário ao canal oficial de envio.";
            formStatus.classList.add("is-success");
        }, 1200);
    });
}
