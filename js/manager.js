// Configuration Constants

//new cons for pay rate
const PAY_RATE_PER_MILE = 1.2; // $1.20 per mile

// Stores the API key used to fetch weather data from a weather service
const WEATHER_API_KEY = '2a7d6ec8fb25451b9ac114954252903';

// Defines the file path to the trips data in JSON format, used to load trip information
const TRIPS_DATA_PATH = './js/trips.json';





// Main application controller
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Load and display trips
    const trips = await loadTrips();
    renderTrips(trips);
    
// Added these lines inside the main initialization:
const driverStats = calculateDriverStats(trips);
renderDriverStats(driverStats);


    // Initialize other functionality
    initializeDriverManagement();
    setupRealTimeUpdates();
    initializeWeatherWidget();


    
  } catch (error) {
    console.error('Application failed to initialize:', error);
    showError('Failed to load application data. Please refresh the page.');
  }
});

// ======================
// CORE TRIP MANAGEMENT
// ======================

async function loadTrips() {
  try {
    const response = await fetch(TRIPS_DATA_PATH);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const trips = await response.json();
    console.log(`Loaded ${trips.length} trips successfully`);
    return trips;
    
  } catch (error) {
    console.error('Failed to load trips:', error);
    throw error;
  }
}

function renderTrips(trips) {
  const tableBody = document.getElementById('trips-table-body');
  
  if (!tableBody) {
    console.error('Trips table body not found!');
    return;
  }

  tableBody.innerHTML = trips.map(trip => `
    <tr>
      <td>${trip['Trip ID'] || 'N/A'}</td>
      <td>${trip['Driver Name'] || 'Unassigned'}</td>
      <td>${formatRoute(trip['Facility Sequence'])}</td>
      <td>${createStatusBadge(trip['Trip Stage'])}</td>
      <td>
        <button class="btn btn-sm btn-primary view-details"
                data-trip-id="${trip['Trip ID']}">
          <i class="bi bi-eye"></i> View
        </button>
      </td>
    </tr>
  `).join('');

  // Add event listeners to detail buttons
  document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', () => {
      const tripId = button.getAttribute('data-trip-id');
      const trip = trips.find(t => t['Trip ID'] === tripId);
      showTripModal(trip);
    });
  });
}

function formatRoute(route) {
  if (!route) return 'N/A';
  return route.replace(/->/g, ' → ');
}

function createStatusBadge(status) {
  const statusText = status || 'Unknown';
  let badgeClass = 'bg-secondary';
  
  if (/completed/i.test(statusText)) badgeClass = 'bg-success';
  else if (/canceled/i.test(statusText)) badgeClass = 'bg-danger';
  else if (/active|in progress/i.test(statusText)) badgeClass = 'bg-primary';
  
  return `<span class="badge ${badgeClass}">${statusText}</span>`;
}

// ======================
// TRIP DETAILS MODAL
// ======================

function showTripModal(trip) {
  if (!trip) return;
  
  const modalHtml = `
    <div class="modal fade" id="tripDetailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Trip ${trip['Trip ID']}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6>Driver Information</h6>
                <p><strong>Name:</strong> ${trip['Driver Name'] || 'N/A'}</p>
                <p><strong>Vehicle:</strong> ${trip['Tractor Vehicle ID'] || 'N/A'}</p>
              </div>
              <div class="col-md-6">
                <h6>Trip Information</h6>
                <p><strong>Status:</strong> ${createStatusBadge(trip['Trip Stage'])}</p>
                <p><strong>Distance:</strong> ${trip['Estimate Distance'] || '0'} ${trip['Unit'] || 'miles'}</p>
              </div>
            </div>
            <hr>
            <h5 class="mt-3">Route Details</h5>
            ${renderStopDetails(trip)}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add to DOM and show
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = new bootstrap.Modal(document.getElementById('tripDetailsModal'));
  modal.show();
  
  // Clean up after close
  document.getElementById('tripDetailsModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('tripDetailsModal').remove();
  });
}

function renderStopDetails(trip) {
  let html = '';
  for (let i = 1; i <= 2; i++) {
    if (trip[`Stop ${i}`]) {
      html += `
        <div class="card mb-2">
          <div class="card-body">
            <h6 class="card-title">Stop ${i}: ${trip[`Stop ${i}`]}</h6>
            <div class="row">
              <div class="col-md-6">
                <p class="mb-1"><strong>Planned Arrival:</strong></p>
                <p>${trip[`Stop ${i} Planned Arrival Date`]} ${trip[`Stop ${i} Planned Arrival Time`]}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1"><strong>Actual Arrival:</strong></p>
                <p>${trip[`Stop ${i} Actual Arrival Date`] || '--'} ${trip[`Stop ${i} Actual Arrival Time`] || ''}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
  return html || '<p class="text-muted">No stop details available</p>';
}

// ======================
// WEATHER WIDGET
// ======================

function initializeWeatherWidget() {
  const weatherSearchInput = document.getElementById('weather-search');
  const weatherSearchBtn = document.getElementById('weather-search-btn');
  
  // Default city
  updateWeather('San Antonio');
  
  // Event listeners
  weatherSearchBtn?.addEventListener('click', () => {
    const city = weatherSearchInput?.value.trim();
    if (city) updateWeather(city);
  });
  
  weatherSearchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const city = weatherSearchInput.value.trim();
      if (city) updateWeather(city);
    }
  });
}

async function updateWeather(city) {
  const weatherInfo = document.getElementById('weather-info');
  if (!weatherInfo) return;

  try {
    weatherInfo.innerHTML = `
      <div class="weather-loading">
        <div class="spinner-border text-primary"></div>
        <span>Loading weather...</span>
      </div>
    `;
    
    const data = await fetchWeather(city);
    displayWeather(data);
    
  } catch (error) {
    console.error('Weather fetch error:', error);
    weatherInfo.innerHTML = `
      <div class="alert alert-warning">
        Weather unavailable: ${error.message}
        <button class="btn btn-sm btn-primary mt-2" 
                onclick="updateWeather('${city}')">
          Retry
        </button>
      </div>
    `;
  }
}

async function fetchWeather(city) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`
  );
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  return await response.json();
}

function displayWeather(data) {
  const weatherInfo = document.getElementById('weather-info');
  if (!weatherInfo) return;

  weatherInfo.innerHTML = `
    <div class="weather-card">
      <div class="weather-header">
        <h4>${data.location.name}, ${data.location.country}</h4>
        <img src="https:${data.current.condition.icon}" 
             alt="${data.current.condition.text}">
      </div>
      <div class="weather-main">
        <div class="weather-temp">${data.current.temp_c}°C</div>
        <div class="weather-condition">${data.current.condition.text}</div>
      </div>
      <div class="weather-details">
        <div><span>Feels like:</span> ${data.current.feelslike_c}°C</div>
        <div><span>Humidity:</span> ${data.current.humidity}%</div>
        <div><span>Wind:</span> ${data.current.wind_kph} km/h ${data.current.wind_dir}</div>
      </div>
    </div>
  `;
}

// ======================
// UTILITY FUNCTIONS
// ======================

function initializeDriverManagement() {
  // Your existing driver management code
  // ...
}

function setupRealTimeUpdates() {
  // Your existing real-time updates code
  // ...
}

function showError(message) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-danger position-fixed top-0 end-0 m-3';
  alert.style.zIndex = '1000';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alert);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Debug function to test weather API
function testWeatherAPI() {
  console.log('Testing Weather API...');
  fetchWeather('San Antonio')
    .then(data => console.log('Weather test successful:', data.location))
    .catch(err => console.error('Weather test failed:', err));
}


///ne wfunciton to calculate trip miles and drivers pay
function calculateDriverStats(trips) {
  const stats = {};
  
  trips.forEach(trip => {
    const driverName = trip['Driver Name'];
    if (!driverName || driverName === 'Unassigned') return;
    
    const miles = parseFloat(trip['Estimate Distance']) || 0;
    
    if (!stats[driverName]) {
      stats[driverName] = {
        totalMiles: 0,
        totalPay: 0,
        tripCount: 0
      };
    }
    
    stats[driverName].totalMiles += miles;
    stats[driverName].totalPay += miles * PAY_RATE_PER_MILE;
    stats[driverName].tripCount++;
  });
  
  return stats;
}

function renderDriverStats(driverStats) {
  const container = document.getElementById('driver-stats-container');
  if (!container) return;
  
  const sortedDrivers = Object.entries(driverStats)
    .sort((a, b) => b[1].totalMiles - a[1].totalMiles);
  
  container.innerHTML = `
    <h3>Driver Performance</h3>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Driver</th>
          <th>Trips</th>
          <th>Total Miles</th>
          <th>Total Pay</th>
        </tr>
      </thead>
      <tbody>
        ${sortedDrivers.map(([name, stats]) => `
          <tr>
            <td>${name}</td>
            <td>${stats.tripCount}</td>
            <td>${stats.totalMiles.toFixed(1)} miles</td>
            <td>$${stats.totalPay.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}