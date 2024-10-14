document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('calendar'),
          prevButton = document.getElementById('calendar-prev-button'),
          nextButton = document.getElementById('calendar-next-button'),
          calendarTitle = document.getElementById('calendar-title');
    let currentMonth = new Date().getMonth(),
        currentYear = new Date().getFullYear();

    const updateCalendar = (direction) => {
        if (direction === 'prev') {
            currentMonth === 0 ? (currentMonth = 11, currentYear--) : currentMonth--;
        } else {
            currentMonth === 11 ? (currentMonth = 0, currentYear++) : currentMonth++;
        }
        generateCalendar(currentMonth, currentYear);
    };

    prevButton.addEventListener('click', () => updateCalendar('prev'));
    nextButton.addEventListener('click', () => updateCalendar('next'));

    function generateCalendar(month, year) {
        const today = new Date(),
              currentDate = today.getDate(),
              monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
              daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              firstDay = new Date(year, month, 1).getDay(),
              daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarTitle.textContent = `${monthNames[month]} ${year}`;

        let calendarHTML = '<div class="calendar-grid">';
        daysOfWeek.forEach(day => calendarHTML += `<div class="calendar-day-header">${day}</div>`);
        for (let i = 0; i < firstDay; i++) calendarHTML += '<div class="calendar-day empty"></div>';
        for (let day = 1; day <= daysInMonth; day++) {
            const isWeekend = (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6,
                  isToday = day === currentDate && month === today.getMonth() && year === today.getFullYear(),
                  isPastDay = new Date(year, month, day) < today;
            calendarHTML += `<div class="calendar-day${isWeekend ? ' weekend' : ''}${isToday ? ' today' : ''}${isPastDay ? ' past-day' : ''}" data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}">${day}</div>`;
        }
        calendarHTML += '</div>';

        calendarContainer.innerHTML = `
            <div class="calendar-header">
                <button id="calendar-prev-button" class="calendar-nav-button"><i class="fal fa-angle-left"></i></button>
                <h2 id="calendar-title">${calendarTitle.textContent}</h2>
                <button id="calendar-next-button" class="calendar-nav-button"><i class="fal fa-angle-right"></i></button>
            </div>
            ${calendarHTML}
        `;

        document.getElementById('calendar-prev-button').addEventListener('click', () => updateCalendar('prev'));
        document.getElementById('calendar-next-button').addEventListener('click', () => updateCalendar('next'));
    }

    generateCalendar(currentMonth, currentYear);
});