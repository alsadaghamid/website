/**
 * Internationalization (i18n) system for أنت صاحب المنصة
 * Handles Arabic and English translations
 */

// Translation dictionary
const translations = {
    ar: {
        // Navigation
        nav: {
            home: 'الرئيسية',
            content: 'المحتوى',
            community: 'المجتمع',
            about: 'حول المنصة',
            contact: 'اتصل بنا',
            login: 'تسجيل الدخول',
            register: 'إنشاء حساب',
            logout: 'تسجيل الخروج',
            profile: 'الملف الشخصي',
            settings: 'الإعدادات',
            admin: 'لوحة التحكم'
        },

        // Common
        common: {
            save: 'حفظ',
            cancel: 'إلغاء',
            delete: 'حذف',
            edit: 'تعديل',
            view: 'عرض',
            share: 'مشاركة',
            like: 'إعجاب',
            comment: 'تعليق',
            loading: 'جاري التحميل...',
            error: 'حدث خطأ',
            success: 'تم بنجاح',
            warning: 'تحذير',
            info: 'معلومات',
            confirm: 'تأكيد',
            retry: 'إعادة المحاولة',
            back: 'رجوع',
            next: 'التالي',
            previous: 'السابق',
            close: 'إغلاق',
            open: 'فتح',
            yes: 'نعم',
            no: 'لا',
            ok: 'موافق',
            search: 'بحث',
            filter: 'تصفية',
            sort: 'ترتيب',
            reset: 'إعادة تعيين',
            submit: 'إرسال',
            upload: 'رفع',
            download: 'تحميل',
            preview: 'معاينة',
            copy: 'نسخ',
            paste: 'لصق',
            cut: 'قص',
            select_all: 'تحديد الكل',
            deselect_all: 'إلغاء تحديد الكل'
        },

        // Authentication
        auth: {
            login: 'تسجيل الدخول',
            register: 'إنشاء حساب',
            logout: 'تسجيل الخروج',
            forgot_password: 'نسيت كلمة المرور؟',
            reset_password: 'إعادة تعيين كلمة المرور',
            change_password: 'تغيير كلمة المرور',
            remember_me: 'تذكرني',
            sign_in_with: 'تسجيل الدخول باستخدام',
            sign_up_with: 'إنشاء حساب باستخدام',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            confirm_password: 'تأكيد كلمة المرور',
            username: 'اسم المستخدم',
            full_name: 'الاسم الكامل',
            phone: 'رقم الهاتف',
            agree_terms: 'أوافق على الشروط والأحكام',
            have_account: 'لدي حساب بالفعل',
            no_account: 'ليس لدي حساب',
            create_account: 'إنشاء حساب جديد',
            login_instead: 'تسجيل الدخول بدلاً من ذلك',
            invalid_credentials: 'بيانات الدخول غير صحيحة',
            account_locked: 'الحساب مغلق مؤقتاً',
            too_many_attempts: 'محاولات كثيرة جداً',
            password_mismatch: 'كلمات المرور غير متطابقة',
            weak_password: 'كلمة المرور ضعيفة جداً',
            email_in_use: 'البريد الإلكتروني مستخدم بالفعل',
            username_in_use: 'اسم المستخدم مستخدم بالفعل'
        },

        // Content
        content: {
            title: 'العنوان',
            content: 'المحتوى',
            description: 'الوصف',
            category: 'الفئة',
            tags: 'العلامات',
            author: 'الكاتب',
            created_at: 'تاريخ الإنشاء',
            updated_at: 'تاريخ التحديث',
            published_at: 'تاريخ النشر',
            status: 'الحالة',
            visibility: 'الرؤية',
            views: 'المشاهدات',
            likes: 'الإعجابات',
            comments: 'التعليقات',
            shares: 'المشاركات',
            create_content: 'إنشاء محتوى جديد',
            edit_content: 'تعديل المحتوى',
            delete_content: 'حذف المحتوى',
            publish_content: 'نشر المحتوى',
            save_draft: 'حفظ كمسودة',
            content_saved: 'تم حفظ المحتوى',
            content_published: 'تم نشر المحتوى',
            content_deleted: 'تم حذف المحتوى',
            no_content: 'لا يوجد محتوى',
            load_more: 'تحميل المزيد',
            read_more: 'قراءة المزيد',
            content_not_found: 'المحتوى غير موجود',
            access_denied: 'غير مسموح بالوصول لهذا المحتوى'
        },

        // Categories
        categories: {
            education: 'تعليم',
            motivation: 'تحفيز',
            leadership: 'قيادة',
            development: 'تنمية',
            community: 'مجتمع',
            business: 'أعمال',
            technology: 'تقنية',
            health: 'صحة',
            sports: 'رياضة',
            arts: 'فنون',
            literature: 'أدب',
            science: 'علم',
            religion: 'دين',
            politics: 'سياسة',
            entertainment: 'ترفيه',
            travel: 'سفر',
            food: 'طعام',
            fashion: 'أزياء',
            other: 'أخرى',
            all_categories: 'جميع الفئات',
            select_category: 'اختر الفئة'
        },

        // User Profile
        profile: {
            personal_info: 'المعلومات الشخصية',
            account_settings: 'إعدادات الحساب',
            privacy_settings: 'إعدادات الخصوصية',
            notification_settings: 'إعدادات الإشعارات',
            profile_picture: 'صورة الملف الشخصي',
            cover_photo: 'صورة الغلاف',
            bio: 'نبذة تعريفية',
            location: 'الموقع',
            website: 'الموقع الإلكتروني',
            social_links: 'روابط التواصل الاجتماعي',
            joined_date: 'تاريخ الانضمام',
            last_active: 'آخر نشاط',
            followers: 'المتابعون',
            following: 'المتابعة',
            posts: 'المنشورات',
            edit_profile: 'تعديل الملف الشخصي',
            change_password: 'تغيير كلمة المرور',
            delete_account: 'حذف الحساب',
            profile_updated: 'تم تحديث الملف الشخصي',
            profile_deleted: 'تم حذف الملف الشخصي'
        },

        // Validation Messages
        validation: {
            required: 'هذا الحقل مطلوب',
            invalid_email: 'يرجى إدخال بريد إلكتروني صحيح',
            invalid_phone: 'يرجى إدخال رقم هاتف صحيح',
            invalid_url: 'يرجى إدخال رابط صحيح',
            min_length: 'يجب أن يكون الطول {min} أحرف على الأقل',
            max_length: 'يجب أن لا يزيد الطول عن {max} حرف',
            password_mismatch: 'كلمات المرور غير متطابقة',
            weak_password: 'كلمة المرور ضعيفة جداً',
            invalid_format: 'التنسيق غير صحيح',
            file_too_large: 'حجم الملف كبير جداً',
            file_type_not_allowed: 'نوع الملف غير مسموح',
            select_option: 'يرجى اختيار خيار'
        },

        // Error Messages
        errors: {
            network_error: 'خطأ في الاتصال بالإنترنت',
            server_error: 'خطأ في الخادم',
            not_found: 'الصفحة غير موجودة',
            unauthorized: 'غير مصرح بالوصول',
            forbidden: 'الوصول ممنوع',
            timeout: 'انتهت مهلة الطلب',
            unknown_error: 'حدث خطأ غير متوقع',
            try_again: 'يرجى المحاولة مرة أخرى',
            contact_support: 'يرجى الاتصال بالدعم الفني'
        },

        // Success Messages
        success: {
            login_successful: 'تم تسجيل الدخول بنجاح',
            register_successful: 'تم إنشاء الحساب بنجاح',
            logout_successful: 'تم تسجيل الخروج بنجاح',
            profile_updated: 'تم تحديث الملف الشخصي بنجاح',
            content_created: 'تم إنشاء المحتوى بنجاح',
            content_updated: 'تم تحديث المحتوى بنجاح',
            content_deleted: 'تم حذف المحتوى بنجاح',
            password_changed: 'تم تغيير كلمة المرور بنجاح',
            email_sent: 'تم إرسال البريد الإلكتروني بنجاح',
            file_uploaded: 'تم رفع الملف بنجاح'
        },

        // Notifications
        notifications: {
            new_message: 'رسالة جديدة',
            new_follower: 'متابع جديد',
            content_liked: 'تم الإعجاب بمحتواك',
            content_commented: 'تعليق جديد على محتواك',
            content_shared: 'تم مشاركة محتواك',
            mention: 'تم ذكرك في منشور',
            system_update: 'تحديث نظام',
            maintenance: 'صيانة مقررة',
            new_feature: 'ميزة جديدة متاحة'
        },

        // Settings
        settings: {
            general: 'عام',
            account: 'الحساب',
            privacy: 'الخصوصية',
            notifications: 'الإشعارات',
            appearance: 'المظهر',
            language: 'اللغة',
            theme: 'السمة',
            light: 'فاتح',
            dark: 'داكن',
            auto: 'تلقائي',
            notifications_enabled: 'تفعيل الإشعارات',
            email_notifications: 'إشعارات البريد الإلكتروني',
            push_notifications: 'إشعارات الدفع',
            profile_visibility: 'رؤية الملف الشخصي',
            public: 'عام',
            private: 'خاص',
            friends: 'الأصدقاء',
            community: 'المجتمع'
        },

        // Search
        search: {
            search_placeholder: 'ابحث عن محتوى أو مستخدمين...',
            no_results: 'لا توجد نتائج',
            search_results: 'نتائج البحث',
            search_in: 'البحث في',
            all_content: 'جميع المحتوى',
            my_content: 'محتواي',
            users: 'المستخدمون',
            categories: 'الفئات',
            tags: 'العلامات',
            recent_searches: 'عمليات البحث الأخيرة',
            clear_history: 'مسح التاريخ',
            advanced_search: 'بحث متقدم'
        },

        // Footer
        footer: {
            about: 'حول المنصة',
            contact: 'اتصل بنا',
            privacy_policy: 'سياسة الخصوصية',
            terms_of_service: 'شروط الخدمة',
            help: 'المساعدة',
            faq: 'الأسئلة الشائعة',
            support: 'الدعم',
            follow_us: 'تابعنا',
            copyright: 'جميع الحقوق محفوظة',
            powered_by: 'مدعوم من'
        },

        // Time
        time: {
            just_now: 'الآن',
            minutes_ago: 'قبل {minutes} دقيقة',
            hours_ago: 'قبل {hours} ساعة',
            days_ago: 'قبل {days} يوم',
            weeks_ago: 'قبل {weeks} أسبوع',
            months_ago: 'قبل {months} شهر',
            years_ago: 'قبل {years} سنة',
            today: 'اليوم',
            yesterday: 'أمس',
            tomorrow: 'غداً'
        },

        // Numbers
        numbers: {
            zero: 'صفر',
            one: 'واحد',
            two: 'اثنان',
            few: 'قليل',
            many: 'كثير',
            other: 'أخرى'
        }
    },

    en: {
        // Navigation
        nav: {
            home: 'Home',
            content: 'Content',
            community: 'Community',
            about: 'About',
            contact: 'Contact',
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            profile: 'Profile',
            settings: 'Settings',
            admin: 'Admin'
        },

        // Common
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            view: 'View',
            share: 'Share',
            like: 'Like',
            comment: 'Comment',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            warning: 'Warning',
            info: 'Info',
            confirm: 'Confirm',
            retry: 'Retry',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            close: 'Close',
            open: 'Open',
            yes: 'Yes',
            no: 'No',
            ok: 'OK',
            search: 'Search',
            filter: 'Filter',
            sort: 'Sort',
            reset: 'Reset',
            submit: 'Submit',
            upload: 'Upload',
            download: 'Download',
            preview: 'Preview',
            copy: 'Copy',
            paste: 'Paste',
            cut: 'Cut',
            select_all: 'Select All',
            deselect_all: 'Deselect All'
        },

        // Authentication
        auth: {
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            forgot_password: 'Forgot Password?',
            reset_password: 'Reset Password',
            change_password: 'Change Password',
            remember_me: 'Remember Me',
            sign_in_with: 'Sign in with',
            sign_up_with: 'Sign up with',
            email: 'Email',
            password: 'Password',
            confirm_password: 'Confirm Password',
            username: 'Username',
            full_name: 'Full Name',
            phone: 'Phone',
            agree_terms: 'I agree to the Terms and Conditions',
            have_account: 'Already have an account',
            no_account: 'Don\'t have an account',
            create_account: 'Create New Account',
            login_instead: 'Login Instead',
            invalid_credentials: 'Invalid credentials',
            account_locked: 'Account temporarily locked',
            too_many_attempts: 'Too many attempts',
            password_mismatch: 'Passwords do not match',
            weak_password: 'Password is too weak',
            email_in_use: 'Email already in use',
            username_in_use: 'Username already in use'
        },

        // Content
        content: {
            title: 'Title',
            content: 'Content',
            description: 'Description',
            category: 'Category',
            tags: 'Tags',
            author: 'Author',
            created_at: 'Created At',
            updated_at: 'Updated At',
            published_at: 'Published At',
            status: 'Status',
            visibility: 'Visibility',
            views: 'Views',
            likes: 'Likes',
            comments: 'Comments',
            shares: 'Shares',
            create_content: 'Create New Content',
            edit_content: 'Edit Content',
            delete_content: 'Delete Content',
            publish_content: 'Publish Content',
            save_draft: 'Save as Draft',
            content_saved: 'Content saved',
            content_published: 'Content published',
            content_deleted: 'Content deleted',
            no_content: 'No content found',
            load_more: 'Load More',
            read_more: 'Read More',
            content_not_found: 'Content not found',
            access_denied: 'Access denied to this content'
        },

        // Categories
        categories: {
            education: 'Education',
            motivation: 'Motivation',
            leadership: 'Leadership',
            development: 'Development',
            community: 'Community',
            business: 'Business',
            technology: 'Technology',
            health: 'Health',
            sports: 'Sports',
            arts: 'Arts',
            literature: 'Literature',
            science: 'Science',
            religion: 'Religion',
            politics: 'Politics',
            entertainment: 'Entertainment',
            travel: 'Travel',
            food: 'Food',
            fashion: 'Fashion',
            other: 'Other',
            all_categories: 'All Categories',
            select_category: 'Select Category'
        },

        // User Profile
        profile: {
            personal_info: 'Personal Information',
            account_settings: 'Account Settings',
            privacy_settings: 'Privacy Settings',
            notification_settings: 'Notification Settings',
            profile_picture: 'Profile Picture',
            cover_photo: 'Cover Photo',
            bio: 'Bio',
            location: 'Location',
            website: 'Website',
            social_links: 'Social Links',
            joined_date: 'Joined Date',
            last_active: 'Last Active',
            followers: 'Followers',
            following: 'Following',
            posts: 'Posts',
            edit_profile: 'Edit Profile',
            change_password: 'Change Password',
            delete_account: 'Delete Account',
            profile_updated: 'Profile updated successfully',
            profile_deleted: 'Profile deleted successfully'
        },

        // Validation Messages
        validation: {
            required: 'This field is required',
            invalid_email: 'Please enter a valid email',
            invalid_phone: 'Please enter a valid phone number',
            invalid_url: 'Please enter a valid URL',
            min_length: 'Must be at least {min} characters',
            max_length: 'Must not exceed {max} characters',
            password_mismatch: 'Passwords do not match',
            weak_password: 'Password is too weak',
            invalid_format: 'Invalid format',
            file_too_large: 'File is too large',
            file_type_not_allowed: 'File type not allowed',
            select_option: 'Please select an option'
        },

        // Error Messages
        errors: {
            network_error: 'Network error',
            server_error: 'Server error',
            not_found: 'Page not found',
            unauthorized: 'Unauthorized access',
            forbidden: 'Access forbidden',
            timeout: 'Request timeout',
            unknown_error: 'An unexpected error occurred',
            try_again: 'Please try again',
            contact_support: 'Please contact support'
        },

        // Success Messages
        success: {
            login_successful: 'Login successful',
            register_successful: 'Registration successful',
            logout_successful: 'Logout successful',
            profile_updated: 'Profile updated successfully',
            content_created: 'Content created successfully',
            content_updated: 'Content updated successfully',
            content_deleted: 'Content deleted successfully',
            password_changed: 'Password changed successfully',
            email_sent: 'Email sent successfully',
            file_uploaded: 'File uploaded successfully'
        },

        // Notifications
        notifications: {
            new_message: 'New message',
            new_follower: 'New follower',
            content_liked: 'Your content was liked',
            content_commented: 'New comment on your content',
            content_shared: 'Your content was shared',
            mention: 'You were mentioned in a post',
            system_update: 'System update',
            maintenance: 'Scheduled maintenance',
            new_feature: 'New feature available'
        },

        // Settings
        settings: {
            general: 'General',
            account: 'Account',
            privacy: 'Privacy',
            notifications: 'Notifications',
            appearance: 'Appearance',
            language: 'Language',
            theme: 'Theme',
            light: 'Light',
            dark: 'Dark',
            auto: 'Auto',
            notifications_enabled: 'Enable notifications',
            email_notifications: 'Email notifications',
            push_notifications: 'Push notifications',
            profile_visibility: 'Profile visibility',
            public: 'Public',
            private: 'Private',
            friends: 'Friends',
            community: 'Community'
        },

        // Search
        search: {
            search_placeholder: 'Search for content or users...',
            no_results: 'No results found',
            search_results: 'Search results',
            search_in: 'Search in',
            all_content: 'All content',
            my_content: 'My content',
            users: 'Users',
            categories: 'Categories',
            tags: 'Tags',
            recent_searches: 'Recent searches',
            clear_history: 'Clear history',
            advanced_search: 'Advanced search'
        },

        // Footer
        footer: {
            about: 'About',
            contact: 'Contact',
            privacy_policy: 'Privacy Policy',
            terms_of_service: 'Terms of Service',
            help: 'Help',
            faq: 'FAQ',
            support: 'Support',
            follow_us: 'Follow us',
            copyright: 'All rights reserved',
            powered_by: 'Powered by'
        },

        // Time
        time: {
            just_now: 'Just now',
            minutes_ago: '{minutes} minutes ago',
            hours_ago: '{hours} hours ago',
            days_ago: '{days} days ago',
            weeks_ago: '{weeks} weeks ago',
            months_ago: '{months} months ago',
            years_ago: '{years} years ago',
            today: 'Today',
            yesterday: 'Yesterday',
            tomorrow: 'Tomorrow'
        },

        // Numbers
        numbers: {
            zero: 'Zero',
            one: 'One',
            two: 'Two',
            few: 'Few',
            many: 'Many',
            other: 'Other'
        }
    }
};

// i18n class for managing translations
export class I18n {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.fallbackLanguage = 'ar';
        this.translations = translations;
    }

    /**
     * Detect user's preferred language
     * @returns {string} Detected language code
     */
    detectLanguage() {
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.isLanguageSupported(urlLang)) {
            return urlLang;
        }

        // Check localStorage
        const storedLang = localStorage.getItem('language');
        if (storedLang && this.isLanguageSupported(storedLang)) {
            return storedLang;
        }

        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        if (this.isLanguageSupported(langCode)) {
            return langCode;
        }

        // Default to Arabic
        return this.fallbackLanguage;
    }

    /**
     * Check if language is supported
     * @param {string} lang - Language code
     * @returns {boolean} Whether language is supported
     */
    isLanguageSupported(lang) {
        return Object.keys(this.translations).includes(lang);
    }

    /**
     * Set current language
     * @param {string} lang - Language code
     */
    setLanguage(lang) {
        if (!this.isLanguageSupported(lang)) {
            throw new Error(`Language '${lang}' is not supported`);
        }

        this.currentLanguage = lang;
        localStorage.setItem('language', lang);

        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language: lang }
        }));

        // Update document direction
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     * @returns {Array} Array of language codes
     */
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    /**
     * Translate key to current language
     * @param {string} key - Translation key (dot notation)
     * @param {Object} params - Parameters for string interpolation
     * @returns {string} Translated string
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        // Navigate through nested object
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                value = undefined;
                break;
            }
        }

        // Fallback to default language
        if (value === undefined && this.currentLanguage !== this.fallbackLanguage) {
            value = this.translations[this.fallbackLanguage];
            for (const k of keys) {
                if (value && typeof value === 'object') {
                    value = value[k];
                } else {
                    value = undefined;
                    break;
                }
            }
        }

        // Fallback to key if translation not found
        if (value === undefined) {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }

        // Handle parameters
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return this.interpolate(value, params);
        }

        return value;
    }

    /**
     * Interpolate parameters in translation string
     * @param {string} string - String with placeholders
     * @param {Object} params - Parameters to interpolate
     * @returns {string} Interpolated string
     */
    interpolate(string, params) {
        return string.replace(/{(\w+)}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Translate with pluralization support
     * @param {string} key - Translation key
     * @param {number} count - Number for pluralization
     * @param {Object} params - Additional parameters
     * @returns {string} Translated string with pluralization
     */
    tPlural(key, count, params = {}) {
        const baseKey = `${key}.${this.getPluralForm(count)}`;
        return this.t(baseKey, { ...params, count });
    }

    /**
     * Get plural form based on count
     * @param {number} count - Number to determine plural form
     * @returns {string} Plural form key
     */
    getPluralForm(count) {
        if (this.currentLanguage === 'ar') {
            if (count === 0) return 'zero';
            if (count === 1) return 'one';
            if (count === 2) return 'two';
            if (count >= 3 && count <= 10) return 'few';
            return 'many';
        } else {
            // English pluralization
            return count === 1 ? 'one' : 'other';
        }
    }

    /**
     * Format number according to current language
     * @param {number} number - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(number) {
        if (this.currentLanguage === 'ar') {
            const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            return number.toString().replace(/\d/g, digit => arabicNumbers[digit]);
        }
        return number.toString();
    }

    /**
     * Format date according to current language
     * @param {Date} date - Date to format
     * @param {Object} options - Formatting options
     * @returns {string} Formatted date
     */
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        return date.toLocaleDateString(this.currentLanguage, {
            ...defaultOptions,
            ...options
        });
    }

    /**
     * Format relative time according to current language
     * @param {Date} date - Date to format
     * @returns {string} Relative time string
     */
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        let key;
        let params;

        if (years > 0) {
            key = 'time.years_ago';
            params = { years };
        } else if (months > 0) {
            key = 'time.months_ago';
            params = { months };
        } else if (weeks > 0) {
            key = 'time.weeks_ago';
            params = { weeks };
        } else if (days > 0) {
            key = 'time.days_ago';
            params = { days };
        } else if (hours > 0) {
            key = 'time.hours_ago';
            params = { hours };
        } else if (minutes > 0) {
            key = 'time.minutes_ago';
            params = { minutes };
        } else {
            return this.t('time.just_now');
        }

        return this.t(key, params);
    }
}

// Create singleton instance
export const i18n = new I18n();

// Initialize language on page load
if (typeof window !== 'undefined') {
    // Set initial language attributes
    document.documentElement.setAttribute('lang', i18n.getLanguage());
    document.documentElement.setAttribute('dir', i18n.getLanguage() === 'ar' ? 'rtl' : 'ltr');

    // Listen for language changes
    window.addEventListener('languagechange', (event) => {
        const newLang = event.detail.language;
        document.documentElement.setAttribute('lang', newLang);
        document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    });

    // Make i18n globally available
    window.i18n = i18n;
}

// Export default
export default i18n;