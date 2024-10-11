document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('calendar');

    function generateCalendar() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const currentDate = today.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        let calendarHTML = `<div class="calendar-header"><h2>${monthNames[currentMonth]} ${currentYear}</h2></div>`;
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
            const isToday = day === currentDate;
            const isPastDay = day < currentDate;
            calendarHTML += `<div class="calendar-day${isWeekend ? ' weekend' : ''}${isToday ? ' today' : ''}${isPastDay ? ' past-day' : ''}" data-date="${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}">${day}</div>`;
        }

        calendarHTML += '</div>';
        calendarContainer.innerHTML = calendarHTML;
    }

    generateCalendar();
});