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
        this.compressionSettings = { quality: 0.7, maxWidth: 1200, enabled: true };
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
        this.setupVanImagePlaceholderListeners();
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

    initializeMediaData() {
        // Load media data from localStorage or return empty array
        const savedMedia = localStorage.getItem('adminMediaItems');
        return savedMedia ? JSON.parse(savedMedia) : [];
    }

    saveMediaData() {
        try {
            localStorage.setItem('adminMediaItems', JSON.stringify(this.mediaItems));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                this.handleStorageQuotaExceeded();
            } else {
                console.error('Error saving media data:', error);
                this.showNotification('Failed to save media data', 'error');
            }
        }
    }

    handleStorageQuotaExceeded() {
        console.warn('localStorage quota exceeded, attempting to free up space...');
        
        // Calculate current storage usage
        const currentSize = JSON.stringify(this.mediaItems).length;
        const maxSize = 5 * 1024 * 1024; // 5MB estimate for localStorage limit
        
        this.showNotification('Storage quota exceeded! Images are being compressed further to save space.', 'warning');
        
        // Show modal with options
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>⚠️ Storage Space Full</h3>
                </div>
                <div class="modal-body">
                    <p>Your browser's storage is full. Current usage: ${(currentSize / 1024 / 1024).toFixed(1)}MB</p>
                    <p>To continue uploading images, you can:</p>
                    <div style="margin: 20px 0;">
                        <button class="btn btn-primary" onclick="adminDashboard.cleanupUnassignedImages(); this.closest('.modal').remove();">
                            🧹 Clean Up Unassigned Images
                        </button>
                        <button class="btn btn-secondary" onclick="adminDashboard.clearAllMedia(); this.closest('.modal').remove();">
                            🗑️ Clear All Images
                        </button>
                        <button class="btn btn-outline" onclick="this.closest('.modal').remove();">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    cleanupUnassignedImages() {
        const originalCount = this.mediaItems.length;
        this.mediaItems = this.mediaItems.filter(item => item.assignedVan);
        
        try {
            localStorage.setItem('adminMediaItems', JSON.stringify(this.mediaItems));
            const cleanedCount = originalCount - this.mediaItems.length;
            this.showNotification(`Cleaned up ${cleanedCount} unassigned images`, 'success');
            this.renderMediaGallery();
        } catch (error) {
            this.showNotification('Storage still full. Please clear more images.', 'error');
        }
    }

    clearAllMedia() {
        this.mediaItems = [];
        localStorage.removeItem('adminMediaItems');
        this.showNotification('All media cleared', 'info');
        this.renderMediaGallery();
        this.renderVansGrid(); // Update van grid to remove image references
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
                            <input type="text" id="profile-id" required placeholder="e.g., weekend-special">
                        </div>
                        <div class="form-group">
                            <label for="profile-name">Profile Name:</label>
                            <input type="text" id="profile-name" required placeholder="e.g., Weekend Special">
                        </div>
                        <div class="form-group">
                            <label for="profile-description">Description:</label>
                            <textarea id="profile-description" rows="2" placeholder="Brief description of this pricing profile"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="profile-base-price">Base Price ($):</label>
                            <input type="number" id="profile-base-price" min="0" step="1" required placeholder="100">
                        </div>
                        <div class="form-group">
                            <label for="profile-weekend-mult">Weekend Multiplier:</label>
                            <input type="number" id="profile-weekend-mult" min="1" step="0.1" value="1.2" placeholder="1.2">
                        </div>
                        <div class="form-group">
                            <label for="profile-holiday-mult">Holiday Multiplier:</label>
                            <input type="number" id="profile-holiday-mult" min="1" step="0.1" value="1.5" placeholder="1.5">
                        </div>
                        <div class="form-group">
                            <label for="profile-min-days">Minimum Days:</label>
                            <input type="number" id="profile-min-days" min="1" value="1" required>
                        </div>
                        <div class="form-group">
                            <label for="profile-cancellation">Cancellation Policy:</label>
                            <input type="text" id="profile-cancellation" value="24h free cancellation" placeholder="24h free cancellation">
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
        const vansGrid = document.getElementById('vans-grid');
        if (!vansGrid) return;

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
                                <h3 class="van-name">${van.name}</h3>
                                <div class="van-location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${van.location}
                                </div>
                            </div>
                        </div>
                        <div class="van-header-right">
                            <div class="van-type-badge ${van.type}">${van.type.charAt(0).toUpperCase() + van.type.slice(1)} Van</div>
                            <div class="van-toggle">
                                <label class="toggle-switch">
                                    <input type="checkbox" ${van.enabled ? 'checked' : ''} 
                                           onchange="adminDashboard.toggleVanStatus(${van.id})">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Main Van Image -->
                    <div class="van-main-image">
                        <div class="van-image-placeholder" onclick="adminDashboard.openImageSelector(${van.id}, 'primary')" style="width: 100%; height: 250px; background: linear-gradient(135deg, #85b545 0%, #a8c66c 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" 
                             onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            📷 Click to add primary image<br><small style="font-size: 12px; opacity: 0.8;">for ${van.name}</small>
                        </div>
                    </div>

                    <!-- Additional Images -->
                    <div class="van-additional-images">
                        <div class="additional-image">
                            <div class="van-thumb-placeholder" onclick="adminDashboard.openImageSelector(${van.id}, 'interior')" style="width: 100%; height: 80px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;"
                                 onmouseover="this.style.backgroundColor='#e3f2fd'" onmouseout="this.style.background='linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)'">
                                🏠 Interior
                            </div>
                        </div>
                        <div class="additional-image">
                            <div class="van-thumb-placeholder" onclick="adminDashboard.openImageSelector(${van.id}, 'exterior')" style="width: 100%; height: 80px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;"
                                 onmouseover="this.style.backgroundColor='#e3f2fd'" onmouseout="this.style.background='linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)'">
                                🚐 Exterior
                            </div>
                        </div>
                        <div class="additional-image">
                            <div class="van-thumb-placeholder" onclick="adminDashboard.openImageSelector(${van.id}, 'details')" style="width: 100%; height: 80px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: black; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;"
                                 onmouseover="this.style.backgroundColor='#e3f2fd'" onmouseout="this.style.background='linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)'">
                                📋 Details
                            </div>
                        </div>
                    </div>

                    <!-- Business Metrics -->
                    <div class="van-metrics-section">
                        <div class="metric-item">
                            <div class="metric-icon"><i class="fas fa-dollar-sign"></i></div>
                            <div class="metric-content">
                                <div class="metric-value">$${van.price}</div>
                                <div class="metric-label">Daily Rate</div>
                            </div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-icon"><i class="fas fa-calendar-check"></i></div>
                            <div class="metric-content">
                                <div class="metric-value">${bookingsCount}</div>
                                <div class="metric-label">Bookings</div>
                            </div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-icon"><i class="fas fa-chart-line"></i></div>
                            <div class="metric-content">
                                <div class="metric-value">$${revenue.toLocaleString()}</div>
                                <div class="metric-label">Revenue</div>
                            </div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-icon"><i class="fas fa-cube"></i></div>
                            <div class="metric-content">
                                <div class="metric-value">${van.load_volume || van.capacity}m³</div>
                                <div class="metric-label">Load Volume</div>
                            </div>
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

                    <!-- Management Section -->
                    <div class="van-management-section">
                        <div class="pricing-profile-section">
                            <label class="profile-label">Pricing Profile:</label>
                            <select class="pricing-profile-select" onchange="adminDashboard.updateVanPricingProfile(${van.id}, this.value)">
                                ${this.pricingProfiles.map(profile => 
                                    `<option value="${profile.id}" ${profile.id === van.pricingProfile ? 'selected' : ''}>
                                        ${profile.name}
                                    </option>`
                                ).join('')}
                            </select>
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
                            <input type="text" id="van-name" value="${van.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="van-location">Location:</label>
                            <input type="text" id="van-location" value="${van.location}" required>
                        </div>
                        <div class="form-group">
                            <label for="van-capacity">Capacity:</label>
                            <input type="number" id="van-capacity" value="${van.capacity}" min="1" max="12" required>
                        </div>
                        <div class="form-group">
                            <label for="van-description">Description:</label>
                            <textarea id="van-description" rows="3">${van.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="van-features">Features (comma-separated):</label>
                            <input type="text" id="van-features" value="${van.features.join(', ')}">
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
                    <h4>${van.name}</h4>
                    <div class="preview-price">$${van.price}/day</div>
                </div>
                <div class="preview-type">${van.type.charAt(0).toUpperCase() + van.type.slice(1)} Van • ${van.capacity} guests</div>
                ${config.technicalSpecs.showVehicleAddress && van.VehicleAdress ? `
                    <div class="preview-address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${van.VehicleAdress}
                    </div>
                ` : ''}
                ${technicalSpecs}
                ${config.technicalSpecs.showFeatures ? `
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
                    .collection-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
                    .van-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                    .van-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
                    .van-name { margin: 0; color: #333; }
                    .van-price { font-weight: bold; color: #007bff; }
                    .van-type { color: #6c757d; margin-bottom: 10px; }
                    .preview-technical-specs { margin: 15px 0; }
                    .spec-group { margin-bottom: 8px; font-size: 14px; }
                    .spec-title { font-weight: 600; color: #495057; }
                    .spec-values { color: #6c757d; }
                    .preview-features { margin: 15px 0; }
                    .feature-tag { background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
                    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
                    .status-badge.available { background: #d4edda; color: #155724; }
                    .preview-address { color: #6c757d; font-size: 14px; margin: 10px 0; }
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

    // Utility Methods
    formatDate(date) {
        // Format date as YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDisplayDate(dateString) {
        // Format date string for display (e.g., "Jul 15, 2025")
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
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

    viewVanDetails(vanId) {
        const van = this.vans.find(v => v.id === vanId);
        if (!van) return;

        this.showVanDetailsModal(van);
    }

    showVanDetailsModal(van) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3>Van Details: ${van.name}</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="van-details-content">
                        <div class="details-section">
                            <h4>Basic Information</h4>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <span class="label">Name:</span>
                                    <span class="value">${van.name}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Type:</span>
                                    <span class="value">${van.type}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Location:</span>
                                    <span class="value">${van.location}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Capacity:</span>
                                    <span class="value">${van.capacity} guests</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Status:</span>
                                    <span class="value status-${van.status}">${van.status}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Daily Rate:</span>
                                    <span class="value">$${van.price}</span>
                                </div>
                            </div>
                        </div>
                        
                        ${van.VehicleAdress ? `
                        <div class="details-section">
                            <h4>Address</h4>
                            <p>${van.VehicleAdress}</p>
                        </div>
                        ` : ''}
                        
                        <div class="details-section">
                            <h4>Technical Specifications</h4>
                            <div class="tech-specs-detailed">
                                <div class="spec-category">
                                    <h5>External Dimensions</h5>
                                    <div class="spec-list">
                                        <div class="spec-item">
                                            <span class="spec-label">Length:</span>
                                            <span class="spec-value">${van.ExtLength || 'N/A'}m</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="spec-label">Height:</span>
                                            <span class="spec-value">${van.ExtHight || 'N/A'}m</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="spec-label">Width:</span>
                                            <span class="spec-value">${van.ExtLarge || 'N/A'}m</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="spec-category">
                                    <h5>Internal Dimensions</h5>
                                    <div class="spec-list">
                                        <div class="spec-item">
                                            <span class="spec-label">Length:</span>
                                            <span class="spec-value">${van.IntLength || 'N/A'}m</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="spec-label">Height:</span>
                                            <span class="spec-value">${van.IntHight || 'N/A'}m</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="spec-label">Width:</span>
                                            <span class="spec-value">${van.IntLarge || 'N/A'}m</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="spec-category">
                                    <h5>Vehicle Information</h5>
                                    <div class="spec-list">
                                        <div class="spec-item">
                                            <span class="spec-label">Vehicle ID:</span>
                                            <span class="spec-value">${van.VehicleID || van.id}</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="spec-label">License Plate:</span>
                                            <span class="spec-value">${van.LicencePlate || 'N/A'}</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="spec-label">Calendar ID:</span>
                                            <span class="spec-value">${van.CalendarID || van.calendar_id || 'N/A'}</span>
                                        </div>
                                        <div class="spec-item">
                                            <span class="spec-label">Load Volume:</span>
                                            <span class="spec-value">${van.load_volume || 'N/A'}m³</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="details-section">
                            <h4>Features & Equipment</h4>
                            <div class="features-list">
                                ${van.features.map(feature => `
                                    <span class="feature-badge">
                                        <i class="fas fa-check"></i>
                                        ${feature}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        
                        ${van.description ? `
                        <div class="details-section">
                            <h4>Description</h4>
                            <p>${van.description}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    viewVanCalendar(vanId) {
        const van = this.vans.find(v => v.id === vanId);
        if (!van) return;

        // For now, just show a notification
        this.showNotification(`Opening calendar for ${van.name}`, 'info');
        // TODO: Implement calendar view modal
    }

    viewBookingDetails(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        this.showBookingDetailsModal(booking);
    }

    showBookingDetailsModal(booking) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Booking Details: ${booking.id}</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="booking-details-content">
                        <div class="detail-item">
                            <span class="label">Customer:</span>
                            <span class="value">${booking.customerName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Email:</span>
                            <span class="value">${booking.customerEmail}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Phone:</span>
                            <span class="value">${booking.phone}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Van:</span>
                            <span class="value">${booking.vanName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Dates:</span>
                            <span class="value">${this.formatDisplayDate(booking.startDate)} - ${this.formatDisplayDate(booking.endDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Status:</span>
                            <span class="value status-${booking.status}">${booking.status}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Total:</span>
                            <span class="value">$${booking.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    editBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        // For now, just show a notification
        this.showNotification(`Editing booking ${bookingId}`, 'info');
        // TODO: Implement booking edit modal
    }

    createBooking(vanId, checkin, checkout) {
        const van = this.vans.find(v => v.id === vanId);
        if (!van) return;

        // For now, just show a notification
        this.showNotification(`Creating booking for ${van.name} from ${checkin} to ${checkout}`, 'info');
        // TODO: Implement booking creation modal
    }

    getVanAvailability(vanId, dateStr) {
        // This would check against actual booking data and Google Calendar
        // For now, return mock availability
        const date = new Date(dateStr);
        const today = new Date();
        
        // Past dates
        if (date < today.setHours(0, 0, 0, 0)) {
            return 'past';
        }
        
        // Check if van has bookings on this date
        const hasBooking = this.bookings.some(booking => {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            return booking.vanId === vanId && 
                   date >= startDate && 
                   date <= endDate &&
                   booking.status === 'confirmed';
        });
        
        if (hasBooking) {
            return 'booked';
        }
        
        // Random availability for demo purposes
        const random = Math.random();
        if (random < 0.7) return 'available';
        if (random < 0.9) return 'partial';
        return 'booked';
    }

    handleCalendarDayClick(van, dateStr) {
        console.log(`Clicked on ${dateStr} for van ${van.name}`);
        
        // Show booking details for this day
        const bookings = this.bookings.filter(booking => {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            const clickedDate = new Date(dateStr);
            return booking.vanId === van.id && 
                   clickedDate >= startDate && 
                   clickedDate <= endDate;
        });

        if (bookings.length > 0) {
            // Show existing bookings
            this.showDayBookingsModal(van, dateStr, bookings);
        } else {
            // Show option to create new booking
            this.showCreateBookingModal(van, dateStr);
        }
    }

    showDayBookingsModal(van, dateStr, bookings) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Bookings for ${van.name} - ${this.formatDisplayDate(dateStr)}</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="day-bookings-list">
                        ${bookings.map(booking => `
                            <div class="booking-item">
                                <div class="booking-header">
                                    <h4>${booking.customerName}</h4>
                                    <span class="booking-status ${booking.status}">${booking.status}</span>
                                </div>
                                <div class="booking-details">
                                    <p><strong>Dates:</strong> ${this.formatDisplayDate(booking.startDate)} - ${this.formatDisplayDate(booking.endDate)}</p>
                                    <p><strong>Email:</strong> ${booking.customerEmail}</p>
                                    <p><strong>Phone:</strong> ${booking.phone}</p>
                                    <p><strong>Total:</strong> $${booking.total.toLocaleString()}</p>
                                </div>
                                <div class="booking-actions">
                                    <button class="btn btn-primary btn-sm" onclick="adminDashboard.viewBookingDetails('${booking.id}')">
                                        View Details
                                    </button>
                                    <button class="btn btn-secondary btn-sm" onclick="adminDashboard.editBooking('${booking.id}')">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showCreateBookingModal(van, dateStr) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Create Booking for ${van.name}</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form onsubmit="adminDashboard.createBookingFromForm(event, ${van.id})">
                        <div class="form-group">
                            <label for="booking-start-date">Start Date:</label>
                            <input type="date" id="booking-start-date" value="${dateStr}" required>
                        </div>
                        <div class="form-group">
                            <label for="booking-end-date">End Date:</label>
                            <input type="date" id="booking-end-date" required>
                        </div>
                        <div class="form-group">
                            <label for="customer-name">Customer Name:</label>
                            <input type="text" id="customer-name" required>
                        </div>
                        <div class="form-group">
                            <label for="customer-email">Customer Email:</label>
                            <input type="email" id="customer-email" required>
                        </div>
                        <div class="form-group">
                            <label for="customer-phone">Customer Phone:</label>
                            <input type="tel" id="customer-phone" required>
                        </div>
                        <div class="form-group">
                            <label for="booking-total">Total Amount ($):</label>
                            <input type="number" id="booking-total" min="0" step="1" required>
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

        // Set minimum end date
        const startDateInput = document.getElementById('booking-start-date');
        const endDateInput = document.getElementById('booking-end-date');
        
        startDateInput.addEventListener('change', () => {
            endDateInput.min = startDateInput.value;
            this.calculateBookingTotal(van.id);
        });
        
        endDateInput.addEventListener('change', () => {
            this.calculateBookingTotal(van.id);
        });

        // Set initial minimum end date
        endDateInput.min = dateStr;
    }

    createBookingFromForm(event, vanId) {
        event.preventDefault();
        
        const van = this.vans.find(v => v.id === vanId);
        if (!van) return;

        const startDate = document.getElementById('booking-start-date').value;
        const endDate = document.getElementById('booking-end-date').value;
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const total = parseFloat(document.getElementById('booking-total').value);

        // Generate booking ID
        const bookingId = 'BK' + String(Date.now()).slice(-6);

        const newBooking = {
            id: bookingId,
            customerId: 'C' + String(Date.now()).slice(-6),
            customerName: customerName,
            customerEmail: customerEmail,
            phone: customerPhone,
            vanId: vanId,
            vanName: van.name,
            startDate: startDate,
            endDate: endDate,
            status: 'confirmed',
            total: total
        };

        // Add booking to array
        this.bookings.push(newBooking);

        // Update displays
        this.renderBookingsTable();
        this.renderAvailabilityCalendar();

        // Close modal and show success
        event.target.closest('.modal').remove();
        this.showNotification(`Booking ${bookingId} created successfully for ${customerName}`, 'success');
    }

    calculateBookingTotal(vanId) {
        const van = this.vans.find(v => v.id === vanId);
        if (!van) return;

        const startDate = document.getElementById('booking-start-date')?.value;
        const endDate = document.getElementById('booking-end-date')?.value;
        const totalInput = document.getElementById('booking-total');

        if (startDate && endDate && totalInput) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            
            if (days > 0) {
                const total = van.price * days;
                totalInput.value = total;
            }
        }
    }

    // Media Manager Functions
    setupMediaManager() {
        const uploadDropzone = document.getElementById('upload-dropzone');
        const fileInput = document.getElementById('file-input');
        const uploadButton = document.getElementById('upload-media-btn');

        if (uploadDropzone && fileInput) {
            // Drag and drop handlers
            uploadDropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadDropzone.classList.add('dragover');
            });

            uploadDropzone.addEventListener('dragleave', () => {
                uploadDropzone.classList.remove('dragover');
            });

            uploadDropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadDropzone.classList.remove('dragover');
                this.handleFileUpload(e.dataTransfer.files);
            });

            uploadDropzone.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        this.setupMediaFilters();
        this.renderMediaGallery();
    }

    setupMediaFilters() {
        const vanFilter = document.getElementById('van-filter');
        const categoryFilter = document.getElementById('category-filter');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');

        // Populate van filter options
        this.populateVanFilterOptions();

        // Add filter event listeners
        if (vanFilter) {
            vanFilter.addEventListener('change', () => this.renderMediaGallery());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.renderMediaGallery());
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                if (vanFilter) vanFilter.value = '';
                if (categoryFilter) categoryFilter.value = '';
                this.renderMediaGallery();
            });
        }
    }

    async handleFileUpload(files) {
        const progressContainer = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressContainer) {
            progressContainer.style.display = 'block';
        }

        const fileArray = Array.from(files);
        let uploadedCount = 0;

        for (const file of fileArray) {
            if (file.type.startsWith('image/')) {
                await this.processFile(file);
                uploadedCount++;
                
                const progress = (uploadedCount / fileArray.length) * 100;
                if (progressFill) progressFill.style.width = `${progress}%`;
                if (progressText) progressText.textContent = `${Math.round(progress)}%`;
            }
        }

        if (progressContainer) {
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 1000);
        }

        this.renderMediaGallery();
        this.showNotification(`Successfully uploaded ${uploadedCount} images`, 'success');
    }

    async processFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                // Compress the image to prevent localStorage quota errors
                let dataUrl = e.target.result;
                if (file.type.startsWith('image/')) {
                    dataUrl = await this.compressImage(e.target.result);
                }
                
                const mediaItem = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    dataUrl: dataUrl,
                    uploadDate: new Date().toISOString(),
                    assignedVan: null,
                    category: null,
                    description: '',
                    isPrimary: false
                };
                
                this.mediaItems.push(mediaItem);
                this.saveMediaData();
                resolve();
            };
            reader.readAsDataURL(file);
        });
    }

    async compressImage(dataUrl, quality = 0.7, maxWidth = 1200) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed JPEG to save space
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.src = dataUrl;
        });
    }

    renderMediaGallery() {
        const mediaGrid = document.getElementById('media-grid');
        const noMediaMessage = document.getElementById('no-media-message');
        
        if (!mediaGrid) return;

        // Apply filters
        const vanFilter = document.getElementById('van-filter')?.value;
        const categoryFilter = document.getElementById('category-filter')?.value;

        let filteredItems = this.mediaItems;

        if (vanFilter === 'unassigned') {
            filteredItems = filteredItems.filter(item => !item.assignedVan);
        } else if (vanFilter && vanFilter !== '') {
            filteredItems = filteredItems.filter(item => item.assignedVan === vanFilter);
        }

        if (categoryFilter) {
            filteredItems = filteredItems.filter(item => item.category === categoryFilter);
        }

        if (filteredItems.length === 0) {
            mediaGrid.style.display = 'none';
            if (noMediaMessage) noMediaMessage.style.display = 'block';
        } else {
            mediaGrid.style.display = 'grid';
            if (noMediaMessage) noMediaMessage.style.display = 'none';
            
            mediaGrid.innerHTML = filteredItems.map(item => this.createMediaItemHTML(item)).join('');
        }
    }

    createMediaItemHTML(item) {
        const assignedVan = item.assignedVan ? this.vans.find(v => v.id.toString() === item.assignedVan.toString()) : null;
        
        return `
            <div class="media-item" data-id="${item.id}">
                <div class="media-image">
                    <img src="${item.dataUrl}" alt="${item.name}" onclick="adminDashboard.openMediaModal('${item.id}')">
                    ${item.isPrimary ? '<div class="primary-badge">★ Primary</div>' : ''}
                </div>
                <div class="media-info">
                    <div class="media-name">${item.name}</div>
                    <div class="media-details">
                        <span class="media-size">${(item.size / 1024 / 1024).toFixed(1)}MB</span>
                        ${item.category ? `<span class="media-category">${item.category}</span>` : ''}
                    </div>
                    ${assignedVan ? `
                        <div class="media-assignment">
                            Assigned to: <strong>${assignedVan.name}</strong>
                        </div>
                    ` : `
                        <div class="media-unassigned">Unassigned</div>
                    `}
                </div>
                <div class="media-actions">
                    <button class="btn btn-sm btn-primary" onclick="adminDashboard.openMediaModal('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteMediaItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    openMediaModal(itemId) {
        const item = this.mediaItems.find(i => i.id.toString() === itemId.toString());
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Media Item</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="media-preview">
                        <img src="${item.dataUrl}" alt="${item.name}">
                    </div>
                    <div class="media-form">
                        <div class="form-group">
                            <label for="media-name">Name:</label>
                            <input type="text" id="media-name" value="${item.name}">
                        </div>
                        <div class="form-group">
                            <label for="media-description">Description:</label>
                            <textarea id="media-description" rows="3">${item.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="media-category">Category:</label>
                            <select id="media-category">
                                <option value="">Select category...</option>
                                <option value="exterior" ${item.category === 'exterior' ? 'selected' : ''}>Exterior</option>
                                <option value="interior" ${item.category === 'interior' ? 'selected' : ''}>Interior</option>
                                <option value="features" ${item.category === 'features' ? 'selected' : ''}>Features</option>
                                <option value="360" ${item.category === '360' ? 'selected' : ''}>360° View</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="media-van">Assign to Van:</label>
                            <select id="media-van">
                                <option value="">Unassigned</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="media-primary" ${item.isPrimary ? 'checked' : ''}>
                                Set as primary image for this van
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-success" onclick="adminDashboard.downloadMediaItem('${item.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn btn-danger" onclick="adminDashboard.deleteMediaItem('${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn btn-primary" onclick="adminDashboard.saveMediaAssignment('${item.id}')">Save</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.populateVanOptions(document.getElementById('media-van'));
    }

    populateVanOptions(selectElement) {
        if (!selectElement) return;
        
        this.vans.forEach(van => {
            const option = document.createElement('option');
            option.value = van.id;
            option.textContent = `${van.VehicleID || van.id} - ${van.name}`;
            selectElement.appendChild(option);
        });
    }

    populateVanFilterOptions() {
        const vanFilter = document.getElementById('van-filter');
        if (!vanFilter) return;

        // Clear existing options (except first two)
        while (vanFilter.children.length > 2) {
            vanFilter.removeChild(vanFilter.lastChild);
        }

        this.vans.forEach(van => {
            const option = document.createElement('option');
            option.value = van.id;
            option.textContent = `${van.VehicleID || van.id} - ${van.name}`;
            vanFilter.appendChild(option);
        });
    }

    saveMediaAssignment(itemId) {
        const item = this.mediaItems.find(i => i.id.toString() === itemId.toString());
        if (!item) return;

        const name = document.getElementById('media-name')?.value;
        const description = document.getElementById('media-description')?.value;
        const category = document.getElementById('media-category')?.value;
        const vanId = document.getElementById('media-van')?.value;
        const isPrimary = document.getElementById('media-primary')?.checked;

        // Update item
        item.name = name || item.name;
        item.description = description || '';
        item.category = category || null;
        item.assignedVan = vanId || null;
        item.isPrimary = isPrimary || false;

        // If setting as primary, remove primary from other images of the same van
        if (isPrimary && vanId) {
            this.mediaItems.forEach(mediaItem => {
                if (mediaItem.assignedVan === vanId && mediaItem.id !== item.id) {
                    mediaItem.isPrimary = false;
                }
            });
        }

        this.saveMediaData();
        this.renderMediaGallery();
        this.renderVansGrid(); // Update van cards to show new images

        // Close modal
        document.querySelector('.modal')?.remove();
        this.showNotification('Media item updated successfully', 'success');
    }

    deleteMediaItem(itemId) {
        if (!confirm('Are you sure you want to delete this image?')) return;

        this.mediaItems = this.mediaItems.filter(item => item.id.toString() !== itemId.toString());
        this.saveMediaData();
        this.renderMediaGallery();
        this.renderVansGrid(); // Update van cards

        // Close modal if open
        document.querySelector('.modal')?.remove();
        this.showNotification('Image deleted successfully', 'success');
    }

    downloadMediaItem(itemId) {
        const item = this.mediaItems.find(i => i.id.toString() === itemId.toString());
        if (!item) return;

        const link = document.createElement('a');
        link.href = item.dataUrl;
        link.download = item.name;
        link.click();
    }

    // Image Selection Modal for Van Management
    openImageSelector(vanId, imageType = 'primary') {
        console.log('openImageSelector called with:', { vanId, imageType });
        
        const availableImages = this.mediaItems.filter(item => !item.assignedVan);
        const assignedImages = this.mediaItems.filter(item => item.assignedVan && item.assignedVan.toString() === vanId.toString());
        
        console.log('Available images:', availableImages.length);
        console.log('Assigned images:', assignedImages.length);
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'image-selector-modal';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3>Select Image for Van #${vanId}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="image-selector-tabs">
                        <button class="selector-tab-btn active" data-tab="available">Available Images (${availableImages.length})</button>
                        <button class="selector-tab-btn" data-tab="assigned">Current Images (${assignedImages.length})</button>
                        <button class="selector-tab-btn" data-tab="upload">Upload New</button>
                    </div>
                    
                    <!-- Available Images Tab -->
                    <div class="selector-tab-content active" id="available-tab">
                        ${availableImages.length > 0 ? `
                            <div class="image-selector-grid">
                                ${availableImages.map(item => `
                                    <div class="selector-image-item" onclick="adminDashboard.selectImageForVan('${item.id}', ${vanId}, '${imageType}')">
                                        <img src="${item.dataUrl}" alt="${item.name}">
                                        <div class="selector-image-info">
                                            <div class="image-name">${item.name}</div>
                                            <div class="image-size">${(item.size / 1024 / 1024).toFixed(1)}MB</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="empty-state">
                                <i class="fas fa-images"></i>
                                <p>No unassigned images available</p>
                                <button class="btn btn-primary" onclick="document.querySelector('[data-tab=upload]').click()">Upload Images</button>
                            </div>
                        `}
                    </div>
                    
                    <!-- Assigned Images Tab -->
                    <div class="selector-tab-content" id="assigned-tab">
                        ${assignedImages.length > 0 ? `
                            <div class="image-selector-grid">
                                ${assignedImages.map(item => `
                                    <div class="selector-image-item assigned" onclick="adminDashboard.selectImageForVan('${item.id}', ${vanId}, '${imageType}')">
                                        <img src="${item.dataUrl}" alt="${item.name}">
                                        <div class="selector-image-info">
                                            <div class="image-name">${item.name}</div>
                                            <div class="image-details">
                                                ${item.category ? `<span class="category-tag">${item.category}</span>` : ''}
                                                ${item.isPrimary ? '<span class="primary-tag">★ Primary</span>' : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="empty-state">
                                <i class="fas fa-image"></i>
                                <p>No images assigned to this van yet</p>
                            </div>
                        `}
                    </div>
                    
                    <!-- Upload New Tab -->
                    <div class="selector-tab-content" id="upload-tab">
                        <div class="upload-section">
                            <div class="upload-drop-zone" id="selector-drop-zone">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Drop images here or click to browse</p>
                                <input type="file" id="selector-file-input" multiple accept="image/*" style="display: none;">
                                <button class="btn btn-primary" onclick="document.getElementById('selector-file-input').click()">Choose Files</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-info" onclick="adminDashboard.openMediaManager()">Go to Media Manager</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupImageSelectorTabs();
        this.setupSelectorUpload();
    }

    setupImageSelectorTabs() {
        const tabButtons = document.querySelectorAll('.selector-tab-btn');
        const tabContents = document.querySelectorAll('.selector-tab-content');

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
            });
        });
    }

    setupSelectorUpload() {
        const dropZone = document.getElementById('selector-drop-zone');
        const fileInput = document.getElementById('selector-file-input');
        
        if (!dropZone || !fileInput) return;

        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            this.handleSelectorFileUpload(e.dataTransfer.files);
        });

        // File input handler
        fileInput.addEventListener('change', (e) => {
            this.handleSelectorFileUpload(e.target.files);
        });
    }

    handleSelectorFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const mediaItem = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        size: file.size,
                        dataUrl: e.target.result,
                        uploadDate: new Date().toISOString(),
                        assignedVan: null,
                        category: null,
                        description: '',
                        isPrimary: false
                    };
                    
                    this.mediaItems.push(mediaItem);
                    this.saveMediaData();
                    
                    // Refresh the available images tab
                    const modal = document.getElementById('image-selector-modal');
                    if (modal) {
                        modal.remove();
                        // Reopen with updated content
                        setTimeout(() => {
                            this.openImageSelector(parseInt(modal.dataset.vanId || '1'), modal.dataset.imageType || 'primary');
                        }, 100);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    selectImageForVan(imageId, vanId, imageType) {
        const item = this.mediaItems.find(i => i.id.toString() === imageId.toString());
        if (!item) return;

        // Update image assignment
        item.assignedVan = vanId.toString();
        
        // Set category based on image type if not already set
        if (!item.category) {
            switch(imageType) {
                case 'interior': item.category = 'interior'; break;
                case 'exterior': item.category = 'exterior'; break;
                case 'details': item.category = 'details'; break;
                default: item.category = 'exterior'; break;
            }
        }

        // If this is being set as primary, remove primary from other images of this van
        if (imageType === 'primary') {
            this.mediaItems.forEach(mediaItem => {
                if (mediaItem.assignedVan && mediaItem.assignedVan.toString() === vanId.toString() && mediaItem.id !== item.id) {
                    mediaItem.isPrimary = false;
                }
            });
            item.isPrimary = true;
        }

        this.saveMediaData();
        this.renderVansGrid(); // Refresh van grid to show new image
        
        // Close modal
        const modal = document.getElementById('image-selector-modal');
        if (modal) modal.remove();
        
        this.showNotification(`Image assigned to van #${vanId}`, 'success');
    }

    openMediaManager() {
        // Switch to Media Manager tab
        const mediaManagerTab = document.querySelector('.sidebar-menu a[href="#media"]');
        if (mediaManagerTab) {
            mediaManagerTab.click();
        }
        
        // Close any open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.remove());
    }

    setupVanImagePlaceholderListeners() {
        // Add click handlers for van image placeholders
        document.querySelectorAll('.van-image-placeholder, .van-thumb-placeholder').forEach(placeholder => {
            placeholder.addEventListener('click', (e) => {
                const vanId = parseInt(e.target.getAttribute('data-van-id'));
                const imageType = e.target.getAttribute('data-image-type');
                console.log('Image placeholder clicked:', { vanId, imageType });
                this.openImageSelector(vanId, imageType);
            });
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
            if (notification.parentNode) {
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
}

// Initialize the dashboard when the page loads
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
    // Make it globally accessible for onclick handlers
    window.adminDashboard = adminDashboard;
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
