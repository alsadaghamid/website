# أنت صاحب المنصة - دليل المطور

## نظرة عامة

"أنت صاحب المنصة" هو مشروع منصة تفاعلية باللغة العربية تركز على مشاركة المحتوى والتواصل المجتمعي. يهدف المشروع إلى إنشاء بيئة تفاعلية تمكّن المستخدمين من مشاركة أفكارهم وخبراتهم مع الآخرين.

## هيكل المشروع

```
src/
├── config.js          # إعدادات التطبيق
├── constants.js       # الثوابت والقيم الثابتة
├── i18n.js           # نظام الترجمة والتعريب
├── utils/            # الأدوات المساعدة
│   ├── index.js      # نقطة الوصول المركزية
│   ├── helpers.js    # الدوال المساعدة العامة
│   ├── security.js   # أدوات الأمان والحماية
│   ├── validation.js # أدوات التحقق من الصحة
│   ├── ui.js         # أدوات واجهة المستخدم
│   ├── storage.js    # أدوات إدارة البيانات
│   ├── network.js    # أدوات الشبكة وAPI
│   ├── events.js     # نظام الأحداث والمراقبين
│   ├── error-handler.js # معالجة الأخطاء
│   └── README.md     # دليل الأدوات المساعدة
├── components/       # مكونات قابلة للإعادة
├── pages/           # صفحات التطبيق
├── scripts/         # سكريبتات JavaScript
├── styles/          # ملفات CSS
└── assets/          # الموارد الثابتة
```

## البدء السريع

### 1. استيراد الأدوات المساعدة

```javascript
// استيراد جميع الأدوات
import utils from './src/utils/index.js';

// أو استيراد أدوات محددة
import { showNotification, validateInput, apiClient } from './src/utils/index.js';
import { t } from './src/i18n.js';
import { CONTENT_CATEGORIES, HTTP_STATUS } from './src/constants.js';
```

### 2. إعداد اللغة والسمة

```javascript
import { i18n } from './src/i18n.js';
import { themeManager } from './src/utils/index.js';

// تعيين اللغة
i18n.setLanguage('ar');

// تغيير السمة
themeManager.setTheme('dark');
```

### 3. استخدام الأدوات الأساسية

```javascript
// إظهار إشعار
utils.showNotification('تم حفظ البيانات بنجاح', 'success');

// التحقق من صحة البيانات
const result = utils.validateInput('user@example.com', {
    type: 'email',
    required: true
});

// إجراء طلب API
const response = await utils.apiClient.get('/api/content');
```

## الأدوات المتاحة

### نظام الترجمة (i18n)

```javascript
import { i18n } from './src/i18n.js';

// ترجمة نص
const title = i18n.t('nav.home'); // 'الرئيسية'

// ترجمة مع معاملات
const message = i18n.t('validation.min_length', { min: 5 }); // 'يجب أن يكون الطول 5 أحرف على الأقل'

// ترجمة مع جمع
const itemsText = i18n.tPlural('items', 5); // '5 عناصر'

// تنسيق التاريخ
const formattedDate = i18n.formatDate(new Date());

// تنسيق الوقت النسبي
const relativeTime = i18n.formatRelativeTime(new Date(Date.now() - 3600000)); // 'قبل ساعة'
```

### أدوات التحقق من الصحة

```javascript
import { validateField, validateForm, ARABIC_PATTERNS } from './src/utils/validation.js';

// التحقق من حقل واحد
const emailResult = validateField('email', 'user@example.com');
if (!emailResult.isValid) {
    console.log('أخطاء:', emailResult.errors);
}

// التحقق من نموذج كامل
const formData = {
    username: 'user123',
    email: 'user@example.com',
    password: 'SecurePass123!'
};

const formResult = validateForm(formData, ['username', 'email', 'password']);
```

### أدوات واجهة المستخدم

```javascript
import { showNotification, showModal, showConfirm } from './src/utils/ui.js';

// إشعار بسيط
showNotification('تم الحفظ بنجاح', 'success', 3000);

// نافذة منبثقة
showModal({
    title: 'تأكيد الحذف',
    content: '<p>هل أنت متأكد من حذف هذا العنصر؟</p>',
    onConfirm: () => deleteItem(),
    onCancel: () => console.log('تم الإلغاء')
});

// نافذة تأكيد
showConfirm(
    'هل تريد المتابعة؟',
    () => proceed(),
    { confirmText: 'نعم', cancelText: 'لا' }
);
```

### إدارة البيانات والتخزين

```javascript
import { storageManager, userDataManager } from './src/utils/storage.js';

// حفظ بيانات المستخدم
userDataManager.saveProfile({
    name: 'اسم المستخدم',
    email: 'user@example.com'
});

// استرجاع البيانات
const profile = userDataManager.getProfile();

// حفظ تفضيلات
userDataManager.savePreferences({
    theme: 'dark',
    language: 'ar',
    notifications: true
});
```

### طلبات الشبكة وAPI

```javascript
import { apiClient, API_ENDPOINTS } from './src/utils/network.js';

// طلب GET
const content = await apiClient.get(API_ENDPOINTS.CONTENT, {
    params: { page: 1, limit: 10 }
});

// طلب POST
const newContent = await apiClient.post(API_ENDPOINTS.CONTENT, {
    title: 'عنوان جديد',
    content: 'محتوى جديد',
    category: 'تعليم'
});

// رفع ملف
const formData = new FormData();
formData.append('file', fileInput.files[0]);
const uploadResult = await apiClient.upload(API_ENDPOINTS.UPLOAD, formData);
```

### نظام الأحداث

```javascript
import { eventBus, EVENTS } from './src/utils/events.js';

// الاستماع للأحداث
eventBus.on(EVENTS.USER_LOGIN, (userData) => {
    console.log('تم تسجيل الدخول:', userData);
    updateUI(userData);
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

### معالجة الأخطاء

```javascript
import { errorHandler, PlatformError } from './src/utils/error-handler.js';

// معالجة خطأ
try {
    await riskyOperation();
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

## أفضل الممارسات

### 1. معالجة الأخطاء

```javascript
// استخدم try-catch مع async/await
async function createContent(contentData) {
    try {
        const result = await apiClient.post('/api/content', contentData);
        showNotification('تم إنشاء المحتوى بنجاح', 'success');
        return result.data;
    } catch (error) {
        errorHandler.handleError(error, { contentData });
        throw error;
    }
}
```

### 2. التحقق من صحة البيانات

```javascript
// تحقق من البيانات قبل الإرسال
function handleFormSubmit(formData) {
    const validation = validateForm(formData, ['title', 'content', 'category']);

    if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([field, errors]) => {
            showFieldError(field, errors[0]);
        });
        return;
    }

    // إرسال البيانات
    createContent(formData);
}
```

### 3. إدارة حالة التحميل

```javascript
// أظهر مؤشر التحميل أثناء العمليات الطويلة
async function loadContent() {
    const loading = showLoading(container, 'جاري تحميل المحتوى...');

    try {
        const content = await apiClient.get('/api/content');
        renderContent(content.data);
    } catch (error) {
        showNotification('فشل في تحميل المحتوى', 'error');
    } finally {
        hideLoading(loading);
    }
}
```

### 4. استخدام نظام الأحداث

```javascript
// استخدم الأحداث للتواصل بين المكونات
class ContentManager {
    constructor() {
        eventBus.on(EVENTS.CONTENT_UPDATE, this.handleContentUpdate.bind(this));
    }

    async updateContent(contentId, updates) {
        try {
            const result = await apiClient.put(`/api/content/${contentId}`, updates);
            eventBus.emit(EVENTS.CONTENT_UPDATE, result.data);
        } catch (error) {
            errorHandler.handleError(error);
        }
    }

    handleContentUpdate(content) {
        // تحديث واجهة المستخدم
        this.updateContentDisplay(content);
    }
}
```

### 5. التعامل مع اللغات

```javascript
// استخدم نظام الترجمة لجميع النصوص
function renderUserProfile(user) {
    return `
        <div class="profile">
            <h2>${i18n.t('profile.personal_info')}</h2>
            <p><strong>${i18n.t('profile.name')}:</strong> ${user.name}</p>
            <p><strong>${i18n.t('profile.email')}:</strong> ${user.email}</p>
            <p><strong>${i18n.t('profile.location')}:</strong> ${user.location || i18n.t('common.not_specified')}</p>
        </div>
    `;
}
```

## الثوابت والإعدادات

### استخدام الثوابت

```javascript
import { CONTENT_CATEGORIES, HTTP_STATUS, ERROR_CODES } from './src/constants.js';

// استخدام فئات المحتوى
const categories = Object.values(CONTENT_CATEGORIES);

// التحقق من رموز الحالة
if (response.status === HTTP_STATUS.OK) {
    // نجح الطلب
}

// التعامل مع أخطاء محددة
if (error.code === ERROR_CODES.INVALID_CREDENTIALS) {
    showNotification('بيانات الدخول غير صحيحة', 'error');
}
```

### استخدام الإعدادات

```javascript
import config, { configUtils } from './src/config.js';

// التحقق من تفعيل ميزة
if (config.FEATURES.DARK_MODE) {
    // تفعيل الوضع الليلي
}

// الحصول على إعدادات API
const apiUrl = configUtils.getAPIUrl('/content');

// التحقق من البيئة
if (configUtils.isDevelopment()) {
    console.log('وضع التطوير مفعل');
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
- `EVENTS.CONTENT_SHARE` - مشاركة محتوى

### أحداث واجهة المستخدم
- `EVENTS.THEME_CHANGE` - تغيير السمة
- `EVENTS.LANGUAGE_CHANGE` - تغيير اللغة
- `EVENTS.MODAL_OPEN` - فتح نافذة منبثقة
- `EVENTS.MODAL_CLOSE` - إغلاق نافذة منبثقة

### أحداث الشبكة
- `EVENTS.NETWORK_ONLINE` - الاتصال بالإنترنت
- `EVENTS.NETWORK_OFFLINE` - انقطاع الاتصال
- `EVENTS.API_ERROR` - خطأ في API

## الاختبار والتطوير

### تشغيل المشروع محلياً

```bash
# تشغيل الخادم المحلي
php -S localhost:8000

# أو باستخدام Python
python -m http.server 8000

# أو باستخدام Node.js
npx http-server -p 8000
```

### متطلبات التطوير

- متصفح حديث يدعم ES6+
- خادم PHP (للنسخة الكاملة)
- اتصال بالإنترنت (للخطوط والموارد الخارجية)

### الاختبار

```javascript
// اختبار الأدوات المساعدة
import { utils } from './src/utils/index.js';

// اختبار التحقق من الصحة
const testEmail = 'test@example.com';
const result = utils.validateInput(testEmail, { type: 'email' });
console.log('نتيجة التحقق:', result);

// اختبار الترجمة
const translated = utils.i18n.t('common.save');
console.log('الترجمة:', translated);
```

## المساهمة

### إضافة ترجمات جديدة

```javascript
// إضافة ترجمة جديدة في src/i18n.js
const translations = {
    ar: {
        new_section: {
            new_key: 'ترجمة جديدة'
        }
    },
    en: {
        new_section: {
            new_key: 'New translation'
        }
    }
};
```

### إضافة أدوات مساعدة جديدة

```javascript
// إضافة دالة مساعدة في الملف المناسب
export function newHelperFunction(param) {
    // منطق الدالة
    return result;
}

// تصديرها في src/utils/index.js
export { newHelperFunction } from './helpers.js';
```

### إضافة ثوابت جديدة

```javascript
// إضافة ثابت في src/constants.js
export const NEW_CONSTANT = 'value';

// استخدامه
import { NEW_CONSTANT } from './src/constants.js';
```

## الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:

1. راجع ملفات الأدوات المحددة لفهم الوظائف المتاحة
2. تحقق من الأمثلة في هذا الدليل
3. استخدم نظام معالجة الأخطاء للإبلاغ عن المشاكل
4. تواصل مع فريق التطوير للحصول على الدعم

## الترخيص

جميع الملفات والأدوات جزء من مشروع "أنت صاحب المنصة" وتخضع لشروط الترخيص الخاصة بالمشروع.

---

**ملاحظة:** هذا الدليل يغطي الأساسيات. للمزيد من التفاصيل، راجع ملفات الأدوات المحددة وملفات المثال في المشروع.