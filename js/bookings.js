// js/bookings.js
// Booking table rendering for Admin Dashboard

export function renderBookingsTable(bookings, formatDisplayDate) {
  const tableBody = document.querySelector('#bookings-table tbody');
  if (!tableBody) return;

  tableBody.innerHTML = bookings.map(booking => `
    <tr>
      <td>${booking.id}</td>
      <td>
        <div>
          <strong>${booking.customerName}</strong><br>
          <small>${booking.customerEmail}</small>
        </div>
      </td>
      <td>${booking.vanName}</td>
      <td>
        ${formatDisplayDate(booking.startDate)} - ${formatDisplayDate(booking.endDate)}
      </td>
      <td><span class="booking-status ${booking.status}">${booking.status}</span></td>
      <td>$${booking.total.toLocaleString()}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="adminDashboard.viewBookingDetails('${booking.id}')">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-primary btn-sm" onclick="adminDashboard.editBooking('${booking.id}')">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    </tr>`).join('');
}
