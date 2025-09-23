<?php
// Session is managed by config.php and auth.php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول - أنت صاحب المنصة</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        .login-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 2rem;
            background: var(--secondary-bg);
            border-radius: 20px;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .login-header h1 {
            color: var(--accent-gold);
            margin-bottom: 0.5rem;
        }

        .login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-group label {
            color: var(--accent-gold);
            font-weight: 600;
        }

        .form-group input, .form-group select {
            padding: 1rem;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: var(--accent-gold);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .phone-group {
            display: flex;
            gap: 0.5rem;
        }

        .country-code {
            flex: 0 0 80px;
        }

        .phone-input {
            flex: 1;
        }

        .login-btn {
            background: linear-gradient(45deg, var(--accent-orange), #ff6b35);
            color: var(--text-primary);
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }

        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4);
        }

        .login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .switch-mode {
            text-align: center;
            margin-top: 1rem;
            color: var(--text-secondary);
        }

        .switch-mode a {
            color: var(--accent-gold);
            text-decoration: none;
        }

        .switch-mode a:hover {
            color: var(--accent-orange);
        }

        .error-message {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .success-message {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--accent-gold);
            animation: spin 1s ease-in-out infinite;
            margin-right: 0.5rem;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <img src="logo.svg" alt="أنت صاحب المنصة" style="width: 100px; margin-bottom: 1rem;">
            <h1>أنت صاحب المنصة</h1>
            <p>انضم لمجتمعنا وابدأ رحلتك نحو التأثير</p>
        </div>

        <div id="message-container"></div>

        <form class="login-form" id="auth-form">
            <div class="form-group">
                <label for="auth-name">الاسم الكامل</label>
                <input type="text" id="auth-name" required placeholder="أدخل اسمك الكامل">
            </div>

            <div class="form-group">
                <label for="auth-contact">البريد الإلكتروني أو رقم الهاتف</label>
                <input type="text" id="auth-contact" required placeholder="example@email.com أو 1234567890">
            </div>

            <div class="form-group phone-group" id="phone-fields" style="display: none;">
                <select class="country-code" id="country-code">
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+974">🇶🇦 +974</option>
                    <option value="+973">🇧🇭 +973</option>
                    <option value="+965">🇰🇼 +965</option>
                    <option value="+968">🇴🇲 +968</option>
                    <option value="+962">🇯🇴 +962</option>
                    <option value="+961">🇱🇧 +961</option>
                    <option value="+20">🇪🇬 +20</option>
                    <option value="+213">🇩🇿 +213</option>
                    <option value="+216">🇹🇳 +216</option>
                    <option value="+218">🇱🇾 +218</option>
                    <option value="+212">🇲🇦 +212</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                </select>
                <input type="text" class="phone-input" id="phone-number" placeholder="1234567890">
            </div>

            <div class="form-group">
                <label for="auth-password">كلمة المرور</label>
                <input type="password" id="auth-password" required placeholder="أدخل كلمة مرور قوية" minlength="6">
            </div>

            <div class="form-group">
                <label for="auth-method">طريقة المصادقة</label>
                <select id="auth-method" onchange="toggleAuthMethod()">
                    <option value="register">إنشاء حساب جديد</option>
                    <option value="login">تسجيل الدخول</option>
                </select>
            </div>

            <button type="submit" class="login-btn" id="submit-btn">
                إنشاء حساب جديد
            </button>
        </form>

        <div class="switch-mode">
            <a href="index.html">العودة للرئيسية</a>
        </div>
    </div>

    <script>
        let isLoginMode = false;

        function toggleAuthMethod() {
            const method = document.getElementById('auth-method').value;
            const submitBtn = document.getElementById('submit-btn');
            const nameField = document.getElementById('auth-name');

            if (method === 'login') {
                isLoginMode = true;
                submitBtn.textContent = 'تسجيل الدخول';
                nameField.required = false;
                nameField.style.display = 'none';
            } else {
                isLoginMode = false;
                submitBtn.textContent = 'إنشاء حساب جديد';
                nameField.required = true;
                nameField.style.display = 'block';
            }
        }

        function showMessage(message, isError = false) {
            const container = document.getElementById('message-container');
            container.innerHTML = `<div class="${isError ? 'error-message' : 'success-message'}">${message}</div>`;

            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }

        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function validatePhone(phone) {
            const phoneRegex = /^\d{7,15}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        }

        document.getElementById('auth-form').addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span>جاري المعالجة...';

            const name = document.getElementById('auth-name').value;
            const contact = document.getElementById('auth-contact').value;
            const password = document.getElementById('auth-password').value;
            const method = document.getElementById('auth-method').value;

            // Validate input
            if (!isLoginMode && !name.trim()) {
                showMessage('الاسم مطلوب', true);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            if (!contact.trim()) {
                showMessage('البريد الإلكتروني أو رقم الهاتف مطلوب', true);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            if (!password || password.length < 6) {
                showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', true);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            // Prepare data
            const formData = new FormData();
            formData.append('action', method);
            formData.append('password', password);

            if (!isLoginMode) {
                formData.append('name', name);
            }

            // Check if it's email or phone
            if (validateEmail(contact)) {
                formData.append('email', contact);
            } else if (validatePhone(contact)) {
                formData.append('phone', contact);
                formData.append('country_code', document.getElementById('country-code').value);
            } else {
                formData.append('login', contact);
            }

            // Send request
            fetch('auth.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;

                if (data.success) {
                    showMessage(data.message);

                    // Redirect to profile or home page after successful authentication
                    setTimeout(() => {
                        if (data.data && data.data.user) {
                            // Store user info in localStorage for client-side access
                            localStorage.setItem('user', JSON.stringify(data.data.user));
                            localStorage.setItem('token', data.data.token);

                            // Redirect to user profile or home
                            window.location.href = `users.php?user_id=${data.data.user.id}`;
                        } else {
                            window.location.href = 'index.html';
                        }
                    }, 1500);
                } else {
                    showMessage(data.message, true);
                }
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                showMessage('حدث خطأ في الاتصال. حاول مرة أخرى', true);
                console.error('Error:', error);
            });
        });

        // Auto-detect email or phone
        document.getElementById('auth-contact').addEventListener('input', function(e) {
            const value = e.target.value;
            const phoneFields = document.getElementById('phone-fields');

            if (validateEmail(value)) {
                phoneFields.style.display = 'none';
            } else if (validatePhone(value)) {
                phoneFields.style.display = 'flex';
            } else if (value.length > 3) {
                phoneFields.style.display = 'flex';
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            toggleAuthMethod();
        });
    </script>
</body>
</html>