// BookingFormProfileManager.js - Manages multiple booking form profiles
export class BookingFormProfileManager {
    constructor() {
        this.profiles = new Map();
        this.activeProfile = null;
        this.defaultProfiles = this.getDefaultProfiles();
        this.init();
    }

    async init() {
        console.log('Initializing Booking Form Profile Manager...');
        
        // Try to load profiles from backend first, then localStorage
        const loaded = await this.loadProfiles();
        
        if (!loaded || this.profiles.size === 0) {
            console.log('No profiles found, creating default profiles...');
            this.createDefaultProfiles();
            await this.saveProfiles();
        }
        
        // Set active profile if none set
        if (!this.activeProfile && this.profiles.size > 0) {
            this.activeProfile = Array.from(this.profiles.keys())[0];
        }
    }

    // Profile CRUD Operations
    createProfile(name, config = null) {
        if (this.profiles.has(name)) {
            throw new Error(`Profile "${name}" already exists`);
        }

        const profile = {
            id: this.generateProfileId(),
            name: name,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            formConfig: config || this.getDefaultFormConfig(),
            pricingConfig: this.getDefaultPricingConfig(),
            associatedVans: []
        };

        this.profiles.set(name, profile);
        console.log(`Created profile: ${name}`);
        return profile;
    }

    updateProfile(name, updates) {
        const profile = this.profiles.get(name);
        if (!profile) {
            throw new Error(`Profile "${name}" not found`);
        }

        // Update profile with new data
        Object.assign(profile, updates, {
            modified: new Date().toISOString()
        });

        this.profiles.set(name, profile);
        console.log(`Updated profile: ${name}`);
        return profile;
    }

    deleteProfile(name) {
        if (!this.profiles.has(name)) {
            throw new Error(`Profile "${name}" not found`);
        }

        if (this.profiles.size <= 1) {
            throw new Error('Cannot delete the last profile');
        }

        this.profiles.delete(name);
        
        // If deleted profile was active, set new active profile
        if (this.activeProfile === name) {
            this.activeProfile = Array.from(this.profiles.keys())[0];
        }

        console.log(`Deleted profile: ${name}`);
        return true;
    }

    duplicateProfile(originalName, newName) {
        const original = this.profiles.get(originalName);
        if (!original) {
            throw new Error(`Profile "${originalName}" not found`);
        }

        if (this.profiles.has(newName)) {
            throw new Error(`Profile "${newName}" already exists`);
        }

        // Deep clone the original profile
        const duplicate = JSON.parse(JSON.stringify(original));
        duplicate.id = this.generateProfileId();
        duplicate.name = newName;
        duplicate.created = new Date().toISOString();
        duplicate.modified = new Date().toISOString();
        duplicate.associatedVans = []; // Reset van associations

        this.profiles.set(newName, duplicate);
        console.log(`Duplicated profile: ${originalName} → ${newName}`);
        return duplicate;
    }

    // Profile Access
    getProfile(name) {
        return this.profiles.get(name);
    }

    getAllProfiles() {
        return Array.from(this.profiles.values());
    }

    getProfileNames() {
        return Array.from(this.profiles.keys());
    }

    setActiveProfile(name) {
        if (!this.profiles.has(name)) {
            throw new Error(`Profile "${name}" not found`);
        }
        this.activeProfile = name;
        localStorage.setItem('active_booking_profile', name);
        console.log(`Active profile set to: ${name}`);
    }

    getActiveProfile() {
        return this.profiles.get(this.activeProfile);
    }

    // Van Associations
    associateVanWithProfile(vanId, profileName) {
        const profile = this.profiles.get(profileName);
        if (!profile) {
            throw new Error(`Profile "${profileName}" not found`);
        }

        if (!profile.associatedVans.includes(vanId)) {
            profile.associatedVans.push(vanId);
            profile.modified = new Date().toISOString();
            console.log(`Associated van ${vanId} with profile ${profileName}`);
        }
    }

    removeVanFromProfile(vanId, profileName) {
        const profile = this.profiles.get(profileName);
        if (!profile) {
            throw new Error(`Profile "${profileName}" not found`);
        }

        const index = profile.associatedVans.indexOf(vanId);
        if (index > -1) {
            profile.associatedVans.splice(index, 1);
            profile.modified = new Date().toISOString();
            console.log(`Removed van ${vanId} from profile ${profileName}`);
        }
    }

    getProfileForVan(vanId) {
        for (const [name, profile] of this.profiles) {
            if (profile.associatedVans.includes(vanId)) {
                return profile;
            }
        }
        // Return active profile as fallback
        return this.getActiveProfile();
    }

    // Storage Operations
    async loadProfiles() {
        try {
            // Try backend first
            if (window.adminDashboard && window.adminDashboard.vanManager.api) {
                const api = window.adminDashboard.vanManager.api;
                if (!api.useMockData) {
                    // TODO: Implement backend loading
                    // const response = await api.get('/booking-profiles');
                    // if (response.data) {
                    //     this.loadFromData(response.data);
                    //     return true;
                    // }
                }
            }

            // Fallback to localStorage
            const saved = localStorage.getItem('vanlife_booking_profiles');
            if (saved) {
                const data = JSON.parse(saved);
                this.loadFromData(data);
                return true;
            }
        } catch (error) {
            console.error('Error loading profiles:', error);
        }
        return false;
    }

    async saveProfiles() {
        try {
            const data = this.exportData();
            
            // Save to localStorage
            localStorage.setItem('vanlife_booking_profiles', JSON.stringify(data));
            
            // Try to save to backend
            if (window.adminDashboard && window.adminDashboard.vanManager.api) {
                const api = window.adminDashboard.vanManager.api;
                if (!api.useMockData) {
                    // TODO: Implement backend saving
                    // await api.post('/booking-profiles', data);
                }
            }
            
            console.log('Profiles saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving profiles:', error);
            return false;
        }
    }

    loadFromData(data) {
        this.profiles.clear();
        
        if (data.profiles) {
            for (const profile of data.profiles) {
                this.profiles.set(profile.name, profile);
            }
        }
        
        if (data.activeProfile && this.profiles.has(data.activeProfile)) {
            this.activeProfile = data.activeProfile;
        }
        
        console.log(`Loaded ${this.profiles.size} profiles`);
    }

    exportData() {
        return {
            profiles: Array.from(this.profiles.values()),
            activeProfile: this.activeProfile,
            version: '1.0',
            exported: new Date().toISOString()
        };
    }

    // Default Configurations
    getDefaultProfiles() {
        return {
            'Basic': {
                name: 'Basic',
                description: 'Minimal booking form with essential fields only',
                formConfig: this.getBasicFormConfig(),
                pricingConfig: this.getBasicPricingConfig()
            },
            'Standard': {
                name: 'Standard',
                description: 'Standard booking form with most common fields',
                formConfig: this.getStandardFormConfig(),
                pricingConfig: this.getStandardPricingConfig()
            },
            'Premium': {
                name: 'Premium',
                description: 'Complete booking form with all available fields',
                formConfig: this.getPremiumFormConfig(),
                pricingConfig: this.getPremiumPricingConfig()
            }
        };
    }

    createDefaultProfiles() {
        for (const [name, config] of Object.entries(this.defaultProfiles)) {
            this.createProfile(name, config.formConfig);
            const profile = this.profiles.get(name);
            profile.description = config.description;
            profile.pricingConfig = config.pricingConfig;
        }
        this.activeProfile = 'Standard';
    }

    getDefaultFormConfig() {
        return this.getStandardFormConfig();
    }

    getBasicFormConfig() {
        return {
            sections: [
                {
                    id: 'customer',
                    title: 'Customer Information',
                    order: 1,
                    enabled: true,
                    fields: [
                        { id: 'customerName', label: 'First Name', type: 'text', required: true, enabled: true, order: 1 },
                        { id: 'customerSurname', label: 'Last Name', type: 'text', required: true, enabled: true, order: 2 },
                        { id: 'customerEmail', label: 'Email Address', type: 'email', required: true, enabled: true, order: 3 },
                        { id: 'customerPhone', label: 'Phone Number', type: 'tel', required: true, enabled: true, order: 4 }
                    ]
                },
                {
                    id: 'booking',
                    title: 'Booking Details',
                    order: 2,
                    enabled: true,
                    fields: [
                        { id: 'timeSlot', label: 'Time Slot', type: 'radio-group', required: true, enabled: true, order: 1, options: [
                            { value: '07:00-19:00', label: '07:00 – 19:00' },
                            { value: '01:00-00:00', label: '01:00 – 00:00' }
                        ]},
                        { id: 'destination', label: 'Destination', type: 'select', required: true, enabled: true, order: 2, options: [
                            { value: '', label: '-- Please Select --' },
                            { value: 'local', label: 'Local Area' },
                            { value: 'regional', label: 'Regional' }
                        ]}
                    ]
                }
            ]
        };
    }

    getStandardFormConfig() {
        return {
            sections: [
                {
                    id: 'customer',
                    title: 'Customer Information',
                    order: 1,
                    enabled: true,
                    fields: [
                        { id: 'customerName', label: 'First Name', type: 'text', required: true, enabled: true, order: 1 },
                        { id: 'customerSurname', label: 'Last Name', type: 'text', required: true, enabled: true, order: 2 },
                        { id: 'customerEmail', label: 'Email Address', type: 'email', required: true, enabled: true, order: 3 },
                        { id: 'customerPhone', label: 'WhatsApp Number', type: 'tel', required: true, enabled: true, order: 4, validation: 'swiss_phone' },
                        { id: 'customerAddress', label: 'Street Address', type: 'text', required: true, enabled: true, order: 5 },
                        { id: 'customerCity', label: 'City', type: 'text', required: true, enabled: true, order: 6 }
                    ]
                },
                {
                    id: 'booking',
                    title: 'Booking Details',
                    order: 2,
                    enabled: true,
                    fields: [
                        { id: 'timeSlot', label: 'Time Slot Selection', type: 'radio-group', required: true, enabled: true, order: 1, options: [
                            { value: '01:00-12:00', label: '01:00 – 12:00' },
                            { value: '07:00-12:00', label: '07:00 – 12:00' },
                            { value: '07:00-19:00', label: '07:00 – 19:00' },
                            { value: '01:00-00:00', label: '01:00 – 00:00' },
                            { value: '13:00-19:00', label: '13:00 – 19:00' },
                            { value: '13:00-00:00', label: '13:00 – 00:00' },
                            { value: '20:00-00:00', label: '20:00 – 00:00' }
                        ]},
                        { id: 'destination', label: 'Destination', type: 'select', required: true, enabled: true, order: 2, options: [
                            { value: '', label: '-- Please Select --' },
                            { value: 'ticino', label: 'Ticino' },
                            { value: 'grigioni', label: 'Grigioni/Lucerna/Svitto/Wallese' },
                            { value: 'zurich', label: 'Zurigo' },
                            { value: 'lausanne', label: 'Losanna/St. Gallo' },
                            { value: 'basel', label: 'Basilea/Berna' },
                            { value: 'geneva', label: 'Ginevra' },
                            { value: 'como', label: 'Como/Milano/Varese/Verbania' }
                        ]}
                    ]
                },
                {
                    id: 'preferences',
                    title: 'Insurance & Options',
                    order: 3,
                    enabled: true,
                    fields: [
                        { id: 'deductibleReduction', label: 'Deductible Reduction', type: 'radio', required: true, enabled: true, order: 1, 
                          options: [
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' }
                          ]
                        },
                        { id: 'specialRequests', label: 'Special Requests', type: 'textarea', required: false, enabled: true, order: 2 }
                    ]
                },
                {
                    id: 'additional',
                    title: 'Terms & Conditions',
                    order: 4,
                    enabled: true,
                    fields: [
                        { id: 'termsAccepted', label: 'I accept the Terms and Conditions', type: 'checkbox', required: true, enabled: true, order: 1 },
                        { id: 'depositAccepted', label: 'I accept that the deposit will be returned 7 days after the rental period', type: 'checkbox', required: true, enabled: true, order: 2 }
                    ]
                }
            ]
        };
    }

    getPremiumFormConfig() {
        return {
            sections: [
                {
                    id: 'customer',
                    title: 'Customer Information',
                    order: 1,
                    enabled: true,
                    fields: [
                        { id: 'customerName', label: 'First Name', type: 'text', required: true, enabled: true, order: 1 },
                        { id: 'customerSurname', label: 'Last Name', type: 'text', required: true, enabled: true, order: 2 },
                        { id: 'customerEmail', label: 'Email Address', type: 'email', required: true, enabled: true, order: 3 },
                        { id: 'customerPhone', label: 'WhatsApp Number', type: 'tel', required: true, enabled: true, order: 4, validation: 'swiss_phone' },
                        { id: 'customerAddress', label: 'Street Address', type: 'text', required: true, enabled: true, order: 5 },
                        { id: 'customerCity', label: 'City', type: 'text', required: true, enabled: true, order: 6 },
                        { id: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: false, enabled: true, order: 7 },
                        { id: 'driversLicense', label: 'Driver\'s License Number', type: 'text', required: true, enabled: true, order: 8 }
                    ]
                },
                {
                    id: 'booking',
                    title: 'Booking Details',
                    order: 2,
                    enabled: true,
                    fields: [
                        { id: 'timeSlot', label: 'Time Slot Selection', type: 'radio-group', required: true, enabled: true, order: 1, options: [
                            { value: '01:00-12:00', label: '01:00 – 12:00' },
                            { value: '07:00-12:00', label: '07:00 – 12:00' },
                            { value: '07:00-19:00', label: '07:00 – 19:00' },
                            { value: '01:00-00:00', label: '01:00 – 00:00' },
                            { value: '13:00-19:00', label: '13:00 – 19:00' },
                            { value: '13:00-00:00', label: '13:00 – 00:00' },
                            { value: '20:00-00:00', label: '20:00 – 00:00' }
                        ]},
                        { id: 'destination', label: 'Destination', type: 'select', required: true, enabled: true, order: 2, options: [
                            { value: '', label: '-- Please Select --' },
                            { value: 'ticino', label: 'Ticino' },
                            { value: 'grigioni', label: 'Grigioni/Lucerna/Svitto/Wallese' },
                            { value: 'zurich', label: 'Zurigo' },
                            { value: 'lausanne', label: 'Losanna/St. Gallo' },
                            { value: 'basel', label: 'Basilea/Berna' },
                            { value: 'geneva', label: 'Ginevra' },
                            { value: 'como', label: 'Como/Milano/Varese/Verbania' }
                        ]},
                        { id: 'guests', label: 'Number of Guests', type: 'number', required: true, enabled: true, order: 3 },
                        { id: 'additionalDrivers', label: 'Additional Drivers', type: 'number', required: false, enabled: true, order: 4 }
                    ]
                },
                {
                    id: 'preferences',
                    title: 'Insurance & Add-ons',
                    order: 3,
                    enabled: true,
                    fields: [
                        { id: 'deductibleReduction', label: 'Deductible Reduction', type: 'radio', required: true, enabled: true, order: 1, 
                          options: [
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' }
                          ]
                        },
                        { id: 'petFriendly', label: 'Pet-Friendly Option', type: 'checkbox', required: false, enabled: true, order: 2 },
                        { id: 'deliveryOption', label: 'Delivery Service', type: 'checkbox', required: false, enabled: true, order: 3 },
                        { id: 'addOns', label: 'Additional Equipment', type: 'checkbox-group', required: false, enabled: true, order: 4, options: [
                            { value: 'gps', label: 'GPS Navigation' },
                            { value: 'bike_rack', label: 'Bike Rack' },
                            { value: 'camping_gear', label: 'Camping Gear Package' }
                        ]},
                        { id: 'specialRequests', label: 'Special Requests', type: 'textarea', required: false, enabled: true, order: 5 }
                    ]
                },
                {
                    id: 'additional',
                    title: 'Terms & Conditions',
                    order: 4,
                    enabled: true,
                    fields: [
                        { id: 'termsAccepted', label: 'I accept the Terms and Conditions', type: 'checkbox', required: true, enabled: true, order: 1 },
                        { id: 'depositAccepted', label: 'I accept that the deposit will be returned 7 days after the rental period', type: 'checkbox', required: true, enabled: true, order: 2 },
                        { id: 'marketingConsent', label: 'I agree to receive marketing communications', type: 'checkbox', required: false, enabled: true, order: 3 }
                    ]
                }
            ]
        };
    }

    // Default Pricing Configurations
    getDefaultPricingConfig() {
        return this.getStandardPricingConfig();
    }

    getBasicPricingConfig() {
        return {
            timeSlots: {
                '07:00-19:00': { price: 70, currency: 'CHF' },
                '01:00-00:00': { price: 120, currency: 'CHF' }
            },
            destinations: {
                'local': { price: 0, currency: 'CHF' },
                'regional': { price: 45, currency: 'CHF' }
            },
            deductible: {
                'yes': { price: '10%', currency: 'CHF', description: 'of total cost' },
                'no': { price: 0, currency: 'CHF' }
            },
            deposit: { price: 50, currency: 'CHF' }
        };
    }

    getStandardPricingConfig() {
        return {
            timeSlots: {
                '01:00-12:00': { price: 70, currency: 'CHF' },
                '07:00-12:00': { price: 45, currency: 'CHF' },
                '07:00-19:00': { price: 70, currency: 'CHF' },
                '01:00-00:00': { price: 120, currency: 'CHF' },
                '13:00-19:00': { price: 45, currency: 'CHF' },
                '13:00-00:00': { price: 70, currency: 'CHF' },
                '20:00-00:00': { price: 45, currency: 'CHF' }
            },
            destinations: {
                'ticino': { price: 0, currency: 'CHF' },
                'grigioni': { price: 45, currency: 'CHF' },
                'zurich': { price: 70, currency: 'CHF' },
                'lausanne': { price: 90, currency: 'CHF' },
                'basel': { price: 120, currency: 'CHF' },
                'geneva': { price: 140, currency: 'CHF' },
                'como': { price: 30, currency: 'CHF' }
            },
            deductible: {
                'yes': { price: 110, currency: 'CHF', description: '10% of total cost' },
                'no': { price: 0, currency: 'CHF' }
            },
            deposit: { price: 50, currency: 'CHF' }
        };
    }

    getPremiumPricingConfig() {
        return {
            timeSlots: {
                '01:00-12:00': { price: 80, currency: 'CHF' },
                '07:00-12:00': { price: 50, currency: 'CHF' },
                '07:00-19:00': { price: 80, currency: 'CHF' },
                '01:00-00:00': { price: 140, currency: 'CHF' },
                '13:00-19:00': { price: 50, currency: 'CHF' },
                '13:00-00:00': { price: 80, currency: 'CHF' },
                '20:00-00:00': { price: 50, currency: 'CHF' }
            },
            destinations: {
                'ticino': { price: 0, currency: 'CHF' },
                'grigioni': { price: 45, currency: 'CHF' },
                'zurich': { price: 70, currency: 'CHF' },
                'lausanne': { price: 90, currency: 'CHF' },
                'basel': { price: 120, currency: 'CHF' },
                'geneva': { price: 140, currency: 'CHF' },
                'como': { price: 30, currency: 'CHF' }
            },
            deductible: {
                'yes': { price: 110, currency: 'CHF', description: '10% of total cost' },
                'no': { price: 0, currency: 'CHF' }
            },
            addOns: {
                'gps': { price: 10, currency: 'CHF' },
                'bike_rack': { price: 15, currency: 'CHF' },
                'camping_gear': { price: 25, currency: 'CHF' },
                'petFriendly': { price: 20, currency: 'CHF' },
                'deliveryOption': { price: 50, currency: 'CHF' },
                'additionalDrivers': { price: 25, currency: 'CHF', perItem: true }
            },
            deposit: { price: 50, currency: 'CHF' }
        };
    }

    // Utility Methods
    generateProfileId() {
        return 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    validateProfile(profile) {
        if (!profile.name || typeof profile.name !== 'string') {
            throw new Error('Profile name is required');
        }
        
        if (!profile.formConfig || !profile.formConfig.sections) {
            throw new Error('Profile must have form configuration');
        }
        
        return true;
    }
}

// Make it globally available
window.BookingFormProfileManager = BookingFormProfileManager;
