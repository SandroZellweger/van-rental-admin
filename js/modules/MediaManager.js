// MediaManager.js - Handles image upload, compression, and gallery management
export class MediaManager {
    constructor() {
        this.mediaItems = this.initializeMediaData();
        this.compressionSettings = { quality: 0.7, maxWidth: 1200, enabled: true };
    }

    initializeMediaData() {
        try {
            const saved = localStorage.getItem('adminDashboard_mediaItems');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Error loading media data:', error);
            return [];
        }
    }

    saveMediaData() {
        try {
            localStorage.setItem('adminDashboard_mediaItems', JSON.stringify(this.mediaItems));
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                this.handleStorageQuotaExceeded();
                return false;
            }
            console.error('Error saving media data:', error);
            return false;
        }
    }

    handleStorageQuotaExceeded() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-exclamation-triangle text-warning"></i> Storage Full</h2>
                </div>
                <div class="modal-body">
                    <p>Your browser's storage is full. To continue uploading images, you can:</p>
                    <div class="storage-options">
                        <button class="btn btn-primary" onclick="adminDashboard.mediaManager.cleanupUnassignedImages(); this.closest('.modal').remove();">
                            <i class="fas fa-broom"></i> Clean Up Unassigned Images
                        </button>
                        <button class="btn btn-secondary" onclick="adminDashboard.mediaManager.clearAllMedia(); this.closest('.modal').remove();">
                            <i class="fas fa-trash"></i> Clear All Media
                        </button>
                        <button class="btn btn-outline" onclick="this.closest('.modal').remove();">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                    <div class="storage-info">
                        <p><strong>Storage Usage:</strong> ${this.getStorageUsage()}</p>
                        <p><strong>Total Images:</strong> ${this.mediaItems.length}</p>
                        <p><strong>Unassigned Images:</strong> ${this.getUnassignedImages().length}</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    cleanupUnassignedImages() {
        const unassigned = this.getUnassignedImages();
        const cleanedCount = unassigned.length;
        
        this.mediaItems = this.mediaItems.filter(item => item.assignedVan !== null);
        this.saveMediaData();
        this.renderMediaGallery();
        
        if (window.adminDashboard && window.adminDashboard.uiManager) {
            window.adminDashboard.uiManager.showNotification(
                `Cleaned up ${cleanedCount} unassigned images`, 
                'success'
            );
        }
    }

    clearAllMedia() {
        this.mediaItems = [];
        this.saveMediaData();
        this.renderMediaGallery();
        
        if (window.adminDashboard && window.adminDashboard.uiManager) {
            window.adminDashboard.uiManager.showNotification('All media cleared', 'success');
        }
    }

    getUnassignedImages() {
        return this.mediaItems.filter(item => item.assignedVan === null);
    }

    getStorageUsage() {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
            }
        }
        return this.formatBytes(totalSize);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setupMediaManager() {
        const uploadDropzone = document.getElementById('upload-dropzone');
        const fileInput = document.getElementById('file-input');
        const uploadButton = document.getElementById('upload-media-btn');

        if (uploadDropzone && fileInput) {
            // Drag and drop handlers
            uploadDropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadDropzone.classList.add('dragover');
            });

            uploadDropzone.addEventListener('dragleave', () => {
                uploadDropzone.classList.remove('dragover');
            });

            uploadDropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadDropzone.classList.remove('dragover');
                this.handleFileUpload(e.dataTransfer.files);
            });

            uploadDropzone.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        this.setupMediaFilters();
        this.renderMediaGallery();
    }

    setupMediaFilters() {
        const vanFilter = document.getElementById('van-filter');
        const categoryFilter = document.getElementById('category-filter');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');

        // Populate van filter options
        this.populateVanFilterOptions();

        // Add filter event listeners
        if (vanFilter) {
            vanFilter.addEventListener('change', () => this.renderMediaGallery());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.renderMediaGallery());
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                if (vanFilter) vanFilter.value = '';
                if (categoryFilter) categoryFilter.value = '';
                this.renderMediaGallery();
            });
        }
    }

    populateVanFilterOptions() {
        const vanFilter = document.getElementById('van-filter');
        if (!vanFilter || !window.adminDashboard?.vanManager) return;

        const vans = window.adminDashboard.vanManager.vans;
        const options = ['<option value="">All Vans</option>'];
        
        vans.forEach(van => {
            options.push(`<option value="${van.id}">${van.name}</option>`);
        });
        
        vanFilter.innerHTML = options.join('');
    }

    async handleFileUpload(files) {
        const progressContainer = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressContainer) {
            progressContainer.style.display = 'block';
        }

        const fileArray = Array.from(files);
        let uploadedCount = 0;

        for (const file of fileArray) {
            if (file.type.startsWith('image/')) {
                await this.processFile(file);
                uploadedCount++;
                
                const progress = (uploadedCount / fileArray.length) * 100;
                if (progressFill) progressFill.style.width = `${progress}%`;
                if (progressText) progressText.textContent = `${Math.round(progress)}%`;
            }
        }

        if (progressContainer) {
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 1000);
        }

        this.renderMediaGallery();
        
        if (window.adminDashboard && window.adminDashboard.uiManager) {
            window.adminDashboard.uiManager.showNotification(
                `Successfully uploaded ${uploadedCount} images`, 
                'success'
            );
        }
    }

    async processFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                // Compress the image to prevent localStorage quota errors
                let dataUrl = e.target.result;
                if (file.type.startsWith('image/')) {
                    dataUrl = await this.compressImage(e.target.result);
                }
                
                const mediaItem = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    dataUrl: dataUrl,
                    uploadDate: new Date().toISOString(),
                    assignedVan: null,
                    category: null,
                    description: '',
                    isPrimary: false
                };
                
                this.mediaItems.push(mediaItem);
                this.saveMediaData();
                resolve();
            };
            reader.readAsDataURL(file);
        });
    }

    async compressImage(dataUrl, quality = null, maxWidth = null) {
        return new Promise((resolve) => {
            const settings = this.compressionSettings;
            const targetQuality = quality !== null ? quality : settings.quality;
            const targetMaxWidth = maxWidth !== null ? maxWidth : settings.maxWidth;

            if (!settings.enabled) {
                resolve(dataUrl);
                return;
            }

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;
                if (width > targetMaxWidth) {
                    height = (height * targetMaxWidth) / width;
                    width = targetMaxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', targetQuality);
                
                resolve(compressedDataUrl);
            };
            img.src = dataUrl;
        });
    }

    renderMediaGallery() {
        const mediaGallery = document.getElementById('media-gallery');
        if (!mediaGallery) return;

        const filteredItems = this.getFilteredMediaItems();

        if (filteredItems.length === 0) {
            mediaGallery.innerHTML = '<div class="no-media-message">No images found. Upload some images to get started.</div>';
            return;
        }

        const galleryHTML = filteredItems.map(item => `
            <div class="media-item" data-media-id="${item.id}">
                <div class="media-thumbnail">
                    <img src="${item.dataUrl}" alt="${item.name}" onclick="adminDashboard.mediaManager.openMediaModal('${item.id}')">
                    ${item.isPrimary ? '<div class="primary-badge"><i class="fas fa-star"></i></div>' : ''}
                </div>
                <div class="media-info">
                    <div class="media-name" title="${item.name}">${item.name}</div>
                    <div class="media-meta">
                        <span class="media-date">${new Date(item.uploadDate).toLocaleDateString()}</span>
                        ${item.assignedVan ? `<span class="assigned-van">Van #${item.assignedVan}</span>` : '<span class="unassigned">Unassigned</span>'}
                    </div>
                </div>
                <div class="media-actions">
                    <button class="btn btn-small btn-primary" onclick="adminDashboard.mediaManager.assignToVan('${item.id}')" title="Assign to Van">
                        <i class="fas fa-link"></i>
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="adminDashboard.mediaManager.editMediaItem('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="adminDashboard.mediaManager.deleteMediaItem('${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        mediaGallery.innerHTML = galleryHTML;
    }

    getFilteredMediaItems() {
        const vanFilter = document.getElementById('van-filter')?.value;
        const categoryFilter = document.getElementById('category-filter')?.value;

        return this.mediaItems.filter(item => {
            const vanMatch = !vanFilter || item.assignedVan === parseInt(vanFilter);
            const categoryMatch = !categoryFilter || item.category === categoryFilter;
            return vanMatch && categoryMatch;
        });
    }

    openMediaModal(mediaId) {
        const mediaItem = this.mediaItems.find(item => item.id === parseFloat(mediaId));
        if (!mediaItem) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>${mediaItem.name}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="media-modal-content">
                        <div class="media-preview">
                            <img src="${mediaItem.dataUrl}" alt="${mediaItem.name}">
                        </div>
                        <div class="media-details">
                            <div class="detail-group">
                                <label>File Name:</label>
                                <span>${mediaItem.name}</span>
                            </div>
                            <div class="detail-group">
                                <label>Upload Date:</label>
                                <span>${new Date(mediaItem.uploadDate).toLocaleString()}</span>
                            </div>
                            <div class="detail-group">
                                <label>Original Size:</label>
                                <span>${this.formatBytes(mediaItem.size)}</span>
                            </div>
                            <div class="detail-group">
                                <label>Assigned Van:</label>
                                <span>${mediaItem.assignedVan ? `Van #${mediaItem.assignedVan}` : 'Unassigned'}</span>
                            </div>
                            <div class="detail-group">
                                <label>Primary Image:</label>
                                <span>${mediaItem.isPrimary ? 'Yes' : 'No'}</span>
                            </div>
                            ${mediaItem.description ? `
                                <div class="detail-group">
                                    <label>Description:</label>
                                    <span>${mediaItem.description}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <button class="btn btn-primary" onclick="adminDashboard.mediaManager.editMediaItem('${mediaItem.id}'); this.closest('.modal').remove();">Edit</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    assignToVan(mediaId) {
        const mediaItem = this.mediaItems.find(item => item.id === parseFloat(mediaId));
        if (!mediaItem || !window.adminDashboard?.vanManager) return;

        const vans = window.adminDashboard.vanManager.vans;
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Assign Image to Van</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Select Van:</label>
                        <select id="assign-van-select">
                            <option value="">Unassigned</option>
                            ${vans.map(van => `
                                <option value="${van.id}" ${mediaItem.assignedVan === van.id ? 'selected' : ''}>
                                    ${van.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="set-as-primary" ${mediaItem.isPrimary ? 'checked' : ''}>
                            Set as primary image for this van
                        </label>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="adminDashboard.mediaManager.saveVanAssignment('${mediaId}'); this.closest('.modal').remove();">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    saveVanAssignment(mediaId) {
        const mediaItem = this.mediaItems.find(item => item.id === parseFloat(mediaId));
        const vanSelect = document.getElementById('assign-van-select');
        const primaryCheckbox = document.getElementById('set-as-primary');
        
        if (!mediaItem || !vanSelect) return;

        const selectedVanId = vanSelect.value ? parseInt(vanSelect.value) : null;
        const isPrimary = primaryCheckbox?.checked || false;

        // If setting as primary, remove primary status from other images of the same van
        if (isPrimary && selectedVanId) {
            this.mediaItems.forEach(item => {
                if (item.assignedVan === selectedVanId && item.id !== mediaItem.id) {
                    item.isPrimary = false;
                }
            });
        }

        mediaItem.assignedVan = selectedVanId;
        mediaItem.isPrimary = isPrimary;

        this.saveMediaData();
        this.renderMediaGallery();

        if (window.adminDashboard && window.adminDashboard.uiManager) {
            window.adminDashboard.uiManager.showNotification('Image assignment saved!', 'success');
        }
    }

    editMediaItem(mediaId) {
        const mediaItem = this.mediaItems.find(item => item.id === parseFloat(mediaId));
        if (!mediaItem) return;

        // Implementation for editing media item
        console.log('Edit media item:', mediaItem);
    }

    deleteMediaItem(mediaId) {
        if (confirm('Are you sure you want to delete this image?')) {
            const index = this.mediaItems.findIndex(item => item.id === parseFloat(mediaId));
            if (index !== -1) {
                this.mediaItems.splice(index, 1);
                this.saveMediaData();
                this.renderMediaGallery();

                if (window.adminDashboard && window.adminDashboard.uiManager) {
                    window.adminDashboard.uiManager.showNotification('Image deleted successfully!', 'success');
                }
            }
        }
    }

    openImageSelector(vanId, imageType) {
        const vanImages = this.mediaItems.filter(item => item.assignedVan === vanId);
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Select Image for Van #${vanId}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="image-selector-grid">
                        ${vanImages.length === 0 ? 
                            '<p class="no-images">No images assigned to this van. Please upload and assign images first.</p>' :
                            vanImages.map(item => `
                                <div class="selectable-image" onclick="adminDashboard.mediaManager.selectImageForVan(${vanId}, '${item.id}', '${imageType}')">
                                    <img src="${item.dataUrl}" alt="${item.name}">
                                    <div class="image-overlay">
                                        <span class="image-name">${item.name}</span>
                                        ${item.isPrimary ? '<span class="primary-badge"><i class="fas fa-star"></i> Primary</span>' : ''}
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="adminDashboard.mediaManager.assignToVan(null); this.closest('.modal').remove();">Upload New Image</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    selectImageForVan(vanId, imageId, imageType) {
        const mediaItem = this.mediaItems.find(item => item.id === parseFloat(imageId));
        if (!mediaItem) return;

        // Find the van image placeholder and update it
        const placeholder = document.querySelector(`[data-van-id="${vanId}"][data-image-type="${imageType}"]`);
        if (placeholder) {
            placeholder.innerHTML = `<img src="${mediaItem.dataUrl}" alt="${mediaItem.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
            placeholder.style.backgroundImage = `url(${mediaItem.dataUrl})`;
            placeholder.style.backgroundSize = 'cover';
            placeholder.style.backgroundPosition = 'center';
        }

        // Close the modal
        const modal = document.querySelector('.modal.active');
        if (modal) modal.remove();

        if (window.adminDashboard && window.adminDashboard.uiManager) {
            window.adminDashboard.uiManager.showNotification('Image selected successfully!', 'success');
        }
    }

    getImagesForVan(vanId) {
        return this.mediaItems.filter(item => item.assignedVan === vanId);
    }

    getPrimaryImageForVan(vanId) {
        return this.mediaItems.find(item => item.assignedVan === vanId && item.isPrimary);
    }
}
