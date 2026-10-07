/* ============ SITE CONFIG — single place for all links ============ */
    const SITE_CONFIG = {
      youtube:   "https://www.youtube.com/@ManasOnRoads",
      instagram: "",   // add URL to show the icon
      facebook:  "",   // add URL to show the icon
      x:         "",   // add URL to show the icon
      telegram:  "",   // add URL to show the icon
      email:     ""    // contact email — enables the form via the visitor's mail app
    };

    // Apply YouTube links everywhere
    document.querySelectorAll('[data-link="youtube"]').forEach(a => { a.href = SITE_CONFIG.youtube; });

    // Show only socials that have a real URL configured
    document.querySelectorAll('[data-social]').forEach(a => {
      const url = SITE_CONFIG[a.dataset.social];
      if (url) { a.href = url; a.hidden = false; }
      else { a.remove(); }
    });

    /* ============ nav ============ */
    const navbar = document.getElementById("navbar");
    addEventListener("scroll", () => navbar.classList.toggle("scrolled", scrollY > 40), { passive: true });

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("mobile-open");
      menuBtn.textContent = open ? "×" : "☰";
      menuBtn.setAttribute("aria-expanded", open);
    });
    navLinks.querySelectorAll("a").forEach(l => l.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open"); menuBtn.textContent = "☰"; menuBtn.setAttribute("aria-expanded", "false");
    }));

    /* ============ lightbox ============ */
    const lightbox = document.getElementById("lightbox"),
          lbImg = document.getElementById("lightboxImage"),
          lbCap = document.getElementById("lightboxCaption");
    document.querySelectorAll(".gallery-item img").forEach(img => {
      img.addEventListener("click", () => {
        lbImg.src = img.src; lbImg.alt = img.alt;
        lbCap.textContent = img.dataset.caption || img.alt;
        lightbox.classList.add("active"); document.body.style.overflow = "hidden";
      });
    });
    const closeLb = () => { lightbox.classList.remove("active"); document.body.style.overflow = ""; };
    document.getElementById("lightboxClose").addEventListener("click", closeLb);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLb(); });
    addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

    /* ============ contact form ============ */
    const formNote = document.getElementById("formNote");
    document.getElementById("contactForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const name = this.name.value.trim(), email = this.email.value.trim(), msg = this.message.value.trim();
      if (!name || !email || !msg) { formNote.textContent = "Please fill in your name, email and message."; return; }
      if (SITE_CONFIG.email) {
        location.href = "mailto:" + SITE_CONFIG.email +
          "?subject=" + encodeURIComponent("MANASONROADS enquiry from " + name) +
          "&body=" + encodeURIComponent(msg + "\n\n— " + name + " (" + email + ")");
        formNote.textContent = "Opening your mail app to send the message.";
      } else {
        formNote.textContent = "Thanks for reaching out — the contact email isn't connected yet, so please reach out via YouTube for now.";
      }
      this.reset();
    });

    /* ============ restrained reveal on scroll — slow dissolves only ============ */
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));

    /* ============ route line draws as the journey scrolls by ============ */
    const routeWrap = document.querySelector(".route-wrap"),
          routeLine = document.querySelector(".route-line"),
          reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (routeWrap && routeLine && !reduceMotion) {
      const drawRoute = () => {
        const r = routeWrap.getBoundingClientRect(), vh = innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.5)));
        routeLine.style.transform = "scaleY(" + p.toFixed(3) + ")";
      };
      let ticking = false;
      addEventListener("scroll", () => {
        if (!ticking) { ticking = true; requestAnimationFrame(() => { drawRoute(); ticking = false; }); }
      }, { passive: true });
      drawRoute();
    }