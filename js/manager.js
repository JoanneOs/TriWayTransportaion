document.addEventListener('DOMContentLoaded', () => {
    // Sample data for drivers and loads
    const drivers = [
      { name: 'John Doe', status: 'En Route', loads: 3 },
      { name: 'Jane Smith', status: 'Available', loads: 1 },
    ];
  
    const loadBoards = [
      { name: 'Relay/Amazon', url: 'https://relay.amazon.com' },
      { name: 'DatOne', url: 'https://www.dat.com' },
      { name: 'Uber Freight', url: 'https://www.uberfreight.com' },
    ];
  
    // Populate the driver table
    const driverTableBody = document.querySelector('#driver-table tbody');
    drivers.forEach(driver => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${driver.name}</td>
        <td>${driver.status}</td>
        <td>${driver.loads}</td>
      `;
      driverTableBody.appendChild(row);
    });
  
    // Populate the driver select dropdown in the load management form
    const driverSelect = document.getElementById('driver-select');
    drivers.forEach(driver => {
      const option = document.createElement('option');
      option.value = driver.name;
      option.textContent = driver.name;
      driverSelect.appendChild(option);
    });
  
    // Handle form submission for assigning loads
    const assignLoadForm = document.getElementById('assign-load-form');
    assignLoadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const loadName = document.getElementById('load-name').value;
      const driverName = document.getElementById('driver-select').value;
  
      if (loadName && driverName) {
        alert(`Load "${loadName}" assigned to ${driverName}`);
        assignLoadForm.reset(); // Reset form after submission
      } else {
        alert('Please enter a load name and select a driver.');
      }
    });
  
    // Feature: Send Hiring Application via Email
    const hiringForm = document.getElementById('hiring-form');
    if (hiringForm) {
      hiringForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const applicantName = document.getElementById('applicant-name').value;
        const applicantEmail = document.getElementById('applicant-email').value;
        const applicantResume = document.getElementById('applicant-resume').files[0];
  
        if (applicantName && applicantEmail && applicantResume) {
          // Simulate sending an email (for demo purposes)
          console.log(`Sending hiring application to HR:
            Name: ${applicantName}
            Email: ${applicantEmail}
            Resume: ${applicantResume.name}
          `);
          alert('Hiring application submitted successfully!');
          hiringForm.reset(); // Reset form after submission
        } else {
          alert('Please fill out all fields and upload a resume.');
        }
      });
    }
  
    // Feature: Access Load Boards
    const loadBoardsContainer = document.getElementById('load-boards');
    if (loadBoardsContainer) {
      loadBoards.forEach(board => {
        const boardLink = document.createElement('a');
        boardLink.href = board.url;
        boardLink.textContent = board.name;
        boardLink.target = '_blank'; // Open in new tab
        boardLink.classList.add('load-board-link');
        loadBoardsContainer.appendChild(boardLink);
      });
    }
  
    // Feature: Real-Time Updates (Mock)
    setInterval(() => {
      const updates = [
        'New load available on Relay/Amazon.',
        'Driver John Doe has completed Load 123.',
        'Reminder: Check Uber Freight for new loads.',
      ];
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      const updatesElement = document.getElementById('real-time-updates');
      if (updatesElement) {
        updatesElement.textContent = randomUpdate;
      }
    }, 5000); // Update every 5 seconds
  });