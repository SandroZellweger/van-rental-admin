// js/models.js

// Data models for the Admin Dashboard

// Van model with normalized schema
export class Van {
  constructor({
    id,
    name,
    type,
    status,
    enabled,
    location,
    pricePerDay,
    capacity,
    pricingProfileId,
    calendarId,
    features,
    description,
    dimensions = {},
    vehicleDetails = {}
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = status;
    this.enabled = enabled;
    this.location = location;
    this.pricePerDay = pricePerDay;
    this.capacity = capacity;
    this.pricingProfileId = pricingProfileId;
    this.calendarId = calendarId;
    this.features = features;
    this.description = description;

    // Group dimension data
    this.dimensions = {
      external: {
        length: dimensions.extLength || null,
        width: dimensions.extWidth || null,
        height: dimensions.extHeight || null
      },
      internal: {
        length: dimensions.intLength || null,
        width: dimensions.intWidth || null,
        height: dimensions.intHeight || null
      }
    };

    // Vehicle details like license plate, load volume
    this.vehicleDetails = {
      licensePlate: vehicleDetails.licensePlate || null,
      loadVolume: vehicleDetails.loadVolume || null
    };
  }
}

// Booking model
export class Booking {
  constructor({ id, customerId, customerName, customerEmail, vanId, startDate, endDate, status, total, phone }) {
    this.id = id;
    this.customerId = customerId;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.vanId = vanId;
    // parse strings into Date objects
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.status = status;
    this.total = total;
    this.phone = phone;
  }
}

// Pricing Profile model
export class PricingProfile {
  constructor({
    id,
    name,
    description,
    basePrice,
    weekendMultiplier,
    holidayMultiplier,
    minimumDays,
    cancellationPolicy,
    active
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.basePrice = basePrice;
    this.weekendMultiplier = weekendMultiplier;
    this.holidayMultiplier = holidayMultiplier;
    this.minimumDays = minimumDays;
    this.cancellationPolicy = cancellationPolicy;
    this.active = active;
  }
}

// Import JSON data, set up Ajv validators and add lookup functions; modify Booking to parse dates
import vansData from '../data/vans.json';
import bookingsData from '../data/bookings.json';
import pricingProfilesData from '../data/pricingProfiles.json';
import Ajv from 'ajv';

// Set up JSON schema validation
const ajv = new Ajv();
const vanSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' }, name: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' }, enabled: { type: 'boolean' },
    location: { type: 'string' }, pricePerDay: { type: 'number' }, capacity: { type: 'number' }, pricingProfileId: { type: 'string' },
    calendarId: { type: 'string' }, features: { type: 'array', items: { type: 'string' } }, description: { type: 'string' }
  },
  required: ['id','name','type','status','enabled','location','pricePerDay','capacity','pricingProfileId','calendarId','features','description'],
  additionalProperties: false
};
const bookingSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' }, customerId: { type: 'string' }, customerName: { type: 'string' }, customerEmail: { type: 'string' },
    vanId: { type: 'number' }, startDate: { type: 'string', format: 'date' }, endDate: { type: 'string', format: 'date' },
    status: { type: 'string' }, total: { type: 'number' }, phone: { type: 'string' }
  },
  required: ['id','customerId','customerName','customerEmail','vanId','startDate','endDate','status','total','phone'],
  additionalProperties: false
};
const pricingProfileSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' }, basePrice: { type: 'number' },
    weekendMultiplier: { type: 'number' }, holidayMultiplier: { type: 'number' }, minimumDays: { type: 'number' },
    cancellationPolicy: { type: 'string' }, active: { type: 'boolean' }
  },
  required: ['id','name','description','basePrice','weekendMultiplier','holidayMultiplier','minimumDays','cancellationPolicy','active'],
  additionalProperties: false
};
const validateVan = ajv.compile(vanSchema);
const validateBooking = ajv.compile(bookingSchema);
const validatePricingProfile = ajv.compile(pricingProfileSchema);

/**
 * Load and validate vans from JSON
 * @returns {Van[]}
 */
export function getInitialVans() {
  return vansData.map(data => {
    if (!validateVan(data)) throw new Error('Invalid van data: ' + JSON.stringify(validateVan.errors));
    return new Van(data);
  });
}

/**
 * Load and validate bookings from JSON
 * @returns {Booking[]}
 */
export function getInitialBookings() {
  return bookingsData.map(data => {
    if (!validateBooking(data)) throw new Error('Invalid booking data: ' + JSON.stringify(validateBooking.errors));
    return new Booking(data);
  });
}

/**
 * Load and validate pricing profiles from JSON
 * @returns {PricingProfile[]}
 */
export function getPricingProfiles() {
  return pricingProfilesData.map(data => {
    if (!validatePricingProfile(data)) throw new Error('Invalid pricing profile data: ' + JSON.stringify(validatePricingProfile.errors));
    return new PricingProfile(data);
  });
}

/**
 * Get a Map of vans keyed by ID for O(1) lookup
 * @returns {Map<number, Van>}
 */
export function getVansMap() {
  return new Map(getInitialVans().map(v => [v.id, v]));
}

/**
 * Get a Map of bookings keyed by ID for O(1) lookup
 * @returns {Map<string, Booking>}
 */
export function getBookingsMap() {
  return new Map(getInitialBookings().map(b => [b.id, b]));
}

/**
 * Get a Map of pricing profiles keyed by ID for O(1) lookup
 * @returns {Map<string, PricingProfile>}
 */
export function getPricingProfilesMap() {
  return new Map(getPricingProfiles().map(p => [p.id, p]));
}
