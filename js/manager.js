document.addEventListener('DOMContentLoaded', () => {
  // ======================
  // 1. DRIVER MANAGEMENT
  // ======================
  const drivers = [
    { name: 'John Doe', status: 'En Route', loads: 3 },
    { name: 'Jane Smith', status: 'Available', loads: 1 },
  ];

  // Populate driver table
  const driverTableBody = document.querySelector('#driver-table tbody');
  if (driverTableBody) {
    drivers.forEach(driver => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${driver.name}</td>
        <td>${driver.status}</td>
        <td>${driver.loads}</td>
      `;
      driverTableBody.appendChild(row);
    });
  }

  // Populate driver select dropdown
  const driverSelect = document.getElementById('driver-select');
  if (driverSelect) {
    drivers.forEach(driver => {
      const option = document.createElement('option');
      option.value = driver.name;
      option.textContent = driver.name;
      driverSelect.appendChild(option);
    });
  }

  // ======================
  // 2. LOAD ASSIGNMENT
  // ======================
  const assignLoadForm = document.getElementById('assign-load-form');
  if (assignLoadForm) {
    assignLoadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const loadName = document.getElementById('load-name')?.value;
      const driverName = document.getElementById('driver-select')?.value;

      if (loadName && driverName) {
        alert(`Load "${loadName}" assigned to ${driverName}`);
        assignLoadForm.reset();
      } else {
        alert('Please enter a load name and select a driver.');
      }
    });
  }

  // ======================
  // 3. HIRING APPLICATION
  // ======================
  const hiringForm = document.getElementById('hiring-form');
  if (hiringForm) {
    hiringForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const applicantName = document.getElementById('applicant-name')?.value;
      const applicantEmail = document.getElementById('applicant-email')?.value;
      const applicantResume = document.getElementById('applicant-resume')?.files[0];

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
  }

  // ======================
  // 4. REAL-TIME UPDATES
  // ======================
  const updatesElement = document.getElementById('real-time-updates');
  if (updatesElement) {
    setInterval(() => {
      const updates = [
        'New load available on Relay/Amazon.',
        'Driver John Doe has completed Load 123.',
        'Reminder: Check Uber Freight for new loads.',
      ];
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      updatesElement.textContent = randomUpdate;
    }, 5000);
  }

  // ======================
  // 5. TRIPS DATA
  // ======================
  const tripsContainer = document.getElementById('trips-container');
  if (tripsContainer) {
    fetchTripsData().catch(showFallbackTrips);
  }

  async function fetchTripsData() {
    try {
      const response = await fetch('data/trips.json'); // Changed to relative path
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const trips = await response.json();
      renderTrips(trips);
    } catch (error) {
      console.error('Error loading trips:', error);
      throw error; // Pass to outer catch
    }
  }

  function renderTrips(trips) {
    tripsContainer.innerHTML = trips.map(trip => `
      <div class="trip-card mb-3 p-3 border rounded">
        <h3>Trip ID: ${trip['Trip ID'] || 'N/A'}</h3>
        <p><strong>Status:</strong> ${trip.Status || 'Unknown'}</p>
        <p><strong>Route:</strong> ${trip.Origin || 'N/A'} → ${trip.Destination || 'N/A'}</p>
        <p><strong>Driver:</strong> ${trip.Driver || 'Not assigned'}</p>
      </div>
    `).join('');
  }

  function showFallbackTrips() {
    tripsContainer.innerHTML = `
      <div class="alert alert-warning">
        Couldn't load trips. Showing sample data.
      </div>
      <div class="trip-card mb-3 p-3 border rounded">
        <h3>Trip ID: DEMO-001</h3>
        <p><strong>Status:</strong> Active</p>
        <p><strong>Route:</strong> Austin → San Antonio</p>
        <p><strong>Driver:</strong> Jane Smith</p>
      </div>
    `;
  }

  // ======================
  // 6. WEATHER WIDGET
  // ======================
  const weatherApiKey = '6ba75e55e5c64569866191244252803';
  const weatherInfo = document.getElementById('weather-info');
  const weatherSearchInput = document.getElementById('weather-search');
  const weatherSearchBtn = document.getElementById('weather-search-btn');

  if (weatherInfo && weatherSearchInput && weatherSearchBtn) {
    // Initialize with default city
    getWeather('San Antonio');

    // Setup event listeners
    weatherSearchBtn.addEventListener('click', handleWeatherSearch);
    weatherSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleWeatherSearch();
    });
  }

  function handleWeatherSearch() {
    const city = weatherSearchInput.value.trim();
    if (city) getWeather(city);
  }

  async function getWeather(city) {
    try {
      weatherInfo.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';
      
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(city)}&aqi=no`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      console.error('Weather fetch error:', error);
      weatherInfo.innerHTML = `
        <div class="alert alert-danger">
          Could not load weather data: ${error.message}
        </div>
      `;
    }
  }

  function displayWeather(data) {
    weatherInfo.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" class="me-3">
        <div>
          <h4>${data.location.name}, ${data.location.country}</h4>
          <p class="mb-1"><strong>${data.current.temp_c}°C</strong> (Feels like ${data.current.feelslike_c}°C)</p>
          <p class="mb-1">${data.current.condition.text}</p>
          <p class="mb-1">Humidity: ${data.current.humidity}%</p>
          <p class="mb-0">Wind: ${data.current.wind_kph} km/h ${data.current.wind_dir}</p>
        </div>
      </div>
    `;
  }
});

//no need to Enable user manipulation of data within the API through the use of POST, PUT, or
//PATCH requests. Ensure your chosen API supports this feature before beginning.


