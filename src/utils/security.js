/**
 * Security utilities for أنت صاحب المنصة
 * Contains security-related functions and validations
 */

/**
 * Content Security Policy nonce generator
 * @returns {string} Generated nonce
 */
export function generateCSPNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

/**
 * Validate and sanitize user input
 * @param {string} input - User input to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateInput(input, options = {}) {
    const {
        minLength = 0,
        maxLength = 1000,
        allowedChars = null,
        required = false,
        type = 'text'
    } = options;

    const result = {
        isValid: true,
        errors: [],
        sanitized: input
    };

    // Check if required
    if (required && (!input || input.trim().length === 0)) {
        result.isValid = false;
        result.errors.push('هذا الحقل مطلوب');
    }

    // Check length
    if (input && input.length < minLength) {
        result.isValid = false;
        result.errors.push(`يجب أن يكون الطول ${minLength} أحرف على الأقل`);
    }

    if (input && input.length > maxLength) {
        result.isValid = false;
        result.errors.push(`يجب أن لا يزيد الطول عن ${maxLength} حرف`);
    }

    // Type-specific validation
    switch (type) {
        case 'email':
            if (input && !isValidEmail(input)) {
                result.isValid = false;
                result.errors.push('يرجى إدخال بريد إلكتروني صحيح');
            }
            break;

        case 'phone':
            if (input && !isValidPhone(input)) {
                result.isValid = false;
                result.errors.push('يرجى إدخال رقم هاتف صحيح');
            }
            break;

        case 'url':
            if (input && !isValidUrl(input)) {
                result.isValid = false;
                result.errors.push('يرجى إدخال رابط صحيح');
            }
            break;
    }

    // Character validation
    if (allowedChars && input) {
        const invalidChars = input.split('').filter(char => !allowedChars.includes(char));
        if (invalidChars.length > 0) {
            result.isValid = false;
            result.errors.push('يحتوي على أحرف غير مسموحة');
        }
    }

    // Basic sanitization
    if (input) {
        result.sanitized = input
            .trim()
            .replace(/[<>]/g, '') // Remove HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: URLs
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .substring(0, maxLength); // Limit length
    }

    return result;
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Validation result
 */
export function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Validation result
 */
export function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
        return false;
    }
}

/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} Generated token
 */
export function generateSecureToken(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash string using Web Crypto API
 * @param {string} message - Message to hash
 * @returns {Promise<string>} Hashed message
 */
export async function hashString(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Rate limiting utility
 * @param {string} key - Rate limit key
 * @param {number} limit - Request limit
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} Whether request is allowed
 */
export function checkRateLimit(key, limit = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests for this key
    const requests = JSON.parse(localStorage.getItem(`ratelimit_${key}`) || '[]');

    // Filter out old requests
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= limit) {
        return false;
    }

    // Add current request
    recentRequests.push(now);
    localStorage.setItem(`ratelimit_${key}`, JSON.stringify(recentRequests));

    return true;
}

/**
 * CSRF protection
 */
export class CSRFProtection {
    constructor() {
        this.token = this.generateToken();
        this.storeToken();
    }

    generateToken() {
        return generateSecureToken(32);
    }

    storeToken() {
        sessionStorage.setItem('csrf_token', this.token);
    }

    getToken() {
        return sessionStorage.getItem('csrf_token') || this.token;
    }

    validateToken(token) {
        return this.getToken() === token;
    }

    getCSRFInput() {
        return `<input type="hidden" name="csrf_token" value="${this.getToken()}">`;
    }

    validateRequest(formData) {
        const token = formData.get('csrf_token');
        return this.validateToken(token);
    }
}

/**
 * File upload validation
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateFile(file, options = {}) {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
        allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg']
    } = options;

    const result = {
        isValid: true,
        errors: []
    };

    // Check file size
    if (file.size > maxSize) {
        result.isValid = false;
        result.errors.push(`حجم الملف كبير جداً. الحد الأقصى ${Math.round(maxSize / 1024 / 1024)} ميجابايت`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        result.isValid = false;
        result.errors.push('نوع الملف غير مدعوم');
    }

    // Check file extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
        result.isValid = false;
        result.errors.push('امتداد الملف غير مدعوم');
    }

    // Check for malicious filenames
    if (/[<>:*?"|]/.test(file.name)) {
        result.isValid = false;
        result.errors.push('اسم الملف يحتوي على أحرف غير مسموحة');
    }

    return result;
}

/**
 * SQL injection prevention
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function preventSQLInjection(input) {
    if (typeof input !== 'string') {
        return input;
    }

    const dangerousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
        /('|(\\')|("|\\")|(;))/g,
        /(--|#|\/\*|\*\/)/g
    ];

    let sanitized = input;
    dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });

    return sanitized.trim();
}

/**
 * XSS attack prevention
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function preventXSS(input) {
    if (typeof input !== 'string') {
        return input;
    }

    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^>]*>/gi,
        /<object\b[^>]*>/gi,
        /<embed\b[^>]*>/gi,
        /<form\b[^>]*>/gi,
        /<input\b[^>]*>/gi,
        /<meta\b[^>]*>/gi
    ];

    let sanitized = input;
    xssPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
}

/**
 * Session management utilities
 */
export const sessionManager = {
    set: (key, value, expiryMinutes = 60) => {
        const item = {
            value: value,
            expiry: Date.now() + (expiryMinutes * 60 * 1000)
        };
        sessionStorage.setItem(key, JSON.stringify(item));
    },

    get: (key) => {
        const item = sessionStorage.getItem(key);
        if (!item) return null;

        try {
            const parsed = JSON.parse(item);
            if (Date.now() > parsed.expiry) {
                sessionStorage.removeItem(key);
                return null;
            }
            return parsed.value;
        } catch {
            return null;
        }
    },

    remove: (key) => {
        sessionStorage.removeItem(key);
    },

    clear: () => {
        sessionStorage.clear();
    }
};

/**
 * Cookie utilities with security options
 */
export const cookieManager = {
    set: (name, value, options = {}) => {
        const {
            expires = 60, // minutes
            path = '/',
            domain = null,
            secure = true,
            httpOnly = false,
            sameSite = 'strict'
        } = options;

        let cookieString = `${name}=${encodeURIComponent(value)}`;

        if (expires) {
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (expires * 60 * 1000));
            cookieString += `; expires=${expiryDate.toUTCString()}`;
        }

        cookieString += `; path=${path}`;

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        if (secure) {
            cookieString += '; secure';
        }

        if (httpOnly) {
            cookieString += '; httponly';
        }

        cookieString += `; samesite=${sameSite}`;

        document.cookie = cookieString;
    },

    get: (name) => {
        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }

        return null;
    },

    remove: (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

// Export security utilities
export default {
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
    cookieManager
};