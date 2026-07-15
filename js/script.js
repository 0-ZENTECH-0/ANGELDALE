/* ============================================
   ANGEL DALE PRE-PRIMARY SCHOOL - JAVASCRIPT
   ============================================ */

'use strict';

/* ---------- NAVBAR SCROLL BEHAVIOR ---------- */
const navbar = document.querySelector('.navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

/* ---------- MOBILE HAMBURGER MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ---------- SET ACTIVE NAV LINK ---------- */
(function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ---------- SMOOTH SCROLLING ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- SCROLL REVEAL ANIMATIONS ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

initScrollReveal();

/* ---------- IMAGE LIGHTBOX ---------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const galleryItems = document.querySelectorAll('[data-lightbox]');
  let currentIndex = 0;
  const images = [];

  galleryItems.forEach((item, idx) => {
    const imgSrc = item.querySelector('img')?.src || item.getAttribute('data-src');
    if (imgSrc) images.push(imgSrc);

    item.addEventListener('click', () => {
      currentIndex = idx;
      openLightbox(images[currentIndex]);
    });
  });

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

initLightbox();

/* ---------- CONTACT FORM VALIDATION ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const formSuccess = document.getElementById('form-success');

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    field.classList.remove('error');

    if (field.required && !value) {
      field.classList.add('error');
      isValid = false;
    }

    if (field.type === 'tel' && value) {
      const phoneRegex = /^[+\d\s\-()]{7,15}$/;
      if (!phoneRegex.test(value)) {
        field.classList.add('error');
        isValid = false;
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.classList.add('error');
        isValid = false;
      }
    }

    return isValid;
  }

  // Real-time validation
  form.querySelectorAll('.form-control').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    form.querySelectorAll('.form-control').forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (allValid) {
      // Simulate form submission
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        if (formSuccess) {
          formSuccess.style.display = 'block';
          setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
        }
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1500);
    }
  });
}

initContactForm();

/* ---------- COUNTER ANIMATION ---------- */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1800;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current) + suffix;
        }
      }, 16);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

animateCounters();

/* ---------- GALLERY FILTER (if present) ---------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const items = document.querySelectorAll('[data-category]');

      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          setTimeout(() => { item.style.opacity = '1'; }, 10);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

initGalleryFilter();

/* ---------- HERO TYPING EFFECT (optional) ---------- */
/* Currently disabled to keep it clean. Uncomment to enable.
function initTypeEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const phrases = ['Learning Journey 🌱', 'Adventure 🎨', 'Discovery 🌟'];
  let pIdx = 0, cIdx = 0, isDeleting = false;
  function type() {
    const phrase = phrases[pIdx];
    el.textContent = isDeleting ? phrase.slice(0, cIdx--) : phrase.slice(0, cIdx++);
    let speed = isDeleting ? 60 : 100;
    if (!isDeleting && cIdx > phrase.length) { speed = 1800; isDeleting = true; }
    else if (isDeleting && cIdx < 0) { isDeleting = false; pIdx = (pIdx + 1) % phrases.length; speed = 300; }
    setTimeout(type, speed);
  }
  type();
}
initTypeEffect();
*/

/* ---------- INIT ON DOM READY ---------- */
document.addEventListener('DOMContentLoaded', () => {
  handleNavScroll();
  initScrollReveal();
  initLightbox();
  initContactForm();
  animateCounters();
  initGalleryFilter();
});
