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

// window.addEventListener('load', () => {
//   centerSlider();
// });

// function centerSlider() {
//   const sliderWrapper = document.querySelector('.portfolio__slider-wrapper');
//   const sliderWidth = slider.scrollWidth;
//   const wrapperWidth = sliderWrapper.clientWidth;
//   const centerScroll = (sliderWidth - wrapperWidth) / 2;
//   slider.scrollLeft = centerScroll;
// }


// let scrollInterval;

// function startScrolling(direction) {
//   stopScrolling();
//   scrollInterval = setInterval(() => {
//     slider.scrollLeft += direction * 10;
//   }, 16);
// }

// function stopScrolling() {
//   clearInterval(scrollInterval);
// }

// leftZone.addEventListener('mouseenter', () => startScrolling(-1));
// rightZone.addEventListener('mouseenter', () => startScrolling(1));
// leftZone.addEventListener('mouseleave', stopScrolling);
// rightZone.addEventListener('mouseleave', stopScrolling);




///////////////////////////////////////////////////////////////
// По умолчанию открыт первый аккордеон: +4
//      просто в html оставить класс .faq__answer--active

// Вы можете открыть или закрыть аккордеон, щелкнув в любом месте его заголовка: +4
//         это область .faq__question

// Одновременно может быть открыт только один аккордеон (открытие нового закрывает предыдущий): +8
// проверка циклом кажого

// Состояние аккордеона сохраняется после перезагрузки страницы: +8
//    сохранить состояние в localStorage
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');
  const toggle = item.querySelector('.faq__toggle');

  question.addEventListener('click', () => {
    const isOpen = answer.classList.contains('faq__answer--active');
      //если вопрос открыт - закрываю
    if (isOpen) {
      answer.classList.remove('faq__answer--active');
      toggle.textContent = "+";
    } else {
      // если был закрыт, то закрываю сначала все другие
      faqItems.forEach(otherItem => {
        otherItem.querySelector('.faq__answer').classList.remove('faq__answer--active');
        otherItem.querySelector('.faq__toggle').textContent = "+";
      });

      // и потом открываю кликнутый вопрос
      answer.classList.add('faq__answer--active');
      toggle.textContent = "−";
    }
  });
});
//////////////////////////////////////////////////////////////////////////////////
// Модальное окно открывается при нажатии любой кнопки «ЗАБРОНИРОВАТЬ» на карточках в Packages & Pricingразделе: +6
// Часть страницы за пределами модального окна затемнена: +4
// При открытии модального окна вертикальная прокрутка страницы становится неактивной; при закрытии она снова становится активной: +4
// Нажатие за пределами модального окна и на кнопку закрытия закрывает его: +4
// Модальное окно центрировано по обеим осям, размеры модальных элементов и их расположение соответствуют дизайну: +4

const priceBtn = document.querySelectorAll('.pricing-card__btn');
 priceBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    
  })
 })