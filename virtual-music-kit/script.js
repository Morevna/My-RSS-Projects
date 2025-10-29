document.addEventListener("DOMContentLoaded", () => {
  const main = document.createElement("main");
  main.classList.add("container", "my-5");
  document.body.appendChild(main);

  const keysContainer = document.createElement("div");
  keysContainer.classList.add("keys-container");
  main.appendChild(keysContainer);

  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const whiteKeyWidth = 60;

  const whiteKeyElements = [];

  // Создание белых клавиш с кнопкой-шестерёнкой
  whiteKeys.forEach((note, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("white-key-wrapper");

    const key = document.createElement("div");
    key.classList.add("white-key");
    key.textContent = note;

    const gearBtn = document.createElement("button");
    gearBtn.classList.add("gear-btn", "btn", "btn-secondary");
    gearBtn.innerHTML = '<i class="bi bi-gear-fill"></i>';

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.maxLength = 1;
    editInput.classList.add("form-control", "edit-input");

    // Показ поля при клике на шестерёнку
    gearBtn.addEventListener("click", () => {
      editInput.style.display = "block";
      editInput.focus();
    });

    // Сохранение изменения буквы клавиши
    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        key.textContent = editInput.value || note;
        editInput.value = "";
        editInput.style.display = "none";
      }
    });

    wrapper.appendChild(key);
    wrapper.appendChild(gearBtn);
    wrapper.appendChild(editInput);
    keysContainer.appendChild(wrapper);
    whiteKeyElements.push(key);
  });

  // Черные клавиши декор
  const blackKeyOffsets = [0, 1, 3, 4, 5];
  blackKeyOffsets.forEach((whiteIndex) => {
    const blackKey = document.createElement("div");
    blackKey.classList.add("black-key");
    blackKey.style.left = whiteIndex * whiteKeyWidth + (whiteKeyWidth - 40 / 2) + "px";
    keysContainer.appendChild(blackKey);
  });

});
