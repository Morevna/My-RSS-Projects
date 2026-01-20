// src/components/message.ts
const MESSAGE_DURATION = 5000;

const messageElement = document.createElement('div');
messageElement.id = 'message';
messageElement.className = 'message-overlay hidden';
document.body.append(messageElement);

export function showMessage(text: string): void {
  messageElement.textContent = text;
  messageElement.classList.remove('hidden');
  messageElement.classList.add('visible');

  setTimeout(() => {
    messageElement.classList.remove('visible');
    messageElement.classList.add('hidden');
  }, MESSAGE_DURATION);
}
