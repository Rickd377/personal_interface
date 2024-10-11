document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('calendar');
    const prevButton = document.getElementById('calendar-prev-button');
    const nextButton = document.getElementById('calendar-next-button');
    const calendarTitle = document.getElementById('calendar-title');
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    prevButton.addEventListener('click', function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextButton.addEventListener('click', function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    function generateCalendar(month, year) {
        const today = new Date();
        const currentDate = today.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarTitle.textContent = `${monthNames[month]} ${year}`;

        let calendarHTML = '';
        calendarHTML += '<div class="calendar-grid">';
        
        // Add days of the week
        daysOfWeek.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isWeekend = (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6;
            const isToday = day === currentDate && month === today.getMonth() && year === today.getFullYear();
            const isPastDay = new Date(year, month, day) < today;
            calendarHTML += `<div class="calendar-day${isWeekend ? ' weekend' : ''}${isToday ? ' today' : ''}${isPastDay ? ' past-day' : ''}" data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}">${day}</div>`;
        }

        calendarHTML += '</div>';

        // Replace the existing calendar grid
        calendarContainer.innerHTML = `
            <div class="calendar-header">
                <button id="calendar-prev-button" class="calendar-nav-button"><i class="fal fa-angle-left"></i></button>
                <h2 id="calendar-title">${calendarTitle.textContent}</h2>
                <button id="calendar-next-button" class="calendar-nav-button"><i class="fal fa-angle-right"></i></button>
            </div>
            ${calendarHTML}
        `;

        // Reattach event listeners
        document.getElementById('calendar-prev-button').addEventListener('click', function() {
            if (currentMonth === 0) {
                currentMonth = 11;
                currentYear--;
            } else {
                currentMonth--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        document.getElementById('calendar-next-button').addEventListener('click', function() {
            if (currentMonth === 11) {
                currentMonth = 0;
                currentYear++;
            } else {
                currentMonth++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }

    generateCalendar(currentMonth, currentYear);
});