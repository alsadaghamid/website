/**
 * Configuration file for أنت صاحب المنصة
 * Central configuration management
 */

const CONFIG = {
    // App Information
    APP_NAME: 'أنت صاحب المنصة',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'منصة تفاعلية للمحتوى والتواصل',

    // API Configuration
    API_BASE_URL: '/api',
    API_TIMEOUT: 30000,
    API_RETRIES: 3,

    // Authentication
    AUTH_TOKEN_KEY: 'auth_token',
    AUTH_REFRESH_TOKEN_KEY: 'refresh_token',
    AUTH_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
    AUTH_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry

    // Storage Keys
    STORAGE_PREFIX: 'platform_',
    USER_DATA_KEY: 'user_profile',
    USER_PREFERENCES_KEY: 'user_preferences',
    THEME_KEY: 'theme',
    LANGUAGE_KEY: 'language',

    // UI Configuration
    DEFAULT_THEME: 'light',
    SUPPORTED_THEMES: ['light', 'dark', 'auto'],
    DEFAULT_LANGUAGE: 'ar',
    SUPPORTED_LANGUAGES: ['ar', 'en'],

    // Validation Rules
    VALIDATION: {
        USERNAME: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 30,
            PATTERN: /^[a-zA-Z0-9_\u0600-\u06FF]+$/
        },
        PASSWORD: {
            MIN_LENGTH: 8,
            MAX_LENGTH: 128,
            REQUIRE_UPPERCASE: true,
            REQUIRE_LOWERCASE: true,
            REQUIRE_NUMBER: true,
            REQUIRE_SPECIAL: true
        },
        EMAIL: {
            PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        PHONE: {
            PATTERN: /^(\+966|0)?[5][0-9]{8}$/,
            MIN_LENGTH: 10,
            MAX_LENGTH: 15
        },
        CONTENT: {
            TITLE_MIN_LENGTH: 5,
            TITLE_MAX_LENGTH: 100,
            CONTENT_MIN_LENGTH: 50,
            CONTENT_MAX_LENGTH: 10000
        }
    },

    // File Upload
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
        ALLOWED_IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
        MAX_IMAGES_PER_CONTENT: 10
    },

    // Pagination
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        MAX_PAGE_SIZE: 100,
        DEFAULT_PAGE: 1
    },

    // Search
    SEARCH: {
        MIN_QUERY_LENGTH: 2,
        MAX_QUERY_LENGTH: 100,
        DEBOUNCE_DELAY: 300,
        MAX_RESULTS: 20
    },

    // Rate Limiting
    RATE_LIMITS: {
        API_REQUESTS: 100, // requests per window
        WINDOW_MS: 60000, // 1 minute
        LOGIN_ATTEMPTS: 5,
        PASSWORD_RESET_REQUESTS: 3
    },

    // Cache Configuration
    CACHE: {
        DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
        USER_DATA_TTL: 10 * 60 * 1000, // 10 minutes
        CONTENT_TTL: 15 * 60 * 1000, // 15 minutes
        MAX_CACHE_SIZE: 50 * 1024 * 1024 // 50MB
    },

    // Error Handling
    ERROR_REPORTING: {
        ENABLED: true,
        REPORT_URL: '/api/errors',
        SAMPLE_RATE: 1.0, // 100% of errors
        MAX_QUEUE_SIZE: 50
    },

    // Features Flags
    FEATURES: {
        DARK_MODE: true,
        SOCIAL_LOGIN: false,
        EMAIL_NOTIFICATIONS: true,
        PUSH_NOTIFICATIONS: false,
        CONTENT_SHARING: true,
        USER_PROFILES: true,
        SEARCH_FUNCTIONALITY: true,
        BOOKMARKS: true,
        LIKES: true,
        COMMENTS: false,
        ADMIN_PANEL: false,
        ANALYTICS: false,
        OFFLINE_MODE: true,
        PWA: true
    },

    // Social Media Links
    SOCIAL_LINKS: {
        TWITTER: 'https://twitter.com/platform',
        FACEBOOK: 'https://facebook.com/platform',
        INSTAGRAM: 'https://instagram.com/platform',
        LINKEDIN: 'https://linkedin.com/company/platform',
        YOUTUBE: 'https://youtube.com/platform'
    },

    // Contact Information
    CONTACT: {
        EMAIL: 'contact@platform.com',
        PHONE: '+966501234567',
        ADDRESS: 'الرياض، المملكة العربية السعودية'
    },

    // SEO Configuration
    SEO: {
        DEFAULT_TITLE: 'أنت صاحب المنصة - منصة تفاعلية للمحتوى والتواصل',
        DEFAULT_DESCRIPTION: 'انضم إلى مجتمع أنت صاحب المنصة وشارك محتواك مع الآخرين',
        DEFAULT_KEYWORDS: 'منصة, محتوى, تواصل, تفاعل, عربي',
        DEFAULT_IMAGE: '/images/default-og.png',
        SITE_URL: 'https://platform.com',
        TWITTER_HANDLE: '@platform'
    },

    // Performance Configuration
    PERFORMANCE: {
        LAZY_LOAD_THRESHOLD: 100, // pixels
        DEBOUNCE_DELAY: 300,
        THROTTLE_LIMIT: 100,
        MAX_CONCURRENT_REQUESTS: 6,
        REQUEST_TIMEOUT: 30000
    },

    // Security Settings
    SECURITY: {
        CSRF_ENABLED: true,
        XSS_PROTECTION: true,
        SQL_INJECTION_PROTECTION: true,
        RATE_LIMITING: true,
        INPUT_SANITIZATION: true,
        SECURE_HEADERS: true,
        HSTS_ENABLED: true,
        HSTS_MAX_AGE: 31536000 // 1 year
    },

    // Development Settings
    DEVELOPMENT: {
        DEBUG_MODE: true,
        LOG_LEVEL: 'debug',
        MOCK_API: false,
        ENABLE_DEVTOOLS: true
    },

    // Production Settings
    PRODUCTION: {
        DEBUG_MODE: false,
        LOG_LEVEL: 'error',
        MOCK_API: false,
        ENABLE_DEVTOOLS: false
    }
};

// Environment-specific configuration
const ENV_CONFIG = {
    development: {
        API_BASE_URL: 'http://localhost:8000/api',
        DEBUG_MODE: true,
        LOG_LEVEL: 'debug'
    },
    production: {
        API_BASE_URL: 'https://api.platform.com',
        DEBUG_MODE: false,
        LOG_LEVEL: 'error'
    },
    test: {
        API_BASE_URL: 'http://localhost:8000/api',
        DEBUG_MODE: true,
        LOG_LEVEL: 'debug',
        MOCK_API: true
    }
};

// Detect environment
const getEnvironment = () => {
    if (typeof window === 'undefined') return 'production';

    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
        return 'development';
    }

    if (hostname.includes('test') || hostname.includes('staging')) {
        return 'test';
    }

    return 'production';
};

// Merge environment-specific config
const currentEnv = getEnvironment();
const envSpecificConfig = ENV_CONFIG[currentEnv] || {};

// Create final configuration
const finalConfig = {
    ...CONFIG,
    ...envSpecificConfig,
    // Override with environment variables if available
    API_BASE_URL: import.meta.env?.VITE_API_BASE_URL || finalConfig.API_BASE_URL,
    DEBUG_MODE: import.meta.env?.VITE_DEBUG_MODE || finalConfig.DEBUG_MODE,
    LOG_LEVEL: import.meta.env?.VITE_LOG_LEVEL || finalConfig.LOG_LEVEL
};

// Feature detection
finalConfig.FEATURES = {
    ...finalConfig.FEATURES,
    // Detect browser features
    WEB_NOTIFICATIONS: 'Notification' in window,
    SERVICE_WORKER: 'serviceWorker' in navigator,
    LOCAL_STORAGE: 'localStorage' in window,
    SESSION_STORAGE: 'sessionStorage' in window,
    GEOLOCATION: 'geolocation' in navigator,
    WEB_SHARE: 'share' in navigator,
    CLIPBOARD_API: 'clipboard' in navigator,
    INTERSECTION_OBSERVER: 'IntersectionObserver' in window,
    WEB_SOCKETS: 'WebSocket' in window
};

// Export configuration
export default finalConfig;

// Export individual sections for convenience
export const {
    APP_NAME,
    APP_VERSION,
    APP_DESCRIPTION,
    API_BASE_URL,
    API_TIMEOUT,
    API_RETRIES,
    AUTH_TOKEN_KEY,
    AUTH_REFRESH_TOKEN_KEY,
    AUTH_TOKEN_EXPIRY,
    AUTH_REFRESH_THRESHOLD,
    STORAGE_PREFIX,
    USER_DATA_KEY,
    USER_PREFERENCES_KEY,
    THEME_KEY,
    LANGUAGE_KEY,
    DEFAULT_THEME,
    SUPPORTED_THEMES,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    VALIDATION,
    UPLOAD,
    PAGINATION,
    SEARCH,
    RATE_LIMITS,
    CACHE,
    ERROR_REPORTING,
    FEATURES,
    SOCIAL_LINKS,
    CONTACT,
    SEO,
    PERFORMANCE,
    SECURITY,
    DEVELOPMENT,
    PRODUCTION
} = finalConfig;

// Utility functions
export const configUtils = {
    /**
     * Check if a feature is enabled
     * @param {string} feature - Feature name
     * @returns {boolean} Whether feature is enabled
     */
    isFeatureEnabled(feature) {
        return finalConfig.FEATURES[feature] === true;
    },

    /**
     * Get validation rule
     * @param {string} rule - Rule name
     * @returns {Object} Validation rule
     */
    getValidationRule(rule) {
        return finalConfig.VALIDATION[rule];
    },

    /**
     * Get upload configuration
     * @param {string} key - Configuration key
     * @returns {any} Upload configuration value
     */
    getUploadConfig(key) {
        return finalConfig.UPLOAD[key];
    },

    /**
     * Get pagination configuration
     * @param {string} key - Configuration key
     * @returns {any} Pagination configuration value
     */
    getPaginationConfig(key) {
        return finalConfig.PAGINATION[key];
    },

    /**
     * Get cache configuration
     * @param {string} key - Configuration key
     * @returns {any} Cache configuration value
     */
    getCacheConfig(key) {
        return finalConfig.CACHE[key];
    },

    /**
     * Get rate limit configuration
     * @param {string} key - Configuration key
     * @returns {any} Rate limit configuration value
     */
    getRateLimitConfig(key) {
        return finalConfig.RATE_LIMITS[key];
    },

    /**
     * Get current environment
     * @returns {string} Current environment
     */
    getEnvironment,

    /**
     * Check if running in development
     * @returns {boolean} Whether in development
     */
    isDevelopment() {
        return getEnvironment() === 'development';
    },

    /**
     * Check if running in production
     * @returns {boolean} Whether in production
     */
    isProduction() {
        return getEnvironment() === 'production';
    },

    /**
     * Check if running in test
     * @returns {boolean} Whether in test
     */
    isTest() {
        return getEnvironment() === 'test';
    },

    /**
     * Get API endpoint URL
     * @param {string} endpoint - API endpoint path
     * @returns {string} Full API URL
     */
    getAPIUrl(endpoint) {
        return `${finalConfig.API_BASE_URL}${endpoint}`;
    },

    /**
     * Get storage key with prefix
     * @param {string} key - Storage key
     * @returns {string} Prefixed storage key
     */
    getStorageKey(key) {
        return `${finalConfig.STORAGE_PREFIX}${key}`;
    },

    /**
     * Get supported themes
     * @returns {Array} Array of supported themes
     */
    getSupportedThemes() {
        return [...finalConfig.SUPPORTED_THEMES];
    },

    /**
     * Get supported languages
     * @returns {Array} Array of supported languages
     */
    getSupportedLanguages() {
        return [...finalConfig.SUPPORTED_LANGUAGES];
    }
};

// Make config available globally in development
if (typeof window !== 'undefined' && configUtils.isDevelopment()) {
    window.PlatformConfig = finalConfig;
    window.configUtils = configUtils;
}