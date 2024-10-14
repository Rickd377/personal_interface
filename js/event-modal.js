document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('calendar'),
          modal = document.getElementById('event-modal'),
          closeModal = document.querySelector('.modal .close'),
          eventForm = document.getElementById('event-form'),
          eventText = document.getElementById('event-text'),
          eventColor = document.getElementById('event-color'),
          agendaBox = document.querySelector('.agenda-list');
    let selectedDate = null,
        events = getEventsFromCookies();

    calendarContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('calendar-day')) {
            selectedDate = event.target.dataset.date;
            modal.style.display = 'block';
        }
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    eventForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const text = eventText.value,
              color = eventColor.value;
        if (!events[selectedDate]) events[selectedDate] = [];
        events[selectedDate].push({ text, color });
        updateCalendar();
        updateAgenda();
        saveEventsToCookies();
        modal.style.display = 'none';
        eventForm.reset();
    });

    function updateCalendar() {
        const days = calendarContainer.querySelectorAll('.calendar-day');
        days.forEach(day => {
            const date = day.dataset.date;
            if (events[date] && events[date].length > 0) {
                const colors = events[date].map(event => event.color),
                      gradient = createGradient(colors);
                day.innerHTML = `${day.textContent} <span class="event-indicator" style="background: ${gradient};"></span>`;
            } else {
                day.innerHTML = day.textContent;
            }
        });
    }

    function createGradient(colors) {
        const step = 100 / colors.length,
              gradientStops = colors.map((color, index) => `${color} ${index * step}%, ${color} ${(index + 1) * step}%`);
        return `linear-gradient(90deg, ${gradientStops.join(', ')})`;
    }

    function updateAgenda() {
        agendaBox.innerHTML = '';
        const today = new Date(),
              sortedDates = Object.keys(events).sort((a, b) => new Date(a) - new Date(b));
        sortedDates.forEach(date => {
            if (new Date(date) >= today) {
                const dateEvents = events[date];
                dateEvents.forEach((event, index) => {
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('agenda-item');
                    const formattedDate = getFormattedDate(date);
                    eventElement.innerHTML = `
                        <span>${formattedDate}: ${event.text}</span>
                        <button class="delete-event" data-date="${date}" data-index="${index}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    `;
                    eventElement.style.borderTop = `4px solid ${event.color}`;
                    agendaBox.appendChild(eventElement);
                });
            }
        });
    }

    agendaBox.addEventListener('click', function(event) {
        if (event.target.closest('.delete-event')) {
            const button = event.target.closest('.delete-event'),
                  date = button.getAttribute('data-date'),
                  index = button.getAttribute('data-index');
            events[date].splice(index, 1);
            if (events[date].length === 0) delete events[date];
            updateCalendar();
            updateAgenda();
            saveEventsToCookies();
        }
    });

    function getFormattedDate(date) {
        const dateObj = new Date(date),
              monthAbbr = dateObj.toLocaleString('default', { month: 'short' }),
              day = dateObj.getDate();
        return `${monthAbbr}. ${day}`;
    }

    function saveEventsToCookies() {
        document.cookie = `events=${encodeURIComponent(JSON.stringify(events))};path=/;max-age=${60 * 60 * 24 * 365}`;
    }

    function getEventsFromCookies() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name.trim() === 'events') return JSON.parse(decodeURIComponent(value));
        }
        return {};
    }

    updateCalendar();
    updateAgenda();
});