document.addEventListener('DOMContentLoaded', () => {
    // Simulate real-time updates
    setInterval(() => {
      const updates = [
        'New load assigned: Houston to Dallas.',
        'Reminder: Delivery window for Load #12345 ends at 5:00 PM.',
        'Truck #2 maintenance due in 1 week.',
      ];
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      const updatesElement = document.getElementById('real-time-updates');
      if (updatesElement) {
        updatesElement.textContent = randomUpdate;
      }
    }, 5000); // Update every 5 seconds
  
    // Handle "Track Route" button click
    const trackRouteButton = document.querySelector('#current-job .btn-warning');
    trackRouteButton.addEventListener('click', () => {
      alert('Route tracking started!');
    });
  
    // Handle "Update Location" button click
    const updateLocationButton = document.querySelector('#location-tracking .btn-info');
    updateLocationButton.addEventListener('click', () => {
      alert('Location updated successfully!');
    });
  
    // Handle "Check Status" button click
    const checkStatusButton = document.querySelector('#truck-status .btn-success');
    checkStatusButton.addEventListener('click', () => {
      alert('Truck status checked!');
    });
  
    // Handle "Cancel Load" button click
    const cancelLoadButton = document.querySelector('#amazon-load-details .btn-danger');
    cancelLoadButton.addEventListener('click', () => {
      alert('Load canceled!');
    });
  
    // Handle "Confirm Load Delivered" button click
    const confirmLoadButton = document.querySelector('#amazon-load-details .btn-success');
    confirmLoadButton.addEventListener('click', () => {
      alert('Load delivery confirmed!');
    });
  });