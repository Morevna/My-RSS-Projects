const burgerBtn = document.querySelector('.header__burger');
const menu = document.querySelector('.burger-menu');
const html = document.documentElement;
const links = document.querySelectorAll('.burger-menu__link');

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('active');
  menu.classList.toggle('open');
  html.classList.toggle('no-scroll');
});

links.forEach(link => {
  link.addEventListener('click', () => {
    burgerBtn.classList.remove('active');
    menu.classList.remove('open');
        setTimeout(() => {
      html.classList.remove('no-scroll');
    }, 600);
  });
});
///////////////////////////////////////////////////////////////

const slider = document.querySelector('.portfolio__slider');
const leftZone = document.querySelector('.scroll-zone--left');
const rightZone = document.querySelector('.scroll-zone--right');

window.addEventListener('load', () => {
  centerSlider();
});

function centerSlider() {
  const sliderWrapper = document.querySelector('.portfolio__slider-wrapper');
  const sliderWidth = slider.scrollWidth;
  const wrapperWidth = sliderWrapper.clientWidth;
  const centerScroll = (sliderWidth - wrapperWidth) / 2;
  slider.scrollLeft = centerScroll;
}