gsap.registerPlugin(ScrollTrigger, SplitText);

// ========================================
//  TRANSITION LIENS
// ========================================
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
//  BURGER MENU
// ========================================
document.querySelectorAll(".burger").forEach((burger) => {
  const menu = burger.nextElementSibling;
  const toggleMenu = () => {
    const active = burger.classList.toggle("active");
    menu.style.display = active ? "flex" : "none";
  };
  burger.addEventListener("click", toggleMenu);
  burger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      menu.style.display = "none";
    })
  );
});

// ========================================
//  DESKTOP — SCROLL HORIZONTAL
// ========================================
const mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
  const sections = gsap.utils.toArray("#horizontal-scroll .content");
  const dots     = document.querySelectorAll(".dot");
  const hint     = document.querySelector(".scroll-hint");
  const counter  = document.querySelector(".current-slide");
  const boxes    = document.querySelectorAll(".box");
  const total    = sections.length;
  let current    = 0;
  let isAnimating = false;

  // ── Profondeurs parallax par image ──
  const depths = [0.4, 0.7, 1.0, 0.6, 0.9, 0.5];

  // ── Scatter & Reveal ──
  gsap.set(boxes, {
    x: () => gsap.utils.random(-400, 400),
    y: () => gsap.utils.random(-250, 250),
    rotation: () => gsap.utils.random(-30, 30),
    scale: 0,
    autoAlpha: 0,
  });

  gsap.to(boxes, {
    x: 0,
    y: 0,
    scale: 1,
    autoAlpha: 1,
    rotation: () => gsap.utils.random(-6, 6),
    duration: 1.4,
    stagger: 0.1,
    ease: "elastic.out(1, 0.6)",
    delay: 0.8,
  });

  // ── Mise à jour UI ──
  function updateUI() {
    // dots
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));

    // compteur
    if (counter) counter.textContent = String(current + 1).padStart(2, "0");

    // hint : cache après le 1er scroll
    if (current > 0 && hint) hint.classList.add("hidden");
  }

  // ── Navigation ──
  function goTo(index) {
    if (isAnimating || index < 0 || index >= total) return;
    isAnimating = true;
    current = index;

    gsap.to(sections, {
      xPercent: -100 * current,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimating = false;
        animateSlide(current);
        updateUI();
      },
    });

    updateUI();
  }

  // ── Animation texte par slide ──
  function animateSlide(index) {
    const slide = sections[index];
    const chars = slide.querySelectorAll(".chars");
    if (!chars.length) return;

    const split = SplitText.create(chars, { type: "words" });
    gsap.from(split.words, {
      y: 60,
      autoAlpha: 0,
      stagger: 0.07,
      rotation: "random(-20, 20)",
      duration: 0.7,
      ease: "back.out(1.4)",
      onComplete: () => split.revert(),
    });
  }

  // ── Clic sur les dots ──
  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
  });

  // ── Première slide au chargement ──
  document.fonts.ready.then(() => {
    animateSlide(0);
    updateUI();
  });

  // ── Wheel ──
  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      goTo(current + (e.deltaY > 0 ? 1 : -1));
    },
    { passive: false }
  );

  // ── Clavier ──
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft")  goTo(current - 1);
  });

  // ── Touch / Swipe ──
  let touchStartX = 0;
  window.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  window.addEventListener("touchend", (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goTo(current + (delta > 0 ? 1 : -1));
  });

  // ── Parallax souris ──
  document.addEventListener("mousemove", (e) => {
    // Seulement sur slide 1
    if (current !== 0) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 à 1
    const dy = (e.clientY - cy) / cy; // -1 à 1

    boxes.forEach((box, i) => {
      const d = depths[i] || 0.5;
      gsap.to(box, {
        x: dx * 80 * d,
        y: dy * 50 * d,
        rotateX: -dy * 8 * d,
        rotateY:  dx * 8 * d,
        duration: 1.2,
        ease: "power3.out",
      });
    });
  });
});

// ========================================
//  MOBILE — scroll vertical classique
// ========================================
mm.add("(max-width: 768px)", () => {
  const container = document.querySelector("#horizontal-scroll");
  container.style.display = "block";
});
