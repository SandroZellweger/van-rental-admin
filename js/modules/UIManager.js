// UIManager.js - Handles navigation, modals, notifications, and general UI
export class UIManager {
    constructor() {
        this.setupNavigation();
        this.setupEventListeners();
        this.setupModalListeners();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                
                // Remove active class from all nav items
                navLinks.forEach(item => {
                    item.parentElement.classList.remove('active');
                });
                
                // Add active class to clicked nav item
                link.parentElement.classList.add('active');
                
                // Hide all sections
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show target section
                const section = document.getElementById(targetSection);
                if (section) {
                    section.classList.add('active');
                    this.updatePageTitle(targetSection);
                }
            });
        });
    }

    updatePageTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            availability: 'Availability Calendar',
            bookings: 'Bookings Management',
            vans: 'Van Management',
            pricing: 'Pricing Management',
            media: 'Media Manager',
            settings: 'Settings'
        };
        
        const title = titles[section] || 'Admin Dashboard';
        document.title = `${title} - Van Rental Admin`;
        
        // Update breadcrumb if exists
        const breadcrumb = document.querySelector('.page-breadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = title;
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('active');
            });
        }

        // Global search functionality
        const globalSearch = document.getElementById('global-search');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.handleGlobalSearch(e.target.value);
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Date inputs
        const checkinInput = document.getElementById('checkin-date');
        const checkoutInput = document.getElementById('checkout-date');
        
        if (checkinInput) {
            checkinInput.addEventListener('change', () => {
                if (checkoutInput) {
                    checkoutInput.min = checkinInput.value;
                    if (checkoutInput.value < checkinInput.value) {
                        checkoutInput.value = checkinInput.value;
                    }
                }
            });
        }

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + specific keys for navigation
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.navigateToSection('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        this.navigateToSection('availability');
                        break;
                    case '3':
                        e.preventDefault();
                        this.navigateToSection('bookings');
                        break;
                    case '4':
                        e.preventDefault();
                        this.navigateToSection('vans');
                        break;
                    case '5':
                        e.preventDefault();
                        this.navigateToSection('pricing');
                        break;
                    case '6':
                        e.preventDefault();
                        this.navigateToSection('media');
                        break;
                    case '/':
                        e.preventDefault();
                        const searchInput = document.getElementById('global-search');
                        if (searchInput) searchInput.focus();
                        break;
                }
            }

            // Escape key to close modals
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.remove();
                }
            }
        });
    }

    navigateToSection(sectionId) {
        const navLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (navLink) {
            navLink.click();
        }
    }

    handleGlobalSearch(searchTerm) {
        if (searchTerm.length < 2) return;

        const results = [];
        
        // Search through bookings
        if (window.adminDashboard?.bookingManager) {
            const bookingResults = window.adminDashboard.bookingManager.searchBookings(searchTerm);
            results.push(...bookingResults.map(booking => ({
                type: 'booking',
                title: `Booking ${booking.id}`,
                subtitle: `${booking.customerName} - ${booking.vanName}`,
                data: booking
            })));
        }

        // Search through vans
        if (window.adminDashboard?.vanManager) {
            const vanResults = window.adminDashboard.vanManager.vans.filter(van =>
                van.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                van.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                van.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
            results.push(...vanResults.map(van => ({
                type: 'van',
                title: van.name,
                subtitle: `${van.type} - ${van.location}`,
                data: van
            })));
        }

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        let resultsContainer = document.getElementById('search-results');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'search-results';
            resultsContainer.className = 'search-results-dropdown';
            
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                searchInput.parentNode.appendChild(resultsContainer);
            }
        }

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        } else {
            resultsContainer.innerHTML = results.map(result => `
                <div class="search-result-item" onclick="adminDashboard.uiManager.selectSearchResult('${result.type}', ${JSON.stringify(result.data).replace(/"/g, '&quot;')})">
                    <div class="result-icon">
                        <i class="fas fa-${result.type === 'booking' ? 'calendar-check' : 'van-shuttle'}"></i>
                    </div>
                    <div class="result-content">
                        <div class="result-title">${result.title}</div>
                        <div class="result-subtitle">${result.subtitle}</div>
                    </div>
                </div>
            `).join('');
        }

        resultsContainer.style.display = 'block';

        // Hide results when clicking outside
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#global-search') && !e.target.closest('#search-results')) {
                    resultsContainer.style.display = 'none';
                }
            }, { once: true });
        }, 100);
    }

    selectSearchResult(type, data) {
        // Hide search results
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }

        // Navigate to appropriate section and show details
        if (type === 'booking') {
            this.navigateToSection('bookings');
            setTimeout(() => {
                if (window.adminDashboard?.bookingManager) {
                    window.adminDashboard.bookingManager.viewBooking(data.id);
                }
            }, 100);
        } else if (type === 'van') {
            this.navigateToSection('vans');
            setTimeout(() => {
                if (window.adminDashboard?.vanManager) {
                    window.adminDashboard.vanManager.editVan(data.id);
                }
            }, 100);
        }
    }

    setupModalListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.remove();
            }
        });

        // Close modal with close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close') || e.target.closest('.close')) {
                const modal = e.target.closest('.modal');
                if (modal) modal.remove();
            }
        });
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to notification container or create one
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto-remove after specified duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);

        // Add show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    showConfirmDialog(message, onConfirm, onCancel = null) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content small">
                <div class="modal-header">
                    <h2>Confirmation</h2>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove(); ${onCancel ? 'onCancel()' : ''}">
                        Cancel
                    </button>
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove(); onConfirm()">
                        Confirm
                    </button>
                </div>
            </div>
        `;
        
        // Store callbacks on the modal element
        modal.onConfirm = onConfirm;
        if (onCancel) modal.onCancel = onCancel;
        
        document.body.appendChild(modal);
        return modal;
    }

    showLoadingSpinner(message = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-overlay">
                <div class="spinner-content">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(spinner);
        return spinner;
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('admin-theme', newTheme);
        
        // Update theme toggle button icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        this.showNotification(`Switched to ${newTheme} theme`, 'info', 2000);
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('admin-theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    setupResponsiveLayout() {
        const handleResize = () => {
            const sidebar = document.querySelector('.sidebar');
            const content = document.querySelector('.main-content');
            
            if (window.innerWidth <= 768) {
                sidebar?.classList.add('mobile');
                content?.classList.add('mobile');
            } else {
                sidebar?.classList.remove('mobile');
                content?.classList.remove('mobile');
                sidebar?.classList.remove('active'); // Close mobile menu on desktop
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
    }

    formatDateTime(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility method for creating reusable modal templates
    createModal(title, content, actions = [], size = 'medium') {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        
        const actionsHTML = actions.map(action => 
            `<button class="btn ${action.class || 'btn-secondary'}" onclick="${action.onclick || 'this.closest(\'.modal\').remove()'}">${action.text}</button>`
        ).join('');

        modal.innerHTML = `
            <div class="modal-content ${size}">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${actions.length > 0 ? `
                    <div class="modal-actions">
                        ${actionsHTML}
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    // Initialize UI manager
    init() {
        this.initializeTheme();
        this.setupResponsiveLayout();
        
        // Setup tooltips
        this.setupTooltips();
        
        // Setup keyboard help
        this.setupKeyboardHelp();
    }

    setupTooltips() {
        // Simple tooltip implementation
        document.addEventListener('mouseover', (e) => {
            if (e.target.hasAttribute('data-tooltip')) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.getAttribute('data-tooltip');
                
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                
                e.target.addEventListener('mouseleave', () => {
                    tooltip.remove();
                }, { once: true });
            }
        });
    }

    setupKeyboardHelp() {
        // Show keyboard shortcuts help
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.showKeyboardHelp();
            }
        });
    }

    showKeyboardHelp() {
        const shortcuts = [
            { key: 'Ctrl/Cmd + 1', description: 'Go to Dashboard' },
            { key: 'Ctrl/Cmd + 2', description: 'Go to Availability' },
            { key: 'Ctrl/Cmd + 3', description: 'Go to Bookings' },
            { key: 'Ctrl/Cmd + 4', description: 'Go to Vans' },
            { key: 'Ctrl/Cmd + 5', description: 'Go to Pricing' },
            { key: 'Ctrl/Cmd + 6', description: 'Go to Media' },
            { key: 'Ctrl/Cmd + /', description: 'Focus search' },
            { key: 'Escape', description: 'Close modal' },
            { key: 'Ctrl/Cmd + ?', description: 'Show this help' }
        ];

        const content = `
            <div class="keyboard-help">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcuts-list">
                    ${shortcuts.map(shortcut => `
                        <div class="shortcut-item">
                            <span class="shortcut-key">${shortcut.key}</span>
                            <span class="shortcut-description">${shortcut.description}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.createModal('Keyboard Shortcuts', content, [
            { text: 'Close', class: 'btn-secondary' }
        ]);
    }
}
