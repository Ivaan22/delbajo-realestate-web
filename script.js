const body = document.body;
const header = document.querySelector('[data-header]');
const nav = document.querySelector('#site-nav');
const menu = document.querySelector('.menu-toggle');
const progress = document.querySelector('.scroll-line span');
const hero = document.querySelector('.hero');
const pointer = document.querySelector('.pointer');

const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  header.classList.toggle('scrolled', window.scrollY > 42);
};

window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menu?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  body.classList.add('has-pointer');
  let pointerX = 0;
  let pointerY = 0;
  let frame = null;

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) {
      frame = requestAnimationFrame(() => {
        pointer.style.left = `${pointerX}px`;
        pointer.style.top = `${pointerY}px`;
        frame = null;
      });
    }
  }, { passive: true });

  hero?.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--mouse-x', ((event.clientX - rect.left) / rect.width * 2 - 1).toFixed(3));
    hero.style.setProperty('--mouse-y', ((event.clientY - rect.top) / rect.height * 2 - 1).toFixed(3));
  }, { passive: true });

  hero?.addEventListener('pointerleave', () => {
    hero.style.setProperty('--mouse-x', '0');
    hero.style.setProperty('--mouse-y', '0');
  });

  document.querySelectorAll('[data-cursor]').forEach((element) => {
    element.addEventListener('pointerenter', () => {
      pointer.classList.add('is-label');
      pointer.querySelector('span').textContent = element.dataset.cursor;
    });
    element.addEventListener('pointerleave', () => pointer.classList.remove('is-label'));
  });
}
