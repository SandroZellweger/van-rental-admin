// BookingFormGenerator.js - Generates dynamic booking forms based on admin configuration
export class BookingFormGenerator {
    constructor(formConfig = null, pricingConfig = null) {
        this.formConfig = formConfig;
        this.pricingConfig = pricingConfig;
        this.generatedFormData = {};
        this.validationRules = {};
        
        // If no config provided, try to load from localStorage
        if (!this.formConfig) {
            this.loadFormConfiguration();
        }
        
        // If no pricing config provided, use default
        if (!this.pricingConfig) {
            this.pricingConfig = this.getDefaultPricingConfiguration();
        }
    }

    // Load form configuration from localStorage or use default
    loadFormConfiguration() {
        try {
            const saved = localStorage.getItem('vanlife_booking_form_config');
            if (saved) {
                this.formConfig = JSON.parse(saved);
                console.log('Loaded form configuration from localStorage');
                return true;
            }
        } catch (error) {
            console.error('Error loading form configuration:', error);
        }
        
        // Use default configuration if none found
        this.formConfig = this.getDefaultConfiguration();
        console.log('Using default form configuration');
        return false;
    }

    getDefaultConfiguration() {
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
                            { value: '01:00-12:00', label: '01:00 – 12:00', internal: '06:59 - 12:00' },
                            { value: '07:00-12:00', label: '07:00 – 12:00', internal: '11:59 - 12:00' },
                            { value: '07:00-19:00', label: '07:00 – 19:00', internal: '11:50 - 19:00' },
                            { value: '01:00-00:00', label: '01:00 – 00:00', internal: '06:59 - 23:59' },
                            { value: '13:00-19:00', label: '13:00 – 19:00', internal: '18:50 - 19:00' },
                            { value: '13:00-00:00', label: '13:00 – 00:00', internal: '18:59 - 23:59' },
                            { value: '20:00-00:00', label: '20:00 – 00:00', internal: '23:58 - 23:59' }
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
                        ], note: 'For unlisted destinations, please call.' }
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
                          ],
                          description: 'From CHF 1000.- to CHF 500.- (Cost: 10% of rental amount)'
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
                        { id: 'termsAccepted', label: 'I accept the Terms and Conditions', type: 'checkbox', required: true, enabled: true, order: 1, 
                          link: { url: 'https://noleggio-semplice.com/privacy-policy/', text: 'Terms and Conditions' } },
                        { id: 'depositAccepted', label: 'I accept that the deposit will be returned 7 days after the rental period', type: 'checkbox', required: true, enabled: true, order: 2 }
                    ]
                }
            ]
        };
    }

    // Generate the complete booking form HTML
    generateBookingForm(targetContainer) {
        if (!this.formConfig) {
            this.loadFormConfiguration();
        }

        const formContainer = document.getElementById(targetContainer) || document.querySelector(targetContainer);
        if (!formContainer) {
            console.error('Target container not found:', targetContainer);
            return;
        }

        // Clear existing content
        formContainer.innerHTML = '';

        // Create form element
        const form = document.createElement('form');
        form.className = 'dynamic-booking-form';
        form.id = 'dynamicBookingForm';

        // Add pricing summary at the top
        const pricingSummary = this.createPricingSummary();
        form.appendChild(pricingSummary);

        // Generate sections
        const enabledSections = this.formConfig.sections
            .filter(section => section.enabled)
            .sort((a, b) => a.order - b.order);

        enabledSections.forEach(section => {
            const sectionElement = this.createFormSection(section);
            if (sectionElement) {
                form.appendChild(sectionElement);
            }
        });

        // Add summary section
        const summary = this.createBookingSummary();
        form.appendChild(summary);

        // Add submit button
        const submitSection = this.createSubmitSection();
        form.appendChild(submitSection);

        // Add to container
        formContainer.appendChild(form);

        // Setup form interactions
        this.setupFormInteractions();

        console.log('Dynamic booking form generated successfully');
    }

    createPricingSummary() {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'pricing-summary';
        summaryDiv.innerHTML = `
            <div class="price-info">
                <p><strong>Total Rental Price: <span id="total-cost-display">[cost_hint]</span> 
                   <span style="color: red;">including deposit (CHF 50.-)</span></strong></p>
                <p><strong>Deposit: <span id="deposit-display">[deposito_hint]</span></strong></p>
            </div>
        `;
        return summaryDiv;
    }

    createFormSection(section) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'form-section';
        sectionDiv.dataset.sectionId = section.id;

        // Section title
        const title = document.createElement('h4');
        title.textContent = section.title;
        sectionDiv.appendChild(title);

        // Get enabled fields sorted by order
        const enabledFields = section.fields
            .filter(field => field.enabled)
            .sort((a, b) => a.order - b.order);

        // Create fields
        enabledFields.forEach(field => {
            const fieldElement = this.createFormField(field, section.id);
            if (fieldElement) {
                sectionDiv.appendChild(fieldElement);
            }
        });

        return sectionDiv;
    }

    createFormField(field, sectionId) {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'form-group';
        fieldDiv.dataset.fieldId = field.id;

        let fieldHTML = '';

        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
                fieldHTML = this.createTextInput(field);
                break;
            case 'textarea':
                fieldHTML = this.createTextarea(field);
                break;
            case 'select':
                fieldHTML = this.createSelect(field);
                break;
            case 'radio':
                fieldHTML = this.createRadioGroup(field);
                break;
            case 'radio-group':
                fieldHTML = this.createRadioGrid(field);
                break;
            case 'checkbox':
                fieldHTML = this.createCheckbox(field);
                break;
            default:
                console.warn('Unsupported field type:', field.type);
                return null;
        }

        fieldDiv.innerHTML = fieldHTML;

        // Add validation if needed
        if (field.validation) {
            this.setupFieldValidation(fieldDiv, field);
        }

        return fieldDiv;
    }

    createTextInput(field) {
        const required = field.required ? '*' : '';
        const placeholder = field.placeholder || `Enter ${field.label.toLowerCase()}...`;
        
        let input = `
            <label for="${field.id}">${field.label}${required}:</label>
            <input type="${field.type}" id="${field.id}" name="${field.id}" 
                   placeholder="${placeholder}" ${field.required ? 'required' : ''}>
        `;

        // Add validation error container for phone fields
        if (field.validation === 'swiss_phone') {
            input += `<span id="${field.id}-error" class="validation-error" style="display: none;">Invalid number format.</span>`;
        }

        return input;
    }

    createTextarea(field) {
        const required = field.required ? '*' : '';
        return `
            <label for="${field.id}">${field.label}${required}:</label>
            <textarea id="${field.id}" name="${field.id}" 
                     placeholder="Enter ${field.label.toLowerCase()}..." 
                     ${field.required ? 'required' : ''}></textarea>
        `;
    }

    createSelect(field) {
        const required = field.required ? '*' : '';
        let select = `
            <label for="${field.id}">${field.label}${required}:`;
        
        if (field.note) {
            select += ` <strong>(${field.note})</strong>`;
        }
        
        select += `</label>
            <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>`;

        field.options.forEach(option => {
            select += `<option value="${option.value}">${option.label}</option>`;
        });

        select += `</select>`;
        return select;
    }

    createRadioGroup(field) {
        const required = field.required ? '*' : '';
        let radioGroup = `<label>${field.label}${required}:</label>`;
        
        if (field.description) {
            radioGroup += `<div class="field-description">
                <p>${field.description}</p>
            </div>`;
        }

        radioGroup += `<div class="radio-group">`;
        
        field.options.forEach(option => {
            radioGroup += `
                <label class="radio-label">
                    <input type="radio" name="${field.id}" value="${option.value}" ${field.required ? 'required' : ''}>
                    <span class="radio-custom"></span>
                    ${option.label}
                </label>
            `;
        });

        radioGroup += `</div>`;
        return radioGroup;
    }

    createRadioGrid(field) {
        const required = field.required ? '*' : '';
        let radioGrid = `<label>${field.label}${required}:</label>
                        <div class="time-slots-grid">`;
        
        field.options.forEach(option => {
            radioGrid += `
                <label class="time-slot-option">
                    <input type="radio" name="${field.id}" value="${option.value}" ${field.required ? 'required' : ''}>
                    <span class="time-slot-label">${option.label}</span>
                </label>
            `;
        });

        radioGrid += `</div>`;
        
        if (field.note) {
            radioGrid += `
                <div class="time-note">
                    <i class="fas fa-info-circle"></i>
                    <span>${field.note}</span>
                </div>
            `;
        }

        return radioGrid;
    }

    createCheckbox(field) {
        const required = field.required ? '*' : '';
        let checkbox = `
            <label class="checkbox-label">
                <input type="checkbox" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
                <span class="checkbox-custom"></span>
        `;

        if (field.link) {
            checkbox += `<a href="${field.link.url}" target="_blank">${field.link.text}</a>`;
        } else {
            checkbox += field.label;
        }

        if (required) {
            checkbox += required;
        }

        checkbox += `</label>`;
        return checkbox;
    }

    createBookingSummary() {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'booking-summary';
        summaryDiv.innerHTML = `
            <h3>Booking Summary</h3>
            <div class="summary-content">
                <p><strong>Deductible Reduction: <span id="deductible-summary">[Franchigia_hint]</span></strong></p>
                
                <div style="display:none;">
                    <input type="checkbox" name="deposito" checked="checked" value="1">
                </div>
                
                <p><strong>Deposit <span id="deposit-summary">[deposito_hint]</span></strong> will be released 7 days after the rental period ends</p>
                <p><strong>Total Rental Price <span id="total-summary">[cost_hint] including deposit (CHF 50.-) and deductible reduction (if selected)</span></strong></p>
                
                <div id="cost-corrections">[cost_corrections]</div>
            </div>
        `;
        return summaryDiv;
    }

    createSubmitSection() {
        const submitDiv = document.createElement('div');
        submitDiv.className = 'form-submit-section';
        submitDiv.innerHTML = `
            <button type="submit" class="submit-button">
                <i class="fas fa-credit-card"></i>
                Proceed with Payment
            </button>
        `;
        return submitDiv;
    }

    // Pricing Configuration Methods
    getDefaultPricingConfiguration() {
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
            addOns: {},
            deposit: { price: 50, currency: 'CHF' }
        };
    }

    // Enhanced pricing calculation using profile configuration
    calculateTotalPrice() {
        const form = document.getElementById('dynamicBookingForm');
        if (!form || !this.pricingConfig) return 0;

        let basePrice = 0;
        let destinationPrice = 0;
        let deductiblePrice = 0;
        let addOnsPrice = 0;

        // Calculate base price from time slot
        const timeSlot = form.querySelector('input[name="timeSlot"]:checked');
        if (timeSlot && this.pricingConfig.timeSlots[timeSlot.value]) {
            basePrice = this.pricingConfig.timeSlots[timeSlot.value].price;
        }

        // Calculate destination price
        const destination = form.querySelector('select[name="destination"]');
        if (destination && destination.value && this.pricingConfig.destinations[destination.value]) {
            destinationPrice = this.pricingConfig.destinations[destination.value].price;
        }

        // Calculate deductible reduction
        const deductible = form.querySelector('input[name="deductibleReduction"]:checked');
        if (deductible && this.pricingConfig.deductible[deductible.value]) {
            const deductibleConfig = this.pricingConfig.deductible[deductible.value];
            if (deductibleConfig.description && deductibleConfig.description.includes('10%')) {
                // Calculate 10% of base price + destination
                deductiblePrice = Math.round((basePrice + destinationPrice) * 0.1);
            } else {
                deductiblePrice = deductibleConfig.price;
            }
        }

        // Calculate add-ons price
        if (this.pricingConfig.addOns) {
            Object.keys(this.pricingConfig.addOns).forEach(addOnKey => {
                const addOnElement = form.querySelector(`[name="${addOnKey}"]`);
                if (addOnElement && 
                    ((addOnElement.type === 'checkbox' && addOnElement.checked) ||
                     (addOnElement.type === 'radio' && addOnElement.checked) ||
                     (addOnElement.type === 'number' && addOnElement.value > 0))) {
                    
                    const addOnConfig = this.pricingConfig.addOns[addOnKey];
                    if (addOnConfig.perItem && addOnElement.type === 'number') {
                        addOnsPrice += addOnConfig.price * parseInt(addOnElement.value || 0);
                    } else {
                        addOnsPrice += addOnConfig.price;
                    }
                }
            });
        }

        const subtotal = basePrice + destinationPrice + deductiblePrice + addOnsPrice;
        const deposit = this.pricingConfig.deposit ? this.pricingConfig.deposit.price : 50;
        const total = subtotal + deposit;

        return {
            basePrice,
            destinationPrice,
            deductiblePrice,
            addOnsPrice,
            subtotal,
            deposit,
            total
        };
    }

    // Enhanced pricing summary update
    updatePricingSummary() {
        if (!this.pricingConfig) return;

        const pricing = this.calculateTotalPrice();
        const currency = this.pricingConfig.deposit?.currency || 'CHF';

        // Update deductible summary
        const deductibleSummary = document.getElementById('deductible-summary');
        if (deductibleSummary) {
            deductibleSummary.textContent = `${currency} ${pricing.deductiblePrice}.-`;
        }

        // Update deposit summary
        const depositSummary = document.getElementById('deposit-summary');
        if (depositSummary) {
            depositSummary.textContent = `${currency} ${pricing.deposit}.-`;
        }

        // Update total summary
        const totalSummary = document.getElementById('total-summary');
        if (totalSummary) {
            totalSummary.textContent = `${currency} ${pricing.total}.-`;
        }

        // Update individual price components if elements exist
        this.updatePriceComponent('base-price-display', pricing.basePrice, currency);
        this.updatePriceComponent('destination-price-display', pricing.destinationPrice, currency);
        this.updatePriceComponent('subtotal-display', pricing.subtotal, currency);

        console.log('Pricing updated:', pricing);
    }

    updatePriceComponent(elementId, price, currency) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `${currency} ${price}.-`;
        }
    }

    // Enhanced form interactions setup with pricing
    setupFormInteractions() {
        // Setup Swiss phone validation
        this.setupSwissPhoneValidation();
        
        // Setup pricing calculations with all form elements
        this.setupPricingCalculations();
        
        // Setup form submission
        this.setupFormSubmission();
    }

    setupPricingCalculations() {
        const form = document.getElementById('dynamicBookingForm');
        if (!form) return;

        // Add event listeners to all pricing-related form elements
        const timeSlotInputs = form.querySelectorAll('input[name="timeSlot"]');
        const destinationSelect = form.querySelector('select[name="destination"]');
        const deductibleInputs = form.querySelectorAll('input[name="deductibleReduction"]');

        // Time slot changes
        timeSlotInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updatePricingSummary();
            });
        });

        // Destination changes
        if (destinationSelect) {
            destinationSelect.addEventListener('change', () => {
                this.updatePricingSummary();
            });
        }

        // Deductible changes
        deductibleInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updatePricingSummary();
            });
        });

        // Add-ons changes (if any)
        if (this.pricingConfig.addOns) {
            Object.keys(this.pricingConfig.addOns).forEach(addOnKey => {
                const addOnElement = form.querySelector(`[name="${addOnKey}"]`);
                if (addOnElement) {
                    const eventType = addOnElement.type === 'number' ? 'input' : 'change';
                    addOnElement.addEventListener(eventType, () => {
                        this.updatePricingSummary();
                    });
                }
            });
        }

        // Initial calculation
        this.updatePricingSummary();
    }

    // Initialize form elements after DOM creation
    initializeFormElements() {
        this.setupFormInteractions();
        
        // Setup any additional form functionality
        this.setupFieldValidation();
        
        // Initial pricing calculation
        setTimeout(() => {
            this.updatePricingSummary();
        }, 100);
    }

    setupFieldValidation() {
        // Setup validation for all form fields
        const form = document.getElementById('dynamicBookingForm');
        if (!form) return;

        // Swiss phone validation
        const phoneField = form.querySelector('input[name="customerPhone"]');
        if (phoneField) {
            this.setupSwissPhoneValidationForField(phoneField);
        }
    }

    setupSwissPhoneValidationForField(phoneField) {
        const errorElement = phoneField.parentElement.querySelector('.validation-error');
        if (!errorElement) return;

        phoneField.addEventListener('input', function() {
            const phoneValue = phoneField.value.trim();
            const validChars = /^\+?\d*$/;

            if (!validChars.test(phoneValue)) {
                errorElement.style.display = 'inline';
                errorElement.textContent = 'Only numbers and + are allowed';
                return;
            }

            const swissPrefixes = ['077', '076', '075', '078', '079'];
            const swissInternationalPrefixes = ['+4175', '+4176', '+4177', '+4178', '+4179', '004175', '004176', '004177', '004178', '004179'];

            let isValid = false;

            if (swissPrefixes.some(prefix => phoneValue.startsWith(prefix)) && phoneValue.length === 10) {
                isValid = true;
            }

            if (swissInternationalPrefixes.some(prefix => phoneValue.startsWith(prefix)) &&
                ((phoneValue.startsWith('+41') && phoneValue.length === 12) ||
                (phoneValue.startsWith('0041') && phoneValue.length === 14))) {
                isValid = true;
            }

            if ((phoneValue.startsWith('+') || phoneValue.startsWith('00')) &&
                !(phoneValue.startsWith('+41') || phoneValue.startsWith('0041'))) {
                isValid = true;
            }

            errorElement.style.display = isValid ? 'none' : 'inline';
            if (!isValid && phoneValue.length > 0) {
                errorElement.textContent = 'Invalid Swiss mobile number format';
            }
        });
    }
}

// Make it globally available
window.BookingFormGenerator = BookingFormGenerator;
