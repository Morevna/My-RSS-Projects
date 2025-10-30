document.addEventListener("DOMContentLoaded", () => {
  const main = document.createElement("main");
  main.classList.add("container", "my-5");
  document.body.appendChild(main);
// контейнер для хранения клавиш
  const keysContainer = document.createElement("div");
  keysContainer.classList.add("keys-container");
  main.appendChild(keysContainer);

  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const whiteKeyWidth = 60;

  // Объект для хранения звуков
  const sounds = {};
  whiteKeys.forEach(note => sounds[note] = new Audio(`sounds/${note}.mp3`));

  // Set для проверки уникальности клавиш
  const usedKeys = new Set(whiteKeys);
  // нажатие на клавишу кнопкой
  let keyPressed = false;
  // Функция создания кнопки-шестирёнки
  function createKeyEditor(keyEl, index) {
    const gearBtn = document.createElement("button");
    const gearIcon = document.createElement("i");
    gearIcon.classList.add("bi", "bi-gear-fill");
    gearBtn.appendChild(gearIcon);
// созд поле ввода
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.maxLength = 1;
    editInput.classList.add("form-control", "edit-input");
//показ поле ввода
    gearBtn.addEventListener("click", () => {
      editInput.style.display = "block";
      editInput.value = keyEl.textContent;
      editInput.focus();
    });
    //замена буквы
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
//очищ и скрываю
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
      playSound(key.textContent);
      key.classList.add("active");
      setTimeout(() => key.classList.remove("active"), 150);
    });

    const { gearBtn, editInput } = createKeyEditor(key, index);

    wrapper.append(key, gearBtn, editInput);
    keysContainer.appendChild(wrapper);
  });

  // Черные клавиши
  // const blackKeyOffsets = [0, 1, 3, 4, 5];
  // blackKeyOffsets.forEach(i => {
  //   const blackKey = document.createElement("div");
  //   blackKey.classList.add("black-key");
  //   blackKey.style.left = i * whiteKeyWidth + (whiteKeyWidth - 40 / 2) + "px";
  //   keysContainer.appendChild(blackKey);
  // });

  // Включение звука
  function playSound(note) {
    const audio = sounds[note];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  }


//обраб клавиатуры
  document.addEventListener("keydown", (e) => {
    if (keyPressed) return; // не повторять звук при удержании
    const pressedKey = e.key.toUpperCase();
    if (!sounds[pressedKey]) return;

    keyPressed = true;
    playSound(pressedKey);

        const keyElement = document.querySelector(`.white-key[data-key='${pressedKey}']`);
    if (keyElement) keyElement.classList.add("active");
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
//кнопка
  const playButton = document.createElement("button");
  playButton.classList.add("btn", "btn-primary");
  playButton.textContent = "Play";
//функция проигрывания
  playButton.addEventListener("click", () => {
    const notes = sequenceInput.value.split("").map(n => n.toUpperCase());
    notes.forEach((note, i) => setTimeout(() => playSound(note), i * 500));
  });

  sequenceContainer.append(sequenceInput, playButton);
});
