const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav-principal");
const header = document.querySelector("#cabecalho");
const navHoverZone = document.querySelector("#nav-hover-zone");
const heroSection = document.querySelector("#hero");
const form = document.querySelector("#form-fale_conosco");
const formStatus = document.querySelector("#form-status");
const submitButton = document.querySelector("#botao-fale_conosco");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const impactoCarousel = document.querySelector("[data-impacto-carousel]");

let imagens;
let carrossel_fotos;
let container;

let index = 0;
let intervalo;
let navHeaderHovered = false;
let navZoneHovered = false;
const desktopHoverNavMedia = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");

function syncFloatingNav() {
    if (!header || !heroSection) {
        return;
    }

    const hasPassedHero = window.scrollY > heroSection.offsetHeight - header.offsetHeight;
    const canHideNav = desktopHoverNavMedia.matches && hasPassedHero;

    document.body.classList.toggle("hero-past", hasPassedHero);

    document.body.classList.toggle("nav-can-hide", canHideNav);

    if (!canHideNav) {
        document.body.classList.remove("nav-reveal");
        return;
    }

    const menuIsOpen = menuToggle?.getAttribute("aria-expanded") === "true";
    const shouldReveal = navHeaderHovered || navZoneHovered || menuIsOpen || header.matches(":focus-within");
    document.body.classList.toggle("nav-reveal", shouldReveal);
}

/* ===== MENU TOGGLE ===== */

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        nav.classList.toggle("is-open", !isOpen);
        syncFloatingNav();
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
            syncFloatingNav();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("is-open")) {
            menuToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
            menuToggle.focus();
            syncFloatingNav();
        }
    });
}

if (header && navHoverZone) {
    header.addEventListener("mouseenter", () => {
        navHeaderHovered = true;
        syncFloatingNav();
    });

    header.addEventListener("mouseleave", () => {
        navHeaderHovered = false;
        syncFloatingNav();
    });

    navHoverZone.addEventListener("mouseenter", () => {
        navZoneHovered = true;
        syncFloatingNav();
    });

    navHoverZone.addEventListener("mouseleave", () => {
        navZoneHovered = false;
        syncFloatingNav();
    });
}

window.addEventListener("scroll", syncFloatingNav, { passive: true });
window.addEventListener("resize", syncFloatingNav);
desktopHoverNavMedia.addEventListener?.("change", syncFloatingNav);
syncFloatingNav();

/* ===== FAQ ACCORDION ===== */

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

/* ===== IMPACTO CAROUSEL ===== */

if (impactoCarousel) {
    const impactoSlides = Array.from(impactoCarousel.querySelectorAll("[data-impacto-slide]"));
    const impactoDots = Array.from(document.querySelectorAll("[data-impacto-dot]"));
    const prevButton = impactoCarousel.querySelector("[data-impacto-prev]");
    const nextButton = impactoCarousel.querySelector("[data-impacto-next]");
    let activeImpactoIndex = 0;

    const syncImpacto = (nextIndex) => {
        activeImpactoIndex = (nextIndex + impactoSlides.length) % impactoSlides.length;

        impactoSlides.forEach((slide, index) => {
            const isActive = index === activeImpactoIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
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

    syncImpacto(0);
}

/* ===== FORM ===== */

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

/* ===== HERO SLIDER ===== */

const heroSlides = Array.from(document.querySelectorAll("[data-hero-slide]"));
const heroDots = Array.from(document.querySelectorAll("[data-hero-dot]"));
const heroPrev = document.querySelector("[data-hero-prev]");
const heroNext = document.querySelector("[data-hero-next]");
const heroLiveRegion = document.querySelector(".hero-live-region");
const heroSlider = document.querySelector("[data-hero-slider]");
let heroIndex = 0;
let heroTimer = null;
let heroPaused = false;
let heroTouchStartX = 0;
let heroTouchStartY = 0;
let heroTouchActive = false;

function goToHeroSlide(index) {
    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((s, i) => {
        const isActive = i === heroIndex;
        s.classList.toggle("is-active", isActive);
        s.setAttribute("aria-hidden", String(!isActive));

        s.querySelectorAll("a, button").forEach((el) => {
            el.setAttribute("tabindex", isActive ? "0" : "-1");
        });
    });

    heroDots.forEach((d, i) => {
        const isActive = i === heroIndex;
        d.classList.toggle("is-active", isActive);
        d.setAttribute("aria-selected", String(isActive));
    });

    if (heroLiveRegion) {
        heroLiveRegion.textContent = "Slide " + (heroIndex + 1) + " de " + heroSlides.length;
    }
}

function startHeroAuto() {
    stopHeroAuto();
    if (!heroPaused) {
        heroTimer = setInterval(() => goToHeroSlide(heroIndex + 1), 5000);
    }
}

function stopHeroAuto() {
    if (heroTimer) {
        clearInterval(heroTimer);
        heroTimer = null;
    }
}

if (heroSlides.length > 1) {
    heroPrev?.addEventListener("click", () => { goToHeroSlide(heroIndex - 1); startHeroAuto(); });
    heroNext?.addEventListener("click", () => { goToHeroSlide(heroIndex + 1); startHeroAuto(); });

    heroDots.forEach((dot, i) => {
        dot.addEventListener("click", () => { goToHeroSlide(i); startHeroAuto(); });
    });

    if (heroSlider) {
        heroSlider.addEventListener("mouseenter", () => { heroPaused = true; stopHeroAuto(); });
        heroSlider.addEventListener("mouseleave", () => { heroPaused = false; startHeroAuto(); });
        heroSlider.addEventListener("focusin", () => { heroPaused = true; stopHeroAuto(); });
        heroSlider.addEventListener("focusout", () => { heroPaused = false; startHeroAuto(); });
        heroSlider.addEventListener("touchstart", (event) => {
            const firstTouch = event.touches[0];
            if (!firstTouch) {
                return;
            }

            heroTouchStartX = firstTouch.clientX;
            heroTouchStartY = firstTouch.clientY;
            heroTouchActive = true;
            heroPaused = true;
            stopHeroAuto();
        }, { passive: true });

        heroSlider.addEventListener("touchend", (event) => {
            if (!heroTouchActive) {
                return;
            }

            const lastTouch = event.changedTouches[0];
            heroTouchActive = false;
            heroPaused = false;

            if (!lastTouch) {
                startHeroAuto();
                return;
            }

            const deltaX = lastTouch.clientX - heroTouchStartX;
            const deltaY = lastTouch.clientY - heroTouchStartY;
            const swipeThreshold = 45;

            if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                goToHeroSlide(heroIndex + (deltaX < 0 ? 1 : -1));
            }

            startHeroAuto();
        }, { passive: true });

        heroSlider.addEventListener("touchcancel", () => {
            heroTouchActive = false;
            heroPaused = false;
            startHeroAuto();
        }, { passive: true });
    }

    goToHeroSlide(0);
    startHeroAuto();
}

/* ===== BACK TO TOP ===== */

const backToTop = document.querySelector("#back-to-top");
if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ===== Carrosel Detalhes ===== */

function mostrarImagem(i) {

    imagens.forEach(img => img.classList.remove("ativa"));
    carrossel_fotos.forEach(dot => dot.classList.remove("ativo"));

    imagens[i].classList.add("ativa");
    carrossel_fotos[i].classList.add("ativo");

    index = i;
}

function iniciarAutoPlay() {
    intervalo = setInterval(() => {
        let proximo = (index + 1) % imagens.length;
        mostrarImagem(proximo);
    }, 3000);
}

function pararAutoPlay() {
    clearInterval(intervalo);
}

const modal = document.getElementById("modal-redirect");
const btnContinuar = document.getElementById("btn-continuar");

const btnDoar = document.querySelector(".btn-doar");
const btnVoluntario = document.querySelector(".btn-voluntario");

let linkDestino = "#";

function abrirModal(link) {
    if (!modal) return;
    linkDestino = link;
    modal.classList.add("ativo");
}

btnDoar?.addEventListener("click", () => {
    abrirModal("https://exemplo-doacao.com");
});

btnVoluntario?.addEventListener("click", () => {
    abrirModal("https://exemplo-voluntario.com");
});

btnContinuar?.addEventListener("click", () => {
    window.open(linkDestino, "_blank");
    modal.classList.remove("ativo");
});

modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("ativo");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal?.classList.remove("ativo");
    }
});


/* ===== Criação de cards ===== */

const iconesCategorias = {
    Educacao: "fa-solid fa-graduation-cap",
    Solidariedade: "fa-solid fa-hand-holding-heart",
    Cultura: "fa-solid fa-people-group",
    Animais: "fa-solid fa-paw",
    MeioAmbiente: "fa-solid fa-leaf",
    Saude: "fa-solid fa-heart-pulse",
    Esporte: "fa-solid fa-futbol",
};

const lista_ongs = [
    {
        id: 1,
        nome: "Educar para Transformar",
        descricao:"Reforco escolar, acolhimento e atividades de formacao para criancas e adolescentes.",
        descricaoCompleta:"A ONG atua oferecendo reforco escolar, acolhimento social e oficinas educativas para criancas e adolescentes em situacao de vulnerabilidade.",
        categoriaPrincipal: "Educacao",
        categorias: ["Educacao", "Reforco", "Comunidade"],
        local: "Itapetininga",
        instagram: "https://instagram.com/",
        facebook: "https://facebook.com/",
        mapa:"https://www.google.com/maps?q=Itapetininga&output=embed",
        linkVoluntario:"https://exemplo-voluntario.com",
        imagens: [
            {
                src: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f",
                alt: "Criancas em atividade coletiva com educadores."
            },

            {
                src: "img/imagens_exemplo/educacao/criancas_aprendendo.jpg",
                alt: "Criancas estudando com professora."
            },

            {
                src: "img/imagens_exemplo/educacao/criancas_na_sala_de_aula.jpg",
                alt: "Criancas participando de atividade educativa."
            }
        ]
    },
    {
        id: 2,
        nome: "Patinhas do Bem",
        descricao:"Resgate, cuidado e adoção responsável de animais abandonados.",
        descricaoCompleta:"A ONG Patinhas do Bem atua no resgate de cães e gatos em situação de abandono, oferecendo cuidados veterinários, alimentação e campanhas de adoção responsável.",
        categoriaPrincipal: "Animais",
        categorias: ["Animais", "Adoção", "Resgate"],
        local: "Itapetininga",
        instagram: "https://instagram.com/",
        facebook: "https://facebook.com/",
        mapa:"https://www.google.com/maps?q=Itapetininga&output=embed",
        linkVoluntario:"https://exemplo-voluntario.com",
        imagens: [
            {
                src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
                alt: "Cachorro sendo cuidado por voluntários."
            },
            {
                src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1200&auto=format&fit=crop",
                alt: "Gato em abrigo esperando adoção."
            },
            {
                src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
                alt: "Animais resgatados em campanha de adoção."
            }
        ]
    },

    {
        id: 3,
        nome: "Movimento Verde Vivo",
        descricao:"Projetos ambientais, reciclagem e ações de conscientização ecológica.",
        descricaoCompleta:"O Movimento Verde Vivo promove ações de preservação ambiental, plantio de árvores, reciclagem e educação ambiental em comunidades e escolas.",
        categoriaPrincipal: "MeioAmbiente",
        categorias: ["Meio Ambiente", "Sustentabilidade", "Reciclagem"],
        local: "Itapetininga",
        instagram: "https://instagram.com/",
        facebook: "https://facebook.com/",
        mapa:"https://www.google.com/maps?q=Itapetininga&output=embed",
        linkVoluntario:"https://exemplo-voluntario.com",
        imagens: [
            {
                src: "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1200&auto=format&fit=crop",
                alt: "Voluntários plantando árvores."
            },
            {
                src: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1200&auto=format&fit=crop",
                alt: "Ação de limpeza em área verde."
            },
            {
                src: "https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=1200&auto=format&fit=crop",
                alt: "Campanha de conscientização ambiental."
            }
        ]
    }
];
const div_ongs = document.querySelector("#ongs");


if (div_ongs) {
    lista_ongs.forEach((ong) => {
    const card_ong = document.createElement("a");
    card_ong.classList.add("cards");
    card_ong.href = `detalhes.html?id=${ong.id}`;
    const span_ong = document.createElement("span");
    span_ong.classList.add("card-badge");
    const icone = iconesCategorias[ong.categoriaPrincipal] || "fa-solid fa-circle-info";
    span_ong.innerHTML = `<i class="${icone}"></i>${ong.categoriaPrincipal}`;
    const img_ong = document.createElement("img");
    img_ong.src = ong.imagens[0].src;
    img_ong.alt = ong.imagens[0].alt;
    const nome_ong = document.createElement("h3");
    nome_ong.textContent = ong.nome;
    const descricao_ong = document.createElement("p");
    descricao_ong.textContent = ong.descricao;
    const categorias_ong = document.createElement("h4");
    categorias_ong.textContent = ong.categorias.join(" • ");
    card_ong.appendChild(span_ong);
    card_ong.appendChild(img_ong);
    card_ong.appendChild(nome_ong);
    card_ong.appendChild(descricao_ong);
    card_ong.appendChild(categorias_ong);
    div_ongs.appendChild(card_ong);
    });
}

/* ===== PAGINA DETALHES ===== */

const detalheContainer = document.querySelector("#detalhe-ong");

if (detalheContainer) {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const ong = lista_ongs.find(item => item.id === id);
    if (!ong) {
        detalheContainer.innerHTML = `
            <div class="detalhe-card">
                <h2>ONG nao encontrada</h2>
                <a href="index.html">Voltar</a>
            </div>
        `;
    } else {
        document.title = `EntreCausas | ${ong.nome}`;
        document.querySelector("#titulo-ong").textContent = ong.nome;
        document.querySelector(".local").innerHTML = `
            <i class="fa-solid fa-location-dot"></i>
            ${ong.local}
        `;
        document.querySelector(".descricao").textContent = ong.descricaoCompleta || ong.descricao;
        document.querySelector(".btn-instagram").href = ong.instagram;
        document.querySelector(".btn-facebook").href = ong.facebook;
        const iframe = document.querySelector(".mapa iframe");
        iframe.src = ong.mapa;
        const detalheImagem = document.querySelector(".detalhe-imagem");

        detalheImagem.innerHTML = "";

        ong.imagens.forEach((imagem, i) => {
            const img = document.createElement("img");
            img.src = imagem.src;
            img.alt = imagem.alt;
            if (i === 0) {
                img.classList.add("ativa");
            }
            detalheImagem.appendChild(img);
        });

        const dots = document.createElement("div");
        dots.classList.add("carrossel-fotos");
        ong.imagens.forEach((_, i) => {
            const span = document.createElement("span");
            if (i === 0) {
                span.classList.add("ativo");
            }
            dots.appendChild(span);
        });
        detalheImagem.appendChild(dots);
        iniciarCarrosselDetalhes();
    }
}

function iniciarCarrosselDetalhes() {

    imagens = document.querySelectorAll(".detalhe-imagem img");

    carrossel_fotos = document.querySelectorAll(".carrossel-fotos span");

    container = document.querySelector(".detalhe-imagem");
    if (
        imagens.length > 0 &&
        container &&
        carrossel_fotos.length > 0
    ) {
        carrossel_fotos.forEach((fotos, i) => {
            fotos.addEventListener("click", () => {
                pararAutoPlay();
                mostrarImagem(i);
                iniciarAutoPlay();
            });
        });
        container.addEventListener("mouseenter", pararAutoPlay);
        container.addEventListener("mouseleave", iniciarAutoPlay);
        iniciarAutoPlay();
    }
}
