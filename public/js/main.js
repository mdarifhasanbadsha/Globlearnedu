(function() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
    fill.style.width = progress + '%';
  }, 120);
})();

const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
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

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

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

const track = document.getElementById('testiTrack');
const testiCards = document.querySelectorAll('.testi-card');
const dotsContainer = document.getElementById('testiDots');
let currentTesti = 0;
let visibleCards = 3;

function getVisibleCards() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function buildTestiDots() {
  if (!dotsContainer) return;
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
  const max = Math.max(0, testiCards.length - visibleCards);
  currentTesti = Math.max(0, Math.min(n, max));
  const card = testiCards[0];
  if (!card) return;
  const cardW = card.getBoundingClientRect().width + 16;
  track.style.transform = `translateX(-${currentTesti * cardW}px)`;
  document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === Math.floor(currentTesti / visibleCards)));
}

document.getElementById('testiPrev').addEventListener('click', () => goToTesti(currentTesti - visibleCards));
document.getElementById('testiNext').addEventListener('click', () => goToTesti(currentTesti + visibleCards));

function refreshTestimonials() {
  visibleCards = getVisibleCards();
  buildTestiDots();
  goToTesti(0);
}
window.addEventListener('resize', refreshTestimonials);
refreshTestimonials();
setInterval(() => {
  const next = currentTesti + visibleCards;
  goToTesti(next >= testiCards.length ? 0 : next);
}, 6000);

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Request';
    btn.disabled = false;
    success.classList.add('show');
    e.target.reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1200);
}
window.handleSubmit = handleSubmit;

document.querySelectorAll('a, button, .featured-card, .why-card, .scholarship-card, .process-card, .testi-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorFollower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorFollower.classList.remove('hover'); });
});

const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
}, { threshold: 0.18 });
revealEls.forEach(el => revealObserver.observe(el));

function animateCount(el, target, duration = 1800) {
  let current = 0;
  const step = target / (duration / 16);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(interval);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        if (!el.dataset.counted) {
          el.dataset.counted = 'true';
          animateCount(el, parseInt(el.dataset.count));
        }
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats, .hero').forEach(section => counterObserver.observe(section));

const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mobileMenu.classList.contains('open')) {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });
});
