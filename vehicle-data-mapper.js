// Custom Google Sheets Integration for Moving Van Database
// This module handles the specific data structure from your existing Google Sheet

class VehicleDataMapper {
    constructor() {
        // Moving van categories - simplified to small/large for internal classification
        this.movingVanTypes = {
            small: { maxVolume: 15, maxLength: 6.0, basePrice: 119 },
            large: { maxVolume: 50, maxLength: 10.0, basePrice: 169 }
        };

        this.pricingProfiles = {
            small: 'daily',
            large: 'premium'
        };

        // Technical specifications that should be preserved exactly
        this.technicalFields = [
            'VehicleID', 'VehicleName', 'CalendarID', 'VehicleAdress', 'LicencePlate',
            'ExtHight', 'ExtLength', 'ExtLarge', 'IntHight', 'IntLength', 'IntLarge'
        ];
    }

    // Parse your Google Sheets data and convert to VanLife format
    parseVehicleData(sheetData) {
        // Assuming sheetData is an array of rows from your Google Sheet
        const [headers, ...rows] = sheetData;
        
        return rows.map(row => this.mapVehicleRow(headers, row)).filter(Boolean);
    }

    mapVehicleRow(headers, row) {
        try {
            const vehicle = {};
            
            // Create mapping object from headers and row data
            const data = {};
            headers.forEach((header, index) => {
                data[header.trim()] = row[index] || '';
            });

            // PRESERVE ALL ORIGINAL TECHNICAL DATA EXACTLY AS IS
            // These fields maintain the exact structure from your Google Sheet
            vehicle.VehicleID = data.VehicleID || '';
            vehicle.VehicleName = data.VehicleName || '';
            vehicle.CalendarID = data.CalendarID || '';
            vehicle.VehicleAdress = data.VehicleAdress || '';
            vehicle.LicencePlate = data.LicencePlate || '';
            vehicle.ExtHight = data.ExtHight || '';
            vehicle.ExtLength = data.ExtLength || '';
            vehicle.ExtLarge = data.ExtLarge || '';
            vehicle.IntHight = data.IntHight || '';
            vehicle.IntLength = data.IntLength || '';
            vehicle.IntLarge = data.IntLarge || '';

            // PRESERVE ANY ADDITIONAL TECHNICAL FIELDS 
            // Auto-preserve any other fields from the Google Sheet
            Object.keys(data).forEach(key => {
                if (!this.technicalFields.includes(key) && 
                    !['id', 'name', 'type', 'enabled', 'location', 'price', 'capacity', 
                      'pricing_profile', 'calendar_id', 'features', 'description', 'image_url'].includes(key)) {
                    vehicle[key] = data[key];
                }
            });

            // ADD BOOKING SYSTEM FIELDS (derived from original data for compatibility)
            vehicle.id = this.extractVehicleId(data.VehicleID);
            vehicle.name = data.VehicleName; // Keep original name exactly
            vehicle.calendar_id = data.CalendarID;
            vehicle.location = this.extractCity(data.VehicleAdress);

            // Determine moving van type from dimensions
            const extLength = this.parseNumber(data.ExtLength);
            const extHeight = this.parseNumber(data.ExtHight);
            const extWidth = this.parseNumber(data.ExtLarge);
            
            const intLength = this.parseNumber(data.IntLength);
            const intHeight = this.parseNumber(data.IntHight);
            const intWidth = this.parseNumber(data.IntLarge);

            // Calculate load volume and classify van type
            const loadVolume = this.calculateLoadVolume(intLength, intHeight, intWidth);
            vehicle.type = this.determineMovingVanType(loadVolume, extLength);
            vehicle.load_volume = loadVolume;
            vehicle.capacity = Math.round(loadVolume); // Cubic meters for booking system

            // Set pricing based on van classification
            vehicle.price = this.getMovingVanPricing(vehicle.type);
            vehicle.pricing_profile = this.pricingProfiles[vehicle.type];

            // Moving van specific features and status
            vehicle.enabled = true;
            vehicle.features = this.generateMovingVanFeatures(vehicle.type, extLength, loadVolume, data);
            vehicle.description = this.generateMovingVanDescription(data.VehicleName, vehicle.type, loadVolume, data);
            vehicle.image_url = this.generateImageUrl(vehicle.id, vehicle.type);

            return vehicle;
        } catch (error) {
            console.error('Error mapping vehicle row:', error, row);
            return null;
        }
    }

    extractVehicleId(vehicleId) {
        // Convert N01 to 1, N02 to 2, etc., or keep original format
        if (vehicleId && vehicleId.match(/^[A-Z]\d+$/)) {
            return parseInt(vehicleId.replace(/[^\d]/g, ''));
        }
        return vehicleId || Math.random().toString(36).substr(2, 9);
    }

    extractCity(address) {
        // Extract city from full address
        // "Via dei Patrizi 1, 6616 Losone - Posteggio No 2" -> "Losone"
        if (!address) return '';
        
        const match = address.match(/\d{4}\s+([^-,]+)/);
        if (match) return match[1].trim();
        
        // Alternative patterns
        const cityMatch = address.split(',').find(part => 
            part.match(/[A-Z][a-z]+/) && !part.match(/Via|Str|Road/)
        );
        return cityMatch ? cityMatch.trim() : address.split(',')[0].trim();
    }

    parseNumber(value) {
        if (!value) return 0;
        // Handle European decimal format (comma instead of dot)
        const cleaned = value.toString().replace(',', '.');
        // Extract first number if there are multiple (like "1.27 / 1.69")
        const firstNumber = cleaned.split(/[\s\/]+/)[0];
        return parseFloat(firstNumber) || 0;
    }

    calculateLoadVolume(length, height, width) {
        // Calculate internal load volume in cubic meters
        if (!length || !height || !width) return 0;
        return Math.round((length * height * width) * 100) / 100; // Round to 2 decimals
    }

    determineMovingVanType(loadVolume, extLength) {
        // Simplified classification: small or large
        if (loadVolume <= this.movingVanTypes.small.maxVolume && 
            extLength <= this.movingVanTypes.small.maxLength) {
            return 'small';
        } else {
            return 'large';
        }
    }

    getMovingVanPricing(vanType) {
        return this.movingVanTypes[vanType]?.basePrice || 149;
    }

    generateMovingVanFeatures(type, extLength, loadVolume, originalData) {
        const features = ['Moving Equipment', 'Cargo Straps', 'Hand Truck'];
        
        // Add features based on van classification
        if (type === 'small') {
            features.push('City Driving', 'Fuel Efficient', 'Easy Parking', 'Side Door Access');
        } else { // large
            features.push('Hydraulic Lift Gate', 'Wide Loading Door', 'Tie-Down Points', 'GPS Navigation', 'Professional Grade');
        }

        // Add technical features based on dimensions
        if (extLength > 6) {
            features.push('Long Load Capability');
        }
        if (loadVolume > 20) {
            features.push('High Volume Capacity');
        }

        // Add location-specific features if available
        if (originalData.VehicleAdress && originalData.VehicleAdress.includes('Posteggio')) {
            features.push('Dedicated Parking');
        }

        return features;
    }

    generateMovingVanDescription(vehicleName, type, loadVolume, originalData) {
        const typeDescriptions = {
            small: 'Compact moving van perfect for small moves and city driving',
            large: 'Large moving van suitable for house moves and commercial transport'
        };

        let description = `${vehicleName} - ${typeDescriptions[type] || 'Professional moving vehicle'}. `;
        description += `Load capacity: ${loadVolume}m³. `;
        
        if (originalData.LicencePlate) {
            description += `License: ${originalData.LicencePlate}. `;
        }
        
        if (originalData.VehicleAdress) {
            const location = this.extractCity(originalData.VehicleAdress);
            if (location) {
                description += `Available in ${location}.`;
            }
        }

        return description.trim();
    }

    generateImageUrl(vehicleId, type) {
        // Generate appropriate image URL based on van type
        return `images/moving-van-${type}-${vehicleId}.jpg`;
    }

    // Convert processed vehicles to VanLife dashboard format
    convertToVanLifeFormat(vehicles) {
        return vehicles.map(vehicle => ({
            ...vehicle,
            // Ensure all required fields are present
            id: vehicle.id || this.extractVehicleId(vehicle.VehicleID),
            name: vehicle.name || vehicle.VehicleName,
            type: vehicle.type || 'small', // Default to small if not determined
            enabled: vehicle.enabled !== false,
            location: vehicle.location || this.extractCity(vehicle.VehicleAdress),
            price: vehicle.price || this.getMovingVanPricing('small'),
            capacity: vehicle.capacity || vehicle.load_volume || 15,
            pricing_profile: vehicle.pricing_profile || 'daily',
            calendar_id: vehicle.calendar_id || vehicle.CalendarID,
            features: vehicle.features || ['Moving Equipment', 'Cargo Straps'],
            description: vehicle.description || `${vehicle.VehicleName} - Professional moving vehicle`,
            image_url: vehicle.image_url || this.generateImageUrl(vehicle.id, vehicle.type)
        }));
    }

    // Process Google Sheets data
    async processGoogleSheetData(sheetUrl) {
        try {
            // Extract sheet ID and convert to CSV export URL
            const sheetId = this.extractSheetId(sheetUrl);
            if (!sheetId) {
                throw new Error('Invalid Google Sheets URL. Please check the URL format.');
            }

            const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
            console.log('Fetching data from:', csvUrl);

            // Try different methods to bypass CSP restrictions
            let csvText;
            
            try {
                // Method 1: Direct fetch (may be blocked by CSP)
                const response = await fetch(csvUrl, {
                    mode: 'cors',
                    headers: {
                        'Accept': 'text/csv'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                csvText = await response.text();
            } catch (fetchError) {
                console.warn('Direct fetch failed (likely CSP), trying alternative method:', fetchError.message);
                
                // Method 2: Use JSONP-style approach with script tag
                csvText = await this.fetchViaProxy(csvUrl, sheetId);
            }

            console.log('Raw CSV data received:', csvText.substring(0, 200) + '...');

            // Parse CSV data
            const sheetData = this.parseCSV(csvText);
            console.log('Parsed sheet data:', sheetData);

            // Process the data through our mapper
            const vehicles = this.parseVehicleData(sheetData);
            const vanLifeFormat = this.convertToVanLifeFormat(vehicles);

            return {
                success: true,
                message: `Successfully imported ${vehicles.length} vehicles from Google Sheets`,
                vehicles: vanLifeFormat,
                rawData: vehicles
            };

        } catch (error) {
            console.error('Error processing Google Sheet:', error);
            
            // If all methods fail, provide helpful fallback
            if (error.message.includes('Content Security Policy') || 
                error.message.includes('CSP') || 
                error.message.includes('Failed to fetch') ||
                error.message.includes('CSP_BLOCKED')) {
                
                const sheetId = this.extractSheetId(sheetUrl);
                return {
                    success: false,
                    error: 'Browser security policy blocks direct Google Sheets access',
                    suggestion: 'Please use the manual CSV import method',
                    csvUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`,
                    vehicles: [],
                    showManualImport: true
                };
            }
            
            return {
                success: false,
                error: error.message,
                vehicles: []
            };
        }
    }

    // Alternative method to fetch data using dynamic script loading
    async fetchViaProxy(csvUrl, sheetId) {
        return new Promise((resolve, reject) => {
            // For CSP-restricted environments, we'll provide instructions for manual import
            reject(new Error('CSP_BLOCKED'));
        });
    }

    // Manual CSV processing method
    processManualCSV(csvText) {
        try {
            console.log('Processing manual CSV input...');
            
            // Parse CSV data
            const sheetData = this.parseCSV(csvText);
            console.log('Parsed manual CSV data:', sheetData);

            // Process the data through our mapper
            const vehicles = this.parseVehicleData(sheetData);
            const vanLifeFormat = this.convertToVanLifeFormat(vehicles);

            return {
                success: true,
                message: `Successfully processed ${vehicles.length} vehicles from CSV data`,
                vehicles: vanLifeFormat,
                rawData: vehicles
            };

        } catch (error) {
            console.error('Error processing manual CSV:', error);
            return {
                success: false,
                error: error.message,
                vehicles: []
            };
        }
    }

    // Parse CSV text into array of arrays
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const result = [];

        for (let line of lines) {
            // Handle CSV parsing with quoted fields
            const row = this.parseCSVLine(line);
            if (row.length > 0) {
                result.push(row);
            }
        }

        return result;
    }

    // Parse a single CSV line, handling quotes and commas
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Field separator
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        // Add the last field
        result.push(current.trim());
        return result;
    }

    // Test data for demonstration
    getTestMovingVanData() {
        const testData = [
            ['VehicleID', 'VehicleName', 'CalendarID', 'VehicleAdress', 'LicencePlate', 'ExtHight', 'ExtLength', 'ExtLarge', 'IntHight', 'IntLength', 'IntLarge'],
            ['N01', 'Opel Vivaro (Losone)', 'cal_001', 'Via dei Patrizi 1, 6616 Losone - Posteggio No 2', 'TI 123456', '2,27', '5,40', '2,07', '1,86', '3,12', '1,83'],
            ['N02', 'Ford Transit (Bellinzona)', 'cal_002', 'Via Stazione 15, 6500 Bellinzona', 'TI 789012', '2,52', '6,20', '2,13', '1,98', '3,70', '1,87'],
            ['N03', 'Mercedes Sprinter (Lugano)', 'cal_003', 'Via Cantonale 42, 6900 Lugano', 'TI 345678', '2,75', '7,35', '2,20', '2,14', '4,30', '1,92']
        ];
        
        return this.parseVehicleData(testData);
    }

    // Utility function to extract sheet ID from Google Sheets URL
    extractSheetId(url) {
        // Handle different Google Sheets URL formats
        const patterns = [
            /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
            /\/spreadsheets\/u\/\d+\/d\/([a-zA-Z0-9-_]+)/,
            /^([a-zA-Z0-9-_]+)$/ // Direct sheet ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return null;
    }

    // Test with real Google Sheets connection
    async testRealConnection(sheetUrl) {
        console.log('Testing real Google Sheets connection...');
        const result = await this.processGoogleSheetData(sheetUrl);
        console.log('Connection test result:', result);
        return result;
    }

    // Test the mapping functionality
    testMapping() {
        console.log('Testing vehicle data mapping...');
        const testVehicles = this.getTestMovingVanData();
        const vanLifeFormat = this.convertToVanLifeFormat(testVehicles);
        console.log('Test results:', vanLifeFormat);
        return vanLifeFormat;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VehicleDataMapper;
}

// Export for use in admin dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VehicleDataMapper;
} else {
    window.VehicleDataMapper = VehicleDataMapper;
}
