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
  // Получаем id открытого элемента (savedId или первый открытый)
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