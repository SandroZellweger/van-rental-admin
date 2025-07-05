// AdminDashboard.js - Main orchestrator class that coordinates all modules
import { VanManager } from './modules/VanManager.js';
import { BookingManager } from './modules/BookingManager.js';
import { PricingManager } from './modules/PricingManager.js';
import { MediaManager } from './modules/MediaManager.js';
import { CalendarManager } from './modules/CalendarManager.js';
import { GoogleSheetsIntegration } from './modules/GoogleSheetsIntegration.js';
import { UIManager } from './modules/UIManager.js';

export class AdminDashboard {
    constructor() {
        console.log('Initializing Admin Dashboard...');
        
        // Initialize all managers
        this.uiManager = new UIManager();
        this.vanManager = new VanManager();
        this.bookingManager = new BookingManager();
        this.pricingManager = new PricingManager();
        this.mediaManager = new MediaManager();
        this.calendarManager = new CalendarManager();
        this.googleSheetsIntegration = new GoogleSheetsIntegration();
        
        // Initialize the dashboard
        this.init();
    }

    async init() {
        console.log('Setting up Admin Dashboard...');
        
        // Initialize UI manager first
        this.uiManager.init();
        
        // Show loading state
        this.uiManager.showNotification('Loading data from backend...', 'info', 2000);
        
        try {
            // Load data from backend in parallel
            await Promise.all([
                this.vanManager.loadVans(),
                this.bookingManager.loadBookings(),
                this.pricingManager.loadPricingProfiles(),
                this.mediaManager.loadMediaItems()
            ]);
            
            // Setup all components with loaded data
            this.renderDashboard();
            this.renderAvailabilityCalendar();
            this.renderBookingsTable();
            this.renderVansGrid();
            this.setupSearch();
            this.setupGlobalSearch();
            this.renderPricingProfiles();
            this.setupPricingTabs();
            this.renderGoogleSheetsSection();
            this.setupGoogleSheetsHandlers();
            this.setupVanManagementTabs();
            this.setupMediaManager();
            this.setupVanImagePlaceholderListeners();
            
            // Show success notification
            this.uiManager.showNotification('Admin Dashboard loaded successfully with live backend data!', 'success', 3000);
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.uiManager.showNotification('Failed to load dashboard data. Check backend connection.', 'error', 5000);
        }
        
        console.log('Admin Dashboard initialization complete!');
    }

    renderDashboard() {
        const dashboardStats = document.getElementById('dashboard-stats');
        if (!dashboardStats) return;

        const vanStats = this.vanManager.getVanStats();
        const bookingStats = this.bookingManager.getBookingStats();

        const statCards = dashboardStats.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-number').textContent = vanStats.total;
            statCards[1].querySelector('.stat-number').textContent = vanStats.available;
            statCards[2].querySelector('.stat-number').textContent = bookingStats.confirmed;
            statCards[3].querySelector('.stat-number').textContent = this.uiManager.formatCurrency(bookingStats.thisMonthRevenue);
        }
    }

    renderAvailabilityCalendar() {
        this.calendarManager.renderAvailabilityCalendar();
    }

    renderBookingsTable() {
        this.bookingManager.renderBookingsTable();
    }

    renderVansGrid() {
        this.vanManager.renderVansGrid();
    }

    setupSearch() {
        const searchButton = document.getElementById('search-btn');
        const searchInputs = ['checkin-date', 'checkout-date', 'van-type', 'guests'];
        
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

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.performVanSearch();
            });
        }
    }

    hasValidSearchCriteria() {
        const checkin = document.getElementById('checkin-date')?.value;
        const checkout = document.getElementById('checkout-date')?.value;
        return checkin && checkout;
    }

    performVanSearch() {
        const checkin = document.getElementById('checkin-date')?.value;
        const checkout = document.getElementById('checkout-date')?.value;
        const vanType = document.getElementById('van-type')?.value;
        const guests = parseInt(document.getElementById('guests')?.value) || 0;

        if (!checkin || !checkout) {
            this.uiManager.showNotification('Please select check-in and check-out dates', 'warning');
            return;
        }

        const availableVans = this.vanManager.getAvailableVans().filter(van => {
            // Check availability for the period
            const isAvailable = this.bookingManager.isVanAvailableForPeriod(van.id, checkin, checkout);
            
            // Filter by type if specified
            const typeMatch = !vanType || van.type === vanType;
            
            // Filter by capacity if specified
            const capacityMatch = guests === 0 || van.capacity >= guests;
            
            return isAvailable && typeMatch && capacityMatch;
        });

        this.renderSearchResults(availableVans, checkin, checkout);
    }

    renderSearchResults(availableVans, checkin, checkout) {
        const resultsContainer = document.getElementById('search-results-container');
        const resultsGrid = document.getElementById('search-results-grid');
        
        if (!resultsGrid) return;

        if (availableVans.length === 0) {
            resultsGrid.innerHTML = '<p class="no-results">No vans available for the selected dates and criteria.</p>';
            return;
        }

        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const days = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

        resultsGrid.innerHTML = availableVans.map(van => `
            <div class="result-item">
                <div class="result-header">
                    <div class="van-info">
                        <h3>${van.name}</h3>
                        <div class="van-type">${van.type.charAt(0).toUpperCase() + van.type.slice(1)} Van</div>
                    </div>
                    <div class="van-price">
                        <div class="price-amount">$${(van.price * days).toLocaleString()}</div>
                        <div class="price-period">${days} day${days > 1 ? 's' : ''}</div>
                    </div>
                </div>
                <div class="van-features">
                    <span class="feature"><i class="fas fa-users"></i> ${van.capacity} guests</span>
                    <span class="feature"><i class="fas fa-map-marker-alt"></i> ${van.location}</span>
                    ${van.features.slice(0, 3).map(feature => 
                        `<span class="feature"><i class="fas fa-check"></i> ${feature}</span>`
                    ).join('')}
                </div>
                <div class="van-actions">
                    <button class="btn btn-primary" onclick="adminDashboard.createBookingForVan(${van.id}, '${checkin}', '${checkout}')">
                        Book Now
                    </button>
                    <button class="btn btn-secondary" onclick="adminDashboard.vanManager.editVan(${van.id})">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');

        if (resultsContainer) {
            resultsContainer.style.display = 'block';
        }
    }

    createBookingForVan(vanId, checkinDate, checkoutDate) {
        this.calendarManager.createBooking(vanId, checkinDate);
        
        // Pre-fill the checkout date
        setTimeout(() => {
            const checkoutInput = document.getElementById('booking-checkout');
            if (checkoutInput) {
                checkoutInput.value = checkoutDate;
                // Trigger change event to update pricing
                checkoutInput.dispatchEvent(new Event('change'));
            }
        }, 100);
    }

    renderPricingProfiles() {
        this.pricingManager.renderPricingProfiles();
    }

    setupPricingTabs() {
        const pricingTabs = document.querySelectorAll('.pricing-tab');
        pricingTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs and panes
                document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.pricing-pane').forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding pane
                const targetPane = document.getElementById(tab.getAttribute('data-target'));
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });

        // Activate first tab by default
        if (pricingTabs.length > 0) {
            pricingTabs[0].classList.add('active');
            const firstPane = document.getElementById(pricingTabs[0].getAttribute('data-target'));
            if (firstPane) {
                firstPane.classList.add('active');
            }
        }
    }

    renderGoogleSheetsSection() {
        this.googleSheetsIntegration.renderGoogleSheetsSection();
    }

    setupGoogleSheetsHandlers() {
        this.googleSheetsIntegration.setupGoogleSheetsHandlers();
    }

    setupVanManagementTabs() {
        const vanTabs = document.querySelectorAll('.van-management-tab');
        vanTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active from all tabs
                vanTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.van-tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active to clicked tab
                tab.classList.add('active');
                const targetTab = tab.getAttribute('data-target');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Initialize specific tab content
                if (targetTab === 'display') {
                    this.initializeDisplayConfigTab();
                } else if (targetTab === 'technical') {
                    this.initializeTechnicalTab();
                }
            });
        });

        // Activate first tab
        if (vanTabs.length > 0) {
            vanTabs[0].click();
        }
    }

    initializeDisplayConfigTab() {
        // Initialize display configuration tab
        const displayConfig = this.vanManager.displayConfig;
        
        // Set current values
        const styleSelect = document.getElementById('display-style-select');
        if (styleSelect) {
            styleSelect.value = displayConfig.displayStyle;
            styleSelect.addEventListener('change', (e) => {
                this.vanManager.updateDisplayStyle(e.target.value);
                this.updateDisplayPreview();
            });
        }

        // Setup checkboxes for display options
        const checkboxes = document.querySelectorAll('#display-config input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const field = checkbox.getAttribute('data-field');
            if (field) {
                checkbox.checked = this.getDisplayConfigValue(field);
                checkbox.addEventListener('change', (e) => {
                    this.vanManager.updateDisplayConfig(field, e.target.checked);
                    this.updateDisplayPreview();
                });
            }
        });

        this.updateDisplayPreview();
    }

    getDisplayConfigValue(field) {
        const config = this.vanManager.displayConfig;
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            return config[parent] && config[parent][child];
        }
        return config[field];
    }

    initializeTechnicalTab() {
        // Initialize technical specifications tab
        console.log('Initializing technical tab...');
    }

    updateDisplayPreview() {
        const previewContainer = document.getElementById('display-preview');
        if (!previewContainer) return;

        // Use first van as example
        const exampleVan = this.vanManager.vans[0];
        if (exampleVan) {
            const previewHTML = this.vanManager.generatePreviewVanCard(exampleVan);
            previewContainer.innerHTML = previewHTML;
        }
    }

    setupMediaManager() {
        this.mediaManager.setupMediaManager();
    }

    setupVanImagePlaceholderListeners() {
        // Setup event delegation for image placeholders
        document.addEventListener('click', (e) => {
            if (e.target.closest('.van-image-placeholder')) {
                const placeholder = e.target.closest('.van-image-placeholder');
                const vanId = placeholder.getAttribute('data-van-id');
                const imageType = placeholder.getAttribute('data-image-type');
                
                // Convert vanId to integer
                const parsedVanId = parseInt(vanId);
                
                // Only proceed if we have valid parameters
                if (!isNaN(parsedVanId) && imageType) {
                    console.log('Image placeholder clicked:', { vanId: parsedVanId, imageType });
                    this.mediaManager.openImageSelector(parsedVanId, imageType);
                } else {
                    console.warn('Image placeholder clicked but missing required data:', { 
                        vanId: parsedVanId, 
                        imageType, 
                        element: e.target 
                    });
                }
            }
        });
    }

    // Public methods for creating pricing profiles and other modals
    showCreatePricingProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create New Pricing Profile</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form onsubmit="adminDashboard.createPricingProfile(event)">
                        <div class="form-group">
                            <label>Profile Name:</label>
                            <input type="text" id="profile-name" required>
                        </div>
                        <div class="form-group">
                            <label>Profile ID:</label>
                            <input type="text" id="profile-id" required>
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="profile-description" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Base Multiplier:</label>
                            <input type="number" id="profile-base-multiplier" value="1.0" step="0.1" min="0.1" max="5.0" required>
                        </div>
                        <div class="form-group">
                            <label>Weekend Multiplier:</label>
                            <input type="number" id="profile-weekend-multiplier" value="1.2" step="0.1" min="0.1" max="5.0" required>
                        </div>
                        <div class="form-group">
                            <label>Weekly Discount (%):</label>
                            <input type="number" id="profile-weekly-discount" value="10" step="1" min="0" max="50" required>
                        </div>
                        <div class="form-group">
                            <label>Monthly Discount (%):</label>
                            <input type="number" id="profile-monthly-discount" value="20" step="1" min="0" max="50" required>
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
        
        const profileData = {
            id: document.getElementById('profile-id').value,
            name: document.getElementById('profile-name').value,
            description: document.getElementById('profile-description').value,
            baseMultiplier: parseFloat(document.getElementById('profile-base-multiplier').value),
            weekendMultiplier: parseFloat(document.getElementById('profile-weekend-multiplier').value),
            weeklyDiscount: parseFloat(document.getElementById('profile-weekly-discount').value) / 100,
            monthlyDiscount: parseFloat(document.getElementById('profile-monthly-discount').value) / 100,
            seasonalAdjustments: true,
            minimumDays: 1,
            maximumDays: 365,
            advanceBookingDiscount: {
                '30': 0.05,
                '60': 0.1,
                '90': 0.15
            }
        };

        const newProfile = this.pricingManager.addPricingProfile(profileData);
        if (newProfile) {
            this.renderPricingProfiles();
            event.target.closest('.modal').remove();
            this.uiManager.showNotification('Pricing profile created successfully!', 'success');
        }
    }

    // Utility methods for refreshing components
    refreshDashboard() {
        this.renderDashboard();
        this.renderAvailabilityCalendar();
        this.renderBookingsTable();
        this.renderVansGrid();
    }

    exportData(format = 'json') {
        const data = {
            vans: this.vanManager.vans,
            bookings: this.bookingManager.bookings,
            pricingProfiles: this.pricingManager.pricingProfiles,
            mediaItems: this.mediaManager.mediaItems,
            exportDate: new Date().toISOString()
        };

        let content, filename, mimeType;

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            filename = `van-rental-data-${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
        } else if (format === 'csv') {
            // Convert to CSV format (simplified)
            const csvRows = [
                ['Van ID', 'Van Name', 'Type', 'Status', 'Price', 'Location'],
                ...this.vanManager.vans.map(van => [
                    van.id, van.name, van.type, van.status, van.price, van.location
                ])
            ];
            content = csvRows.map(row => row.join(',')).join('\n');
            filename = `van-rental-data-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
        }

        // Create and download file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.uiManager.showNotification(`Data exported as ${format.toUpperCase()}`, 'success');
    }

    setupGlobalSearch() {
        // Global search functionality
        const globalSearchInput = document.getElementById('global-search');
        if (globalSearchInput) {
            globalSearchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                if (searchTerm.length < 2) return;

                // Use the UI manager's search functionality
                if (this.uiManager) {
                    this.uiManager.handleGlobalSearch(searchTerm);
                }
            });
        }
    }
}

// Initialize the dashboard when the page loads
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
    // Make it globally accessible for onclick handlers
    window.adminDashboard = adminDashboard;
});
