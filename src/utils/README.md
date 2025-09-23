# أدوات المساعدة (Utilities) - أنت صاحب المنصة

هذا الدليل يوضح كيفية استخدام الأدوات المساعدة المتاحة في مشروع "أنت صاحب المنصة".

## نظرة عامة

تم تنظيم الأدوات المساعدة في ملفات منفصلة لتسهيل الصيانة والتطوير:

- `helpers.js` - الدوال المساعدة العامة
- `security.js` - أدوات الأمان والحماية
- `validation.js` - أدوات التحقق من صحة البيانات
- `ui.js` - أدوات واجهة المستخدم
- `storage.js` - أدوات إدارة البيانات والتخزين
- `network.js` - أدوات الشبكة وطلبات API
- `events.js` - نظام الأحداث والمراقبين
- `error-handler.js` - معالجة الأخطاء والاستثناءات
- `index.js` - نقطة الوصول المركزية لجميع الأدوات

## الاستخدام الأساسي

### استيراد الأدوات

```javascript
// استيراد جميع الأدوات
import utils from './src/utils/index.js';

// أو استيراد أدوات محددة
import { showNotification, validateInput, apiClient } from './src/utils/index.js';

// أو استيراد من ملف محدد
import { debounce, formatFileSize } from './src/utils/helpers.js';
import { validateField, ARABIC_PATTERNS } from './src/utils/validation.js';
```

### الوصول العام

جميع الأدوات متاحة أيضاً عبر الكائن العام `window.PlatformUtils`:

```javascript
// استخدام الأدوات عبر الكائن العام
window.PlatformUtils.showNotification('تم حفظ البيانات بنجاح', 'success');
window.PlatformUtils.copyToClipboard('نص للنسخ');
```

## الأدوات المتاحة

### 1. الدوال المساعدة (Helpers)

#### إدارة الوقت والتأخير
```javascript
import { debounce, throttle } from './src/utils/index.js';

// إنشاء دالة مع تأخير
const debouncedSearch = debounce((query) => {
    console.log('البحث عن:', query);
}, 300);

// إنشاء دالة مع تحديد معدل الاستدعاء
const throttledScroll = throttle(() => {
    console.log('تم التمرير');
}, 100);
```

#### تنسيق البيانات
```javascript
import { formatFileSize, formatDate } from './src/utils/index.js';

// تنسيق حجم الملف
const size = formatFileSize(1024000); // "1 م.ب"

// تنسيق التاريخ
const date = formatDate(new Date(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});
```

#### التفاعل مع العناصر
```javascript
import { copyToClipboard, scrollToElement, isInViewport } from './src/utils/index.js';

// نسخ نص إلى الحافظة
await copyToClipboard('نص للنسخ');

// التمرير إلى عنصر
scrollToElement('#target-element', 50);

// التحقق من ظهور العنصر في الشاشة
const visible = isInViewport(document.getElementById('my-element'));
```

### 2. أدوات الأمان (Security)

#### التحقق من صحة المدخلات
```javascript
import { validateInput, isValidEmail, isValidPhone } from './src/utils/index.js';

// التحقق من البريد الإلكتروني
const emailResult = validateInput('user@example.com', {
    type: 'email',
    required: true
});

if (!emailResult.isValid) {
    console.log('أخطاء:', emailResult.errors);
}

// التحقق من رقم الهاتف
const phoneResult = validateInput('+966501234567', {
    type: 'phone',
    required: true
});
```

#### الحماية من الهجمات
```javascript
import { sanitizeHtml, preventXSS, preventSQLInjection } from './src/utils/index.js';

// تنظيف محتوى HTML
const cleanHtml = sanitizeHtml('<script>alert("xss")</script>');

// منع هجمات XSS
const safeContent = preventXSS(userInput);

// منع هجمات SQL Injection
const safeQuery = preventSQLInjection(userInput);
```

#### إدارة الجلسات والرموز
```javascript
import { CSRFProtection, generateSecureToken } from './src/utils/index.js';

// إنشاء رمز CSRF
const csrf = new CSRFProtection();

// إنشاء رمز آمن
const token = generateSecureToken(32);
```

### 3. أدوات التحقق من الصحة (Validation)

#### التحقق من الحقول
```javascript
import { validateField, validateForm, VALIDATION_RULES } from './src/utils/index.js';

// التحقق من حقل واحد
const result = validateField('email', 'user@example.com');
if (!result.isValid) {
    console.log('أخطاء:', result.errors);
}

// التحقق من نموذج كامل
const formData = {
    username: 'user123',
    email: 'user@example.com',
    password: 'password123'
};

const formResult = validateForm(formData, ['username', 'email', 'password']);
if (!formResult.isValid) {
    console.log('أخطاء النموذج:', formResult.errors);
}
```

#### التحقق من التسجيل والمحتوى
```javascript
import { validateUserRegistration, validateContentCreation } from './src/utils/index.js';

// التحقق من بيانات التسجيل
const userData = {
    username: 'user123',
    email: 'user@example.com',
    password: 'SecurePass123!',
    name: 'اسم المستخدم',
    phone: '+966501234567'
};

const registrationResult = validateUserRegistration(userData);

// التحقق من محتوى جديد
const contentData = {
    title: 'عنوان المحتوى',
    content: 'محتوى مفصل...',
    category: 'تعليم'
};

const contentResult = validateContentCreation(contentData);
```

#### أنماط النصوص العربية
```javascript
import { ARABIC_PATTERNS, containsArabic, isPrimarilyArabic } from './src/utils/index.js';

// التحقق من احتواء النص على العربية
const hasArabic = containsArabic('مرحبا بالعالم');

// التحقق من أن النص بالعربية بشكل أساسي
const isArabic = isPrimarilyArabic('هذا نص باللغة العربية', 0.7);
```

### 4. أدوات واجهة المستخدم (UI)

#### الإشعارات
```javascript
import { showNotification, showConfirm, showAlert } from './src/utils/index.js';

// إظهار إشعار
showNotification('تم حفظ البيانات بنجاح', 'success', 3000);

// إظهار نافذة تأكيد
showConfirm(
    'هل أنت متأكد من حذف هذا العنصر؟',
    () => {
        console.log('تم التأكيد');
    },
    {
        confirmText: 'حذف',
        cancelText: 'إلغاء'
    }
);

// إظهار تنبيه
showAlert('يرجى ملء جميع الحقول المطلوبة');
```

#### مؤشرات التحميل
```javascript
import { showLoading, hideLoading } from './src/utils/index.js';

// إظهار مؤشر التحميل
const loading = showLoading(document.getElementById('container'), 'جاري التحميل...');

// إخفاء مؤشر التحميل
hideLoading(loading);
```

#### النوافذ المنبثقة
```javascript
import { showModal } from './src/utils/index.js';

// إظهار نافذة منبثقة
const modal = showModal({
    title: 'تعديل الملف الشخصي',
    content: '<p>محتوى النافذة هنا</p>',
    size: 'medium',
    onConfirm: () => {
        console.log('تم التأكيد');
    },
    onCancel: () => {
        console.log('تم الإلغاء');
    }
});
```

### 5. أدوات التخزين (Storage)

#### إدارة البيانات المحلية
```javascript
import { storageManager, userDataManager } from './src/utils/index.js';

// حفظ بيانات المستخدم
userDataManager.saveProfile({
    name: 'اسم المستخدم',
    email: 'user@example.com'
});

// استرجاع بيانات المستخدم
const profile = userDataManager.getProfile();

// حفظ تفضيلات المستخدم
userDataManager.savePreferences({
    theme: 'dark',
    language: 'ar',
    notifications: true
});
```

#### إدارة الجلسات
```javascript
import { sessionManager } from './src/utils/index.js';

// حفظ بيانات الجلسة
sessionManager.set('current_user', { id: 123, name: 'user' });

// استرجاع بيانات الجلسة
const user = sessionManager.get('current_user');

// التحقق من تسجيل الدخول
const isLoggedIn = userDataManager.isLoggedIn();
```

#### التخزين المؤقت
```javascript
import { cacheManager } from './src/utils/index.js';

// حفظ بيانات مؤقتة
cacheManager.set('api_data', { users: [] }, 300000); // 5 دقائق

// استرجاع البيانات المؤقتة
const data = cacheManager.get('api_data');

// التحقق من وجود البيانات
const exists = cacheManager.has('api_data');
```

### 6. أدوات الشبكة (Network)

#### طلبات API
```javascript
import { apiClient, API_ENDPOINTS } from './src/utils/index.js';

// طلب GET
const response = await apiClient.get(API_ENDPOINTS.CONTENT_LIST, {
    params: { page: 1, limit: 10 }
});

// طلب POST
const result = await apiClient.post(API_ENDPOINTS.CONTENT_CREATE, {
    title: 'عنوان جديد',
    content: 'محتوى جديد'
});

// رفع ملف
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResult = await apiClient.upload(API_ENDPOINTS.UPLOAD_FILE, formData);
```

#### إدارة الأخطاء
```javascript
import { APIError } from './src/utils/index.js';

try {
    const response = await apiClient.get('/api/data');
    console.log(response.data);
} catch (error) {
    if (error instanceof APIError) {
        console.log('خطأ API:', error.status, error.message);
    }
}
```

#### معدل الطلبات
```javascript
import { rateLimiter } from './src/utils/index.js';

// التحقق من إمكانية إجراء الطلب
if (rateLimiter.canMakeRequest()) {
    rateLimiter.recordRequest();
    // إجراء الطلب
}
```

### 7. نظام الأحداث (Events)

#### إدارة الأحداث
```javascript
import { eventBus, EVENTS } from './src/utils/index.js';

// الاستماع للأحداث
eventBus.on(EVENTS.USER_LOGIN, (userData) => {
    console.log('تم تسجيل الدخول:', userData);
});

// إرسال حدث
eventBus.emit(EVENTS.CONTENT_CREATE, {
    id: 123,
    title: 'محتوى جديد'
});

// الاستماع لمرة واحدة
eventBus.once(EVENTS.CONTENT_DELETE, (contentId) => {
    console.log('تم حذف المحتوى:', contentId);
});
```

#### مراقبة الصفحة
```javascript
import { pageVisibilityManager } from './src/utils/index.js';

// مراقبة ظهور/إخفاء الصفحة
pageVisibilityManager.addListener((state) => {
    if (state === 'visible') {
        console.log('الصفحة مرئية');
    } else {
        console.log('الصفحة مخفية');
    }
});
```

#### إدارة السمات
```javascript
import { themeManager } from './src/utils/index.js';

// تغيير السمة
themeManager.setTheme('dark');

// تبديل السمة
themeManager.toggleTheme();

// مراقبة تغييرات السمة
themeManager.addListener((theme) => {
    console.log('تم تغيير السمة إلى:', theme);
});
```

### 8. معالجة الأخطاء (Error Handler)

#### معالجة الأخطاء الأساسية
```javascript
import { errorHandler, PlatformError } from './src/utils/index.js';

// معالجة خطأ
try {
    // عملية قد تفشل
    riskyOperation();
} catch (error) {
    errorHandler.handleError(error, {
        userId: currentUser.id,
        operation: 'riskyOperation'
    });
}

// إنشاء خطأ مخصص
const customError = new PlatformError(
    'خطأ في حفظ البيانات',
    'SAVE_ERROR',
    { originalError: error }
);
```

#### معالجة أخطاء النماذج
```javascript
import { FormErrorHandler } from './src/utils/index.js';

// إنشاء معالج أخطاء للنموذج
const formErrorHandler = new FormErrorHandler(document.getElementById('myForm'));

// إظهار خطأ في حقل
formErrorHandler.showFieldError('email', 'يرجى إدخال بريد إلكتروني صحيح');

// مسح جميع الأخطاء
formErrorHandler.clearAllErrors();
```

#### إعادة المحاولة
```javascript
import { retryManager } from './src/utils/index.js';

// تنفيذ عملية مع إعادة المحاولة
const result = await retryManager.execute(async () => {
    const response = await apiClient.get('/api/data');
    return response.data;
}, {
    maxRetries: 3,
    baseDelay: 1000
});
```

## أفضل الممارسات

### 1. معالجة الأخطاء
```javascript
// دائماً استخدم try-catch مع العمليات غير الآمنة
try {
    const result = await apiClient.post('/api/data', formData);
    showNotification('تم الحفظ بنجاح', 'success');
} catch (error) {
    errorHandler.handleError(error, { form: 'createForm' });
}
```

### 2. التحقق من صحة البيانات
```javascript
// تحقق من البيانات قبل الإرسال
const validationResult = validateForm(formData, ['title', 'content', 'category']);
if (!validationResult.isValid) {
    // عرض الأخطاء للمستخدم
    Object.entries(validationResult.errors).forEach(([field, errors]) => {
        formErrorHandler.showFieldError(field, errors[0]);
    });
    return;
}
```

### 3. إدارة حالة التحميل
```javascript
// أظهر مؤشر التحميل أثناء العمليات الطويلة
const loading = showLoading(container, 'جاري الحفظ...');

try {
    await saveData();
    showNotification('تم الحفظ بنجاح', 'success');
} catch (error) {
    showNotification('فشل في الحفظ', 'error');
} finally {
    hideLoading(loading);
}
```

### 4. استخدام نظام الأحداث
```javascript
// استخدم نظام الأحداث للتواصل بين المكونات
eventBus.on(EVENTS.CONTENT_UPDATE, (content) => {
    // تحديث واجهة المستخدم
    updateContentDisplay(content);
});

// أرسل أحداث عند التغييرات المهمة
function updateContent(content) {
    // ... منطق التحديث
    eventBus.emit(EVENTS.CONTENT_UPDATE, content);
}
```

## الأحداث المتاحة

### أحداث المستخدم
- `EVENTS.USER_LOGIN` - تسجيل دخول مستخدم
- `EVENTS.USER_LOGOUT` - تسجيل خروج مستخدم
- `EVENTS.USER_REGISTER` - تسجيل مستخدم جديد
- `EVENTS.USER_PROFILE_UPDATE` - تحديث ملف شخصي

### أحداث المحتوى
- `EVENTS.CONTENT_CREATE` - إنشاء محتوى جديد
- `EVENTS.CONTENT_UPDATE` - تحديث محتوى
- `EVENTS.CONTENT_DELETE` - حذف محتوى
- `EVENTS.CONTENT_LIKE` - إعجاب بمحتوى
- `EVENTS.CONTENT_BOOKMARK` - إضافة محتوى للمفضلة

### أحداث واجهة المستخدم
- `EVENTS.MODAL_OPEN` - فتح نافذة منبثقة
- `EVENTS.MODAL_CLOSE` - إغلاق نافذة منبثقة
- `EVENTS.NOTIFICATION_SHOW` - إظهار إشعار
- `EVENTS.THEME_CHANGE` - تغيير السمة

### أحداث الشبكة
- `EVENTS.NETWORK_ONLINE` - الاتصال بالإنترنت
- `EVENTS.NETWORK_OFFLINE` - انقطاع الاتصال
- `EVENTS.API_ERROR` - خطأ في API
- `EVENTS.REQUEST_START` - بدء طلب
- `EVENTS.REQUEST_END` - انتهاء طلب

## الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:

1. راجع ملفات الأدوات المحددة لفهم الوظائف المتاحة
2. تحقق من الأمثلة في هذا الدليل
3. استخدم نظام معالجة الأخطاء للإبلاغ عن المشاكل
4. تواصل مع فريق التطوير للحصول على الدعم

## الترخيص

جميع الأدوات المساعدة جزء من مشروع "أنت صاحب المنصة" وتخضع لشروط الترخيص الخاصة بالمشروع.