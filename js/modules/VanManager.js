// VanManager.js - Handles van data, operations, and management
import { APIService } from '../services/APIService.js';

export class VanManager {
    constructor() {
        this.api = new APIService();
        this.vans = [];
        this.displayConfig = this.initializeDisplayConfiguration();
        this.isLoading = false;
        this.error = null;
    }

    async loadVans(filters = {}) {
        try {
            this.isLoading = true;
            this.error = null;
            const response = await this.api.getVans(filters);
            this.vans = response.data || [];
            return this.vans;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to load vans:', error);
            // Return empty array as fallback
            this.vans = [];
            return this.vans;
        } finally {
            this.isLoading = false;
        }
    }

    async refreshVans() {
        return await this.loadVans();
    }

    initializeDisplayConfiguration() {
        return {
            displayStyle: 'detailed',
            showPricing: true,
            showAvailability: true,
            showFeatures: true,
            technicalSpecs: {
                showExtLength: true,
                showExtHeight: true,
                showExtWidth: true,
                showIntLength: true,
                showIntHeight: true,
                showIntWidth: true,
                showGrossWeight: true,
                showEmptyWeight: true,
                showPayload: true,
                showEngineType: true,
                showFuelCapacity: true,
                showConsumption: true
            }
        };
    }

    getVanById(vanId) {
        return this.vans.find(van => van.id === vanId);
    }

    getAvailableVans() {
        return this.vans.filter(van => van.enabled && van.status === 'available');
    }

    getVansByType(type) {
        return this.vans.filter(van => van.type === type);
    }

    getVanStats() {
        const totalVans = this.vans.length;
        const availableVans = this.vans.filter(van => van.status === 'available').length;
        const rentedVans = this.vans.filter(van => van.status === 'rented').length;
        const maintenanceVans = this.vans.filter(van => van.status === 'maintenance').length;

        return {
            total: totalVans,
            available: availableVans,
            rented: rentedVans,
            maintenance: maintenanceVans
        };
    }

    toggleVanStatus(vanId) {
        const van = this.getVanById(vanId);
        if (van) {
            van.enabled = !van.enabled;
            van.status = van.enabled ? 'available' : 'maintenance';
            this.updateVanStatusOnWebsite(van);
            return true;
        }
        return false;
    }

    updateVanPricingProfile(vanId, profileId) {
        const van = this.getVanById(vanId);
        if (van) {
            van.pricingProfile = profileId;
            this.updateVanPricingOnWebsite(van);
            return true;
        }
        return false;
    }

    updateVanStatusOnWebsite(van) {
        console.log(`Updating van ${van.name} status on website:`, van.status);
        // Implementation would connect to website API
    }

    updateVanPricingOnWebsite(van) {
        console.log(`Updating van ${van.name} pricing on website:`, van.pricingProfile);
        // Implementation would connect to website API
    }

    async addVan(vanData) {
        try {
            this.isLoading = true;
            const response = await this.api.createVan(vanData);
            const newVan = response.data;
            this.vans.push(newVan);
            return newVan;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to add van:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async updateVan(vanId, updateData) {
        try {
            this.isLoading = true;
            const response = await this.api.updateVan(vanId, updateData);
            const updatedVan = response.data;
            
            // Update local cache
            const index = this.vans.findIndex(van => van.id === vanId);
            if (index !== -1) {
                this.vans[index] = updatedVan;
            }
            
            return updatedVan;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to update van:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async deleteVan(vanId) {
        try {
            this.isLoading = true;
            await this.api.deleteVan(vanId);
            
            // Remove from local cache
            const index = this.vans.findIndex(van => van.id === vanId);
            if (index !== -1) {
                const deletedVan = this.vans.splice(index, 1)[0];
                return deletedVan;
            }
            return null;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to delete van:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async updateVanStatus(vanId, status) {
        try {
            this.isLoading = true;
            const response = await this.api.updateVanStatus(vanId, status);
            const updatedVan = response.data;
            
            // Update local cache
            const index = this.vans.findIndex(van => van.id === vanId);
            if (index !== -1) {
                this.vans[index] = updatedVan;
            }
            
            return updatedVan;
        } catch (error) {
            this.error = error.message;
            console.error('Failed to update van status:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    generatePreviewVanCard(van) {
        const config = this.displayConfig;
        let cardHtml = `<div class="van-card ${van.type}">`;
        
        // Van image placeholder
        cardHtml += `
            <div class="van-image-container">
                <div class="van-image-placeholder" data-van-id="${van.id}" data-image-type="primary">
                    <i class="fas fa-image"></i>
                    <span>Click to add image</span>
                </div>
            </div>`;

        cardHtml += `<div class="van-details">`;
        cardHtml += `<h3>${van.name}</h3>`;
        
        if (config.displayStyle === 'detailed' || config.displayStyle === 'comprehensive') {
            // Technical specifications
            const extSpecs = [];
            if (config.technicalSpecs.showExtLength) extSpecs.push('Length: 5.4m');
            if (config.technicalSpecs.showExtHeight) extSpecs.push('Height: 2.8m');
            if (config.technicalSpecs.showExtWidth) extSpecs.push('Width: 2.0m');
            
            if (extSpecs.length > 0) {
                cardHtml += `<div class="van-tech-specs">`;
                cardHtml += `<h4>External Dimensions</h4>`;
                cardHtml += `<ul>${extSpecs.map(spec => `<li>${spec}</li>`).join('')}</ul>`;
                cardHtml += `</div>`;
            }

            const intSpecs = [];
            if (config.technicalSpecs.showIntLength) intSpecs.push('Int. Length: 3.1m');
            if (config.technicalSpecs.showIntHeight) intSpecs.push('Int. Height: 1.9m');
            if (config.technicalSpecs.showIntWidth) intSpecs.push('Int. Width: 1.8m');
            
            if (intSpecs.length > 0) {
                cardHtml += `<div class="van-tech-specs">`;
                cardHtml += `<h4>Internal Dimensions</h4>`;
                cardHtml += `<ul>${intSpecs.map(spec => `<li>${spec}</li>`).join('')}</ul>`;
                cardHtml += `</div>`;
            }

            const vehicleDetailSpecs = [];
            if (config.technicalSpecs.showGrossWeight) vehicleDetailSpecs.push('Gross Weight: 3500kg');
            if (config.technicalSpecs.showEmptyWeight) vehicleDetailSpecs.push('Empty Weight: 2800kg');
            if (config.technicalSpecs.showPayload) vehicleDetailSpecs.push('Payload: 700kg');
            if (config.technicalSpecs.showEngineType) vehicleDetailSpecs.push('Engine: 2.3L Diesel');
            if (config.technicalSpecs.showFuelCapacity) vehicleDetailSpecs.push('Fuel: 70L');
            if (config.technicalSpecs.showConsumption) vehicleDetailSpecs.push('Consumption: 8.5L/100km');
            
            if (vehicleDetailSpecs.length > 0) {
                cardHtml += `<div class="van-tech-specs">`;
                cardHtml += `<h4>Vehicle Details</h4>`;
                cardHtml += `<ul>${vehicleDetailSpecs.map(spec => `<li>${spec}</li>`).join('')}</ul>`;
                cardHtml += `</div>`;
            }
        }

        if (config.showFeatures && van.features) {
            cardHtml += `<div class="van-features">`;
            cardHtml += `<h4>Features</h4>`;
            cardHtml += `<ul>${van.features.map(feature => `<li>${feature}</li>`).join('')}</ul>`;
            cardHtml += `</div>`;
        }

        if (config.showPricing) {
            cardHtml += `<div class="van-pricing">$${van.price}/day</div>`;
        }

        cardHtml += `</div></div>`;
        return cardHtml;
    }

    updateDisplayConfig(field, value) {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            this.displayConfig[parent][child] = value;
        } else {
            this.displayConfig[field] = value;
        }
    }

    updateDisplayStyle(style) {
        this.displayConfig.displayStyle = style;
    }

    renderVansGrid() {
        const vansGrid = document.getElementById('vans-grid');
        if (!vansGrid) return;

        vansGrid.innerHTML = this.vans.map(van => `
            <div class="van-card ${van.status} ${!van.enabled ? 'disabled' : ''}">
                <div class="van-image-container">
                    <div class="van-image-placeholder" data-van-id="${van.id}" data-image-type="primary">
                        <i class="fas fa-image"></i>
                        <span>Click to add image</span>
                    </div>
                </div>
                <div class="van-header">
                    <h3>${van.name}</h3>
                    <span class="van-status ${van.status}">${van.status.charAt(0).toUpperCase() + van.status.slice(1)}</span>
                </div>
                <div class="van-details">
                    <p><strong>Type:</strong> ${van.type.charAt(0).toUpperCase() + van.type.slice(1)}</p>
                    <p><strong>Location:</strong> ${van.location}</p>
                    <p><strong>Capacity:</strong> ${van.capacity} people</p>
                    <p><strong>Price:</strong> $${van.price}/day</p>
                    <p><strong>Features:</strong> ${van.features.join(', ')}</p>
                </div>
                <div class="van-actions">
                    <button class="btn btn-small btn-primary" onclick="adminDashboard.vanManager.editVan(${van.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small ${van.enabled ? 'btn-secondary' : 'btn-success'}" 
                            onclick="adminDashboard.vanManager.toggleVanStatus(${van.id}); adminDashboard.vanManager.renderVansGrid();">
                        <i class="fas fa-power-off"></i> ${van.enabled ? 'Disable' : 'Enable'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    editVan(vanId) {
        const van = this.getVanById(vanId);
        if (van) {
            this.showEditVanModal(van);
        }
    }

    showEditVanModal(van) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Van - ${van.name}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form onsubmit="adminDashboard.vanManager.saveVanChanges(event, ${van.id})">
                        <div class="form-group">
                            <label>Van Name:</label>
                            <input type="text" id="edit-van-name" value="${van.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Type:</label>
                            <select id="edit-van-type">
                                <option value="compact" ${van.type === 'compact' ? 'selected' : ''}>Compact</option>
                                <option value="standard" ${van.type === 'standard' ? 'selected' : ''}>Standard</option>
                                <option value="luxury" ${van.type === 'luxury' ? 'selected' : ''}>Luxury</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Location:</label>
                            <input type="text" id="edit-van-location" value="${van.location}" required>
                        </div>
                        <div class="form-group">
                            <label>Capacity:</label>
                            <input type="number" id="edit-van-capacity" value="${van.capacity}" min="1" max="10" required>
                        </div>
                        <div class="form-group">
                            <label>Price per day:</label>
                            <input type="number" id="edit-van-price" value="${van.price}" min="0" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="edit-van-description" rows="3">${van.description || ''}</textarea>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    saveVanChanges(event, vanId) {
        event.preventDefault();
        const van = this.getVanById(vanId);
        if (van) {
            van.name = document.getElementById('edit-van-name').value;
            van.type = document.getElementById('edit-van-type').value;
            van.location = document.getElementById('edit-van-location').value;
            van.capacity = parseInt(document.getElementById('edit-van-capacity').value);
            van.price = parseFloat(document.getElementById('edit-van-price').value);
            van.description = document.getElementById('edit-van-description').value;
            
            this.renderVansGrid();
            event.target.closest('.modal').remove();
            
            // Show success notification
            if (window.adminDashboard && window.adminDashboard.uiManager) {
                window.adminDashboard.uiManager.showNotification('Van updated successfully!', 'success');
            }
        }
    }
}
