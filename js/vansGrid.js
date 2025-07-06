// js/vansGrid.js
// Render van fleet grid for Admin Dashboard

export function renderVansGrid(vans, bookings, pricingProfiles) {
  const vansGrid = document.getElementById('vans-grid');
  if (!vansGrid) return;

  vansGrid.innerHTML = vans.map(van => {
    const bookingsCount = bookings.filter(b => b.vanId === van.id).length;
    const revenue = bookings
      .filter(b => b.vanId === van.id && b.status === 'confirmed')
      .reduce((sum, b) => sum + b.total, 0);

    const profile = pricingProfiles.find(p => p.id === van.pricingProfileId);

    return `
      <div class="professional-van-card ${!van.enabled ? 'van-disabled' : ''}">
        <!-- simplified inner HTML -->
        <h3>${van.name} — $${van.pricePerDay}/day</h3>
        <p>${bookingsCount} bookings, $${revenue} revenue</p>
      </div>`;
  }).join('');
}
