document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme on page load
    initializeTheme();

    // Initialize logo fallback
    initializeLogoFallback();

    // Theme toggle functionality
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    function updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    // Make toggleTheme function globally available
    window.toggleTheme = toggleTheme;
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        
            // Dynamic Content Loading System
            function initializeDynamicContent() {
                const filterButtons = document.querySelectorAll('.filter-btn');
                const postsContainer = document.getElementById('posts-container');
                const loadingIndicator = document.getElementById('loading-indicator');
                const loadMoreBtn = document.querySelector('.load-more-btn');
        
                let currentPage = 1;
                let isLoading = false;
        
                // Filter functionality
                filterButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const category = this.dataset.category;
        
                        // Update active button
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
        
                        // Filter posts with animation
                        filterPosts(category);
                    });
                });
        
                function filterPosts(category) {
                    const posts = document.querySelectorAll('.post-item');
                    let visibleCount = 0;
        
                    posts.forEach((post, index) => {
                        const postCategory = post.dataset.category;
                        const shouldShow = category === 'all' || postCategory === category;
        
                        if (shouldShow) {
                            post.style.display = 'block';
                            setTimeout(() => {
                                post.style.opacity = '1';
                                post.style.transform = 'translateY(0) scale(1)';
                            }, index * 100);
                            visibleCount++;
                        } else {
                            post.style.opacity = '0';
                            post.style.transform = 'translateY(20px) scale(0.95)';
                            setTimeout(() => {
                                post.style.display = 'none';
                            }, 300);
                        }
                    });
        
                    // Update load more button visibility
                    updateLoadMoreButton(visibleCount);
                }
        
                function updateLoadMoreButton(visibleCount) {
                    if (loadMoreBtn) {
                        loadMoreBtn.style.display = visibleCount >= 6 ? 'inline-block' : 'none';
                    }
                }
        
                // Load more functionality
                window.loadMoreContent = function() {
                    if (isLoading) return;
        
                    isLoading = true;
                    showLoadingIndicator();
        
                    // Simulate API call
                    setTimeout(() => {
                        loadMorePosts();
                        hideLoadingIndicator();
                        isLoading = false;
                    }, 1500);
                };
        
                function showLoadingIndicator() {
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'flex';
                        if (loadMoreBtn) {
                            loadMoreBtn.disabled = true;
                            loadMoreBtn.textContent = 'جاري التحميل...';
                        }
                    }
                }
        
                function hideLoadingIndicator() {
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'none';
                        if (loadMoreBtn) {
                            loadMoreBtn.disabled = false;
                            loadMoreBtn.textContent = 'تحميل المزيد';
                        }
                    }
                }
        
                function loadMorePosts() {
                    const newPosts = generateMockPosts(3);
                    const postsContainer = document.getElementById('posts-container');
        
                    newPosts.forEach((post, index) => {
                        const postElement = createPostElement(post);
                        postsContainer.appendChild(postElement);
        
                        // Animate in new posts
                        setTimeout(() => {
                            postElement.style.opacity = '1';
                            postElement.style.transform = 'translateY(0) scale(1)';
                        }, index * 200);
                    });
        
                    currentPage++;
                    updateLoadMoreButton(postsContainer.children.length);
                }
        
                function generateMockPosts(count) {
                    const categories = ['videos', 'articles', 'forum'];
                    const icons = ['🎥', '📝', '💬', '🎯', '🚀', '💡'];
                    const titles = [
                        'ورشة عمل: تطوير المهارات الرقمية',
                        'دليل شامل للقيادة الفعالة',
                        'قصة نجاح: من الفكرة إلى الواقع',
                        'نصائح لإدارة الوقت بفعالية',
                        'كيف تبني فريقًا قويًا',
                        'أسرار التواصل الناجح'
                    ];
        
                    const descriptions = [
                        'تعلم كيفية استخدام الأدوات الرقمية لتعزيز قيادتك.',
                        'استراتيجيات مثبتة لتصبح قائدًا أفضل في مجتمعك.',
                        'رحلة ملهمة تظهر كيف تحولت فكرة بسيطة إلى مشروع ناجح.',
                        'طرق عملية لتنظيم وقتك وتحقيق أهدافك بكفاءة أكبر.',
                        'خطوات عملية لبناء فريق متماسك ومنتج.',
                        'مهارات أساسية للتواصل الفعال في البيئة المهنية.'
                    ];
        
                    const posts = [];
                    for (let i = 0; i < count; i++) {
                        const category = categories[Math.floor(Math.random() * categories.length)];
                        posts.push({
                            id: Date.now() + i,
                            category: category,
                            icon: icons[Math.floor(Math.random() * icons.length)],
                            title: titles[Math.floor(Math.random() * titles.length)],
                            description: descriptions[Math.floor(Math.random() * descriptions.length)],
                            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            author: ['أحمد محمد', 'فاطمة علي', 'مجتمع المنصة', 'سارة أحمد'][Math.floor(Math.random() * 4)]
                        });
                    }
                    return posts;
                }
        
                function createPostElement(post) {
                    const postElement = document.createElement('div');
                    postElement.className = 'post-item';
                    postElement.dataset.category = post.category;
                    postElement.style.opacity = '0';
                    postElement.style.transform = 'translateY(30px) scale(0.95)';
                    postElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
                    postElement.innerHTML = `
                        <div class="post-icon">${post.icon}</div>
                        <h3>${post.title}</h3>
                        <p>${post.description}</p>
                        <div class="post-meta">
                            <span class="post-date">${post.date}</span>
                            <span class="post-author">${post.author}</span>
                        </div>
                        <a href="#" class="post-link">اقرأ المزيد</a>
                    `;
        
                    return postElement;
                }
        
                // Initialize with "all" filter active
                filterPosts('all');
            }
        
            // Global Search Functionality
            function initializeSearch() {
                const searchInput = document.getElementById('global-search');
                const searchSuggestions = document.getElementById('search-suggestions');
                const searchBtn = document.querySelector('.search-btn');
        
                let searchTimeout;
        
                // Search suggestions data
                const searchData = [
                    {
                        title: 'فيديو: قيادة الشباب في العصر الرقمي',
                        description: 'نقاش حول كيفية قيادة التغيير عبر الإنترنت',
                        category: 'فيديوهات',
                        icon: '🎥',
                        url: 'content.html',
                        type: 'video'
                    },
                    {
                        title: 'مقال: بناء الثقة الذاتية',
                        description: 'نصائح عملية لتطوير مهاراتك الشخصية',
                        category: 'مقالات',
                        icon: '📝',
                        url: 'content.html',
                        type: 'article'
                    },
                    {
                        title: 'منتدى: أفكار لمبادرات بيئية',
                        description: 'انضم إلى النقاش حول المشاريع الشبابية',
                        category: 'منتدى',
                        icon: '💬',
                        url: 'forum.html',
                        type: 'forum'
                    },
                    {
                        title: 'مبادرة: تمكين الشباب في الريف',
                        description: 'برنامج تدريبي لتطوير المهارات القيادية',
                        category: 'مبادرات',
                        icon: '🎯',
                        url: 'initiatives.html',
                        type: 'initiative'
                    },
                    {
                        title: 'عن القناة',
                        description: 'تعرف على رسالة ورؤية أنت صاحب المنصة',
                        category: 'عام',
                        icon: 'ℹ️',
                        url: '#about',
                        type: 'page'
                    },
                    {
                        title: 'تواصل معنا',
                        description: 'أرسل رسالتك وتواصل مع فريق المنصة',
                        category: 'عام',
                        icon: '📧',
                        url: 'contact.html',
                        type: 'page'
                    }
                ];
        
                // Search input functionality
                if (searchInput) {
                    searchInput.addEventListener('input', function() {
                        const query = this.value.trim().toLowerCase();
        
                        clearTimeout(searchTimeout);
        
                        if (query.length < 2) {
                            hideSuggestions();
                            return;
                        }
        
                        searchTimeout = setTimeout(() => {
                            showSuggestions(query);
                        }, 300);
                    });
        
                    searchInput.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            performSearch();
                        }
                    });
        
                    // Hide suggestions when clicking outside
                    document.addEventListener('click', function(e) {
                        if (!e.target.closest('.search-container')) {
                            hideSuggestions();
                        }
                    });
                }
        
                function showSuggestions(query) {
                    const filteredData = searchData.filter(item =>
                        item.title.toLowerCase().includes(query) ||
                        item.description.toLowerCase().includes(query) ||
                        item.category.toLowerCase().includes(query)
                    );
        
                    if (filteredData.length === 0) {
                        hideSuggestions();
                        return;
                    }
        
                    const suggestionsHTML = filteredData.map(item => `
                        <div class="search-suggestion" onclick="selectSuggestion('${item.url}', '${item.title}')">
                            <div class="suggestion-icon">${item.icon}</div>
                            <div class="suggestion-content">
                                <div class="suggestion-title">${highlightText(item.title, query)}</div>
                                <div class="suggestion-description">${highlightText(item.description, query)}</div>
                                <div class="suggestion-category">${item.category}</div>
                            </div>
                        </div>
                    `).join('');
        
                    if (searchSuggestions) {
                        searchSuggestions.innerHTML = suggestionsHTML;
                        searchSuggestions.style.display = 'block';
                    }
                }
        
                function hideSuggestions() {
                    if (searchSuggestions) {
                        searchSuggestions.style.display = 'none';
                    }
                }
        
                function highlightText(text, query) {
                    if (!query) return text;
                    const regex = new RegExp(`(${query})`, 'gi');
                    return text.replace(regex, '<mark>$1</mark>');
                }
        
                // Make functions globally available
                window.selectSuggestion = function(url, title) {
                    hideSuggestions();
                    if (searchInput) {
                        searchInput.value = title;
                    }
                    if (url.startsWith('#')) {
                        document.querySelector(url).scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.location.href = url;
                    }
                };
        
                window.performSearch = function() {
                    const query = searchInput ? searchInput.value.trim() : '';
                    if (query) {
                        showSearchResults(query);
                    }
                };
        
                function showSearchResults(query) {
                    const filteredData = searchData.filter(item =>
                        item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.description.toLowerCase().includes(query.toLowerCase())
                    );
        
                    // Create search results modal
                    const modal = document.createElement('div');
                    modal.className = 'search-modal';
                    modal.innerHTML = `
                        <div class="search-results">
                            <div class="search-results-header">
                                <h2 class="search-results-title">نتائج البحث: "${query}"</h2>
                                <button class="search-results-close" onclick="closeSearchModal()">×</button>
                            </div>
                            <div class="search-results-content">
                                ${filteredData.length > 0 ?
                                    filteredData.map(item => `
                                        <div class="search-result-item" onclick="selectSuggestion('${item.url}', '${item.title}')">
                                            <div class="search-result-title">${item.title}</div>
                                            <div class="search-result-description">${item.description}</div>
                                            <div class="search-result-meta">
                                                <span>${item.category}</span> •
                                                <span>${item.icon}</span>
                                            </div>
                                        </div>
                                    `).join('') :
                                    '<div class="no-results">لا توجد نتائج للبحث المحدد</div>'
                                }
                            </div>
                        </div>
                    `;
        
                    document.body.appendChild(modal);
        
                    // Animate modal in
                    setTimeout(() => {
                        modal.classList.add('active');
                    }, 10);
        
                    // Make close function globally available
                    window.closeSearchModal = function() {
                        modal.classList.remove('active');
                        setTimeout(() => {
                            modal.remove();
                        }, 300);
                    };
                }
        
                // Search button functionality
                if (searchBtn) {
                    searchBtn.addEventListener('click', performSearch);
                }
            }
        
            // User Authentication System
            function initializeAuth() {
                // Check if user is already logged in
                const currentUser = getCurrentUser();
                if (currentUser) {
                    showUserProfile(currentUser);
                }
        
                // Add event listeners for auth forms
                setupAuthForms();
            }
        
            function setupAuthForms() {
                const loginForm = document.getElementById('login-form');
                const registerForm = document.getElementById('register-form');
        
                if (loginForm) {
                    loginForm.addEventListener('submit', handleLogin);
                }
        
                if (registerForm) {
                    registerForm.addEventListener('submit', handleRegister);
                }
            }
        
            function handleLogin(e) {
                e.preventDefault();
        
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
        
                // Simulate API call
                showLoading('login-form');
        
                setTimeout(() => {
                    // Mock authentication - in real app, this would be an API call
                    if (email && password) {
                        const user = {
                            id: Date.now(),
                            name: email.split('@')[0],
                            email: email,
                            avatar: '👤',
                            joinDate: new Date().toISOString()
                        };
        
                        loginUser(user);
                        closeAuthModal();
                        showSuccessMessage('تم تسجيل الدخول بنجاح!');
                    } else {
                        showError('login-form', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
                    }
                    hideLoading('login-form');
                }, 1500);
            }
        
            function handleRegister(e) {
                e.preventDefault();
        
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;
                const termsAccepted = document.getElementById('register-terms').checked;
        
                // Validate form
                if (password !== confirmPassword) {
                    showError('register-form', 'كلمات المرور غير متطابقة');
                    return;
                }
        
                if (password.length < 6) {
                    showError('register-form', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                    return;
                }
        
                if (!termsAccepted) {
                    showError('register-form', 'يجب الموافقة على الشروط والأحكام');
                    return;
                }
        
                showLoading('register-form');
        
                setTimeout(() => {
                    const user = {
                        id: Date.now(),
                        name: name,
                        email: email,
                        avatar: '👤',
                        joinDate: new Date().toISOString()
                    };
        
                    loginUser(user);
                    closeAuthModal();
                    showSuccessMessage('تم إنشاء الحساب بنجاح! مرحباً بك في أنت صاحب المنصة');
                    hideLoading('register-form');
                }, 2000);
            }
        
            function loginUser(user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showUserProfile(user);
            }
        
            function logout() {
                localStorage.removeItem('currentUser');
                hideUserProfile();
                showSuccessMessage('تم تسجيل الخروج بنجاح');
            }
        
            function showUserProfile(user) {
                const profileLinks = document.querySelectorAll('nav ul li a[href="#"]');
                profileLinks.forEach(link => {
                    link.textContent = user.name;
                    link.classList.add('user-status');
                });
        
                // Update profile dropdown
                document.getElementById('profile-name').textContent = user.name;
                document.getElementById('profile-email').textContent = user.email;
                document.getElementById('profile-avatar').textContent = user.avatar;
        
                // Add click handler to profile links
                profileLinks.forEach(link => {
                    link.onclick = function(e) {
                        e.preventDefault();
                        toggleProfileDropdown();
                    };
                });
            }
        
            function hideUserProfile() {
                const profileLinks = document.querySelectorAll('nav ul li a[href="#"]');
                profileLinks.forEach(link => {
                    link.textContent = 'الملف الشخصي';
                    link.classList.remove('user-status');
                    link.onclick = function(e) {
                        e.preventDefault();
                        showAuthModal();
                    };
                });
            }
        
            function toggleProfileDropdown() {
                const dropdown = document.getElementById('profile-dropdown');
                dropdown.classList.toggle('show');
            }
        
            // Make functions globally available
            window.showAuthModal = function() {
                const modal = document.getElementById('auth-modal');
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('active'), 10);
                document.body.style.overflow = 'hidden';
            };
        
            window.closeAuthModal = function() {
                const modal = document.getElementById('auth-modal');
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                    resetAuthForms();
                }, 300);
                document.body.style.overflow = '';
            };
        
            window.showLoginForm = function() {
                document.getElementById('login-form').style.display = 'flex';
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('auth-title').textContent = 'تسجيل الدخول';
        
                document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
                document.querySelector('.auth-tab:first-child').classList.add('active');
            };
        
            window.showRegisterForm = function() {
                document.getElementById('register-form').style.display = 'flex';
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('auth-title').textContent = 'إنشاء حساب';
        
                document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
                document.querySelector('.auth-tab:last-child').classList.add('active');
            };
        
            window.showForgotPassword = function() {
                showNotification('سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'info');
            };
        
            window.showTermsModal = function() {
                showNotification('الشروط والأحكام: يرجى مراجعة الشروط والأحكام قبل المتابعة.', 'info');
            };
        
            window.socialAuth = function(provider) {
                showLoading('auth-container');
                setTimeout(() => {
                    const user = {
                        id: Date.now(),
                        name: `${provider}User`,
                        email: `user@${provider}.com`,
                        avatar: provider === 'google' ? '🌐' : '📘',
                        joinDate: new Date().toISOString()
                    };
                    loginUser(user);
                    closeAuthModal();
                    showSuccessMessage(`تم تسجيل الدخول باستخدام ${provider === 'google' ? 'جوجل' : 'فيسبوك'} بنجاح!`);
                    hideLoading('auth-container');
                }, 2000);
            };
        
            window.showProfile = function() {
                toggleProfileDropdown();
                showNotification('الملف الشخصي - هذه الميزة قيد التطوير', 'info');
            };
        
            window.showSettings = function() {
                toggleProfileDropdown();
                showNotification('الإعدادات - هذه الميزة قيد التطوير', 'info');
            };
        
            window.showMyContent = function() {
                toggleProfileDropdown();
                showNotification('المحتوى الخاص بي - هذه الميزة قيد التطوير', 'info');
            };
        
            function resetAuthForms() {
                const forms = document.querySelectorAll('.auth-form');
                forms.forEach(form => {
                    form.reset();
                    hideError(form.id);
                });
            }
        
            function showLoading(formId) {
                const form = document.getElementById(formId);
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'جاري المعالجة...';
            }
        
            function hideLoading(formId) {
                const form = document.getElementById(formId);
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = formId === 'login-form' ? 'تسجيل الدخول' : 'إنشاء حساب';
            }
        
            function showError(formId, message) {
                const form = document.getElementById(formId);
                let errorDiv = form.querySelector('.error-message');
        
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.style.cssText = `
                        color: #ef4444;
                        background: rgba(239, 68, 68, 0.1);
                        border: 1px solid #ef4444;
                        border-radius: 5px;
                        padding: 0.5rem;
                        margin-top: 1rem;
                        font-size: 0.9rem;
                    `;
                    form.appendChild(errorDiv);
                }
        
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }
        
            function hideError(formId) {
                const form = document.getElementById(formId);
                const errorDiv = form.querySelector('.error-message');
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
            }
        
            function showSuccessMessage(message) {
                showNotification(message, 'success');
            }
        
            function showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
        
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${type === 'success' ? 'var(--accent-gold)' : type === 'error' ? '#ef4444' : 'var(--accent-orange)'};
                    color: var(--primary-bg);
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                    word-wrap: break-word;
                `;
        
                document.body.appendChild(notification);
        
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 10);
        
                setTimeout(() => {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => notification.remove(), 300);
                }, 4000);
            }
        
            function getCurrentUser() {
                const userData = localStorage.getItem('currentUser');
                return userData ? JSON.parse(userData) : null;
            }
        
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                const dropdown = document.getElementById('profile-dropdown');
                const profileLinks = document.querySelectorAll('nav ul li a[href="#"]');
        
                if (!e.target.closest('.profile-dropdown') && !profileLinks[0]?.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        });
    });

    // Enhanced CTA button functionality
    const primaryCta = document.querySelector('.primary-cta');
    const secondaryCta = document.querySelector('.secondary-cta');

    if (primaryCta) {
        primaryCta.addEventListener('click', function() {
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (secondaryCta) {
        secondaryCta.addEventListener('click', function() {
            document.querySelector('#latest-posts').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Advanced Intersection Observer for fade-in animations on sections
    const sectionObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, sectionObserverOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Animated statistics counter
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Trigger statistics animation when hero section is visible
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Stagger animation for .stagger-item elements (videos and articles)
    const staggerObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const staggerObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger delay 100ms per item
                observer.unobserve(entry.target);
            }
        });
    }, staggerObserverOptions);

    // Observe stagger items
    document.querySelectorAll('.stagger-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        staggerObserver.observe(item);
    });

    // Fallback for stagger items to show on load if observer doesn't trigger (e.g., short page)
    setTimeout(() => {
        document.querySelectorAll('.stagger-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);

    // Enhanced Mobile menu toggle
    window.toggleMobileMenu = function() {
        const navUl = document.querySelector('nav ul');
        const toggle = document.querySelector('.mobile-menu-toggle');

        navUl.classList.toggle('mobile-open');

        // Update toggle button state
        if (navUl.classList.contains('mobile-open')) {
            toggle.classList.add('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const navUl = document.querySelector('nav ul');
            const toggle = document.querySelector('.mobile-menu-toggle');

            navUl.classList.remove('mobile-open');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navUl = document.querySelector('nav ul');
        const nav = document.querySelector('nav');
        const toggle = document.querySelector('.mobile-menu-toggle');

        if (!nav.contains(e.target) && navUl.classList.contains('mobile-open')) {
            navUl.classList.remove('mobile-open');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navUl = document.querySelector('nav ul');
            const toggle = document.querySelector('.mobile-menu-toggle');

            if (navUl.classList.contains('mobile-open')) {
                navUl.classList.remove('mobile-open');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Add smooth scroll behavior for mobile menu links
    document.querySelectorAll('nav ul li a[href^="#"]').forEach(link => {
        link.addEventListener('click', function() {
            const navUl = document.querySelector('nav ul');
            const toggle = document.querySelector('.mobile-menu-toggle');

            // Close mobile menu when a link is clicked
            if (window.innerWidth <= 768) {
                navUl.classList.remove('mobile-open');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Form handling with improved feedback
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            console.log('Form submitted:', data);
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = 'جاري الإرسال...';

            if (this.closest('#join')) {
                // Join form: Open mailto with pre-filled email
                const subject = encodeURIComponent('طلب انضمام إلى أنت صاحب المنصة');
                const body = encodeURIComponent(`الاسم: ${data.name || ''}\nالبريد الإلكتروني: ${data.email || ''}\nنوع المشاركة: ${data['type'] || ''}\n\nمرحباً، أنا أرغب في الانضمام إلى المنصة.`);
                const mailtoUrl = `mailto:alsadaghamid@gmail.com?subject=${subject}&body=${body}`;
                window.location.href = mailtoUrl;
                setTimeout(() => {
                    alert('أهلاً بك! أنت صاحب المنصة، ونحن نهتم بكل من ينضم إلينا. تم توجيه طلبك إلى فريقنا، وسنرد عليك قريبًا لنبدأ رحلتك معنا في التمكين والقيادة.');
                    this.reset();
                    submitBtn.textContent = 'إرسال';
                }, 1000);
            } else {
                // Other forms (e.g., contact): Open mailto with pre-filled email
                const subject = encodeURIComponent('رسالة من موقع أنت صاحب المنصة');
                const body = encodeURIComponent(`الاسم: ${data.name || ''}\nالبريد الإلكتروني: ${data.email || ''}\nرابط الموقع: ${data.url || ''}\nالرسالة: ${data.message || ''}\n\nمرحباً، هذه رسالة من الزائر.`);
                const mailtoUrl = `mailto:alsadaghamid@gmail.com?subject=${subject}&body=${body}`;
                window.location.href = mailtoUrl;
                setTimeout(() => {
                    alert('تم إرسال الرسالة بنجاح! سنرد عليك قريبًا.');
                    this.reset();
                    submitBtn.textContent = 'إرسال';
                }, 1000);
            }
        });
    });

    // Category filter for videos with animation
    const allVideos = document.querySelectorAll('.video-gallery iframe');
    document.querySelectorAll('.categories button').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            allVideos.forEach((video, index) => {
                if (category === 'الكل' || video.dataset.category === category) {
                    video.style.display = 'block';
                    setTimeout(() => {
                        video.style.opacity = '1';
                        video.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    video.style.opacity = '0';
                    video.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        video.style.display = 'none';
                    }, 300);
                }
            });
            // Highlight active button with animation
            document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set initial active button
    document.querySelector('.categories button[data-category="الكل"]').classList.add('active');

    // Search and filter for articles with real-time update
    const searchInput = document.querySelector('.search-filter input');
    const topicSelect = document.querySelector('.search-filter select');
    const articles = document.querySelectorAll('.articles article');

    function filterArticles() {
        const query = searchInput.value.toLowerCase();
        const topic = topicSelect.value;

        articles.forEach((article, index) => {
            const text = article.textContent.toLowerCase();
            const matchesSearch = !query || text.includes(query);
            const matchesTopic = !topic || article.dataset.topic === topic;
            if (matchesSearch && matchesTopic) {
                article.style.display = 'block';
                setTimeout(() => {
                    article.style.opacity = '1';
                    article.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                article.style.opacity = '0';
                article.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    article.style.display = 'none';
                }, 300);
            }
        });
    }

    if (searchInput && topicSelect) {
        searchInput.addEventListener('input', filterArticles);
        topicSelect.addEventListener('change', filterArticles);
    }

    // Lazy loading confirmation and performance
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        console.log('Lazy loading supported natively');
    } else {
        // Fallback for older browsers (polyfill if needed)
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.complete) {
                img.src = img.dataset.src || img.src;
            }
        });
    }

    // Enhanced micro-interactions
    addMicroInteractions();

    // Dynamic content loading system
    initializeDynamicContent();

    // Global search functionality
    initializeSearch();

    // User authentication system
    initializeAuth();

    // Blog management system
    initializeBlog();

    // Blog Management System
    function initializeBlog() {
        // Initialize blog form if it exists
        const blogForm = document.getElementById('blog-form');
        if (blogForm) {
            blogForm.addEventListener('submit', function(e) {
                e.preventDefault();
                publishPost();
            });
        }

        // Initialize blog preview functionality
        const previewBtn = document.getElementById('preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', previewPost);
        }

        // Initialize auto-save functionality
        const blogTitle = document.getElementById('blog-title');
        const blogContent = document.getElementById('blog-content');
        const blogCategory = document.getElementById('blog-category');

        if (blogTitle) {
            blogTitle.addEventListener('input', debounce(autoSave, 1000));
        }
        if (blogContent) {
            blogContent.addEventListener('input', debounce(autoSave, 1000));
        }
        if (blogCategory) {
            blogCategory.addEventListener('change', autoSave);
        }

        // Load existing posts
        loadExistingPosts();

        // Update blog statistics
        updateBlogStats();
    }

    function autoSave() {
        const title = document.getElementById('blog-title')?.value || '';
        const content = document.getElementById('blog-content')?.value || '';
        const category = document.getElementById('blog-category')?.value || '';

        if (title || content) {
            const draft = {
                title: title,
                content: content,
                category: category,
                timestamp: Date.now()
            };

            localStorage.setItem('blogDraft', JSON.stringify(draft));

            // Show save indicator
            showSaveIndicator();
        }
    }

    function showSaveIndicator() {
        let indicator = document.getElementById('save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'save-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--accent-gold);
                color: var(--primary-bg);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }

        indicator.textContent = 'تم الحفظ التلقائي';
        indicator.style.opacity = '1';

        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }

    function loadDraft() {
        const draft = localStorage.getItem('blogDraft');
        if (draft) {
            const draftData = JSON.parse(draft);
            const titleInput = document.getElementById('blog-title');
            const contentInput = document.getElementById('blog-content');
            const categorySelect = document.getElementById('blog-category');

            if (titleInput && draftData.title) {
                titleInput.value = draftData.title;
            }
            if (contentInput && draftData.content) {
                contentInput.value = draftData.content;
            }
            if (categorySelect && draftData.category) {
                categorySelect.value = draftData.category;
            }
        }
    }

    function previewPost() {
        const title = document.getElementById('blog-title')?.value || '';
        const content = document.getElementById('blog-content')?.value || '';
        const category = document.getElementById('blog-category')?.value || '';

        if (!title || !content) {
            showNotification('يرجى إدخال العنوان والمحتوى للمعاينة', 'error');
            return;
        }

        const previewModal = document.getElementById('blog-preview-modal');
        const previewTitle = document.getElementById('preview-title');
        const previewContent = document.getElementById('preview-content');
        const previewCategory = document.getElementById('preview-category');

        if (previewTitle) previewTitle.textContent = title;
        if (previewContent) previewContent.innerHTML = formatContent(content);
        if (previewCategory) previewCategory.textContent = category;

        previewModal.style.display = 'flex';
        setTimeout(() => previewModal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }

    function formatContent(content) {
        // Basic markdown-like formatting
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>');
    }

    function publishPost() {
        const title = document.getElementById('blog-title')?.value || '';
        const content = document.getElementById('blog-content')?.value || '';
        const category = document.getElementById('blog-category')?.value || '';
        const tags = document.getElementById('blog-tags')?.value || '';

        if (!title || !content) {
            showNotification('يرجى إدخال العنوان والمحتوى', 'error');
            return;
        }

        const post = {
            id: Date.now(),
            title: title,
            content: content,
            category: category,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            author: getCurrentUser()?.name || 'المستخدم',
            date: new Date().toISOString(),
            views: 0,
            likes: 0,
            status: 'published'
        };

        saveBlogPost(post);
        clearDraft();
        closeBlogModal();
        showSuccessMessage('تم نشر المقالة بنجاح!');
    }

    function saveBlogPost(post) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        posts.unshift(post); // Add to beginning
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        addPostToUI(post);
        updateBlogStats();
    }

    function addPostToUI(post) {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;

        const postElement = createPostElement(post);
        postsContainer.insertBefore(postElement, postsContainer.firstChild);

        // Animate in
        setTimeout(() => {
            postElement.style.opacity = '1';
            postElement.style.transform = 'translateY(0) scale(1)';
        }, 10);
    }

    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post-item blog-post';
        postElement.dataset.id = post.id;
        postElement.dataset.category = post.category;
        postElement.style.opacity = '0';
        postElement.style.transform = 'translateY(30px) scale(0.95)';
        postElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        const tagsHtml = post.tags && post.tags.length > 0
            ? `<div class="post-tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
            : '';

        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-category">${post.category}</div>
                <div class="post-actions">
                    <button class="action-btn edit-btn" onclick="editPost(${post.id})" title="تعديل">✏️</button>
                    <button class="action-btn delete-btn" onclick="deletePost(${post.id})" title="حذف">🗑️</button>
                </div>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <div class="post-content">${truncateContent(post.content, 200)}</div>
            ${tagsHtml}
            <div class="post-meta">
                <span class="post-date">${formatDate(post.date)}</span>
                <span class="post-author">${post.author}</span>
                <div class="post-stats">
                    <span class="post-views">👁️ ${post.views}</span>
                    <span class="post-likes">❤️ ${post.likes}</span>
                </div>
            </div>
            <a href="#" class="post-link" onclick="readPost(${post.id})">اقرأ المزيد</a>
        `;

        return postElement;
    }

    function truncateContent(content, maxLength) {
        const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function loadExistingPosts() {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const postsContainer = document.getElementById('posts-container');

        if (postsContainer && posts.length > 0) {
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        }

        // Load draft if exists
        loadDraft();
    }

    function updateBlogStats() {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const totalPosts = posts.length;
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
        const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

        // Update stats in UI if elements exist
        const statsElements = {
            'total-posts': totalPosts,
            'total-views': totalViews,
            'total-likes': totalLikes
        };

        Object.entries(statsElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    function editPost(postId) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const post = posts.find(p => p.id === postId);

        if (post) {
            // Fill form with post data
            const titleInput = document.getElementById('blog-title');
            const contentInput = document.getElementById('blog-content');
            const categorySelect = document.getElementById('blog-category');
            const tagsInput = document.getElementById('blog-tags');

            if (titleInput) titleInput.value = post.title;
            if (contentInput) contentInput.value = post.content;
            if (categorySelect) categorySelect.value = post.category;
            if (tagsInput) tagsInput.value = post.tags.join(', ');

            // Show blog modal
            const blogModal = document.getElementById('blog-modal');
            blogModal.style.display = 'flex';
            setTimeout(() => blogModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';

            // Change submit button to update
            const submitBtn = document.getElementById('blog-submit-btn');
            if (submitBtn) {
                submitBtn.textContent = 'تحديث المقالة';
                submitBtn.onclick = function() {
                    updatePost(postId);
                };
            }
        }
    }

    function updatePost(postId) {
        const title = document.getElementById('blog-title')?.value || '';
        const content = document.getElementById('blog-content')?.value || '';
        const category = document.getElementById('blog-category')?.value || '';
        const tags = document.getElementById('blog-tags')?.value || '';

        if (!title || !content) {
            showNotification('يرجى إدخال العنوان والمحتوى', 'error');
            return;
        }

        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex !== -1) {
            posts[postIndex] = {
                ...posts[postIndex],
                title: title,
                content: content,
                category: category,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            localStorage.setItem('blogPosts', JSON.stringify(posts));
            updatePostInUI(postId, posts[postIndex]);
            closeBlogModal();
            showSuccessMessage('تم تحديث المقالة بنجاح!');
        }
    }

    function updatePostInUI(postId, updatedPost) {
        const postElement = document.querySelector(`[data-id="${postId}"]`);
        if (postElement) {
            const newElement = createPostElement(updatedPost);
            postElement.parentNode.replaceChild(newElement, postElement);
        }
    }

    function deletePost(postId) {
        if (confirm('هل أنت متأكد من حذف هذه المقالة؟')) {
            const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            const filteredPosts = posts.filter(p => p.id !== postId);
            localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));

            const postElement = document.querySelector(`[data-id="${postId}"]`);
            if (postElement) {
                postElement.style.opacity = '0';
                postElement.style.transform = 'translateY(-20px) scale(0.95)';
                setTimeout(() => {
                    postElement.remove();
                }, 300);
            }

            updateBlogStats();
            showSuccessMessage('تم حذف المقالة بنجاح!');
        }
    }

    function readPost(postId) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const post = posts.find(p => p.id === postId);

        if (post) {
            // Increment view count
            post.views = (post.views || 0) + 1;
            localStorage.setItem('blogPosts', JSON.stringify(posts));

            // Update view count in UI
            const postElement = document.querySelector(`[data-id="${postId}"] .post-views`);
            if (postElement) {
                postElement.textContent = `👁️ ${post.views}`;
            }

            // Show full post modal or navigate to dedicated page
            showFullPost(post);
        }
    }

    function showFullPost(post) {
        const modal = document.createElement('div');
        modal.className = 'post-modal';
        modal.innerHTML = `
            <div class="post-modal-content">
                <div class="post-modal-header">
                    <h2>${post.title}</h2>
                    <button class="close-btn" onclick="closePostModal()">×</button>
                </div>
                <div class="post-modal-body">
                    <div class="post-category">${post.category}</div>
                    <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
                    ${post.tags && post.tags.length > 0 ? `<div class="post-tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                    <div class="post-meta">
                        <span>بواسطة ${post.author}</span> •
                        <span>${formatDate(post.date)}</span> •
                        <span>👁️ ${post.views || 0}</span> •
                        <span>❤️ ${post.likes || 0}</span>
                    </div>
                </div>
                <div class="post-modal-actions">
                    <button class="action-btn like-btn" onclick="likePost(${post.id})">❤️ إعجاب</button>
                    <button class="action-btn share-btn" onclick="sharePost(${post.id})">📤 مشاركة</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        document.body.style.overflow = 'hidden';

        // Make functions globally available
        window.closePostModal = function() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
            document.body.style.overflow = '';
        };

        window.likePost = function(postId) {
            const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.likes = (post.likes || 0) + 1;
                localStorage.setItem('blogPosts', JSON.stringify(posts));

                const likeBtn = modal.querySelector('.like-btn');
                likeBtn.textContent = `❤️ إعجاب (${post.likes})`;

                showNotification('شكراً لك على الإعجاب!', 'success');
            }
        };

        window.sharePost = function(postId) {
            const post = JSON.parse(localStorage.getItem('blogPosts') || '[]').find(p => p.id === postId);
            if (post && navigator.share) {
                navigator.share({
                    title: post.title,
                    text: post.content.substring(0, 100) + '...',
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(`${post.title}\n${window.location.href}`);
                showNotification('تم نسخ رابط المقالة', 'success');
            }
        };
    }

    function clearDraft() {
        localStorage.removeItem('blogDraft');
    }

    function closeBlogModal() {
        const modal = document.getElementById('blog-modal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            resetBlogForm();
        }, 300);
        document.body.style.overflow = '';

        // Reset submit button
        const submitBtn = document.getElementById('blog-submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'نشر المقالة';
            submitBtn.onclick = function() {
                publishPost();
            };
        }
    }

    function resetBlogForm() {
        const form = document.getElementById('blog-form');
        if (form) {
            form.reset();
            clearDraft();
        }
    }

    function debounce(func, wait) {
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

    // Make blog functions globally available
    window.previewPost = previewPost;
    window.publishPost = publishPost;
    window.editPost = editPost;
    window.deletePost = deletePost;
    window.readPost = readPost;
    window.closeBlogModal = closeBlogModal;

    // Dashboard Management System
    function initializeDashboard() {
        // Initialize dashboard with mock data
        updateDashboard();

        // Set up real-time updates
        setInterval(updateDashboard, 30000); // Update every 30 seconds

        // Initialize charts
        initializeCharts();

        // Set up event listeners
        setupDashboardEventListeners();
    }

    function setupDashboardEventListeners() {
        // Add click handlers for stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', function() {
                const cardType = this.classList[1]; // primary, success, warning, info
                showStatDetails(cardType);
            });
        });

        // Add hover effects for progress items
        document.querySelectorAll('.progress-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });

            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add click handlers for chart bars
        document.querySelectorAll('.chart-bar').forEach(bar => {
            bar.addEventListener('click', function() {
                showBarDetails(this.dataset.label, this.dataset.value);
            });
        });
    }

    function updateDashboard() {
        // Simulate real-time data updates
        const mockData = generateDashboardData();
        updateStats(mockData.stats);
        updateProgressItems(mockData.progress);
        updateActivities(mockData.activities);
        updateCharts(mockData.chartData);
    }

    function generateDashboardData() {
        return {
            stats: {
                totalInitiatives: Math.floor(Math.random() * 50) + 100,
                completedInitiatives: Math.floor(Math.random() * 20) + 30,
                inProgressInitiatives: Math.floor(Math.random() * 15) + 10,
                totalParticipants: Math.floor(Math.random() * 200) + 500
            },
            progress: [
                {
                    title: 'مبادرة التعليم الرقمي',
                    percentage: Math.floor(Math.random() * 20) + 75,
                    completed: Math.floor(Math.random() * 50) + 150,
                    total: 200,
                    daysLeft: Math.floor(Math.random() * 20) + 10
                },
                {
                    title: 'حملة البيئة النظيفة',
                    percentage: Math.floor(Math.random() * 30) + 40,
                    completed: Math.floor(Math.random() * 30) + 20,
                    total: 50,
                    daysLeft: Math.floor(Math.random() * 25) + 25
                },
                {
                    title: 'برنامج الصحة المجتمعية',
                    percentage: Math.floor(Math.random() * 10) + 85,
                    completed: Math.floor(Math.random() * 20) + 180,
                    total: 200,
                    daysLeft: Math.floor(Math.random() * 10) + 5
                }
            ],
            activities: [
                {
                    icon: '🎓',
                    title: `انضمام ${Math.floor(Math.random() * 20) + 10} متطوع جديد لمبادرة التعليم`,
                    time: 'قبل ساعتين',
                    author: 'أحمد محمد',
                    status: 'success'
                },
                {
                    icon: '🌱',
                    title: 'إنجاز هدف حملة البيئة النظيفة',
                    time: 'قبل 4 ساعات',
                    author: 'فاطمة علي',
                    status: 'completed'
                },
                {
                    icon: '🏥',
                    title: 'تنظيم يوم صحي مجتمعي',
                    time: 'قبل يوم',
                    author: 'محمد أحمد',
                    status: 'in-progress'
                }
            ],
            chartData: {
                categoryPercentages: [35, 25, 20, 20],
                monthlyActivity: [
                    { month: 'يناير', value: Math.floor(Math.random() * 30) + 60 },
                    { month: 'فبراير', value: Math.floor(Math.random() * 25) + 70 },
                    { month: 'مارس', value: Math.floor(Math.random() * 20) + 75 },
                    { month: 'أبريل', value: Math.floor(Math.random() * 25) + 85 },
                    { month: 'مايو', value: Math.floor(Math.random() * 20) + 80 },
                    { month: 'يونيو', value: Math.floor(Math.random() * 20) + 85 }
                ]
            }
        };
    }

    function updateStats(stats) {
        const statElements = {
            'total-initiatives': stats.totalInitiatives,
            'completed-initiatives': stats.completedInitiatives,
            'in-progress-initiatives': stats.inProgressInitiatives,
            'total-participants': stats.totalParticipants
        };

        Object.entries(statElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                animateNumber(element, value);
            }
        });
    }

    function updateProgressItems(progressData) {
        const progressItems = document.querySelectorAll('.progress-item');

        progressData.forEach((item, index) => {
            if (progressItems[index]) {
                const header = progressItems[index].querySelector('.progress-header h4');
                const percentage = progressItems[index].querySelector('.progress-percentage');
                const fill = progressItems[index].querySelector('.progress-fill');
                const details = progressItems[index].querySelectorAll('.progress-details span');

                if (header) header.textContent = item.title;
                if (percentage) percentage.textContent = `${item.percentage}%`;
                if (fill) {
                    fill.style.width = `${item.percentage}%`;
                }
                if (details[0]) details[0].textContent = `${item.completed}/${item.total} هدف مكتمل`;
                if (details[1]) details[1].textContent = item.daysLeft > 0 ? `ينتهي في ${item.daysLeft} يوم` : 'مكتمل قريباً';
            }
        });
    }

    function updateActivities(activities) {
        const activitiesContainer = document.getElementById('recent-activities');
        if (!activitiesContainer) return;

        activitiesContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.time} • بواسطة ${activity.author}</p>
                </div>
                <div class="activity-status ${activity.status}">${getStatusText(activity.status)}</div>
            </div>
        `).join('');
    }

    function updateCharts(chartData) {
        // Update pie chart
        const pieChart = document.getElementById('category-chart');
        if (pieChart) {
            const slices = pieChart.querySelectorAll('.chart-slice');
            slices.forEach((slice, index) => {
                const percentage = chartData.categoryPercentages[index] || 0;
                slice.style.transform = `rotate(${index * 90}deg)`;
                slice.dataset.percentage = percentage;
            });
        }

        // Update bar chart
        const barChart = document.getElementById('activity-chart');
        if (barChart) {
            const bars = barChart.querySelectorAll('.chart-bar');
            chartData.monthlyActivity.forEach((data, index) => {
                if (bars[index]) {
                    const height = (data.value / 100) * 180; // Max height 180px
                    bars[index].style.height = `${height}px`;
                    bars[index].dataset.value = data.value;
                    bars[index].dataset.label = data.month;
                }
            });
        }
    }

    function initializeCharts() {
        // Add interactive effects to charts
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.height = bar.dataset.value ? `${(parseInt(bar.dataset.value) / 100) * 180}px` : '100px';
            }, index * 200);
        });
    }

    function animateNumber(element, target, duration = 1000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    function showStatDetails(type) {
        const details = {
            primary: 'إجمالي المبادرات النشطة في المنصة',
            success: 'المبادرات المكتملة بنجاح',
            warning: 'المبادرات قيد التنفيذ حالياً',
            info: 'إجمالي المشاركين النشطين'
        };

        showNotification(details[type] || 'تفاصيل الإحصائية', 'info');
    }

    function showBarDetails(label, value) {
        showNotification(`نشاط ${label}: ${value}%`, 'info');
    }

    function getStatusText(status) {
        const statusMap = {
            success: 'نشط',
            completed: 'مكتمل',
            'in-progress': 'قيد التنفيذ'
        };
        return statusMap[status] || status;
    }

    function refreshDashboard() {
        const btn = document.querySelector('.btn-refresh');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span>⏳</span> جاري التحديث...';
        btn.disabled = true;

        setTimeout(() => {
            updateDashboard();
            btn.innerHTML = originalText;
            btn.disabled = false;
            showNotification('تم تحديث البيانات بنجاح', 'success');
        }, 2000);
    }

    function exportDashboard() {
        const btn = document.querySelector('.btn-export');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span>📊</span> جاري التصدير...';
        btn.disabled = true;

        setTimeout(() => {
            // Simulate export functionality
            const data = {
                stats: {
                    totalInitiatives: document.getElementById('total-initiatives')?.textContent || '0',
                    completedInitiatives: document.getElementById('completed-initiatives')?.textContent || '0',
                    inProgressInitiatives: document.getElementById('in-progress-initiatives')?.textContent || '0',
                    totalParticipants: document.getElementById('total-participants')?.textContent || '0'
                },
                exportDate: new Date().toLocaleDateString('ar-SA')
            };

            console.log('Dashboard data exported:', data);
            btn.innerHTML = originalText;
            btn.disabled = false;
            showNotification('تم تصدير البيانات بنجاح', 'success');
        }, 1500);
    }

    function createNewInitiative() {
        showNotification('إنشاء مبادرة جديدة - هذه الميزة قيد التطوير', 'info');
    }

    function viewAllInitiatives() {
        showNotification('عرض جميع المبادرات - هذه الميزة قيد التطوير', 'info');
    }

    function generateReport() {
        showNotification('إنشاء تقرير - هذه الميزة قيد التطوير', 'info');
    }

    function manageTeam() {
        showNotification('إدارة الفريق - هذه الميزة قيد التطوير', 'info');
    }

    // Initialize dashboard when DOM is loaded
    if (document.getElementById('dashboard')) {
        initializeDashboard();
    }

    function addMicroInteractions() {
        // Add ripple effect to buttons
        document.querySelectorAll('button, .cta').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add stagger animation to article cards
        const articles = document.querySelectorAll('article');
        articles.forEach((article, index) => {
            article.addEventListener('mouseenter', function() {
                this.style.animation = `pulse 0.6s ease ${index * 0.1}s`;
            });

            article.addEventListener('mouseleave', function() {
                this.style.animation = '';
            });
        });

        // Add magnetic effect to social links
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
            });

            link.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // Add typing effect to hero title
        const heroTitle = document.querySelector('.title-main');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.borderRight = '2px solid var(--accent-gold)';
            heroTitle.style.animation = 'blink 1s infinite';

            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        heroTitle.style.borderRight = 'none';
                        heroTitle.style.animation = '';
                    }, 1000);
                }
            };

            setTimeout(typeWriter, 1000);
        }

        // Add scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, var(--accent-gold), var(--accent-orange));
                z-index: 9999;
                transition: width 0.1s ease;
            " id="scroll-progress"></div>
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            document.getElementById('scroll-progress').style.width = scrolled + '%';
        });
    }
    // Flat Editor functionality
    if (document.getElementById('flat-editor')) {
        const errorDiv = document.getElementById('error-message');

        function showError(msg) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            errorDiv.style.display = 'none';
        }

        function validateForm() {
            const cron = document.getElementById('cron').value.trim();
            const sourceType = document.getElementById('source-type').value;
            let errors = [];

            // CRON validation (basic: 5 parts)
            const cronParts = cron.split(/\s+/);
            if (cronParts.length !== 5) {
                errors.push('CRON expression must have 5 parts separated by spaces.');
            }

            if (sourceType === 'http') {
                const filename = document.getElementById('filename').value.trim();
                const endpoint = document.getElementById('endpoint').value.trim();
                const postprocess = document.getElementById('postprocess-script').value.trim();

                if (!filename) {
                    errors.push('Filename is required for HTTP source.');
                }
                if (!endpoint) {
                    errors.push('Endpoint URL is required for HTTP source.');
                } else if (!endpoint.match(/^https?:\/\//)) {
                    errors.push('Endpoint must be a valid URL starting with http:// or https://.');
                }
                // Postprocess optional
            } else {
                // SQL: placeholder, no validation for now
            }

            if (errors.length > 0) {
                showError(errors.join(' '));
                return false;
            }
            hideError();
            return true;
        }

        // CRON description update (basic)
        const cronInput = document.getElementById('cron');
        const cronDesc = document.getElementById('cron-description');
        cronInput.addEventListener('input', function() {
            const value = this.value.trim();
            let desc = 'Will run: ';
            if (value === '*/5 * * * *') {
                desc += 'Every 5 minutes';
            } else if (value === '* * * * *') {
                desc += 'Every minute';
            } else {
                desc += 'According to your CRON expression';
            }
            cronDesc.textContent = desc;
        });

        // Remove HTTP section (hide for now, as only one)
        document.getElementById('remove-http').addEventListener('click', function() {
            document.getElementById('http-section').style.display = 'none';
        });

        // Generate YAML Preview
        document.getElementById('generate-yaml').addEventListener('click', function() {
            hideError();
            if (!validateForm()) return;

            const cron = document.getElementById('cron').value.trim();
            const sourceType = document.getElementById('source-type').value;
            let yaml = `name: Flat Data Update

on:
  schedule:
    - cron: '${cron}'

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}

`;

            if (sourceType === 'http') {
                const filename = document.getElementById('filename').value.trim();
                const endpoint = document.getElementById('endpoint').value.trim();
                const postprocess = document.getElementById('postprocess-script').value.trim();

                yaml += `      - name: Fetch data
        run: |
          curl -L -o ${filename} "${endpoint}"
`;

                if (postprocess) {
                    yaml += `      - name: Postprocess data
        run: node ${postprocess}
`;
                }

                yaml += `      - name: Commit and push changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add ${filename}
          if git diff --staged --quiet; then
            echo "No changes"
          else
            git commit -m "Update ${filename} from flat action"
            git push
          fi
`;
            } else {
                // SQL placeholder
                yaml += `      # TODO: Implement SQL fetch
        run: echo "SQL implementation pending"
`;
            }

            document.getElementById('yaml-preview').value = yaml;
            document.getElementById('save-action').style.display = 'inline-block';
        });

        // Save Flat Action
        document.getElementById('save-action').addEventListener('click', async function() {
            hideError();
            if (!validateForm()) return;

            const formData = {
                cron: document.getElementById('cron').value,
                sourceType: document.getElementById('source-type').value,
                filename: document.getElementById('filename').value,
                endpoint: document.getElementById('endpoint').value,
                postprocess: document.getElementById('postprocess-script').value,
                yaml: document.getElementById('yaml-preview').value
            };

            try {
                const response = await fetch('http://localhost:5000/api/flat/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Flat Action saved successfully!');
                    // Optionally reset form or disable button
                } else {
                    showError(result.error || 'Failed to save Flat Action.');
                }
            } catch (error) {
                console.error('Save error:', error);
                showError('Network error. Is the backend running?');
            }
        });
    }

    // Logo fallback functionality
    function initializeLogoFallback() {
        const logoImg = document.querySelector('.logo-img');
        const logoText = document.querySelector('.logo-text');

        if (logoImg && logoText) {
            // Set up error handler for logo image
            logoImg.addEventListener('error', function() {
                this.style.display = 'none';
                logoText.style.display = 'block';
                console.log('Logo image failed to load, showing text fallback');
            });

            // Set up load handler for logo image
            logoImg.addEventListener('load', function() {
                this.style.display = 'block';
                logoText.style.display = 'none';
                console.log('Logo image loaded successfully');
            });

            // Check if image is already loaded (cached)
            if (logoImg.complete) {
                if (logoImg.naturalHeight === 0) {
                    // Image failed to load
                    logoImg.style.display = 'none';
                    logoText.style.display = 'block';
                } else {
                    // Image loaded successfully
                    logoImg.style.display = 'block';
                    logoText.style.display = 'none';
                }
            }
        }
    }
});