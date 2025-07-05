// BookingManager.js - Handles booking data and operations
export class BookingManager {
    constructor() {
        this.bookings = this.initializeBookingData();
    }

    initializeBookingData() {
        return [
            {
                id: 'BK001',
                vanId: 1,
                vanName: 'Compact Van #1',
                customerName: 'John Smith',
                customerEmail: 'john.smith@email.com',
                customerPhone: '+1 (555) 123-4567',
                checkinDate: '2024-01-15',
                checkoutDate: '2024-01-20',
                status: 'confirmed',
                totalAmount: 400,
                depositAmount: 120,
                notes: 'First-time customer, pickup at airport',
                bookingDate: '2024-01-10',
                specialRequests: 'Child seat needed'
            },
            {
                id: 'BK002',
                vanId: 3,
                vanName: 'Standard Van #1',
                customerName: 'Sarah Johnson',
                customerEmail: 'sarah.j@email.com',
                customerPhone: '+1 (555) 987-6543',
                checkinDate: '2024-01-18',
                checkoutDate: '2024-01-25',
                status: 'confirmed',
                totalAmount: 840,
                depositAmount: 252,
                notes: 'Regular customer, premium insurance',
                bookingDate: '2024-01-12',
                specialRequests: 'GPS navigation required'
            },
            {
                id: 'BK003',
                vanId: 2,
                vanName: 'Compact Van #2',
                customerName: 'Mike Davis',
                customerEmail: 'mike.davis@email.com',
                customerPhone: '+1 (555) 456-7890',
                checkinDate: '2024-01-22',
                checkoutDate: '2024-01-24',
                status: 'pending',
                totalAmount: 160,
                depositAmount: 48,
                notes: 'Pending payment confirmation',
                bookingDate: '2024-01-20',
                specialRequests: 'Early pickup requested'
            },
            {
                id: 'BK004',
                vanId: 6,
                vanName: 'Luxury Van #1',
                customerName: 'Emma Wilson',
                customerEmail: 'emma.wilson@email.com',
                customerPhone: '+1 (555) 321-0987',
                checkinDate: '2024-01-28',
                checkoutDate: '2024-02-05',
                status: 'confirmed',
                totalAmount: 1600,
                depositAmount: 480,
                notes: 'Anniversary trip, VIP treatment',
                bookingDate: '2024-01-15',
                specialRequests: 'Champagne and flowers setup'
            },
            {
                id: 'BK005',
                vanId: 5,
                vanName: 'Standard Van #3',
                customerName: 'David Brown',
                customerEmail: 'david.brown@email.com',
                customerPhone: '+1 (555) 654-3210',
                checkinDate: '2024-02-10',
                checkoutDate: '2024-02-17',
                status: 'confirmed',
                totalAmount: 840,
                depositAmount: 252,
                notes: 'Business trip, require receipt',
                bookingDate: '2024-01-25',
                specialRequests: 'Mobile wifi needed'
            }
        ];
    }

    getBookingById(bookingId) {
        return this.bookings.find(booking => booking.id === bookingId);
    }

    getBookingsByVan(vanId) {
        return this.bookings.filter(booking => booking.vanId === vanId);
    }

    getBookingsByStatus(status) {
        return this.bookings.filter(booking => booking.status === status);
    }

    getBookingsByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.bookings.filter(booking => {
            const checkin = new Date(booking.checkinDate);
            const checkout = new Date(booking.checkoutDate);
            
            return (checkin >= start && checkin <= end) ||
                   (checkout >= start && checkout <= end) ||
                   (checkin <= start && checkout >= end);
        });
    }

    getBookingStats() {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

        const totalBookings = this.bookings.length;
        const confirmedBookings = this.bookings.filter(b => b.status === 'confirmed').length;
        const pendingBookings = this.bookings.filter(b => b.status === 'pending').length;
        const thisMonthBookings = this.bookings.filter(b => {
            const bookingDate = new Date(b.bookingDate);
            return bookingDate >= thisMonth && bookingDate < nextMonth;
        }).length;

        const totalRevenue = this.bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.totalAmount, 0);

        const thisMonthRevenue = this.bookings
            .filter(b => {
                const bookingDate = new Date(b.bookingDate);
                return bookingDate >= thisMonth && bookingDate < nextMonth && b.status === 'confirmed';
            })
            .reduce((sum, b) => sum + b.totalAmount, 0);

        return {
            total: totalBookings,
            confirmed: confirmedBookings,
            pending: pendingBookings,
            thisMonth: thisMonthBookings,
            totalRevenue,
            thisMonthRevenue
        };
    }

    isVanAvailableForPeriod(vanId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const conflictingBookings = this.bookings.filter(booking => {
            if (booking.vanId !== vanId || booking.status === 'cancelled') {
                return false;
            }
            
            const checkin = new Date(booking.checkinDate);
            const checkout = new Date(booking.checkoutDate);
            
            return (start < checkout && end > checkin);
        });
        
        return conflictingBookings.length === 0;
    }

    addBooking(bookingData) {
        const newId = 'BK' + String(Math.max(...this.bookings.map(b => parseInt(b.id.slice(2)))) + 1).padStart(3, '0');
        const newBooking = {
            id: newId,
            ...bookingData,
            bookingDate: new Date().toISOString().split('T')[0],
            status: bookingData.status || 'pending'
        };
        this.bookings.push(newBooking);
        return newBooking;
    }

    updateBooking(bookingId, updateData) {
        const booking = this.getBookingById(bookingId);
        if (booking) {
            Object.assign(booking, updateData);
            return booking;
        }
        return null;
    }

    updateBookingStatus(bookingId, status) {
        const booking = this.getBookingById(bookingId);
        if (booking) {
            booking.status = status;
            return booking;
        }
        return null;
    }

    cancelBooking(bookingId, reason = '') {
        const booking = this.getBookingById(bookingId);
        if (booking) {
            booking.status = 'cancelled';
            booking.cancellationReason = reason;
            booking.cancellationDate = new Date().toISOString().split('T')[0];
            return booking;
        }
        return null;
    }

    deleteBooking(bookingId) {
        const index = this.bookings.findIndex(booking => booking.id === bookingId);
        if (index !== -1) {
            const deletedBooking = this.bookings.splice(index, 1)[0];
            return deletedBooking;
        }
        return null;
    }

    searchBookings(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.bookings.filter(booking => 
            booking.customerName.toLowerCase().includes(term) ||
            booking.customerEmail.toLowerCase().includes(term) ||
            booking.id.toLowerCase().includes(term) ||
            booking.vanName.toLowerCase().includes(term)
        );
    }

    getUpcomingBookings(days = 7) {
        const today = new Date();
        const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
        
        return this.bookings.filter(booking => {
            const checkin = new Date(booking.checkinDate);
            return checkin >= today && checkin <= futureDate && booking.status === 'confirmed';
        }).sort((a, b) => new Date(a.checkinDate) - new Date(b.checkinDate));
    }

    getActiveRentals() {
        const today = new Date().toISOString().split('T')[0];
        
        return this.bookings.filter(booking => {
            return booking.checkinDate <= today && 
                   booking.checkoutDate >= today && 
                   booking.status === 'confirmed';
        });
    }

    calculateBookingTotal(vanId, checkinDate, checkoutDate, additionalFees = {}) {
        const van = window.adminDashboard?.vanManager?.getVanById(vanId);
        if (!van) return 0;

        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        
        let baseTotal = van.price * days;
        let total = baseTotal;

        // Add additional fees
        Object.values(additionalFees).forEach(fee => {
            total += parseFloat(fee) || 0;
        });

        return {
            days,
            baseTotal,
            additionalFees: Object.values(additionalFees).reduce((sum, fee) => sum + (parseFloat(fee) || 0), 0),
            total
        };
    }

    renderBookingsTable() {
        const bookingsTable = document.getElementById('bookings-table');
        if (!bookingsTable) return;

        if (this.bookings.length === 0) {
            bookingsTable.innerHTML = '<p class="no-data">No bookings found.</p>';
            return;
        }

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Van</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.bookings.map(booking => `
                        <tr class="booking-row ${booking.status}">
                            <td>${booking.id}</td>
                            <td>
                                <div class="customer-info">
                                    <div class="customer-name">${booking.customerName}</div>
                                    <div class="customer-email">${booking.customerEmail}</div>
                                </div>
                            </td>
                            <td>${booking.vanName}</td>
                            <td>${new Date(booking.checkinDate).toLocaleDateString()}</td>
                            <td>${new Date(booking.checkoutDate).toLocaleDateString()}</td>
                            <td><span class="status-badge ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
                            <td>$${booking.totalAmount.toLocaleString()}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-small btn-primary" onclick="adminDashboard.bookingManager.viewBooking('${booking.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-small btn-secondary" onclick="adminDashboard.bookingManager.editBooking('${booking.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    ${booking.status === 'pending' ? 
                                        `<button class="btn btn-small btn-success" onclick="adminDashboard.bookingManager.confirmBooking('${booking.id}')">
                                            <i class="fas fa-check"></i>
                                        </button>` : ''
                                    }
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        bookingsTable.innerHTML = tableHTML;
    }

    viewBooking(bookingId) {
        const booking = this.getBookingById(bookingId);
        if (!booking) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Booking Details - ${booking.id}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="booking-details">
                        <div class="detail-section">
                            <h3>Customer Information</h3>
                            <p><strong>Name:</strong> ${booking.customerName}</p>
                            <p><strong>Email:</strong> ${booking.customerEmail}</p>
                            <p><strong>Phone:</strong> ${booking.customerPhone}</p>
                        </div>
                        <div class="detail-section">
                            <h3>Booking Information</h3>
                            <p><strong>Van:</strong> ${booking.vanName}</p>
                            <p><strong>Check-in:</strong> ${new Date(booking.checkinDate).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> ${new Date(booking.checkoutDate).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span class="status-badge ${booking.status}">${booking.status}</span></p>
                            <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                        <div class="detail-section">
                            <h3>Financial Information</h3>
                            <p><strong>Total Amount:</strong> $${booking.totalAmount.toLocaleString()}</p>
                            <p><strong>Deposit:</strong> $${booking.depositAmount.toLocaleString()}</p>
                            <p><strong>Remaining:</strong> $${(booking.totalAmount - booking.depositAmount).toLocaleString()}</p>
                        </div>
                        ${booking.notes ? `
                            <div class="detail-section">
                                <h3>Notes</h3>
                                <p>${booking.notes}</p>
                            </div>
                        ` : ''}
                        ${booking.specialRequests ? `
                            <div class="detail-section">
                                <h3>Special Requests</h3>
                                <p>${booking.specialRequests}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <button class="btn btn-primary" onclick="adminDashboard.bookingManager.editBooking('${booking.id}'); this.closest('.modal').remove();">Edit Booking</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    editBooking(bookingId) {
        // Implementation for editing booking
        console.log('Edit booking:', bookingId);
        // Would show edit modal similar to viewBooking but with form fields
    }

    confirmBooking(bookingId) {
        const booking = this.updateBookingStatus(bookingId, 'confirmed');
        if (booking) {
            this.renderBookingsTable();
            if (window.adminDashboard && window.adminDashboard.uiManager) {
                window.adminDashboard.uiManager.showNotification(`Booking ${bookingId} confirmed!`, 'success');
            }
        }
    }
}
