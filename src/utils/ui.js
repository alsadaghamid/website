/**
 * UI utilities for أنت صاحب المنصة
 * Contains UI-related functions and interactions
 */

/**
 * Show notification to user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds (0 for persistent)
 */
export function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="icon">×</i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        direction: rtl;
        text-align: right;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    return notification;
}

/**
 * Get notification color based on type
 * @param {string} type - Notification type
 * @returns {string} CSS color value
 */
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

/**
 * Show loading spinner
 * @param {HTMLElement} container - Container element
 * @param {string} message - Loading message
 * @returns {HTMLElement} Loading element
 */
export function showLoading(container, message = 'جاري التحميل...') {
    const loading = document.createElement('div');
    loading.className = 'loading-spinner';
    loading.innerHTML = `
        <div class="spinner"></div>
        <p class="loading-message">${message}</p>
    `;

    loading.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
        direction: rtl;
    `;

    // Add spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-message {
            margin-top: 15px;
            color: #666;
            font-size: 14px;
        }
    `;

    if (!document.querySelector('#loading-styles')) {
        style.id = 'loading-styles';
        document.head.appendChild(style);
    }

    if (container) {
        container.appendChild(loading);
    }

    return loading;
}

/**
 * Hide loading spinner
 * @param {HTMLElement} loadingElement - Loading element to remove
 */
export function hideLoading(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
        loadingElement.remove();
    }
}

/**
 * Show modal dialog
 * @param {Object} options - Modal options
 * @returns {HTMLElement} Modal element
 */
export function showModal(options = {}) {
    const {
        title = '',
        content = '',
        type = 'default',
        showCloseButton = true,
        showCancelButton = false,
        confirmText = 'تأكيد',
        cancelText = 'إلغاء',
        onConfirm = null,
        onCancel = null,
        size = 'medium'
    } = options;

    // Remove existing modals
    const existingModals = document.querySelectorAll('.modal-overlay');
    existingModals.forEach(modal => modal.remove());

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container modal-${size}">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                ${showCloseButton ? '<button class="modal-close">&times;</button>' : ''}
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${showCancelButton ? `<button class="btn btn-secondary modal-cancel">${cancelText}</button>` : ''}
                <button class="btn btn-primary modal-confirm">${confirmText}</button>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            direction: rtl;
        }
        .modal-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            max-height: 90vh;
            overflow-y: auto;
            animation: modalFadeIn 0.3s ease;
        }
        .modal-small { width: 300px; max-width: 90vw; }
        .modal-medium { width: 500px; max-width: 90vw; }
        .modal-large { width: 800px; max-width: 90vw; }
        .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #9ca3af;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }
        .modal-close:hover {
            background: #f3f4f6;
            color: #374151;
        }
        .modal-body {
            padding: 24px;
        }
        .modal-footer {
            padding: 20px 24px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;

    if (!document.querySelector('#modal-styles')) {
        style.id = 'modal-styles';
        document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const cancelBtn = modal.querySelector('.modal-cancel');

    const closeModal = () => {
        modal.style.animation = 'modalFadeOut 0.3s ease forwards';
        setTimeout(() => modal.remove(), 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
        if (onCancel) onCancel();
        closeModal();
    });

    confirmBtn.addEventListener('click', () => {
        if (onConfirm) onConfirm();
        closeModal();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    return modal;
}

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Confirm callback
 * @param {Object} options - Additional options
 */
export function showConfirm(message, onConfirm, options = {}) {
    return showModal({
        title: 'تأكيد العملية',
        content: `<p style="margin: 0; text-align: right;">${message}</p>`,
        showCancelButton: true,
        confirmText: options.confirmText || 'تأكيد',
        cancelText: options.cancelText || 'إلغاء',
        onConfirm,
        onCancel: options.onCancel,
        size: options.size || 'small'
    });
}

/**
 * Show alert dialog
 * @param {string} message - Alert message
 * @param {Function} onClose - Close callback
 * @param {Object} options - Additional options
 */
export function showAlert(message, onClose = null, options = {}) {
    return showModal({
        title: options.title || 'تنبيه',
        content: `<p style="margin: 0; text-align: right;">${message}</p>`,
        showCancelButton: false,
        confirmText: options.confirmText || 'موافق',
        onConfirm: onClose,
        size: options.size || 'small'
    });
}

/**
 * Create and show tooltip
 * @param {HTMLElement} element - Element to attach tooltip to
 * @param {string} text - Tooltip text
 * @param {Object} options - Tooltip options
 */
export function showTooltip(element, text, options = {}) {
    const {
        position = 'top',
        delay = 300
    } = options;

    let tooltip;
    let timeout;

    const showTooltip = () => {
        timeout = setTimeout(() => {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;

            tooltip.style.cssText = `
                position: absolute;
                background: #374151;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 10000;
                pointer-events: none;
                direction: rtl;
                text-align: right;
            `;

            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let top, left;

            switch (position) {
                case 'top':
                    top = rect.top - tooltipRect.height - 8;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = rect.bottom + 8;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case 'left':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.left - tooltipRect.width - 8;
                    break;
                case 'right':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.right + 8;
                    break;
            }

            tooltip.style.left = Math.max(0, left) + 'px';
            tooltip.style.top = Math.max(0, top) + 'px';
        }, delay);
    };

    const hideTooltip = () => {
        clearTimeout(timeout);
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    };

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);

    return {
        destroy: () => {
            element.removeEventListener('mouseenter', showTooltip);
            element.removeEventListener('mouseleave', hideTooltip);
            hideTooltip();
        }
    };
}

/**
 * Smooth scroll to element
 * @param {string|HTMLElement} target - Target element or selector
 * @param {number} offset - Offset from top
 */
export function scrollToElement(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;

    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('تم نسخ النص إلى الحافظة', 'success', 2000);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showNotification('تم نسخ النص إلى الحافظة', 'success', 2000);
            return true;
        } catch (fallbackErr) {
            showNotification('فشل في نسخ النص', 'error', 3000);
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 بايت';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['بايت', 'ك.ب', 'م.ب', 'ج.ب', 'ت.ب'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format date in Arabic
 * @param {Date|string} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date
 */
export function formatDate(date, options = {}) {
    const d = new Date(date);
    const {
        locale = 'ar-SA',
        year = 'numeric',
        month = 'long',
        day = 'numeric',
        hour = 'numeric',
        minute = '2-digit'
    } = options;

    return d.toLocaleDateString(locale, {
        year,
        month,
        day,
        hour,
        minute
    });
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
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
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Throttle limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
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
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean} Whether element is in viewport
 */
export function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = rect.top <= windowHeight && rect.bottom >= 0;
    const horInView = rect.left <= windowWidth && rect.right >= 0;

    if (threshold === 0) {
        return vertInView && horInView;
    }

    const elementHeight = rect.bottom - rect.top;
    const elementWidth = rect.right - rect.left;

    const vertThreshold = elementHeight * threshold;
    const horThreshold = elementWidth * threshold;

    return (
        rect.top <= windowHeight - vertThreshold &&
        rect.bottom >= vertThreshold &&
        rect.left <= windowWidth - horThreshold &&
        rect.right >= horThreshold
    );
}

/**
 * Animate element
 * @param {HTMLElement} element - Element to animate
 * @param {string} animation - Animation type
 * @param {number} duration - Animation duration in milliseconds
 */
export function animateElement(element, animation, duration = 300) {
    const animations = {
        fadeIn: { opacity: [0, 1] },
        fadeOut: { opacity: [1, 0] },
        slideIn: { transform: ['translateY(-20px)', 'translateY(0)'], opacity: [0, 1] },
        slideOut: { transform: ['translateY(0)', 'translateY(-20px)'], opacity: [1, 0] },
        slideInRight: { transform: ['translateX(20px)', 'translateX(0)'], opacity: [0, 1] },
        slideOutRight: { transform: ['translateX(0)', 'translateX(20px)'], opacity: [1, 0] },
        bounce: { transform: ['scale(0.3)', 'scale(1.1)', 'scale(0.9)', 'scale(1.05)', 'scale(1)'] }
    };

    if (!animations[animation]) return;

    element.style.transition = `all ${duration}ms ease`;
    element.style.transform = animations[animation].transform ?
        animations[animation].transform[0] : '';
    element.style.opacity = animations[animation].opacity ?
        animations[animation].opacity[0] : '';

    setTimeout(() => {
        element.style.transform = animations[animation].transform ?
            animations[animation].transform[animations[animation].transform.length - 1] : '';
        element.style.opacity = animations[animation].opacity ?
            animations[animation].opacity[animations[animation].opacity.length - 1] : '';
    }, 50);
}

// Export default object
export default {
    showNotification,
    showLoading,
    hideLoading,
    showModal,
    showConfirm,
    showAlert,
    showTooltip,
    scrollToElement,
    copyToClipboard,
    formatFileSize,
    formatDate,
    debounce,
    throttle,
    isInViewport,
    animateElement
};