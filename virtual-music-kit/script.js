document.addEventListener("DOMContentLoaded", () => { 
  const main = document.createElement("main");
  main.classList.add("container", "my-5");
  document.body.appendChild(main);

  // сообщение о блокировке нот
  const lockMessage = document.createElement("div");
  lockMessage.id = "lock-message";
  lockMessage.textContent = "Interaction with the piano is blocked during playback";
  main.appendChild(lockMessage);

    // флаг блокировки нот и шестерёнок
  let notesLocked = false;

  // контейнер для хранения клавиш
  const keysContainer = document.createElement("div");
  keysContainer.classList.add("keys-container");
  main.appendChild(keysContainer);

  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];

  // Объект для хранения звуков
  const sounds = {};
  whiteKeys.forEach(note => sounds[note] = new Audio(`sounds/${note}.mp3`));

  // Set для проверки уникальности клавиш
  const usedKeys = new Set(whiteKeys);
  let keyPressed = false;

  // Функция создания кнопки-шестирёнки
  function createKeyEditor(keyEl, index) {
    const gearBtn = document.createElement("button");
    gearBtn.classList.add("gear-btn");
    const gearIcon = document.createElement("i");
    gearIcon.classList.add("bi", "bi-gear-fill");
    gearBtn.appendChild(gearIcon);

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.maxLength = 1;
    editInput.classList.add("form-control", "edit-input");

    gearBtn.addEventListener("click", () => {
      if (notesLocked) return;
      editInput.style.display = "block";
      editInput.value = keyEl.textContent;
      editInput.focus();
    });

    editInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const newKey = editInput.value.toUpperCase();
      const oldKey = keyEl.textContent;

      if (!/^[A-Z]$/.test(newKey)) alert("Only English letters!");
      else if (newKey !== oldKey && usedKeys.has(newKey)) alert("This key is already taken!");
      else {
        usedKeys.delete(oldKey);
        usedKeys.add(newKey);
        keyEl.textContent = newKey;
        keyEl.setAttribute("data-key", newKey);

        if (!sounds[newKey]) sounds[newKey] = new Audio(`sounds/${newKey}.mp3`);
      }
      editInput.value = "";
      editInput.style.display = "none";
    });

    return { gearBtn, editInput };
  }

  // Создание белых клавиш
  whiteKeys.forEach((note, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("white-key-wrapper");

    const key = document.createElement("div");
    key.classList.add("white-key");
    key.textContent = note;
    key.setAttribute("data-key", note);

    key.addEventListener("click", () => {
      if (notesLocked) return;
      playSound(key.textContent);
    });

    const { gearBtn, editInput } = createKeyEditor(key, index);

    wrapper.append(key, gearBtn, editInput);
    keysContainer.appendChild(wrapper);
  });

  // Включение звука
  function playSound(note) {
    const audio = sounds[note];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  }
// подсветка
function highlightKey(note) {
  const keyEl = document.querySelector(`.white-key[data-key='${note}']`);
  if (!keyEl) return;
  keyEl.classList.add("active");
  setTimeout(() => keyEl.classList.remove("active"), 300);
}
  // Обработчики клавиатуры
  document.addEventListener("keydown", (e) => {
    if (keyPressed) return;
    const pressedKey = e.key.toUpperCase();
    if (!sounds[pressedKey]) return;
    if (notesLocked) return;

    keyPressed = true;
    playSound(pressedKey);
    highlightKey(pressedKey); 
  });

  document.addEventListener("keyup", (e) => {
    const releasedKey = e.key.toUpperCase();
    const keyElement = document.querySelector(`.white-key[data-key='${releasedKey}']`);
    if (keyElement) keyElement.classList.remove("active");
    keyPressed = false;
  });

  // Поле для последовательности и кнопка Play
  const sequenceContainer = document.createElement("div");
  sequenceContainer.classList.add("d-flex", "align-items-center", "gap-2", "mt-4");
  main.appendChild(sequenceContainer);

  const sequenceInput = document.createElement("input");
  sequenceInput.type = "text";
  sequenceInput.classList.add("form-control");
  sequenceInput.placeholder = "Type your sequence (C E G B...)";
  sequenceInput.maxLength = 14; 

  const playButton = document.createElement("button");
  playButton.classList.add("btn", "btn-primary");
  playButton.textContent = "Play";

  playButton.addEventListener("click", () => {
    const notes = sequenceInput.value.split("").map(n => n.toUpperCase());
    if (notes.length === 0) return;

    notesLocked = true;
    lockMessage.classList.add("active");

    document.querySelectorAll(".white-key, .gear-btn").forEach(el => {
    el.classList.add("disabled");
  });

    notes.forEach((note, i) => setTimeout(() => {
      playSound(note);
      highlightKey(note);

      if (i === notes.length - 1) {
        notesLocked = false;
        lockMessage.classList.remove("active");

        document.querySelectorAll(".white-key, .gear-btn").forEach(el => {
        el.classList.remove("disabled");
      });

      }
    }, i * 500));
  });

  sequenceContainer.append(sequenceInput, playButton);
});

