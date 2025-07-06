// js/configs.js

// Configuration initializers for the Admin Dashboard

/**
 * Google Sheets synchronization settings
 */
export function getInitialGoogleSheetsConfig() {
  return {
    connected: false,
    lastSync: null,
    vanSheet: {
      url: '',
      range: 'Vans!A1:Z100',
      connected: false,
      lastSync: null
    },
    pricingSheet: {
      url: '',
      range: 'Pricing!A1:Z100',
      connected: false,
      lastSync: null
    },
    syncInterval: 15 // minutes
  };
}

/**
 * Pricing rules such as discounts and surcharges
 */
export function getInitialPricingRules() {
  return [
    {
      id: 'rule1',
      name: 'Early Bird Discount',
      type: 'discount',
      condition: 'advance_booking',
      value: 10,
      unit: 'percent',
      criteria: { days: 30 },
      active: true
    },
    {
      id: 'rule2',
      name: 'Long Stay Discount',
      type: 'discount',
      condition: 'duration',
      value: 15,
      unit: 'percent',
      criteria: { days: 7 },
      active: true
    },
    {
      id: 'rule3',
      name: 'High Demand Surcharge',
      type: 'surcharge',
      condition: 'occupancy',
      value: 20,
      unit: 'percent',
      criteria: { occupancy: 80 },
      active: true
    }
  ];
}

/**
 * Seasonal pricing adjustments
 */
export function getInitialSeasonalPricing() {
  return [
    {
      id: 'summer',
      name: 'Summer Season',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      multiplier: 1.3,
      active: true
    },
    {
      id: 'winter',
      name: 'Winter Season',
      startDate: '2025-12-01',
      endDate: '2025-02-28',
      multiplier: 0.8,
      active: true
    },
    {
      id: 'holidays',
      name: 'Holiday Season',
      startDate: '2025-12-20',
      endDate: '2025-01-05',
      multiplier: 1.5,
      active: true
    }
  ];
}

/**
 * Display options for van cards and detail views
 */
export function getInitialDisplayConfig() {
  return {
    technicalSpecs: {
      showExtLength: true,
      showExtHeight: true,
      showExtWidth: true,
      showIntLength: true,
      showIntHeight: true,
      showIntWidth: true,
      showLicensePlate: false,
      showCalendarID: false,
      showVehicleAddress: true,
      showLoadVolume: true,
      showPricing: true,
      showCapacity: true,
      showFeatures: true,
      showDescription: true,
      showAvailabilityStatus: true
    },
    displayStyle: 'detailed', // 'minimal', 'detailed', 'comprehensive'
    cardLayout: 'grid', // 'grid', 'list', 'compact'
    showTechnicalModal: true,
    groupByType: false,
    sortBy: 'name'
  };
}
