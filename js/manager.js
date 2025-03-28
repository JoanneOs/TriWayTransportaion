// Main wrapper using async IIFE to enable top-level await
(async function() {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // ======================
      // 1. DRIVER MANAGEMENT
      // ======================
      const loadDrivers = async () => {
        return new Promise(resolve => {
          // Simulating API call with timeout
          setTimeout(() => {
            resolve([
              { name: 'John Doe', status: 'En Route', loads: 3 },
              { name: 'Jane Smith', status: 'Available', loads: 1 }
            ]);
          }, 300);
        });
      };

      const drivers = await loadDrivers();
      await renderDriverTable(drivers);
      await populateDriverSelect(drivers);

      // ======================
      // 2. LOAD ASSIGNMENT
      // ======================
      setupLoadAssignment();

      // ======================
      // 3. HIRING APPLICATION
      // ======================
      setupHiringForm();

      // ======================
      // 4. REAL-TIME UPDATES
      // ======================
      startRealTimeUpdates();

      // ======================
      // 5. TRIPS DATA (Parallel load with weather)
      // ======================
      const tripsPromise = loadTripsData()
        .then(trips => renderTrips(trips))
        .catch(showFallbackTrips);

      // ======================
      // 6. WEATHER WIDGET (Parallel load)
      // ======================
      const weatherPromise = initializeWeatherWidget();

      // Wait for both to complete
      await Promise.all([tripsPromise, weatherPromise]);

    } catch (error) {
      console.error('Initialization error:', error);
      showErrorNotification('Some features failed to load');
    }
  });

  // ======================
  // HELPER FUNCTIONS
  // ======================

  async function renderDriverTable(drivers) {
    return new Promise(resolve => {
      const driverTableBody = document.querySelector('#driver-table tbody');
      if (driverTableBody) {
        driverTableBody.innerHTML = drivers.map(driver => `
          <tr>
            <td>${driver.name}</td>
            <td>${driver.status}</td>
            <td>${driver.loads}</td>
          </tr>
        `).join('');
      }
      resolve();
    });
  }

  async function populateDriverSelect(drivers) {
    return new Promise(resolve => {
      const driverSelect = document.getElementById('driver-select');
      if (driverSelect) {
        driverSelect.innerHTML = drivers.map(driver => 
          `<option value="${driver.name}">${driver.name}</option>`
        ).join('');
      }
      resolve();
    });
  }

  function setupLoadAssignment() {
    const assignLoadForm = document.getElementById('assign-load-form');
    if (assignLoadForm) {
      assignLoadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loadName = document.getElementById('load-name')?.value;
        const driverName = document.getElementById('driver-select')?.value;

        if (loadName && driverName) {
          await simulateLoadAssignment(loadName, driverName);
          assignLoadForm.reset();
        } else {
          showErrorNotification('Please enter a load name and select a driver');
        }
      });
    }
  }

  async function simulateLoadAssignment(loadName, driverName) {
    return new Promise(resolve => {
      setTimeout(() => {
        alert(`Load "${loadName}" assigned to ${driverName}`);
        resolve();
      }, 500);
    });
  }

  function setupHiringForm() {
    const hiringForm = document.getElementById('hiring-form');
    if (hiringForm) {
      hiringForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(hiringForm);
        
        try {
          await submitHiringApplication(formData);
          hiringForm.reset();
          showSuccessNotification('Application submitted successfully!');
        } catch (error) {
          showErrorNotification('Failed to submit application');
        }
      });
    }
  }

  async function submitHiringApplication(formData) {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (formData.get('applicant-name') && formData.get('applicant-email')) {
          console.log('Application data:', Object.fromEntries(formData));
          resolve();
        } else {
          reject(new Error('Missing required fields'));
        }
      }, 800);
    });
  }

  function startRealTimeUpdates() {
    const updatesElement = document.getElementById('real-time-updates');
    if (updatesElement) {
      setInterval(async () => {
        const update = await fetchRandomUpdate();
        updatesElement.textContent = update;
      }, 5000);
    }
  }

  async function fetchRandomUpdate() {
    const updates = [
      'New load available on Relay/Amazon.',
      'Driver John Doe has completed Load 123.',
      'Reminder: Check Uber Freight for new loads.',
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(updates[Math.floor(Math.random() * updates.length)]);
      }, 200);
    });
  }

  async function loadTripsData() {
    try {
      const response = await fetch('data/trips.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error loading trips:', error);
      throw error;
    }
  }

  async function renderTrips(trips) {
    const container = document.getElementById('trips-container');
    if (container) {
      container.innerHTML = trips.map(trip => `
        <div class="trip-card mb-3 p-3 border rounded">
          <h3>Trip ID: ${trip['Trip ID'] || 'N/A'}</h3>
          <p><strong>Status:</strong> ${trip.Status || 'Unknown'}</p>
          <p><strong>Route:</strong> ${trip.Origin || 'N/A'} → ${trip.Destination || 'N/A'}</p>
          <p><strong>Driver:</strong> ${trip.Driver || 'Not assigned'}</p>
        </div>
      `).join('');
    }
  }

  async function showFallbackTrips() {
    const container = document.getElementById('trips-container');
    if (container) {
      container.innerHTML = `
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
  }

  async function initializeWeatherWidget() {
    const weatherApiKey = '6ba75e55e5c64569866191244252803';
    const weatherInfo = document.getElementById('weather-info');
    const weatherSearchInput = document.getElementById('weather-search');
    const weatherSearchBtn = document.getElementById('weather-search-btn');

    if (!weatherInfo || !weatherSearchInput || !weatherSearchBtn) return;

    // Initialize with default city
    await updateWeather('San Antonio');

    // Setup event listeners
    weatherSearchBtn.addEventListener('click', async () => {
      const city = weatherSearchInput.value.trim();
      if (city) await updateWeather(city);
    });

    weatherSearchInput.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        const city = weatherSearchInput.value.trim();
        if (city) await updateWeather(city);
      }
    });
  }

  async function updateWeather(city) {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;

    try {
      weatherInfo.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';
      
      const data = await fetchWeatherData(city);
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

  async function fetchWeatherData(city) {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=6ba75e55e5c64569866191244252803&q=${encodeURIComponent(city)}&aqi=no`
    );
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  }

  function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;

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

  function showSuccessNotification(message) {
    // Implement a proper notification system
    alert(message);
  }

  function showErrorNotification(message) {
    // Implement a proper notification system
    alert(message);
  }
})();
//no need to Enable user manipulation of data within the API through the use of POST, PUT, or
//PATCH requests. Ensure your chosen API supports this feature before beginning.


