/**
 * Network utilities for أنت صاحب المنصة
 * Contains API communication and network-related functions
 */

/**
 * API Client class for handling HTTP requests
 */
export class APIClient {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
        this.timeout = 30000; // 30 seconds
    }

    /**
     * Make HTTP request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            headers = {},
            body = null,
            params = {},
            timeout = this.timeout,
            retries = 2
        } = options;

        const url = this.buildURL(endpoint, params);
        const requestHeaders = { ...this.defaultHeaders, ...headers };

        // Add CSRF token if available
        const csrfToken = sessionStorage.getItem('csrf_token');
        if (csrfToken) {
            requestHeaders['X-CSRF-Token'] = csrfToken;
        }

        const config = {
            method: method.toUpperCase(),
            headers: requestHeaders,
            signal: AbortSignal.timeout(timeout)
        };

        if (body && method.toUpperCase() !== 'GET') {
            config.body = body instanceof FormData ? body : JSON.stringify(body);
        }

        let lastError;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, config);

                if (!response.ok) {
                    throw new APIError(
                        `HTTP ${response.status}: ${response.statusText}`,
                        response.status,
                        await response.text()
                    );
                }

                const contentType = response.headers.get('content-type');
                let data;

                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }

                return {
                    data,
                    status: response.status,
                    headers: Object.fromEntries(response.headers.entries())
                };

            } catch (error) {
                lastError = error;

                if (error.name === 'AbortError') {
                    throw new APIError('Request timeout', 408);
                }

                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    throw new APIError('Cannot complete request, make sure you are connected and logged in with the selected provider.', 0);
                }

                // If this is the last attempt, throw the error
                if (attempt === retries) {
                    throw error;
                }

                // Wait before retrying (exponential backoff)
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw lastError;
    }

    /**
     * Build URL with query parameters
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {string} Complete URL
     */
    buildURL(endpoint, params = {}) {
        const url = new URL(endpoint, this.baseURL);

        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        return url.toString();
    }

    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @param {Object} options - Request options
     */
    async post(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: data
        });
    }

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @param {Object} options - Request options
     */
    async put(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: data
        });
    }

    /**
     * PATCH request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @param {Object} options - Request options
     */
    async patch(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: data
        });
    }

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    /**
     * Upload file
     * @param {string} endpoint - API endpoint
     * @param {FormData} formData - Form data with file
     * @param {Object} options - Request options
     */
    async upload(endpoint, formData, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: formData,
            headers: {
                ...options.headers,
                // Don't set Content-Type for FormData - let browser set it
            }
        });
    }
}

/**
 * API Error class
 */
export class APIError extends Error {
    constructor(message, status = 500, response = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.response = response;
    }
}

/**
 * Network status checker
 */
export class NetworkStatus {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = [];

        this.setupEventListeners();
    }

    /**
     * Setup network event listeners
     */
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.notifyListeners('online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.notifyListeners('offline');
        });
    }

    /**
     * Add network status change listener
     * @param {Function} callback - Callback function
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove network status change listener
     * @param {Function} callback - Callback function to remove
     */
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * Notify all listeners of status change
     * @param {string} status - Network status
     */
    notifyListeners(status) {
        this.listeners.forEach(callback => {
            try {
                callback(status);
            } catch (error) {
                console.error('Network status listener error:', error);
            }
        });
    }

    /**
     * Check if online
     * @returns {boolean} Online status
     */
    isConnected() {
        return this.isOnline;
    }

    /**
     * Ping server to check connectivity
     * @param {string} url - URL to ping
     * @returns {Promise<boolean>} Connectivity status
     */
    async ping(url = '/') {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                cache: 'no-cache',
                signal: AbortSignal.timeout(5000)
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}

/**
 * Request queue for offline functionality
 */
export class RequestQueue {
    constructor(storageKey = 'offline_requests') {
        this.storageKey = storageKey;
        this.queue = this.loadQueue();
        this.isProcessing = false;
    }

    /**
     * Load queue from storage
     * @returns {Array} Request queue
     */
    loadQueue() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    /**
     * Save queue to storage
     */
    saveQueue() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
        } catch (error) {
            console.error('Failed to save request queue:', error);
        }
    }

    /**
     * Add request to queue
     * @param {Object} request - Request object
     */
    add(request) {
        const queueItem = {
            id: Date.now() + Math.random(),
            timestamp: Date.now(),
            ...request
        };

        this.queue.push(queueItem);
        this.saveQueue();
    }

    /**
     * Remove request from queue
     * @param {string} id - Request ID
     */
    remove(id) {
        this.queue = this.queue.filter(item => item.id !== id);
        this.saveQueue();
    }

    /**
     * Get all queued requests
     * @returns {Array} Queued requests
     */
    getAll() {
        return [...this.queue];
    }

    /**
     * Clear all requests from queue
     */
    clear() {
        this.queue = [];
        this.saveQueue();
    }

    /**
     * Process queue with API client
     * @param {APIClient} apiClient - API client instance
     */
    async process(apiClient) {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }

        this.isProcessing = true;

        while (this.queue.length > 0) {
            const item = this.queue[0];

            try {
                await apiClient.request(item.endpoint, {
                    method: item.method,
                    body: item.body,
                    headers: item.headers
                });

                this.remove(item.id);
            } catch (error) {
                console.error('Failed to process queued request:', error);

                // If it's a network error, stop processing
                if (error.status === 0) {
                    break;
                }

                // Remove failed request after 3 attempts
                if (item.attempts >= 3) {
                    this.remove(item.id);
                } else {
                    item.attempts = (item.attempts || 0) + 1;
                    this.saveQueue();
                }
            }
        }

        this.isProcessing = false;
    }
}

/**
 * Rate limiter for API requests
 */
export class RateLimiter {
    constructor(maxRequests = 100, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    /**
     * Check if request can be made
     * @returns {boolean} Whether request can be made
     */
    canMakeRequest() {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        // Remove old requests
        this.requests = this.requests.filter(time => time > windowStart);

        return this.requests.length < this.maxRequests;
    }

    /**
     * Record a request
     */
    recordRequest() {
        this.requests.push(Date.now());
    }

    /**
     * Wait until request can be made
     * @returns {Promise} Promise that resolves when request can be made
     */
    async waitForLimit() {
        if (this.canMakeRequest()) {
            return;
        }

        const oldestRequest = Math.min(...this.requests);
        const waitTime = oldestRequest + this.windowMs - Date.now();

        if (waitTime > 0) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    /**
     * Get remaining requests in current window
     * @returns {number} Remaining requests
     */
    getRemainingRequests() {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        this.requests = this.requests.filter(time => time > windowStart);
        return Math.max(0, this.maxRequests - this.requests.length);
    }
}

/**
 * API endpoints configuration
 */
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

    // User management
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    USER_CONTENT: '/user/content',
    USER_ACTIVITY: '/user/activity',

    // Content management
    CONTENT_LIST: '/content',
    CONTENT_CREATE: '/content',
    CONTENT_GET: '/content/:id',
    CONTENT_UPDATE: '/content/:id',
    CONTENT_DELETE: '/content/:id',
    CONTENT_LIKE: '/content/:id/like',
    CONTENT_BOOKMARK: '/content/:id/bookmark',
    CONTENT_SHARE: '/content/:id/share',

    // Categories and tags
    CATEGORIES: '/categories',
    TAGS: '/tags',

    // Search
    SEARCH_CONTENT: '/search',
    SEARCH_USERS: '/search/users',

    // Admin
    ADMIN_USERS: '/admin/users',
    ADMIN_CONTENT: '/admin/content',
    ADMIN_ANALYTICS: '/admin/analytics',

    // File upload
    UPLOAD_FILE: '/upload',
    UPLOAD_AVATAR: '/upload/avatar',
    UPLOAD_CONTENT_IMAGE: '/upload/content-image'
};

/**
 * Create API client instance with default configuration
 * @returns {APIClient} Configured API client
 */
export function createAPIClient() {
    const client = new APIClient();

    // Add request interceptor for authentication
    const originalRequest = client.request.bind(client);
    client.request = async (endpoint, options = {}) => {
        // Add auth token if available
        const token = sessionStorage.getItem('auth_token');
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }

        try {
            const response = await originalRequest(endpoint, options);
            return response;
        } catch (error) {
            if (error.status === 401) {
                // Token expired, try to refresh
                try {
                    const refreshResponse = await originalRequest(API_ENDPOINTS.REFRESH_TOKEN, {
                        method: 'POST'
                    });

                    if (refreshResponse.data.token) {
                        sessionStorage.setItem('auth_token', refreshResponse.data.token);
                        // Retry original request
                        options.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
                        return originalRequest(endpoint, options);
                    }
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    window.location.href = '/login';
                }
            }
            throw error;
        }
    };

    return client;
}

// Create default instances
export const apiClient = createAPIClient();
export const networkStatus = new NetworkStatus();
export const requestQueue = new RequestQueue();
export const rateLimiter = new RateLimiter();

// Setup offline request processing
networkStatus.addListener((status) => {
    if (status === 'online') {
        requestQueue.process(apiClient);
    }
});

// Export default object
export default {
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
};