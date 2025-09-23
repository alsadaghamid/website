/**
 * Constants file for أنت صاحب المنصة
 * Contains all application constants
 */

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

// Error Codes
export const ERROR_CODES = {
    // Authentication Errors
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    USER_INACTIVE: 'USER_INACTIVE',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',

    // Validation Errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    REQUIRED_FIELD: 'REQUIRED_FIELD',
    INVALID_FORMAT: 'INVALID_FORMAT',
    INVALID_LENGTH: 'INVALID_LENGTH',
    DUPLICATE_VALUE: 'DUPLICATE_VALUE',

    // Content Errors
    CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
    CONTENT_ACCESS_DENIED: 'CONTENT_ACCESS_DENIED',
    CONTENT_ALREADY_EXISTS: 'CONTENT_ALREADY_EXISTS',
    CONTENT_INVALID_CATEGORY: 'CONTENT_INVALID_CATEGORY',

    // File Errors
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',
    FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',

    // Network Errors
    NETWORK_ERROR: 'NETWORK_ERROR',
    CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
    SERVER_ERROR: 'SERVER_ERROR',

    // Permission Errors
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    ADMIN_ACCESS_REQUIRED: 'ADMIN_ACCESS_REQUIRED',

    // Rate Limiting
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

    // Generic Errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user',
    GUEST: 'guest'
};

// Content Categories
export const CONTENT_CATEGORIES = {
    EDUCATION: 'تعليم',
    MOTIVATION: 'تحفيز',
    LEADERSHIP: 'قيادة',
    DEVELOPMENT: 'تنمية',
    COMMUNITY: 'مجتمع',
    BUSINESS: 'أعمال',
    TECHNOLOGY: 'تقنية',
    HEALTH: 'صحة',
    SPORTS: 'رياضة',
    ARTS: 'فنون',
    LITERATURE: 'أدب',
    SCIENCE: 'علم',
    RELIGION: 'دين',
    POLITICS: 'سياسة',
    ENTERTAINMENT: 'ترفيه',
    TRAVEL: 'سفر',
    FOOD: 'طعام',
    FASHION: 'أزياء',
    OTHER: 'أخرى'
};

// Content Status
export const CONTENT_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
    DELETED: 'deleted',
    PENDING_REVIEW: 'pending_review'
};

// Content Visibility
export const CONTENT_VISIBILITY = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    COMMUNITY: 'community',
    FRIENDS: 'friends'
};

// User Status
export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    BANNED: 'banned',
    PENDING_VERIFICATION: 'pending_verification'
};

// Notification Types
export const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    LIKE: 'like',
    COMMENT: 'comment',
    SHARE: 'share',
    FOLLOW: 'follow',
    MENTION: 'mention',
    SYSTEM: 'system'
};

// Theme Options
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
};

// Languages
export const LANGUAGES = {
    ARABIC: 'ar',
    ENGLISH: 'en'
};

// Direction
export const DIRECTIONS = {
    RTL: 'rtl',
    LTR: 'ltr'
};

// Device Types
export const DEVICE_TYPES = {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop'
};

// File Types
export const FILE_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: 'document',
    ARCHIVE: 'archive',
    OTHER: 'other'
};

// Image Formats
export const IMAGE_FORMATS = {
    JPEG: 'jpeg',
    JPG: 'jpg',
    PNG: 'png',
    GIF: 'gif',
    SVG: 'svg',
    WEBP: 'webp'
};

// Video Formats
export const VIDEO_FORMATS = {
    MP4: 'mp4',
    AVI: 'avi',
    MOV: 'mov',
    WMV: 'wmv',
    FLV: 'flv',
    WEBM: 'webm'
};

// Audio Formats
export const AUDIO_FORMATS = {
    MP3: 'mp3',
    WAV: 'wav',
    OGG: 'ogg',
    AAC: 'aac',
    M4A: 'm4a'
};

// Document Formats
export const DOCUMENT_FORMATS = {
    PDF: 'pdf',
    DOC: 'doc',
    DOCX: 'docx',
    XLS: 'xls',
    XLSX: 'xlsx',
    PPT: 'ppt',
    PPTX: 'pptx',
    TXT: 'txt'
};

// Sort Options
export const SORT_OPTIONS = {
    NEWEST: 'newest',
    OLDEST: 'oldest',
    MOST_LIKED: 'most_liked',
    MOST_COMMENTED: 'most_commented',
    MOST_SHARED: 'most_shared',
    TRENDING: 'trending',
    ALPHABETICAL: 'alphabetical'
};

// Sort Directions
export const SORT_DIRECTIONS = {
    ASC: 'asc',
    DESC: 'desc'
};

// Time Periods
export const TIME_PERIODS = {
    TODAY: 'today',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
    ALL_TIME: 'all_time'
};

// Pagination
export const PAGINATION_DEFAULTS = {
    PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE: 1
};

// Search
export const SEARCH_DEFAULTS = {
    MIN_QUERY_LENGTH: 2,
    MAX_QUERY_LENGTH: 100,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
};

// Cache Keys
export const CACHE_KEYS = {
    USER_PROFILE: 'user_profile',
    USER_PREFERENCES: 'user_preferences',
    CONTENT_LIST: 'content_list',
    CATEGORIES: 'categories',
    TAGS: 'tags',
    SEARCH_RESULTS: 'search_results'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    THEME: 'theme',
    LANGUAGE: 'language',
    PREFERENCES: 'preferences',
    OFFLINE_QUEUE: 'offline_queue',
    ERROR_QUEUE: 'error_queue'
};

// Session Storage Keys
export const SESSION_KEYS = {
    CURRENT_USER: 'current_user',
    CSRF_TOKEN: 'csrf_token',
    FORM_DATA: 'form_data',
    TEMP_DATA: 'temp_data'
};

// Cookie Keys
export const COOKIE_KEYS = {
    SESSION_ID: 'session_id',
    PREFERENCES: 'preferences',
    TRACKING: 'tracking'
};

// Form Validation Patterns
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+966|0)?[5][0-9]{8}$/,
    USERNAME: /^[a-zA-Z0-9_\u0600-\u06FF]{3,30}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    ARABIC_TEXT: /^[\u0600-\u06FF\s\d\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u0080-\u009F.,،؛؟!؟\n\r\t]+$/,
    ARABIC_NAME: /^[\u0600-\u06FF\s\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u0080-\u009F]{2,50}$/
};

// Animation Durations
export const ANIMATION_DURATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    SLOWER: 800
};

// Z-Index Values
export const Z_INDEX = {
    DROPDOWN: 1000,
    MODAL: 2000,
    NOTIFICATION: 3000,
    TOOLTIP: 4000,
    OVERLAY: 5000
};

// Breakpoints
export const BREAKPOINTS = {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE_DESKTOP: 1200,
    EXTRA_LARGE: 1400
};

// Colors (for reference)
export const COLORS = {
    PRIMARY: '#3b82f6',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#06b6d4',
    LIGHT: '#f8fafc',
    DARK: '#1e293b',
    WHITE: '#ffffff',
    BLACK: '#000000',
    GRAY_50: '#f9fafb',
    GRAY_100: '#f3f4f6',
    GRAY_200: '#e5e7eb',
    GRAY_300: '#d1d5db',
    GRAY_400: '#9ca3af',
    GRAY_500: '#6b7280',
    GRAY_600: '#4b5563',
    GRAY_700: '#374151',
    GRAY_800: '#1f2937',
    GRAY_900: '#111827'
};

// Font Sizes
export const FONT_SIZES = {
    XS: '0.75rem',
    SM: '0.875rem',
    BASE: '1rem',
    LG: '1.125rem',
    XL: '1.25rem',
    '2XL': '1.5rem',
    '3XL': '1.875rem',
    '4XL': '2.25rem',
    '5XL': '3rem'
};

// Font Weights
export const FONT_WEIGHTS = {
    THIN: '100',
    LIGHT: '300',
    NORMAL: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
    EXTRABOLD: '800',
    BLACK: '900'
};

// Spacing
export const SPACING = {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem'
};

// Border Radius
export const BORDER_RADIUS = {
    NONE: '0',
    SM: '0.125rem',
    DEFAULT: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    '2XL': '1rem',
    '3XL': '1.5rem',
    FULL: '9999px'
};

// Shadows
export const SHADOWS = {
    NONE: 'none',
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

// Transitions
export const TRANSITIONS = {
    FAST: '150ms ease-in-out',
    NORMAL: '300ms ease-in-out',
    SLOW: '500ms ease-in-out'
};

// API Endpoints (relative paths)
export const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_PHONE: '/auth/verify-phone',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',

    // Users
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    USER_CONTENT: '/user/content',
    USER_ACTIVITY: '/user/activity',

    // Content
    CONTENT: '/content',
    CONTENT_BY_ID: '/content/:id',
    CONTENT_LIKE: '/content/:id/like',
    CONTENT_BOOKMARK: '/content/:id/bookmark',
    CONTENT_SHARE: '/content/:id/share',

    // Categories and Tags
    CATEGORIES: '/categories',
    TAGS: '/tags',

    // Search
    SEARCH: '/search',
    SEARCH_USERS: '/search/users',

    // Admin
    ADMIN_USERS: '/admin/users',
    ADMIN_CONTENT: '/admin/content',
    ADMIN_ANALYTICS: '/admin/analytics',

    // Upload
    UPLOAD: '/upload',
    UPLOAD_AVATAR: '/upload/avatar',
    UPLOAD_CONTENT: '/upload/content'
};

// Event Names
export const EVENTS = {
    // User Events
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_REGISTER: 'user:register',
    USER_UPDATE: 'user:update',

    // Content Events
    CONTENT_CREATE: 'content:create',
    CONTENT_UPDATE: 'content:update',
    CONTENT_DELETE: 'content:delete',
    CONTENT_LIKE: 'content:like',
    CONTENT_SHARE: 'content:share',

    // UI Events
    THEME_CHANGE: 'theme:change',
    LANGUAGE_CHANGE: 'language:change',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',

    // Network Events
    NETWORK_ONLINE: 'network:online',
    NETWORK_OFFLINE: 'network:offline',
    API_ERROR: 'api:error'
};

// Default Values
export const DEFAULTS = {
    AVATAR: '/images/default-avatar.png',
    COVER: '/images/default-cover.png',
    LOGO: '/images/logo.png',
    FAVICON: '/favicon.ico',
    LOADING_TEXT: 'جاري التحميل...',
    ERROR_TEXT: 'حدث خطأ غير متوقع',
    RETRY_TEXT: 'إعادة المحاولة',
    CANCEL_TEXT: 'إلغاء',
    CONFIRM_TEXT: 'تأكيد',
    SAVE_TEXT: 'حفظ',
    DELETE_TEXT: 'حذف',
    EDIT_TEXT: 'تعديل',
    VIEW_TEXT: 'عرض',
    SHARE_TEXT: 'مشاركة',
    LIKE_TEXT: 'إعجاب',
    COMMENT_TEXT: 'تعليق'
};

// Export all constants as default
export default {
    HTTP_STATUS,
    ERROR_CODES,
    USER_ROLES,
    CONTENT_CATEGORIES,
    CONTENT_STATUS,
    CONTENT_VISIBILITY,
    USER_STATUS,
    NOTIFICATION_TYPES,
    THEMES,
    LANGUAGES,
    DIRECTIONS,
    DEVICE_TYPES,
    FILE_TYPES,
    IMAGE_FORMATS,
    VIDEO_FORMATS,
    AUDIO_FORMATS,
    DOCUMENT_FORMATS,
    SORT_OPTIONS,
    SORT_DIRECTIONS,
    TIME_PERIODS,
    PAGINATION_DEFAULTS,
    SEARCH_DEFAULTS,
    CACHE_KEYS,
    STORAGE_KEYS,
    SESSION_KEYS,
    COOKIE_KEYS,
    VALIDATION_PATTERNS,
    ANIMATION_DURATIONS,
    Z_INDEX,
    BREAKPOINTS,
    COLORS,
    FONT_SIZES,
    FONT_WEIGHTS,
    SPACING,
    BORDER_RADIUS,
    SHADOWS,
    TRANSITIONS,
    API_ENDPOINTS,
    EVENTS,
    DEFAULTS
};