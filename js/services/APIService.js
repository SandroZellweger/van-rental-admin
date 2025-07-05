// APIService.js - Backend API integration service
export class APIService {
    constructor() {
        this.baseURL = 'http://localhost:3002/api/v1';
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Van Resources API
    async getVans(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.request(`/resources/vans${queryString ? `?${queryString}` : ''}`);
    }

    async getVan(vanId) {
        return this.request(`/resources/vans/${vanId}`);
    }

    async createVan(vanData) {
        return this.request('/resources/vans', {
            method: 'POST',
            body: JSON.stringify(vanData)
        });
    }

    async updateVan(vanId, vanData) {
        return this.request(`/resources/vans/${vanId}`, {
            method: 'PUT',
            body: JSON.stringify(vanData)
        });
    }

    async updateVanStatus(vanId, status) {
        return this.request(`/resources/vans/${vanId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }

    async deleteVan(vanId) {
        return this.request(`/resources/vans/${vanId}`, {
            method: 'DELETE'
        });
    }

    // Bookings API
    async getBookings(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.request(`/bookings${queryString ? `?${queryString}` : ''}`);
    }

    async getBooking(bookingId) {
        return this.request(`/bookings/${bookingId}`);
    }

    async createBooking(bookingData) {
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    async updateBooking(bookingId, bookingData) {
        return this.request(`/bookings/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify(bookingData)
        });
    }

    async cancelBooking(bookingId) {
        return this.request(`/bookings/${bookingId}`, {
            method: 'DELETE'
        });
    }

    async getBookingStats() {
        return this.request('/bookings/stats');
    }

    // Pricing API
    async calculatePricing(pricingData) {
        return this.request('/pricing/calculate', {
            method: 'POST',
            body: JSON.stringify(pricingData)
        });
    }

    async getPricingProfiles() {
        return this.request('/pricing/profiles');
    }

    // Availability API
    async checkAvailability(availabilityData) {
        return this.request('/availability/check', {
            method: 'POST',
            body: JSON.stringify(availabilityData)
        });
    }

    async getAvailabilityCalendar(vanId, year, month) {
        return this.request(`/availability/calendar/${vanId}?year=${year}&month=${month}`);
    }

    // Search API
    async searchAvailability(searchParams) {
        return this.request('/search/availability', {
            method: 'POST',
            body: JSON.stringify(searchParams)
        });
    }

    async getSearchFilters() {
        return this.request('/search/filters');
    }

    // Admin API
    async getAdminDashboard() {
        return this.request('/admin/dashboard');
    }

    async getAdminSettings() {
        return this.request('/admin/settings');
    }

    // Analytics API
    async getRevenueAnalytics(period = 'month', year = new Date().getFullYear()) {
        return this.request(`/analytics/revenue?period=${period}&year=${year}`);
    }

    async getOccupancyAnalytics() {
        return this.request('/analytics/occupancy');
    }

    // Health Check
    async checkHealth() {
        return this.request('/health', { baseURL: 'http://localhost:3000' });
    }
}
