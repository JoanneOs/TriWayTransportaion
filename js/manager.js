document.addEventListener('DOMContentLoaded', () => {
    // Sample data for drivers
    const drivers = [
      { name: 'John Doe', status: 'En Route', loads: 3 },
      { name: 'Jane Smith', status: 'Available', loads: 1 },
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
  
    // Populate the driver select dropdown
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
  
    // Handle hiring application form submission
    const hiringForm = document.getElementById('hiring-form');
    hiringForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const applicantName = document.getElementById('applicant-name').value;
      const applicantEmail = document.getElementById('applicant-email').value;
      const applicantResume = document.getElementById('applicant-resume').files[0];
  
      if (applicantName && applicantEmail && applicantResume) {
        console.log(`Hiring application submitted:
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
  
    // Simulate real-time updates
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