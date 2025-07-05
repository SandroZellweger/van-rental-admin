// form-integration.js - Integrates dynamic form generator with existing booking system
import { BookingFormGenerator } from './js/BookingFormGenerator.js';
import { BookingFormProfileManager } from './js/BookingFormProfileManager.js';

class BookingFormIntegration {
    constructor() {
        this.profileManager = new BookingFormProfileManager();
        this.formGenerator = null;
        this.currentProfile = null;
        this.selectedVanId = null;
        this.isIntegrated = false;
        this.init();
    }

    async init() {
        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupIntegration());
        } else {
            this.setupIntegration();
        }
    }

    async setupIntegration() {
        console.log('Setting up booking form integration...');
        
        // Wait for profile manager to initialize
        await this.profileManager.init();
        
        // Setup van selection monitoring
        this.setupVanSelectionMonitoring();
        
        // Load initial profile
        this.loadAppropriateProfile();
        
        // Setup toggle functionality
        this.setupFormToggle();
        
        // Check if we should use dynamic forms by default
        const useDynamicForm = this.shouldUseDynamicForm();
        
        if (useDynamicForm) {
            this.enableDynamicForm();
        } else {
            console.log('Using existing static form');
        }
    }

    setupVanSelectionMonitoring() {
        // Monitor van selection changes
        const vanSelectors = document.querySelectorAll('[data-van-id], .van-card, .van-selector');
        vanSelectors.forEach(selector => {
            selector.addEventListener('click', (e) => {
                const vanId = e.target.dataset.vanId || e.target.closest('[data-van-id]')?.dataset.vanId;
                if (vanId && vanId !== this.selectedVanId) {
                    this.handleVanSelection(vanId);
                }
            });
        });

        // Monitor URL parameters for van selection
        const urlParams = new URLSearchParams(window.location.search);
        const vanParam = urlParams.get('van');
        if (vanParam) {
            this.handleVanSelection(vanParam);
        }
    }

    handleVanSelection(vanId) {
        console.log('Van selected:', vanId);
        this.selectedVanId = vanId;
        this.loadAppropriateProfile();
        
        // Update form if dynamic form is active
        if (this.isIntegrated) {
            this.enableDynamicForm();
        }
    }

    loadAppropriateProfile() {
        if (this.selectedVanId) {
            // Get profile for specific van
            this.currentProfile = this.profileManager.getProfileForVan(this.selectedVanId);
        } else {
            // Use active/default profile
            this.currentProfile = this.profileManager.getActiveProfile();
        }

        console.log('Loaded profile:', this.currentProfile?.name || 'default');
        
        if (this.currentProfile) {
            this.formGenerator = new BookingFormGenerator(
                this.currentProfile.formConfig,
                this.currentProfile.pricingConfig
            );
        }
    }

    shouldUseDynamicForm() {
        // Check localStorage setting or URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const dynamicParam = urlParams.get('dynamic');
        const storedSetting = localStorage.getItem('use_dynamic_form');
        
        // Use dynamic form if explicitly requested or if setting is saved
        return dynamicParam === 'true' || storedSetting === 'true';
    }

    waitForBookingSection() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const bookingForm = document.getElementById('bookingForm');
                if (bookingForm) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 5000);
        });
    }

    integrateVanSelection() {
        // Connect dynamic form with existing van selection functionality
        const vanCards = document.querySelectorAll('.van-card');
        vanCards.forEach(card => {
            card.addEventListener('click', () => {
                const vanId = card.dataset.vanId;
                const vanType = card.dataset.vanType;
                const price = card.dataset.price;
                
                // Update hidden fields in dynamic form if they exist
                const dynamicForm = document.getElementById('dynamicBookingForm');
                if (dynamicForm) {
                    // Create or update van selection fields
                    this.updateVanSelection(vanId, vanType, price);
                }
            });
        });
    }

    updateVanSelection(vanId, vanType, price) {
        // Update or create hidden fields for van selection
        let vanIdField = document.getElementById('selected-van-id');
        let vanTypeField = document.getElementById('selected-van-type');
        
        if (!vanIdField) {
            vanIdField = document.createElement('input');
            vanIdField.type = 'hidden';
            vanIdField.id = 'selected-van-id';
            vanIdField.name = 'van-id';
            document.getElementById('dynamicBookingForm').appendChild(vanIdField);
        }
        
        if (!vanTypeField) {
            vanTypeField = document.createElement('input');
            vanTypeField.type = 'hidden';
            vanTypeField.id = 'selected-van-type';
            vanTypeField.name = 'van-type';
            document.getElementById('dynamicBookingForm').appendChild(vanTypeField);
        }
        
        vanIdField.value = vanId;
        vanTypeField.value = vanType;
        
        // Update pricing in dynamic form
        this.updateDynamicPricing(price);
    }

    updateDynamicPricing(basePrice) {
        // Update pricing displays in the dynamic form
        const totalCostDisplay = document.getElementById('total-cost-display');
        const depositDisplay = document.getElementById('deposit-display');
        
        if (totalCostDisplay) {
            // Calculate total with deposit
            const deposit = 50; // CHF
            const total = parseInt(basePrice) + deposit;
            totalCostDisplay.textContent = `CHF ${total}.-`;
        }
        
        if (depositDisplay) {
            depositDisplay.textContent = 'CHF 50.-';
        }
        
        // Update summary sections too
        this.updateSummaryPricing(basePrice);
    }

    updateSummaryPricing(basePrice) {
        const deductibleSummary = document.getElementById('deductible-summary');
        const depositSummary = document.getElementById('deposit-summary');
        const totalSummary = document.getElementById('total-summary');
        
        // Check if deductible reduction is selected
        const deductibleReduction = document.querySelector('input[name="deductibleReduction"]:checked');
        const hasReduction = deductibleReduction && deductibleReduction.value === 'yes';
        
        const deposit = 50;
        const reductionCost = hasReduction ? Math.round(parseInt(basePrice) * 0.1) : 0;
        const total = parseInt(basePrice) + deposit + reductionCost;
        
        if (deductibleSummary) {
            deductibleSummary.textContent = hasReduction ? `CHF ${reductionCost}.-` : 'CHF 0.-';
        }
        
        if (depositSummary) {
            depositSummary.textContent = 'CHF 50.-';
        }
        
        if (totalSummary) {
            totalSummary.textContent = `CHF ${total}.-`;
        }
    }

    integrateCalendar() {
        // Connect dynamic form with existing calendar functionality
        // This would integrate with the existing calendar selection logic
        console.log('Calendar integration placeholder - would connect with existing calendar');
    }

    setupFormToggle() {
        const staticBtn = document.getElementById('toggleStatic');
        const dynamicBtn = document.getElementById('toggleDynamic');
        
        if (staticBtn && dynamicBtn) {
            staticBtn.addEventListener('click', () => {
                this.switchToStaticForm();
                this.updateToggleButtons('static');
            });
            
            dynamicBtn.addEventListener('click', () => {
                this.switchToDynamicForm();
                this.updateToggleButtons('dynamic');
            });
        }
    }

    updateToggleButtons(activeType) {
        const staticBtn = document.getElementById('toggleStatic');
        const dynamicBtn = document.getElementById('toggleDynamic');
        
        if (staticBtn && dynamicBtn) {
            // Reset both buttons
            staticBtn.style.background = 'white';
            staticBtn.style.color = '#374151';
            dynamicBtn.style.background = 'white';
            dynamicBtn.style.color = '#374151';
            
            // Activate the selected button
            if (activeType === 'static') {
                staticBtn.style.background = '#3b82f6';
                staticBtn.style.color = 'white';
            } else {
                dynamicBtn.style.background = '#3b82f6';
                dynamicBtn.style.color = 'white';
            }
        }
    }

    switchToStaticForm() {
        const staticForm = document.getElementById('bookingForm');
        const dynamicContainer = document.getElementById('dynamicBookingContainer');
        
        if (staticForm) {
            staticForm.style.display = 'block';
        }
        if (dynamicContainer) {
            dynamicContainer.style.display = 'none';
        }
        
        this.isIntegrated = false;
        localStorage.setItem('use_dynamic_form', 'false');
        this.showFormNotification('Switched to static form', 'info');
    }

    switchToDynamicForm() {
        if (!this.isIntegrated) {
            this.enableDynamicForm();
        }
        
        const staticForm = document.getElementById('bookingForm');
        const dynamicContainer = document.getElementById('dynamicBookingContainer');
        
        if (staticForm) {
            staticForm.style.display = 'none';
        }
        if (dynamicContainer) {
            dynamicContainer.style.display = 'block';
        }
        
        localStorage.setItem('use_dynamic_form', 'true');
        this.updateToggleButtons('dynamic');
        this.showFormNotification('Switched to dynamic form', 'success');
    }

    async enableDynamicForm() {
        console.log('Enabling dynamic form with current profile...');
        
        if (!this.formGenerator) {
            console.warn('No form generator available - loading default profile');
            this.loadAppropriateProfile();
        }

        if (!this.formGenerator) {
            console.error('Failed to initialize form generator');
            return;
        }

        await this.waitForBookingSection();
        
        // Get or create dynamic container
        let dynamicContainer = document.getElementById('dynamicBookingContainer');
        if (!dynamicContainer) {
            // Create container next to existing form
            const existingForm = document.getElementById('bookingForm');
            if (!existingForm) {
                console.error('Could not find existing booking form');
                return;
            }
            
            dynamicContainer = document.createElement('div');
            dynamicContainer.id = 'dynamicBookingContainer';
            dynamicContainer.style.display = 'none';
            existingForm.parentNode.insertBefore(dynamicContainer, existingForm.nextSibling);
        }
        
        // Generate form HTML with current profile
        const formHTML = this.formGenerator.generateFormHTML();
        dynamicContainer.innerHTML = formHTML;
        
        // Initialize form functionality
        this.formGenerator.initializeFormElements();
        this.integrateVanSelection();
        this.integrateCalendar();
        
        this.isIntegrated = true;
        
        const profileName = this.currentProfile?.name || 'default';
        this.showFormNotification(`Dynamic form loaded with "${profileName}" profile`, 'success');
        
        console.log('Dynamic form enabled successfully');
    }

    showFormNotification(message, type = 'info') {
        // Create or update notification
        let notification = document.getElementById('form-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'form-notification';
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                transform: translateX(100%);
            `;
            document.body.appendChild(notification);
        }
        
        // Set content and style based on type
        notification.textContent = message;
        const styles = {
            info: { background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' },
            success: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
            warning: { background: '#fffbeb', color: '#d97706', border: '1px solid #fed7aa' },
            error: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
        };
        
        const style = styles[type] || styles.info;
        Object.assign(notification.style, style);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }
}

// Initialize integration
new BookingFormIntegration();
