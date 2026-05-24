/* ==========================================================
   Madu Cílios - Interações
   Troque os valores abaixo para usar os links reais da cliente.
   ========================================================== */

const WHATSAPP_URL = "https://wa.me/5599999999999";

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp]");
const internalLinks = document.querySelectorAll('a[href^="#"]');
const revealItems = document.querySelectorAll(".reveal");
const fallbackImages = document.querySelectorAll("img[data-fallback]");

function setWhatsappLinks() {
  whatsappLinks.forEach((link) => {
    link.setAttribute("href", WHATSAPP_URL);
  });
}

function closeMenu() {
  if (!navToggle || !navMenu) return;

  navToggle.classList.remove("is-open");
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

function toggleMenu() {
  if (!navToggle || !navMenu) return;

  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
}

function setupMenu() {
  if (!navToggle) return;

  navToggle.addEventListener("click", toggleMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function setupSmoothScroll() {
  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

function setupHeaderState() {
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupRevealAnimation() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function markImageAsMissing(image) {
  const shell = image.closest(".image-shell");
  if (!shell) return;

  shell.classList.add("is-missing");
  image.setAttribute("aria-hidden", "true");

  const hero = shell.closest(".hero");
  if (hero) hero.classList.add("hero--fallback");
}

function setupImageFallbacks() {
  fallbackImages.forEach((image) => {
    image.addEventListener("error", () => markImageAsMissing(image));

    if (image.complete && image.naturalWidth === 0) {
      markImageAsMissing(image);
    }
  });
}

setWhatsappLinks();
setupMenu();
setupSmoothScroll();
setupHeaderState();
setupRevealAnimation();
setupImageFallbacks();
