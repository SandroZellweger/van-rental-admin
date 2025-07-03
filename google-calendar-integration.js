// Google Calendar Integration Module
class GoogleCalendarIntegration {
    constructor() {
        this.isSignedIn = false;
        this.gapi = null;
        this.calendars = {};
        
        // Demo mode - set this to true to test without Google credentials
        this.demoMode = false; // Set to false to use real Google Calendar API
        
        // Your Google API credentials
        this.clientId = '552211122555-c6k3049r5c3do1m8j823c8ketl1097dj.apps.googleusercontent.com'; 
        this.apiKey = 'AIzaSyAgGXL6U8Bm6Z1VkbOM02AFklVN49Ma76U'; 
        this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
        this.scopes = 'https://www.googleapis.com/auth/calendar';
    }

    async initialize() {
        try {
            console.log('🚀 Starting Google Calendar integration...');
            
            if (this.demoMode) {
                console.log('🎭 Running in DEMO MODE - using simulated calendar data');
                console.log('📝 To use real Google Calendars, see GOOGLE_CALENDAR_SETUP.md');
                this.setupCalendarMappings();
                this.isSignedIn = true; // Simulate being signed in
                console.log('✅ Demo mode initialized successfully');
                return;
            }
            
            await this.loadGoogleAPI();
            console.log('✅ Google API loaded successfully');
            
            await this.initializeGapi();
            console.log('✅ Google API initialized successfully');
            
            this.setupCalendarMappings();
            console.log('✅ Calendar mappings configured for 9 vans');
            
            console.log('🎉 Google Calendar integration initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Google Calendar integration:', error);
        }
    }

    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async initializeGapi() {
        return new Promise((resolve, reject) => {
            // Check if we're running locally (file:// protocol or localhost without HTTPS)
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const isFileProtocol = window.location.protocol === 'file:';
            const isHttpLocalhost = window.location.protocol === 'http:' && isLocalhost;
            
            if (isFileProtocol) {
                console.log('⚠️ Running on file:// protocol - Google Calendar API disabled');
                console.log('📝 To test Google Calendar integration, serve the site via HTTP server');
                console.log('💡 Current server running on: http://localhost:8000');
                resolve();
                return;
            }
            
            if (isHttpLocalhost) {
                console.log('🔧 Running on HTTP localhost - Google Calendar API may have limitations');
                console.log('⚡ For production, use HTTPS domain with proper OAuth setup');
                // Continue with initialization for testing
            }

            window.gapi.load('client', async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: this.apiKey,
                        discoveryDocs: [this.discoveryDoc],
                    });

                    this.gapi = window.gapi;
                    
                    // Initialize Google Identity Services for authentication
                    this.initializeGoogleIdentity();
                    
                    resolve();
                } catch (error) {
                    console.error('❌ Failed to initialize Google API client:', error);
                    reject(error);
                }
            });
        });
    }

    setupCalendarMappings() {
        // Map each van to a specific Google Calendar ID
        // For testing: using primary calendar for all vans
        // TODO: Replace with individual calendar IDs for each van
        const primaryCalendar = 'primary'; // Uses your main Google Calendar
        
        this.calendars = {
            '1': primaryCalendar, // Compact Van 1 - Nissan NV200
            '2': primaryCalendar, // Compact Van 2 - Ford Transit Connect  
            '3': primaryCalendar, // Standard Van 1 - Ford Transit
            '4': primaryCalendar, // Standard Van 2 - Mercedes Sprinter
            '5': primaryCalendar, // Standard Van 3 - Iveco Daily
            '6': primaryCalendar, // Luxury Van 1 - Mercedes Sprinter Luxury
            '7': primaryCalendar, // Luxury Van 2 - VW Crafter Premium
            '8': primaryCalendar, // Family Van 1 - Ford Galaxy
            '9': primaryCalendar  // Family Van 2 - VW Multivan
        };
        
        console.log('📅 Calendar mappings configured - using primary calendar for testing');
        console.log('💡 All vans mapped to your main Google Calendar for initial testing');
    }

    updateSigninStatus(isSignedIn) {
        this.isSignedIn = isSignedIn;
        
        if (isSignedIn) {
            console.log('🔐 User is signed in to Google Calendar');
            console.log('📅 Calendar access granted - real-time availability enabled');
            this.enableCalendarFeatures();
        } else {
            console.log('🔑 User is not signed in to Google Calendar');
            console.log('📅 Using fallback availability data');
            this.disableCalendarFeatures();
        }
    }

    async signIn() {
        if (!this.tokenClient) {
            throw new Error('Google Identity Services not initialized');
        }
        
        // Check if already authenticated
        if (this.isSignedIn) {
            console.log('✅ Already signed in to Google Calendar');
            return;
        }
        
        try {
            console.log('🔑 Attempting to sign in to Google Calendar...');
            
            // Request access token for Calendar API
            this.tokenClient.requestAccessToken({
                prompt: 'consent' // Always show consent for new sign-ins
            });
            
            // The actual sign-in is handled by the callback in handleTokenResponse
            console.log('📝 Sign-in request initiated...');
            
        } catch (error) {
            console.error('❌ Google Calendar sign-in failed:', error);
            
            // Provide specific error messages based on error type
            if (error.error === 'popup_blocked_by_browser') {
                throw new Error('Sign-in popup was blocked by browser. Please allow popups and try again.');
            } else if (error.error === 'access_denied') {
                throw new Error('Access denied. Please grant calendar permissions and try again.');
            } else if (error.error === 'redirect_uri_mismatch') {
                throw new Error('OAuth configuration error. Please add http://localhost:8000 to authorized origins in Google Cloud Console.');
            } else {
                throw new Error(`Sign-in failed: ${error.error || error.message || 'Unknown error'}`);
            }
        }
    }

    async signOut() {
        try {
            // Clear stored authentication
            localStorage.removeItem('vanlife_google_auth');
            
            // Revoke the access token if available
            if (window.gapi && window.gapi.client && window.gapi.client.getToken()) {
                const token = window.gapi.client.getToken();
                if (token && token.access_token) {
                    // Revoke the token
                    await fetch(`https://oauth2.googleapis.com/revoke?token=${token.access_token}`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        }
                    });
                }
                
                // Clear the token from gapi client
                window.gapi.client.setToken(null);
            }
            
            console.log('🔓 Signing out from Google Calendar...');
            this.isSignedIn = false;
            this.updateSigninStatus(false);
            console.log('✅ Signed out successfully');
        } catch (error) {
            console.error('⚠️ Error during sign-out:', error);
            // Still update the UI even if revocation fails
            this.isSignedIn = false;
            this.updateSigninStatus(false);
        }
    }

    enableCalendarFeatures() {
        // Enable calendar sync buttons in admin panel
        const syncButtons = document.querySelectorAll('.calendar-sync-btn');
        syncButtons.forEach(btn => {
            btn.disabled = false;
            btn.textContent = 'Sync with Google Calendar';
        });

        // Show Google Calendar status as connected
        const statusElements = document.querySelectorAll('.google-calendar-status');
        statusElements.forEach(element => {
            element.textContent = 'Connected';
            element.className = 'google-calendar-status connected';
        });
    }

    disableCalendarFeatures() {
        // Disable calendar sync buttons
        const syncButtons = document.querySelectorAll('.calendar-sync-btn');
        syncButtons.forEach(btn => {
            btn.disabled = true;
            btn.textContent = 'Sign in to Google';
        });

        // Show Google Calendar status as disconnected
        const statusElements = document.querySelectorAll('.google-calendar-status');
        statusElements.forEach(element => {
            element.textContent = 'Not Connected';
            element.className = 'google-calendar-status disconnected';
        });
    }

    async createBookingEvent(vanId, bookingData) {
        if (this.demoMode) {
            console.log('🎭 Demo mode: Simulating booking event creation');
            console.log(`📝 Would create booking for Van ${vanId}:`, {
                customer: bookingData.customerName,
                dates: `${bookingData.startDate} to ${bookingData.endDate}`,
                duration: bookingData.duration,
                total: bookingData.total
            });
            // Return a simulated booking event
            return {
                id: 'demo_' + Date.now(),
                summary: `Booking: ${bookingData.customerName} - Van ${vanId}`,
                start: { date: bookingData.startDate },
                end: { date: this.addDays(bookingData.endDate, 1) },
                description: this.formatBookingDescription(bookingData)
            };
        }

        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google Calendar');
        }

        const calendarId = this.getCalendarIdForVan(vanId);
        if (!calendarId) {
            throw new Error(`No calendar mapped for van ${vanId}`);
        }

        console.log(`📝 Creating booking event for Van ${vanId} in calendar: ${calendarId.substring(0, 20)}...`);
        console.log(`📅 Booking details:`, {
            customer: bookingData.customerName,
            dates: `${bookingData.startDate} to ${bookingData.endDate}`,
            duration: bookingData.duration,
            total: bookingData.total
        });

        const event = {
            summary: `Van Rental - ${bookingData.customerName}`,
            description: this.formatBookingDescription(bookingData),
            start: {
                date: bookingData.startDate
            },
            end: {
                date: this.addDays(bookingData.endDate, 1) // Google Calendar end date is exclusive
            },
            colorId: this.getEventColorForStatus(bookingData.status),
            attendees: [
                {
                    email: bookingData.customerEmail,
                    displayName: bookingData.customerName
                }
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 1 day before
                    { method: 'popup', minutes: 60 } // 1 hour before
                ]
            }
        };

        try {
            const response = await this.gapi.client.calendar.events.insert({
                calendarId: calendarId,
                resource: event
            });

            console.log('✅ Booking event created successfully in Google Calendar!');
            console.log('📋 Event details:', response.result);
            return response.result;
        } catch (error) {
            console.error('❌ Error creating calendar event:', error);
            throw error;
        }
    }

    async updateBookingEvent(eventId, vanId, bookingData) {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google Calendar');
        }

        const calendarId = this.getCalendarIdForVan(vanId);
        
        const event = {
            summary: `Van Rental - ${bookingData.customerName}`,
            description: this.formatBookingDescription(bookingData),
            start: {
                date: bookingData.startDate
            },
            end: {
                date: this.addDays(bookingData.endDate, 1)
            },
            colorId: this.getEventColorForStatus(bookingData.status)
        };

        try {
            const response = await this.gapi.client.calendar.events.update({
                calendarId: calendarId,
                eventId: eventId,
                resource: event
            });

            console.log('Event updated successfully:', response.result);
            return response.result;
        } catch (error) {
            console.error('Error updating calendar event:', error);
            throw error;
        }
    }

    async deleteBookingEvent(eventId, vanId) {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google Calendar');
        }

        const calendarId = this.getCalendarIdForVan(vanId);

        try {
            await this.gapi.client.calendar.events.delete({
                calendarId: calendarId,
                eventId: eventId
            });

            console.log('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting calendar event:', error);
            throw error;
        }
    }

    async getVanAvailability(vanId, startDate, endDate) {
        console.log(`🔍 Checking availability for Van ${vanId} from ${startDate} to ${endDate}`);
        
        if (this.demoMode) {
            console.log('🎭 Demo mode: Using simulated calendar data');
            return this.getLocalAvailability(vanId, startDate, endDate);
        }
        
        if (!this.isSignedIn) {
            console.log('⚠️ Not signed in to Google Calendar - using local fallback data');
            return this.getLocalAvailability(vanId, startDate, endDate);
        }

        const calendarId = this.getCalendarIdForVan(vanId);
        if (!calendarId) {
            console.log(`❌ No calendar ID found for Van ${vanId}`);
            return this.getLocalAvailability(vanId, startDate, endDate);
        }

        console.log(`📡 Fetching real-time availability from Google Calendar: ${calendarId.substring(0, 20)}...`);

        try {
            const response = await this.gapi.client.calendar.events.list({
                calendarId: calendarId,
                timeMin: startDate + 'T00:00:00Z',
                timeMax: endDate + 'T23:59:59Z',
                singleEvents: true,
                orderBy: 'startTime'
            });

            const events = response.result.items || [];
            console.log(`✅ Found ${events.length} existing bookings for Van ${vanId}`);
            
            if (events.length > 0) {
                console.log('📋 Existing bookings:', events.map(e => ({
                    summary: e.summary,
                    start: e.start.date || e.start.dateTime,
                    end: e.end.date || e.end.dateTime
                })));
            }
            
            return this.processEventsForAvailability(events);
        } catch (error) {
            console.error(`❌ Error fetching calendar events for Van ${vanId}:`, error);
            console.log('🔄 Falling back to local availability data');
            return this.getLocalAvailability(vanId, startDate, endDate);
        }
    }

    async syncAllCalendars() {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google Calendar');
        }

        const results = {};
        
        for (const [vanKey, calendarId] of Object.entries(this.calendars)) {
            try {
                const events = await this.getCalendarEvents(calendarId);
                results[vanKey] = {
                    success: true,
                    events: events.length,
                    data: events
                };
            } catch (error) {
                results[vanKey] = {
                    success: false,
                    error: error.message
                };
            }
        }

        return results;
    }

    async getCalendarEvents(calendarId, daysAhead = 365) {
        const timeMin = new Date().toISOString();
        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + daysAhead);

        const response = await this.gapi.client.calendar.events.list({
            calendarId: calendarId,
            timeMin: timeMin,
            timeMax: timeMax.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });

        return response.result.items || [];
    }

    getCalendarIdForVan(vanId) {
        // Direct mapping from van ID to calendar ID
        return this.calendars[vanId];
    }

    formatBookingDescription(bookingData) {
        return `
Van Rental Booking

Customer: ${bookingData.customerName}
Email: ${bookingData.customerEmail}
Phone: ${bookingData.phone || 'Not provided'}
Van Type: ${bookingData.vanType}
Booking ID: ${bookingData.bookingId || 'N/A'}
Total Amount: $${bookingData.total || 0}

Special Requests: ${bookingData.specialRequests || 'None'}

Pickup Location: ${bookingData.pickupLocation || 'To be confirmed'}
Pickup Time: ${bookingData.pickupTime || 'To be confirmed'}
        `.trim();
    }

    getEventColorForStatus(status) {
        const colorMap = {
            'confirmed': '2', // Green
            'pending': '5',   // Yellow
            'cancelled': '4', // Red
            'completed': '8'  // Gray
        };
        return colorMap[status] || '1'; // Default blue
    }

    addDays(dateStr, days) {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    // Helper function to filter out past time slots for today
    filterPastTimeSlots(availableSlots, dateStr) {
        const today = new Date();
        const checkDate = new Date(dateStr);
        
        // Only filter for today's date
        if (checkDate.toDateString() !== today.toDateString()) {
            return availableSlots;
        }
        
        const currentTimeMinutes = today.getHours() * 60 + today.getMinutes();
        console.log(`⏰ Current time: ${today.getHours()}:${String(today.getMinutes()).padStart(2, '0')} (${currentTimeMinutes} minutes from midnight)`);
        
        // Filter out slots that have already ended
        const availableNow = availableSlots.filter(slot => {
            const slotAvailable = slot.end > currentTimeMinutes;
            if (!slotAvailable) {
                console.log(`❌ Time slot ${slot.label} has already passed (ends at ${Math.floor(slot.end/60)}:${String(slot.end%60).padStart(2, '0')})`);
            } else {
                console.log(`✅ Time slot ${slot.label} is still available`);
            }
            return slotAvailable;
        });
        
        console.log(`📊 Available slots for today: ${availableNow.length}/${availableSlots.length}`);
        return availableNow;
    }

    processEventsForAvailability(events) {
        // Convert Google Calendar events to availability data with time slot tracking
        const availability = {};
        const timeSlots = {};
        
        // Define available time slots (in minutes from midnight)
        const availableSlots = [
            { start: 60, end: 720, label: "01:00 – 12:00" },      // 01:00-12:00
            { start: 420, end: 720, label: "07:00 – 12:00" },     // 07:00-12:00
            { start: 420, end: 1140, label: "07:00 – 19:00" },    // 07:00-19:00
            { start: 60, end: 1440, label: "01:00 – 00:00" },     // 01:00-00:00 (next day)
            { start: 780, end: 1140, label: "13:00 – 19:00" },    // 13:00-19:00
            { start: 780, end: 1440, label: "13:00 – 00:00" },    // 13:00-00:00 (next day)
            { start: 1200, end: 1440, label: "20:00 – 00:00" }    // 20:00-00:00 (next day)
        ];
        
        events.forEach(event => {
            let startDateTime, endDateTime;
            
            if (event.start.date) {
                // All-day event - entire day is reserved
                const startDate = new Date(event.start.date);
                const endDate = new Date(event.end.date);
                
                for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().split('T')[0];
                    availability[dateStr] = 'reserved';
                }
            } else if (event.start.dateTime) {
                // Timed event - check against available slots
                startDateTime = new Date(event.start.dateTime);
                endDateTime = new Date(event.end.dateTime);
                
                // Handle multi-day bookings - use local dates to avoid timezone issues
                // Create dates in local timezone by parsing the date parts
                let currentDate = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate());
                const endDate = new Date(endDateTime.getFullYear(), endDateTime.getMonth(), endDateTime.getDate());
                
                console.log(`🔍 Processing booking: ${event.summary}`);
                console.log(`📅 Start: ${startDateTime.toISOString()}, End: ${endDateTime.toISOString()}`);
                console.log(`📅 Local Start: ${startDateTime.getFullYear()}-${(startDateTime.getMonth()+1).toString().padStart(2,'0')}-${startDateTime.getDate().toString().padStart(2,'0')}`);
                console.log(`� Local End: ${endDateTime.getFullYear()}-${(endDateTime.getMonth()+1).toString().padStart(2,'0')}-${endDateTime.getDate().toString().padStart(2,'0')}`);
                console.log(`�🗓️ Date range (local): ${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,'0')}-${currentDate.getDate().toString().padStart(2,'0')} to ${endDate.getFullYear()}-${(endDate.getMonth()+1).toString().padStart(2,'0')}-${endDate.getDate().toString().padStart(2,'0')}`);
                
                while (currentDate <= endDate) {
                    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,'0')}-${currentDate.getDate().toString().padStart(2,'0')}`;
                    
                    console.log(`📆 Processing date: ${dateStr}`);
                    
                    // Calculate booking times for this specific day
                    let dayStartTime, dayEndTime;
                    
                    if (currentDate.toDateString() === startDateTime.toDateString()) {
                        // First day of booking
                        dayStartTime = startDateTime.getHours() * 60 + startDateTime.getMinutes();
                        if (currentDate.toDateString() === endDateTime.toDateString()) {
                            // Same day booking
                            dayEndTime = endDateTime.getHours() * 60 + endDateTime.getMinutes();
                            console.log(`⏰ Same-day booking: ${dayStartTime} to ${dayEndTime} minutes`);
                        } else {
                            // Multi-day booking, goes to end of day
                            dayEndTime = 1440; // End of day
                            console.log(`⏰ Multi-day start: ${dayStartTime} to 1440 (end of day)`);
                        }
                    } else if (currentDate.toDateString() === endDateTime.toDateString()) {
                        // Last day of multi-day booking
                        dayStartTime = 0; // Start of day
                        dayEndTime = endDateTime.getHours() * 60 + endDateTime.getMinutes();
                        console.log(`⏰ Multi-day end: 0 (start of day) to ${dayEndTime}`);
                    } else {
                        // Middle day of multi-day booking
                        dayStartTime = 0;
                        dayEndTime = 1440;
                        console.log(`⏰ Multi-day middle: 0 to 1440 (full day)`);
                    }
                    
                    // Check which time slots are blocked
                    if (!timeSlots[dateStr]) {
                        timeSlots[dateStr] = {
                            blocked: [],
                            availableSlots: [...availableSlots]
                        };
                    }
                    
                    timeSlots[dateStr].blocked.push({ start: dayStartTime, end: dayEndTime });
                    
                    // Get the available slots for this date (filtered for past slots if it's today)
                    const slotsToCheck = this.filterPastTimeSlots(availableSlots, dateStr);
                    
                    // Check which slots are still available (not conflicting with bookings)
                    const nonConflictingSlots = slotsToCheck.filter(slot => {
                        // Check if this slot conflicts with any booking
                        const conflicts = timeSlots[dateStr].blocked.some(booking => 
                            !(booking.end <= slot.start || booking.start >= slot.end)
                        );
                        console.log(`🎯 Slot ${slot.label}: ${conflicts ? 'BLOCKED' : 'AVAILABLE'}`);
                        return !conflicts;
                    });
                    
                    // Store the available slots for this date
                    timeSlots[dateStr].availableSlots = nonConflictingSlots;
                    
                    console.log(`📊 Available slots for ${dateStr}: ${nonConflictingSlots.length}/${slotsToCheck.length} (${availableSlots.length - slotsToCheck.length} past slots filtered)`);
                    
                    if (nonConflictingSlots.length === 0) {
                        availability[dateStr] = 'reserved';
                        console.log(`🔴 ${dateStr}: FULLY RESERVED`);
                    } else {
                        availability[dateStr] = 'partially_available';
                        console.log(`🟡 ${dateStr}: PARTIALLY AVAILABLE`);
                    }
                    
                    // Move to next day
                    currentDate.setDate(currentDate.getDate() + 1);
                    
                    // Safety check to prevent infinite loop
                    if (currentDate > new Date(endDateTime.getTime() + 24*60*60*1000)) {
                        console.log('⚠️ Breaking loop - safety check');
                        break;
                    }
                }
            }
        });
        
        // After processing all events, check for past time slots on dates without events
        // This handles the case where a date has no bookings but some time slots have passed
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Check if today has any availability status set, if not check time slots
        if (!availability[todayStr]) {
            const currentTimeAvailableSlots = this.filterPastTimeSlots(availableSlots, todayStr);
            
            if (currentTimeAvailableSlots.length === 0) {
                availability[todayStr] = 'reserved';
                console.log(`🔴 ${todayStr}: All time slots have passed for today`);
            } else {
                // Today with no bookings should be 'available' even if some slots have passed
                // Only mark as 'partially_available' if there are actual booking conflicts
                availability[todayStr] = 'available';
                console.log(`� ${todayStr}: Available (${currentTimeAvailableSlots.length}/${availableSlots.length} time slots remaining today)`);
            }
        }
        
        // Also update time slots data for today to reflect available slots
        if (!timeSlots[todayStr]) {
            timeSlots[todayStr] = {
                blocked: [],
                availableSlots: this.filterPastTimeSlots(availableSlots, todayStr)
            };
        } else {
            // Update available slots for today considering past time slots
            timeSlots[todayStr].availableSlots = this.filterPastTimeSlots(availableSlots, todayStr);
        }
        
        console.log('📊 Processed availability data:', availability);
        console.log('⏰ Time slots data:', timeSlots);
        
        // Ensure all dates in the range have time slot data
        this.populateTimeSlotDataForAllDates(availability, timeSlots, availableSlots);
        
        return { availability, timeSlots };
    }

    // Populate time slot data for all dates in the availability range
    populateTimeSlotDataForAllDates(availability, timeSlots, availableSlots) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Generate time slot data for the full range (6 months ahead)
        for (let month = 0; month < 6; month++) {
            const date = new Date(today.getFullYear(), today.getMonth() + month, 1);
            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDay = new Date(date.getFullYear(), date.getMonth(), day);
                const dateStr = currentDay.toISOString().split('T')[0];
                
                // Skip past dates
                if (currentDay < today) continue;
                
                // If this date doesn't have time slot data yet, create it
                if (!timeSlots[dateStr]) {
                    const status = availability[dateStr];
                    
                    if (status === 'available' || !status) {
                        // Completely available day - all slots available (unless it's today with past slots)
                        if (dateStr === todayStr) {
                            timeSlots[dateStr] = {
                                blocked: [],
                                availableSlots: this.filterPastTimeSlots(availableSlots, dateStr)
                            };
                        } else {
                            timeSlots[dateStr] = {
                                blocked: [],
                                availableSlots: [...availableSlots] // All slots available
                            };
                        }
                        
                        // Set availability status if not set
                        if (!availability[dateStr]) {
                            availability[dateStr] = 'available';
                        }
                    } else if (status === 'reserved') {
                        // Completely reserved day - no slots available
                        timeSlots[dateStr] = {
                            blocked: [...availableSlots], // All slots blocked
                            availableSlots: []
                        };
                    }
                    // For 'partially_available' dates, timeSlots should already be populated by the event processing
                }
            }
        }
        
        console.log('🔧 Updated time slots data with all dates:', Object.keys(timeSlots).length, 'dates');
    }

    isFullDayBlocked(slots) {
        // Check if time slots cover most of the day (e.g., more than 10 hours)
        // or if there are multiple overlapping bookings
        let totalBlockedMinutes = 0;
        
        // Sort slots by start time
        slots.sort((a, b) => a.start - b.start);
        
        // Merge overlapping slots and calculate total blocked time
        let mergedSlots = [];
        for (let slot of slots) {
            if (mergedSlots.length === 0 || mergedSlots[mergedSlots.length - 1].end < slot.start) {
                mergedSlots.push(slot);
            } else {
                mergedSlots[mergedSlots.length - 1].end = Math.max(mergedSlots[mergedSlots.length - 1].end, slot.end);
            }
        }
        
        // Calculate total blocked time
        for (let slot of mergedSlots) {
            totalBlockedMinutes += slot.end - slot.start;
        }
        
        // Consider day fully blocked if more than 10 hours (600 minutes) are taken
        return totalBlockedMinutes >= 600;
    }

    getLocalAvailability(vanId, startDate, endDate) {
        // Fallback to local availability data when Google Calendar is not available
        console.log('Using local availability data for van', vanId);
        return {};
    }

    // Utility method to create new calendars for vans
    async createVanCalendar(vanName, vanType) {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google Calendar');
        }

        const calendar = {
            summary: `${vanName} - ${vanType}`,
            description: `Booking calendar for ${vanName} (${vanType} van)`,
            timeZone: 'America/New_York' // Adjust to your timezone
        };

        try {
            const response = await this.gapi.client.calendar.calendars.insert({
                resource: calendar
            });

            console.log('Van calendar created:', response.result);
            return response.result;
        } catch (error) {
            console.error('Error creating van calendar:', error);
            throw error;
        }
    }

    initializeGoogleIdentity() {
        // Load Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
            console.log('✅ Google Identity Services loaded');
            
            // Check for stored authentication
            this.checkStoredAuth();
            
            // Initialize OAuth 2.0 flow for Calendar API access
            this.tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: this.clientId,
                scope: this.scopes,
                callback: (tokenResponse) => {
                    console.log('✅ OAuth token received');
                    this.handleTokenResponse(tokenResponse);
                },
                // Enable automatic token refresh
                prompt: '', // Don't prompt if user already granted consent
            });
            
            console.log('🔑 Google Identity Services initialized - ready for sign-in');
        };
        script.onerror = (error) => {
            console.error('❌ Failed to load Google Identity Services:', error);
        };
        document.head.appendChild(script);
    }

    checkStoredAuth() {
        // Check if we have stored authentication data
        const storedAuth = localStorage.getItem('vanlife_google_auth');
        if (storedAuth) {
            try {
                const authData = JSON.parse(storedAuth);
                const now = Date.now();
                
                // Check if token is still valid (not expired)
                if (authData.expires_at && now < authData.expires_at) {
                    console.log('🔄 Found valid stored authentication');
                    this.restoreAuthentication(authData);
                    return true;
                } else {
                    console.log('⚠️ Stored authentication expired, clearing...');
                    localStorage.removeItem('vanlife_google_auth');
                }
            } catch (error) {
                console.error('❌ Error parsing stored auth:', error);
                localStorage.removeItem('vanlife_google_auth');
            }
        }
        return false;
    }

    restoreAuthentication(authData) {
        // Set the access token for API requests
        if (window.gapi && window.gapi.client) {
            window.gapi.client.setToken({
                access_token: authData.access_token
            });
        }
        
        this.isSignedIn = true;
        this.updateSigninStatus(true);
        console.log('✅ Authentication restored from storage');
    }

    storeAuthentication(tokenResponse) {
        // Store authentication data for persistence
        const authData = {
            access_token: tokenResponse.access_token,
            expires_at: Date.now() + (tokenResponse.expires_in * 1000) - 60000, // Subtract 1 minute for safety
            scope: tokenResponse.scope,
            token_type: tokenResponse.token_type
        };
        
        localStorage.setItem('vanlife_google_auth', JSON.stringify(authData));
        console.log('💾 Authentication stored for future sessions');
    }

    handleTokenResponse(tokenResponse) {
        if (tokenResponse.error) {
            console.error('❌ OAuth token error:', tokenResponse.error);
            return;
        }
        
        // Set the access token for API requests
        if (window.gapi && window.gapi.client) {
            window.gapi.client.setToken({
                access_token: tokenResponse.access_token
            });
        }
        
        // Store authentication for persistence
        this.storeAuthentication(tokenResponse);
        
        console.log('🎉 Successfully authenticated with Google Calendar API');
        this.isSignedIn = true;
        this.updateSigninStatus(true);
    }
}

// Initialize the Google Calendar integration
const googleCalendar = new GoogleCalendarIntegration();

// Export for use in other modules
window.googleCalendar = googleCalendar;
