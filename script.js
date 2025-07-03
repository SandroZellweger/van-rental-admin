// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const bookingForm = document.getElementById('bookingForm');
const vanSelectionGrid = document.getElementById('vanSelectionGrid');
const calendarContainer = document.getElementById('calendarContainer');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const view360Container = document.getElementById('view360Container');
const closeModal = document.querySelector('.close');

// Calendar Elements
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthYear = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const bookingSummary = document.getElementById('bookingSummary');

// Initialize Stripe (you'll need to replace with your actual publishable key)
const stripe = Stripe('pk_test_your_stripe_publishable_key_here');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Set minimum date to today
// (Removed - using calendar selection instead)

// Update drop-off minimum date when pickup date changes
// (Removed - using calendar selection instead)

// Recalculate price when any form field changes
// (Updated to use new form fields)

// Price calculation function
// (Replaced with updateBookingSummary function above)

// Form submission and Stripe integration
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {
            firstName: formData.get('first-name'),
            lastName: formData.get('last-name'),
            email: formData.get('email'),
            whatsapp: formData.get('whatsapp'),
            address: formData.get('address'),
            city: formData.get('city'),
            selectedDates: selectedDates,
            vanId: selectedVanData.id,
            vanType: selectedVanData.type,
            vanName: selectedVanData.name,
            timeSlot: formData.get('time-slot'),
            destination: formData.get('destination'),
            insuranceReduction: formData.get('insurance-reduction'),
            specialRequests: formData.get('special-requests'),
            totalAmount: getTotalAmount()
        };
        
        // In a real application, you would:
        // 1. Send booking data to your server
        // 2. Create a Stripe PaymentIntent
        // 3. Confirm the payment
        
        // For demo purposes, we'll simulate the process
        const bookingSuccess = await simulatePaymentProcess(bookingData);
        
        if (bookingSuccess && selectedVanId && window.googleCalendar && window.googleCalendar.isSignedIn) {
            // Create Google Calendar event for the booking
            try {
                const selectedDate = selectedDates[0]; // Single selected date
                
                const calendarBookingData = {
                    customerName: `${bookingData.firstName} ${bookingData.lastName}`,
                    customerEmail: bookingData.email,
                    phone: bookingData.whatsapp,
                    vanType: bookingData.vanType,
                    startDate: selectedDate,
                    endDate: selectedDate, // Same day for single-day booking
                    duration: 1, // Always 1 day for single-day bookings
                    status: 'confirmed',
                    total: bookingData.totalAmount,
                    specialRequests: bookingData.specialRequests,
                    pickupLocation: bookingData.destination,
                    pickupTime: bookingData.timeSlot,
                    bookingId: generateBookingId()
                };
                
                const calendarEvent = await window.googleCalendar.createBookingEvent(
                    selectedVanId, 
                    calendarBookingData
                );
                
                console.log('Google Calendar event created:', calendarEvent);
                console.log(`Single-day booking created for: ${selectedDate}`);
                
                // Refresh calendar data to show the new booking
                await generateCalendarData();
                renderCalendar();
                
            } catch (calendarError) {
                console.error('Failed to create Google Calendar event:', calendarError);
                // Don't fail the booking if calendar creation fails
            }
        }
        
        // Show success message
        showSuccessMessage();
        
    } catch (error) {
        console.error('Payment failed:', error);
        showErrorMessage('Payment failed. Please try again.');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Form validation
function validateForm() {
    let isValid = true;
    const requiredFields = [
        'first-name', 'last-name', 'email', 'whatsapp', 
        'address', 'city', 'time-slot', 'destination'
    ];
    
    // Check selected date
    if (selectedDates.length === 0) {
        alert('Please select a date from the calendar.');
        isValid = false;
    }
    
    // Check selected van
    if (!selectedVanData.id) {
        alert('Please select a van first.');
        isValid = false;
    }
    
    requiredFields.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        const value = field.value.trim();
        
        // Remove previous validation classes
        field.classList.remove('error', 'success');
        
        if (!value) {
            field.classList.add('error');
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            field.classList.add('success');
            hideFieldError(field);
        }
    });
    
    // Email validation
    const emailField = document.querySelector('[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.classList.remove('success');
        emailField.classList.add('error');
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (basic)
    const phoneField = document.querySelector('[name="whatsapp"]');
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (phoneField.value && !phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
        phoneField.classList.remove('success');
        phoneField.classList.add('error');
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Terms and conditions
    const termsCheckbox = document.querySelector('[name="terms"]');
    const depositTermsCheckbox = document.querySelector('[name="deposit-terms"]');
    
    if (!termsCheckbox.checked) {
        alert('Please accept the Terms and Conditions to continue.');
        isValid = false;
    }
    
    if (!depositTermsCheckbox.checked) {
        alert('Please acknowledge the deposit terms to continue.');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function getTotalAmount() {
    const totalText = document.getElementById('totalAmount').textContent;
    return parseInt(totalText.replace(/[^\d]/g, ''));
}

// Simulate payment process (replace with real Stripe integration)
async function simulatePaymentProcess(bookingData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Booking data:', bookingData);
            resolve();
        }, 2000);
    });
}

function showSuccessMessage() {
    const successHTML = `
        <div style="text-align: center; padding: 2rem; background: #10b981; color: white; border-radius: 10px; margin: 1rem 0;">
            <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>Booking Confirmed!</h3>
            <p>Thank you for your reservation. You'll receive a confirmation email shortly.</p>
        </div>
    `;
    
    const form = document.querySelector('.booking-form');
    form.innerHTML = successHTML;
}

function showErrorMessage(message) {
    const errorHTML = `
        <div style="text-align: center; padding: 1rem; background: #ef4444; color: white; border-radius: 10px; margin: 1rem 0;">
            <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
            ${message}
        </div>
    `;
    
    const form = document.querySelector('.booking-form');
    form.insertAdjacentHTML('beforeend', errorHTML);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        const errorElement = form.querySelector('[style*="background: #ef4444"]');
        if (errorElement) {
            errorElement.remove();
        }
    }, 5000);
}

// Gallery functionality
const viewInteriorButtons = document.querySelectorAll('.view-interior');
const view360Buttons = document.querySelectorAll('.view-360');

// Van images data (in a real app, this would come from a database)
const vanImages = {
    compact: {
        exterior: 'images/compact-van-exterior.jpg',
        interior: 'images/compact-van-interior.jpg',
        view360: 'images/compact-van-360.jpg'
    },
    standard: {
        exterior: 'images/standard-van-exterior.jpg',
        interior: 'images/standard-van-interior.jpg',
        view360: 'images/standard-van-360.jpg'
    },
    luxury: {
        exterior: 'images/luxury-van-exterior.jpg',
        interior: 'images/luxury-van-interior.jpg',
        view360: 'images/luxury-van-360.jpg'
    },
    family: {
        exterior: 'images/family-van-exterior.jpg',
        interior: 'images/family-van-interior.jpg',
        view360: 'images/family-van-360.jpg'
    }
};

// Interior view functionality
viewInteriorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const vanType = button.dataset.van;
        showModal(vanImages[vanType].interior, 'interior');
    });
});

// 360 view functionality
view360Buttons.forEach(button => {
    button.addEventListener('click', () => {
        const vanType = button.dataset.van;
        showModal(vanImages[vanType].view360, '360');
    });
});

function showModal(imageSrc, viewType) {
    modalImage.src = imageSrc;
    modalImage.alt = `Van ${viewType} view`;
    
    if (viewType === '360') {
        view360Container.style.display = 'block';
        modalImage.style.cursor = 'grab';
        add360ViewFunctionality();
    } else {
        view360Container.style.display = 'none';
        modalImage.style.cursor = 'default';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 360-degree view functionality
function add360ViewFunctionality() {
    let isDragging = false;
    let startX = 0;
    let currentRotation = 0;
    
    modalImage.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        modalImage.style.cursor = 'grabbing';
    });
    
    modalImage.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        currentRotation += deltaX * 0.5;
        modalImage.style.transform = `rotateY(${currentRotation}deg)`;
        startX = e.clientX;
    });
    
    modalImage.addEventListener('mouseup', () => {
        isDragging = false;
        modalImage.style.cursor = 'grab';
    });
    
    modalImage.addEventListener('mouseleave', () => {
        isDragging = false;
        modalImage.style.cursor = 'grab';
    });
    
    // Touch events for mobile
    modalImage.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    });
    
    modalImage.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.touches[0].clientX - startX;
        currentRotation += deltaX * 0.5;
        modalImage.style.transform = `rotateY(${currentRotation}deg)`;
        startX = e.touches[0].clientX;
    });
    
    modalImage.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Close modal functionality
closeModal.addEventListener('click', closeModalHandler);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModalHandler();
    }
});

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    modalImage.style.transform = 'none';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.advantage-card, .van-card').forEach(el => {
    observer.observe(el);
});

// Contact form functionality
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name') || contactForm.querySelector('input[type="text"]').value,
            email: formData.get('email') || contactForm.querySelector('input[type="email"]').value,
            message: formData.get('message') || contactForm.querySelector('textarea').value
        };
        
        // Simulate sending message
        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Hero image cycling (optional enhancement)
const heroImages = [
    'images/hero-van.jpg',
    'images/hero-van-2.jpg',
    'images/hero-van-3.jpg'
];

let currentHeroImage = 0;
const heroImg = document.getElementById('hero-img');

function cycleHeroImage() {
    currentHeroImage = (currentHeroImage + 1) % heroImages.length;
    if (heroImg) {
        heroImg.style.opacity = '0';
        setTimeout(() => {
            heroImg.src = heroImages[currentHeroImage];
            heroImg.style.opacity = '1';
        }, 500);
    }
}

// Change hero image every 5 seconds
setInterval(cycleHeroImage, 5000);

// Mobile touch improvements
if ('ontouchstart' in window) {
    // Add touch feedback for buttons
    document.querySelectorAll('button, .cta-button, .view-interior, .view-360').forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });
}

// Error handling for missing images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Create a placeholder for missing images
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
        this.alt = 'Image not found';
    });
});

// Performance optimization: Lazy loading for gallery images
if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    lazyImageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        lazyImageObserver.observe(img);
    });
}

// Console welcome message
console.log('%cWelcome to VanLife Rentals! 🚐', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with modern web technologies for the best user experience.', 'color: #64748b; font-size: 14px;');

// Calendar State
let currentDate = new Date();
let selectedDates = [];
let calendarData = {};
let selectedVanId = null;
let isLoadingAvailability = false;

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', async () => {
    initializeCalendar();
    await initializeGoogleCalendar();
    setupVanSelection();
    updateBookingSummary();
});

// Google Calendar Status Management
function updateGoogleCalendarStatus() {
    const statusSection = document.getElementById('googleCalendarStatus');
    const statusText = statusSection.querySelector('.status-text');
    const signInBtn = document.getElementById('googleSignInBtn');
    const signOutBtn = document.getElementById('googleSignOutBtn');
    const syncStatus = statusSection.querySelector('.calendar-sync-status');
    
    // Check if running locally
    if (window.location.protocol === 'file:') {
        statusText.textContent = 'Local demo mode - Access http://localhost:8000 for Google Calendar ⚠️';
        syncStatus.className = 'calendar-sync-status warning';
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'none';
        console.log('🔗 Google Calendar status: LOCAL DEMO MODE');
        return;
    }
    
    if (!window.googleCalendar) {
        statusText.textContent = 'Google Calendar not available';
        syncStatus.className = 'calendar-sync-status error';
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'none';
        console.log('❌ Google Calendar integration not loaded');
        return;
    }
    
    if (window.googleCalendar.isSignedIn) {
        if (window.googleCalendar.demoMode) {
            statusText.textContent = 'Running in DEMO MODE - Simulated calendar data 🎭';
            syncStatus.className = 'calendar-sync-status demo';
            signInBtn.style.display = 'none';
            signOutBtn.style.display = 'none';
            console.log('🔗 Google Calendar status: DEMO MODE');
        } else {
            statusText.textContent = 'Connected to Google Calendar - Real-time availability enabled ✅';
            syncStatus.className = 'calendar-sync-status connected';
            signInBtn.style.display = 'none';
            signOutBtn.style.display = 'flex';
            console.log('🔗 Google Calendar status: CONNECTED');
        }
    } else {
        statusText.textContent = 'Sign in to Google for real-time availability 🔑';
        syncStatus.className = 'calendar-sync-status';
        signInBtn.style.display = 'flex';
        signOutBtn.style.display = 'none';
        console.log('🔗 Google Calendar status: NOT CONNECTED');
    }
}

// Setup Google Calendar event listeners
function setupGoogleCalendarListeners() {
    const signInBtn = document.getElementById('googleSignInBtn');
    const signOutBtn = document.getElementById('googleSignOutBtn');
    
    if (signInBtn) {
        signInBtn.addEventListener('click', async () => {
            try {
                signInBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                signInBtn.disabled = true;
                
                await window.googleCalendar.signIn();
                updateGoogleCalendarStatus();
                
                // Reload calendar data with Google Calendar availability
                if (selectedVanId) {
                    await generateCalendarData();
                    renderCalendar();
                }
                
            } catch (error) {
                console.error('Google sign-in failed:', error);
                
                // Show user-friendly error message
                let errorMessage = 'Failed to sign in to Google Calendar.';
                if (error.message) {
                    errorMessage = error.message;
                }
                
                alert(errorMessage);
                
                // If it's an OAuth config issue, provide setup instructions
                if (error.message && error.message.includes('authorized origins')) {
                    console.log('🔧 SETUP REQUIRED: Google Cloud Console Configuration');
                    console.log('1. Go to https://console.cloud.google.com/');
                    console.log('2. Navigate to APIs & Services → Credentials');
                    console.log('3. Edit your OAuth 2.0 Client ID');
                    console.log('4. Add "http://localhost:8000" to Authorized JavaScript origins');
                    console.log('5. Save and try again');
                }
            } finally {
                signInBtn.innerHTML = '<i class="fab fa-google"></i> Sign in with Google';
                signInBtn.disabled = false;
            }
        });
    }
    
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            try {
                signOutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing out...';
                signOutBtn.disabled = true;
                
                await window.googleCalendar.signOut();
                updateGoogleCalendarStatus();
                
                // Reload the page to clear any cached calendar data
                if (selectedVanId) {
                    await generateCalendarData();
                    renderCalendar();
                }
                
            } catch (error) {
                console.error('Google sign-out failed:', error);
                alert('Failed to sign out. Please try again.');
            } finally {
                signOutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
                signOutBtn.disabled = false;
            }
        });
    }
}

// Initialize Google Calendar integration with status updates
async function initializeGoogleCalendar() {
    console.log('🔄 Initializing Google Calendar integration...');
    updateGoogleCalendarStatus(); // Initial status
    
    // Check if running locally
    if (window.location.protocol === 'file:') {
        console.log('📍 Running in local file mode - Google Calendar API disabled');
        console.log('🌐 For full Google Calendar integration, access via: http://localhost:8000');
        return;
    }
    
    if (window.googleCalendar) {
        try {
            console.log('📡 Connecting to Google Calendar API...');
            await window.googleCalendar.initialize();
            setupGoogleCalendarListeners();
            updateGoogleCalendarStatus();
            console.log('✅ Google Calendar integration ready');
        } catch (error) {
            console.warn('⚠️ Google Calendar integration failed, using local data:', error);
            updateGoogleCalendarStatus();
        }
    } else {
        console.log('❌ Google Calendar module not found');
    }
}

// Calendar Navigation
prevMonthBtn.addEventListener('click', () => {
    const today = new Date();
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    // Don't allow navigation to past months
    if (prevMonth.getFullYear() > today.getFullYear() || 
        (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() >= today.getMonth())) {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        updateNavigationButtons();
    }
});

nextMonthBtn.addEventListener('click', () => {
    const today = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1); // 3 months ahead
    
    // Don't allow navigation more than 3 months ahead
    if (nextMonth < maxMonth) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        updateNavigationButtons();
    }
});

// Update navigation button states
function updateNavigationButtons() {
    const today = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    
    // Disable previous button if we're at current month
    prevMonthBtn.disabled = currentMonth.getTime() <= todayMonth.getTime();
    
    // Disable next button if we're at max month (3 months ahead)
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    nextMonthBtn.disabled = nextMonth.getTime() >= maxMonth.getTime();
}

// Generate sample calendar data (in real app, this would come from your booking system)
async function generateCalendarData() {
    const today = new Date();
    
    // If we have a selected van and Google Calendar is available, fetch real data
    if (selectedVanData.id && window.googleCalendar && window.googleCalendar.isSignedIn) {
        await loadGoogleCalendarAvailability();
        return;
    }
    
    console.log('📅 Using sample calendar data (Google Calendar not connected)');
    
    // Fallback to sample data
    const sampleData = {
        '2025-07-05': 'partially',
        '2025-07-12': 'partially',
        '2025-07-18': 'reserved',
        '2025-07-25': 'reserved',
        '2025-07-30': 'partially',
        '2025-08-02': 'reserved',
        '2025-08-08': 'partially',
        '2025-08-15': 'reserved',
        '2025-08-22': 'partially',
        '2025-08-29': 'reserved'
    };
    
    // Generate availability for current and next few months
    for (let month = 0; month < 6; month++) {
        const date = new Date(today.getFullYear(), today.getMonth() + month, 1);
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(date.getFullYear(), date.getMonth(), day);
            const dateStr = formatDate(currentDay);
            
            // Past dates are not available
            if (currentDay < today) {
                calendarData[dateStr] = 'past';
            } else if (currentDay.toDateString() === today.toDateString()) {
                // For today, check if any time slots are still available
                const currentHour = today.getHours();
                const currentMinute = today.getMinutes();
                const currentTimeMinutes = currentHour * 60 + currentMinute;
                
                // Define the same time slots as in Google Calendar integration
                const timeSlots = [
                    { start: 60, end: 720 },      // 01:00-12:00
                    { start: 420, end: 720 },     // 07:00-12:00
                    { start: 420, end: 1140 },    // 07:00-19:00
                    { start: 60, end: 1440 },     // 01:00-00:00 (next day)
                    { start: 780, end: 1140 },    // 13:00-19:00
                    { start: 780, end: 1440 },    // 13:00-00:00 (next day)
                    { start: 1200, end: 1440 }    // 20:00-00:00 (next day)
                ];
                
                const availableSlots = timeSlots.filter(slot => slot.end > currentTimeMinutes);
                
                if (availableSlots.length === 0) {
                    calendarData[dateStr] = 'past'; // All time slots have passed
                } else if (availableSlots.length < timeSlots.length) {
                    calendarData[dateStr] = 'partially'; // Some slots still available
                } else {
                    // Use sample data or default to available
                    calendarData[dateStr] = sampleData[dateStr] || 'available';
                }
            } else {
                // Use sample data or default to available
                calendarData[dateStr] = sampleData[dateStr] || 'available';
            }
        }
    }
}

// Load real availability data from Google Calendar
async function loadGoogleCalendarAvailability() {
    if (!selectedVanData.id || !window.googleCalendar || !window.googleCalendar.isSignedIn) {
        console.log('⚠️ Cannot load Google Calendar data - not signed in or no van selected');
        return;
    }
    
    console.log(`🔄 Loading Google Calendar availability for Van ${selectedVanData.id} (${selectedVanData.name})`);
    isLoadingAvailability = true;
    showCalendarLoading(true);
    
    try {
        const today = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(today.getMonth() + 6);
        
        const startDate = formatDate(today);
        const endDate = formatDate(sixMonthsLater);
        
        console.log(`📅 Fetching availability data from ${startDate} to ${endDate}`);
          const availability = await window.googleCalendar.getVanAvailability(
            selectedVanData.id,
            startDate,
            endDate
        );
        
        // Clear existing calendar data
        calendarData = {};
        
        // Handle the new availability format (object with availability and timeSlots)
        const availabilityData = availability.availability || availability;
        const timeSlots = availability.timeSlots || {};
        
        // Generate base calendar data
        for (let month = 0; month < 6; month++) {
            const date = new Date(today.getFullYear(), today.getMonth() + month, 1);
            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDay = new Date(date.getFullYear(), date.getMonth(), day);
                const dateStr = formatDate(currentDay);
                
                // Check if date is in the past (before today) - compare only dates, not times
                const todayDateStr = formatDate(today);
                const currentDateStr = formatDate(currentDay);
                
                if (currentDateStr < todayDateStr) {
                    calendarData[dateStr] = 'past';
                } else if (availabilityData[dateStr] === 'reserved') {
                    calendarData[dateStr] = 'reserved';
                } else if (availabilityData[dateStr] === 'partially_available') {
                    calendarData[dateStr] = 'partially_available';
                } else {
                    calendarData[dateStr] = 'available';
                }
            }
        }
        
        // Store time slots data for later use
        window.vanTimeSlots = timeSlots;
        
        console.log(`✅ Successfully loaded Google Calendar availability for Van ${selectedVanData.id}`);
        console.log(`📊 Availability summary:`, {
            total_days: Object.keys(calendarData).length,
            reserved_days: Object.values(calendarData).filter(v => v === 'reserved').length,
            partially_available_days: Object.values(calendarData).filter(v => v === 'partially_available').length,
            available_days: Object.values(calendarData).filter(v => v === 'available').length
        });
        
    } catch (error) {
        console.error(`❌ Failed to load Google Calendar availability for Van ${selectedVanData.id}:`, error);
        console.log('🔄 Falling back to sample data');
        // Fallback to sample data
        await generateCalendarData();
    } finally {
        isLoadingAvailability = false;
        showCalendarLoading(false);
    }
}

// Van Selection State
let selectedVanData = {
    id: null,
    type: null,
    price: null,
    name: null
};

// Van Selection Grid functionality
function setupVanSelection() {
    const vanCards = document.querySelectorAll('.van-card');
    
    vanCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from all cards
            vanCards.forEach(c => c.classList.remove('selected'));
            
            // Select clicked card
            card.classList.add('selected');
            
            // Update selected van data
            selectedVanData = {
                id: card.dataset.vanId,
                type: card.dataset.vanType,
                price: parseInt(card.dataset.price),
                name: card.querySelector('h4').textContent
            };
            
            // Update hidden form fields
            document.getElementById('selected-van-id').value = selectedVanData.id;
            document.getElementById('selected-van-type').value = selectedVanData.type;
            
            // Set global selectedVanId for Google Calendar integration
            selectedVanId = selectedVanData.id;
            
            // Show calendar and booking form
            showCalendarForSelectedVan();
        });
    });
}

async function showCalendarForSelectedVan() {
    // Show calendar container
    calendarContainer.style.display = 'block';
    
    // Clear any existing date selection
    clearDateSelection();
    
    // Load calendar data for selected van
    await generateCalendarData();
    renderCalendar();
    
    // Show booking form
    bookingForm.style.display = 'block';
    
    // Update booking summary
    updateBookingSummary();
    
    // Scroll to calendar
    calendarContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function showCalendarLoading(loading) {
    const calendarContainer = document.querySelector('.booking-calendar-container');
    if (!calendarContainer) {
        console.log('⚠️ Calendar container not found');
        return;
    }
    
    if (loading) {
        calendarContainer.classList.add('loading');
        if (!document.querySelector('.calendar-loading')) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'calendar-loading';
            loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading availability...';
            calendarContainer.appendChild(loadingDiv);
        }
    } else {
        calendarContainer.classList.remove('loading');
        const loadingDiv = document.querySelector('.calendar-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}

function initializeCalendar() {
    // Set current date to the current month
    const today = new Date();
    currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Update navigation buttons initial state
    updateNavigationButtons();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    // Clear calendar grid
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and adjust for Monday start
    const firstDay = new Date(year, month, 1);
    let startDate = firstDay.getDay();
    startDate = startDate === 0 ? 6 : startDate - 1; // Adjust for Monday start
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDate; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const currentDay = new Date(year, month, day);
        const dateStr = formatDate(currentDay);
        
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        dayElement.dataset.date = dateStr;
        
        // Add status classes
        const status = calendarData[dateStr] || 'available';
        
        // Handle past dates - add 'past' class and make them visually distinct
        if (status === 'past') {
            dayElement.classList.add('past', 'disabled');
        } else {
            dayElement.classList.add(status);
        }
        
        // Debug logging for July 2nd
        if (dateStr === '2025-07-02') {
            console.log(`🐛 July 2nd calendar rendering: status="${status}", calendarData entry:`, calendarData[dateStr]);
        }
        
        // Mark today
        if (currentDay.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Mark selected dates
        if (selectedDates.includes(dateStr)) {
            dayElement.classList.add('selected');
        }
        
        // Add click handler for available dates only (not past dates)
        if (status === 'available' || status === 'partially' || status === 'partially_available') {
            dayElement.addEventListener('click', () => selectDate(dateStr, dayElement));
            
            // Debug for July 2nd
            if (dateStr === '2025-07-02') {
                console.log(`🐛 July 2nd: Click handler ADDED, status="${status}"`);
            }
        } else if (dateStr === '2025-07-02') {
            console.log(`🐛 July 2nd: Click handler NOT added, status="${status}"`);
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Update selection styling for ranges
    updateCalendarSelection();
    
    // Update navigation button states
    updateNavigationButtons();
}

function selectDate(dateStr, element) {
    const clickedDate = new Date(dateStr);
    const calendarContainer = document.querySelector('.booking-calendar-container');
    
    // Single-day selection only: If clicking a different date, clear previous selection
    if (selectedDates.length > 0 && selectedDates[0] !== dateStr) {
        // Clear previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected', 'range-start', 'range-end', 'in-range');
        });
        selectedDates = [];
    }
    
    // If clicking the same date, deselect it
    if (selectedDates.length > 0 && selectedDates[0] === dateStr) {
        selectedDates = [];
        element.classList.remove('selected', 'range-start', 'range-end', 'in-range');
        calendarContainer.classList.remove('selection-mode');
        showClearSelectionButton();
        updateBookingSummary();
        return;
    }
    
    // Select the clicked date
    selectedDates = [dateStr];
    element.classList.add('selected');
    calendarContainer.classList.add('selection-mode');
    showClearSelectionButton();
    updateBookingSummary();
    
    // Update available time slots for the selected date
    updateAvailableTimeSlots(dateStr);
}

function updateCalendarSelection() {
    if (selectedDates.length === 0) return;
    
    // For single-day selection, just mark the selected date
    selectedDates.forEach((dateStr) => {
        const dayElement = document.querySelector(`[data-date="${dateStr}"]`);
        if (dayElement) {
            dayElement.classList.add('selected');
        }
    });
}

// Update available time slots based on selected date
function updateAvailableTimeSlots(dateStr) {
    const timeSlotContainer = document.querySelector('.time-slots-grid');
    if (!timeSlotContainer) {
        console.log('⚠️ Time slots container not found');
        return;
    }
    
    // Get all time slot options
    const timeSlotOptions = timeSlotContainer.querySelectorAll('.time-slot-option');
    
    // Check if we have Google Calendar time slots data for this date
    if (window.vanTimeSlots && window.vanTimeSlots[dateStr]) {
        const dateSlotData = window.vanTimeSlots[dateStr];
        const availableSlots = dateSlotData.availableSlots || [];
        console.log(`🕐 Filtering time slots for ${dateStr}: ${availableSlots.length} available slots`);
        
        // If no slots are available, hide all
        if (availableSlots.length === 0) {
            console.log(`❌ No time slots available for ${dateStr} - hiding all slots`);
            timeSlotOptions.forEach(option => {
                option.style.display = 'none';
                option.classList.add('disabled');
                const input = option.querySelector('input');
                input.disabled = true;
                if (input.checked) input.checked = false;
            });
        } else {
            // Show only available time slots
            timeSlotOptions.forEach(option => {
                const input = option.querySelector('input');
                const label = option.querySelector('.time-slot-label');
                const labelText = label.textContent; // e.g., "01:00 – 12:00"
                
                // Check if this time slot is available
                const isAvailable = availableSlots.some(slot => slot.label === labelText);
                
                if (isAvailable) {
                    // Show and enable the time slot
                    option.style.display = 'block';
                    option.classList.remove('disabled');
                    input.disabled = false;
                } else {
                    // Hide the unavailable time slot completely
                    option.style.display = 'none';
                    option.classList.add('disabled');
                    input.disabled = true;
                    
                    // Clear selection if this slot was selected
                    if (input.checked) input.checked = false;
                }
            });
        }
        
        // Update the booking summary since time slot availability changed
        updateBookingSummary();
        
    } else {
        console.log(`⚠️ No time slot data available for ${dateStr} - showing all slots as fallback`);
        
        // Show all time slots if no data available (fallback for unprocessed dates)
        timeSlotOptions.forEach(option => {
            option.style.display = 'block';
            option.classList.remove('disabled');
            const input = option.querySelector('input');
            input.disabled = false;
        });
    }
}

// Function to reset time slot visibility when no date is selected
function resetTimeSlots() {
    const timeSlotContainer = document.querySelector('.time-slots-grid');
    if (!timeSlotContainer) return;
    
    const timeSlotOptions = timeSlotContainer.querySelectorAll('.time-slot-option');
    timeSlotOptions.forEach(option => {
        option.style.display = 'block';
        option.classList.remove('disabled');
        const input = option.querySelector('input');
        input.disabled = false;
        input.checked = false; // Clear any selections
    });
}

function updateCalendarSelection() {
    if (selectedDates.length === 0) return;
    
    // For single-day selection, just mark the selected date
    selectedDates.forEach((dateStr) => {
        const dayElement = document.querySelector(`[data-date="${dateStr}"]`);
        if (dayElement) {
            dayElement.classList.add('selected');
        }
    });
}

// Utility Functions
function generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BK${timestamp}${random}`;
}

function formatDate(date) {
    // Use local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr) {
    const date = new Date(dateStr);
    const options = { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Form handling - insurance change listener
document.querySelectorAll('input[name="insurance-reduction"]').forEach(radio => {
    radio.addEventListener('change', updateBookingSummary);
});

function updateBookingSummary() {
    // Update selected dates
    const selectedDatesElement = document.getElementById('selectedDates');
    if (selectedDates.length > 0) {
        selectedDatesElement.textContent = formatDisplayDate(selectedDates[0]);
    } else {
        selectedDatesElement.textContent = 'No date selected';
    }
    
    // Update van type
    const selectedVanTypeElement = document.getElementById('selectedVanType');
    selectedVanTypeElement.textContent = selectedVanData.name || 'Not selected';
    
    // Calculate pricing for single day
    let dailyRate = selectedVanData.price || 0;
    let totalDays = selectedDates.length > 0 ? 1 : 0; // Always 1 day for single-day bookings
    let subtotal = 0;
    let deposit = 50;
    let insuranceCost = 0;
    let deductible = 1000;
    
    if (dailyRate > 0 && totalDays > 0) {
        subtotal = dailyRate; // Single day rate
        
        // Insurance reduction
        const insuranceReduction = document.querySelector('input[name="insurance-reduction"]:checked');
        if (insuranceReduction && insuranceReduction.value === 'yes') {
            insuranceCost = Math.round(subtotal * 0.1);
            deductible = 500;
        }
    }
    
    const total = subtotal + deposit + insuranceCost;
    
    // Update display
    document.getElementById('deductibleAmount').textContent = `$${deductible}`;
    document.getElementById('depositAmount').textContent = `$${deposit} (returned 7 days after rental)`;
    document.getElementById('insuranceAmount').textContent = `$${insuranceCost}`;
    
    // Show pricing for single day
    let totalText = `$${total}`;
    if (totalDays > 0) {
        totalText += ` (incl. deposit & insurance if selected)`;
    }
    
    document.getElementById('totalAmount').textContent = totalText;
}

// Clear selection button functionality
const clearSelectionBtn = document.getElementById('clearSelection');

clearSelectionBtn.addEventListener('click', () => {
    clearDateSelection();
});

function clearDateSelection() {
    selectedDates = [];
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected', 'range-start', 'range-end', 'in-range');
    });
    
    if (calendarContainer) {
        calendarContainer.classList.remove('selection-mode');
    }
    
    clearSelectionBtn.style.display = 'none';
    
    // Reset time slots to show all options
    resetTimeSlots();
    
    updateBookingSummary();
}

function showClearSelectionButton() {
    if (selectedDates.length > 0) {
        clearSelectionBtn.style.display = 'flex';
    } else {
        clearSelectionBtn.style.display = 'none';
    }
}
