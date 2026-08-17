const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const counter = document.querySelector('.counter b');
let current = 0;
let touchStartX = 0;
let ignoreClick = false;

function show(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const active = i === current;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, i) => {
    const active = i === current;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-selected', String(active));
  });
  counter.textContent = String(current + 1).padStart(2, '0');
  history.replaceState(null, '', `#slide-${current + 1}`);
}

document.querySelector('.prev').addEventListener('click', () => show(current - 1));
document.querySelector('.next').addEventListener('click', () => show(current + 1));
dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.go) - 1)));
slides.forEach(slide => {
  slide.addEventListener('click', event => {
    if (ignoreClick) {
      ignoreClick = false;
      return;
    }
    if (!event.target.closest('a, button')) show(current + 1);
  });
  slide.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  slide.addEventListener('touchend', event => {
    if (event.target.closest('a, button')) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) >= 50) {
      ignoreClick = true;
      show(current + (distance < 0 ? 1 : -1));
    }
  }, { passive: true });
});
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') show(current - 1);
  if (event.key === 'ArrowRight' || event.key === ' ') {
    event.preventDefault();
    show(current + 1);
  }
});

const hash = Number(location.hash.replace('#slide-', ''));
show(hash >= 1 && hash <= slides.length ? hash - 1 : 0);
