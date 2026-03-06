/* ===================================================
   COCO Development Group — Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     SCROLL PROGRESS BAR
  -------------------------------------------------- */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });

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
     PARALLAX SCROLL EFFECT
  -------------------------------------------------- */
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.hero-content');
    parallaxElements.forEach(el => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });

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

  /* --------------------------------------------------
     CURSOR TRAIL EFFECT (subtle)
  -------------------------------------------------- */
  const cursorTrail = [];
  const trailLength = 5;

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);

    cursorTrail.push(trail);

    if (cursorTrail.length > trailLength) {
      const oldTrail = cursorTrail.shift();
      if (oldTrail && oldTrail.parentNode) {
        oldTrail.parentNode.removeChild(oldTrail);
      }
    }

    setTimeout(() => {
      if (trail && trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    }, 500);
  });

  /* --------------------------------------------------
     INVEST CAROUSEL (prev / next arrows)
  -------------------------------------------------- */
  const investTrack = document.querySelector('.invest-track');
  const prevBtn     = document.querySelector('.invest-arrow--prev');
  const nextBtn     = document.querySelector('.invest-arrow--next');

  if (investTrack && prevBtn && nextBtn) {
    let currentIndex = 0;

    function getVisibleCount() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function getTotalCards() {
      return investTrack.querySelectorAll('.invest-card').length;
    }

    function updateCarousel() {
      const visible = getVisibleCount();
      const total   = getTotalCards();
      const maxIndex = Math.max(0, total - visible);
      currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

      const cardWidth = investTrack.querySelector('.invest-card').offsetWidth;
      const gap = 24;
      const offset = currentIndex * (cardWidth + gap);
      investTrack.style.transform = `translateX(-${offset}px)`;

      prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
      nextBtn.style.opacity = currentIndex >= maxIndex ? '0.35' : '1';
    }

    prevBtn.addEventListener('click', () => { currentIndex--; updateCarousel(); });
    nextBtn.addEventListener('click', () => { currentIndex++; updateCarousel(); });
    window.addEventListener('resize', () => { currentIndex = 0; updateCarousel(); });
    updateCarousel();
  }

  /* --------------------------------------------------
     HOVER TILT EFFECT for cards
  -------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.property-card, .team-card, .why-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 3;
      const rotateY = ((centerX - x) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
