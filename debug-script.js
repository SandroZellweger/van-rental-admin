// Simple test to verify the duplicate methods issue
console.log('Testing admin script structure...');

// First, let's check what line 589 is
const fs = require('fs');
const path = require('path');

try {
    const filePath = path.join(__dirname, 'admin-script.js');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log('Line 589:', lines[588]); // 0-indexed
    console.log('Line 590:', lines[589]);
    console.log('Line 591:', lines[590]);
    
    // Look for duplicate methods
    const duplicateSetupNav = content.match(/setupNavigation\(\)/g);
    const duplicateSetupEvent = content.match(/setupEventListeners\(\)/g);
    const duplicateCreatePricing = content.match(/createPricingProfile\(event\)/g);
    
    console.log('setupNavigation occurrences:', duplicateSetupNav ? duplicateSetupNav.length : 0);
    console.log('setupEventListeners occurrences:', duplicateSetupEvent ? duplicateSetupEvent.length : 0);
    console.log('createPricingProfile occurrences:', duplicateCreatePricing ? duplicateCreatePricing.length : 0);
    
} catch (error) {
    console.error('Error reading file:', error);
}
