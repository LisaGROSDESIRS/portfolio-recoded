document.addEventListener("DOMContentLoaded", () => {

  // ─── 1. SCROLL SMOOTHER ───────────────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  let smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 2,
    smoothTouch: 0.1,
    effects: true,
  });

  // ─── 2. BANNIÈRE PARALLAX ─────────────────────────────────────────────────
  gsap.to(".bandeaux", {
    yPercent: 25,
    ease: "none",
    scrollTrigger: {
      trigger: ".bandeaux-container",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // ─── 3. ANIMATION D'ENTRÉE (page load) ───────────────────────────────────
  const tl = gsap.timeline();

  tl.from(".bandeaux-container", {
    opacity: 0,
    duration: 1,
    ease: "power2.out",
  })
    .from(
      ".btn-retour",
      {
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4"
    )
    .from(
      ".section h2",
      {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.2"
    )
    .from(
      ".info-text",
      {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.4"
    )
    .from(
      ".info-image",
      {
        opacity: 0,
        x: 40,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.5"
    );

  // ─── 4. APPARITION IMAGES GALERIE AU SCROLL ──────────────────────────────
  gsap.utils.toArray(".gallerie").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: (i % 2) * 0.15,
      ease: "power3.out",
    });
  });

  // ─── 5. APPARITION IMAGES TRIO AU SCROLL ─────────────────────────────────
  gsap.utils.toArray(".trio").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      scale: 0.96,
      duration: 0.7,
      delay: i * 0.12,
      ease: "power3.out",
    });
  });

  // ─── 6. APPARITION IMAGES BANDE ──────────────────────────────────────────
  gsap.utils.toArray(".bande, .bandes").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      scale: 0.98,
      duration: 0.9,
      ease: "power2.out",
    });
  });

  // ─── 7. OUVERTURE SECTION2 (clip-path) ───────────────────────────────────
  const section2Selectors = [
    ".section2",
    ".section2ddf",
    ".section2gallery",
    ".section2OC",
    ".section2mo",
    ".section2do",
  ];

  section2Selectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;

    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      clipPath: "inset(100% 0% 0% 0%)",
      duration: 1,
      ease: "power3.out",
    });

    // Titre section2
    const h2 = el.querySelector("h2");
    if (h2) {
      gsap.from(h2, {
        scrollTrigger: {
          trigger: h2,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        x: -40,
        duration: 0.7,
        ease: "power3.out",
      });
    }

    // Paragraphe section2
    const p = el.querySelector("p");
    if (p) {
      gsap.from(p, {
        scrollTrigger: {
          trigger: p,
          start: "top 92%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      });
    }
  });

  // ─── 8. TITRES H2 HORS SECTION2 ──────────────────────────────────────────
  gsap.utils.toArray(".section h2, .section2 h2").forEach((el) => {
    // Déjà géré pour section2, skip si déjà animé
    if (el.closest(section2Selectors.join(","))) return;
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power3.out",
    });
  });

  // ─── 9. IMAGE FULL (plan, maquettage, etc.) ───────────────────────────────
  gsap.utils.toArray(".full").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power2.out",
    });
  });

  // ─── 10. VITESSE PARALLAX section (data-speed déjà géré par ScrollSmoother)
  // Ajout d'un léger effet sur les sections elles-mêmes
  gsap.utils.toArray("[data-speed]").forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-speed"));
    if (speed !== 1) return; // laisser ScrollSmoother gérer les autres
  });

});
