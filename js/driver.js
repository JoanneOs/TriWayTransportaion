document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display the load assignments dynamically
    const loadList = document.getElementById('load-list');
    const loads = [
      { id: 1, name: 'Load 123', date: '2025-03-20', status: 'Pending' },
      { id: 2, name: 'Load 456', date: '2025-03-22', status: 'Delivered' },
    ];
  
    // Loop through loads and create list items
    loads.forEach(load => {
      const listItem = document.createElement('li');
      listItem.textContent = `${load.name} - ${load.date} (${load.status})`;
      loadList.appendChild(listItem);
    });
  
    // Handle status update button
    const updateStatusBtn = document.getElementById('update-status-btn');
    updateStatusBtn.addEventListener('click', () => {
      alert('Status updated successfully!'); // Mock status update
    });
  
    // Initialize FullCalendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth', // Default view
      events: [ // Mock events
        { title: 'Load 123', start: '2025-03-20' },
        { title: 'Load 456', start: '2025-03-22' },
      ],
    });
    calendar.render(); // Render the calendar
  });