/**
 * Event system utilities for أنت صاحب المنصة
 * Contains event management and observer pattern implementations
 */

/**
 * Event Emitter class for managing custom events
 */
export class EventEmitter {
    constructor() {
        this.events = {};
        this.onceEvents = {};
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event callback
     * @param {Object} context - Callback context
     */
    on(event, callback, context = null) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push({
            callback: context ? callback.bind(context) : callback,
            context,
            once: false
        });
    }

    /**
     * Add one-time event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event callback
     * @param {Object} context - Callback context
     */
    once(event, callback, context = null) {
        if (!this.onceEvents[event]) {
            this.onceEvents[event] = [];
        }

        this.onceEvents[event].push({
            callback: context ? callback.bind(context) : callback,
            context
        });
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event callback to remove
     */
    off(event, callback) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(listener => {
            return !(listener.callback === callback ||
                    (listener.context && listener.callback === callback.bind(listener.context)));
        });

        // Also remove from once events
        if (this.onceEvents[event]) {
            this.onceEvents[event] = this.onceEvents[event].filter(listener => {
                return !(listener.callback === callback ||
                        (listener.context && listener.callback === callback.bind(listener.context)));
            });
        }
    }

    /**
     * Emit event
     * @param {string} event - Event name
     * @param {...any} args - Event arguments
     */
    emit(event, ...args) {
        // Handle regular events
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(listener => {
                try {
                    listener.callback(...args);
                    return !listener.once;
                } catch (error) {
                    console.error(`Event listener error for "${event}":`, error);
                    return true; // Keep listener if it threw an error
                }
            });
        }

        // Handle once events
        if (this.onceEvents[event]) {
            this.onceEvents[event].forEach(listener => {
                try {
                    listener.callback(...args);
                } catch (error) {
                    console.error(`One-time event listener error for "${event}":`, error);
                }
            });
            delete this.onceEvents[event];
        }
    }

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
    removeAllListeners(event) {
        delete this.events[event];
        delete this.onceEvents[event];
    }

    /**
     * Get all event names
     * @returns {Array} Array of event names
     */
    eventNames() {
        return Object.keys(this.events).concat(Object.keys(this.onceEvents));
    }

    /**
     * Get listener count for an event
     * @param {string} event - Event name
     * @returns {number} Listener count
     */
    listenerCount(event) {
        const regularCount = this.events[event] ? this.events[event].length : 0;
        const onceCount = this.onceEvents[event] ? this.onceEvents[event].length : 0;
        return regularCount + onceCount;
    }

    /**
     * Check if event has listeners
     * @param {string} event - Event name
     * @returns {boolean} Whether event has listeners
     */
    hasListeners(event) {
        return this.listenerCount(event) > 0;
    }
}

/**
 * Global event bus instance
 */
export const eventBus = new EventEmitter();

/**
 * Event names constants
 */
export const EVENTS = {
    // User events
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_REGISTER: 'user:register',
    USER_PROFILE_UPDATE: 'user:profile:update',
    USER_PREFERENCES_CHANGE: 'user:preferences:change',

    // Content events
    CONTENT_CREATE: 'content:create',
    CONTENT_UPDATE: 'content:update',
    CONTENT_DELETE: 'content:delete',
    CONTENT_LIKE: 'content:like',
    CONTENT_UNLIKE: 'content:unlike',
    CONTENT_BOOKMARK: 'content:bookmark',
    CONTENT_UNBOOKMARK: 'content:unbookmark',
    CONTENT_SHARE: 'content:share',

    // UI events
    MODAL_OPEN: 'ui:modal:open',
    MODAL_CLOSE: 'ui:modal:close',
    NOTIFICATION_SHOW: 'ui:notification:show',
    NOTIFICATION_HIDE: 'ui:notification:hide',
    THEME_CHANGE: 'ui:theme:change',
    LANGUAGE_CHANGE: 'ui:language:change',

    // Network events
    NETWORK_ONLINE: 'network:online',
    NETWORK_OFFLINE: 'network:offline',
    API_ERROR: 'network:api:error',
    REQUEST_START: 'network:request:start',
    REQUEST_END: 'network:request:end',

    // Form events
    FORM_SUBMIT: 'form:submit',
    FORM_VALIDATION_ERROR: 'form:validation:error',
    FORM_SUCCESS: 'form:success',

    // Page events
    PAGE_LOAD: 'page:load',
    PAGE_UNLOAD: 'page:unload',
    PAGE_VISIBLE: 'page:visible',
    PAGE_HIDDEN: 'page:hidden',

    // Search events
    SEARCH_START: 'search:start',
    SEARCH_RESULT: 'search:result',
    SEARCH_ERROR: 'search:error',

    // Admin events
    ADMIN_USER_ACTION: 'admin:user:action',
    ADMIN_CONTENT_ACTION: 'admin:content:action',
    ADMIN_SETTINGS_CHANGE: 'admin:settings:change'
};

/**
 * Page Visibility Manager
 */
export class PageVisibilityManager {
    constructor() {
        this.isVisible = !document.hidden;
        this.listeners = [];

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('visibilitychange', () => {
            const wasVisible = this.isVisible;
            this.isVisible = !document.hidden;

            if (wasVisible !== this.isVisible) {
                this.notifyListeners(this.isVisible ? 'visible' : 'hidden');
            }
        });
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    notifyListeners(state) {
        this.listeners.forEach(callback => {
            try {
                callback(state);
            } catch (error) {
                console.error('Page visibility listener error:', error);
            }
        });
    }

    isPageVisible() {
        return this.isVisible;
    }
}

/**
 * Form Validation Manager
 */
export class FormValidationManager {
    constructor(formElement) {
        this.form = formElement;
        this.validators = new Map();
        this.errors = new Map();
        this.isSubmitting = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });

        // Real-time validation
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target.name);
        });

        this.form.addEventListener('blur', (e) => {
            this.validateField(e.target.name, true);
        }, true);
    }

    addValidator(fieldName, validator) {
        this.validators.set(fieldName, validator);
    }

    validateField(fieldName, showErrors = false) {
        const field = this.form?.querySelector(`[name="${fieldName}"]`);
        if (!field) return true;

        const validator = this.validators.get(fieldName);
        if (!validator) return true;

        const result = validator(field.value);

        if (result.isValid) {
            this.clearFieldError(fieldName);
            return true;
        } else {
            if (showErrors) {
                this.showFieldError(fieldName, result.errors);
            }
            return false;
        }
    }

    validateForm() {
        if (this.isSubmitting) return;

        let isValid = true;
        const errors = {};

        this.validators.forEach((validator, fieldName) => {
            const fieldResult = validator(this.form.querySelector(`[name="${fieldName}"]`)?.value);
            if (!fieldResult.isValid) {
                isValid = false;
                errors[fieldName] = fieldResult.errors;
                this.showFieldError(fieldName, fieldResult.errors);
            } else {
                this.clearFieldError(fieldName);
            }
        });

        if (isValid) {
            eventBus.emit(EVENTS.FORM_SUCCESS, this.form);
        } else {
            eventBus.emit(EVENTS.FORM_VALIDATION_ERROR, errors, this.form);
        }

        return isValid;
    }

    showFieldError(fieldName, errors) {
        this.clearFieldError(fieldName);

        const field = this.form?.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = errors[0];
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
            direction: rtl;
            text-align: right;
        `;

        field.parentNode.appendChild(errorElement);
        field.classList.add('error');

        this.errors.set(fieldName, errorElement);
    }

    clearFieldError(fieldName) {
        const errorElement = this.errors.get(fieldName);
        if (errorElement) {
            errorElement.remove();
            this.errors.delete(fieldName);
        }

        const field = this.form?.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.remove('error');
        }
    }

    clearAllErrors() {
        this.errors.forEach(errorElement => errorElement.remove());
        this.errors.clear();

        const errorFields = this.form?.querySelectorAll('.error');
        errorFields?.forEach(field => field.classList.remove('error'));
    }

    setSubmitting(isSubmitting) {
        this.isSubmitting = isSubmitting;

        if (this.form) {
            const submitButton = this.form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = isSubmitting;
                submitButton.textContent = isSubmitting ? 'جاري الإرسال...' : 'إرسال';
            }
        }
    }
}

/**
 * Search Manager
 */
export class SearchManager {
    constructor(searchInput, options = {}) {
        this.input = searchInput;
        this.options = {
            minLength: 2,
            delay: 300,
            maxResults: 10,
            ...options
        };

        this.searchTimeout = null;
        this.currentQuery = '';
        this.isSearching = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.input) return;

        this.input.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.input.value);
            }
        });
    }

    handleInput(value) {
        this.currentQuery = value.trim();

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (this.currentQuery.length < this.options.minLength) {
            this.clearResults();
            return;
        }

        this.searchTimeout = setTimeout(() => {
            this.performSearch(this.currentQuery);
        }, this.options.delay);
    }

    async performSearch(query) {
        if (this.isSearching) return;

        this.isSearching = true;
        eventBus.emit(EVENTS.SEARCH_START, query);

        try {
            // This would typically call an API
            const results = await this.searchAPI(query);
            eventBus.emit(EVENTS.SEARCH_RESULT, results, query);
        } catch (error) {
            eventBus.emit(EVENTS.SEARCH_ERROR, error, query);
        } finally {
            this.isSearching = false;
        }
    }

    async searchAPI(query) {
        // Placeholder for actual search API call
        // This would be replaced with actual API client call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    query,
                    results: [],
                    total: 0
                });
            }, 500);
        });
    }

    clearResults() {
        eventBus.emit(EVENTS.SEARCH_RESULT, { results: [], total: 0 }, '');
    }

    destroy() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }
}

/**
 * Theme Manager
 */
export class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.listeners = [];

        this.applyTheme();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme();
                }
            });
        }
    }

    setTheme(theme) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            throw new Error('Invalid theme');
        }

        this.currentTheme = theme;
        localStorage.setItem('theme', theme);

        this.applyTheme();
        eventBus.emit(EVENTS.THEME_CHANGE, theme);

        this.notifyListeners(theme);
    }

    getTheme() {
        return this.currentTheme;
    }

    applyTheme() {
        const root = document.documentElement;
        let effectiveTheme = this.currentTheme;

        if (this.currentTheme === 'auto') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        root.setAttribute('data-theme', effectiveTheme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#1f2937' : '#ffffff');
        }
    }

    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    notifyListeners(theme) {
        this.listeners.forEach(callback => {
            try {
                callback(theme);
            } catch (error) {
                console.error('Theme listener error:', error);
            }
        });
    }
}

/**
 * Performance Monitor
 */
export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];

        this.observePerformance();
    }

    observePerformance() {
        // Monitor page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.recordMetric('pageLoad', performance.now());
                    this.recordMetric('domContentLoaded', performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart);
                    this.recordMetric('loadComplete', performance.timing.loadEventEnd - performance.timing.navigationStart);
                }, 0);
            });
        }

        // Monitor resource loading
        if ('PerformanceObserver' in window) {
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.initiatorType === 'img') {
                            this.recordMetric(`imageLoad:${entry.name}`, entry.duration);
                        }
                    });
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (error) {
                console.warn('Performance observer not supported');
            }
        }
    }

    recordMetric(name, value) {
        this.metrics.set(name, {
            value,
            timestamp: Date.now()
        });

        this.notifyObservers(name, value);
    }

    getMetric(name) {
        return this.metrics.get(name);
    }

    getAllMetrics() {
        return Object.fromEntries(this.metrics);
    }

    addObserver(callback) {
        this.observers.push(callback);
    }

    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(name, value) {
        this.observers.forEach(callback => {
            try {
                callback(name, value);
            } catch (error) {
                console.error('Performance observer error:', error);
            }
        });
    }
}

// Create default instances
export const pageVisibilityManager = new PageVisibilityManager();
export const themeManager = new ThemeManager();
export const performanceMonitor = new PerformanceMonitor();

// Setup global event listeners
pageVisibilityManager.addListener((state) => {
    eventBus.emit(state === 'visible' ? EVENTS.PAGE_VISIBLE : EVENTS.PAGE_HIDDEN);
});

// Export default object
export default {
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
};