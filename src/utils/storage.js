/**
 * Storage utilities for أنت صاحب المنصة
 * Contains data storage and management functions
 */

/**
 * Local Storage Manager with encryption and expiration
 */
export class StorageManager {
    constructor(prefix = 'platform_') {
        this.prefix = prefix;
        this.encryptionKey = this.getEncryptionKey();
    }

    /**
     * Get encryption key from session storage or generate new one
     * @returns {string} Encryption key
     */
    getEncryptionKey() {
        let key = sessionStorage.getItem('encryption_key');
        if (!key) {
            key = this.generateEncryptionKey();
            sessionStorage.setItem('encryption_key', key);
        }
        return key;
    }

    /**
     * Generate a random encryption key
     * @returns {string} Generated key
     */
    generateEncryptionKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Simple XOR encryption for basic data protection
     * @param {string} text - Text to encrypt
     * @param {string} key - Encryption key
     * @returns {string} Encrypted text
     */
    encrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    }

    /**
     * Simple XOR decryption
     * @param {string} encryptedText - Text to decrypt
     * @param {string} key - Encryption key
     * @returns {string} Decrypted text
     */
    decrypt(encryptedText, key) {
        const text = atob(encryptedText);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    /**
     * Set item with optional encryption and expiration
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @param {Object} options - Storage options
     */
    set(key, value, options = {}) {
        const {
            encrypt = false,
            expires = null,
            stringify = true
        } = options;

        const fullKey = this.prefix + key;
        let dataToStore = value;

        if (stringify) {
            dataToStore = JSON.stringify(value);
        }

        if (encrypt) {
            dataToStore = this.encrypt(dataToStore, this.encryptionKey);
        }

        const item = {
            value: dataToStore,
            timestamp: Date.now(),
            expires: expires ? Date.now() + expires : null
        };

        try {
            localStorage.setItem(fullKey, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    /**
     * Get item with automatic decryption and expiration check
     * @param {string} key - Storage key
     * @param {Object} options - Retrieval options
     * @returns {any} Retrieved value
     */
    get(key, options = {}) {
        const {
            decrypt = false,
            parse = true,
            defaultValue = null
    } = options;

        const fullKey = this.prefix + key;

        try {
            const item = localStorage.getItem(fullKey);
            if (!item) return defaultValue;

            const parsed = JSON.parse(item);

            // Check expiration
            if (parsed.expires && Date.now() > parsed.expires) {
                localStorage.removeItem(fullKey);
                return defaultValue;
            }

            let value = parsed.value;

            if (decrypt) {
                value = this.decrypt(value, this.encryptionKey);
            }

            if (parse) {
                value = JSON.parse(value);
            }

            return value;
        } catch (error) {
            console.error('Storage retrieval error:', error);
            return defaultValue;
        }
    }

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     */
    remove(key) {
        const fullKey = this.prefix + key;
        localStorage.removeItem(fullKey);
    }

    /**
     * Clear all items with current prefix
     */
    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    /**
     * Get all keys with current prefix
     * @returns {Array} Array of keys
     */
    keys() {
        const keys = Object.keys(localStorage);
        return keys.filter(key => key.startsWith(this.prefix))
                  .map(key => key.substring(this.prefix.length));
    }

    /**
     * Check if key exists
     * @param {string} key - Storage key
     * @returns {boolean} Whether key exists
     */
    has(key) {
        const fullKey = this.prefix + key;
        return localStorage.getItem(fullKey) !== null;
    }

    /**
     * Get storage size for current prefix
     * @returns {number} Size in bytes
     */
    size() {
        const keys = Object.keys(localStorage);
        let total = 0;

        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                const item = localStorage.getItem(key);
                total += item.length + key.length;
            }
        });

        return total;
    }
}

/**
 * Session Storage Manager
 */
export class SessionManager {
    constructor(prefix = 'session_') {
        this.prefix = prefix;
    }

    set(key, value, stringify = true) {
        const fullKey = this.prefix + key;
        const dataToStore = stringify ? JSON.stringify(value) : value;

        try {
            sessionStorage.setItem(fullKey, dataToStore);
            return true;
        } catch (error) {
            console.error('Session storage error:', error);
            return false;
        }
    }

    get(key, parse = true, defaultValue = null) {
        const fullKey = this.prefix + key;

        try {
            const item = sessionStorage.getItem(fullKey);
            if (!item) return defaultValue;

            return parse ? JSON.parse(item) : item;
        } catch (error) {
            console.error('Session retrieval error:', error);
            return defaultValue;
        }
    }

    remove(key) {
        const fullKey = this.prefix + key;
        sessionStorage.removeItem(fullKey);
    }

    clear() {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                sessionStorage.removeItem(key);
            }
        });
    }

    keys() {
        const keys = Object.keys(sessionStorage);
        return keys.filter(key => key.startsWith(this.prefix))
                  .map(key => key.substring(this.prefix.length));
    }

    has(key) {
        const fullKey = this.prefix + key;
        return sessionStorage.getItem(fullKey) !== null;
    }
}

/**
 * User Data Manager
 */
export class UserDataManager {
    constructor() {
        this.storage = new StorageManager('user_');
        this.session = new SessionManager('user_session_');
    }

    /**
     * Save user profile data
     * @param {Object} profile - User profile data
     */
    saveProfile(profile) {
        return this.storage.set('profile', profile, { encrypt: true });
    }

    /**
     * Get user profile data
     * @returns {Object} User profile
     */
    getProfile() {
        return this.storage.get('profile', { decrypt: true, defaultValue: {} });
    }

    /**
     * Save user preferences
     * @param {Object} preferences - User preferences
     */
    savePreferences(preferences) {
        return this.storage.set('preferences', preferences);
    }

    /**
     * Get user preferences
     * @returns {Object} User preferences
     */
    getPreferences() {
        return this.storage.get('preferences', { parse: true, defaultValue: {} });
    }

    /**
     * Save user session data
     * @param {Object} sessionData - Session data
     */
    saveSession(sessionData) {
        return this.session.set('current', sessionData);
    }

    /**
     * Get user session data
     * @returns {Object} Session data
     */
    getSession() {
        return this.session.get('current', { parse: true, defaultValue: null });
    }

    /**
     * Clear all user data
     */
    clearUserData() {
        this.storage.clear();
        this.session.clear();
    }

    /**
     * Check if user is logged in
     * @returns {boolean} Login status
     */
    isLoggedIn() {
        const session = this.getSession();
        return session && session.token && session.expires > Date.now();
    }

    /**
     * Save user activity
     * @param {string} activity - Activity description
     */
    saveActivity(activity) {
        const activities = this.getActivities();
        activities.push({
            activity,
            timestamp: Date.now()
        });

        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.splice(0, activities.length - 100);
        }

        return this.storage.set('activities', activities);
    }

    /**
     * Get user activities
     * @returns {Array} User activities
     */
    getActivities() {
        return this.storage.get('activities', { parse: true, defaultValue: [] });
    }
}

/**
 * Content Data Manager
 */
export class ContentDataManager {
    constructor() {
        this.storage = new StorageManager('content_');
    }

    /**
     * Save draft content
     * @param {string} id - Content ID
     * @param {Object} content - Content data
     */
    saveDraft(id, content) {
        return this.storage.set(`draft_${id}`, content, { expires: 24 * 60 * 60 * 1000 }); // 24 hours
    }

    /**
     * Get draft content
     * @param {string} id - Content ID
     * @returns {Object} Draft content
     */
    getDraft(id) {
        return this.storage.get(`draft_${id}`, { parse: true, defaultValue: null });
    }

    /**
     * Remove draft content
     * @param {string} id - Content ID
     */
    removeDraft(id) {
        this.storage.remove(`draft_${id}`);
    }

    /**
     * Save user bookmarks
     * @param {Array} bookmarks - Bookmarked content IDs
     */
    saveBookmarks(bookmarks) {
        return this.storage.set('bookmarks', bookmarks);
    }

    /**
     * Get user bookmarks
     * @returns {Array} Bookmarked content IDs
     */
    getBookmarks() {
        return this.storage.get('bookmarks', { parse: true, defaultValue: [] });
    }

    /**
     * Add bookmark
     * @param {string} contentId - Content ID to bookmark
     */
    addBookmark(contentId) {
        const bookmarks = this.getBookmarks();
        if (!bookmarks.includes(contentId)) {
            bookmarks.push(contentId);
            this.saveBookmarks(bookmarks);
        }
    }

    /**
     * Remove bookmark
     * @param {string} contentId - Content ID to remove from bookmarks
     */
    removeBookmark(contentId) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.indexOf(contentId);
        if (index > -1) {
            bookmarks.splice(index, 1);
            this.saveBookmarks(bookmarks);
        }
    }

    /**
     * Save user likes
     * @param {Array} likes - Liked content IDs
     */
    saveLikes(likes) {
        return this.storage.set('likes', likes);
    }

    /**
     * Get user likes
     * @returns {Array} Liked content IDs
     */
    getLikes() {
        return this.storage.get('likes', { parse: true, defaultValue: [] });
    }

    /**
     * Add like
     * @param {string} contentId - Content ID to like
     */
    addLike(contentId) {
        const likes = this.getLikes();
        if (!likes.includes(contentId)) {
            likes.push(contentId);
            this.saveLikes(likes);
        }
    }

    /**
     * Remove like
     * @param {string} contentId - Content ID to unlike
     */
    removeLike(contentId) {
        const likes = this.getLikes();
        const index = likes.indexOf(contentId);
        if (index > -1) {
            likes.splice(index, 1);
            this.saveLikes(likes);
        }
    }
}

/**
 * Cache Manager for API responses
 */
export class CacheManager {
    constructor() {
        this.storage = new StorageManager('cache_');
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Set cache item
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    set(key, data, ttl = this.defaultTTL) {
        const cacheData = {
            data,
            timestamp: Date.now(),
            ttl
        };
        return this.storage.set(key, cacheData);
    }

    /**
     * Get cache item
     * @param {string} key - Cache key
     * @returns {any} Cached data
     */
    get(key) {
        const cacheData = this.storage.get(key, { parse: true, defaultValue: null });

        if (!cacheData) return null;

        // Check if expired
        if (Date.now() - cacheData.timestamp > cacheData.ttl) {
            this.storage.remove(key);
            return null;
        }

        return cacheData.data;
    }

    /**
     * Check if cache item exists and is valid
     * @param {string} key - Cache key
     * @returns {boolean} Whether cache is valid
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Remove cache item
     * @param {string} key - Cache key
     */
    remove(key) {
        this.storage.remove(key);
    }

    /**
     * Clear all cache
     */
    clear() {
        this.storage.clear();
    }

    /**
     * Clean expired cache items
     */
    clean() {
        const keys = this.storage.keys();
        keys.forEach(key => {
            this.get(key); // This will remove expired items
        });
    }
}

/**
 * Form Data Manager
 */
export class FormDataManager {
    constructor() {
        this.storage = new StorageManager('form_');
    }

    /**
     * Save form data
     * @param {string} formId - Form identifier
     * @param {Object} data - Form data
     * @param {number} expires - Expiration time in milliseconds
     */
    saveFormData(formId, data, expires = 30 * 60 * 1000) { // 30 minutes
        return this.storage.set(`form_${formId}`, data, { expires });
    }

    /**
     * Get form data
     * @param {string} formId - Form identifier
     * @returns {Object} Form data
     */
    getFormData(formId) {
        return this.storage.get(`form_${formId}`, { parse: true, defaultValue: {} });
    }

    /**
     * Remove form data
     * @param {string} formId - Form identifier
     */
    removeFormData(formId) {
        this.storage.remove(`form_${formId}`);
    }

    /**
     * Auto-save form data
     * @param {string} formId - Form identifier
     * @param {Object} data - Form data
     */
    autoSave(formId, data) {
        this.saveFormData(`autosave_${formId}`, data, 60 * 60 * 1000); // 1 hour
    }

    /**
     * Get auto-saved form data
     * @param {string} formId - Form identifier
     * @returns {Object} Auto-saved form data
     */
    getAutoSaved(formId) {
        return this.getFormData(`autosave_${formId}`);
    }
}

// Create default instances
export const storageManager = new StorageManager();
export const sessionManager = new SessionManager();
export const userDataManager = new UserDataManager();
export const contentDataManager = new ContentDataManager();
export const cacheManager = new CacheManager();
export const formDataManager = new FormDataManager();

// Export default object
export default {
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
};