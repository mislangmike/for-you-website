let currentDate = new Date();
let events = {};
let selectedDate = null;

// Function to add weeks to a date
function addWeeks(date, weeks) {
    const resultDate = new Date(date); // Create a new date object
    resultDate.setDate(resultDate.getDate() + weeks * 7); // Add weeks in days
    return resultDate; // Return the new date
}

// Render the calendar
function renderCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = '';

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Set the month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    document.getElementById('month-name').textContent = `${monthNames[month]} ${year}`;
    document.getElementById('date-picker').value = currentDate.toISOString().split('T')[0]; // Update date picker

    const todayString = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Create empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarContainer.appendChild(emptyCell);
    }

    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.textContent = day;

        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Highlight the selected date
        if (selectedDate === dateString) {
            dayCell.classList.add('selected');
        }

        // Highlight the current date
        if (dateString === todayString) {
            dayCell.classList.add('current-date');
        }

        dayCell.onclick = () => {
            selectedDate = dateString; // Set the selected date
            renderCalendar(); // Re-render to highlight the selected date
            displayEventsForSelectedDate(); // Display events for the selected date
        };

        calendarContainer.appendChild(dayCell);
    }
}

// Display events for the selected date in a separate box
function displayEventsForSelectedDate() {
    const selectedDateDisplay = document.getElementById('selected-date');
    const eventListContainer = document.getElementById('event-list');
    eventListContainer.innerHTML = ''; // Clear previous events

    if (selectedDate && events[selectedDate]) {
        selectedDateDisplay.textContent = selectedDate; // Show the selected date
        events[selectedDate].forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.textContent = event;
            eventItem.classList.add('event-item');
            eventListContainer.appendChild(eventItem);
        });
    } else {
        selectedDateDisplay.textContent = selectedDate || 'No date selected';
    }
}

// Navigate to the previous month
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// Navigate to the next month
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Navigate to the previous week
function prevWeek() {
    currentDate = addWeeks(currentDate, -1); // Subtract 1 week
    renderCalendar(); // Re-render the calendar
}

// Navigate to the next week
function nextWeek() {
    currentDate = addWeeks(currentDate, 1); // Add 1 week
    renderCalendar(); // Re-render the calendar
}

// Handle adding events
document.getElementById('event-form').onsubmit = function (e) {
    e.preventDefault();
    const eventTitle = document.getElementById('event-title').value;
    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }
    events[selectedDate].push(eventTitle);
    document.getElementById('event-title').value = ''; // Clear input field
    displayEventsForSelectedDate(); // Update the event display
};

// Initialize the calendar
renderCalendar();

// Initialize the calendar on page load
document.addEventListener('DOMContentLoaded', renderCalendar);

// Handle event form submission
const eventForm = document.getElementById('event-form');
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedDate) {
        alert('Please select a date to add an event.');
        return;
    }
    const eventTitle = document.getElementById('event-title').value;

    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }
    events[selectedDate].push(eventTitle);

    document.getElementById('event-title').value = '';
    renderCalendar();
    displayEventsForSelectedDate ();
});

// Open the modal to display events
function openModal(day) {
 const eventModal = document.getElementById("event-modal");
    const modalDate = document.getElementById("modal-date");
    const modalEvents = document.getElementById("modal-events");
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    eventModal.style.display = "block";
    modalDate.textContent = `${getMonthName(currentDate.getMonth())} ${day}, ${currentDate.getFullYear()}`;

    // Display events for the selected date
    if (events[date.toLocaleDateString()]) {
        modalEvents.innerHTML = "";
        events[date.toLocaleDateString()].forEach((event) => {
            const eventElement = document.createElement("p");
            eventElement.textContent = event;
            modalEvents.appendChild(eventElement);
        });
    } else {
        modalEvents.textContent = "No events for this day.";
    }   
}

// Close the modal
function closeModal() {
    const eventModal = document.getElementById("event-modal");
    eventModal.style.display = "none";
}

// Edit an event
function editEvent(dateString, index) {
    const eventTitle = prompt('Edit Event:', events[dateString][index]);
    if (eventTitle) {
        events[dateString][index] = eventTitle;
        renderCalendar();
        displayEventsForSelectedDate();
    }
}
// script.js
function toggleEvents(id) {
    const events = document.getElementById(id);
    events.style.display = events.style.display === 'block' ? 'none' : 'block';
}