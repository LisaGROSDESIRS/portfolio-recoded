(() => {

  // ========================================
  // SCROLL GSAP
  // ========================================
  const allPages = Array.from(document.querySelectorAll(".page"));
  const numPages = allPages.length;
  let currentPage = 0;
  let isAnimating = false;

  function initPages() {
    allPages.forEach((page, i) => {
      gsap.set(page, { yPercent: i * 100 });
    });
  }

  function goToPage(index, direction) {
    if (isAnimating) return;
    if (index < 0 || index >= numPages) return;

    isAnimating = true;

    const current = allPages[currentPage];
    const next = allPages[index];
    const dir = direction === "down" ? -100 : 100;

    const tl = gsap.timeline({
      onComplete: () => {
        currentPage = index;
        isAnimating = false;
        updateDots(index);
        animateContent(index);
      },
    });

    tl.to(current, { yPercent: dir, duration: 0.9, ease: "power3.inOut" }, 0);

    const currentBg = current.querySelector(".page-bg");
    if (currentBg) {
      tl.to(currentBg, { yPercent: dir * 0.3, duration: 0.9, ease: "power3.inOut" }, 0);
    }

    tl.fromTo(next, { yPercent: -dir }, { yPercent: 0, duration: 0.9, ease: "power3.inOut" }, 0);

    const nextBg = next.querySelector(".page-bg");
    if (nextBg) {
      tl.fromTo(nextBg, { yPercent: dir * 0.3 }, { yPercent: 0, duration: 0.9, ease: "power3.inOut" }, 0);
    }
  }

  function animateContent(index) {
    const page = allPages[index];
    if (!page) return;

    const title = page.querySelector(".main-title");
    const subtitle = page.querySelector(".subtitle");
    const bottomRight = page.querySelector(".bottom-right");

    if (title) {
      gsap.fromTo(title,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.2 }
      );
    }
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.4 }
      );
    }
    if (bottomRight) {
      gsap.fromTo(bottomRight,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.3 }
      );
    }
  }

  // ========================================
  // POINTS DE NAVIGATION
  // ========================================
  function createDots() {
    const existing = document.getElementById("scroll-dots");
    if (existing) existing.remove();

    const nav = document.createElement("nav");
    nav.id = "scroll-dots";
    nav.setAttribute("aria-label", "Navigation entre les projets");

    allPages.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.setAttribute("aria-label", `Projet ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        const dir = i > currentPage ? "down" : "up";
        goToPage(i, dir);
      });
      nav.appendChild(dot);
    });

    document.body.appendChild(nav);
  }

  function updateDots(index) {
    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function injectDotsCSS() {
    const style = document.createElement("style");
    style.textContent = `
      #scroll-dots {
        position: fixed;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 500;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        border: none;
        cursor: pointer;
        transition: background 0.3s, transform 0.3s;
        padding: 0;
      }
      .dot.active {
        background: white;
        transform: scale(1.4);
      }
      .dot:hover {
        background: rgba(255,255,255,0.8);
      }
    `;
    document.head.appendChild(style);
  }

  // ========================================
  // ÉVÉNEMENTS SCROLL
  // ========================================
  function initScrollEvents() {
    let wheelTimeout;
    window.addEventListener("wheel", (e) => {
      e.preventDefault();
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) goToPage(currentPage + 1, "down");
        else goToPage(currentPage - 1, "up");
      }, 50);
    }, { passive: false });

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") goToPage(currentPage + 1, "down");
      if (e.key === "ArrowUp" || e.key === "PageUp") goToPage(currentPage - 1, "up");
    });

    let startY = 0;
    window.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      const delta = startY - e.changedTouches[0].clientY;
      if (delta > 50) goToPage(currentPage + 1, "down");
      else if (delta < -50) goToPage(currentPage - 1, "up");
    });
  }

  // ========================================
  // MENU BURGER
  // ========================================
  function initBurger() {
    document.querySelectorAll(".burger").forEach((burger) => {
      const menu = document.getElementById(burger.getAttribute("aria-controls"));
      if (!menu) return;

      const toggleMenu = () => {
        const isActive = burger.classList.toggle("active");
        menu.style.display = isActive ? "flex" : "none";
        burger.setAttribute("aria-expanded", isActive);
      };

      burger.addEventListener("click", toggleMenu);
      burger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleMenu();
        }
      });

      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          burger.classList.remove("active");
          menu.style.display = "none";
          burger.setAttribute("aria-expanded", "false");
        });
      });
    });
  }

  // ============================================
// TRANSITION DE PAGE
// ============================================

const transition = document.getElementById("page-transition");

function hideTransition() {
  if (!transition) return;
  gsap.killTweensOf(transition);
  gsap.fromTo(
    transition,
    { yPercent: 0 },
    {
      yPercent: -100,
      duration: 1.1,
      ease: "expo.inOut",
      onComplete: () => {
        transition.style.pointerEvents = "none";
        gsap.set(transition, { yPercent: -100 });
      }
    }
  );
}

function showTransition(callback) {
  if (!transition) return;
  transition.style.pointerEvents = "all";
  gsap.killTweensOf(transition);
  gsap.fromTo(
    transition,
    { yPercent: 100 },
    {
      yPercent: 0,
      duration: 0.75,
      ease: "expo.inOut",
      onComplete: callback
    }
  );
}

// Lancement à l'entrée sur la page
document.addEventListener("DOMContentLoaded", () => {
  hideTransition();
});

// Bouton retour mobile (bfcache)
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    gsap.killTweensOf(transition);
    gsap.set(transition, { yPercent: -100 });
    transition.style.pointerEvents = "none";
    // Force un re-render
    transition.style.display = "none";
    requestAnimationFrame(() => {
      transition.style.display = "";
      hideTransition();
    });
  }
});

// Empêche le bfcache de bloquer
window.addEventListener("unload", () => {});

// Clic sur les liens
document.querySelectorAll(".transition-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto") ||
      href.startsWith("tel") ||
      href.startsWith("http")
    )
      return;

    e.preventDefault();
    showTransition(() => {
      window.location.href = href;
    });
  });
});


  // ========================================
  // OVERLAY D'IMAGES
  // ========================================
  function initOverlay() {
    const images = Array.from(document.querySelectorAll(".DDF-image"));
    const overlay = document.getElementById("overlay");
    const overlayImg = document.getElementById("overlay-img");
    const closeBtn = document.getElementById("overlay-close");
    const prevBtn = document.getElementById("overlay-prev");
    const nextBtn = document.getElementById("overlay-next");
    let currentIndex = -1;

    if (!overlay || !overlayImg) return;

    function openOverlay(index) {
      if (index < 0 || index >= images.length) return;
      overlayImg.src = images[index].src;
      overlayImg.alt = images[index].alt || "Image agrandie";
      currentIndex = index;
      overlay.classList.add("active");
      document.body.classList.add("overlay-open");
      overlay.setAttribute("aria-hidden", "false");
    }

    function closeOverlay() {
      overlay.classList.remove("active");
      document.body.classList.remove("overlay-open");
      overlay.setAttribute("aria-hidden", "true");
      currentIndex = -1;
    }

    function showNext(step = 1) {
      if (images.length === 0) return;
      let next = currentIndex + step;
      if (next < 0) next = images.length - 1;
      if (next >= images.length) next = 0;
      openOverlay(next);
    }

    images.forEach((img, i) => {
      img.addEventListener("click", (e) => {
        e.preventDefault();
        openOverlay(i);
      });
    });

    closeBtn?.addEventListener("click", closeOverlay);
    overlay?.addEventListener("click", (e) => { if (e.target === overlay) closeOverlay(); });
    prevBtn?.addEventListener("click", (e) => { e.stopPropagation(); showNext(-1); });
    nextBtn?.addEventListener("click", (e) => { e.stopPropagation(); showNext(1); });

    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("active")) return;
      if (e.key === "Escape") closeOverlay();
      if (e.key === "ArrowRight") showNext(1);
      if (e.key === "ArrowLeft") showNext(-1);
    });
  }

  // ========================================
  // INITIALISATION
  // ========================================
  window.addEventListener("load", () => {
    initPages();
    createDots();
    injectDotsCSS();
    initScrollEvents();
    initBurger();
    initTransitions(); // ← une seule fois, ici
    initOverlay();
    animateContent(0);
  });

})();
