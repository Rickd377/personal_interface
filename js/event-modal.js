document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('calendar');
    const modal = document.getElementById('event-modal');
    const closeModal = document.querySelector('.modal .close');
    const eventForm = document.getElementById('event-form');
    const eventText = document.getElementById('event-text');
    const eventColor = document.getElementById('event-color');
    const agendaBox = document.querySelector('.agenda-list');
    let selectedDate = null;
    let events = getEventsFromCookies();

    // Fetch events from API
    async function fetchEvents() {
        try {
            const response = await fetch('https://api.example.com/events'); // Replace with your API endpoint
            const apiEvents = await response.json();
            events = { ...events, ...apiEvents };
            updateCalendar();
            updateAgenda();
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

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
        const text = eventText.value;
        const color = eventColor.value;

        if (!events[selectedDate]) {
            events[selectedDate] = [];
        }
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
                const eventColor = events[date][0].color; // Use the color of the first event for the dot
                day.innerHTML = `${day.textContent} <span class="event-indicator" style="background-color: ${eventColor};"></span>`;
            } else {
                day.innerHTML = day.textContent;
            }
        });
    }

    function updateAgenda() {
        agendaBox.innerHTML = '';
        const sortedDates = Object.keys(events).sort((a, b) => new Date(a) - new Date(b));
        sortedDates.forEach(date => {
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
        });
    }

    agendaBox.addEventListener('click', function(event) {
        if (event.target.closest('.delete-event')) {
            const button = event.target.closest('.delete-event');
            const date = button.getAttribute('data-date');
            const index = button.getAttribute('data-index');
            events[date].splice(index, 1);
            if (events[date].length === 0) {
                delete events[date];
            }
            updateCalendar();
            updateAgenda();
            saveEventsToCookies();
        }
    });

    function getFormattedDate(date) {
        const dateObj = new Date(date);
        const monthAbbr = dateObj.toLocaleString('default', { month: 'short' });
        const day = dateObj.getDate();
        return `${monthAbbr}. ${day}`;
    }

    function saveEventsToCookies() {
        document.cookie = `events=${encodeURIComponent(JSON.stringify(events))};path=/;max-age=${60 * 60 * 24 * 365}`;
    }

    function getEventsFromCookies() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name.trim() === 'events') {
                return JSON.parse(decodeURIComponent(value));
            }
        }
        return {};
    }

    fetchEvents();
    updateCalendar();
    updateAgenda();
});