// CalendarManager.js - Handles calendar rendering and availability
import { APIService } from '../services/APIService.js';

export class CalendarManager {
    constructor() {
        this.api = new APIService();
        this.currentDate = new Date();
        this.availabilityData = {};
        this.isLoading = false;
        this.error = null;
    }

    async loadAvailabilityCalendar(vanId, year, month) {
        try {
            this.isLoading = true;
            this.error = null;
            const response = await this.api.getAvailabilityCalendar(vanId, year, month);
            const key = `${vanId}-${year}-${month}`;
            this.availabilityData[key] = response.data;
            return response.data;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to load availability calendar:', error);
            return null;
        } finally {
            this.isLoading = false;
        }
    }

    async checkAvailability(availabilityData) {
        try {
            this.isLoading = true;
            const response = await this.api.checkAvailability(availabilityData);
            return response.data;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to check availability:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    renderAvailabilityCalendar() {
        const calendarContainer = document.getElementById('availability-calendar');
        if (!calendarContainer) return;

        const monthYearElement = calendarContainer.querySelector('.calendar-month-year');
        if (monthYearElement) {
            monthYearElement.textContent = this.currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        }

        // Render individual van calendars
        const vansContainer = calendarContainer.querySelector('.vans-calendar-container');
        if (vansContainer && window.adminDashboard?.vanManager) {
            const enabledVans = window.adminDashboard.vanManager.vans.filter(van => van.enabled);
            vansContainer.innerHTML = enabledVans.map(van => this.createVanCalendar(van)).join('');
        }
    }

    createVanCalendar(van) {
        const calendarDiv = document.createElement('div');
        calendarDiv.className = 'van-calendar';
        
        const header = document.createElement('div');
        header.className = 'van-calendar-header';
        
        const title = document.createElement('h4');
        title.className = 'van-calendar-title';
        title.textContent = van.name;
        
        const type = document.createElement('span');
        type.className = 'van-calendar-type';
        type.textContent = van.type.charAt(0).toUpperCase() + van.type.slice(1);
        
        header.appendChild(title);
        header.appendChild(type);
        
        const calendar = this.createMiniCalendar(van);
        
        calendarDiv.appendChild(header);
        calendarDiv.appendChild(calendar);
        
        return calendarDiv.outerHTML;
    }

    createMiniCalendar(van) {
        const calendar = document.createElement('div');
        calendar.className = 'mini-calendar';
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Create day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'mini-calendar-day header';
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'mini-calendar-day other-month';
            calendar.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'mini-calendar-day';
            dayElement.textContent = day;
            
            // Get availability for this day
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const availability = this.getVanAvailabilityForDate(van.id, dateStr);
            dayElement.classList.add(availability);
            
            // Add click handler
            dayElement.onclick = () => this.showDayDetails(van.id, dateStr);
            
            calendar.appendChild(dayElement);
        }
        
        return calendar;
    }

    getVanAvailabilityForDate(vanId, dateStr) {
        if (!window.adminDashboard?.bookingManager) return 'available';

        const bookings = window.adminDashboard.bookingManager.bookings;
        const targetDate = new Date(dateStr);
        
        // Check if van is booked on this date
        const isBooked = bookings.some(booking => {
            if (booking.vanId !== vanId || booking.status === 'cancelled') {
                return false;
            }
            
            const checkin = new Date(booking.checkinDate);
            const checkout = new Date(booking.checkoutDate);
            
            return targetDate >= checkin && targetDate < checkout;
        });
        
        if (isBooked) return 'booked';
        
        // Check if it's a weekend (optional premium pricing indicator)
        const dayOfWeek = targetDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return 'weekend';
        }
        
        return 'available';
    }

    showDayDetails(vanId, dateStr) {
        const van = window.adminDashboard?.vanManager?.getVanById(vanId);
        const bookings = window.adminDashboard?.bookingManager?.getBookingsByVan(vanId) || [];
        
        if (!van) return;
        
        const targetDate = new Date(dateStr);
        const dayBookings = bookings.filter(booking => {
            const checkin = new Date(booking.checkinDate);
            const checkout = new Date(booking.checkoutDate);
            return targetDate >= checkin && targetDate < checkout && booking.status !== 'cancelled';
        });

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${van.name} - ${targetDate.toLocaleDateString()}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="day-details">
                        <div class="van-info">
                            <h3>Van Information</h3>
                            <p><strong>Type:</strong> ${van.type.charAt(0).toUpperCase() + van.type.slice(1)}</p>
                            <p><strong>Location:</strong> ${van.location}</p>
                            <p><strong>Capacity:</strong> ${van.capacity} people</p>
                            <p><strong>Status:</strong> <span class="status-badge ${van.status}">${van.status}</span></p>
                        </div>
                        
                        ${dayBookings.length > 0 ? `
                            <div class="booking-info">
                                <h3>Current Booking</h3>
                                ${dayBookings.map(booking => `
                                    <div class="booking-card">
                                        <p><strong>Customer:</strong> ${booking.customerName}</p>
                                        <p><strong>Check-in:</strong> ${new Date(booking.checkinDate).toLocaleDateString()}</p>
                                        <p><strong>Check-out:</strong> ${new Date(booking.checkoutDate).toLocaleDateString()}</p>
                                        <p><strong>Status:</strong> <span class="status-badge ${booking.status}">${booking.status}</span></p>
                                        <p><strong>Total:</strong> $${booking.totalAmount.toLocaleString()}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="availability-info">
                                <h3>Availability</h3>
                                <p class="available-message">
                                    <i class="fas fa-check-circle text-success"></i> 
                                    This van is available on ${targetDate.toLocaleDateString()}
                                </p>
                                <div class="pricing-info">
                                    <p><strong>Base Price:</strong> $${van.price}/day</p>
                                    ${this.getDayOfWeek(targetDate) === 0 || this.getDayOfWeek(targetDate) === 6 ? 
                                        '<p class="weekend-notice"><i class="fas fa-calendar-weekend"></i> Weekend rates may apply</p>' : ''
                                    }
                                </div>
                            </div>
                        `}

                        <div class="quick-actions">
                            <h3>Quick Actions</h3>
                            <div class="action-buttons">
                                ${dayBookings.length === 0 ? `
                                    <button class="btn btn-primary" onclick="adminDashboard.calendarManager.createBooking(${vanId}, '${dateStr}')">
                                        <i class="fas fa-plus"></i> Create Booking
                                    </button>
                                ` : ''}
                                <button class="btn btn-secondary" onclick="adminDashboard.calendarManager.viewVanSchedule(${vanId})">
                                    <i class="fas fa-calendar"></i> View Full Schedule
                                </button>
                                <button class="btn btn-outline" onclick="adminDashboard.vanManager.editVan(${vanId})">
                                    <i class="fas fa-edit"></i> Edit Van
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    getDayOfWeek(date) {
        return date.getDay();
    }

    createBooking(vanId, dateStr) {
        // Close current modal
        const currentModal = document.querySelector('.modal.active');
        if (currentModal) currentModal.remove();

        // Implementation would show booking creation form
        const van = window.adminDashboard?.vanManager?.getVanById(vanId);
        if (!van) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Create Booking - ${van.name}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form onsubmit="adminDashboard.calendarManager.submitBooking(event, ${vanId})">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Check-in Date:</label>
                                <input type="date" id="booking-checkin" value="${dateStr}" required>
                            </div>
                            <div class="form-group">
                                <label>Check-out Date:</label>
                                <input type="date" id="booking-checkout" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Customer Name:</label>
                                <input type="text" id="booking-customer-name" required>
                            </div>
                            <div class="form-group">
                                <label>Customer Email:</label>
                                <input type="email" id="booking-customer-email" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Customer Phone:</label>
                            <input type="tel" id="booking-customer-phone" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Special Requests:</label>
                            <textarea id="booking-special-requests" rows="3"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Notes:</label>
                            <textarea id="booking-notes" rows="3"></textarea>
                        </div>
                        
                        <div class="pricing-summary">
                            <h3>Pricing Summary</h3>
                            <div id="booking-pricing-breakdown">
                                <p>Select dates to see pricing breakdown</p>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Create Booking</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Setup date change listeners for pricing calculation
        const checkinInput = document.getElementById('booking-checkin');
        const checkoutInput = document.getElementById('booking-checkout');
        
        const updatePricing = () => {
            const checkin = checkinInput.value;
            const checkout = checkoutInput.value;
            
            if (checkin && checkout && window.adminDashboard?.pricingManager) {
                const pricing = window.adminDashboard.pricingManager.calculatePrice(
                    van.price,
                    van.pricingProfile,
                    checkin,
                    checkout
                );
                
                const breakdownDiv = document.getElementById('booking-pricing-breakdown');
                if (pricing.error) {
                    breakdownDiv.innerHTML = `<p class="error">${pricing.error}</p>`;
                } else {
                    breakdownDiv.innerHTML = `
                        <div class="pricing-line">
                            <span>Base price (${pricing.days} days):</span>
                            <span>$${pricing.subtotal.toFixed(2)}</span>
                        </div>
                        ${pricing.adjustments.map(adj => `
                            <div class="pricing-line ${adj.amount < 0 ? 'discount' : 'surcharge'}">
                                <span>${adj.description}:</span>
                                <span>${adj.amount < 0 ? '-' : '+'}$${Math.abs(adj.amount).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div class="pricing-line total">
                            <span><strong>Total:</strong></span>
                            <span><strong>$${pricing.finalPrice.toFixed(2)}</strong></span>
                        </div>
                    `;
                }
            }
        };

        checkinInput.addEventListener('change', updatePricing);
        checkoutInput.addEventListener('change', updatePricing);
    }

    submitBooking(event, vanId) {
        event.preventDefault();
        
        const formData = {
            vanId: vanId,
            vanName: window.adminDashboard?.vanManager?.getVanById(vanId)?.name || 'Unknown Van',
            customerName: document.getElementById('booking-customer-name').value,
            customerEmail: document.getElementById('booking-customer-email').value,
            customerPhone: document.getElementById('booking-customer-phone').value,
            checkinDate: document.getElementById('booking-checkin').value,
            checkoutDate: document.getElementById('booking-checkout').value,
            specialRequests: document.getElementById('booking-special-requests').value,
            notes: document.getElementById('booking-notes').value,
            status: 'confirmed'
        };

        // Calculate total amount
        const van = window.adminDashboard?.vanManager?.getVanById(vanId);
        if (van && window.adminDashboard?.pricingManager) {
            const pricing = window.adminDashboard.pricingManager.calculatePrice(
                van.price,
                van.pricingProfile,
                formData.checkinDate,
                formData.checkoutDate
            );
            
            if (!pricing.error) {
                formData.totalAmount = pricing.finalPrice;
                formData.depositAmount = pricing.finalPrice * 0.3; // 30% deposit
            }
        }

        // Add booking
        if (window.adminDashboard?.bookingManager) {
            const newBooking = window.adminDashboard.bookingManager.addBooking(formData);
            
            // Close modal
            event.target.closest('.modal').remove();
            
            // Refresh calendar and bookings
            this.renderAvailabilityCalendar();
            if (window.adminDashboard.bookingManager.renderBookingsTable) {
                window.adminDashboard.bookingManager.renderBookingsTable();
            }
            
            // Show success notification
            if (window.adminDashboard?.uiManager) {
                window.adminDashboard.uiManager.showNotification(
                    `Booking ${newBooking.id} created successfully!`, 
                    'success'
                );
            }
        }
    }

    viewVanSchedule(vanId) {
        const van = window.adminDashboard?.vanManager?.getVanById(vanId);
        const bookings = window.adminDashboard?.bookingManager?.getBookingsByVan(vanId) || [];
        
        if (!van) return;

        // Close current modal
        const currentModal = document.querySelector('.modal.active');
        if (currentModal) currentModal.remove();

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>${van.name} - Full Schedule</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="schedule-view">
                        ${bookings.length === 0 ? 
                            '<p class="no-bookings">No bookings found for this van.</p>' :
                            `
                            <div class="bookings-timeline">
                                ${bookings
                                    .filter(booking => booking.status !== 'cancelled')
                                    .sort((a, b) => new Date(a.checkinDate) - new Date(b.checkinDate))
                                    .map(booking => `
                                        <div class="timeline-booking ${booking.status}">
                                            <div class="booking-dates">
                                                <strong>${new Date(booking.checkinDate).toLocaleDateString()}</strong> - 
                                                <strong>${new Date(booking.checkoutDate).toLocaleDateString()}</strong>
                                            </div>
                                            <div class="booking-customer">${booking.customerName}</div>
                                            <div class="booking-status">
                                                <span class="status-badge ${booking.status}">${booking.status}</span>
                                                <span class="booking-total">$${booking.totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    `).join('')
                                }
                            </div>
                            `
                        }
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <button class="btn btn-primary" onclick="adminDashboard.calendarManager.createBooking(${vanId}, '${new Date().toISOString().split('T')[0]}')">
                        <i class="fas fa-plus"></i> Add Booking
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    navigateMonth(direction) {
        if (direction === 'prev') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else if (direction === 'next') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.renderAvailabilityCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderAvailabilityCalendar();
    }
}
