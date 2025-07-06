// js/calendar.js
// Calendar rendering functions for Admin Dashboard

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function renderAvailabilityCalendar(vans, currentDate, getVanAvailability, handleCalendarDayClick) {
  const monthYearElement = document.getElementById('calendarMonthYear');
  if (monthYearElement) {
    monthYearElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }

  const vanCalendarsGrid = document.getElementById('vanCalendarsGrid');
  if (!vanCalendarsGrid) return;

  vanCalendarsGrid.innerHTML = '';

  vans.forEach(van => {
    const calendarDiv = createVanCalendar(van, currentDate, getVanAvailability, handleCalendarDayClick);
    vanCalendarsGrid.appendChild(calendarDiv);
  });
}

export function createVanCalendar(van, currentDate, getVanAvailability, handleCalendarDayClick) {
  const calendarDiv = document.createElement('div');
  calendarDiv.className = 'van-calendar';
  calendarDiv.setAttribute('data-van-id', van.id);

  const header = document.createElement('div');
  header.className = 'van-calendar-header';
  const title = document.createElement('div');
  title.className = 'van-calendar-title';
  title.textContent = van.name;
  const type = document.createElement('div');
  type.className = 'van-calendar-type';
  type.textContent = `${van.type.charAt(0).toUpperCase() + van.type.slice(1)} • $${van.pricePerDay}/day`;
  header.appendChild(title);
  header.appendChild(type);

  const mini = createMiniCalendar(van, currentDate, getVanAvailability, handleCalendarDayClick);

  calendarDiv.appendChild(header);
  calendarDiv.appendChild(mini);
  return calendarDiv;
}

export function createMiniCalendar(van, currentDate, getVanAvailability, handleCalendarDayClick) {
  const calendar = document.createElement('div');
  calendar.className = 'mini-calendar';

  ['Mo','Tu','We','Th','Fr','Sa','Su'].forEach(day => {
    const d = document.createElement('div');
    d.className = 'mini-calendar-day header';
    d.textContent = day;
    calendar.appendChild(d);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  let offset = firstDay.getDay();
  offset = offset === 0 ? 6 : offset - 1;

  for (let i=0; i<offset; i++) {
    const empty = document.createElement('div');
    empty.className = 'mini-calendar-day other-month';
    calendar.appendChild(empty);
  }

  const daysInMonth = new Date(year, month+1, 0).getDate();
  for (let day=1; day<=daysInMonth; day++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'mini-calendar-day';
    dayEl.textContent = day;
    const dateStr = currentDate.toISOString().slice(0,7)+'-'+String(day).padStart(2,'0');
    const availability = getVanAvailability(van.id, dateStr);
    dayEl.classList.add(availability);
    dayEl.addEventListener('click', () => handleCalendarDayClick(van, dateStr));
    calendar.appendChild(dayEl);
  }
  return calendar;
}
