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

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.portfolio__slider');
  const leftZone = document.querySelector('.scroll-zone--left');
  const rightZone = document.querySelector('.scroll-zone--right');

  const centerPosition = (slider.scrollWidth - slider.clientWidth) / 2;
  slider.scrollLeft = centerPosition;

  let scrollInterval = null;

  function startScroll(direction) {
    stopScroll();

    scrollInterval = setInterval(() => {
      slider.scrollLeft += direction === 'right' ? 5 : -5;
    }, 16);
  }

  function stopScroll() {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }

  leftZone.addEventListener('mouseenter', () => startScroll('left'));
  leftZone.addEventListener('mouseleave', stopScroll);

  rightZone.addEventListener('mouseenter', () => startScroll('right'));
  rightZone.addEventListener('mouseleave', stopScroll);


  let startX = 0;

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX;
    const deltaX = startX - currentX;

    slider.scrollLeft += deltaX;

    startX = currentX;
  });
});

// По умолчанию ползунок должен быть горизонтально отцентрирован на странице: +4
// На десктопе прокрутка слайдера активируется наведением курсора на левую или правую область: +8
// На десктопе активная область прокрутки ползунка составляет ~30% ширины экрана с каждой стороны: +8
// На рабочем столе оставшаяся область в центре неактивна: +4
// На мобильном устройстве ползунок прокручивается свайпом пальцем:+8
// Конечные положения ползунка выравниваются по содержимому страницы с обеих сторон. Прокрутка заблокирована за пределами этих значений: +8.

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

const savedId = localStorage.getItem('openFaqId');
if (savedId) {
  const savedItem = document.querySelector(`.faq__item[data-id="${savedId}"]`);
  if (savedItem) {
    // Добавляю метку data-open="true"
    savedItem.setAttribute('data-open', 'true');

    // Открываю ответ
    const answer = savedItem.querySelector('.faq__answer');
    answer.classList.add('faq__answer--active');
    const toggle = savedItem.querySelector('.faq__toggle');
    toggle.textContent = "−";
  }
} else if (faqItems.length > 0) {
  // Если сохранённого id нет — открываю первый элемент по умолчанию
  const firstItem = faqItems[0];
  firstItem.setAttribute('data-open', 'true');
  const answer = firstItem.querySelector('.faq__answer');
  answer.classList.add('faq__answer--active');
  const toggle = firstItem.querySelector('.faq__toggle');
  toggle.textContent = "−";
}

// Добавляю этот блок: закрываю все остальные элементы кроме открытого
faqItems.forEach(item => {
  // Получаем id открытого элемента - savedId или первый открытый
  const openId = savedId || (faqItems.length > 0 ? faqItems[0].dataset.id : null);

  // Если id элемента не совпадает с открытым — закрываю его
  if (item.dataset.id !== openId) {
    const answer = item.querySelector('.faq__answer');
    const toggle = item.querySelector('.faq__toggle');
    answer.classList.remove('faq__answer--active');
    toggle.textContent = "+";
    item.removeAttribute('data-open');
  }
});


faqItems.forEach(item => {
  const question = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');
  const toggle = item.querySelector('.faq__toggle');
  const id = item.dataset.id;

  question.addEventListener('click', () => {
    const isOpen = answer.classList.contains('faq__answer--active');
    //если вопрос открыт - закрываю и удаляю data-id="savedId"
    if (isOpen) {
      answer.classList.remove('faq__answer--active');
      toggle.textContent = "+";
      item.removeAttribute('data-open');
      localStorage.removeItem('openFaqId');
    } else {
      // если был закрыт, то закрываю сначала все другие и удаляю data-id="savedId"
      faqItems.forEach(otherItem => {
        otherItem.querySelector('.faq__answer').classList.remove('faq__answer--active');
        otherItem.querySelector('.faq__toggle').textContent = "+";
        otherItem.removeAttribute('data-open');
      });

      // и потом открываю кликнутый вопрос и добавляю data-id="savedId"
      answer.classList.add('faq__answer--active');
      toggle.textContent = "−";
      item.setAttribute('data-open', 'true');
      localStorage.setItem('openFaqId', id);
    }
  });
});


//////////////////////////////////////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', () => {
  const priceBtn = document.querySelectorAll('.pricing-card__btn');
  const modalOverlay = document.querySelector('.pricing__modal-overlay');
  const modalCloseBtn = document.querySelector('.pricing__modal-close-btn');
  priceBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      html.classList.toggle('no-scroll');
      modalOverlay.classList.toggle('open');
    })
  });

  modalCloseBtn.addEventListener('click', () => {
    html.classList.remove('no-scroll');
    modalOverlay.classList.remove('open');
  });

  modalOverlay?.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      html.classList.remove('no-scroll');
      modalOverlay.classList.remove('open');
    }
  });
});