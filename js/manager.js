// // At the top of manager.js
// import tripsData from './trips.json' assert { type: 'json' };

// // Replace loadTripsData() with:
// async function loadTripsData() {
//   return tripsData;
// }

// Main application controller
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Load and display trips
    const trips = await loadTrips();
    renderTrips(trips);
    
    // Initialize other functionality
    initializeDriverManagement();
    setupRealTimeUpdates();
    
  } catch (error) {
    console.error('Application failed to initialize:', error);
    showError('Failed to load application data. Please refresh the page.');
  }
});

// ======================
// CORE TRIP MANAGEMENT
// ======================

/**
 * Loads trips data from JSON file
 */
async function loadTrips() {
  try {
    // Try multiple possible paths
    const response = await fetch('./js/trips.json') || 
                     await fetch('trips.json');
    
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

/**
 * Renders trips into the table
 */
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

// Helper function to format route display
function formatRoute(route) {
  if (!route) return 'N/A';
  return route.replace(/->/g, ' → ');
}

// Helper function to create status badges
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
// ADDITIONAL FUNCTIONALITY
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

