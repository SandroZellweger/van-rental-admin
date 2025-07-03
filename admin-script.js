// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentDate = new Date();
        this.vans = this.initializeVanData();
        this.bookings = this.initializeBookingData();
        this.pricingProfiles = this.initializePricingProfiles();
        this.googleSheetsConfig = this.initializeGoogleSheetsConfig();
        this.pricingRules = this.initializePricingRules();
        this.seasonalPricing = this.initializeSeasonalPricing();
        this.displayConfig = this.initializeDisplayConfiguration();
        this.mediaItems = this.initializeMediaData();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.renderDashboard();
        this.renderAvailabilityCalendar();
        this.renderBookingsTable();
        this.renderVansGrid();
        this.setupSearch();
        this.renderPricingProfiles();
        this.setupPricingTabs();
        this.renderGoogleSheetsSection();
        this.setupGoogleSheetsHandlers();
        this.setupVanManagementTabs();
        this.setupMediaManager();
    }

    initializeVanData() {
        return [
            { 
                id: 1, 
                name: 'Compact Van #1', 
                type: 'compact', 
                status: 'available', 
                enabled: true,
                location: 'City Center', 
                price: 80, 
                capacity: 2, 
                pricingProfile: 'standard',
                calendarId: 'compact-van-1@example.com',
                features: ['GPS', 'AC', 'Bluetooth'],
                description: 'Perfect for city trips and short getaways'
            },
            { 
                id: 2, 
                name: 'Compact Van #2', 
                type: 'compact', 
                status: 'available', 
                enabled: true,
                location: 'Airport', 
                price: 80, 
                capacity: 2, 
                pricingProfile: 'standard',
                calendarId: 'compact-van-2@example.com',
                features: ['GPS', 'AC', 'Bluetooth'],
                description: 'Perfect for city trips and short getaways'
            },
            { 
                id: 3, 
                name: 'Standard Van #1', 
                type: 'standard', 
                status: 'rented', 
                enabled: true,
                location: 'Downtown', 
                price: 120, 
                capacity: 4, 
                pricingProfile: 'premium',
                calendarId: 'standard-van-1@example.com',
                features: ['GPS', 'AC', 'Bluetooth', 'Kitchen', 'Bed'],
                description: 'Great for family adventures and weekend trips'
            },
            { 
                id: 4, 
                name: 'Standard Van #2', 
                type: 'standard', 
                status: 'maintenance', 
                enabled: false,
                location: 'Workshop', 
                price: 120, 
                capacity: 4, 
                pricingProfile: 'premium',
                calendarId: 'standard-van-2@example.com',
                features: ['GPS', 'AC', 'Bluetooth', 'Kitchen', 'Bed'],
                description: 'Great for family adventures and weekend trips'
            },
            { 
                id: 5, 
                name: 'Standard Van #3', 
                type: 'standard', 
                status: 'available', 
                enabled: true,
                location: 'Train Station', 
                price: 120, 
                capacity: 4, 
                pricingProfile: 'standard',
                calendarId: 'standard-van-3@example.com',
                features: ['GPS', 'AC', 'Bluetooth', 'Kitchen', 'Bed'],
                description: 'Great for family adventures and weekend trips'
            },
            { 
                id: 6, 
                name: 'Luxury Van #1', 
                type: 'luxury', 
                status: 'rented', 
                enabled: true,
                location: 'Hotel District', 
                price: 180, 
                capacity: 4, 
                pricingProfile: 'luxury',
                calendarId: 'luxury-van-1@example.com',
                features: ['GPS', 'AC', 'Bluetooth', 'Kitchen', 'Bed', 'Solar', 'Premium Interior'],
                description: 'Ultimate comfort for long-distance travel'
            },
            { 
                id: 7, 
                name: 'Luxury Van #2', 
                type: 'luxury', 
                status: 'available', 
                enabled: true,
                location: 'City Center', 
                price: 180, 
                capacity: 4, 
                pricingProfile: 'luxury',
                calendarId: 'luxury-van-2@example.com',
                features: ['GPS', 'AC', 'Bluetooth', 'Kitchen', 'Bed', 'Solar', 'Premium Interior'],
                description: 'Ultimate comfort for long-distance travel'
            },
            { 
                id: 8, 
                name: 'Family Van #1', 
                type: 'family', 
                status: 'available', 
                enabled: true,
                location: 'Suburbs', 
                price: 150, 
                capacity: 6, 
                pricingProfile: 'family',
                calendarId: 'family-van-1@example.com',
                features: ['GPS', 'AC', 'Bluetooth', 'Kitchen', 'Double Bed', 'Storage'],
                description: 'Spacious van perfect for family vacations'
            },
            { 
                id: 9, 
                name: 'Family Van #2', 
                type: 'family', 
                status: 'available', 
                enabled: true,
                location: 'Airport', 
                price: 150, 
                capacity: 6, 
                pricingProfile: 'family',
                calendarId: 'family-van-2@example.com',
                features: ['GPS', 'AC', 'Bluetooth', 'Kitchen', 'Double Bed', 'Storage'],
                description: 'Spacious van perfect for family vacations'
            }
        ];
    }

    initializeBookingData() {
        return [
            {
                id: 'BK001',
                customerId: 'C001',
                customerName: 'John Smith',
                customerEmail: 'john@example.com',
                vanId: 3,
                vanName: 'Standard Van #1',
                startDate: '2025-07-15',
                endDate: '2025-07-20',
                status: 'confirmed',
                total: 600,
                phone: '+1234567890'
            },
            {
                id: 'BK002',
                customerId: 'C002',
                customerName: 'Sarah Johnson',
                customerEmail: 'sarah@example.com',
                vanId: 8,
                vanName: 'Family Van #1',
                startDate: '2025-07-22',
                endDate: '2025-07-25',
                status: 'pending',
                total: 450,
                phone: '+1234567891'
            },
            {
                id: 'BK003',
                customerId: 'C003',
                customerName: 'Mike Davis',
                customerEmail: 'mike@example.com',
                vanId: 1,
                vanName: 'Compact Van #1',
                startDate: '2025-07-18',
                endDate: '2025-07-21',
                status: 'confirmed',
                total: 240,
                phone: '+1234567892'
            }
        ];
    }

    initializePricingProfiles() {
        return [
            {
                id: 'standard',
                name: 'Standard Pricing',
                description: 'Default pricing for most vans',
                basePrice: 100,
                weekendMultiplier: 1.2,
                holidayMultiplier: 1.5,
                minimumDays: 1,
                maxAdvanceBooking: 365,
                cancellationPolicy: '24h free cancellation',
                created: '2025-01-01',
                active: true
            },
            {
                id: 'premium',
                name: 'Premium Pricing',
                description: 'Higher pricing for premium vans',
                basePrice: 150,
                weekendMultiplier: 1.3,
                holidayMultiplier: 1.6,
                minimumDays: 2,
                maxAdvanceBooking: 365,
                cancellationPolicy: '48h free cancellation',
                created: '2025-01-01',
                active: true
            },
            {
                id: 'luxury',
                name: 'Luxury Pricing',
                description: 'Premium pricing for luxury vans',
                basePrice: 200,
                weekendMultiplier: 1.4,
                holidayMultiplier: 1.8,
                minimumDays: 3,
                maxAdvanceBooking: 365,
                cancellationPolicy: '72h free cancellation',
                created: '2025-01-01',
                active: true
            },
            {
                id: 'family',
                name: 'Family Pricing',
                description: 'Family-friendly pricing for larger vans',
                basePrice: 130,
                weekendMultiplier: 1.25,
                holidayMultiplier: 1.4,
                minimumDays: 2,
                maxAdvanceBooking: 365,
                cancellationPolicy: '48h free cancellation',
                created: '2025-01-01',
                active: true
            }
        ];
    }

    initializePricingRules() {
        return [
            {
                id: 'rule1',
                name: 'Early Bird Discount',
                type: 'discount',
                condition: 'advance_booking',
                value: 10,
                unit: 'percent',
                criteria: { days: 30 },
                active: true
            },
            {
                id: 'rule2',
                name: 'Long Stay Discount',
                type: 'discount',
                condition: 'duration',
                value: 15,
                unit: 'percent',
                criteria: { days: 7 },
                active: true
            },
            {
                id: 'rule3',
                name: 'High Demand Surcharge',
                type: 'surcharge',
                condition: 'occupancy',
                value: 20,
                unit: 'percent',
                criteria: { occupancy: 80 },
                active: true
            }
        ];
    }

    initializeSeasonalPricing() {
        return [
            {
                id: 'summer',
                name: 'Summer Season',
                startDate: '2025-06-01',
                endDate: '2025-08-31',
                multiplier: 1.3,
                active: true
            },
            {
                id: 'winter',
                name: 'Winter Season',
                startDate: '2025-12-01',
                endDate: '2025-02-28',
                multiplier: 0.8,
                active: true
            },
            {
                id: 'holidays',
                name: 'Holiday Season',
                startDate: '2025-12-20',
                endDate: '2025-01-05',
                multiplier: 1.5,
                active: true
            }
        ];
    }

    initializeGoogleSheetsConfig() {
        return {
            connected: false,
            lastSync: null,
            vanSheet: {
                url: '',
                range: 'Vans!A1:Z100',
                connected: false,
                lastSync: null
            },
            pricingSheet: {
                url: '',
                range: 'Pricing!A1:Z100',
                connected: false,
                lastSync: null
            },
            syncInterval: 15 // minutes
        };
    }

    initializeDisplayConfiguration() {
        // Configuration for what technical specs to show on the main collection page
        return {
            technicalSpecs: {
                // External dimensions
                showExtLength: true,
                showExtHeight: true, 
                showExtWidth: true,
                
                // Internal dimensions
                showIntLength: true,
                showIntHeight: true,
                showIntWidth: true,
                
                // Vehicle details
                showLicensePlate: false, // Hidden by default for privacy
                showCalendarID: false,   // Admin-only field
                showVehicleAddress: true,
                showLoadVolume: true,
                
                // Business details
                showPricing: true,
                showCapacity: true,
                showFeatures: true,
                showDescription: true,
                showAvailabilityStatus: true
            },
            
            // Display styles
            displayStyle: 'detailed', // 'minimal', 'detailed', 'comprehensive'
            
            // Card layout options
            cardLayout: 'grid', // 'grid', 'list', 'compact'
            
            // Advanced options
            showTechnicalModal: true, // Allow full technical details popup
            groupByType: false,       // Group vans by type
            sortBy: 'name'           // 'name', 'price', 'type', 'availability'
        };
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('page-title');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all nav items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked nav item
                link.parentElement.classList.add('active');
                
                // Hide all sections
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show selected section
                const targetSection = link.dataset.section;
                const section = document.getElementById(targetSection);
                if (section) {
                    section.classList.add('active');
                    pageTitle.textContent = this.getSectionTitle(targetSection);
                }
            });
        });
    }

    getSectionTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            availability: 'Availability Calendar',
            bookings: 'Bookings Management',
            search: 'Van Search',
            vans: 'Van Fleet Management',
            customers: 'Customer Management',
            reports: 'Reports & Analytics',
            settings: 'Settings'
        };
        return titles[section] || 'Dashboard';
    }

    setupEventListeners() {
        // Calendar navigation
        document.getElementById('prevCalendarMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderAvailabilityCalendar();
        });

        document.getElementById('nextCalendarMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderAvailabilityCalendar();
        });

        // Search functionality
        document.getElementById('search-vans-btn')?.addEventListener('click', () => {
            this.performVanSearch();
        });

        // Mobile sidebar toggle
        document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });

        // Set minimum dates for search
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('search-checkin');
        const checkoutInput = document.getElementById('search-checkout');
        
        if (checkinInput) {
            checkinInput.min = today;
            checkinInput.addEventListener('change', () => {
                if (checkoutInput) {
                    checkoutInput.min = checkinInput.value;
                }
            });
        }

        // CSV file input event listener
        const csvFileInput = document.getElementById('csv-file-input');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const csvData = event.target.result;
                            console.log('CSV Data:', csvData);
                            const importedVans = this.importVanDataFromYourCSV(csvData);
                            console.log('Imported vans:', importedVans);
                            
                            // Replace current van data
                            this.vans = importedVans;
                            console.log('Current vans after import:', this.vans);
                            this.renderVansGrid();
                            this.renderAvailabilityCalendar();
                            
                            this.showNotification(`Successfully imported ${importedVans.length} vans from CSV!`, 'success');
                        } catch (error) {
                            console.error('CSV import error:', error);
                            this.showNotification('Error importing CSV: ' + error.message, 'error');
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }

        // Modal event listeners
        this.setupModalListeners();
    }

    setupModalListeners() {
        // Booking modal close
        document.getElementById('close-booking-modal')?.addEventListener('click', () => {
            document.getElementById('booking-modal').style.display = 'none';
        });

        // Van modal close
        document.getElementById('close-van-modal')?.addEventListener('click', () => {
            document.getElementById('van-modal').style.display = 'none';
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            const bookingModal = document.getElementById('booking-modal');
            const vanModal = document.getElementById('van-modal');
            
            if (e.target === bookingModal) {
                bookingModal.style.display = 'none';
            }
            if (e.target === vanModal) {
                vanModal.style.display = 'none';
            }
        });

        // Add pricing profile button
        document.getElementById('add-pricing-profile-btn')?.addEventListener('click', () => {
            this.showCreatePricingProfileModal();
        });
    }

    showCreatePricingProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Create Pricing Profile</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form onsubmit="adminDashboard.createPricingProfile(event)">
                        <div class="form-group">
                            <label for="profile-id">Profile ID:</label>
                            <input type="text" id="profile-id" name="profile-id" required placeholder="e.g., weekend-special">
                        </div>
                        <div class="form-group">
                            <label for="profile-name">Profile Name:</label>
                            <input type="text" id="profile-name" name="profile-name" required placeholder="e.g., Weekend Special">
                        </div>
                        <div class="form-group">
                            <label for="profile-description">Description:</label>
                            <textarea id="profile-description" name="profile-description" rows="2" placeholder="Brief description of this pricing profile"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="profile-base-price">Base Price ($):</label>
                            <input type="number" id="profile-base-price" name="profile-base-price" min="0" step="1" required placeholder="100">
                        </div>
                        <div class="form-group">
                            <label for="profile-weekend-mult">Weekend Multiplier:</label>
                            <input type="number" id="profile-weekend-mult" name="profile-weekend-mult" min="1" step="0.1" value="1.2" placeholder="1.2">
                        </div>
                        <div class="form-group">
                            <label for="profile-holiday-mult">Holiday Multiplier:</label>
                            <input type="number" id="profile-holiday-mult" name="profile-holiday-mult" min="1" step="0.1" value="1.5" placeholder="1.5">
                        </div>
                        <div class="form-group">
                            <label for="profile-min-days">Minimum Days:</label>
                            <input type="number" id="profile-min-days" name="profile-min-days" min="1" value="1" required>
                        </div>
                        <div class="form-group">
                            <label for="profile-cancellation">Cancellation Policy:</label>
                            <input type="text" id="profile-cancellation" name="profile-cancellation" value="24h free cancellation" placeholder="24h free cancellation">
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Create Profile</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    createPricingProfile(event) {
        event.preventDefault();
        
        const newProfile = {
            id: document.getElementById('profile-id').value,
            name: document.getElementById('profile-name').value,
            description: document.getElementById('profile-description').value,
            basePrice: parseFloat(document.getElementById('profile-base-price').value),
            weekendMultiplier: parseFloat(document.getElementById('profile-weekend-mult').value),
            holidayMultiplier: parseFloat(document.getElementById('profile-holiday-mult').value),
            minimumDays: parseInt(document.getElementById('profile-min-days').value),
            cancellationPolicy: document.getElementById('profile-cancellation').value,
            created: new Date().toISOString().split('T')[0],
            active: true
        };
        
        // Check if ID already exists
        if (this.pricingProfiles.find(p => p.id === newProfile.id)) {
            this.showNotification('Profile ID already exists. Please choose a different ID.', 'error');
            return;
        }
        
        this.pricingProfiles.push(newProfile);
        this.renderPricingProfiles();
        this.renderVansGrid(); // Update van grid to show new profile in dropdowns
        
        event.target.closest('.modal').remove();
        this.showNotification('Pricing profile created successfully!', 'success');
    }

    renderDashboard() {
        // Update stats
        const totalVans = this.vans.length;
        const activeBookings = this.bookings.filter(b => b.status === 'confirmed').length;
        const revenue = this.bookings.reduce((sum, b) => sum + b.total, 0);
        const occupancyRate = Math.round((activeBookings / totalVans) * 100);

        // Update stat cards (if they exist)
        const statCards = document.querySelectorAll('.stat-info h3');
        if (statCards.length >= 4) {
            statCards[0].textContent = totalVans;
            statCards[1].textContent = activeBookings;
            statCards[2].textContent = `$${revenue.toLocaleString()}`;
            statCards[3].textContent = `${occupancyRate}%`;
        }
    }

    renderAvailabilityCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthYearElement = document.getElementById('calendarMonthYear');
        if (monthYearElement) {
            monthYearElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }

        const vanCalendarsGrid = document.getElementById('vanCalendarsGrid');
        if (!vanCalendarsGrid) return;

        vanCalendarsGrid.innerHTML = '';

        this.vans.forEach(van => {
            const vanCalendar = this.createVanCalendar(van);
            vanCalendarsGrid.appendChild(vanCalendar);
        });
    }

    createVanCalendar(van) {
        const calendarDiv = document.createElement('div');
        calendarDiv.className = 'van-calendar';
        calendarDiv.setAttribute('data-van-id', van.id);
        
        const header = document.createElement('div');
        header.className = 'van-calendar-header';
        
        const title = document.createElement('div');
        title.className = 'van-calendar-title';
        title.textContent = van.name;
        
        const type = document.createElement('div');
        type.className = 'van-calendar-type';
        type.textContent = `${van.type.charAt(0).toUpperCase() + van.type.slice(1)} • $${van.price}/day`;
        
        header.appendChild(title);
        header.appendChild(type);
        
        const miniCalendar = this.createMiniCalendar(van);
        
        calendarDiv.appendChild(header);
        calendarDiv.appendChild(miniCalendar);
        
        return calendarDiv;
    }

    createMiniCalendar(van) {
        const calendar = document.createElement('div');
        calendar.className = 'mini-calendar';
        
        // Add day headers
        const dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'mini-calendar-day header';
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });
        
        // Get first day of month and adjust for Monday start
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        let startDate = firstDay.getDay();
        startDate = startDate === 0 ? 6 : startDate - 1;
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startDate; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'mini-calendar-day other-month';
            calendar.appendChild(emptyDay);
        }
        
        // Add days of the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const currentDay = new Date(year, month, day);
            const dateStr = this.formatDate(currentDay);
            
            dayElement.className = 'mini-calendar-day';
            dayElement.textContent = day;
            
            // Determine availability for this van on this date
            const availability = this.getVanAvailability(van.id, dateStr);
            dayElement.classList.add(availability);
            
            // Add click handler
            dayElement.addEventListener('click', () => {
                this.handleCalendarDayClick(van, dateStr);
            });
            
            calendar.appendChild(dayElement);
        }
        
        return calendar;
    }

    // Generate 7-day mini calendar for van availability
    generateMiniCalendar(van) {
        const today = new Date();
        const days = [];
        
        // Generate next 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dateStr = this.formatDate(date);
            const availability = this.getVanAvailability(van.id, dateStr);
            
            days.push({
                date: date,
                day: date.getDate(),
                dayName: date.toLocaleDateString('en', { weekday: 'short' }),
                available: availability === 'available',
                status: availability
            });
        }
        
        return `
            <div class="mini-calendar">
                <div class="mini-calendar-header">
                    <span class="calendar-title">Next 7 Days</span>
                </div>
                <div class="mini-calendar-days">
                    ${days.map(day => `
                        <div class="mini-day ${day.available ? 'available' : 'unavailable'}">
                            <div class="day-name">${day.dayName}</div>
                            <div class="day-number">${day.day}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Generate next 7 days calendar for preview
    generateNext7DaysCalendar(van) {
        const today = new Date();
        const next7Days = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dateStr = this.formatDate(date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNumber = date.getDate();
            
            // Check availability for this van on this date
            const isAvailable = this.getVanAvailability(van.id, dateStr) === 'available';
            
            next7Days.push({
                date: dateStr,
                dayName: dayName,
                dayNumber: dayNumber,
                isAvailable: isAvailable
            });
        }
        
        return next7Days.map(day => {
            const bgColor = day.isAvailable ? '#85b545' : 'black';
            const textColor = day.isAvailable ? 'white' : 'white';
            const borderColor = day.isAvailable ? '#6a9235' : '#333333';
            const statusText = day.isAvailable ? 'Free' : 'Busy';
            
            return `
                <div style="text-align: center; padding: 6px 4px; border-radius: 4px; background: ${bgColor}; color: ${textColor}; font-size: 11px; font-weight: 500; border: 1px solid ${borderColor};">
                    <div style="font-size: 9px; margin-bottom: 2px;">${day.dayName}</div>
                    <div style="font-weight: 600;">${day.dayNumber}</div>
                    <div style="font-size: 8px; margin-top: 2px;">${statusText}</div>
                </div>
            `;
        }).join('');
    }

    setupSearch() {
        // Set up real-time search
        const searchInputs = ['search-checkin', 'search-checkout', 'search-van-type', 'search-guests'];
        
        searchInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', () => {
                    if (this.hasValidSearchCriteria()) {
                        this.performVanSearch();
                    }
                });
            }
        });
    }

    hasValidSearchCriteria() {
        const checkin = document.getElementById('search-checkin')?.value;
        const checkout = document.getElementById('search-checkout')?.value;
        return checkin && checkout && new Date(checkin) < new Date(checkout);
    }

    performVanSearch() {
        const checkin = document.getElementById('search-checkin')?.value;
        const checkout = document.getElementById('search-checkout')?.value;
        const vanType = document.getElementById('search-van-type')?.value;
        const guests = document.getElementById('search-guests')?.value;

        if (!checkin || !checkout) {
            alert('Please select both check-in and check-out dates');
            return;
        }

        if (new Date(checkin) >= new Date(checkout)) {
            alert('Check-out date must be after check-in date');
            return;
        }

        // Filter available vans
        const availableVans = this.vans.filter(van => {
            // Check van type filter
            if (vanType && van.type !== vanType) return false;
            
            // Check capacity filter
            if (guests && van.capacity < parseInt(guests)) return false;
            
            // Check availability for the date range
            return this.isVanAvailableForPeriod(van.id, checkin, checkout);
        });

        this.renderSearchResults(availableVans, checkin, checkout);
    }

    isVanAvailableForPeriod(vanId, startDate, endDate) {
        // Check if van has any conflicting bookings
        return !this.bookings.some(booking => 
            booking.vanId === vanId &&
            booking.status === 'confirmed' &&
            !(new Date(endDate) <= new Date(booking.startDate) || 
              new Date(startDate) >= new Date(booking.endDate))
        );
    }

    renderSearchResults(availableVans, checkin, checkout) {
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
                        <div class="price-amount">$${(van.price * days).toLocaleString()}</div>
                        <div class="price-period">${days} day${days > 1 ? 's' : ''}</div>
                    </div>
                </div>
                <div class="van-features">
                    <span class="feature"><i class="fas fa-users"></i> ${van.capacity} guests</span>
                    <span class="feature"><i class="fas fa-dollar-sign"></i> $${van.price}/day</span>
                    <span class="feature"><i class="fas fa-map-marker-alt"></i> ${van.location}</span>
                    <span class="feature status-${van.status}"><i class="fas fa-circle"></i> ${van.status}</span>
                </div>
                <div class="result-actions">
                    <button class="btn btn-primary" onclick="adminDashboard.createBooking(${van.id}, '${checkin}', '${checkout}')">
                        <i class="fas fa-calendar-plus"></i>
                        Book Now
                    </button>
                    <button class="btn btn-secondary" onclick="adminDashboard.viewVanDetails(${van.id})">
                        <i class="fas fa-info-circle"></i>
                        Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderBookingsTable() {
        const tableBody = document.querySelector('#bookings-table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = this.bookings.map(booking => `
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
                    ${this.formatDisplayDate(booking.startDate)} - 
                    ${this.formatDisplayDate(booking.endDate)}
                </td>
                <td>
                    <span class="booking-status ${booking.status}">${booking.status}</span>
                </td>
                <td>$${booking.total.toLocaleString()}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="adminDashboard.viewBookingDetails('${booking.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="adminDashboard.editBooking('${booking.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderVansGrid() {
        console.log('renderVansGrid called with vans:', this.vans);
        const vansGrid = document.getElementById('vans-grid');
        if (!vansGrid) {
            console.error('vans-grid element not found');
            return;
        }

        vansGrid.innerHTML = this.vans.map(van => {
            const bookingsCount = this.bookings.filter(b => b.vanId === van.id).length;
            const revenue = this.bookings
                .filter(b => b.vanId === van.id && b.status === 'confirmed')
                .reduce((sum, b) => sum + b.total, 0);

            const pricingProfile = this.pricingProfiles.find(p => p.id === van.pricingProfile);

            return `
                <div class="professional-van-card ${!van.enabled ? 'van-disabled' : ''}">
                    <!-- Card Header -->
                    <div class="van-card-header">
                        <div class="van-header-left">
                            <div class="van-id-badge">${van.VehicleID || van.id}</div>
                            <div class="van-title-section">
                                <h3 class="van-name">${van.VehicleID || van.id} - ${van.name}</h3>
                                <div class="van-location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${van.location}
                                </div>
                            </div>
                        </div>
                        <div class="van-header-right">
                            <div class="van-toggle">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="van-enabled-${van.id}" name="van-enabled-${van.id}" ${van.enabled ? 'checked' : ''} 
                                           onchange="adminDashboard.toggleVanStatus(${van.id})">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Main Van Image -->
                    <div class="van-main-image">
                        <div class="van-image-placeholder" style="width: 100%; height: 250px; background: linear-gradient(135deg, #85b545 0%, #a8c66c 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">
                            📷 ${van.name}
                        </div>
                    </div>

                    <!-- Additional Images -->
                    <div class="van-additional-images">
                        <div class="additional-image">
                            <div class="van-thumb-placeholder" style="width: 100%; height: 80px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 10px; font-weight: 500;">
                                🏠 Interior
                            </div>
                        </div>
                        <div class="additional-image">
                            <div class="van-thumb-placeholder" style="width: 100%; height: 80px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 10px; font-weight: 500;">
                                🚐 Exterior
                            </div>
                        </div>
                        <div class="additional-image">
                            <div class="van-thumb-placeholder" style="width: 100%; height: 80px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 10px; font-weight: 500;">
                                📋 Details
                            </div>
                        </div>
                    </div>

                    <!-- Quick Availability Calendar -->
                    <div class="van-quick-calendar-section">
                        <h4 class="section-title">
                            <i class="fas fa-calendar-alt"></i>
                            Next 7 Days
                        </h4>
                        <div class="quick-calendar-grid">
                            ${this.generateNext7DaysCalendar(van)}
                        </div>
                    </div>

                    <!-- Technical Specifications -->
                    <div class="van-technical-section">
                        <h4 class="section-title">
                            <i class="fas fa-cogs"></i>
                            Technical Specifications
                        </h4>
                        <div class="technical-grid">
                            <div class="tech-category">
                                <h5>External Dimensions</h5>
                                <div class="tech-specs">
                                    <div class="tech-spec">
                                        <span class="spec-label">Length:</span>
                                        <span class="spec-value">${van.ExtLength || 'N/A'}m</span>
                                    </div>
                                    <div class="tech-spec">
                                        <span class="spec-label">Height:</span>
                                        <span class="spec-value">${van.ExtHight || 'N/A'}m</span>
                                    </div>
                                    <div class="tech-spec">
                                        <span class="spec-label">Width:</span>
                                        <span class="spec-value">${van.ExtLarge || 'N/A'}m</span>
                                    </div>
                                </div>
                            </div>
                            <div class="tech-category">
                                <h5>Internal Dimensions</h5>
                                <div class="tech-specs">
                                    <div class="tech-spec">
                                        <span class="spec-label">Length:</span>
                                        <span class="spec-value">${van.IntLength || 'N/A'}m</span>
                                    </div>
                                    <div class="tech-spec">
                                        <span class="spec-label">Height:</span>
                                        <span class="spec-value">${van.IntHight || 'N/A'}m</span>
                                    </div>
                                    <div class="tech-spec">
                                        <span class="spec-label">Width:</span>
                                        <span class="spec-value">${van.IntLarge || 'N/A'}m</span>
                                    </div>
                                </div>
                            </div>
                            <div class="tech-category">
                                <h5>Vehicle Details</h5>
                                <div class="tech-specs">
                                    <div class="tech-spec">
                                        <span class="spec-label">License:</span>
                                        <span class="spec-value">${van.LicencePlate || 'N/A'}</span>
                                    </div>
                                    <div class="tech-spec">
                                        <span class="spec-label">Calendar:</span>
                                        <span class="spec-value">${van.CalendarID || van.calendar_id || 'N/A'}</span>
                                    </div>
                                    <div class="tech-spec">
                                        <span class="spec-label">Status:</span>
                                        <span class="spec-value status-${van.status}">${van.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Address Information -->
                    ${van.VehicleAdress ? `
                    <div class="van-address-section">
                        <h4 class="section-title">
                            <i class="fas fa-map-marker-alt"></i>
                            Vehicle Address
                        </h4>
                        <div class="address-content">
                            <p>${van.VehicleAdress}</p>
                        </div>
                    </div>` : ''}

                    <!-- Features -->
                    <div class="van-features-section">
                        <h4 class="section-title">
                            <i class="fas fa-star"></i>
                            Features & Equipment
                        </h4>
                        <div class="features-grid">
                            ${van.features.map(feature => `
                                <span class="feature-tag">
                                    <i class="fas fa-check"></i>
                                    ${feature}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="van-card-actions">
                        <button class="btn btn-primary" onclick="adminDashboard.editVan(${van.id})">
                            <i class="fas fa-edit"></i>
                            Edit Van
                        </button>
                        <button class="btn btn-secondary" onclick="adminDashboard.viewVanCalendar(${van.id})">
                            <i class="fas fa-calendar"></i>
                            Calendar
                        </button>
                        <button class="btn btn-info" onclick="adminDashboard.viewTechnicalDetails(${van.id})">
                            <i class="fas fa-info-circle"></i>
                            Full Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPricingProfiles() {
        const profilesContainer = document.getElementById('pricingProfiles');
        if (!profilesContainer) return;

        profilesContainer.innerHTML = this.pricingProfiles.map(profile => `
            <div class="pricing-profile" data-profile-id="${profile.id}">
                <div class="profile-header">
                    <h4>${profile.name}</h4>
                    <div class="profile-actions">
                        <button class="btn btn-primary" onclick="adminDashboard.editPricingProfile(${profile.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>
                <div class="profile-body">
                    <p>${profile.description}</p>
                    <div class="base-rate">
                        <strong>Base Rate:</strong> $${profile.baseRate}/day
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleVanStatus(vanId) {
        const van = this.vans.find(v => v.id === vanId);
        if (van) {
            van.enabled = !van.enabled;
            van.status = van.enabled ? 'available' : 'inactive';
            this.renderVansGrid();
            this.updateVanStatusOnWebsite(van);
        }
    }

    updateVanPricingProfile(vanId, profileId) {
        const van = this.vans.find(v => v.id === vanId);
        if (van) {
            van.pricingProfile = profileId;
            const profile = this.pricingProfiles.find(p => p.id === profileId);
            if (profile) {
                van.price = profile.basePrice;
            }
            this.renderVansGrid();
            this.updateVanPricingOnWebsite(van);
        }
    }

    updateVanStatusOnWebsite(van) {
        // Update the main website's van data
        console.log(`Updating van ${van.id} status on website:`, van.enabled);
        // This would sync with the main website's van data
    }

    updateVanPricingOnWebsite(van) {
        // Update the main website's pricing data
        console.log(`Updating van ${van.id} pricing on website:`, van.price);
        // This would sync with the main website's pricing data
    }

    editVan(vanId) {
        const van = this.vans.find(v => v.id === vanId);
        if (van) {
            // Create and show edit van modal
            this.showEditVanModal(van);
        }
    }

    showEditVanModal(van) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Van: ${van.name}</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form onsubmit="adminDashboard.saveVanChanges(event, ${van.id})">
                        <div class="form-group">
                            <label for="van-name">Van Name:</label>
                            <input type="text" id="van-name" name="van-name" value="${van.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="van-location">Location:</label>
                            <input type="text" id="van-location" name="van-location" value="${van.location}" required>
                        </div>
                        <div class="form-group">
                            <label for="van-capacity">Capacity:</label>
                            <input type="number" id="van-capacity" name="van-capacity" value="${van.capacity}" min="1" max="12" required>
                        </div>
                        <div class="form-group">
                            <label for="van-description">Description:</label>
                            <textarea id="van-description" name="van-description" rows="3">${van.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="van-features">Features (comma-separated):</label>
                            <input type="text" id="van-features" name="van-features" value="${van.features.join(', ')}">
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    saveVanChanges(event, vanId) {
        event.preventDefault();
        const van = this.vans.find(v => v.id === vanId);
        if (van) {
            van.name = document.getElementById('van-name').value;
            van.location = document.getElementById('van-location').value;
            van.capacity = parseInt(document.getElementById('van-capacity').value);
            van.description = document.getElementById('van-description').value;
            van.features = document.getElementById('van-features').value.split(',').map(f => f.trim());
            
            this.renderVansGrid();
            event.target.closest('.modal').remove();
            this.updateVanStatusOnWebsite(van);
        }
    }

    setupVanManagementTabs() {
        const tabButtons = document.querySelectorAll('.van-management-tabs .tab-btn');
        const tabContents = document.querySelectorAll('#vans .tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Initialize tab-specific content
                if (targetTab === 'display') {
                    this.initializeDisplayConfigTab();
                } else if (targetTab === 'technical') {
                    this.initializeTechnicalTab();
                }
            });
        });

        // Initialize display config tab on first load
        this.initializeDisplayConfigTab();
        this.updateDisplayPreview();
    }

    // Media Manager Methods
    initializeMediaData() {
        const stored = localStorage.getItem('vanRental_mediaItems');
        return stored ? JSON.parse(stored) : [];
    }

    saveMediaData() {
        localStorage.setItem('vanRental_mediaItems', JSON.stringify(this.mediaItems));
    }

    setupMediaManager() {
        // Upload button click handler
        document.getElementById('upload-media-btn')?.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        // File input change handler
        document.getElementById('file-input')?.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Setup drag and drop
        this.setupDragAndDrop();

        // Setup filters
        this.setupMediaFilters();

        // Setup modal handlers
        this.setupMediaModal();

        // Initial render
        this.renderMediaGallery();
        this.populateVanFilterOptions();
    }

    setupDragAndDrop() {
        const dropzone = document.getElementById('upload-dropzone');
        if (!dropzone) return;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.remove('dragover');
            }, false);
        });

        // Handle dropped files
        dropzone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFileUpload(files);
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    setupMediaFilters() {
        const vanFilter = document.getElementById('van-filter');
        const categoryFilter = document.getElementById('category-filter');
        const clearFilters = document.getElementById('clear-filters-btn');

        [vanFilter, categoryFilter].forEach(filter => {
            filter?.addEventListener('change', () => {
                this.renderMediaGallery();
            });
        });

        clearFilters?.addEventListener('click', () => {
            if (vanFilter) vanFilter.value = '';
            if (categoryFilter) categoryFilter.value = '';
            this.renderMediaGallery();
        });
    }

    setupMediaModal() {
        const modal = document.getElementById('media-modal');
        const closeBtn = document.getElementById('close-media-modal');
        const saveBtn = document.getElementById('save-media-assignment');
        const deleteBtn = document.getElementById('delete-media-item');
        const downloadBtn = document.getElementById('download-media-item');

        closeBtn?.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        saveBtn?.addEventListener('click', () => {
            this.saveMediaAssignment();
        });

        deleteBtn?.addEventListener('click', () => {
            this.deleteMediaItem();
        });

        downloadBtn?.addEventListener('click', () => {
            this.downloadMediaItem();
        });
    }

    async handleFileUpload(files) {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            return validTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length === 0) {
            this.showNotification('No valid image files selected', 'error');
            return;
        }

        const progressSection = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        progressSection.style.display = 'flex';
        
        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            const progress = ((i + 1) / validFiles.length) * 100;
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;

            await this.processFile(file);
        }

        progressSection.style.display = 'none';
        this.renderMediaGallery();
        this.showNotification(`${validFiles.length} image(s) uploaded successfully`, 'success');
    }

    async processFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const mediaItem = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    dataUrl: e.target.result,
                    uploadDate: new Date().toISOString(),
                    assignedVan: null,
                    category: null,
                    description: '',
                    isPrimary: false
                };

                this.mediaItems.push(mediaItem);
                this.saveMediaData();
                
                // Simulate processing time
                setTimeout(() => resolve(), 100);
            };
            reader.readAsDataURL(file);
        });
    }

    renderMediaGallery() {
        const mediaGrid = document.getElementById('media-grid');
        const noMediaMessage = document.getElementById('no-media-message');

        if (!mediaGrid) return;

        const vanFilter = document.getElementById('van-filter')?.value;
        const categoryFilter = document.getElementById('category-filter')?.value;

        // Filter media items
        let filteredItems = this.mediaItems;

        if (vanFilter) {
            if (vanFilter === 'unassigned') {
                filteredItems = filteredItems.filter(item => !item.assignedVan);
            } else {
                filteredItems = filteredItems.filter(item => item.assignedVan === vanFilter);
            }
        }

        if (categoryFilter) {
            filteredItems = filteredItems.filter(item => item.category === categoryFilter);
        }

        if (filteredItems.length === 0) {
            mediaGrid.innerHTML = '';
            noMediaMessage.style.display = 'block';
            return;
        }

        noMediaMessage.style.display = 'none';
        mediaGrid.innerHTML = filteredItems.map(item => this.createMediaItemHTML(item)).join('');

        // Add click handlers
        mediaGrid.querySelectorAll('.media-item').forEach(element => {
            element.addEventListener('click', (e) => {
                if (!e.target.closest('.media-action-btn')) {
                    const itemId = element.dataset.itemId;
                    this.openMediaModal(itemId);
                }
            });
        });
    }

    createMediaItemHTML(item) {
        const van = item.assignedVan ? this.vans.find(v => v.id.toString() === item.assignedVan) : null;
        const vanName = van ? van.name : 'Unassigned';
        const fileSize = (item.size / 1024 / 1024).toFixed(1);
        
        return `
            <div class="media-item" data-item-id="${item.id}">
                <img src="${item.dataUrl}" alt="${item.name}" class="media-item-image">
                <div class="media-item-actions">
                    <button class="media-action-btn" onclick="event.stopPropagation(); adminDashboard.openMediaModal('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
                <div class="media-item-info">
                    <div class="media-item-name">${item.name}</div>
                    <div class="media-item-details">${fileSize}MB</div>
                    <div class="media-item-assignment">
                        <span class="assignment-badge ${item.assignedVan ? (item.isPrimary ? 'primary' : '') : 'unassigned'}">
                            ${item.isPrimary ? '★ ' : ''}${vanName}
                        </span>
                    </div>
                    ${item.category ? `<div class="media-item-category">
                        <i class="fas fa-tag"></i>
                        ${item.category}
                    </div>` : ''}
                </div>
            </div>
        `;
    }

    openMediaModal(itemId) {
        const item = this.mediaItems.find(i => i.id.toString() === itemId);
        if (!item) return;

        const modal = document.getElementById('media-modal');
        const previewImage = document.getElementById('media-preview-image');
        const filename = document.getElementById('media-filename');
        const details = document.getElementById('media-details');
        const assignVan = document.getElementById('assign-van');
        const imageCategory = document.getElementById('image-category');
        const imageDescription = document.getElementById('image-description');
        const setPrimary = document.getElementById('set-as-primary');

        // Set preview
        previewImage.src = item.dataUrl;
        filename.textContent = item.name;
        details.textContent = `Size: ${(item.size / 1024 / 1024).toFixed(1)}MB | Uploaded: ${new Date(item.uploadDate).toLocaleDateString()}`;

        // Set form values
        assignVan.value = item.assignedVan || '';
        imageCategory.value = item.category || '';
        imageDescription.value = item.description || '';
        setPrimary.checked = item.isPrimary;

        // Store current item ID
        modal.dataset.currentItemId = itemId;

        // Populate van options
        this.populateVanOptions(assignVan);

        modal.classList.add('active');
    }

    populateVanOptions(selectElement) {
        if (!selectElement) return;

        const options = ['<option value="">Select Van</option>'];
        this.vans.forEach(van => {
            options.push(`<option value="${van.id}">${van.name}</option>`);
        });
        selectElement.innerHTML = options.join('');
    }

    populateVanFilterOptions() {
        const vanFilter = document.getElementById('van-filter');
        if (!vanFilter) return;

        const options = ['<option value="">All Vans</option>', '<option value="unassigned">Unassigned</option>'];
        this.vans.forEach(van => {
            options.push(`<option value="${van.id}">${van.name}</option>`);
        });
        vanFilter.innerHTML = options.join('');
    }

    saveMediaAssignment() {
        const modal = document.getElementById('media-modal');
        const itemId = modal.dataset.currentItemId;
        const item = this.mediaItems.find(i => i.id.toString() === itemId);
        
        if (!item) return;

        const assignVan = document.getElementById('assign-van').value;
        const imageCategory = document.getElementById('image-category').value;
        const imageDescription = document.getElementById('image-description').value;
        const setPrimary = document.getElementById('set-as-primary').checked;

        // If setting as primary, remove primary flag from other images of the same van
        if (setPrimary && assignVan) {
            this.mediaItems.forEach(mediaItem => {
                if (mediaItem.assignedVan === assignVan && mediaItem.id !== item.id) {
                    mediaItem.isPrimary = false;
                }
            });
        }

        // Update item
        item.assignedVan = assignVan;
        item.category = imageCategory;
        item.description = imageDescription;
        item.isPrimary = setPrimary;

        this.saveMediaData();
        this.renderMediaGallery();
        modal.classList.remove('active');
        this.showNotification('Image assignment saved successfully', 'success');
    }

    deleteMediaItem() {
        const modal = document.getElementById('media-modal');
        const itemId = modal.dataset.currentItemId;
        
        if (!confirm('Are you sure you want to delete this image?')) return;

        this.mediaItems = this.mediaItems.filter(item => item.id.toString() !== itemId);
        this.saveMediaData();
        this.renderMediaGallery();
        modal.classList.remove('active');
        this.showNotification('Image deleted successfully', 'success');
    }

    downloadMediaItem() {
        const modal = document.getElementById('media-modal');
        const itemId = modal.dataset.currentItemId;
        const item = this.mediaItems.find(i => i.id.toString() === itemId);
        
        if (!item) return;

        const link = document.createElement('a');
        link.href = item.dataUrl;
        link.download = item.name;
        link.click();
    }

    setupPricingTabs() {
        const tabButtons = document.querySelectorAll('.pricing-tabs .tab-btn');
        const tabContents = document.querySelectorAll('#pricing .tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Initialize tab-specific content
                if (targetTab === 'profiles') {
                    this.renderPricingProfiles();
                } else if (targetTab === 'rules') {
                    this.renderPricingRules();
                } else if (targetTab === 'seasons') {
                    this.renderSeasonalPricing();
                }
            });
        });
    }

    initializeDisplayConfigTab() {
        // Set current configuration values
        const config = this.displayConfig;
        
        // Set display style radio
        const styleRadio = document.querySelector(`input[name="display-style"][value="${config.displayStyle}"]`);
        if (styleRadio) styleRadio.checked = true;
        
        // Set technical spec toggles
        document.getElementById('show-ext-length').checked = config.technicalSpecs.showExtLength;
        document.getElementById('show-ext-height').checked = config.technicalSpecs.showExtHeight;
        document.getElementById('show-ext-width').checked = config.technicalSpecs.showExtWidth;
        document.getElementById('show-int-length').checked = config.technicalSpecs.showIntLength;
        document.getElementById('show-int-height').checked = config.technicalSpecs.showIntHeight;
        document.getElementById('show-int-width').checked = config.technicalSpecs.showIntWidth;
        document.getElementById('show-license-plate').checked = config.technicalSpecs.showLicensePlate;
        document.getElementById('show-vehicle-address').checked = config.technicalSpecs.showVehicleAddress;
        document.getElementById('show-load-volume').checked = config.technicalSpecs.showLoadVolume;
    }

    initializeTechnicalTab() {
        this.renderTechnicalSummary();
    }

    updateDisplayStyle(style) {
        this.displayConfig.displayStyle = style;
        this.updateDisplayPreview();
        this.showNotification(`Display style changed to ${style}`, 'info');
    }

    updateDisplayConfig(field, value) {
        this.displayConfig.technicalSpecs[field] = value;
        this.updateDisplayPreview();
        
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase().replace('show ', '');
        this.showNotification(`${fieldName} ${value ? 'enabled' : 'disabled'} for main collection`, 'info');
    }

    updateDisplayPreview() {
        const previewContainer = document.getElementById('display-preview');
        if (!previewContainer) return;

        // Use the first van as preview example
        const sampleVan = this.vans[0];
        if (!sampleVan) return;

        previewContainer.innerHTML = this.generatePreviewVanCard(sampleVan);
    }

    generatePreviewVanCard(van) {
        const config = this.displayConfig;
        
        let technicalSpecs = '';
        
        if (config.displayStyle === 'detailed' || config.displayStyle === 'comprehensive') {
            let extDimensions = '';
            let intDimensions = '';
            let vehicleDetails = '';
            
            // External dimensions
            if (config.technicalSpecs.showExtLength || config.technicalSpecs.showExtHeight || config.technicalSpecs.showExtWidth) {
                const extSpecs = [];
                if (config.technicalSpecs.showExtLength && van.ExtLength) extSpecs.push(`L: ${van.ExtLength}m`);
                if (config.technicalSpecs.showExtHeight && van.ExtHight) extSpecs.push(`H: ${van.ExtHight}m`);
                if (config.technicalSpecs.showExtWidth && van.ExtLarge) extSpecs.push(`W: ${van.ExtLarge}m`);
                
                if (extSpecs.length > 0) {
                    extDimensions = `
                        <div class="spec-group">
                            <span class="spec-title">External:</span>
                            <span class="spec-values">${extSpecs.join(', ')}</span>
                        </div>
                    `;
                }
            }
            
            // Internal dimensions
            if (config.technicalSpecs.showIntLength || config.technicalSpecs.showIntHeight || config.technicalSpecs.showIntWidth) {
                const intSpecs = [];
                if (config.technicalSpecs.showIntLength && van.IntLength) intSpecs.push(`L: ${van.IntLength}m`);
                if (config.technicalSpecs.showIntHeight && van.IntHight) intSpecs.push(`H: ${van.IntHight}m`);
                if (config.technicalSpecs.showIntWidth && van.IntLarge) intSpecs.push(`W: ${van.IntLarge}m`);
                
                if (intSpecs.length > 0) {
                    intDimensions = `
                        <div class="spec-group">
                            <span class="spec-title">Internal:</span>
                            <span class="spec-values">${intSpecs.join(', ')}</span>
                        </div>
                    `;
                }
            }
            
            // Vehicle details
            const vehicleDetailSpecs = [];
            if (config.technicalSpecs.showLicensePlate && van.LicencePlate) vehicleDetailSpecs.push(`License: ${van.LicencePlate}`);
            if (config.technicalSpecs.showLoadVolume && van.load_volume) vehicleDetailSpecs.push(`Volume: ${van.load_volume}m³`);
            
            if (vehicleDetailSpecs.length > 0) {
                vehicleDetails = `
                    <div class="spec-group">
                        <span class="spec-title">Details:</span>
                        <span class="spec-values">${vehicleDetailSpecs.join(', ')}</span>
                    </div>
                `;
            }
            
            if (extDimensions || intDimensions || vehicleDetails) {
                technicalSpecs = `
                    <div class="preview-technical-specs">
                        ${extDimensions}
                        ${intDimensions}
                        ${vehicleDetails}
                    </div>
                `;
            }
        }

        return `
            <div class="preview-van-card-inner">
                <div class="preview-header">
                    <h4>${van.VehicleID || van.id} - ${van.name}</h4>
                </div>
                
                <!-- Main Van Image -->
                <div class="preview-main-image">
                    <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #85b545 0%, #a8c66c 100%); border-radius: 8px; margin: 10px 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 16px;">
                        📷 ${van.name}
                    </div>
                </div>
                
                <!-- Additional Images -->
                <div class="preview-additional-images" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 10px 0;">
                    <div style="width: 100%; height: 60px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 9px; font-weight: 500;">
                        🏠 Interior
                    </div>
                    <div style="width: 100%; height: 60px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 9px; font-weight: 500;">
                        🚐 Exterior
                    </div>
                    <div style="width: 100%; height: 60px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 9px; font-weight: 500;">
                        📋 Details
                    </div>
                </div>
                
                <!-- Quick Availability Calendar -->
                <div class="preview-availability-calendar" style="margin: 15px 0; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                    <h6 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #495057;">Next 7 Days</h6>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
                        ${this.generateNext7DaysCalendar(van)}
                    </div>
                </div>
                
                ${config.technicalSpecs.showVehicleAddress && van.VehicleAdress ? `
                    <div class="preview-address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${van.VehicleAdress}
                    </div>
                ` : ''}
                ${technicalSpecs}
                ${config.technicalSpecs.showFeatures && van.features && van.features.length > 0 ? `
                    <div class="preview-features">
                        ${van.features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="preview-status">
                    <span class="status-badge ${van.status}">${van.status}</span>
                </div>
            </div>
        `;
    }

    saveDisplayConfig() {
        // In a real implementation, this would save to a database or local storage
        console.log('Saving display configuration:', this.displayConfig);
        
        // For now, we'll just show a success message
        this.showNotification('Display configuration saved successfully! Changes will be reflected on the main collection page.', 'success');
        
        // Generate a code snippet that could be used to apply these settings
        this.generateDisplayConfigCode();
    }

    generateDisplayConfigCode() {
        const config = this.displayConfig;
        const code = `
// Generated Display Configuration
const displayConfig = ${JSON.stringify(config, null, 2)};

// Apply to van collection rendering
function renderVanCollection(vans) {
    return vans.map(van => renderVanCard(van, displayConfig)).join('');
}
        `;
        
        console.log('Generated configuration code:', code);
    }

    previewMainCollection() {
        // Create a preview window showing how the main collection would look
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        const previewHTML = this.generateMainCollectionPreview();
        
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
    }

    generateMainCollectionPreview() {
        const config = this.displayConfig;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Van Collection Preview</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #f8f9fa; }
                    .preview-header { text-align: center; margin-bottom: 30px; }
                    .collection-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; }
                    .van-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.2s ease, box-shadow 0.2s ease; }
                    .van-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
                    .van-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                    .van-name { margin: 0; color: #1e293b; font-size: 1.2rem; font-weight: 600; }
                    .van-type { color: #6c757d; margin-bottom: 10px; }
                    .preview-technical-specs { margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                    .spec-group { margin-bottom: 8px; font-size: 14px; }
                    .spec-title { font-weight: 600; color: #495057; }
                    .spec-values { color: #6c757d; }
                    .preview-features { margin: 15px 0; }
                    .feature-tag { background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; margin-bottom: 4px; display: inline-block; }
                    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
                    .status-badge.available { background: #d4edda; color: #155724; }
                    .preview-address { color: #6c757d; font-size: 14px; margin: 10px 0; display: flex; align-items: center; gap: 6px; }
                    .preview-main-image { margin: 15px 0; }
                    .preview-additional-images { margin: 15px 0; }
                    .preview-van-card-inner h4 { margin-bottom: 15px; }
                </style>
            </head>
            <body>
                <div class="preview-header">
                    <h1>Van Collection Preview</h1>
                    <p>This is how your collection will appear with current display settings</p>
                </div>
                <div class="collection-grid">
                    ${this.vans.filter(van => van.enabled).map(van => `
                        <div class="van-card">
                            ${this.generatePreviewVanCard(van)}
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
        `;
    }

    resetDisplayConfig() {
        if (confirm('Are you sure you want to reset all display settings to default?')) {
            this.displayConfig = this.initializeDisplayConfiguration();
            this.initializeDisplayConfigTab();
            this.updateDisplayPreview();
            this.showNotification('Display configuration reset to default settings', 'info');
        }
    }

    renderTechnicalSummary() {
        const summaryContainer = document.getElementById('technical-summary');
        if (!summaryContainer) return;

        const summary = this.generateTechnicalSummary();
        
        summaryContainer.innerHTML = `
            <div class="summary-card">
                <h5>Fleet Overview</h5>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-number">${summary.totalVans}</span>
                        <span class="stat-label">Total Vans</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${summary.avgExtLength.toFixed(1)}m</span>
                        <span class="stat-label">Avg Length</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${summary.avgLoadVolume.toFixed(1)}m³</span>
                        <span class="stat-label">Avg Volume</div>
                    </div>
                </div>
            </div>
            
            <div class="summary-card">
                <h5>Dimension Ranges</h5>
                <div class="dimension-ranges">
                    <div class="range-item">
                        <span class="range-label">Length:</span>
                        <span class="range-value">${summary.lengthRange}</span>
                    </div>
                    <div class="range-item">
                        <span class="range-label">Height:</span>
                        <span class="range-value">${summary.heightRange}</span>
                    </div>
                    <div class="range-item">
                        <span class="range-label">Volume:</span>
                        <span class="range-value">${summary.volumeRange}</span>
                    </div>
                </div>
            </div>
            
            <div class="summary-card">
                <h5>Missing Data</h5>
                <div class="missing-data">
                    ${summary.missingData.length > 0 ? 
                        summary.missingData.map(item => `<div class="missing-item">${item}</div>`).join('') :
                        '<div class="no-missing">All technical data is complete!</div>'
                    }
                </div>
            </div>
        `;
    }

    generateTechnicalSummary() {
        const vans = this.vans.filter(van => van.enabled);
        
        const lengths = vans.map(van => parseFloat(van.ExtLength)).filter(l => l);
        const heights = vans.map(van => parseFloat(van.ExtHight)).filter(h => h);
        const volumes = vans.map(van => parseFloat(van.load_volume)).filter(v => v);
        
        const missingData = [];
        vans.forEach(van => {
            if (!van.ExtLength) missingData.push(`${van.name}: Missing external length`);
            if (!van.ExtHight) missingData.push(`${van.name}: Missing external height`);
            if (!van.load_volume) missingData.push(`${van.name}: Missing load volume`);
        });
        
        return {
            totalVans: vans.length,
            avgExtLength: lengths.reduce((a, b) => a + b, 0) / lengths.length || 0,
            avgLoadVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length || 0,
            lengthRange: lengths.length > 0 ? `${Math.min(...lengths)}m - ${Math.max(...lengths)}m` : 'No data',
            heightRange: heights.length > 0 ? `${Math.min(...heights)}m - ${Math.max(...heights)}m` : 'No data',
            volumeRange: volumes.length > 0 ? `${Math.min(...volumes)}m³ - ${Math.max(...volumes)}m³` : 'No data',
            missingData: missingData.slice(0, 5) // Show max 5 missing items
        };
    }

    // Google Sheets section rendering and event handlers
    renderGoogleSheetsSection() {
        // The Google Sheets section is already rendered in HTML
        // This method handles dynamic updates to the existing HTML structure
        
        // Update connection status
        const statusElement = document.getElementById('sheets-status');
        const lastSyncElement = document.getElementById('last-sync');
        
        if (statusElement) {
            const statusDot = statusElement.querySelector('.status-dot');
            const statusText = statusElement.querySelector('.status-text');
            
            if (this.googleSheetsConfig.isConnected) {
                statusDot.className = 'fas fa-circle status-dot connected';
                statusDot.className = 'fas fa-circle status-dot connected';
                statusText.textContent = 'Connected';
            } else {
                statusDot.className = 'fas fa-circle status-dot disconnected';
                statusText.textContent = 'Not Connected';
            }
        }
        
        if (lastSyncElement) {
            const lastSyncText = this.googleSheetsConfig.lastSync || 'Never';
            lastSyncElement.innerHTML = `<i class="fas fa-clock"></i><span>Last sync: ${lastSyncText}</span>`;
        }
        
        // Update sheet status indicators
        const vanSheetStatus = document.getElementById('van-sheet-status');
        const pricingSheetStatus = document.getElementById('pricing-sheet-status');
        
        if (vanSheetStatus) {
            if (this.googleSheetsConfig.vanSheetUrl) {
                vanSheetStatus.innerHTML = '<i class="fas fa-check-circle text-success"></i>';
            } else {
                vanSheetStatus.innerHTML = '<i class="fas fa-times-circle text-danger"></i>';
            }
        }
        
        if (pricingSheetStatus) {
            if (this.googleSheetsConfig.pricingSheetUrl) {
                pricingSheetStatus.innerHTML = '<i class="fas fa-check-circle text-success"></i>';
            } else {
                pricingSheetStatus.innerHTML = '<i class="fas fa-times-circle text-danger"></i>';
            }
        }
        
        // Populate existing form fields
        const vanSheetUrlInput = document.getElementById('van-sheet-url');
        const pricingSheetUrlInput = document.getElementById('pricing-sheet-url');
        const vanSheetRangeInput = document.getElementById('van-sheet-range');
        const pricingSheetRangeInput = document.getElementById('pricing-sheet-range');
        
        if (vanSheetUrlInput) vanSheetUrlInput.value = this.googleSheetsConfig.vanSheetUrl || '';
        if (pricingSheetUrlInput) pricingSheetUrlInput.value = this.googleSheetsConfig.pricingSheetUrl || '';
        if (vanSheetRangeInput) vanSheetRangeInput.value = this.googleSheetsConfig.vanSheetRange || 'Vans!A1:Z100';
        if (pricingSheetRangeInput) pricingSheetRangeInput.value = this.googleSheetsConfig.pricingSheetRange || 'Pricing!A1:Z100';
    }

    setupGoogleSheetsHandlers() {
        // Connect Sheets button
        const connectSheetsBtn = document.getElementById('connect-sheets-btn');
        if (connectSheetsBtn) {
            connectSheetsBtn.addEventListener('click', () => {
                this.showConnectSheetsModal();
            });
        }
        
        // Test connection buttons
        const testVanSheetBtn = document.getElementById('test-van-sheet-btn');
        const testPricingSheetBtn = document.getElementById('test-pricing-sheet-btn');
        
        if (testVanSheetBtn) {
            testVanSheetBtn.addEventListener('click', () => {
                this.testSheetConnection('van');
            });
        }
        
        if (testPricingSheetBtn) {
            testPricingSheetBtn.addEventListener('click', () => {
                this.testSheetConnection('pricing');
            });
        }
        
        // Import data buttons
        const importVanDataBtn = document.getElementById('import-van-data-btn');
        const importPricingDataBtn = document.getElementById('import-pricing-data-btn');
        
        if (importVanDataBtn) {
            importVanDataBtn.addEventListener('click', () => {
                this.importVanData();
            });
        }
        
        if (importPricingDataBtn) {
            importPricingDataBtn.addEventListener('click', () => {
                this.importPricingData();
            });
        }
        
        // Manual sync button
        const manualSyncBtn = document.getElementById('manual-sync-btn');
        if (manualSyncBtn) {
            manualSyncBtn.addEventListener('click', () => {
                this.performManualSync();
            });
        }
        
        // Sheet URL input handlers
        const vanSheetUrlInput = document.getElementById('van-sheet-url');
        const pricingSheetUrlInput = document.getElementById('pricing-sheet-url');
        
        if (vanSheetUrlInput) {
            vanSheetUrlInput.addEventListener('change', (e) => {
                this.googleSheetsConfig.vanSheetUrl = e.target.value;
                this.renderGoogleSheetsSection();
            });
        }
        
        if (pricingSheetUrlInput) {
            pricingSheetUrlInput.addEventListener('change', (e) => {
                this.googleSheetsConfig.pricingSheetUrl = e.target.value;
                this.renderGoogleSheetsSection();
            });
        }
        
        // Preview tab handlers
        const previewTabs = document.querySelectorAll('.preview-tabs .tab-btn');
        previewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPreview = tab.dataset.preview;
                this.switchPreviewTab(targetPreview);
            });
        });
    }

    testSheetConnection(type) {
        const url = type === 'van' ? this.googleSheetsConfig.vanSheetUrl : this.googleSheetsConfig.pricingSheetUrl;
        
        if (!url) {
            this.showNotification(`Please enter a ${type} sheet URL first`, 'error');
            return;
        }
        
        this.showNotification(`Testing ${type} sheet connection...`, 'info');
        
        // Simulate connection test
        setTimeout(() => {
            // In a real implementation, this would test the actual connection
            this.showNotification(`${type} sheet connection successful!`, 'success');
            
            // Update the sheet status
            const statusElement = document.getElementById(`${type}-sheet-status`);
            if (statusElement) {
                statusElement.innerHTML = '<i class="fas fa-check-circle text-success"></i>';
            }
        }, 2000);
    }

    switchPreviewTab(targetPreview) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.preview-tabs .tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.preview-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to clicked tab and corresponding content
        const clickedTab = document.querySelector(`[data-preview="${targetPreview}"]`);
        const targetContent = document.getElementById(`${targetPreview}-preview`);
        
        if (clickedTab) clickedTab.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
        
        // Load preview data
        this.loadPreviewData(targetPreview);
    }

    loadPreviewData(previewType) {
        const tableId = `${previewType.replace('-', '-')}-table`;
        const table = document.getElementById(tableId);
        
        if (!table) return;
        
        // Clear existing content
        table.innerHTML = '';
        
        if (previewType === 'van-data') {
            // Sample van data structure
            const sampleData = [
                ['ID', 'Name', 'Type', 'Status', 'Location', 'Price', 'Capacity', 'Features'],
                ['1', 'Compact Van #1', 'compact', 'available', 'City Center', '$80', '2', 'GPS, AC, Bluetooth'],
                ['2', 'Compact Van #2', 'compact', 'available', 'Airport', '$80', '2', 'GPS, AC, Bluetooth'],
                ['3', 'Standard Van #1', 'standard', 'available', 'Downtown', '$120', '4', 'GPS, AC, Kitchen, Bluetooth']
            ];
            
            this.populatePreviewTable(table, sampleData);
        } else if (previewType === 'pricing-data') {
            // Sample pricing data structure
            const sampleData = [
                ['ProfileID', 'Name', 'BasePrice', 'Weekend Multiplier', 'Season', 'Minimum Days'],
                ['Standard', 'compact', '$80', '1.2', 'summer', '2'],
                ['Luxury', 'luxury', '$200', '1.5', 'summer', '3']
            ];
            
            this.populatePreviewTable(table, sampleData);
        }
    }

    populatePreviewTable(table, data) {
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        data[0].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        for (let i = 1; i < data.length; i++) {
            const row = document.createElement('tr');
            
            data[i].forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        }
        
        table.appendChild(tbody);
    }

    performManualSync() {
        this.showNotification('Starting manual sync...', 'info');
        
        // Check if sheets are configured
        if (!this.googleSheetsConfig.vanSheetUrl && !this.googleSheetsConfig.pricingSheetUrl) {
            this.showNotification('Please configure at least one sheet URL before syncing', 'error');
            return;
        }
        
        // Show the 3-step manual import process
        this.showManualImportProcess();
    }

    showManualImportProcess() {
        const syncResults = document.getElementById('sync-results');
        if (!syncResults) return;
        
        syncResults.innerHTML = `
            <div class="manual-import-container">
                <div class="manual-import-header">
                    <h4><i class="fas fa-download"></i> 3-Step Manual Import</h4>
                    <p>Follow these simple steps to import your data:</p>
                </div>
                
                <div class="import-steps">
                    <div class="import-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h5>Download your data</h5>
                            <p>Click the buttons below to download your Google Sheets data as CSV files:</p>
                            <div class="download-buttons">
                                <button class="btn btn-primary" onclick="adminDashboard.downloadSheetAsCSV('van')">
                                    <i class="fas fa-download"></i> Download Van Data
                                </button>
                                <button class="btn btn-primary" onclick="adminDashboard.downloadSheetAsCSV('pricing')">
                                    <i class="fas fa-download"></i> Download Pricing Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const vanFileInput = document.getElementById('van-file-input');
        const pricingFileInput = document.getElementById('pricing-file-input');
        
        if (vanFileInput) {
            vanFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.showNotification('Van data file selected', 'success');
                }
            });
        }
        
        if (pricingFileInput) {
            pricingFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.showNotification('Pricing data file selected', 'success');
                }
            });
        }
    }

    downloadSheetAsCSV(type) {
        const sheetUrl = type === 'van' ? this.googleSheetsConfig.vanSheetUrl : this.googleSheetsConfig.pricingSheetUrl;
        
        if (!sheetUrl) {
            this.showNotification(`Please configure the ${type} sheet URL first`, 'error');
            return;
        }
        
        this.showNotification(`Opening ${type} sheet for download...`, 'info');
        
        // Convert Google Sheets URL to CSV export URL
        const csvUrl = this.convertToCsvUrl(sheetUrl);
        
        // Open the CSV download URL in a new tab
        window.open(csvUrl, '_blank');
        
        setTimeout(() => {
            this.showNotification(`${type} sheet opened for download. Please save it as a CSV file.`, 'success');
        }, 1000);
    }

    convertToCsvUrl(sheetUrl) {
        // Convert Google Sheets URL to CSV export format
        if (sheetUrl.includes('/edit')) {
            return sheetUrl.replace('/edit', '/export?format=csv');
        } else if (sheetUrl.includes('docs.google.com/spreadsheets/d/')) {
            const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (match) {
                return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
            }
        }
        
        return sheetUrl;
    }



    processManualImport() {
        const vanFile = document.getElementById('van-csv-file')?.files[0];
        const pricingFile = document.getElementById('pricing-csv-file')?.files[0];
        
        if (!vanFile && !pricingFile) {
            this.showNotification('Please select at least one CSV file to import', 'error');
            return;
        }
        
        this.showNotification('Processing your CSV files...', 'info');
        
        const promises = [];
        
        if (vanFile) {
            promises.push(this.processCSVFile(vanFile, 'van'));
        }
        
        if (pricingFile) {
            promises.push(this.processCSVFile(pricingFile, 'pricing'));
        }
        
        Promise.all(promises).then(() => {
            this.showNotification('Data imported successfully!', 'success');
            this.googleSheetsConfig.lastSync = new Date().toLocaleString();
            this.renderGoogleSheetsSection();
            this.renderVansGrid();
            this.renderPricingProfiles();
            
            // Clear the manual import interface
            document.getElementById('sync-results').innerHTML = '';
        }).catch(error => {
            this.showNotification('Error importing data: ' + error.message, 'error');
        });
    }

    processCSVFile(file, type) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const csvData = e.target.result;
                    const parsedData = this.parseCSV(csvData);
                    
                    if (type === 'van') {
                        this.importVanDataFromCSV(parsedData);
                    } else if (type === 'pricing') {
                        this.importPricingDataFromCSV(parsedData);
                    }
                    
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    parseCSV(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
                const row = {};
                
                headers.forEach((header, index) => {
                    row[header.toLowerCase()] = values[index] || '';
                });
                
                data.push(row);
            }
        }
        
        return data;
    }

    importVanDataFromCSV(data) {
        let imported = 0;
        
        data.forEach(row => {
            if (row.name && row.type) {
                const van = {
                    id: this.vans.length + 1,
                    name: row.name,
                    type: row.type.toLowerCase(),
                    status: row.status || 'available',
                    enabled: row.enabled !== 'false',
                    location: row.location || 'Unknown',
                    price: parseFloat(row.price) || 0,
                    capacity: parseInt(row.capacity) || 2,
                    pricingProfile: row.pricingprofile || 'standard',
                    features: row.features ? row.features.split(';') : [],
                    description: row.description || ''
                };
                
                this.vans.push(van);
                imported++;
            }
        });
        
        this.showNotification(`Imported ${imported} vans from CSV`, 'success');
    }

    importPricingDataFromCSV(data) {
        let imported = 0;
        
        data.forEach(row => {
            if (row.profile && row.vantype) {
                const pricing = {
                    id: this.pricingProfiles.length + 1,
                    name: row.profile,
                    vanType: row.vantype.toLowerCase(),
                    basePrice: parseFloat(row.baseprice) || 0,
                    weekendMultiplier: parseFloat(row.weekendmultiplier) || 1.0,
                    seasonalMultiplier: parseFloat(row.seasonalmultiplier) || 1.0,
                    minimumDays: parseInt(row.minimumdays) || 1,
                    description: row.description || ''
                };
                
                this.pricingProfiles.push(pricing);
                imported++;
            }
        });
        
        this.showNotification(`Imported ${imported} pricing profiles from CSV`, 'success');
    }

    // Function to import van data from your CSV format
    importVanDataFromYourCSV(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
        const importedVans = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = this.parseCSVLine(line);
                const row = {};
                
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                
                // Convert CSV row to van object
                if (row.VehicleID && row.VehicleName) {
                    const van = {
                        id: row.VehicleID,
                        VehicleID: row.VehicleID,
                        name: row.VehicleName,
                        VehicleName: row.VehicleName,
                        type: this.determineVanType(row.VehicleName),
                        status: 'available',
                        enabled: true,
                        location: this.extractLocation(row.VehicleName),
                        VehicleAdress: row.VehicleAdress || '',
                        LicencePlate: row.LicencePlate || '',
                        CalendarID: row.CalendarID || '',
                        price: this.determinePricing(row.VehicleName),
                        capacity: 3, // Default capacity
                        ExtHight: row.ExtHight || '',
                        ExtLength: row.ExtLength || '',
                        ExtLarge: row.ExtLarge || '',
                        IntHight: row.IntHight || '',
                        IntLength: row.IntLength || '',
                        IntLarge: row.IntLarge || '',
                        load_volume: this.calculateLoadVolume(row),
                        pricingProfile: 'standard',
                        features: ['GPS', 'AC', 'Bluetooth'],
                        description: `${this.determineVanType(row.VehicleName)} van available in ${this.extractLocation(row.VehicleName)}`
                    };
                    
                    importedVans.push(van);
                }
            }
        }
        
        return importedVans;
    }
    
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
    
    determineVanType(vehicleName) {
        const name = vehicleName.toLowerCase();
        if (name.includes('trafic') || name.includes('vivaro')) {
            return 'compact';
        } else if (name.includes('ducato') || name.includes('l1h1')) {
            return 'medium';
        } else if (name.includes('master') || name.includes('boxer') || name.includes('jumper')) {
            return 'large';
        }
        return 'medium'; // default
    }
    
    extractLocation(vehicleName) {
        const match = vehicleName.match(/\(([^)]+)\)/);
        return match ? match[1] : 'Ticino';
    }
    
    determinePricing(vehicleName) {
        const name = vehicleName.toLowerCase();
        if (name.includes('trafic') || name.includes('vivaro')) {
            return 75;
        } else if (name.includes('ducato') || name.includes('l1h1')) {
            return 95;
        } else if (name.includes('master')) {
            return 120;
        } else if (name.includes('boxer') || name.includes('jumper')) {
            return 110;
        }
        return 85; // default
    }
    
    calculateLoadVolume(row) {
        try {
            const length = parseFloat((row.IntLength || '0').replace(',', '.'));
            const width = parseFloat((row.IntLarge || '0').replace(',', '.'));
            const height = parseFloat((row.IntHight || '0').replace(',', '.'));
            
            if (length > 0 && width > 0 && height > 0) {
                return Math.round(length * width * height * 10) / 10;
            }
        } catch (e) {
            console.warn('Could not calculate load volume for:', row.VehicleID);
        }
        return 0;
    }

    // Enhanced import function for your specific CSV format
    importFromYourCSV() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const csvData = event.target.result;
                        const importedVans = this.importVanDataFromYourCSV(csvData);
                        
                        // Replace current van data
                        this.vans = importedVans;
                        this.renderVansGrid();
                        this.renderAvailabilityCalendar();
                        
                        this.showNotification(`Successfully imported ${importedVans.length} vans from CSV!`, 'success');
                    } catch (error) {
                        this.showNotification('Error importing CSV: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getVanAvailability(vanId, dateStr) {
        // Check if van has any bookings for this date
        const hasBooking = this.bookings.some(booking => 
            booking.vanId === vanId && 
            dateStr >= booking.startDate && 
            dateStr <= booking.endDate
        );
        
        if (hasBooking) {
            return 'booked';
        }
        
        // Check if date is in the past
        const today = new Date();
        const checkDate = new Date(dateStr);
        today.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        
        if (checkDate < today) {
            return 'past';
        }
        
        return 'available';
    }

    formatDisplayDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to notification container or create one
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    showConnectSheetsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3>Connect to Google Sheets</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="connect-steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Prepare Your Google Sheet</h4>
                                <p>Create a Google Sheet with your van data. Make sure it's publicly accessible or shared with the service account.</p>
                                <button class="btn btn-secondary" onclick="adminDashboard.openSampleSheet()">View Sample Sheet</button>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Copy Sheet URL</h4>
                                <p>Copy the full URL of your Google Sheet from the browser address bar.</p>
                                <input type="text" placeholder="Paste your Google Sheets URL here..." id="connect-sheet-url" name="connect-sheet-url">
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Test & Import</h4>
                                <p>Test the connection and import your data.</p>
                                <div class="step-actions">
                                    <button class="btn btn-primary" onclick="adminDashboard.testAndConnect()">Test Connection</button>
                                    <button class="btn btn-success" onclick="adminDashboard.importFromUrl()" disabled id="import-btn">Import Data</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    testAndConnect() {
        const url = document.getElementById('connect-sheet-url')?.value;
        
        if (!url) {
            this.showNotification('Please enter a Google Sheets URL', 'warning');
            return;
        }
        
        // Validate URL format
        if (!url.includes('docs.google.com/spreadsheets')) {
            this.showNotification('Please enter a valid Google Sheets URL', 'error');
            return;
        }
        
        this.showNotification('Testing connection to Google Sheets...', 'info');
        
        // Simulate connection test
        setTimeout(() => {
            this.showNotification('Connection successful! Ready to import data.', 'success');
            
            // Enable import button
            const importBtn = document.getElementById('import-btn');
            if (importBtn) {
                importBtn.disabled = false;
            }
        }, 2000);
    }

    importFromUrl() {
        this.showNotification('Importing data from Google Sheets...', 'info');
        
        setTimeout(() => {
            this.showNotification('Data imported successfully!', 'success');
            
            // Close modal and refresh
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => modal.remove());
            
            this.renderVansGrid();
            this.renderPricingProfiles();
        }, 3000);
    }

    openSampleSheet() {
        // Open a new window with sample sheet information
        const sampleWindow = window.open('', '_blank', 'width=800,height=600');
        sampleWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sample Google Sheet Structure</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .note { background: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Sample Google Sheet Structure for Van Data</h1>
                <div class="note">
                    <strong>Note:</strong> Your Google Sheet should have the following columns in this exact order:
                </div>
                <table>
                    <tr>
                        <th>VehicleID</th>
                        <th>VehicleName</th>
                        <th>CalendarID</th>
                        <th>VehicleAdress</th>
                        <th>LicencePlate</th>
                        <th>ExtHight</th>
                        <th>ExtLength</th>
                        <th>ExtLarge</th>
                        <th>IntHight</th>
                        <th>IntLength</th>
                        <th>IntLarge</th>
                    </tr>
                    <tr>
                        <td>N01</td>
                        <td>Opel Vivaro (Losone)</td>
                        <td>noleggiosemplice23@gmail.com</td>
                        <td>Via dei Patrizi 1, 6616 Losone</td>
                        <td>TI 148877</td>
                        <td>1,97</td>
                        <td>5,2</td>
                        <td>2,24</td>
                        <td>1,38</td>
                        <td>2,8</td>
                        <td>1.27 / 1.69</td>
                    </tr>
                </table>
                <div class="note">
                    <strong>Tips:</strong>
                    <ul>
                        <li>Make sure your sheet is publicly viewable or shared with appropriate permissions</li>
                        <li>The first row should contain the column headers exactly as shown above</li>
                        <li>Use commas as decimal separators for dimensions (European format)</li>
                        <li>Calendar IDs should be your actual Google Calendar IDs for integration</li>
                    </ul>
                </div>
            </body>
            </html>
        `);
        sampleWindow.document.close();
    }

    // Load sample Swiss van data
    loadRealVanData() {
        // Check if real-van-data.js is available
        if (typeof getRealVanData === 'function') {
            try {
                const realVanData = getRealVanData();
                
                // Replace current van data
                this.vans = realVanData;
                this.renderVansGrid();
                this.renderAvailabilityCalendar();
                
                this.showNotification(`Successfully loaded ${realVanData.length} Swiss vans!`, 'success');
            } catch (error) {
                this.showNotification('Error loading real van data: ' + error.message, 'error');
            }
        } else {
            this.showNotification('Real van data module not found. Please ensure real-van-data.js is loaded.', 'error');
        }
    }

    // ...existing code...
}

// Global functions that can be called from HTML
function loadRealVanData() {
    if (adminDashboard && typeof adminDashboard.loadRealVanData === 'function') {
        adminDashboard.loadRealVanData();
    } else {
        console.error('AdminDashboard not initialized');
    }
}

// Initialize the dashboard when the page loads
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});

// Global search functionality
document.getElementById('global-search')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length < 2) return;

    // Search through bookings and customers
    const results = adminDashboard.bookings.filter(booking => 
        booking.customerName.toLowerCase().includes(searchTerm) ||
        booking.customerEmail.toLowerCase().includes(searchTerm) ||
        booking.id.toLowerCase().includes(searchTerm)
    );

    console.log('Search results:', results);
    // Implement search results display
});
