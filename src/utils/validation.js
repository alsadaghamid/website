/**
 * Validation utilities for أنت صاحب المنصة
 * Contains form validation and data validation functions
 */

/**
 * Arabic text validation patterns
 */
export const ARABIC_PATTERNS = {
    // Arabic letters, numbers, and common punctuation
    ARABIC_TEXT: /^[\u0600-\u06FF\s\d\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u0080-\u009F]+$/,

    // Arabic name (allows spaces and common Arabic punctuation)
    ARABIC_NAME: /^[\u0600-\u06FF\s\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u0080-\u009F]{2,50}$/,

    // Arabic text with basic punctuation
    ARABIC_CONTENT: /^[\u0600-\u06FF\s\d\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u0080-\u009F.,،؛؟!؟\n\r\t]+$/,

    // Strong Arabic letters only (no numbers or punctuation)
    ARABIC_LETTERS_ONLY: /^[\u0600-\u06FF\s]+$/,

    // Arabic phone number pattern
    ARABIC_PHONE: /^(\+966|0)?[5][0-9]{8}$/,

    // Arabic address pattern
    ARABIC_ADDRESS: /^[\u0600-\u06FF\s\d\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u0080-\u009F,،\-.]{10,200}$/
};

/**
 * Validation rules for different form fields
 */
export const VALIDATION_RULES = {
    username: {
        required: true,
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_\u0600-\u06FF]+$/,
        message: 'اسم المستخدم يجب أن يحتوي على 3-30 حرف من الحروف الإنجليزية أو العربية أو الأرقام'
    },

    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'يرجى إدخال بريد إلكتروني صحيح'
    },

    password: {
        required: true,
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        message: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل مع حرف كبير وحرف صغير ورقم ورمز خاص'
    },

    phone: {
        required: true,
        pattern: ARABIC_PATTERNS.ARABIC_PHONE,
        message: 'يرجى إدخال رقم هاتف سعودي صحيح'
    },

    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: ARABIC_PATTERNS.ARABIC_NAME,
        message: 'الاسم يجب أن يحتوي على 2-50 حرف عربي'
    },

    title: {
        required: true,
        minLength: 5,
        maxLength: 100,
        pattern: ARABIC_PATTERNS.ARABIC_CONTENT,
        message: 'العنوان يجب أن يحتوي على 5-100 حرف'
    },

    content: {
        required: true,
        minLength: 50,
        maxLength: 10000,
        pattern: ARABIC_PATTERNS.ARABIC_CONTENT,
        message: 'المحتوى يجب أن يحتوي على 50-10000 حرف'
    },

    description: {
        required: false,
        minLength: 10,
        maxLength: 500,
        pattern: ARABIC_PATTERNS.ARABIC_CONTENT,
        message: 'الوصف يجب أن يحتوي على 10-500 حرف'
    },

    category: {
        required: true,
        options: ['تعليم', 'تحفيز', 'قيادة', 'تنمية', 'مجتمع', 'أعمال', 'تقنية', 'صحة'],
        message: 'يرجى اختيار فئة صحيحة'
    },

    tags: {
        required: false,
        maxLength: 100,
        pattern: /^[\u0600-\u06FF\s,،]+$/,
        message: 'العلامات يجب أن تكون كلمات عربية مفصولة بفواصل'
    }
};

/**
 * Validate a single field against its rules
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @param {Object} customRules - Custom validation rules (optional)
 * @returns {Object} Validation result
 */
export function validateField(fieldName, value, customRules = {}) {
    const rules = { ...VALIDATION_RULES[fieldName], ...customRules };

    const result = {
        isValid: true,
        errors: [],
        warnings: []
    };

    // Check required
    if (rules.required && (value === null || value === undefined || value === '')) {
        result.isValid = false;
        result.errors.push(rules.message || `${fieldName} مطلوب`);
        return result;
    }

    // Skip other validations if not required and empty
    if (!rules.required && (value === null || value === undefined || value === '')) {
        return result;
    }

    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
        result.isValid = false;
        result.errors.push(rules.message || `يجب أن يكون ${fieldName} ${rules.minLength} أحرف على الأقل`);
    }

    // Check maximum length
    if (rules.maxLength && value.length > rules.maxLength) {
        result.isValid = false;
        result.errors.push(rules.message || `يجب أن لا يزيد ${fieldName} عن ${rules.maxLength} حرف`);
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        result.isValid = false;
        result.errors.push(rules.message || `${fieldName} غير صحيح`);
    }

    // Check options
    if (rules.options && !rules.options.includes(value)) {
        result.isValid = false;
        result.errors.push(rules.message || `قيمة ${fieldName} غير صحيحة`);
    }

    // Check for suspicious content
    if (value && typeof value === 'string') {
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i
        ];

        const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(value));
        if (hasSuspiciousContent) {
            result.isValid = false;
            result.errors.push('المحتوى يحتوي على عناصر غير مسموحة');
        }
    }

    // Warnings for common issues
    if (value && typeof value === 'string') {
        // Check for very long words (might be spam)
        const words = value.split(/\s+/);
        const longWords = words.filter(word => word.length > 30);
        if (longWords.length > 0) {
            result.warnings.push('يحتوي على كلمات طويلة جداً قد تكون غير مرغوبة');
        }

        // Check for excessive repetition
        const repeatedChars = /(.)\1{5,}/.test(value);
        if (repeatedChars) {
            result.warnings.push('يحتوي على تكرار مفرط للأحرف');
        }

        // Check for mixed languages (Arabic with English)
        const hasArabic = /[\u0600-\u06FF]/.test(value);
        const hasEnglish = /[a-zA-Z]/.test(value);
        if (hasArabic && hasEnglish && value.length > 20) {
            result.warnings.push('يحتوي على مزيج من العربية والإنجليزية');
        }
    }

    return result;
}

/**
 * Validate an entire form
 * @param {Object} formData - Form data object
 * @param {Array} fields - Array of field names to validate
 * @returns {Object} Validation result
 */
export function validateForm(formData, fields) {
    const result = {
        isValid: true,
        errors: {},
        warnings: {},
        firstError: null
    };

    fields.forEach(fieldName => {
        const fieldResult = validateField(fieldName, formData[fieldName]);

        if (!fieldResult.isValid) {
            result.isValid = false;
            result.errors[fieldName] = fieldResult.errors;

            if (!result.firstError) {
                result.firstError = {
                    field: fieldName,
                    message: fieldResult.errors[0]
                };
            }
        }

        if (fieldResult.warnings.length > 0) {
            result.warnings[fieldName] = fieldResult.warnings;
        }
    });

    return result;
}

/**
 * Validate user registration data
 * @param {Object} userData - User registration data
 * @returns {Object} Validation result
 */
export function validateUserRegistration(userData) {
    const requiredFields = ['username', 'email', 'password', 'name', 'phone'];
    return validateForm(userData, requiredFields);
}

/**
 * Validate content creation data
 * @param {Object} contentData - Content creation data
 * @returns {Object} Validation result
 */
export function validateContentCreation(contentData) {
    const requiredFields = ['title', 'content', 'category'];
    return validateForm(contentData, requiredFields);
}

/**
 * Validate profile update data
 * @param {Object} profileData - Profile update data
 * @returns {Object} Validation result
 */
export function validateProfileUpdate(profileData) {
    const requiredFields = ['name'];
    return validateForm(profileData, requiredFields);
}

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @param {string} type - Type of input (text, html, url, etc.)
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input, type = 'text') {
    if (!input || typeof input !== 'string') {
        return '';
    }

    let sanitized = input.trim();

    // Basic sanitization
    sanitized = sanitized
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    // Type-specific sanitization
    switch (type) {
        case 'html':
            // Allow basic HTML tags for rich content
            sanitized = sanitized
                .replace(/<(\/?(b|i|u|strong|em|p|br|ul|ol|li|h[1-6]))>/g, '<$1>')
                .replace(/<\/(b|i|u|strong|em|p|br|ul|ol|li|h[1-6])>/g, '</$1>');
            break;

        case 'url':
            // Remove dangerous protocols
            sanitized = sanitized.replace(/javascript:|data:|vbscript:/gi, '');
            break;

        case 'email':
            // Email should not contain HTML
            sanitized = sanitized.replace(/[<>"']/g, '');
            break;

        case 'phone':
            // Keep only numbers, spaces, hyphens, and parentheses
            sanitized = sanitized.replace(/[^\d\s\-\(\)\+]/g, '');
            break;
    }

    return sanitized;
}

/**
 * Check if text contains Arabic characters
 * @param {string} text - Text to check
 * @returns {boolean} Whether text contains Arabic
 */
export function containsArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
}

/**
 * Check if text is primarily Arabic
 * @param {string} text - Text to check
 * @param {number} threshold - Minimum percentage of Arabic characters (default 70%)
 * @returns {boolean} Whether text is primarily Arabic
 */
export function isPrimarilyArabic(text, threshold = 0.7) {
    if (!text) return false;

    const arabicChars = text.match(/[\u0600-\u06FF]/g) || [];
    const totalChars = text.replace(/\s/g, '').length;

    return totalChars > 0 && (arabicChars.length / totalChars) >= threshold;
}

/**
 * Normalize Arabic text
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeArabicText(text) {
    if (!text) return '';

    return text
        // Normalize Arabic characters
        .replace(/ي/g, 'ي') // Normalize ya
        .replace(/ك/g, 'ك') // Normalize kaf
        .replace(/ة/g, 'ة') // Normalize ta marbuta
        // Remove extra spaces
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateFileUpload(file, options = {}) {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
        allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg']
    } = options;

    const result = {
        isValid: true,
        errors: []
    };

    // Check if file exists
    if (!file) {
        result.isValid = false;
        result.errors.push('يرجى اختيار ملف');
        return result;
    }

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

    // Check for suspicious filenames
    if (/[<>:*?"|]/.test(file.name)) {
        result.isValid = false;
        result.errors.push('اسم الملف يحتوي على أحرف غير مسموحة');
    }

    return result;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Password strength result
 */
export function validatePasswordStrength(password) {
    const result = {
        score: 0,
        feedback: [],
        isStrong: false
    };

    if (!password) {
        result.feedback.push('كلمة المرور مطلوبة');
        return result;
    }

    // Length check
    if (password.length >= 8) {
        result.score += 1;
    } else {
        result.feedback.push('يجب أن تكون 8 أحرف على الأقل');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        result.score += 1;
    } else {
        result.feedback.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        result.score += 1;
    } else {
        result.feedback.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
    }

    // Number check
    if (/\d/.test(password)) {
        result.score += 1;
    } else {
        result.feedback.push('يجب أن تحتوي على رقم واحد على الأقل');
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
        result.score += 1;
    } else {
        result.feedback.push('يجب أن تحتوي على رمز خاص واحد على الأقل (@$!%*?&)');
    }

    // Bonus points
    if (password.length >= 12) result.score += 1;
    if (/[^\w\s]/.test(password)) result.score += 1;

    result.isStrong = result.score >= 4;

    if (!result.isStrong) {
        result.feedback.unshift('كلمة المرور ضعيفة. ');
    }

    return result;
}

// Export default object
export default {
    ARABIC_PATTERNS,
    VALIDATION_RULES,
    validateField,
    validateForm,
    validateUserRegistration,
    validateContentCreation,
    validateProfileUpdate,
    sanitizeInput,
    containsArabic,
    isPrimarilyArabic,
    normalizeArabicText,
    validateFileUpload,
    validatePasswordStrength
};