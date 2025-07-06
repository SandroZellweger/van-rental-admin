// js/search.js
// Search and results rendering for Admin Dashboard

/**
 * Display search results in the #results-grid element.
 * @param {Array} availableVans - The vans matching criteria.
 * @param {string} checkin - ISO date string for check-in.
 * @param {string} checkout - ISO date string for check-out.
 */
export function renderSearchResults(availableVans, checkin, checkout) {
  const resultsGrid = document.getElementById('results-grid');
  if (!resultsGrid) return;

  if (availableVans.length === 0) {
    resultsGrid.innerHTML = '<p class="no-results">No vans available for the selected dates and criteria.</p>';
    return;
  }

  const startDate = new Date(checkin);
  const endDate = new Date(checkout);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  resultsGrid.innerHTML = availableVans.map(van => `
    <div class="result-item">
      <div class="result-header">
        <div class="van-info">
          <h5>${van.name}</h5>
          <div class="van-type">${van.type.charAt(0).toUpperCase() + van.type.slice(1)} Van</div>
        </div>
        <div class="van-price">
          <div class="price-amount">$${(van.pricePerDay * days).toLocaleString()}</div>
          <div class="price-period">${days} day${days > 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="van-features">
        <span class="feature"><i class="fas fa-users"></i> ${van.capacity} guests</span>
        <span class="feature"><i class="fas fa-dollar-sign"></i> $${van.pricePerDay}/day</span>
        <span class="feature"><i class="fas fa-map-marker-alt"></i> ${van.location}</span>
        <span class="feature status-${van.status}"><i class="fas fa-circle"></i> ${van.status}</span>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary" onclick="adminDashboard.createBooking(${van.id}, '${checkin}', '${checkout}')">
          <i class="fas fa-calendar-plus"></i> Book Now
        </button>
        <button class="btn btn-secondary" onclick="adminDashboard.viewVanDetails(${van.id})">
          <i class="fas fa-info-circle"></i> Details
        </button>
      </div>
    </div>`).join('');
}
