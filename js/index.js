document.addEventListener('DOMContentLoaded', () => {
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      // Mock authentication (replace with real backend logic)
      if (username === 'driver' && password === 'driver123') {
        alert('Login successful! Redirecting to Driver Portal...');
        window.location.href = 'driver.html'; // Redirect to Driver Portal
      } else if (username === 'manager' && password === 'manager123') {
        alert('Login successful! Redirecting to Manager Portal...');
        window.location.href = 'manager.html'; // Redirect to Manager Portal
      } else {
        alert('Invalid username or password. Please try again.');
      }
    });
  
    // Simulate real-time updates (optional)
    setInterval(() => {
      const updates = [
        'New load available for drivers.',
        'Reminder: Check your schedule for upcoming deliveries.',
        'System maintenance scheduled for tonight at 10 PM.',
      ];
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      console.log(randomUpdate); // Log updates to the console (can be displayed on the page if needed)
    }, 5000); // Update every 5 seconds
  });