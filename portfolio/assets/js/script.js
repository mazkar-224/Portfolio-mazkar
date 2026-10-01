// Mobile menu: opens and closes the nav, and closes it again after a link is tapped.
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');

function setMenu(open) {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
}

toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
