document.addEventListener('DOMContentLoaded', () => {
    // Populate the driver table with dynamic content
    const driverTableBody = document.querySelector('#driver-table tbody');
    const drivers = [
      { name: 'John Doe', status: 'En Route', loads: 3 },
      { name: 'Jane Smith', status: 'Available', loads: 1 },
    ];
  
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
        // Reset form
        assignLoadForm.reset();
      } else {
        alert('Please enter a load name and select a driver.');
      }
    });
  });
  