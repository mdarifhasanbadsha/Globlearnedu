/* ===========================
   GLOBLEARN EDUCATION – JS
   =========================== */

// ── LOADER
(function () {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        initCounters();
      }, 400);
    }
    fill.style.width = progress + '%';
  }, 120);
})();

// ── CURSOR
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .city-card, .program-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorFollower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorFollower.classList.remove('hover'); });
});

// ── NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── HERO SLIDESHOW
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
setInterval(() => goToSlide(currentSlide + 1), 5000);
dots.forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));

// ── PARTICLES
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const colors = ['rgba(192,57,43,0.6)', 'rgba(212,160,23,0.4)', 'rgba(255,255,255,0.15)'];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ── SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── COUNT UP ANIMATION
function animateCount(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); return; }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.count);
    animateCount(el, target);
  });
}

// Counter observer for sections
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const numVals = e.target.querySelectorAll('.num-val[data-count], .stat-n[data-count]');
      numVals.forEach(el => {
        if (!el.dataset.counted) {
          el.dataset.counted = 'true';
          animateCount(el, parseInt(el.dataset.count));
        }
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.numbers, .hero-stats').forEach(el => counterObserver.observe(el));

// ── TESTIMONIALS CAROUSEL
const track = document.getElementById('testiTrack');
const testiCards = document.querySelectorAll('.testi-card');
const dotsContainer = document.getElementById('testiDots');
let currentTesti = 0;
let cardWidth = 0;
let visibleCards = 3;

function getVisibleCards() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function buildTestiDots() {
  dotsContainer.innerHTML = '';
  const total = Math.ceil(testiCards.length / visibleCards);
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToTesti(i * visibleCards));
    dotsContainer.appendChild(d);
  }
}

function goToTesti(n) {
  visibleCards = getVisibleCards();
  const maxSlide = testiCards.length - visibleCards;
  currentTesti = Math.max(0, Math.min(n, maxSlide));
  const cardW = testiCards[0].getBoundingClientRect().width + 24;
  track.style.transform = `translateX(-${currentTesti * cardW}px)`;
  document.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === Math.floor(currentTesti / visibleCards));
  });
}

document.getElementById('testiPrev').addEventListener('click', () => goToTesti(currentTesti - visibleCards));
document.getElementById('testiNext').addEventListener('click', () => goToTesti(currentTesti + visibleCards));

window.addEventListener('resize', () => {
  visibleCards = getVisibleCards();
  buildTestiDots();
  goToTesti(0);
});

buildTestiDots();
visibleCards = getVisibleCards();

// Auto advance testimonials
setInterval(() => {
  visibleCards = getVisibleCards();
  const next = currentTesti + visibleCards;
  goToTesti(next >= testiCards.length ? 0 : next);
}, 6000);

// ── CONTACT FORM
window.handleSubmit = function (e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    success.classList.add('show');
    e.target.reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1200);
};

// ── SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── PARALLAX HERO
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
  }
});

// ── CITY CARD RIPPLE
document.querySelectorAll('.city-card').forEach(card => {
  card.addEventListener('click', function (e) {
    const ripple = document.createElement('div');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      background:rgba(192,57,43,0.25);
      width:300px; height:300px;
      left:${e.clientX - rect.left - 150}px;
      top:${e.clientY - rect.top - 150}px;
      transform:scale(0); pointer-events:none;
      animation:ripple 0.6s ease-out forwards;
    `;
    if (!document.getElementById('rippleStyle')) {
      const style = document.createElement('style');
      style.id = 'rippleStyle';
      style.textContent = '@keyframes ripple { to { transform:scale(1); opacity:0; } }';
      document.head.appendChild(style);
    }
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ── GLITCH EFFECT on logo hover
const logoGL = document.querySelector('.logo-gl');
if (logoGL) {
  logoGL.addEventListener('mouseenter', function () {
    this.style.animation = 'glitch 0.3s ease';
    setTimeout(() => this.style.animation = '', 300);
  });
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitch {
      0%,100%{ transform:translateX(0); }
      20%{ transform:translateX(-3px) skewX(2deg); }
      40%{ transform:translateX(3px) skewX(-2deg); }
      60%{ transform:translateX(-2px); }
      80%{ transform:translateX(2px); }
    }
  `;
  document.head.appendChild(style);
}

console.log('%cGLOBLEARN EDUCATION', 'color:#c0392b;font-size:20px;font-weight:bold;font-family:serif');
console.log('%cBuilt with ❤️ for students worldwide', 'color:#d4a017;font-size:12px');
