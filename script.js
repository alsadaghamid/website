// Modern JavaScript for "أنت صاحب المنصة" Platform
// Using ES6+ features, modern APIs, and best practices

class PlatformApp {
    constructor() {
        this.currentUser = null;
        this.theme = localStorage.getItem('theme') || 'light';
        this.posts = [];
        this.isLoading = false;
        this.searchTimeout = null;

        this.init();
    }

    // Initialize the application
    async init() {
        try {
            this.setupEventListeners();
            this.initializeTheme();
            this.initializeAnimations();
            this.initializeSearch();
            this.initializeModals();
            this.initializeForms();
            this.initializeNavigation();
            this.initializeTooltips();
            this.initializeKeyboardShortcuts();

            // Initialize CSRF token
            await this.initializeCSRFToken();

            // Load initial data
            await this.loadPosts();

            // Initialize lazy loading
            this.initializeLazyLoading();

            // Initialize service worker for PWA
            this.initializePWA();

            console.log('✅ منصة "أنت صاحب المنصة" تم تحميلها بنجاح');
        } catch (error) {
            console.error('❌ خطأ في تحميل المنصة:', error);
            this.showNotification('حدث خطأ في تحميل المنصة', 'error');
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Global click handler for better performance
        document.addEventListener('click', this.handleGlobalClick.bind(this));

        // Handle form submissions globally
        document.addEventListener('submit', this.handleFormSubmit.bind(this));

        // Handle window resize
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

        // Handle scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));

        // Handle online/offline status
        window.addEventListener('online', () => this.handleConnectionChange(true));
        window.addEventListener('offline', () => this.handleConnectionChange(false));
    }

    // Initialize theme system
    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.theme = e.matches ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', this.theme);
                    this.updateThemeIcon();
                }
            });
        }
    }

    // Toggle between light and dark themes
    toggleTheme() {
        try {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('theme', this.theme);
            this.updateThemeIcon();

            this.showNotification(`تم التبديل إلى الوضع ${this.theme === 'light' ? 'الفاتح' : 'المظلم'}`, 'success');

            // Test theme by checking if CSS variables are applied
            const testElement = document.createElement('div');
            testElement.style.position = 'absolute';
            testElement.style.visibility = 'hidden';
            testElement.style.backgroundColor = 'var(--primary-bg)';
            document.body.appendChild(testElement);

            const computedStyle = window.getComputedStyle(testElement);
            if (computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)' || computedStyle.backgroundColor === 'transparent') {
                console.warn('Theme CSS variables may not be loading correctly');
            }

            document.body.removeChild(testElement);
        } catch (error) {
            console.error('Error toggling theme:', error);
            this.showNotification('حدث خطأ في تبديل السمة', 'error');
        }
    }

    // Update theme toggle icon
    updateThemeIcon() {
        const themeIconLight = document.querySelector('.theme-icon-light');
        const themeIconDark = document.querySelector('.theme-icon-dark');

        if (themeIconLight && themeIconDark) {
            if (this.theme === 'dark') {
                themeIconLight.style.display = 'none';
                themeIconDark.style.display = 'block';
            } else {
                themeIconLight.style.display = 'block';
                themeIconDark.style.display = 'none';
            }
        }
    }

    // Initialize animations and observers
    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('section, .post-card, .goal-icon, .benefit-icon').forEach(el => {
            observer.observe(el);
        });

        // Add CSS for animations
        if (!document.querySelector('#animation-styles')) {
            const style = document.createElement('style');
            style.id = 'animation-styles';
            style.textContent = `
                .animate-in {
                    animation: slideInUp 0.6s ease-out forwards;
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .post-card {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.3s ease;
                }

                .post-card.animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize search functionality
    initializeSearch() {
        const searchInput = document.getElementById('global-search');
        const searchSuggestions = document.getElementById('search-suggestions');

        if (searchInput && searchSuggestions) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('focus', () => {
                searchSuggestions.style.display = 'block';
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    searchSuggestions.style.display = 'none';
                }, 200);
            });
        }
    }

    // Handle search input
    async handleSearch(query) {
        if (!query.trim()) {
            document.getElementById('search-suggestions').style.display = 'none';
            return;
        }

        try {
            const suggestions = await this.searchPosts(query);
            this.displaySearchSuggestions(suggestions, query);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    // Search posts
    async searchPosts(query) {
        const posts = await this.loadPosts();
        return posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            post.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    // Display search suggestions
    displaySearchSuggestions(suggestions, query) {
        const suggestionsContainer = document.getElementById('search-suggestions');

        if (suggestions.length === 0) {
            suggestionsContainer.innerHTML = '<div class="search-suggestion">لا توجد نتائج</div>';
        } else {
            suggestionsContainer.innerHTML = suggestions.map(post => `
                <div class="search-suggestion" onclick="app.navigateToPost('${post.id}')">
                    <div class="suggestion-icon">📄</div>
                    <div class="suggestion-content">
                        <div class="suggestion-title">${this.highlightText(post.title, query)}</div>
                        <div class="suggestion-category">${post.category}</div>
                    </div>
                </div>
            `).join('');
        }

        suggestionsContainer.style.display = 'block';
    }

    // Highlight search text
    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Initialize modal functionality
    initializeModals() {
        // Close modals on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Initialize forms with validation
    initializeForms() {
        // Add form validation classes
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('input', (e) => {
                this.validateField(e.target);
            });
        });
    }

    // Validate individual form fields
    validateField(field) {
        const errorElement = document.getElementById(`${field.name}-error`) || document.getElementById(`${field.id}-error`);

        if (!errorElement) return;

        let isValid = true;
        let message = '';

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'هذا الحقل مطلوب';
        }

        // Email validation
        if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
            isValid = false;
            message = 'يرجى إدخال بريد إلكتروني صحيح';
        }

        // Password confirmation
        if (field.id === 'register-confirm-password' && field.value !== document.getElementById('register-password').value) {
            isValid = false;
            message = 'كلمات المرور غير متطابقة';
        }

        // Update field appearance
        field.classList.toggle('error', !isValid);
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';

        return isValid;
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Initialize navigation
    initializeNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');

        if (mobileToggle && navbarMenu) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const navbarMenu = document.querySelector('.navbar-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');

        if (navbarMenu && mobileToggle) {
            const isOpen = navbarMenu.classList.contains('show');

            navbarMenu.classList.toggle('show');
            mobileToggle.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', !isOpen);

            // Prevent body scroll when menu is open
            document.body.style.overflow = !isOpen ? 'hidden' : '';
        }
    }

    // Initialize tooltips
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.title);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    // Show tooltip
    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.id = 'tooltip';

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.bottom + 5 + 'px';

        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });
    }

    // Hide tooltip
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Escape to close modals and menus
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.closeUserMenu();
                this.closeMobileMenu();
            }
        });
    }

    // Initialize lazy loading
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Initialize CSRF token
    async initializeCSRFToken() {
        try {
            const response = await fetch('auth.php?action=get_csrf_token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (result.success && result.csrf_token) {
                this.csrfToken = result.csrf_token;
                // Store in session for form submissions
                sessionStorage.setItem('csrf_token', result.csrf_token);
            }
        } catch (error) {
            console.warn('Could not initialize CSRF token:', error);
        }
    }

    // Get CSRF token
    getCSRFToken() {
        return this.csrfToken || sessionStorage.getItem('csrf_token');
    }

    // Initialize PWA features
    initializePWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }

        // Handle PWA install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show install button
            this.showInstallButton();
        });
    }

    // Show PWA install button
    showInstallButton() {
        const installButton = document.createElement('button');
        installButton.className = 'install-pwa-btn';
        installButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="7.5,4.21 12,6.81 16.5,4.21"></polyline>
                <polyline points="7.5,19.79 7.5,14.6 3,12"></polyline>
                <polyline points="21,12 16.5,14.6 16.5,19.79"></polyline>
            </svg>
            <span>تثبيت التطبيق</span>
        `;

        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                    installButton.remove();
                });
            }
        });

        document.body.appendChild(installButton);
    }

    // Load posts from API
    async loadPosts() {
        if (this.posts.length > 0) return this.posts;

        try {
            this.showLoading();

            // Try to get posts from the actual API
            const response = await fetch('auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'get_posts',
                    page: 1,
                    limit: 10,
                    csrf_token: this.getCSRFToken()
                })
            });

            const result = await response.json();

            if (result.success) {
                this.posts = result.data.posts || [];
                this.displayPosts();
            } else {
                // Fallback to mock data if API fails
                console.warn('API failed, using mock data');
                const mockResponse = await this.mockApiCall('/api/posts');
                this.posts = mockResponse.posts || [];
            }

            this.hideLoading();
            return this.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            this.hideLoading();

            // Fallback to mock data
            try {
                const mockResponse = await this.mockApiCall('/api/posts');
                this.posts = mockResponse.posts || [];
            } catch (mockError) {
                console.error('Mock API also failed:', mockError);
                this.showNotification('حدث خطأ في تحميل المحتوى', 'error');
                return [];
            }

            return this.posts;
        }
    }

    // Display posts on the page
    displayPosts() {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) {
            console.warn('Posts container not found');
            return;
        }

        if (this.posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts-icon">📝</div>
                    <h3>لا توجد مشاركات متاحة</h3>
                    <p>سيتم إضافة المحتوى قريباً. كن أول من يشارك!</p>
                    <button class="btn btn-primary" onclick="app.showCreatePostModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>إنشاء منشور جديد</span>
                    </button>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = this.posts.map(post => `
            <article class="post-card" data-category="${post.category}">
                <div class="post-header">
                    <div class="post-icon">
                        ${this.getPostIcon(post.category)}
                    </div>
                    <div class="post-meta">
                        <span class="post-category">${post.category}</span>
                        <time class="post-date" datetime="${post.created_at}">${this.formatDate(post.created_at)}</time>
                    </div>
                </div>
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                </div>
                <div class="post-footer">
                    <div class="post-author">
                        <div class="author-avatar">${post.author?.avatar || '👤'}</div>
                        <span class="author-name">${post.author?.name || 'مجتمع المنصة'}</span>
                    </div>
                    <a href="content.html" class="post-link" aria-label="اقرأ المزيد عن ${post.title}">
                        <span>اقرأ المزيد</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </a>
                </div>
            </article>
        `).join('');

        // Re-initialize animations for new posts
        this.initializeAnimations();
    }

    // Get post icon based on category
    getPostIcon(category) {
        const icons = {
            'فيديوهات': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="23,7 16,12 23,17 23,7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>`,
            'مقالات': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
            </svg>`,
            'منتدى': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>`,
            'مبادرات': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>`
        };
        return icons[category] || icons['مقالات'];
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'اليوم';
        } else if (diffDays < 7) {
            return `منذ ${diffDays} أيام`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `منذ ${weeks} أسابيع`;
        } else {
            return date.toLocaleDateString('ar-SA');
        }
    }

    // Mock API call for demonstration
    async mockApiCall(endpoint) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        return {
            posts: [
                {
                    id: '1',
                    title: 'قيادة الشباب في العصر الرقمي',
                    excerpt: 'نقاش حول كيفية قيادة التغيير عبر الإنترنت وتطوير مهارات القيادة الرقمية للشباب العربي.',
                    category: 'فيديوهات',
                    date: '2025-01-15',
                    author: 'مجتمع المنصة',
                    featured: true
                },
                {
                    id: '2',
                    title: 'بناء الثقة الذاتية',
                    excerpt: 'نصائح عملية وممارسات يومية لتطوير الثقة بالنفس وتعزيز الصورة الذاتية الإيجابية.',
                    category: 'مقالات',
                    date: '2025-01-14',
                    author: 'مجتمع المنصة',
                    featured: false
                },
                {
                    id: '3',
                    title: 'أفكار لمبادرات بيئية',
                    excerpt: 'انضم إلى النقاش المفتوح حول المبادرات البيئية والمشاريع المستدامة في المنطقة العربية.',
                    category: 'منتدى',
                    date: '2025-01-13',
                    author: 'مجتمع المنصة',
                    featured: false
                }
            ]
        };
    }

    // Handle global click events
    handleGlobalClick(e) {
        // Close dropdowns when clicking outside
        if (!e.target.closest('.user-menu-button') && !e.target.closest('.user-dropdown')) {
            this.closeUserMenu();
        }

        // Close mobile menu when clicking outside
        if (!e.target.closest('.mobile-menu-toggle') && !e.target.closest('.navbar-menu')) {
            this.closeMobileMenu();
        }

        // Close modals when clicking backdrop
        if (e.target.classList.contains('modal-backdrop')) {
            this.closeAllModals();
        }
    }

    // Handle form submissions
    async handleFormSubmit(e) {
        const form = e.target;

        if (form.id === 'join-form') {
            e.preventDefault();
            await this.handleJoinForm(form);
        } else if (form.id === 'login-form') {
            e.preventDefault();
            await this.handleLoginForm(form);
        } else if (form.id === 'register-form') {
            e.preventDefault();
            await this.handleRegisterForm(form);
        } else if (form.id === 'create-post-form') {
            e.preventDefault();
            await this.handleCreatePostForm(form);
        }
    }

    // Handle join form submission
    async handleJoinForm(form) {
        if (!this.validateForm(form)) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            this.showLoading();

            // Simulate API call
            await this.mockApiCall('/api/join');

            this.showNotification('تم إرسال طلب الانضمام بنجاح! سنتواصل معك قريباً', 'success');
            form.reset();

            this.hideLoading();
        } catch (error) {
            console.error('Join form error:', error);
            this.showNotification('حدث خطأ في إرسال الطلب', 'error');
            this.hideLoading();
        }
    }

    // Handle login form submission
    async handleLoginForm(form) {
        if (!this.validateForm(form)) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            this.showLoading();

            // Check connectivity first
            const isConnected = await this.checkConnectivity();
            if (!isConnected) {
                this.showNotification('لا يوجد اتصال بالإنترنت. تحقق من الاتصال وأعد المحاولة.', 'error');
                this.hideLoading();
                return;
            }

            // Try to use the actual API endpoint
            const response = await fetch('auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'login',
                    login: data.identifier,
                    password: data.password,
                    remember: data.remember ? 1 : 0,
                    csrf_token: this.getCSRFToken()
                })
            });

            const result = await response.json();

            if (result.success) {
                this.currentUser = result.data.user;
                this.updateUserInterface();
                this.closeAuthModal();
                this.showNotification('تم تسجيل الدخول بنجاح!', 'success');

                // Store token if provided
                if (result.data.token) {
                    sessionStorage.setItem('auth_token', result.data.token);
                }
            } else {
                this.showNotification(result.message || 'بيانات الدخول غير صحيحة', 'error');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Login error:', error);

            // Provide specific error messages based on error type
            let errorMessage = 'حدث خطأ في تسجيل الدخول';
            if (error.message && error.message.includes('Cannot complete request')) {
                errorMessage = 'مشكلة في الاتصال. تحقق من الإنترنت وأعد المحاولة.';
            } else if (error.message && error.message.includes('Network error')) {
                errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من الإنترنت.';
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'مشكلة في الشبكة. تحقق من الاتصال بالإنترنت.';
            } else if (error instanceof TypeError) {
                errorMessage = 'خطأ في الاتصال. تحقق من الإنترنت وأعد المحاولة.';
            }

            this.showNotification(errorMessage, 'error');
            this.hideLoading();
        }
    }

    // Handle register form submission
    async handleRegisterForm(form) {
        if (!this.validateForm(form)) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            this.showLoading();

            // Simulate API call
            const response = await this.mockApiCall('/api/auth/register');

            if (response.success) {
                this.currentUser = response.user;
                this.updateUserInterface();
                this.closeAuthModal();
                this.showNotification('تم إنشاء الحساب بنجاح!', 'success');
            } else {
                this.showNotification('حدث خطأ في إنشاء الحساب', 'error');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Register error:', error);
            this.showNotification('حدث خطأ في إنشاء الحساب', 'error');
            this.hideLoading();
        }
    }

    // Handle create post form submission
    async handleCreatePostForm(form) {
        if (!this.currentUser) {
            this.showNotification('يجب تسجيل الدخول أولاً', 'warning');
            this.showAuthModal();
            return;
        }

        if (!this.validateForm(form)) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            this.showLoading();

            // Simulate API call
            const response = await this.mockApiCall('/api/posts/create');

            if (response.success) {
                this.showNotification('تم نشر المحتوى بنجاح!', 'success');
                this.closeCreatePostModal();
                form.reset();

                // Reload posts
                await this.loadPosts();
                this.displayPosts();
            } else {
                this.showNotification('حدث خطأ في نشر المحتوى', 'error');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Create post error:', error);
            this.showNotification('حدث خطأ في نشر المحتوى', 'error');
            this.hideLoading();
        }
    }

    // Validate entire form
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Update user interface after login
    updateUserInterface() {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userDropdownAvatar = document.getElementById('user-dropdown-avatar');
        const userDropdownName = document.getElementById('user-dropdown-name');
        const userDropdownEmail = document.getElementById('user-dropdown-email');

        if (this.currentUser) {
            if (userAvatar) userAvatar.textContent = this.currentUser.avatar || '👤';
            if (userName) userName.textContent = this.currentUser.name;
            if (userDropdownAvatar) userDropdownAvatar.textContent = this.currentUser.avatar || '👤';
            if (userDropdownName) userDropdownName.textContent = this.currentUser.name;
            if (userDropdownEmail) userDropdownEmail.textContent = this.currentUser.email;
        }
    }

    // Handle window resize
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 1023) {
            this.closeMobileMenu();
        }

        // Update layout calculations if needed
        this.updateLayoutMetrics();
    }

    // Handle scroll events
    handleScroll() {
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');

        // Add/remove header background on scroll
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    // Handle connection changes
    handleConnectionChange(online) {
        if (online) {
            this.showNotification('تم استعادة الاتصال بالإنترنت', 'success');
            // Process any queued requests
            if (window.requestQueue) {
                window.requestQueue.process(window.apiClient);
            }
        } else {
            this.showNotification('انقطع الاتصال بالإنترنت. سيتم حفظ طلباتك مؤقتاً.', 'warning');
        }
    }

    // Check network connectivity
    async checkConnectivity() {
        try {
            const response = await fetch('/index.php', {
                method: 'HEAD',
                cache: 'no-cache',
                timeout: 5000
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Utility functions
    debounce(func, wait) {
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

    throttle(func, limit) {
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

    // Smooth scroll to element
    smoothScrollTo(target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Show loading overlay
    showLoading() {
        this.isLoading = true;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('show');
            overlay.setAttribute('aria-hidden', 'false');
        }
    }

    // Hide loading overlay
    hideLoading() {
        this.isLoading = false;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            overlay.setAttribute('aria-hidden', 'true');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const container = document.getElementById('toast-container');

        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);

        // Add styles if not exists
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    background: var(--surface-bg);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    padding: var(--space-md);
                    margin-bottom: var(--space-sm);
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }

                [data-theme="dark"] .toast {
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .toast.show {
                    transform: translateX(0);
                }

                .toast-info { border-left: 4px solid var(--accent-gold); }
                .toast-success { border-left: 4px solid var(--accent-success); }
                .toast-warning { border-left: 4px solid var(--accent-warning); }
                .toast-error { border-left: 4px solid var(--accent-error); }

                .toast-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-sm);
                }

                .toast-message {
                    flex: 1;
                    font-size: var(--text-sm);
                    color: var(--text-primary);
                }

                .toast-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: var(--space-xs);
                    border-radius: var(--radius);
                    transition: color var(--transition-fast);
                }

                .toast-close:hover {
                    color: var(--text-primary);
                }

                .toast-close svg {
                    width: 16px;
                    height: 16px;
                }
            `;
            document.head.appendChild(style);
        }

        // Trigger show animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    }

    // Modal management functions
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    showCreatePostModal() {
        if (!this.currentUser) {
            this.showNotification('يجب تسجيل الدخول أولاً', 'warning');
            this.showAuthModal();
            return;
        }

        const modal = document.getElementById('create-post-modal');
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }

    closeCreatePostModal() {
        const modal = document.getElementById('create-post-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        this.closeAuthModal();
        this.closeCreatePostModal();
    }

    // User menu functions
    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        const button = document.querySelector('.user-menu-button');

        if (dropdown && button) {
            const isOpen = dropdown.classList.contains('show');
            dropdown.classList.toggle('show');
            button.setAttribute('aria-expanded', !isOpen);
        }
    }

    closeUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        const button = document.querySelector('.user-menu-button');

        if (dropdown && button) {
            dropdown.classList.remove('show');
            button.setAttribute('aria-expanded', 'false');
        }
    }

    closeMobileMenu() {
        const navbarMenu = document.querySelector('.navbar-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');

        if (navbarMenu && mobileToggle) {
            navbarMenu.classList.remove('show');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // Navigation functions
    scrollToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            this.smoothScrollTo(section);
        }
    }

    navigateToPost(postId) {
        // Hide search suggestions
        document.getElementById('search-suggestions').style.display = 'none';

        // Navigate to content page with post ID
        window.location.href = `content.html?post=${postId}`;
    }

    // Password visibility toggle
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
        }
    }

    // Layout update functions
    updateLayoutMetrics() {
        // Update any layout-dependent calculations
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Public API methods (called from HTML)
    logout() {
        this.currentUser = null;
        this.updateUserInterface();
        this.showNotification('تم تسجيل الخروج بنجاح', 'success');
    }

    // Toggle user menu
    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        const button = document.querySelector('.user-menu-button');

        if (dropdown && button) {
            const isOpen = dropdown.classList.contains('show');
            dropdown.classList.toggle('show');
            button.setAttribute('aria-expanded', !isOpen);
        }
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const navbarMenu = document.querySelector('.navbar-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');

        if (navbarMenu && mobileToggle) {
            const isOpen = navbarMenu.classList.contains('show');

            navbarMenu.classList.toggle('show');
            mobileToggle.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', !isOpen);

            // Prevent body scroll when menu is open
            document.body.style.overflow = !isOpen ? 'hidden' : '';
        }
    }

    // Scroll to section
    scrollToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            this.smoothScrollTo(section);
        }
    }

    // Show login form
    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');

        if (loginForm && registerForm && loginTab && registerTab) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
        }
    }

    // Show register form
    showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');

        if (loginForm && registerForm && loginTab && registerTab) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
        }
    }

    // Show forgot password
    showForgotPassword() {
        this.showNotification('ميزة استعادة كلمة المرور قيد التطوير', 'info');
    }

    // Close auth modal
    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // Close create post modal
    closeCreatePostModal() {
        const modal = document.getElementById('create-post-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // Media page functions
    searchMedia() {
        const searchInput = document.getElementById('media-search');
        if (searchInput) {
            const query = searchInput.value;
            this.showNotification(`البحث عن: ${query} - قيد التطوير`, 'info');
        }
    }

    filterMedia(type) {
        this.showNotification(`تصفية الوسائط: ${type} - قيد التطوير`, 'info');
    }

    filterMediaByCategory() {
        const categorySelect = document.getElementById('media-category-filter');
        if (categorySelect) {
            const category = categorySelect.value;
            this.showNotification(`تصفية بالفئة: ${category} - قيد التطوير`, 'info');
        }
    }

    sortMedia() {
        const sortSelect = document.getElementById('media-sort-filter');
        if (sortSelect) {
            const sortBy = sortSelect.value;
            this.showNotification(`ترتيب: ${sortBy} - قيد التطوير`, 'info');
        }
    }

    showMediaUploadModal() {
        this.showNotification('إنشاء وسائط جديدة - قيد التطوير', 'info');
    }

    showMediaTypeModal(type) {
        this.showNotification(`استكشاف ${type} - قيد التطوير`, 'info');
    }

    switchMediaTab(type) {
        // Remove active class from all tabs
        document.querySelectorAll('.media-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Add active class to clicked tab
        event.target.classList.add('active');

        this.showNotification(`تبديل إلى ${type} - قيد التطوير`, 'info');
    }

    previewMedia() {
        this.showNotification('معاينة الوسائط - قيد التطوير', 'info');
    }

    uploadMedia() {
        this.showNotification('نشر الوسائط - قيد التطوير', 'info');
    }

    closeMediaUploadModal() {
        const modal = document.getElementById('media-upload-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    closeMediaPreviewModal() {
        const modal = document.getElementById('media-preview-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    editMedia() {
        this.showNotification('تعديل الوسائط - قيد التطوير', 'info');
    }

    publishMedia() {
        this.showNotification('نشر الوسائط - قيد التطوير', 'info');
    }

    showProfile() {
        if (!this.currentUser) {
            this.showAuthModal();
            return;
        }
        // Navigate to profile page
        window.location.href = 'profile.html';
    }

    showSettings() {
        // Show settings modal or navigate to settings page
        this.showNotification('الإعدادات قيد التطوير', 'info');
    }

    loadMoreContent() {
        const button = document.getElementById('load-more-btn');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span>جاري التحميل...</span>';

            // Simulate loading more content
            setTimeout(() => {
                this.showNotification('تم تحميل المزيد من المحتوى', 'success');
                button.disabled = false;
                button.innerHTML = '<span>تحميل المزيد</span>';
            }, 1000);
        }
    }

    saveDraft() {
        this.showNotification('تم حفظ المسودة', 'success');
    }

    previewPost() {
        this.showNotification('معاينة المنشور قيد التطوير', 'info');
    }

    showTermsModal() {
        this.showNotification('شروط الاستخدام قيد التطوير', 'info');
    }

    showPrivacyModal() {
        this.showNotification('سياسة الخصوصية قيد التطوير', 'info');
    }

    socialAuth(provider) {
        this.showNotification(`تسجيل الدخول باستخدام ${provider} قيد التطوير. يرجى استخدام تسجيل الدخول العادي.`, 'info');

        // Log the attempt for debugging
        console.log(`Social auth attempt with provider: ${provider}`);

        // You can implement actual social auth here when ready
        // Example: redirect to OAuth endpoint
        // window.location.href = `/auth/${provider}`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PlatformApp();
});

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformApp;
}
