/* ===================================================
   COCO Development Group — Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     NAVBAR — scroll behavior
  -------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* --------------------------------------------------
     MOBILE MENU
  -------------------------------------------------- */
  const hamburger     = document.querySelector('.hamburger');
  const mobileMenu    = document.querySelector('.mobile-menu');
  const mobileClose   = document.querySelector('.mobile-menu-close');
  const mobileLinks   = mobileMenu.querySelectorAll('a');

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* --------------------------------------------------
     HERO — no static bg anymore, YouTube handles it
  -------------------------------------------------- */

  /* --------------------------------------------------
     COUNTER ANIMATION
  -------------------------------------------------- */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* --------------------------------------------------
     INTERSECTION OBSERVER — fade-in & counters
  -------------------------------------------------- */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  // Register all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  // Register all stat counters
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  /* --------------------------------------------------
     STAGGERED ANIMATIONS for grid children
  -------------------------------------------------- */
  const staggerSelectors = [
    { selector: '.why-card',          delay: 110 },
    { selector: '.service-card',      delay: 90  },
    { selector: '.property-card',     delay: 100 },
    { selector: '.team-card',         delay: 85  },
    { selector: '.testimonial-card',  delay: 80  },
    { selector: '.brand-item',        delay: 35  },
    { selector: '.stat-item',         delay: 80  },
  ];

  staggerSelectors.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${i * delay}ms`;
      fadeObserver.observe(el);
    });
  });

  /* --------------------------------------------------
     SMOOTH SCROLL for anchor links
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 78;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------
     BOOKING TYPE SELECTOR (visual only)
  -------------------------------------------------- */
  const bookingTypes = document.querySelectorAll('.booking-type');
  bookingTypes.forEach(btn => {
    btn.addEventListener('click', () => {
      bookingTypes.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* --------------------------------------------------
     ACTIVE NAV LINK on scroll (highlight current section)
  -------------------------------------------------- */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.navbar-menu a[href^="#"]');

  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-link');
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

});
