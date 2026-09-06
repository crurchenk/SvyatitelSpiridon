const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.style.display = open ? 'none' : 'flex';
    nav.style.position = 'absolute';
    nav.style.right = '14px';
    nav.style.top = '72px';
    nav.style.padding = '18px';
    nav.style.flexDirection = 'column';
    nav.style.background = '#fbf8f2';
    nav.style.border = '1px solid #ddd3c5';
    nav.style.borderRadius = '10px';
  });
}

function renderSchedule(schedule) {
  const paper = document.querySelector('#schedule-paper');
  const period = document.querySelector('#schedule-period');
  const list = document.querySelector('#schedule-list');
  const status = document.querySelector('#schedule-status');

  if (!paper || !period || !list || !status) return;

  period.textContent = schedule.period.display;
  list.innerHTML = '';

  schedule.days.forEach(day => {
    const dayElement = document.createElement('article');
    dayElement.className = 'schedule-day';

    const services = day.services.map(service => `
      <div class="schedule-service">
        <span>${service.name}</span>
        ${service.time ? `<time>${service.time}</time>` : ''}
      </div>
    `).join('');

    dayElement.innerHTML = `
      <div class="schedule-date">
        <strong>${day.day}</strong>
        <span>${day.date}</span>
      </div>
      <div class="schedule-services">
        ${services}
      </div>
    `;

    list.appendChild(dayElement);
  });

  const end = new Date(`${schedule.period.to}T23:59:59`);
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((end - now) / msPerDay);

  paper.classList.remove('schedule-warning', 'schedule-expired');

  if (now > end) {
    paper.classList.add('schedule-expired');
    status.innerHTML = '<span class="status-dot">!</span> Неактуально! Требуется обновление';
  } else if (daysLeft <= 1) {
    paper.classList.add('schedule-warning');
    status.innerHTML = '<span class="status-dot">!</span> Период скоро завершится';
  } else {
    status.innerHTML = '<span class="status-dot">✓</span> Актуальное расписание';
  }
}

fetch('schedule.json', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) throw new Error('Не удалось загрузить расписание');
    return response.json();
  })
  .then(renderSchedule)
  .catch(error => {
    console.error(error);
    const list = document.querySelector('#schedule-list');
    const period = document.querySelector('#schedule-period');
    const status = document.querySelector('#schedule-status');
    if (period) period.textContent = 'Расписание временно недоступно';
    if (status) status.textContent = 'Ошибка загрузки';
    if (list) list.innerHTML = '<p class="schedule-error">Не удалось загрузить расписание. Откройте страницу позже.</p>';
  });
