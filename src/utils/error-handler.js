/**
 * Error handling utilities for أنت صاحب المنصة
 * Contains error management and reporting functions
 */

/**
 * Custom error classes
 */
export class PlatformError extends Error {
    constructor(message, code = 'UNKNOWN_ERROR', details = null) {
        super(message);
        this.name = 'PlatformError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

export class ValidationError extends PlatformError {
    constructor(message, field = null, details = null) {
        super(message, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
        this.field = field;
    }
}

export class NetworkError extends PlatformError {
    constructor(message, status = 0, details = null) {
        super(message, 'NETWORK_ERROR', details);
        this.name = 'NetworkError';
        this.status = status;
    }
}

export class AuthenticationError extends PlatformError {
    constructor(message, details = null) {
        super(message, 'AUTHENTICATION_ERROR', details);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends PlatformError {
    constructor(message, details = null) {
        super(message, 'AUTHORIZATION_ERROR', details);
        this.name = 'AuthorizationError';
    }
}

/**
 * Error Handler class
 */
export class ErrorHandler {
    constructor() {
        this.errorQueue = [];
        this.maxQueueSize = 50;
        this.listeners = [];
        this.isReporting = false;
    }

    /**
     * Handle error with appropriate action
     * @param {Error} error - Error to handle
     * @param {Object} context - Error context
     */
    handleError(error, context = {}) {
        // Normalize error
        const normalizedError = this.normalizeError(error);

        // Add context
        normalizedError.context = {
            ...context,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            userId: this.getCurrentUserId()
        };

        // Log error
        this.logError(normalizedError);

        // Add to queue for reporting
        this.addToQueue(normalizedError);

        // Show user-friendly message
        this.showUserMessage(normalizedError);

        // Report to external service
        this.reportError(normalizedError);

        // Notify listeners
        this.notifyListeners(normalizedError);

        return normalizedError;
    }

    /**
     * Normalize different types of errors
     * @param {Error|any} error - Error to normalize
     * @returns {PlatformError} Normalized error
     */
    normalizeError(error) {
        if (error instanceof PlatformError) {
            return error;
        }

        if (error instanceof Error) {
            return new PlatformError(error.message, 'JAVASCRIPT_ERROR', {
                name: error.name,
                stack: error.stack
            });
        }

        if (typeof error === 'string') {
            return new PlatformError(error, 'STRING_ERROR');
        }

        return new PlatformError('Unknown error occurred', 'UNKNOWN_ERROR', { originalError: error });
    }

    /**
     * Log error to console with appropriate level
     * @param {PlatformError} error - Error to log
     */
    logError(error) {
        const logData = {
            message: error.message,
            code: error.code,
            timestamp: error.timestamp,
            context: error.context,
            stack: error.stack || error.details?.stack
        };

        switch (error.code) {
            case 'VALIDATION_ERROR':
                console.warn('Validation Error:', logData);
                break;
            case 'NETWORK_ERROR':
                console.error('Network Error:', logData);
                break;
            case 'AUTHENTICATION_ERROR':
            case 'AUTHORIZATION_ERROR':
                console.error('Auth Error:', logData);
                break;
            default:
                console.error('Error:', logData);
        }
    }

    /**
     * Show user-friendly error message
     * @param {PlatformError} error - Error to show message for
     */
    showUserMessage(error) {
        const userMessages = {
            'VALIDATION_ERROR': 'يرجى التحقق من البيانات المدخلة',
            'NETWORK_ERROR': 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى',
            'AUTHENTICATION_ERROR': 'يرجى تسجيل الدخول أولاً',
            'AUTHORIZATION_ERROR': 'ليس لديك صلاحية للوصول إلى هذا المحتوى',
            'UNKNOWN_ERROR': 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى'
        };

        const message = userMessages[error.code] || error.message;

        // Use notification system if available
        if (window.showNotification) {
            window.showNotification(message, 'error');
        } else {
            // Fallback to alert
            alert(message);
        }
    }

    /**
     * Add error to reporting queue
     * @param {PlatformError} error - Error to add
     */
    addToQueue(error) {
        this.errorQueue.push(error);

        // Maintain queue size
        if (this.errorQueue.length > this.maxQueueSize) {
            this.errorQueue.shift();
        }

        // Save to localStorage for persistence
        try {
            localStorage.setItem('error_queue', JSON.stringify(this.errorQueue));
        } catch (e) {
            console.warn('Failed to save error queue to localStorage');
        }
    }

    /**
     * Load error queue from localStorage
     */
    loadQueue() {
        try {
            const stored = localStorage.getItem('error_queue');
            if (stored) {
                this.errorQueue = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load error queue from localStorage');
            this.errorQueue = [];
        }
    }

    /**
     * Report error to external service
     * @param {PlatformError} error - Error to report
     */
    async reportError(error) {
        if (this.isReporting) return;

        this.isReporting = true;

        try {
            // Don't report validation errors or minor issues
            if (error.code === 'VALIDATION_ERROR') {
                return;
            }

            const reportData = {
                message: error.message,
                code: error.code,
                stack: error.stack || error.details?.stack,
                context: error.context,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: error.timestamp
            };

            // Send to error reporting service (placeholder)
            await this.sendErrorReport(reportData);

        } catch (reportingError) {
            console.error('Failed to report error:', reportingError);
        } finally {
            this.isReporting = false;
        }
    }

    /**
     * Send error report to external service
     * @param {Object} reportData - Error report data
     */
    async sendErrorReport(reportData) {
        // Placeholder for actual error reporting service
        // This would typically send to services like Sentry, LogRocket, etc.

        console.log('Error report:', reportData);

        // Simulate API call
        return new Promise(resolve => {
            setTimeout(resolve, 100);
        });
    }

    /**
     * Get current user ID for error context
     * @returns {string|null} User ID
     */
    getCurrentUserId() {
        try {
            const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
            return userData.id || null;
        } catch {
            return null;
        }
    }

    /**
     * Add error event listener
     * @param {Function} callback - Error callback
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove error event listener
     * @param {Function} callback - Error callback to remove
     */
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * Notify all listeners of error
     * @param {PlatformError} error - Error to notify about
     */
    notifyListeners(error) {
        this.listeners.forEach(callback => {
            try {
                callback(error);
            } catch (listenerError) {
                console.error('Error listener callback failed:', listenerError);
            }
        });
    }

    /**
     * Get error statistics
     * @returns {Object} Error statistics
     */
    getErrorStats() {
        const stats = {
            total: this.errorQueue.length,
            byCode: {},
            byHour: {},
            recent: []
        };

        this.errorQueue.forEach(error => {
            // Count by error code
            stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1;

            // Count by hour
            const hour = new Date(error.timestamp).getHours();
            stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
        });

        // Get recent errors (last 24 hours)
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        stats.recent = this.errorQueue.filter(error =>
            new Date(error.timestamp) > oneDayAgo
        );

        return stats;
    }

    /**
     * Clear error queue
     */
    clearQueue() {
        this.errorQueue = [];
        try {
            localStorage.removeItem('error_queue');
        } catch (e) {
            console.warn('Failed to clear error queue from localStorage');
        }
    }
}

/**
 * Global error boundary for unhandled errors
 */
export class GlobalErrorBoundary {
    constructor() {
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            const error = new PlatformError(
                `Unhandled promise rejection: ${event.reason}`,
                'UNHANDLED_PROMISE_REJECTION',
                { reason: event.reason }
            );
            errorHandler.handleError(error, { type: 'unhandledrejection' });
            event.preventDefault();
        });

        // Handle global JavaScript errors
        window.addEventListener('error', (event) => {
            const error = new PlatformError(
                event.message,
                'JAVASCRIPT_RUNTIME_ERROR',
                {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    error: event.error
                }
            );
            errorHandler.handleError(error, { type: 'javascript' });
        });

        // Handle network errors
        window.addEventListener('offline', () => {
            const error = new NetworkError('تم فقدان الاتصال بالإنترنت');
            errorHandler.handleError(error, { type: 'network' });
        });
    }
}

/**
 * Form error handler
 */
export class FormErrorHandler {
    constructor(formElement) {
        this.form = formElement;
        this.fieldErrors = new Map();
        this.setupFormValidation();
    }

    setupFormValidation() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
        });
    }

    showFieldError(fieldName, message) {
        this.clearFieldError(fieldName);

        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
            direction: rtl;
            text-align: right;
        `;

        field.parentNode.appendChild(errorElement);
        field.classList.add('error');
        this.fieldErrors.set(fieldName, errorElement);
    }

    clearFieldError(fieldName) {
        const errorElement = this.fieldErrors.get(fieldName);
        if (errorElement) {
            errorElement.remove();
            this.fieldErrors.delete(fieldName);
        }

        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.remove('error');
        }
    }

    clearAllErrors() {
        this.fieldErrors.forEach(errorElement => errorElement.remove());
        this.fieldErrors.clear();

        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    validateForm() {
        this.clearAllErrors();
        let isValid = true;

        // Check required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field.name, 'هذا الحقل مطلوب');
                isValid = false;
            }
        });

        // Check email fields
        const emailFields = this.form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field.name, 'يرجى إدخال بريد إلكتروني صحيح');
                isValid = false;
            }
        });

        // Check phone fields
        const phoneFields = this.form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            if (field.value && !this.isValidPhone(field.value)) {
                this.showFieldError(field.name, 'يرجى إدخال رقم هاتف صحيح');
                isValid = false;
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        const digitsOnly = phone.replace(/\D/g, '');
        return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }
}

/**
 * Retry mechanism for failed operations
 */
export class RetryManager {
    constructor(maxRetries = 3, baseDelay = 1000) {
        this.maxRetries = maxRetries;
        this.baseDelay = baseDelay;
    }

    /**
     * Execute function with retry logic
     * @param {Function} fn - Function to execute
     * @param {Object} options - Retry options
     * @returns {Promise} Promise that resolves with function result
     */
    async execute(fn, options = {}) {
        const {
            maxRetries = this.maxRetries,
            baseDelay = this.baseDelay,
            shouldRetry = this.defaultShouldRetry
        } = options;

        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                if (attempt === maxRetries || !shouldRetry(error)) {
                    throw error;
                }

                // Wait before retrying
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw lastError;
    }

    /**
     * Default function to determine if error should be retried
     * @param {Error} error - Error to check
     * @returns {boolean} Whether to retry
     */
    defaultShouldRetry(error) {
        // Retry network errors and 5xx server errors
        return error instanceof NetworkError ||
               (error.status && error.status >= 500);
    }
}

// Create default instances
export const errorHandler = new ErrorHandler();
export const globalErrorBoundary = new GlobalErrorBoundary();
export const retryManager = new RetryManager();

// Load error queue on initialization
errorHandler.loadQueue();

// Export default object
export default {
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
};