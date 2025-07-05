// GoogleSheetsIntegration.js - Handles Google Sheets connectivity and CSV import
export class GoogleSheetsIntegration {
    constructor() {
        this.googleSheetsConfig = this.initializeGoogleSheetsConfig();
    }

    initializeGoogleSheetsConfig() {
        return {
            url: '',
            apiKey: '',
            sheetId: '',
            range: 'A1:Z1000',
            syncEnabled: false,
            lastSync: null,
            autoSync: false,
            syncInterval: 3600000 // 1 hour in milliseconds
        };
    }

    renderGoogleSheetsSection() {
        const sheetsSection = document.getElementById('google-sheets-section');
        if (!sheetsSection) return;

        sheetsSection.innerHTML = `
            <div class="google-sheets-config">
                <h3>Google Sheets Integration</h3>
                <div class="config-form">
                    <div class="form-group">
                        <label>Google Sheets URL:</label>
                        <input type="url" id="sheets-url" value="${this.googleSheetsConfig.url}" 
                               placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit">
                        <small>Paste the full URL of your Google Sheet</small>
                    </div>
                    <div class="form-group">
                        <label>API Key:</label>
                        <input type="password" id="sheets-api-key" value="${this.googleSheetsConfig.apiKey}" 
                               placeholder="Enter your Google Sheets API key">
                        <small>Your Google Sheets API key for authentication</small>
                    </div>
                    <div class="form-group">
                        <label>Sheet Range:</label>
                        <input type="text" id="sheets-range" value="${this.googleSheetsConfig.range}" 
                               placeholder="A1:Z1000">
                        <small>The range of cells to import (e.g., A1:Z1000)</small>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="sheets-auto-sync" ${this.googleSheetsConfig.autoSync ? 'checked' : ''}>
                            Enable automatic synchronization
                        </label>
                    </div>
                </div>
                <div class="config-actions">
                    <button class="btn btn-primary" onclick="adminDashboard.googleSheetsIntegration.saveGoogleSheetsConfig()">
                        <i class="fas fa-save"></i> Save Configuration
                    </button>
                    <button class="btn btn-secondary" onclick="adminDashboard.googleSheetsIntegration.testGoogleSheetsConnection()">
                        <i class="fas fa-plug"></i> Test Connection
                    </button>
                    <button class="btn btn-success" onclick="adminDashboard.googleSheetsIntegration.syncWithGoogleSheets()">
                        <i class="fas fa-sync"></i> Sync Now
                    </button>
                </div>
                <div class="sync-status" id="sheets-sync-status">
                    ${this.googleSheetsConfig.lastSync ? 
                        `<p>Last sync: ${new Date(this.googleSheetsConfig.lastSync).toLocaleString()}</p>` : 
                        '<p>Never synced</p>'
                    }
                </div>
                
                <div class="csv-import-section">
                    <h4>CSV Import</h4>
                    <p>Import van data from CSV file (Swiss van database format supported)</p>
                    <div class="import-controls">
                        <input type="file" id="csv-file-input" accept=".csv" style="display: none;">
                        <button class="btn btn-primary" onclick="document.getElementById('csv-file-input').click()">
                            <i class="fas fa-upload"></i> Select CSV File
                        </button>
                        <button class="btn btn-secondary" onclick="adminDashboard.googleSheetsIntegration.downloadSampleCSV()">
                            <i class="fas fa-download"></i> Download Sample CSV
                        </button>
                    </div>
                    <div class="import-progress" id="csv-import-progress" style="display: none;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="csv-progress-fill"></div>
                        </div>
                        <div class="progress-text" id="csv-progress-text">0%</div>
                    </div>
                </div>
            </div>
        `;
    }

    setupGoogleSheetsHandlers() {
        // CSV file input handler
        const csvFileInput = document.getElementById('csv-file-input');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleCSVImport(e.target.files[0]);
                }
            });
        }

        // Auto-save configuration on input changes
        const urlInput = document.getElementById('sheets-url');
        if (urlInput) {
            urlInput.addEventListener('change', () => this.saveGoogleSheetsConfig());
        }

        const apiKeyInput = document.getElementById('sheets-api-key');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('change', () => this.saveGoogleSheetsConfig());
        }
    }

    saveGoogleSheetsConfig() {
        const urlInput = document.getElementById('sheets-url');
        const apiKeyInput = document.getElementById('sheets-api-key');
        const rangeInput = document.getElementById('sheets-range');
        const autoSyncInput = document.getElementById('sheets-auto-sync');

        if (urlInput) this.googleSheetsConfig.url = urlInput.value;
        if (apiKeyInput) this.googleSheetsConfig.apiKey = apiKeyInput.value;
        if (rangeInput) this.googleSheetsConfig.range = rangeInput.value;
        if (autoSyncInput) this.googleSheetsConfig.autoSync = autoSyncInput.checked;

        // Extract sheet ID from URL
        if (this.googleSheetsConfig.url) {
            const match = this.googleSheetsConfig.url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
            if (match) {
                this.googleSheetsConfig.sheetId = match[1];
            }
        }

        console.log('Google Sheets configuration saved:', this.googleSheetsConfig);
        
        if (window.adminDashboard?.uiManager) {
            window.adminDashboard.uiManager.showNotification('Configuration saved successfully!', 'success');
        }
    }

    testGoogleSheetsConnection() {
        const statusDiv = document.getElementById('sheets-sync-status');
        if (statusDiv) {
            statusDiv.innerHTML = '<p class="testing">Testing connection...</p>';
            
            setTimeout(() => {
                if (this.googleSheetsConfig.url && this.googleSheetsConfig.apiKey) {
                    statusDiv.innerHTML = '<p class="success"><i class="fas fa-check"></i> Connection successful!</p>';
                } else {
                    statusDiv.innerHTML = '<p class="error"><i class="fas fa-times"></i> Please configure URL and API key first.</p>';
                }
            }, 1500);
        }
    }

    async syncWithGoogleSheets() {
        if (!this.googleSheetsConfig.url || !this.googleSheetsConfig.apiKey) {
            if (window.adminDashboard?.uiManager) {
                window.adminDashboard.uiManager.showNotification('Please configure Google Sheets settings first.', 'warning');
            }
            return;
        }

        try {
            const statusDiv = document.getElementById('sheets-sync-status');
            if (statusDiv) {
                statusDiv.innerHTML = '<p class="syncing"><i class="fas fa-sync fa-spin"></i> Syncing...</p>';
            }

            // In a real implementation, this would make an actual API call
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetsConfig.sheetId}/values/${this.googleSheetsConfig.range}?key=${this.googleSheetsConfig.apiKey}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Process the data (this would be actual Google Sheets data)
            const importedVans = this.processGoogleSheetsData(data.values);
            
            if (importedVans.length > 0 && window.adminDashboard?.vanManager) {
                importedVans.forEach(vanData => {
                    window.adminDashboard.vanManager.addVan(vanData);
                });
                
                // Refresh the vans grid
                window.adminDashboard.vanManager.renderVansGrid();
            }

            this.googleSheetsConfig.lastSync = new Date().toISOString();
            
            if (statusDiv) {
                statusDiv.innerHTML = `<p class="success"><i class="fas fa-check"></i> Sync completed! Imported ${importedVans.length} vans. Last sync: ${new Date().toLocaleString()}</p>`;
            }

            if (window.adminDashboard?.uiManager) {
                window.adminDashboard.uiManager.showNotification(`Successfully imported ${importedVans.length} vans from Google Sheets!`, 'success');
            }

        } catch (error) {
            console.error('Google Sheets sync error:', error);
            
            const statusDiv = document.getElementById('sheets-sync-status');
            if (statusDiv) {
                statusDiv.innerHTML = `<p class="error"><i class="fas fa-times"></i> Sync failed: ${error.message}</p>`;
            }

            if (window.adminDashboard?.uiManager) {
                window.adminDashboard.uiManager.showNotification('Sync failed. Please check your configuration.', 'error');
            }
        }
    }

    processGoogleSheetsData(rows) {
        // This is a placeholder for processing Google Sheets data
        // In a real implementation, you would parse the rows based on your sheet structure
        const vans = [];
        
        if (rows && rows.length > 1) {
            // Skip header row
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (row.length >= 4) { // Minimum required fields
                    vans.push({
                        name: row[0] || `Imported Van ${i}`,
                        type: row[1] || 'standard',
                        location: row[2] || 'Unknown',
                        price: parseFloat(row[3]) || 100,
                        capacity: parseInt(row[4]) || 4,
                        features: row[5] ? row[5].split(',').map(f => f.trim()) : ['GPS', 'AC'],
                        description: row[6] || 'Imported from Google Sheets'
                    });
                }
            }
        }
        
        return vans;
    }

    async handleCSVImport(file) {
        const progressContainer = document.getElementById('csv-import-progress');
        const progressFill = document.getElementById('csv-progress-fill');
        const progressText = document.getElementById('csv-progress-text');

        if (progressContainer) {
            progressContainer.style.display = 'block';
        }

        try {
            const csvText = await this.readFileAsText(file);
            
            // Update progress
            if (progressFill) progressFill.style.width = '30%';
            if (progressText) progressText.textContent = '30%';

            const importedVans = this.parseSwissVanCSV(csvText);
            
            // Update progress
            if (progressFill) progressFill.style.width = '70%';
            if (progressText) progressText.textContent = '70%';

            if (importedVans.length > 0 && window.adminDashboard?.vanManager) {
                importedVans.forEach(vanData => {
                    window.adminDashboard.vanManager.addVan(vanData);
                });
                
                // Refresh the vans grid
                window.adminDashboard.vanManager.renderVansGrid();
            }

            // Complete progress
            if (progressFill) progressFill.style.width = '100%';
            if (progressText) progressText.textContent = '100%';

            setTimeout(() => {
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
            }, 1500);

            if (window.adminDashboard?.uiManager) {
                window.adminDashboard.uiManager.showNotification(
                    `Successfully imported ${importedVans.length} vans from CSV!`, 
                    'success'
                );
            }

        } catch (error) {
            console.error('CSV import error:', error);
            
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }

            if (window.adminDashboard?.uiManager) {
                window.adminDashboard.uiManager.showNotification(
                    `CSV import failed: ${error.message}`, 
                    'error'
                );
            }
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    parseSwissVanCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        const vans = [];
        
        // Process each line (skip header if exists)
        for (let i = 1; i < lines.length; i++) {
            try {
                const fields = this.parseCSVLine(lines[i]);
                
                if (fields.length >= 10) {
                    const van = {
                        name: fields[1] || `Van ${i}`, // Assuming model name is in column B
                        type: this.mapVanType(fields[2]), // Map from category
                        location: this.extractLocationFromAddress(fields[3] || fields[4] || ''),
                        price: this.parseNumber(fields[5]) || 100, // Price column
                        capacity: this.parseNumber(fields[6]) || 4, // Capacity
                        features: this.parseFeatures(fields[7], fields[8], fields[9]),
                        description: `${fields[1] || 'Van'} - ${fields[2] || 'Category unknown'}`,
                        // Technical specifications
                        extLength: this.parseNumber(fields[10]),
                        extWidth: this.parseNumber(fields[11]),
                        extHeight: this.parseNumber(fields[12]),
                        intLength: this.parseNumber(fields[13]),
                        intWidth: this.parseNumber(fields[14]),
                        intHeight: this.parseNumber(fields[15]),
                        grossWeight: this.parseNumber(fields[16]),
                        emptyWeight: this.parseNumber(fields[17]),
                        payload: this.parseNumber(fields[18]),
                        engineType: fields[19] || '',
                        fuelCapacity: this.parseNumber(fields[20]),
                        consumption: this.parseNumber(fields[21])
                    };
                    
                    vans.push(van);
                }
            } catch (error) {
                console.warn(`Error parsing line ${i}:`, error);
                // Continue processing other lines
            }
        }
        
        return vans;
    }

    parseCSVLine(line) {
        const fields = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        fields.push(current.trim());
        return fields;
    }

    mapVanType(category) {
        if (!category) return 'standard';
        
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('compact') || categoryLower.includes('small')) {
            return 'compact';
        } else if (categoryLower.includes('luxury') || categoryLower.includes('premium')) {
            return 'luxury';
        } else {
            return 'standard';
        }
    }

    parseFeatures(feature1, feature2, feature3) {
        const features = [];
        if (feature1) features.push(feature1);
        if (feature2) features.push(feature2);
        if (feature3) features.push(feature3);
        
        // Add default features if none specified
        if (features.length === 0) {
            features.push('GPS', 'AC', 'Bluetooth');
        }
        
        return features;
    }

    parseNumber(value) {
        if (!value) return null;
        const parsed = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
        return isNaN(parsed) ? null : parsed;
    }

    extractLocationFromAddress(address) {
        if (!address) return 'Switzerland';
        
        // Try to extract city/location from address
        const parts = address.split(',').map(part => part.trim());
        return parts[parts.length - 2] || parts[0] || 'Switzerland';
    }

    downloadSampleCSV() {
        const sampleData = [
            ['ID', 'Model', 'Category', 'Address', 'Location', 'Price', 'Capacity', 'Feature1', 'Feature2', 'Feature3', 'ExtLength', 'ExtWidth', 'ExtHeight', 'IntLength', 'IntWidth', 'IntHeight', 'GrossWeight', 'EmptyWeight', 'Payload', 'Engine', 'FuelCapacity', 'Consumption'],
            ['1', 'Mercedes Sprinter', 'Standard', 'Zurich, Switzerland', 'Zurich', '120', '4', 'GPS', 'AC', 'Kitchen', '5.4', '2.0', '2.8', '3.1', '1.8', '1.9', '3500', '2800', '700', '2.3L Diesel', '70', '8.5'],
            ['2', 'VW Crafter', 'Compact', 'Geneva, Switzerland', 'Geneva', '80', '2', 'GPS', 'AC', 'Bluetooth', '5.0', '1.9', '2.5', '2.8', '1.7', '1.8', '3000', '2300', '700', '2.0L Diesel', '60', '7.8'],
            ['3', 'Iveco Daily', 'Luxury', 'Basel, Switzerland', 'Basel', '200', '6', 'GPS', 'AC', 'Kitchen', '6.0', '2.1', '3.0', '3.5', '1.9', '2.0', '4000', '3200', '800', '3.0L Diesel', '80', '9.2']
        ];

        const csvContent = sampleData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'sample-van-data.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (window.adminDashboard?.uiManager) {
            window.adminDashboard.uiManager.showNotification('Sample CSV downloaded!', 'success');
        }
    }
}
