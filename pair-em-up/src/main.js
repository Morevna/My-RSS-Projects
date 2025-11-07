import './style.css';

console.log("Pair 'em Up initialized!");

const app = document.createElement('div');
app.classList.add('app');

const title = document.createElement('h1');
title.textContent = "Pair 'em Up";
app.appendChild(title);

document.body.appendChild(app);
