/**
 * Main utilities index for أنت صاحب المنصة
 * Central export point for all utility modules
 */

// Import all utility modules
import * as helpers from './helpers.js';
import * as security from './security.js';
import * as validation from './validation.js';
import * as ui from './ui.js';
import * as storage from './storage.js';
import * as network from './network.js';
import * as events from './events.js';
import * as errorHandler from './error-handler.js';

// Export individual modules
export {
    helpers,
    security,
    validation,
    ui,
    storage,
    network,
    events,
    errorHandler
};

// Export commonly used functions and classes directly
export const {
    // Helpers
    debounce,
    throttle,
    formatFileSize,
    formatDate,
    isInViewport,
    animateElement,
    copyToClipboard,
    scrollToElement
} = helpers;

export const {
    // Security
    generateCSPNonce,
    sanitizeHtml,
    validateInput,
    isValidEmail,
    isValidPhone,
    isValidUrl,
    generateSecureToken,
    hashString,
    checkRateLimit,
    CSRFProtection,
    validateFile,
    preventSQLInjection,
    preventXSS,
    cookieManager
} = security;

export const {
    // Validation
    ARABIC_PATTERNS,
    VALIDATION_RULES,
    validateField,
    validateForm,
    validateUserRegistration,
    validateContentCreation,
    validateProfileUpdate,
    sanitizeInput: sanitizeInputValidation,
    containsArabic,
    isPrimarilyArabic,
    normalizeArabicText,
    validateFileUpload,
    validatePasswordStrength
} = validation;

export const {
    // UI
    showNotification,
    showLoading,
    hideLoading,
    showModal,
    showConfirm,
    showAlert,
    showTooltip
} = ui;

export const {
    // Storage
    StorageManager,
    SessionManager,
    UserDataManager,
    ContentDataManager,
    CacheManager,
    FormDataManager,
    storageManager,
    sessionManager,
    userDataManager,
    contentDataManager,
    cacheManager,
    formDataManager
} = storage;

export const {
    // Network
    APIClient,
    APIError,
    NetworkStatus,
    RequestQueue,
    RateLimiter,
    API_ENDPOINTS,
    apiClient,
    networkStatus,
    requestQueue,
    rateLimiter,
    createAPIClient
} = network;

export const {
    // Events
    EventEmitter,
    eventBus,
    EVENTS,
    PageVisibilityManager,
    FormValidationManager,
    SearchManager,
    ThemeManager,
    PerformanceMonitor,
    pageVisibilityManager,
    themeManager,
    performanceMonitor
} = events;

export const {
    // Error Handler
    PlatformError,
    ValidationError,
    NetworkError,
    AuthenticationError,
    AuthorizationError,
    ErrorHandler,
    GlobalErrorBoundary,
    FormErrorHandler,
    RetryManager,
    errorHandler,
    globalErrorBoundary,
    retryManager
} = errorHandler;

// Utility functions for common operations
export const utils = {
    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Deep clone object
     * @param {any} obj - Object to clone
     * @returns {any} Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));

        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    },

    /**
     * Check if object is empty
     * @param {Object} obj - Object to check
     * @returns {boolean} Whether object is empty
     */
    isEmpty(obj) {
        return obj === null || obj === undefined ||
               (typeof obj === 'object' && Object.keys(obj).length === 0);
    },

    /**
     * Get nested object value
     * @param {Object} obj - Object to traverse
     * @param {string} path - Dot-separated path
     * @param {any} defaultValue - Default value if path doesn't exist
     * @returns {any} Value at path
     */
    get(obj, path, defaultValue = undefined) {
        const keys = path.split('.');
        let result = obj;

        for (const key of keys) {
            if (result === null || result === undefined || !(key in result)) {
                return defaultValue;
            }
            result = result[key];
        }

        return result;
    },

    /**
     * Set nested object value
     * @param {Object} obj - Object to modify
     * @param {string} path - Dot-separated path
     * @param {any} value - Value to set
     */
    set(obj, path, value) {
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current) || typeof current[keys[i]] !== 'object') {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time
     * @returns {Function} Debounced function
     */
    debounce: helpers.debounce,

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Throttle limit
     * @returns {Function} Throttled function
     */
    throttle: helpers.throttle,

    /**
     * Sleep for specified milliseconds
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} Sleep promise
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Retry operation with exponential backoff
     * @param {Function} operation - Operation to retry
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} baseDelay - Base delay in milliseconds
     * @returns {Promise} Promise that resolves with operation result
     */
    async retry(operation, maxRetries = 3, baseDelay = 1000) {
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;

                if (attempt === maxRetries) {
                    throw error;
                }

                // Wait before retrying
                const delay = baseDelay * Math.pow(2, attempt);
                await this.sleep(delay);
            }
        }

        throw lastError;
    },

    /**
     * Check if running on mobile device
     * @returns {boolean} Whether running on mobile
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if running on tablet
     * @returns {boolean} Whether running on tablet
     */
    isTablet() {
        return /iPad|Android(?=.*\bMobile\b)|Tablet|PlayBook/i.test(navigator.userAgent);
    },

    /**
     * Check if running on desktop
     * @returns {boolean} Whether running on desktop
     */
    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    },

    /**
     * Get device type
     * @returns {string} Device type (mobile, tablet, desktop)
     */
    getDeviceType() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    },

    /**
     * Get browser language
     * @returns {string} Browser language
     */
    getLanguage() {
        return navigator.language || navigator.userLanguage || 'ar';
    },

    /**
     * Get browser info
     * @returns {Object} Browser information
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        return {
            userAgent: ua,
            language: this.getLanguage(),
            deviceType: this.getDeviceType(),
            isMobile: this.isMobile(),
            isTablet: this.isTablet(),
            isDesktop: this.isDesktop(),
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            platform: navigator.platform,
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    },

    /**
     * Format number with Arabic numerals
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    },

    /**
     * Parse Arabic numerals to English
     * @param {string} str - String with Arabic numerals
     * @returns {string} String with English numerals
     */
    parseArabicNumerals(str) {
        return str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
    },

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const map = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    /**
     * Unescape HTML characters
     * @param {string} text - Text to unescape
     * @returns {string} Unescaped text
     */
    unescapeHtml(text) {
        const map = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
            '&#039;': "'"
        };
        return text.replace(/&|<|>|"|&#039;/g, m => map[m]);
    },

    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} length - Maximum length
     * @param {string} suffix - Suffix to add if truncated
     * @returns {string} Truncated text
     */
    truncate(text, length, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length - suffix.length) + suffix;
    },

    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Convert string to slug
     * @param {string} str - String to convert
     * @returns {string} Slug string
     */
    slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Check if string is valid JSON
     * @param {string} str - String to check
     * @returns {boolean} Whether string is valid JSON
     */
    isJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Safe JSON parse
     * @param {string} str - String to parse
     * @param {any} defaultValue - Default value if parsing fails
     * @returns {any} Parsed JSON or default value
     */
    safeJSONParse(str, defaultValue = null) {
        try {
            return JSON.parse(str);
        } catch {
            return defaultValue;
        }
    },

    /**
     * Safe JSON stringify
     * @param {any} obj - Object to stringify
     * @param {any} defaultValue - Default value if stringifying fails
     * @returns {string} Stringified JSON or default value
     */
    safeJSONStringify(obj, defaultValue = '{}') {
        try {
            return JSON.stringify(obj);
        } catch {
            return defaultValue;
        }
    }
};

// Initialize global error handling
if (typeof window !== 'undefined') {
    // Make utilities available globally
    window.PlatformUtils = {
        ...utils,
        showNotification: ui.showNotification,
        showLoading: ui.showLoading,
        hideLoading: ui.hideLoading,
        copyToClipboard: helpers.copyToClipboard,
        formatFileSize: helpers.formatFileSize,
        formatDate: helpers.formatDate
    };

    // Setup global error handlers
    window.addEventListener('error', (event) => {
        errorHandler.handleError(
            new errorHandler.PlatformError(
                event.message,
                'JAVASCRIPT_RUNTIME_ERROR',
                {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    error: event.error
                }
            ),
            { type: 'javascript' }
        );
    });

    window.addEventListener('unhandledrejection', (event) => {
        errorHandler.handleError(
            new errorHandler.PlatformError(
                `Unhandled promise rejection: ${event.reason}`,
                'UNHANDLED_PROMISE_REJECTION',
                { reason: event.reason }
            ),
            { type: 'unhandledrejection' }
        );
    });
}

// Export default object with all utilities
export default {
    // Modules
    helpers,
    security,
    validation,
    ui,
    storage,
    network,
    events,
    errorHandler,

    // Direct exports
    debounce,
    throttle,
    formatFileSize,
    formatDate,
    isInViewport,
    animateElement,
    copyToClipboard,
    scrollToElement,
    generateCSPNonce,
    sanitizeHtml,
    validateInput,
    isValidEmail,
    isValidPhone,
    isValidUrl,
    generateSecureToken,
    hashString,
    checkRateLimit,
    CSRFProtection,
    validateFile,
    preventSQLInjection,
    preventXSS,
    sessionManager,
    cookieManager,
    ARABIC_PATTERNS,
    VALIDATION_RULES,
    validateField,
    validateForm,
    validateUserRegistration,
    validateContentCreation,
    validateProfileUpdate,
    sanitizeInput: sanitizeInputValidation,
    containsArabic,
    isPrimarilyArabic,
    normalizeArabicText,
    validateFileUpload,
    validatePasswordStrength,
    showNotification,
    showLoading,
    hideLoading,
    showModal,
    showConfirm,
    showAlert,
    showTooltip,
    StorageManager,
    SessionManager,
    UserDataManager,
    ContentDataManager,
    CacheManager,
    FormDataManager,
    storageManager,
    sessionManager,
    userDataManager,
    contentDataManager,
    cacheManager,
    formDataManager,
    APIClient,
    APIError,
    NetworkStatus,
    RequestQueue,
    RateLimiter,
    API_ENDPOINTS,
    apiClient,
    networkStatus,
    requestQueue,
    rateLimiter,
    createAPIClient,
    EventEmitter,
    eventBus,
    EVENTS,
    PageVisibilityManager,
    FormValidationManager,
    SearchManager,
    ThemeManager,
    PerformanceMonitor,
    pageVisibilityManager,
    themeManager,
    performanceMonitor,
    PlatformError,
    ValidationError,
    NetworkError,
    AuthenticationError,
    AuthorizationError,
    ErrorHandler,
    GlobalErrorBoundary,
    FormErrorHandler,
    RetryManager,
    errorHandler,
    globalErrorBoundary,
    retryManager,

    // Utility functions
    utils
};