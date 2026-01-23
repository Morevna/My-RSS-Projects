const HALF_DIVISOR = 2;

export class DragAndDrop {
  private sourceBlock: HTMLElement;
  private resultBlock: HTMLElement;
  private onChange: () => void;

  constructor(
    sourceBlock: HTMLElement,
    resultBlock: HTMLElement,
    onChange: () => void,
  ) {
    this.sourceBlock = sourceBlock;
    this.resultBlock = resultBlock;
    this.onChange = onChange;
  }

  public makeDraggable(card: HTMLElement): void {
    // Desktop
    card.draggable = true;

    card.addEventListener('dragstart', () => {
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      this.sourceBlock.classList.remove('drag-over');
      this.resultBlock.classList.remove('drag-over');
      this.onChange();
    });

    [this.sourceBlock, this.resultBlock].forEach((zone) => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');

        const draggingCard = document.querySelector('.dragging') as HTMLElement;
        if (!draggingCard) return;

        // Вставляем карточку
        const afterElement = this.getDragAfterElement(zone, e.clientX);
        if (afterElement == null) {
          zone.appendChild(draggingCard);
        } else {
          zone.insertBefore(draggingCard, afterElement);
        }
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        this.onChange();
      });
    });

    // Mobile
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    card.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      card.style.position = 'absolute';
      card.style.zIndex = '1000';
      isDragging = true;
    });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      card.style.left = `${touch.clientX - offsetX}px`;
      card.style.top = `${touch.clientY - offsetY}px`;
    });

    card.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;

      const cardRect = card.getBoundingClientRect();
      const resultRect = this.resultBlock.getBoundingClientRect();

      if (
        cardRect.top + cardRect.height / HALF_DIVISOR > resultRect.top &&
        cardRect.top + cardRect.height / HALF_DIVISOR < resultRect.bottom &&
        cardRect.left + cardRect.width / HALF_DIVISOR > resultRect.left &&
        cardRect.left + cardRect.width / HALF_DIVISOR < resultRect.right
      ) {
        this.resultBlock.appendChild(card);
      } else {
        this.sourceBlock.appendChild(card);
      }

      card.style.position = '';
      card.style.left = '';
      card.style.top = '';
      card.style.zIndex = '';

      this.onChange();
    });
  }

  // для вставки в нужное место (desktop)
  private getDragAfterElement(
    container: HTMLElement,
    x: number,
  ): Element | null {
    const draggableElements = [
      ...container.querySelectorAll('.word-card:not(.dragging)'),
    ];

    return draggableElements.reduce(
      (closest: { offset: number; element: Element | null }, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / HALF_DIVISOR;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null },
    ).element;
  }
}
