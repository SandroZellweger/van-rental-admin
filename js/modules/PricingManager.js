// PricingManager.js - Handles pricing profiles, rules, and seasonal pricing
import { APIService } from '../services/APIService.js';

export class PricingManager {
    constructor() {
        this.api = new APIService();
        this.pricingProfiles = [];
        this.pricingRules = [];
        this.seasonalPricing = [];
        this.isLoading = false;
        this.error = null;
    }

    async loadPricingProfiles() {
        try {
            this.isLoading = true;
            this.error = null;
            const response = await this.api.getPricingProfiles();
            this.pricingProfiles = response.data || [];
            return this.pricingProfiles;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to load pricing profiles:', error);
            // Fallback to default profiles
            this.pricingProfiles = this.getDefaultPricingProfiles();
            return this.pricingProfiles;
        } finally {
            this.isLoading = false;
        }
    }

    async calculatePricing(pricingData) {
        try {
            this.isLoading = true;
            const response = await this.api.calculatePricing(pricingData);
            return response.data;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to calculate pricing:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    getDefaultPricingProfiles() {
        return [
            {
                id: 'standard',
                name: 'Standard Pricing',
                description: 'Regular pricing for most vans',
                baseMultiplier: 1.0,
                weekendMultiplier: 1.2,
                weeklyDiscount: 0.1,
                monthlyDiscount: 0.2,
                seasonalAdjustments: true,
                minimumDays: 1,
                maximumDays: 365,
                advanceBookingDiscount: {
                    '30': 0.05,
                    '60': 0.1,
                    '90': 0.15
                }
            },
            {
                id: 'premium',
                name: 'Premium Pricing',
                description: 'Higher pricing for premium vans',
                baseMultiplier: 1.3,
                weekendMultiplier: 1.4,
                weeklyDiscount: 0.08,
                monthlyDiscount: 0.15,
                seasonalAdjustments: true,
                minimumDays: 2,
                maximumDays: 365,
                advanceBookingDiscount: {
                    '30': 0.03,
                    '60': 0.07,
                    '90': 0.12
                }
            },
            {
                id: 'luxury',
                name: 'Luxury Pricing',
                description: 'Premium pricing for luxury vans',
                baseMultiplier: 1.8,
                weekendMultiplier: 2.0,
                weeklyDiscount: 0.05,
                monthlyDiscount: 0.12,
                seasonalAdjustments: true,
                minimumDays: 3,
                maximumDays: 365,
                advanceBookingDiscount: {
                    '30': 0.02,
                    '60': 0.05,
                    '90': 0.08
                }
            },
            {
                id: 'budget',
                name: 'Budget Pricing',
                description: 'Competitive pricing for budget-conscious customers',
                baseMultiplier: 0.8,
                weekendMultiplier: 1.0,
                weeklyDiscount: 0.15,
                monthlyDiscount: 0.25,
                seasonalAdjustments: false,
                minimumDays: 1,
                maximumDays: 365,
                advanceBookingDiscount: {
                    '30': 0.08,
                    '60': 0.15,
                    '90': 0.20
                }
            }
        ];
    }

    initializePricingRules() {
        return {
            lastMinuteBooking: {
                enabled: true,
                thresholdDays: 3,
                multiplier: 1.15,
                description: 'Last-minute booking surcharge'
            },
            extendedRental: {
                enabled: true,
                thresholdDays: 30,
                multiplier: 0.85,
                description: 'Extended rental discount'
            },
            earlyBird: {
                enabled: true,
                thresholdDays: 60,
                multiplier: 0.9,
                description: 'Early booking discount'
            },
            groupBooking: {
                enabled: true,
                thresholdVans: 3,
                multiplier: 0.88,
                description: 'Multiple van booking discount'
            },
            loyalty: {
                enabled: true,
                levels: {
                    bronze: { bookings: 3, multiplier: 0.95 },
                    silver: { bookings: 10, multiplier: 0.9 },
                    gold: { bookings: 25, multiplier: 0.85 }
                },
                description: 'Loyalty program discounts'
            }
        };
    }

    initializeSeasonalPricing() {
        return {
            peak: {
                name: 'Peak Season',
                multiplier: 1.5,
                periods: [
                    { start: '06-15', end: '08-31' }, // Summer
                    { start: '12-20', end: '01-05' }  // Winter holidays
                ],
                description: 'High demand periods'
            },
            high: {
                name: 'High Season',
                multiplier: 1.25,
                periods: [
                    { start: '04-01', end: '06-14' }, // Spring
                    { start: '09-01', end: '10-31' }  // Fall
                ],
                description: 'Moderate to high demand'
            },
            shoulder: {
                name: 'Shoulder Season',
                multiplier: 1.1,
                periods: [
                    { start: '03-01', end: '03-31' }, // Early spring
                    { start: '11-01', end: '11-30' }  // Late fall
                ],
                description: 'Moderate demand'
            },
            low: {
                name: 'Low Season',
                multiplier: 0.9,
                periods: [
                    { start: '01-06', end: '02-28' }, // Winter
                    { start: '12-01', end: '12-19' }  // Early winter
                ],
                description: 'Lower demand periods'
            }
        };
    }

    getPricingProfileById(profileId) {
        return this.pricingProfiles.find(profile => profile.id === profileId);
    }

    addPricingProfile(profileData) {
        const newProfile = {
            id: profileData.id || `profile_${Date.now()}`,
            ...profileData
        };
        this.pricingProfiles.push(newProfile);
        return newProfile;
    }

    updatePricingProfile(profileId, updateData) {
        const profile = this.getPricingProfileById(profileId);
        if (profile) {
            Object.assign(profile, updateData);
            return profile;
        }
        return null;
    }

    deletePricingProfile(profileId) {
        const index = this.pricingProfiles.findIndex(profile => profile.id === profileId);
        if (index !== -1) {
            const deletedProfile = this.pricingProfiles.splice(index, 1)[0];
            return deletedProfile;
        }
        return null;
    }

    calculatePrice(vanBasePrice, profileId, checkinDate, checkoutDate, options = {}) {
        const profile = this.getPricingProfileById(profileId);
        if (!profile) {
            return { error: 'Pricing profile not found' };
        }

        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

        if (days < profile.minimumDays || days > profile.maximumDays) {
            return { error: `Rental period must be between ${profile.minimumDays} and ${profile.maximumDays} days` };
        }

        let basePrice = vanBasePrice * profile.baseMultiplier;
        let totalPrice = basePrice * days;
        const breakdown = {
            basePrice,
            days,
            subtotal: totalPrice,
            adjustments: [],
            finalPrice: totalPrice
        };

        // Weekend pricing
        if (this.hasWeekend(checkin, checkout)) {
            const weekendDays = this.countWeekendDays(checkin, checkout);
            const weekendSurcharge = (basePrice * (profile.weekendMultiplier - 1)) * weekendDays;
            totalPrice += weekendSurcharge;
            breakdown.adjustments.push({
                type: 'weekend',
                description: `Weekend surcharge (${weekendDays} days)`,
                amount: weekendSurcharge
            });
        }

        // Weekly/monthly discounts
        if (days >= 28 && profile.monthlyDiscount > 0) {
            const monthlyDiscount = totalPrice * profile.monthlyDiscount;
            totalPrice -= monthlyDiscount;
            breakdown.adjustments.push({
                type: 'monthly_discount',
                description: 'Monthly discount',
                amount: -monthlyDiscount
            });
        } else if (days >= 7 && profile.weeklyDiscount > 0) {
            const weeklyDiscount = totalPrice * profile.weeklyDiscount;
            totalPrice -= weeklyDiscount;
            breakdown.adjustments.push({
                type: 'weekly_discount',
                description: 'Weekly discount',
                amount: -weeklyDiscount
            });
        }

        // Seasonal adjustments
        if (profile.seasonalAdjustments) {
            const seasonalAdjustment = this.calculateSeasonalAdjustment(checkin, checkout, totalPrice);
            if (seasonalAdjustment.amount !== 0) {
                totalPrice += seasonalAdjustment.amount;
                breakdown.adjustments.push(seasonalAdjustment);
            }
        }

        // Advance booking discount
        if (options.bookingDate) {
            const advanceDiscount = this.calculateAdvanceBookingDiscount(
                new Date(options.bookingDate), 
                checkin, 
                totalPrice, 
                profile
            );
            if (advanceDiscount.amount !== 0) {
                totalPrice += advanceDiscount.amount;
                breakdown.adjustments.push(advanceDiscount);
            }
        }

        // Pricing rules
        const rulesAdjustment = this.applyPricingRules(checkin, checkout, totalPrice, options);
        if (rulesAdjustment.amount !== 0) {
            totalPrice += rulesAdjustment.amount;
            breakdown.adjustments.push(rulesAdjustment);
        }

        breakdown.finalPrice = Math.max(totalPrice, 0);
        return breakdown;
    }

    hasWeekend(checkin, checkout) {
        const current = new Date(checkin);
        while (current < checkout) {
            if (current.getDay() === 0 || current.getDay() === 6) {
                return true;
            }
            current.setDate(current.getDate() + 1);
        }
        return false;
    }

    countWeekendDays(checkin, checkout) {
        let count = 0;
        const current = new Date(checkin);
        while (current < checkout) {
            if (current.getDay() === 0 || current.getDay() === 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count;
    }

    calculateSeasonalAdjustment(checkin, checkout, basePrice) {
        const seasonMultipliers = [];
        const current = new Date(checkin);
        
        while (current < checkout) {
            const season = this.getSeasonForDate(current);
            seasonMultipliers.push(season ? season.multiplier : 1.0);
            current.setDate(current.getDate() + 1);
        }

        const averageMultiplier = seasonMultipliers.reduce((sum, mult) => sum + mult, 0) / seasonMultipliers.length;
        const adjustment = basePrice * (averageMultiplier - 1.0);

        return {
            type: 'seasonal',
            description: `Seasonal adjustment (avg multiplier: ${averageMultiplier.toFixed(2)})`,
            amount: adjustment
        };
    }

    getSeasonForDate(date) {
        const monthDay = String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        
        for (const [seasonKey, season] of Object.entries(this.seasonalPricing)) {
            for (const period of season.periods) {
                if (this.isDateInPeriod(monthDay, period.start, period.end)) {
                    return { ...season, key: seasonKey };
                }
            }
        }
        return null;
    }

    isDateInPeriod(date, start, end) {
        // Handle year-crossing periods (e.g., Dec 20 - Jan 5)
        if (start > end) {
            return date >= start || date <= end;
        }
        return date >= start && date <= end;
    }

    calculateAdvanceBookingDiscount(bookingDate, checkinDate, basePrice, profile) {
        const daysInAdvance = Math.ceil((checkinDate - bookingDate) / (1000 * 60 * 60 * 24));
        
        let discountRate = 0;
        for (const [days, rate] of Object.entries(profile.advanceBookingDiscount)) {
            if (daysInAdvance >= parseInt(days)) {
                discountRate = Math.max(discountRate, rate);
            }
        }

        const discountAmount = basePrice * discountRate;
        return {
            type: 'advance_booking',
            description: `Advance booking discount (${daysInAdvance} days ahead)`,
            amount: -discountAmount
        };
    }

    applyPricingRules(checkin, checkout, basePrice, options = {}) {
        let totalAdjustment = 0;
        const adjustments = [];

        const bookingDate = options.bookingDate ? new Date(options.bookingDate) : new Date();
        const daysUntilCheckin = Math.ceil((checkin - bookingDate) / (1000 * 60 * 60 * 24));

        // Last-minute booking surcharge
        if (this.pricingRules.lastMinuteBooking.enabled && 
            daysUntilCheckin <= this.pricingRules.lastMinuteBooking.thresholdDays) {
            const surcharge = basePrice * (this.pricingRules.lastMinuteBooking.multiplier - 1);
            totalAdjustment += surcharge;
            adjustments.push(`Last-minute booking surcharge: +$${surcharge.toFixed(2)}`);
        }

        // Extended rental discount
        const rentalDays = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        if (this.pricingRules.extendedRental.enabled && 
            rentalDays >= this.pricingRules.extendedRental.thresholdDays) {
            const discount = basePrice * (1 - this.pricingRules.extendedRental.multiplier);
            totalAdjustment -= discount;
            adjustments.push(`Extended rental discount: -$${discount.toFixed(2)}`);
        }

        return {
            type: 'pricing_rules',
            description: adjustments.join(', '),
            amount: totalAdjustment
        };
    }

    renderPricingProfiles() {
        const profilesContainer = document.getElementById('pricing-profiles-container');
        if (!profilesContainer) return;

        const profilesHTML = this.pricingProfiles.map(profile => `
            <div class="pricing-profile-card">
                <div class="profile-header">
                    <h3>${profile.name}</h3>
                    <span class="profile-id">${profile.id}</span>
                </div>
                <div class="profile-details">
                    <p class="profile-description">${profile.description}</p>
                    <div class="profile-stats">
                        <div class="stat">
                            <label>Base Multiplier:</label>
                            <span>${profile.baseMultiplier}x</span>
                        </div>
                        <div class="stat">
                            <label>Weekend Multiplier:</label>
                            <span>${profile.weekendMultiplier}x</span>
                        </div>
                        <div class="stat">
                            <label>Weekly Discount:</label>
                            <span>${(profile.weeklyDiscount * 100).toFixed(0)}%</span>
                        </div>
                        <div class="stat">
                            <label>Monthly Discount:</label>
                            <span>${(profile.monthlyDiscount * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="btn btn-small btn-primary" onclick="adminDashboard.pricingManager.editPricingProfile('${profile.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="adminDashboard.pricingManager.duplicatePricingProfile('${profile.id}')">
                        <i class="fas fa-copy"></i> Duplicate
                    </button>
                    ${profile.id !== 'standard' ? `
                        <button class="btn btn-small btn-danger" onclick="adminDashboard.pricingManager.deletePricingProfile('${profile.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        profilesContainer.innerHTML = profilesHTML;
    }

    editPricingProfile(profileId) {
        const profile = this.getPricingProfileById(profileId);
        if (!profile) return;

        // Implementation would show a modal for editing
        console.log('Edit pricing profile:', profile);
    }

    duplicatePricingProfile(profileId) {
        const profile = this.getPricingProfileById(profileId);
        if (!profile) return;

        const duplicatedProfile = {
            ...profile,
            id: `${profile.id}_copy_${Date.now()}`,
            name: `${profile.name} (Copy)`
        };

        this.addPricingProfile(duplicatedProfile);
        this.renderPricingProfiles();

        if (window.adminDashboard && window.adminDashboard.uiManager) {
            window.adminDashboard.uiManager.showNotification('Pricing profile duplicated successfully!', 'success');
        }
    }

    updateSeasonalPricing(seasonKey, updateData) {
        if (this.seasonalPricing[seasonKey]) {
            Object.assign(this.seasonalPricing[seasonKey], updateData);
            return this.seasonalPricing[seasonKey];
        }
        return null;
    }

    updatePricingRule(ruleKey, updateData) {
        if (this.pricingRules[ruleKey]) {
            Object.assign(this.pricingRules[ruleKey], updateData);
            return this.pricingRules[ruleKey];
        }
        return null;
    }
}
