// BookingProfileUIManager.js - UI Controller for Booking Form Profiles
export class BookingProfileUIManager {
    constructor(profileManager) {
        this.profileManager = profileManager;
        this.currentEditingProfile = null;
        this.currentTab = 'manage-profiles';
        this.init();
    }

    init() {
        console.log('Initializing Booking Profile UI Manager...');
        this.bindEvents();
        this.loadProfiles();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.profile-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Create new profile
        const createBtn = document.getElementById('create-profile-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.showCreateProfileModal());
        }

        // Import profile
        const importBtn = document.getElementById('import-profile-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.showImportProfileModal());
        }

        // Profile search and filter
        const searchInput = document.getElementById('profile-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProfiles(e.target.value);
            });
        }

        const filterSelect = document.getElementById('profile-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterProfiles(null, e.target.value);
            });
        }

        // Editor events
        this.bindEditorEvents();

        // Van association events
        this.bindVanAssociationEvents();
    }

    bindEditorEvents() {
        // Profile selector in editor
        const editSelect = document.getElementById('edit-profile-select');
        if (editSelect) {
            editSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadProfileIntoEditor(e.target.value);
                }
            });
        }

        // Save profile
        const saveBtn = document.getElementById('save-profile-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCurrentProfile());
        }

        // Duplicate profile
        const duplicateBtn = document.getElementById('duplicate-profile-btn');
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', () => this.duplicateCurrentProfile());
        }

        // Delete profile
        const deleteBtn = document.getElementById('delete-profile-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteCurrentProfile());
        }

        // Section toggles
        document.querySelectorAll('.section-expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.section-config-editor');
                const fields = section.querySelector('.section-fields-editor');
                const isExpanded = fields.classList.contains('expanded');
                
                if (isExpanded) {
                    fields.classList.remove('expanded');
                    e.target.classList.remove('expanded');
                } else {
                    fields.classList.add('expanded');
                    e.target.classList.add('expanded');
                }
            });
        });

        // Add field buttons
        document.querySelectorAll('.add-field-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showAddFieldModal(section);
            });
        });

        // Add extra/discount buttons
        const addExtraBtn = document.getElementById('add-extra-btn');
        if (addExtraBtn) {
            addExtraBtn.addEventListener('click', () => this.showAddExtraModal());
        }

        const addDiscountBtn = document.getElementById('add-discount-btn');
        if (addDiscountBtn) {
            addDiscountBtn.addEventListener('click', () => this.showAddDiscountModal());
        }

        // Preview buttons
        const previewBtn = document.getElementById('preview-full-form-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewFormInNewTab());
        }

        const testBtn = document.getElementById('test-form-btn');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testCurrentForm());
        }
    }

    bindVanAssociationEvents() {
        // Default profile selector
        const defaultSelect = document.getElementById('default-profile-select');
        if (defaultSelect) {
            defaultSelect.addEventListener('change', (e) => {
                this.setDefaultProfile(e.target.value);
            });
        }

        // Bulk assignment
        const bulkAssignBtn = document.getElementById('bulk-assign-btn');
        if (bulkAssignBtn) {
            bulkAssignBtn.addEventListener('click', () => this.performBulkAssignment());
        }

        // Save associations
        const saveAssociationsBtn = document.getElementById('save-associations-btn');
        if (saveAssociationsBtn) {
            saveAssociationsBtn.addEventListener('click', () => this.saveAllAssociations());
        }

        // Reset associations
        const resetAssociationsBtn = document.getElementById('reset-associations-btn');
        if (resetAssociationsBtn) {
            resetAssociationsBtn.addEventListener('click', () => this.resetAssociations());
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.profile-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Load appropriate content
        switch (tabName) {
            case 'manage-profiles':
                this.loadProfiles();
                break;
            case 'profile-editor':
                this.loadProfileEditor();
                break;
            case 'van-associations':
                this.loadVanAssociations();
                break;
        }
    }

    // Manage Profiles Tab
    loadProfiles() {
        const grid = document.getElementById('profiles-grid');
        if (!grid) return;

        const profiles = this.profileManager.getAllProfiles();
        
        if (profiles.length === 0) {
            grid.innerHTML = `
                <div class="loading-placeholder">
                    <i class="fas fa-clipboard-list" style="font-size: 48px; color: #d1d5db; margin-bottom: 16px;"></i>
                    <h3>No Profiles Found</h3>
                    <p>Create your first booking form profile to get started.</p>
                    <button class="btn btn-primary" onclick="document.getElementById('create-profile-btn').click()">
                        <i class="fas fa-plus"></i> Create Profile
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = profiles.map(profile => this.renderProfileCard(profile)).join('');
        this.bindProfileCardEvents();
    }

    renderProfileCard(profile) {
        const isDefault = this.profileManager.activeProfile === profile.name;
        const fieldCount = this.countProfileFields(profile);
        const vanCount = profile.associatedVans ? profile.associatedVans.length : 0;

        return `
            <div class="profile-card ${isDefault ? 'default' : ''}" data-profile="${profile.name}">
                <div class="profile-card-header">
                    <div class="profile-title">${profile.name}</div>
                    <div class="profile-menu">
                        <button class="btn-icon" onclick="profileUI.showProfileMenu('${profile.name}', event)">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>
                
                <div class="profile-description">
                    ${profile.description || 'No description provided'}
                </div>
                
                <div class="profile-badges">
                    ${isDefault ? '<span class="profile-badge default">Default</span>' : ''}
                    <span class="profile-badge active">Active</span>
                </div>
                
                <div class="profile-stats">
                    <span><i class="fas fa-list"></i> ${fieldCount} fields</span>
                    <span><i class="fas fa-truck"></i> ${vanCount} vans</span>
                </div>
                
                <div class="profile-actions">
                    <button class="btn btn-sm btn-primary" onclick="profileUI.editProfile('${profile.name}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="profileUI.duplicateProfile('${profile.name}')">
                        <i class="fas fa-copy"></i> Duplicate
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="profileUI.previewProfile('${profile.name}')">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                </div>
            </div>
        `;
    }

    countProfileFields(profile) {
        let count = 0;
        if (profile.formConfig && profile.formConfig.sections) {
            profile.formConfig.sections.forEach(section => {
                if (section.fields) {
                    count += section.fields.filter(field => field.enabled).length;
                }
            });
        }
        return count;
    }

    bindProfileCardEvents() {
        // Make profile cards globally accessible for onclick handlers
        window.profileUI = this;
    }

    showProfileMenu(profileName, event) {
        event.stopPropagation();
        // TODO: Implement context menu
        console.log('Show context menu for profile:', profileName);
    }

    editProfile(profileName) {
        this.switchTab('profile-editor');
        setTimeout(() => {
            const editSelect = document.getElementById('edit-profile-select');
            if (editSelect) {
                editSelect.value = profileName;
                this.loadProfileIntoEditor(profileName);
            }
        }, 100);
    }

    duplicateProfile(profileName) {
        const newName = prompt(`Enter name for duplicated profile:`, `${profileName} Copy`);
        if (newName && newName.trim()) {
            try {
                this.profileManager.duplicateProfile(profileName, newName.trim());
                this.loadProfiles();
                this.showNotification(`Profile "${newName}" created successfully`, 'success');
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        }
    }

    previewProfile(profileName) {
        const profile = this.profileManager.getProfile(profileName);
        if (profile) {
            // Open preview in new tab
            const url = `test-form-generator.html?profile=${encodeURIComponent(profileName)}`;
            window.open(url, '_blank');
        }
    }

    filterProfiles(searchTerm, filterType) {
        const cards = document.querySelectorAll('.profile-card');
        cards.forEach(card => {
            const profileName = card.dataset.profile.toLowerCase();
            const isVisible = this.shouldShowProfile(profileName, searchTerm, filterType);
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    shouldShowProfile(profileName, searchTerm, filterType) {
        // Search filter
        if (searchTerm && !profileName.includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Type filter
        if (filterType && filterType !== 'all') {
            const profile = this.profileManager.getProfile(profileName);
            const isDefault = this.profileManager.activeProfile === profileName;
            
            switch (filterType) {
                case 'default':
                    return isDefault;
                case 'active':
                    return true; // All profiles are currently active
                case 'inactive':
                    return false; // No inactive profiles yet
                default:
                    return true;
            }
        }

        return true;
    }

    // Profile Editor Tab
    loadProfileEditor() {
        this.populateProfileSelector();
        this.clearEditor();
    }

    populateProfileSelector() {
        const select = document.getElementById('edit-profile-select');
        if (!select) return;

        const profiles = this.profileManager.getAllProfiles();
        select.innerHTML = '<option value="">Select a profile...</option>' +
            profiles.map(profile => 
                `<option value="${profile.name}">${profile.name}</option>`
            ).join('');
    }

    loadProfileIntoEditor(profileName) {
        const profile = this.profileManager.getProfile(profileName);
        if (!profile) return;

        this.currentEditingProfile = profileName;

        // Load basic information
        document.getElementById('profile-name').value = profile.name;
        document.getElementById('profile-description').value = profile.description || '';
        document.getElementById('profile-is-default').checked = this.profileManager.activeProfile === profileName;
        document.getElementById('profile-is-active').checked = true; // All profiles are active for now

        // Load form configuration
        this.loadFormConfigIntoEditor(profile.formConfig);

        // Load pricing configuration
        this.loadPricingConfigIntoEditor(profile.pricingConfig);

        // Update preview
        this.updateFormPreview();
    }

    loadFormConfigIntoEditor(formConfig) {
        if (!formConfig || !formConfig.sections) return;

        formConfig.sections.forEach(section => {
            // Enable/disable section
            const sectionCheckbox = document.getElementById(`edit-section-${section.id}`);
            if (sectionCheckbox) {
                sectionCheckbox.checked = section.enabled;
            }

            // Load fields
            const fieldsList = document.querySelector(`[data-section="${section.id}"] .fields-list`);
            if (fieldsList && section.fields) {
                fieldsList.innerHTML = section.fields.map(field => 
                    this.renderFieldItem(field, section.id)
                ).join('');
            }
        });
    }

    renderFieldItem(field, sectionId) {
        return `
            <div class="field-item" data-field="${field.id}">
                <div class="field-drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="field-info">
                    <div class="field-name">${field.label}</div>
                    <div class="field-type">${field.type} ${field.required ? '(required)' : ''}</div>
                </div>
                <div class="field-actions">
                    <button class="edit-btn" onclick="profileUI.editField('${sectionId}', '${field.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="profileUI.deleteField('${sectionId}', '${field.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    loadPricingConfigIntoEditor(pricingConfig) {
        if (!pricingConfig) return;

        // Load basic pricing
        const depositPrice = pricingConfig.deposit?.price || '';
        document.getElementById('security-deposit').value = depositPrice;

        // For now, use a simplified base price (average of time slots)
        if (pricingConfig.timeSlots) {
            const timeSlotPrices = Object.values(pricingConfig.timeSlots).map(slot => slot.price);
            const avgPrice = timeSlotPrices.length > 0 ? timeSlotPrices.reduce((a, b) => a + b) / timeSlotPrices.length : 0;
            document.getElementById('base-price').value = Math.round(avgPrice);
        }

        // Load extras/add-ons
        this.loadExtrasIntoEditor(pricingConfig.addOns || {});

        // Load time slot pricing (display in a summary format)
        this.displayTimeSlotPricing(pricingConfig.timeSlots || {});
        
        // Load destination pricing (display in a summary format)
        this.displayDestinationPricing(pricingConfig.destinations || {});
    }

    displayTimeSlotPricing(timeSlots) {
        // Create a summary display of time slot pricing
        const container = document.getElementById('profile-extras-list');
        if (!container) return;

        let timeSlotHTML = '';
        Object.entries(timeSlots).forEach(([slot, config]) => {
            timeSlotHTML += `
                <div class="pricing-item" data-type="timeslot" data-key="${slot}">
                    <div class="pricing-info">
                        <div class="pricing-name">Time Slot: ${slot}</div>
                        <div class="pricing-price">${config.price} ${config.currency}</div>
                    </div>
                    <div class="pricing-actions">
                        <button class="edit-btn" onclick="profileUI.editTimeSlotPrice('${slot}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        if (timeSlotHTML) {
            container.innerHTML = '<h6>Time Slot Pricing</h6>' + timeSlotHTML + container.innerHTML;
        }
    }

    displayDestinationPricing(destinations) {
        // Create a summary display of destination pricing
        const container = document.getElementById('profile-extras-list');
        if (!container) return;

        let destinationHTML = '';
        Object.entries(destinations).forEach(([dest, config]) => {
            if (config.price > 0) { // Only show non-zero destination prices
                destinationHTML += `
                    <div class="pricing-item" data-type="destination" data-key="${dest}">
                        <div class="pricing-info">
                            <div class="pricing-name">Destination: ${dest}</div>
                            <div class="pricing-price">${config.price} ${config.currency}</div>
                        </div>
                        <div class="pricing-actions">
                            <button class="edit-btn" onclick="profileUI.editDestinationPrice('${dest}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                `;
            }
        });

        if (destinationHTML) {
            const existingContent = container.innerHTML;
            container.innerHTML = '<h6>Destination Pricing</h6>' + destinationHTML + existingContent;
        }
    }

    loadExtrasIntoEditor(addOns) {
        const extrasList = document.getElementById('profile-extras-list');
        if (!extrasList) return;

        extrasList.innerHTML = Object.entries(addOns).map(([key, config]) => `
            <div class="extra-item" data-extra="${key}">
                <div class="extra-info">
                    <div class="extra-name">${this.formatExtraName(key)}</div>
                    <div class="extra-price">${config.price} ${config.currency}</div>
                </div>
                <div class="extra-actions">
                    <button class="edit-btn" onclick="profileUI.editExtra('${key}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="profileUI.deleteExtra('${key}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatExtraName(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    // Pricing editing helper methods
    editTimeSlotPrice(slot) {
        const profile = this.profileManager.getProfile(this.currentEditingProfile);
        if (!profile || !profile.pricingConfig.timeSlots[slot]) return;

        const currentPrice = profile.pricingConfig.timeSlots[slot].price;
        const newPrice = prompt(`Enter new price for time slot ${slot}:`, currentPrice);
        
        if (newPrice !== null && !isNaN(newPrice) && newPrice >= 0) {
            profile.pricingConfig.timeSlots[slot].price = parseFloat(newPrice);
            this.loadPricingConfigIntoEditor(profile.pricingConfig);
            this.updateFormPreview();
            this.showNotification(`Time slot price updated for ${slot}`, 'success');
        }
    }

    editDestinationPrice(destination) {
        const profile = this.profileManager.getProfile(this.currentEditingProfile);
        if (!profile || !profile.pricingConfig.destinations[destination]) return;

        const currentPrice = profile.pricingConfig.destinations[destination].price;
        const newPrice = prompt(`Enter new price for destination ${destination}:`, currentPrice);
        
        if (newPrice !== null && !isNaN(newPrice) && newPrice >= 0) {
            profile.pricingConfig.destinations[destination].price = parseFloat(newPrice);
            this.loadPricingConfigIntoEditor(profile.pricingConfig);
            this.updateFormPreview();
            this.showNotification(`Destination price updated for ${destination}`, 'success');
        }
    }

    editExtra(extraKey) {
        const profile = this.profileManager.getProfile(this.currentEditingProfile);
        if (!profile || !profile.pricingConfig.addOns[extraKey]) return;

        const currentPrice = profile.pricingConfig.addOns[extraKey].price;
        const newPrice = prompt(`Enter new price for ${this.formatExtraName(extraKey)}:`, currentPrice);
        
        if (newPrice !== null && !isNaN(newPrice) && newPrice >= 0) {
            profile.pricingConfig.addOns[extraKey].price = parseFloat(newPrice);
            this.loadPricingConfigIntoEditor(profile.pricingConfig);
            this.updateFormPreview();
            this.showNotification(`Extra price updated for ${this.formatExtraName(extraKey)}`, 'success');
        }
    }

    deleteExtra(extraKey) {
        if (confirm(`Are you sure you want to remove the extra "${this.formatExtraName(extraKey)}"?`)) {
            const profile = this.profileManager.getProfile(this.currentEditingProfile);
            if (profile && profile.pricingConfig.addOns[extraKey]) {
                delete profile.pricingConfig.addOns[extraKey];
                this.loadPricingConfigIntoEditor(profile.pricingConfig);
                this.updateFormPreview();
                this.showNotification(`Extra "${this.formatExtraName(extraKey)}" removed`, 'success');
            }
        }
    }

    // Enhanced form preview update with pricing
    updateFormPreview() {
        if (!this.currentEditingProfile) return;

        const profile = this.profileManager.getProfile(this.currentEditingProfile);
        if (!profile) return;

        // Use the BookingFormGenerator to create preview with pricing
        if (window.BookingFormGenerator) {
            const generator = new window.BookingFormGenerator(profile.formConfig, profile.pricingConfig);
            const previewContainer = document.getElementById('profile-form-preview');
            if (previewContainer) {
                previewContainer.innerHTML = generator.generateFormHTML();
                
                // Initialize the form elements for proper pricing calculation
                setTimeout(() => {
                    generator.initializeFormElements();
                }, 100);
            }
        }
    }

    saveCurrentProfile() {
        if (!this.currentEditingProfile) {
            this.showNotification('No profile selected for editing', 'error');
            return;
        }

        try {
            const updates = this.gatherProfileUpdates();
            this.profileManager.updateProfile(this.currentEditingProfile, updates);
            this.profileManager.saveProfiles();
            
            this.showNotification('Profile saved successfully', 'success');
            this.loadProfiles(); // Refresh the profiles list
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    gatherProfileUpdates() {
        const name = document.getElementById('profile-name').value;
        const description = document.getElementById('profile-description').value;
        const isDefault = document.getElementById('profile-is-default').checked;
        const isActive = document.getElementById('profile-is-active').checked;

        // Gather form configuration
        const formConfig = this.gatherFormConfiguration();
        
        // Gather pricing configuration
        const pricingConfig = this.gatherPricingConfiguration();

        const updates = {
            name: name,
            description: description,
            formConfig: formConfig,
            pricingConfig: pricingConfig
        };

        // Handle default profile setting
        if (isDefault) {
            this.profileManager.setActiveProfile(name);
        }

        return updates;
    }

    gatherFormConfiguration() {
        // This would gather the form configuration from the editor
        // For now, return the current profile's form config
        if (this.currentEditingProfile) {
            const profile = this.profileManager.getProfile(this.currentEditingProfile);
            return profile?.formConfig || {};
        }
        return {};
    }

    gatherPricingConfiguration() {
        const basePrice = parseFloat(document.getElementById('base-price').value) || 0;
        const cleaningFee = parseFloat(document.getElementById('cleaning-fee').value) || 0;
        const deposit = parseFloat(document.getElementById('security-deposit').value) || 50;

        // Get current profile's pricing config as base
        let pricingConfig = {};
        if (this.currentEditingProfile) {
            const profile = this.profileManager.getProfile(this.currentEditingProfile);
            pricingConfig = profile?.pricingConfig || {};
        }

        // Update basic pricing values
        if (basePrice > 0) {
            // Update all time slots with the new base price (simplified approach)
            if (pricingConfig.timeSlots) {
                Object.keys(pricingConfig.timeSlots).forEach(slot => {
                    pricingConfig.timeSlots[slot].price = basePrice;
                });
            }
        }

        // Update deposit
        if (!pricingConfig.deposit) {
            pricingConfig.deposit = {};
        }
        pricingConfig.deposit.price = deposit;
        pricingConfig.deposit.currency = 'CHF';

        // Update cleaning fee if provided
        if (cleaningFee > 0) {
            if (!pricingConfig.addOns) {
                pricingConfig.addOns = {};
            }
            pricingConfig.addOns.cleaningFee = {
                price: cleaningFee,
                currency: 'CHF'
            };
        }

        return pricingConfig;
    }

    duplicateCurrentProfile() {
        if (!this.currentEditingProfile) {
            this.showNotification('No profile selected', 'error');
            return;
        }

        this.duplicateProfile(this.currentEditingProfile);
    }

    deleteCurrentProfile() {
        if (!this.currentEditingProfile) {
            this.showNotification('No profile selected', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete the profile "${this.currentEditingProfile}"?`)) {
            try {
                this.profileManager.deleteProfile(this.currentEditingProfile);
                this.currentEditingProfile = null;
                this.clearEditor();
                this.loadProfiles();
                this.showNotification('Profile deleted successfully', 'success');
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        }
    }

    clearEditor() {
        // Clear all form fields
        const inputs = document.querySelectorAll('#profile-editor-form input, #profile-editor-form textarea, #profile-editor-form select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });

        // Clear dynamic lists
        document.getElementById('profile-extras-list').innerHTML = '';
        document.getElementById('profile-discounts-list').innerHTML = '';
        document.getElementById('profile-form-preview').innerHTML = '<p class="text-muted">Select a profile to see preview</p>';

        this.currentEditingProfile = null;
    }

    // Van Associations Tab
    loadVanAssociations() {
        this.populateDefaultProfileSelector();
        this.loadVanAssociationsList();
        this.loadBulkAssignmentUI();
    }

    populateDefaultProfileSelector() {
        const select = document.getElementById('default-profile-select');
        if (!select) return;

        const profiles = this.profileManager.getAllProfiles();
        const currentDefault = this.profileManager.activeProfile;

        select.innerHTML = '<option value="">Select default profile...</option>' +
            profiles.map(profile => 
                `<option value="${profile.name}" ${profile.name === currentDefault ? 'selected' : ''}>${profile.name}</option>`
            ).join('');
    }

    loadVanAssociationsList() {
        const list = document.getElementById('van-associations-list');
        if (!list) return;

        // Get vans from the VanManager if available
        const vans = this.getAvailableVans();
        
        list.innerHTML = vans.map(van => {
            const associatedProfile = this.profileManager.getProfileForVan(van.id);
            return `
                <div class="van-association-item" data-van="${van.id}">
                    <div class="van-info">
                        <div class="van-name">${van.name}</div>
                        <div class="van-type">${van.type || 'Standard'}</div>
                    </div>
                    <select class="profile-select" data-van="${van.id}">
                        <option value="">Use default profile</option>
                        ${this.profileManager.getAllProfiles().map(profile => 
                            `<option value="${profile.name}" ${associatedProfile && associatedProfile.name === profile.name ? 'selected' : ''}>${profile.name}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        }).join('');

        // Bind change events
        list.querySelectorAll('.profile-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const vanId = e.target.dataset.van;
                const profileName = e.target.value;
                this.updateVanAssociation(vanId, profileName);
            });
        });
    }

    getAvailableVans() {
        // Try to get vans from the admin dashboard
        if (window.adminDashboard && window.adminDashboard.vanManager) {
            return window.adminDashboard.vanManager.vans || [];
        }

        // Fallback mock data
        return [
            { id: 'van1', name: 'Adventure Van', type: 'Compact' },
            { id: 'van2', name: 'Family Explorer', type: 'Large' },
            { id: 'van3', name: 'Solo Traveler', type: 'Compact' }
        ];
    }

    loadBulkAssignmentUI() {
        const bulkSelect = document.getElementById('bulk-profile-select');
        const vanCheckboxes = document.getElementById('bulk-van-checkboxes');
        
        if (!bulkSelect || !vanCheckboxes) return;

        // Populate profile selector
        const profiles = this.profileManager.getAllProfiles();
        bulkSelect.innerHTML = '<option value="">Select profile...</option>' +
            profiles.map(profile => 
                `<option value="${profile.name}">${profile.name}</option>`
            ).join('');

        // Populate van checkboxes
        const vans = this.getAvailableVans();
        vanCheckboxes.innerHTML = vans.map(van => `
            <div class="van-checkbox">
                <input type="checkbox" id="bulk-van-${van.id}" value="${van.id}">
                <label for="bulk-van-${van.id}">${van.name}</label>
            </div>
        `).join('');
    }

    updateVanAssociation(vanId, profileName) {
        // Remove van from all profiles first
        this.profileManager.getAllProfiles().forEach(profile => {
            this.profileManager.removeVanFromProfile(vanId, profile.name);
        });

        // Associate with new profile if selected
        if (profileName) {
            this.profileManager.associateVanWithProfile(vanId, profileName);
        }
    }

    setDefaultProfile(profileName) {
        if (profileName) {
            this.profileManager.setActiveProfile(profileName);
            this.showNotification(`Default profile set to "${profileName}"`, 'success');
        }
    }

    performBulkAssignment() {
        const profileName = document.getElementById('bulk-profile-select').value;
        const selectedVans = Array.from(document.querySelectorAll('#bulk-van-checkboxes input:checked'))
            .map(checkbox => checkbox.value);

        if (!profileName) {
            this.showNotification('Please select a profile', 'error');
            return;
        }

        if (selectedVans.length === 0) {
            this.showNotification('Please select at least one van', 'error');
            return;
        }

        try {
            selectedVans.forEach(vanId => {
                this.updateVanAssociation(vanId, profileName);
            });

            this.loadVanAssociationsList(); // Refresh the list
            this.showNotification(`Assigned ${selectedVans.length} vans to "${profileName}"`, 'success');
            
            // Clear selections
            document.getElementById('bulk-profile-select').value = '';
            document.querySelectorAll('#bulk-van-checkboxes input').forEach(cb => cb.checked = false);
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    saveAllAssociations() {
        try {
            this.profileManager.saveProfiles();
            this.showNotification('All associations saved successfully', 'success');
        } catch (error) {
            this.showNotification('Failed to save associations: ' + error.message, 'error');
        }
    }

    resetAssociations() {
        if (confirm('Are you sure you want to reset all associations to the last saved state?')) {
            this.profileManager.loadProfiles().then(() => {
                this.loadVanAssociations();
                this.showNotification('Associations reset to saved state', 'info');
            });
        }
    }

    // Modal Methods (simplified for now)
    showCreateProfileModal() {
        const name = prompt('Enter profile name:');
        if (name && name.trim()) {
            try {
                this.profileManager.createProfile(name.trim());
                this.loadProfiles();
                this.showNotification(`Profile "${name}" created successfully`, 'success');
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        }
    }

    showImportProfileModal() {
        // TODO: Implement import functionality
        this.showNotification('Import functionality coming soon', 'info');
    }

    showAddFieldModal(section) {
        // TODO: Implement add field modal
        console.log('Add field to section:', section);
    }

    showAddExtraModal() {
        // TODO: Implement add extra modal
        console.log('Add extra modal');
    }

    showAddDiscountModal() {
        // TODO: Implement add discount modal
        console.log('Add discount modal');
    }

    previewFormInNewTab() {
        if (this.currentEditingProfile) {
            this.previewProfile(this.currentEditingProfile);
        } else {
            this.showNotification('No profile selected', 'error');
        }
    }

    testCurrentForm() {
        // TODO: Implement form testing
        this.showNotification('Form testing coming soon', 'info');
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        // Create a simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(notificationContainer);
        }

        notificationContainer.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
}

// Make it globally available
window.BookingProfileUIManager = BookingProfileUIManager;
