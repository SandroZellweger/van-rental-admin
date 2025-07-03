// Script to clean up duplicate methods in admin-script.js
const fs = require('fs');
const path = require('path');

try {
    const filePath = path.join(__dirname, 'admin-script.js');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Find the first duplicate block starting from line 589
    let startRemoval = -1;
    let endRemoval = -1;
    
    for (let i = 580; i < lines.length; i++) {
        // Look for the start of the duplicate navigation setup
        if (lines[i].includes('renderDashboard() {') && lines[i+1] && lines[i+1].includes('const navLinks')) {
            startRemoval = i;
            console.log('Found duplicate start at line:', i + 1);
            break;
        }
    }
    
    if (startRemoval !== -1) {
        // Find where this duplicate block ends (look for the next proper method)
        for (let i = startRemoval + 1; i < lines.length; i++) {
            if (lines[i].includes('renderDashboard() {') && lines[i+1] && lines[i+1].includes('// Update stats')) {
                endRemoval = i;
                console.log('Found duplicate end at line:', i + 1);
                break;
            }
        }
        
        if (endRemoval !== -1) {
            // Remove the duplicate block
            const cleanLines = [
                ...lines.slice(0, startRemoval),
                ...lines.slice(endRemoval)
            ];
            
            const cleanContent = cleanLines.join('\n');
            fs.writeFileSync(filePath, cleanContent, 'utf8');
            console.log('Successfully removed duplicate methods!');
            console.log(`Removed lines ${startRemoval + 1} to ${endRemoval}`);
        } else {
            console.log('Could not find end of duplicate block');
        }
    } else {
        console.log('Could not find start of duplicate block');
    }
    
} catch (error) {
    console.error('Error:', error);
}
