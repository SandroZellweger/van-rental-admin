// AdminDashboard.js - Main orchestrator class that coordinates all modules
import { VanManager } from './modules/VanManager.js';
import { BookingManager } from './modules/BookingManager.js';
import { PricingManager } from './modules/PricingManager.js';
import { MediaManager } from './modules/MediaManager.js';
import { CalendarManager } from './modules/CalendarManager.js';
import { GoogleSheetsIntegration } from './modules/GoogleSheetsIntegration.js';
import { UIManager } from './modules/UIManager.js';
import { BookingFormProfileManager } from './BookingFormProfileManager.js';
import { BookingProfileUIManager } from './modules/BookingProfileUIManager.js';

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
        this.profileManager = new BookingFormProfileManager();
        this.profileUIManager = new BookingProfileUIManager(this.profileManager);
        
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
            
            // Initialize booking form configuration
            this.initializeBookingFormConfiguration();
            
            // Try to load saved form configuration
            if (!this.loadFormConfiguration()) {
                console.log('Using default form configuration');
            }
            
            // Setup settings navigation handler
            this.setupSettingsNavigation();
            
            // Check if we're running in mock mode
            if (this.vanManager.api.useMockData) {
                this.uiManager.showNotification('⚠️ Running in Mock Mode - Backend not available', 'warning', 5000);
                console.warn('🔄 Admin Dashboard running in mock mode - backend server not available');
            }
            
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
            this.setupBookingProfiles();
            
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

    initializeBookingFormConfiguration() {
        this.bookingFormConfig = {
            sections: [
                {
                    id: 'customer',
                    title: 'Customer Information',
                    order: 1,
                    enabled: true,
                    fields: [
                        { id: 'customerName', label: 'Customer Name', type: 'text', required: true, enabled: true, order: 1 },
                        { id: 'customerEmail', label: 'Email Address', type: 'email', required: true, enabled: true, order: 2 },
                        { id: 'customerPhone', label: 'Phone Number', type: 'tel', required: true, enabled: true, order: 3 },
                        { id: 'customerAddress', label: 'Address', type: 'textarea', required: false, enabled: false, order: 4 },
                        { id: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: false, enabled: false, order: 5 }
                    ]
                },
                {
                    id: 'booking',
                    title: 'Booking Details',
                    order: 2,
                    enabled: true,
                    fields: [
                        { id: 'vanId', label: 'Select Van', type: 'select', required: true, enabled: true, order: 1 },
                        { id: 'checkinDate', label: 'Check-in Date', type: 'date', required: true, enabled: true, order: 2 },
                        { id: 'checkoutDate', label: 'Check-out Date', type: 'date', required: true, enabled: true, order: 3 },
                        { id: 'checkinTime', label: 'Check-in Time', type: 'time', required: false, enabled: true, order: 4 },
                        { id: 'checkoutTime', label: 'Check-out Time', type: 'time', required: false, enabled: true, order: 5 },
                        { id: 'guests', label: 'Number of Guests', type: 'number', required: true, enabled: true, order: 6 },
                        { id: 'specialRequests', label: 'Special Requests', type: 'textarea', required: false, enabled: true, order: 7 }
                    ]
                },
                {
                    id: 'preferences',
                    title: 'Van Preferences',
                    order: 3,
                    enabled: true,
                    fields: [
                        { id: 'petFriendly', label: 'Pet-Friendly', type: 'checkbox', required: false, enabled: true, order: 1 },
                        { id: 'insuranceOption', label: 'Insurance Coverage', type: 'select', required: false, enabled: true, order: 2 },
                        { id: 'addOns', label: 'Add-on Services', type: 'checkbox-group', required: false, enabled: true, order: 3 },
                        { id: 'deliveryOption', label: 'Delivery Service', type: 'checkbox', required: false, enabled: true, order: 4 }
                    ]
                },
                {
                    id: 'additional',
                    title: 'Additional Information',
                    order: 4,
                    enabled: true,
                    fields: [
                        { id: 'totalAmount', label: 'Total Amount', type: 'number', required: true, enabled: true, order: 1, readonly: true },
                        { id: 'paymentMethod', label: 'Payment Method', type: 'select', required: true, enabled: true, order: 2 },
                        { id: 'depositAmount', label: 'Deposit Amount', type: 'number', required: false, enabled: true, order: 3 },
                        { id: 'paymentStatus', label: 'Payment Status', type: 'select', required: true, enabled: true, order: 4 },
                        { id: 'notes', label: 'Internal Notes', type: 'textarea', required: false, enabled: false, order: 5 }
                    ]
                }
            ]
        };
    }

    // Booking Form Configuration Methods
    initializeFormConfigurationUI() {
        console.log('Initializing form configuration UI...');
        
        // Initialize sortable functionality
        this.initializeSortableFields();
        
        // Populate form configuration
        this.populateFormConfiguration();
        
        // Setup event listeners
        this.setupFormConfigEventListeners();
        
        // Initial preview update
        this.updateFormPreview();
    }

    initializeSortableFields() {
        // Check if SortableJS is available (we'll need to include it)
        if (typeof Sortable !== 'undefined') {
            const sortableContainers = document.querySelectorAll('.sortable-fields');
            sortableContainers.forEach(container => {
                new Sortable(container, {
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: (evt) => {
                        this.handleFieldReorder(evt);
                    }
                });
            });
        } else {
            console.warn('SortableJS not available - drag and drop disabled');
        }
    }

    populateFormConfiguration() {
        this.bookingFormConfig.sections.forEach(section => {
            this.populateSectionFields(section);
            this.updateSectionToggle(section);
        });
    }

    populateSectionFields(section) {
        const container = document.querySelector(`#fields-${section.id} .fields-list`);
        if (!container) return;

        container.innerHTML = '';
        
        // Sort fields by order
        const sortedFields = [...section.fields].sort((a, b) => a.order - b.order);
        
        sortedFields.forEach(field => {
            const fieldElement = this.createFieldElement(field, section.id);
            container.appendChild(fieldElement);
        });
    }

    createFieldElement(field, sectionId) {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'field-item';
        fieldDiv.dataset.fieldId = field.id;
        fieldDiv.dataset.sectionId = sectionId;
        
        fieldDiv.innerHTML = `
            <div class="field-drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <input type="checkbox" class="field-checkbox" ${field.enabled ? 'checked' : ''}>
            <span class="field-label">${field.label}</span>
            <span class="field-type">${field.type}</span>
            ${field.required ? '<span class="field-required">Required</span>' : ''}
            <span class="field-status ${field.enabled ? 'enabled' : 'disabled'}">${field.enabled ? 'enabled' : 'disabled'}</span>
        `;

        // Add event listener for checkbox
        const checkbox = fieldDiv.querySelector('.field-checkbox');
        checkbox.addEventListener('change', (e) => {
            this.handleFieldToggle(field.id, sectionId, e.target.checked);
        });

        return fieldDiv;
    }

    updateSectionToggle(section) {
        const checkbox = document.getElementById(`section-${section.id}`);
        if (checkbox) {
            checkbox.checked = section.enabled;
            checkbox.addEventListener('change', (e) => {
                this.handleSectionToggle(section.id, e.target.checked);
            });
        }
    }

    setupFormConfigEventListeners() {
        // Section expand/collapse buttons
        document.querySelectorAll('.section-expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sectionConfig = e.target.closest('.section-config');
                sectionConfig.classList.toggle('collapsed');
            });
        });

        // Save configuration button
        const saveBtn = document.getElementById('save-form-config');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveFormConfiguration());
        }

        // Reset configuration button
        const resetBtn = document.getElementById('reset-form-config');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFormConfiguration());
        }

        // Preview form button
        const previewBtn = document.getElementById('preview-form-config');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.showFullFormPreview());
        }
    }

    handleSectionToggle(sectionId, enabled) {
        const section = this.bookingFormConfig.sections.find(s => s.id === sectionId);
        if (section) {
            section.enabled = enabled;
            this.updateFormPreview();
            
            // Update field checkboxes based on section state
            const fieldCheckboxes = document.querySelectorAll(`#fields-${sectionId} .field-checkbox`);
            fieldCheckboxes.forEach(checkbox => {
                checkbox.disabled = !enabled;
                if (!enabled) {
                    checkbox.checked = false;
                    const fieldId = checkbox.closest('.field-item').dataset.fieldId;
                    this.handleFieldToggle(fieldId, sectionId, false, false);
                }
            });
        }
    }

    handleFieldToggle(fieldId, sectionId, enabled, updatePreview = true) {
        const section = this.bookingFormConfig.sections.find(s => s.id === sectionId);
        if (section) {
            const field = section.fields.find(f => f.id === fieldId);
            if (field) {
                field.enabled = enabled;
                
                // Update status indicator
                const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
                if (fieldElement) {
                    const statusElement = fieldElement.querySelector('.field-status');
                    statusElement.textContent = enabled ? 'enabled' : 'disabled';
                    statusElement.className = `field-status ${enabled ? 'enabled' : 'disabled'}`;
                }
                
                if (updatePreview) {
                    this.updateFormPreview();
                }
            }
        }
    }

    handleFieldReorder(evt) {
        const fieldId = evt.item.dataset.fieldId;
        const sectionId = evt.item.dataset.sectionId;
        const newIndex = evt.newIndex;
        
        const section = this.bookingFormConfig.sections.find(s => s.id === sectionId);
        if (section) {
            // Update field orders based on new positions
            const sortedFields = Array.from(evt.to.children).map((element, index) => {
                const fId = element.dataset.fieldId;
                const field = section.fields.find(f => f.id === fId);
                if (field) {
                    field.order = index + 1;
                }
                return field;
            }).filter(Boolean);
            
            this.updateFormPreview();
        }
    }

    updateFormPreview() {
        const previewContainer = document.getElementById('form-preview');
        if (!previewContainer) return;

        // Clear existing preview
        previewContainer.innerHTML = '';

        // Generate preview based on current configuration
        const enabledSections = this.bookingFormConfig.sections
            .filter(section => section.enabled)
            .sort((a, b) => a.order - b.order);

        enabledSections.forEach(section => {
            const sectionDiv = this.createPreviewSection(section);
            previewContainer.appendChild(sectionDiv);
        });
    }

    createPreviewSection(section) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'preview-section';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'preview-section-title';
        titleDiv.innerHTML = `<i class="fas fa-list"></i> ${section.title}`;
        sectionDiv.appendChild(titleDiv);

        const enabledFields = section.fields
            .filter(field => field.enabled)
            .sort((a, b) => a.order - b.order);

        enabledFields.forEach(field => {
            const fieldDiv = this.createPreviewField(field);
            sectionDiv.appendChild(fieldDiv);
        });

        return sectionDiv;
    }

    createPreviewField(field) {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'preview-field';
        
        const label = document.createElement('label');
        label.innerHTML = `${field.label} ${field.required ? '<span class="required">*</span>' : ''}`;
        fieldDiv.appendChild(label);

        let input;
        switch (field.type) {
            case 'textarea':
                input = document.createElement('textarea');
                input.rows = 3;
                break;
            case 'select':
                input = document.createElement('select');
                // Add some sample options
                const options = this.getFieldOptions(field.id);
                options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.textContent = optionText;
                    input.appendChild(option);
                });
                break;
            case 'checkbox':
                input = document.createElement('input');
                input.type = 'checkbox';
                break;
            case 'checkbox-group':
                const checkboxGroup = document.createElement('div');
                checkboxGroup.className = 'checkbox-group';
                const sampleOptions = ['Option 1', 'Option 2', 'Option 3'];
                sampleOptions.forEach(optionText => {
                    const checkboxWrapper = document.createElement('label');
                    checkboxWrapper.className = 'checkbox-label';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    const span = document.createElement('span');
                    span.textContent = optionText;
                    checkboxWrapper.appendChild(checkbox);
                    checkboxWrapper.appendChild(span);
                    checkboxGroup.appendChild(checkboxWrapper);
                });
                fieldDiv.appendChild(checkboxGroup);
                return fieldDiv;
            default:
                input = document.createElement('input');
                input.type = field.type;
                break;
        }

        if (field.readonly) {
            input.disabled = true;
        }

        input.placeholder = `Enter ${field.label.toLowerCase()}...`;
        fieldDiv.appendChild(input);

        return fieldDiv;
    }

    getFieldOptions(fieldId) {
        const optionsMap = {
            'vanId': ['Van 1 - Adventure Explorer', 'Van 2 - Mountain Cruiser', 'Van 3 - Ocean Breeze'],
            'paymentMethod': ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'],
            'paymentStatus': ['Pending', 'Paid', 'Partial', 'Refunded'],
            'insuranceOption': ['Basic Coverage', 'Comprehensive', 'Premium Plus']
        };
        return optionsMap[fieldId] || ['Option 1', 'Option 2', 'Option 3'];
    }

    saveFormConfiguration() {
        try {
            // Save to localStorage for now
            localStorage.setItem('vanlife_booking_form_config', JSON.stringify(this.bookingFormConfig));
            
            // TODO: Save to backend when available
            // await this.api.saveBookingFormConfiguration(this.bookingFormConfig);
            
            this.uiManager.showNotification('Form configuration saved successfully!', 'success');
            console.log('Form configuration saved:', this.bookingFormConfig);
        } catch (error) {
            console.error('Error saving form configuration:', error);
            this.uiManager.showNotification('Error saving configuration', 'error');
        }
    }

    resetFormConfiguration() {
        if (confirm('Are you sure you want to reset the form configuration to default? This will lose all your customizations.')) {
            // Reset to default configuration
            this.initializeBookingFormConfiguration();
            
            // Repopulate UI
            this.populateFormConfiguration();
            this.updateFormPreview();
            
            this.uiManager.showNotification('Form configuration reset to default', 'info');
        }
    }

    showFullFormPreview() {
        // Create a modal with full form preview
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3><i class="fas fa-eye"></i> Booking Form Preview</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="booking-form-preview" id="full-form-preview">
                        <!-- Full form will be populated here -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary">Close Preview</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Populate full preview
        const fullPreview = modal.querySelector('#full-form-preview');
        const enabledSections = this.bookingFormConfig.sections
            .filter(section => section.enabled)
            .sort((a, b) => a.order - b.order);

        enabledSections.forEach(section => {
            const sectionDiv = this.createPreviewSection(section);
            fullPreview.appendChild(sectionDiv);
        });

        // Setup close handlers
        const closeButtons = modal.querySelectorAll('.close, .btn-secondary');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.remove();
            });
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    loadFormConfiguration() {
        try {
            const saved = localStorage.getItem('vanlife_booking_form_config');
            if (saved) {
                this.bookingFormConfig = JSON.parse(saved);
                console.log('Loaded saved form configuration');
                return true;
            }
        } catch (error) {
            console.error('Error loading form configuration:', error);
        }
        return false;
    }

    setupSettingsNavigation() {
        // Setup navigation to settings section with form configuration initialization
        const settingsNavLink = document.querySelector('[data-section="settings"]');
        if (settingsNavLink) {
            settingsNavLink.addEventListener('click', () => {
                // Delay initialization until the section is visible
                setTimeout(() => {
                    this.initializeFormConfigurationUI();
                }, 100);
            });
        }
    }

    setupBookingProfiles() {
        console.log('Setting up booking profiles UI...');
        
        // The BookingProfileUIManager handles its own initialization
        // We just need to make sure navigation works
        this.setupBookingProfilesNavigation();
    }

    setupBookingProfilesNavigation() {
        // Handle navigation to booking profiles section
        const profilesNavLink = document.querySelector('[data-section="booking-profiles"]');
        if (profilesNavLink) {
            profilesNavLink.addEventListener('click', () => {
                // Ensure the profile UI manager is initialized when the section is accessed
                if (this.profileUIManager && this.profileUIManager.currentTab) {
                    this.profileUIManager.switchTab(this.profileUIManager.currentTab);
                }
            });
        }
    }

    // Method to get profile for a specific van (used by other components)
    getVanProfile(vanId) {
        return this.profileManager.getProfileForVan(vanId);
    }

    // Method to update van profile association (used by van management)
    updateVanProfile(vanId, profileName) {
        try {
            // Remove van from all profiles first
            this.profileManager.getAllProfiles().forEach(profile => {
                this.profileManager.removeVanFromProfile(vanId, profile.name);
            });

            // Associate with new profile if specified
            if (profileName) {
                this.profileManager.associateVanWithProfile(vanId, profileName);
            }

            // Save changes
            this.profileManager.saveProfiles();
            
            // Update UI if profile manager is active
            if (this.profileUIManager && this.profileUIManager.currentTab === 'van-associations') {
                this.profileUIManager.loadVanAssociations();
            }

            return true;
        } catch (error) {
            console.error('Failed to update van profile:', error);
            return false;
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
