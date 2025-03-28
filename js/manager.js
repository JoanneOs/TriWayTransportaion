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
          assignLoadForm.reset();
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
          hiringForm.reset();
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
  }, 5000);

  // Fetch trip data with enhanced error handling
  fetch('http://localhost:8000/data/trips.json', {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
  })
  .then(response => {
      console.log("HTTP Status:", response.status);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(trips => {
      const container = document.getElementById('trips-container');
      container.innerHTML = '';
      
      trips.forEach(trip => {
          const tripCard = document.createElement('div');
          tripCard.className = 'trip-card';
          
          tripCard.innerHTML = `
              <h3>Trip ID: ${trip['Trip ID'] || 'N/A'}</h3>
              <p><strong>Status:</strong> ${trip.Status || 'Unknown'}</p>
              <p><strong>Route:</strong> ${trip.Origin} → ${trip.Destination}</p>
              <p><strong>Driver:</strong> ${trip.Driver || 'Not assigned'}</p>
          `;
          
          container.appendChild(tripCard);
      });
  })
  .catch(error => {
      console.error('Full error details:', {
          error: error.message,
          url: error.url || 'data/trips.json',
          stack: error.stack
      });
      
      document.getElementById('trips-container').innerHTML = `
          <div class="alert alert-danger">
              Failed to load trips. Technical details:<br>
              ${error.message}<br>
              <small>Check console (F12) for more info</small>
          </div>`;
  });
});

// Your WeatherAPI API key
const apiKey = '6ba75e55e5c64569866191244252803'; // Your API key

// The city you want the weather data for
const city = 'London'; // Replace this with your preferred city

// Function to fetch weather data
function getWeather() {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Extracting the necessary information from the API response
            const temperature = data.current.temp_c;
            const weatherDescription = data.current.condition.text;

            // Updating the HTML to show the weather data
            const weatherInfo = `Temperature: ${temperature}°C, Condition: ${weatherDescription}`;
            document.getElementById('weather-info').innerText = weatherInfo;
        })
        .catch(error => {
            // Handling any errors
            document.getElementById('weather-info').innerText = 'Could not load weather data.';
            console.error('Error fetching weather data:', error);
        });
}

// Call the function to get weather when the page loads
getWeather();
