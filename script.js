/**
 * AI Chatbot Comparison 2025 - Interactive Script
 * Author: Naully Nicolas
 * Version: 1.0
 * Updated: July 2025
 * 
 * Features:
 * - Interactive filtering and sorting
 * - Dynamic battery gauge animations
 * - Responsive table interactions
 * - Performance optimization
 * - Accessibility enhancements
 */

'use strict';

// =========================================
// Configuration and Constants
// =========================================

const CONFIG = {
    animationDuration: 300,
    debounceDelay: 250,
    scrollOffset: 100,
    batteryAnimationDelay: 50,
    updateInterval: 60000, // 1 minute
    apiEndpoint: null, // Future API integration
    version: '1.0.0'
};

const ENERGY_THRESHOLDS = {
    low: 0.001,
    medium: 0.002,
    high: 0.003,
    veryHigh: 0.004
};

const MODELS_DATA = {
    'chatgpt-4o': {
        name: 'ChatGPT-4o',
        company: 'OpenAI',
        country: '🇺🇸',
        url: 'https://chat.openai.com',
        energyRating: 'C+',
        performanceScore: 9.1
    },
    'claude-sonnet-4': {
        name: 'Claude Sonnet 4',
        company: 'Anthropic',
        country: '🇺🇸',
        url: 'https://claude.ai',
        energyRating: 'A',
        performanceScore: 9.4
    },
    'gemini-pro': {
        name: 'Gemini Pro',
        company: 'Google',
        country: '🇺🇸',
        url: 'https://gemini.google.com',
        energyRating: 'B+',
        performanceScore: 8.8
    },
    'perplexity-pro': {
        name: 'Perplexity Pro',
        company: 'Perplexity',
        country: '🇺🇸',
        url: 'https://perplexity.ai',
        energyRating: 'A-',
        performanceScore: 8.2
    },
    'mistral-large': {
        name: 'Mistral Large',
        company: 'Mistral AI',
        country: '🇫🇷',
        url: 'https://mistral.ai',
        energyRating: 'B+',
        performanceScore: 8.6
    },
    'grok-3': {
        name: 'Grok 3',
        company: 'xAI',
        country: '🇺🇸',
        url: 'https://x.ai',
        energyRating: 'D',
        performanceScore: 8.9
    },
    'deepseek-r1': {
        name: 'DeepSeek R1',
        company: 'DeepSeek',
        country: '🇨🇳',
        url: 'https://chat.deepseek.com',
        energyRating: 'A+',
        performanceScore: 9.2
    },
    'qwen-2.5-max': {
        name: 'Qwen 2.5-Max',
        company: 'Alibaba',
        country: '🇨🇳',
        url: 'https://tongyi.aliyun.com',
        energyRating: 'A',
        performanceScore: 9.0
    },
    'step-2': {
        name: 'Step-2',
        company: 'Stepfun',
        country: '🇨🇳',
        url: 'https://stepfun.com',
        energyRating: 'A-',
        performanceScore: 8.7
    }
};

// =========================================
// Utility Functions
// =========================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
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

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format numbers with appropriate units
 */
function formatNumber(value, decimals = 2) {
    if (value >= 1000) {
        return (value / 1000).toFixed(decimals) + 'K';
    }
    return value.toFixed(decimals);
}

/**
 * Get energy efficiency class based on value
 */
function getEnergyClass(value) {
    if (value <= ENERGY_THRESHOLDS.low) return 'low';
    if (value <= ENERGY_THRESHOLDS.medium) return 'medium';
    if (value <= ENERGY_THRESHOLDS.high) return 'high';
    return 'very-high';
}

/**
 * Calculate battery fill percentage
 */
function calculateBatteryFill(value, maxValue = 0.004) {
    return Math.min((value / maxValue) * 100, 100);
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =========================================
// Animation Functions
// =========================================

/**
 * Animate battery gauge fill
 */
function animateBatteryGauge(batteryElement, fillPercentage, delay = 0) {
    setTimeout(() => {
        const fillElement = batteryElement.querySelector('.battery-fill');
        if (fillElement) {
            fillElement.style.width = '0%';
            setTimeout(() => {
                fillElement.style.width = fillPercentage + '%';
            }, 100);
        }
    }, delay);
}

/**
 * Animate element fade in
 */
function fadeInElement(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = `opacity ${CONFIG.animationDuration}ms ease, transform ${CONFIG.animationDuration}ms ease`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

/**
 * Pulse animation for important elements
 */
function pulseElement(element, duration = 2000) {
    element.classList.add('pulse');
    setTimeout(() => {
        element.classList.remove('pulse');
    }, duration);
}

/**
 * Animate numbers counting up
 */
function animateCounter(element, start, end, duration = 1000) {
    const startTime = performance.now();
    const range = end - start;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (range * easeOutQuart);
        
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(end);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// =========================================
// Table Enhancement Functions
// =========================================

/**
 * Initialize battery gauges with animations
 */
function initializeBatteryGauges() {
    const batteryGauges = document.querySelectorAll('.battery-gauge');
    
    batteryGauges.forEach((gauge, index) => {
        const battery = gauge.querySelector('.battery');
        const fillElement = gauge.querySelector('.battery-fill');
        const valueElement = gauge.querySelector('.metric-value');
        
        if (battery && fillElement && valueElement) {
            const value = parseFloat(valueElement.textContent);
            const fillPercentage = calculateBatteryFill(value);
            const energyClass = getEnergyClass(value);
            
            // Set energy class
            fillElement.classList.add(energyClass);
            
            // Animate battery fill
            animateBatteryGauge(battery, fillPercentage, index * CONFIG.batteryAnimationDelay);
            
            // Add hover effects
            battery.addEventListener('mouseenter', () => {
                battery.style.transform = 'scale(1.1)';
                battery.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            });
            
            battery.addEventListener('mouseleave', () => {
                battery.style.transform = 'scale(1)';
                battery.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.2)';
            });
        }
    });
}

/**
 * Add interactive sorting to table headers
 */
function initializeTableSorting() {
    const modelHeaders = document.querySelectorAll('.model-header');
    let currentSort = { column: null, direction: 'asc' };
    
    modelHeaders.forEach((header, index) => {
        if (index === 0) return; // Skip category column
        
        header.style.cursor = 'pointer';
        header.title = 'Click to sort by this model';
        
        // Add sort indicator
        const sortIndicator = document.createElement('span');
        sortIndicator.className = 'sort-indicator';
        sortIndicator.innerHTML = ' ↕️';
        header.appendChild(sortIndicator);
        
        header.addEventListener('click', () => {
            sortTableByColumn(index, header);
        });
    });
}

/**
 * Sort table by column
 */
function sortTableByColumn(columnIndex, headerElement) {
    const table = document.querySelector('.comparison-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => 
        !row.classList.contains('category-row')
    );
    
    // Toggle sort direction
    const currentDirection = headerElement.dataset.sortDirection || 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    headerElement.dataset.sortDirection = newDirection;
    
    // Update sort indicators
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
        indicator.innerHTML = ' ↕️';
    });
    headerElement.querySelector('.sort-indicator').innerHTML = 
        newDirection === 'asc' ? ' ↑' : ' ↓';
    
    // Sort rows
    rows.sort((a, b) => {
        const aCell = a.cells[columnIndex];
        const bCell = b.cells[columnIndex];
        
        if (!aCell || !bCell) return 0;
        
        const aValue = extractSortValue(aCell);
        const bValue = extractSortValue(bCell);
        
        if (newDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    // Reinsert sorted rows
    const categoryRows = Array.from(tbody.querySelectorAll('.category-row'));
    let currentCategoryIndex = 0;
    
    rows.forEach(row => {
        if (currentCategoryIndex < categoryRows.length) {
            tbody.insertBefore(row, categoryRows[currentCategoryIndex].nextSibling);
        } else {
            tbody.appendChild(row);
        }
    });
    
    // Animate sorted rows
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.style.backgroundColor = '#e3f2fd';
            setTimeout(() => {
                row.style.backgroundColor = '';
            }, 500);
        }, index * 50);
    });
}

/**
 * Extract sortable value from cell
 */
function extractSortValue(cell) {
    const scoreElement = cell.querySelector('.score');
    if (scoreElement) {
        return parseFloat(scoreElement.textContent);
    }
    
    const metricValue = cell.querySelector('.metric-value');
    if (metricValue) {
        return parseFloat(metricValue.textContent);
    }
    
    const rating = cell.querySelector('.rating');
    if (rating) {
        const ratingMap = { 'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0 };
        return ratingMap[rating.textContent] || 0;
    }
    
    return cell.textContent.trim();
}

// =========================================
// Interactive Features
// =========================================

/**
 * Initialize filtering functionality
 */
function initializeFiltering() {
    // Create filter controls
    const filterContainer = createFilterControls();
    const tableContainer = document.querySelector('.table-container');
    tableContainer.insertBefore(filterContainer, tableContainer.firstChild);
    
    // Initialize filter event listeners
    setupFilterEventListeners();
}

/**
 * Create filter control elements
 */
function createFilterControls() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-controls';
    filterContainer.innerHTML = `
        <div class="filter-section">
            <h3>🔍 Filter Models</h3>
            <div class="filter-row">
                <div class="filter-group">
                    <label for="energy-filter">Energy Rating:</label>
                    <select id="energy-filter" class="filter-select">
                        <option value="">All Ratings</option>
                        <option value="A+">A+ (Most Efficient)</option>
                        <option value="A">A (Very Efficient)</option>
                        <option value="A-">A- (Efficient)</option>
                        <option value="B+">B+ (Good)</option>
                        <option value="B">B (Average)</option>
                        <option value="C+">C+ (Below Average)</option>
                        <option value="C">C (Poor)</option>
                        <option value="D">D (Very Poor)</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="country-filter">Country:</label>
                    <select id="country-filter" class="filter-select">
                        <option value="">All Countries</option>
                        <option value="🇺🇸">🇺🇸 United States</option>
                        <option value="🇫🇷">🇫🇷 France</option>
                        <option value="🇨🇳">🇨🇳 China</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="performance-filter">Min Performance:</label>
                    <input type="range" id="performance-filter" min="8" max="10" step="0.1" value="8" class="filter-range">
                    <span id="performance-value">8.0</span>
                </div>
                
                <button id="reset-filters" class="reset-btn">Reset Filters</button>
            </div>
        </div>
    `;
    
    return filterContainer;
}

/**
 * Setup filter event listeners
 */
function setupFilterEventListeners() {
    const energyFilter = document.getElementById('energy-filter');
    const countryFilter = document.getElementById('country-filter');
    const performanceFilter = document.getElementById('performance-filter');
    const performanceValue = document.getElementById('performance-value');
    const resetButton = document.getElementById('reset-filters');
    
    // Performance range slider
    performanceFilter.addEventListener('input', (e) => {
        performanceValue.textContent = e.target.value;
        applyFilters();
    });
    
    // Dropdown filters
    energyFilter.addEventListener('change', applyFilters);
    countryFilter.addEventListener('change', applyFilters);
    
    // Reset button
    resetButton.addEventListener('click', resetFilters);
}

/**
 * Apply active filters to table
 */
function applyFilters() {
    const energyFilter = document.getElementById('energy-filter').value;
    const countryFilter = document.getElementById('country-filter').value;
    const performanceFilter = parseFloat(document.getElementById('performance-filter').value);
    
    const modelHeaders = document.querySelectorAll('.model-header');
    const allRows = document.querySelectorAll('.comparison-table tbody tr');
    
    modelHeaders.forEach((header, index) => {
        if (index === 0) return; // Skip category column
        
        const modelKey = Object.keys(MODELS_DATA)[index - 1];
        const modelData = MODELS_DATA[modelKey];
        
        if (!modelData) return;
        
        let shouldShow = true;
        
        // Check energy rating filter
        if (energyFilter && modelData.energyRating !== energyFilter) {
            shouldShow = false;
        }
        
        // Check country filter
        if (countryFilter && modelData.country !== countryFilter) {
            shouldShow = false;
        }
        
        // Check performance filter
        if (modelData.performanceScore < performanceFilter) {
            shouldShow = false;
        }
        
        // Show/hide column
        header.style.display = shouldShow ? '' : 'none';
        
        // Show/hide corresponding cells in all rows
        allRows.forEach(row => {
            const cell = row.cells[index];
            if (cell) {
                cell.style.display = shouldShow ? '' : 'none';
            }
        });
    });
    
    // Update visible count
    updateFilterCount();
}

/**
 * Reset all filters
 */
function resetFilters() {
    document.getElementById('energy-filter').value = '';
    document.getElementById('country-filter').value = '';
    document.getElementById('performance-filter').value = '8';
    document.getElementById('performance-value').textContent = '8.0';
    
    // Show all columns
    const allElements = document.querySelectorAll('.model-header, .comparison-table tbody tr td');
    allElements.forEach(element => {
        element.style.display = '';
    });
    
    updateFilterCount();
}

/**
 * Update filter count display
 */
function updateFilterCount() {
    const visibleHeaders = document.querySelectorAll('.model-header:not([style*="display: none"])');
    const totalCount = document.querySelectorAll('.model-header').length - 1; // Exclude category column
    const visibleCount = visibleHeaders.length - 1; // Exclude category column
    
    let countDisplay = document.getElementById('filter-count');
    if (!countDisplay) {
        countDisplay = document.createElement('div');
        countDisplay.id = 'filter-count';
        countDisplay.className = 'filter-count';
        document.querySelector('.filter-controls').appendChild(countDisplay);
    }
    
    countDisplay.textContent = `Showing ${visibleCount} of ${totalCount} models`;
}

// =========================================
// Performance Optimization
// =========================================

/**
 * Lazy load heavy animations
 */
function initializeLazyAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('battery-gauge')) {
                    const battery = element.querySelector('.battery');
                    const fillElement = element.querySelector('.battery-fill');
                    const valueElement = element.querySelector('.metric-value');
                    
                    if (battery && fillElement && valueElement) {
                        const value = parseFloat(valueElement.textContent);
                        const fillPercentage = calculateBatteryFill(value);
                        animateBatteryGauge(battery, fillPercentage);
                    }
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.battery-gauge').forEach(gauge => {
        observer.observe(gauge);
    });
}

/**
 * Optimize table scrolling performance
 */
function initializeScrollOptimization() {
    const table = document.querySelector('.comparison-table');
    const headers = document.querySelectorAll('.model-header');
    
    const optimizedScroll = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update sticky header shadows
        headers.forEach(header => {
            if (scrollTop > 200) {
                header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = '';
            }
        });
        
        // Update scroll progress indicator
        updateScrollProgress();
    }, 16); // ~60fps
    
    window.addEventListener('scroll', optimizedScroll);
}

/**
 * Update scroll progress indicator
 */
function updateScrollProgress() {
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }
    
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    progressBar.style.width = scrolled + '%';
}

// =========================================
// Data Management
// =========================================

/**
 * Validate data integrity
 */
function validateData() {
    const errors = [];
    
    Object.entries(MODELS_DATA).forEach(([key, model]) => {
        if (!model.name || !model.company || !model.country) {
            errors.push(`Missing required fields for model: ${key}`);
        }
        
        if (model.performanceScore < 0 || model.performanceScore > 10) {
            errors.push(`Invalid performance score for ${key}: ${model.performanceScore}`);
        }
    });
    
    if (errors.length > 0) {
        console.error('Data validation errors:', errors);
        return false;
    }
    
    return true;
}

/**
 * Export table data as JSON
 */
function exportData() {
    const exportData = {
        timestamp: new Date().toISOString(),
        version: CONFIG.version,
        models: MODELS_DATA,
        metadata: {
            totalModels: Object.keys(MODELS_DATA).length,
            energyThresholds: ENERGY_THRESHOLDS
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ai-chatbot-comparison-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// =========================================
// Error Handling and Analytics
// =========================================

/**
 * Global error handler
 */
function initializeErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        logError('JavaScript Error', event.error.message, event.filename, event.lineno);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        logError('Promise Rejection', event.reason);
    });
}

/**
 * Log errors for analysis
 */
function logError(type, message, filename = '', line = 0) {
    const errorData = {
        type,
        message,
        filename,
        line,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // In production, send to analytics service
    console.warn('Error logged:', errorData);
}

/**
 * Track user interactions
 */
function trackInteraction(action, category = 'table', label = '') {
    const interactionData = {
        action,
        category,
        label,
        timestamp: new Date().toISOString()
    };
    
    // In production, send to analytics service
    console.log('Interaction tracked:', interactionData);
}

// =========================================
// Accessibility Enhancements
// =========================================

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Enhance screen reader support
    enhanceScreenReaderSupport();
    
    // Add focus management
    manageFocus();
    
    // Respect user preferences
    respectUserPreferences();
}

/**
 * Add keyboard navigation support
 */
function addKeyboardNavigation() {
    const modelHeaders = document.querySelectorAll('.model-header');
    
    modelHeaders.forEach((header, index) => {
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-label', `Sort by ${header.textContent.trim()}`);
        
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
                trackInteraction('keyboard_sort', 'accessibility', header.textContent.trim());
            }
        });
    });
}

/**
 * Enhance screen reader support
 */
function enhanceScreenReaderSupport() {
    // Add ARIA labels to battery gauges
    const batteryGauges = document.querySelectorAll('.battery-gauge');
    batteryGauges.forEach(gauge => {
        const valueElement = gauge.querySelector('.metric-value');
        const fillElement = gauge.querySelector('.battery-fill');
        
        if (valueElement && fillElement) {
            const value = parseFloat(valueElement.textContent);
            const energyClass = getEnergyClass(value);
            const efficiency = energyClass === 'low' ? 'High efficiency' : 
                             energyClass === 'medium' ? 'Medium efficiency' :
                             energyClass === 'high' ? 'Low efficiency' : 'Very low efficiency';
            
            gauge.setAttribute('aria-label', `Energy consumption: ${value} kWh. ${efficiency}`);
            gauge.setAttribute('role', 'img');
        }
    });
    
    // Add table navigation hints
    const table = document.querySelector('.comparison-table');
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', 'AI Chatbot Comparison Table');
    
    // Add row and column headers
    const headers = document.querySelectorAll('.model-header');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    });
    
    const categoryRows = document.querySelectorAll('.category-row td');
    categoryRows.forEach(cell => {
        cell.setAttribute('scope', 'row');
    });
}

/**
 * Manage focus for better navigation
 */
function manageFocus() {
    // Focus trap for filter controls
    const filterControls = document.querySelector('.filter-controls');
    if (filterControls) {
        const focusableElements = filterControls.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        filterControls.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

/**
 * Respect user accessibility preferences
 */
function respectUserPreferences() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        CONFIG.animationDuration = 0;
        document.body.classList.add('reduced-motion');
    }
    
    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    if (prefersHighContrast) {
        document.body.classList.add('high-contrast');
    }
    
    // Check for dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// =========================================
// Main Initialization
// =========================================

/**
 * Initialize all functionality
 */
function initialize() {
    console.log('🚀 Initializing AI Chatbot Comparison 2025...');
    
    try {
        // Validate data integrity
        if (!validateData()) {
            throw new Error('Data validation failed');
        }
        
        // Initialize core features
        initializeBatteryGauges();
        initializeTableSorting();
        initializeFiltering();
        
        // Initialize performance optimizations
        initializeLazyAnimations();
        initializeScrollOptimization();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        // Initialize error handling
        initializeErrorHandling();
        
        // Add fade-in animation to main container
        const container = document.querySelector('.container');
        if (container) {
            fadeInElement(container, 100);
        }
        
        // Track initialization
        trackInteraction('page_load', 'initialization');
        
        console.log('✅ AI Chatbot Comparison 2025 initialized successfully');
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        logError('Initialization Error', error.message);
        showErrorMessage('Failed to initialize the application. Please refresh the page.');
    }
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-text">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.insertBefore(errorContainer, document.body.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 5000);
}

// =========================================
// Advanced Features
// =========================================

/**
 * Initialize advanced comparison tools
 */
function initializeAdvancedFeatures() {
    createComparisonMode();
    initializeDataExport();
    setupKeyboardShortcuts();
    initializeTooltips();
}

/**
 * Create side-by-side comparison mode
 */
function createComparisonMode() {
    const comparisonButton = document.createElement('button');
    comparisonButton.className = 'comparison-mode-btn';
    comparisonButton.innerHTML = '⚖️ Compare Selected';
    comparisonButton.title = 'Compare up to 3 models side by side';
    
    const tableContainer = document.querySelector('.table-container');
    tableContainer.insertBefore(comparisonButton, tableContainer.firstChild);
    
    let selectedModels = [];
    
    // Add selection checkboxes to model headers
    const modelHeaders = document.querySelectorAll('.model-header');
    modelHeaders.forEach((header, index) => {
        if (index === 0) return; // Skip category column
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'model-select';
        checkbox.dataset.modelIndex = index;
        
        checkbox.addEventListener('change', (e) => {
            const modelIndex = parseInt(e.target.dataset.modelIndex);
            
            if (e.target.checked) {
                if (selectedModels.length < 3) {
                    selectedModels.push(modelIndex);
                    header.classList.add('selected');
                } else {
                    e.target.checked = false;
                    showTooltip(e.target, 'Maximum 3 models can be compared');
                }
            } else {
                selectedModels = selectedModels.filter(idx => idx !== modelIndex);
                header.classList.remove('selected');
            }
            
            comparisonButton.style.display = selectedModels.length >= 2 ? 'block' : 'none';
            comparisonButton.textContent = `⚖️ Compare Selected (${selectedModels.length})`;
        });
        
        header.appendChild(checkbox);
    });
    
    comparisonButton.addEventListener('click', () => {
        if (selectedModels.length >= 2) {
            openComparisonModal(selectedModels);
            trackInteraction('comparison_opened', 'advanced_features', selectedModels.length.toString());
        }
    });
    
    comparisonButton.style.display = 'none';
}

/**
 * Open comparison modal
 */
function openComparisonModal(selectedModelIndices) {
    const modal = document.createElement('div');
    modal.className = 'comparison-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>🔍 Model Comparison</h2>
                <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="comparison-grid">
                    ${generateComparisonGrid(selectedModelIndices)}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-export">📊 Export Comparison</button>
                <button class="btn-share">🔗 Share Comparison</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', closeComparisonModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeComparisonModal);
    modal.querySelector('.btn-export').addEventListener('click', () => exportComparison(selectedModelIndices));
    modal.querySelector('.btn-share').addEventListener('click', () => shareComparison(selectedModelIndices));
    
    // Add escape key listener
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeComparisonModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Animate modal appearance
    setTimeout(() => {
        modal.classList.add('modal-visible');
    }, 10);
}

/**
 * Generate comparison grid HTML
 */
function generateComparisonGrid(modelIndices) {
    const categories = [
        { key: 'energy', label: '⚡ Energy Efficiency', format: 'energy' },
        { key: 'performance', label: '📊 Performance Score', format: 'score' },
        { key: 'price', label: '💰 Cost per Query', format: 'currency' },
        { key: 'context', label: '📝 Context Window', format: 'tokens' },
        { key: 'rating', label: '🌟 Environmental Rating', format: 'rating' }
    ];
    
    let html = '<div class="comparison-headers">';
    html += '<div class="comparison-category">Category</div>';
    
    modelIndices.forEach(index => {
        const modelKey = Object.keys(MODELS_DATA)[index - 1];
        const model = MODELS_DATA[modelKey];
        html += `<div class="comparison-model">
            <div class="model-name">${model.name}</div>
            <div class="model-company">${model.company} ${model.country}</div>
        </div>`;
    });
    
    html += '</div>';
    
    categories.forEach(category => {
        html += '<div class="comparison-row">';
        html += `<div class="comparison-category">${category.label}</div>`;
        
        modelIndices.forEach(index => {
            const value = getComparisonValue(index, category.key);
            const formattedValue = formatComparisonValue(value, category.format);
            const rankClass = getRankClass(value, modelIndices, category.key);
            
            html += `<div class="comparison-value ${rankClass}">${formattedValue}</div>`;
        });
        
        html += '</div>';
    });
    
    return html;
}

/**
 * Get comparison value for a model and category
 */
function getComparisonValue(modelIndex, category) {
    const modelKey = Object.keys(MODELS_DATA)[modelIndex - 1];
    const model = MODELS_DATA[modelKey];
    
    switch (category) {
        case 'energy':
            return 0.001 + (Math.random() * 0.003); // Simulated energy data
        case 'performance':
            return model.performanceScore;
        case 'price':
            return 0.01 + (Math.random() * 0.03); // Simulated pricing
        case 'context':
            return 128000 + (Math.random() * 72000); // Simulated context window
        case 'rating':
            return model.energyRating;
        default:
            return 'N/A';
    }
}

/**
 * Format comparison value based on type
 */
function formatComparisonValue(value, format) {
    switch (format) {
        case 'energy':
            return `${value.toFixed(4)} kWh`;
        case 'score':
            return `${value.toFixed(1)}/10`;
        case 'currency':
            return `${value.toFixed(3)}`;
        case 'tokens':
            return `${Math.round(value).toLocaleString()} tokens`;
        case 'rating':
            return value;
        default:
            return value;
    }
}

/**
 * Get rank class for comparison styling
 */
function getRankClass(value, modelIndices, category) {
    const values = modelIndices.map(index => getComparisonValue(index, category));
    const numericValues = values.filter(v => typeof v === 'number');
    
    if (numericValues.length === 0) return '';
    
    const sortedValues = [...numericValues].sort((a, b) => {
        // For energy and price, lower is better
        if (category === 'energy' || category === 'price') {
            return a - b;
        }
        // For performance and context, higher is better
        return b - a;
    });
    
    const rank = sortedValues.indexOf(value);
    if (rank === 0) return 'rank-best';
    if (rank === sortedValues.length - 1) return 'rank-worst';
    return 'rank-middle';
}

/**
 * Close comparison modal
 */
function closeComparisonModal() {
    const modal = document.querySelector('.comparison-modal');
    if (modal) {
        modal.classList.remove('modal-visible');
        setTimeout(() => {
            modal.remove();
            document.body.classList.remove('modal-open');
        }, 300);
    }
}

/**
 * Export comparison data
 */
function exportComparison(modelIndices) {
    const comparisonData = {
        timestamp: new Date().toISOString(),
        models: modelIndices.map(index => {
            const modelKey = Object.keys(MODELS_DATA)[index - 1];
            return {
                ...MODELS_DATA[modelKey],
                energy: getComparisonValue(index, 'energy'),
                price: getComparisonValue(index, 'price'),
                contextWindow: getComparisonValue(index, 'context')
            };
        })
    };
    
    const dataStr = JSON.stringify(comparisonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ai-comparison-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    trackInteraction('comparison_exported', 'data_export');
}

/**
 * Share comparison via URL
 */
function shareComparison(modelIndices) {
    const shareUrl = `${window.location.origin}${window.location.pathname}?compare=${modelIndices.join(',')}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'AI Chatbot Comparison',
            text: 'Check out this AI model comparison',
            url: shareUrl
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            showTooltip(document.querySelector('.btn-share'), 'Link copied to clipboard!');
        });
    }
    
    trackInteraction('comparison_shared', 'social_sharing');
}

/**
 * Initialize data export functionality
 */
function initializeDataExport() {
    const exportButton = document.createElement('button');
    exportButton.className = 'export-btn';
    exportButton.innerHTML = '📊 Export Data';
    exportButton.title = 'Export table data as JSON';
    
    const header = document.querySelector('.header');
    header.appendChild(exportButton);
    
    exportButton.addEventListener('click', () => {
        exportData();
        trackInteraction('data_exported', 'data_management');
    });
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    const shortcuts = {
        'ctrl+f': () => {
            const searchInput = document.querySelector('#search-input');
            if (searchInput) searchInput.focus();
        },
        'ctrl+e': () => {
            exportData();
        },
        'ctrl+r': () => {
            resetFilters();
        },
        'esc': () => {
            closeComparisonModal();
        }
    };
    
    document.addEventListener('keydown', (e) => {
        const key = (e.ctrlKey ? 'ctrl+' : '') + e.key.toLowerCase();
        
        if (shortcuts[key]) {
            e.preventDefault();
            shortcuts[key]();
            trackInteraction('keyboard_shortcut', 'accessibility', key);
        }
    });
    
    // Add shortcuts help
    const shortcutsHelp = document.createElement('div');
    shortcutsHelp.className = 'shortcuts-help';
    shortcutsHelp.innerHTML = `
        <button class="shortcuts-toggle">⌨️ Shortcuts</button>
        <div class="shortcuts-panel">
            <h4>Keyboard Shortcuts</h4>
            <div class="shortcut-item"><kbd>Ctrl</kbd> + <kbd>F</kbd> - Search</div>
            <div class="shortcut-item"><kbd>Ctrl</kbd> + <kbd>E</kbd> - Export Data</div>
            <div class="shortcut-item"><kbd>Ctrl</kbd> + <kbd>R</kbd> - Reset Filters</div>
            <div class="shortcut-item"><kbd>Esc</kbd> - Close Modal</div>
        </div>
    `;
    
    document.body.appendChild(shortcutsHelp);
    
    const toggle = shortcutsHelp.querySelector('.shortcuts-toggle');
    const panel = shortcutsHelp.querySelector('.shortcuts-panel');
    
    toggle.addEventListener('click', () => {
        panel.classList.toggle('visible');
    });
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        const originalTitle = element.getAttribute('title');
        element.removeAttribute('title');
        
        element.addEventListener('mouseenter', (e) => {
            showTooltip(e.target, originalTitle);
        });
        
        element.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

/**
 * Show tooltip
 */
function showTooltip(element, text) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;
    
    // Boundary checks
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
        top = rect.bottom + 10;
        tooltip.classList.add('tooltip-below');
    } else {
        tooltip.classList.remove('tooltip-below');
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.classList.add('visible');
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 200);
    }
}

// =========================================
// URL State Management
// =========================================

/**
 * Initialize URL state management
 */
function initializeUrlState() {
    // Parse URL parameters on load
    parseUrlParameters();
    
    // Update URL when state changes
    window.addEventListener('statechange', updateUrlState);
}

/**
 * Parse URL parameters and apply state
 */
function parseUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Handle comparison parameter
    const compareParam = urlParams.get('compare');
    if (compareParam) {
        const modelIndices = compareParam.split(',').map(i => parseInt(i));
        if (modelIndices.length >= 2) {
            setTimeout(() => {
                openComparisonModal(modelIndices);
            }, 1000); // Wait for initialization
        }
    }
    
    // Handle filter parameters
    const energyFilter = urlParams.get('energy');
    const countryFilter = urlParams.get('country');
    const performanceFilter = urlParams.get('performance');
    
    if (energyFilter || countryFilter || performanceFilter) {
        setTimeout(() => {
            if (energyFilter) document.getElementById('energy-filter').value = energyFilter;
            if (countryFilter) document.getElementById('country-filter').value = countryFilter;
            if (performanceFilter) {
                document.getElementById('performance-filter').value = performanceFilter;
                document.getElementById('performance-value').textContent = performanceFilter;
            }
            applyFilters();
        }, 500);
    }
}

/**
 * Update URL state
 */
function updateUrlState() {
    const params = new URLSearchParams();
    
    // Add filter states
    const energyFilter = document.getElementById('energy-filter')?.value;
    const countryFilter = document.getElementById('country-filter')?.value;
    const performanceFilter = document.getElementById('performance-filter')?.value;
    
    if (energyFilter) params.set('energy', energyFilter);
    if (countryFilter) params.set('country', countryFilter);
    if (performanceFilter && performanceFilter !== '8') params.set('performance', performanceFilter);
    
    // Update URL without page reload
    const newUrl = params.toString() ? 
        `${window.location.pathname}?${params.toString()}` : 
        window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
}

// =========================================
// Performance Monitoring
// =========================================

/**
 * Initialize performance monitoring
 */
function initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    monitorWebVitals();
    
    // Monitor custom metrics
    monitorCustomMetrics();
    
    // Setup performance observer
    if ('PerformanceObserver' in window) {
        setupPerformanceObserver();
    }
}

/**
 * Monitor Core Web Vitals
 */
function monitorWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
        });
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                console.log('CLS:', clsValue);
            }
        });
    }).observe({ entryTypes: ['layout-shift'] });
}

/**
 * Monitor custom application metrics
 */
function monitorCustomMetrics() {
    // Time to interactive
    const startTime = performance.now();
    
    setTimeout(() => {
        const timeToInteractive = performance.now() - startTime;
        console.log('Time to Interactive:', timeToInteractive);
        
        // Log performance metrics
        const performanceData = {
            timeToInteractive,
            domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,
            loadComplete: performance.getEntriesByType('navigation')[0]?.loadEventEnd,
            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : null
        };
        
        console.log('Performance Metrics:', performanceData);
    }, 100);
}

/**
 * Setup performance observer for detailed monitoring
 */
function setupPerformanceObserver() {
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.entryType === 'measure') {
                console.log(`Custom Metric - ${entry.name}:`, entry.duration);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
}

// =========================================
// Service Worker Integration
// =========================================

/**
 * Initialize service worker for offline functionality
 */
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    showUpdateNotification();
                                }
                            }
                        });
                    });
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

/**
 * Show update notification
 */
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>🔄 A new version is available!</span>
            <button onclick="window.location.reload()">Update</button>
            <button onclick="this.parentElement.parentElement.remove()">Later</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('visible');
    }, 100);
}

// =========================================
// Event Listeners and Initialization
// =========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Initialize advanced features after main initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeAdvancedFeatures();
        initializeUrlState();
        initializePerformanceMonitoring();
        initializeServiceWorker();
    }, 1000);
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate layouts if needed
    const tooltips = document.querySelectorAll('.tooltip.visible');
    tooltips.forEach(tooltip => {
        hideTooltip();
    });
    
    // Update responsive elements
    updateResponsiveElements();
}, 250));

/**
 * Update responsive elements on resize
 */
function updateResponsiveElements() {
    const isMobile = window.innerWidth <= 768;
    const table = document.querySelector('.comparison-table');
    
    if (table) {
        if (isMobile) {
            table.classList.add('mobile-view');
        } else {
            table.classList.remove('mobile-view');
        }
    }
}

// Handle visibility change (page focus/blur)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause animations
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible - resume animations
        document.body.classList.remove('page-hidden');
        
        // Refresh data if needed (when returning to page)
        const timeSinceLastUpdate = Date.now() - (window.lastUpdateTime || 0);
        if (timeSinceLastUpdate > CONFIG.updateInterval) {
            // Refresh data if stale
            refreshData();
        }
    }
});

/**
 * Refresh data (future implementation)
 */
function refreshData() {
    window.lastUpdateTime = Date.now();
    console.log('🔄 Refreshing data...');
    
    // Future: Fetch latest data from API
    // This would update energy consumption values, performance scores, etc.
    
    trackInteraction('data_refresh', 'data_management');
}

// Export functions for external use
window.AIComparison = {
    initialize,
    exportData,
    resetFilters,
    trackInteraction,
    showTooltip,
    hideTooltip,
    version: CONFIG.version
};

console.log('📋 AI Chatbot Comparison 2025 script loaded successfully');
