<?php
session_start();
header('Content-Type: text/html; charset=utf-8');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

function getCurrentUser() {
    $db_file = 'users.json';
    if (!file_exists($db_file)) return null;

    $db = json_decode(file_get_contents($db_file), true);
    foreach ($db['users'] as $user) {
        if ($user['id'] === $_SESSION['user_id']) {
            return $user;
        }
    }
    return null;
}

$user = getCurrentUser();
if (!$user) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مشاركة المحتوى - أنت صاحب المنصة</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        .share-container {
            max-width: 800px;
            margin: 100px auto;
            padding: 2rem;
        }

        .share-header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: var(--secondary-bg);
            border-radius: 20px;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .share-header h1 {
            color: var(--accent-gold);
            margin-bottom: 1rem;
        }

        .user-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }

        .user-avatar {
            font-size: 2rem;
        }

        .share-form {
            background: var(--secondary-bg);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 2rem;
        }

        .form-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-section h3 {
            color: var(--accent-gold);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 1rem;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--accent-gold);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .content-type-selector {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .type-btn {
            padding: 0.8rem 1.5rem;
            border: 2px solid var(--accent-gold);
            border-radius: 25px;
            background: transparent;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
        }

        .type-btn.active,
        .type-btn:hover {
            background: var(--accent-gold);
            color: var(--primary-bg);
            transform: translateY(-2px);
        }

        .share-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
            flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background: linear-gradient(45deg, var(--accent-orange), #ff6b35);
            color: var(--text-primary);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border: 2px solid var(--accent-gold);
        }

        .btn-secondary:hover {
            background: var(--accent-gold);
            color: var(--primary-bg);
            transform: translateY(-2px);
        }

        .preview-section {
            background: var(--secondary-bg);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .preview-content {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 1rem;
        }

        .preview-title {
            color: var(--accent-gold);
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .preview-meta {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }

        .preview-text {
            color: var(--text-primary);
            line-height: 1.6;
        }

        .character-count {
            text-align: left;
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 0.5rem;
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
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <img src="logo.svg" alt="أنت صاحب المنصة" class="logo-img">
                <span class="logo-text">أنت صاحب المنصة</span>
            </div>
            <div class="nav-controls">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="ابحث في المحتوى..." id="global-search">
                    <button class="search-btn" onclick="performSearch()" title="بحث">
                        <span class="search-icon">🔍</span>
                    </button>
                </div>
                <button class="theme-toggle" onclick="toggleTheme()" title="تبديل الوضع المظلم/الفاتح">
                    <span class="theme-icon">🌙</span>
                </button>
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <ul>
                <li><a href="index.html">الرئيسية</a></li>
                <li><a href="content.html">المحتوى</a></li>
                <li><a href="forum.html">المنتدى</a></li>
                <li><a href="initiatives.html">المبادرات</a></li>
                <li><a href="users.php">المستخدمون</a></li>
                <li><a href="contact.html">تواصل معنا</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="share-container">
            <div class="share-header">
                <h1>مشاركة المحتوى</h1>
                <p>شارك أفكارك وآرائك مع مجتمع أنت صاحب المنصة</p>
                <div class="user-info">
                    <span class="user-avatar"><?php echo htmlspecialchars($user['avatar']); ?></span>
                    <span>مرحباً <?php echo htmlspecialchars($user['name']); ?>!</span>
                </div>
            </div>

            <div id="message-container"></div>

            <form id="share-form" onsubmit="submitContent(event)">
                <div class="share-form">
                    <div class="form-section">
                        <h3>📝 نوع المحتوى</h3>
                        <div class="content-type-selector">
                            <button type="button" class="type-btn active" data-type="post">مشاركة</button>
                            <button type="button" class="type-btn" data-type="idea">فكرة</button>
                            <button type="button" class="type-btn" data-type="article">مقال</button>
                            <button type="button" class="type-btn" data-type="story">قصة</button>
                        </div>
                        <input type="hidden" id="content-type" value="post">
                    </div>

                    <div class="form-section">
                        <h3>📋 المعلومات الأساسية</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="title">العنوان *</label>
                                <input type="text" id="title" required placeholder="أدخل عنوان جذاب للمحتوى">
                            </div>
                            <div class="form-group">
                                <label for="category">الفئة</label>
                                <select id="category">
                                    <option value="general">عام</option>
                                    <option value="education">تعليم</option>
                                    <option value="motivation">تحفيز</option>
                                    <option value="leadership">قيادة</option>
                                    <option value="personal">تطوير شخصي</option>
                                    <option value="community">مجتمع</option>
                                    <option value="environment">بيئة</option>
                                    <option value="health">صحة</option>
                                    <option value="technology">تقنية</option>
                                    <option value="business">أعمال</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>✍️ المحتوى</h3>
                        <div class="form-group">
                            <label for="excerpt">مقتطف مختصر *</label>
                            <textarea id="excerpt" required placeholder="اكتب وصفاً مختصراً يلخص محتواك (150 حرف كحد أقصى)" maxlength="150"></textarea>
                            <div class="character-count">0/150</div>
                        </div>
                        <div class="form-group">
                            <label for="content">المحتوى التفصيلي *</label>
                            <textarea id="content" required placeholder="اكتب محتواك بالتفصيل هنا..."></textarea>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>🏷️ العلامات والإعدادات</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="tags">العلامات (مفصولة بفواصل)</label>
                                <input type="text" id="tags" placeholder="مثال: قيادة، تطوير، شباب، تحفيز">
                            </div>
                            <div class="form-group">
                                <label for="visibility">الرؤية</label>
                                <select id="visibility">
                                    <option value="public">عام - يمكن للجميع رؤيته</option>
                                    <option value="community">مجتمع المنصة فقط</option>
                                    <option value="private">خاص - أنا فقط</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="share-actions">
                        <button type="button" class="btn-secondary" onclick="previewContent()">👁️ معاينة</button>
                        <button type="button" class="btn-secondary" onclick="saveDraft()">💾 حفظ كمسودة</button>
                        <button type="submit" class="btn-primary">🚀 نشر المحتوى</button>
                    </div>
                </div>
            </form>

            <div class="preview-section" id="preview-section" style="display: none;">
                <h3>معاينة المحتوى</h3>
                <div class="preview-content" id="preview-content">
                    <!-- Preview will be shown here -->
                </div>
                <div class="share-actions">
                    <button type="button" class="btn-secondary" onclick="editContent()">✏️ تعديل</button>
                    <button type="button" class="btn-primary" onclick="publishContent()">✅ تأكيد النشر</button>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 أنت صاحب المنصة. جميع الحقوق محفوظة.</p>
        <div class="social-links">
            <a href="https://www.youtube.com/@OwnThePlatform">يوتيوب</a>
            <a href="https://tiktok.com/@youownerplatform">تيك توك</a>
            <a href="https://www.facebook.com/share/1CkQRaaNB9/">فيسبوك</a>
            <a href="https://wa.me/message/QTLJ4LOSGZKJG1">واتساب</a>
        </div>
    </footer>

    <script src="script.js"></script>
    <script>
        let currentContentType = 'post';

        // Handle content type selection
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentContentType = this.dataset.type;
                document.getElementById('content-type').value = currentContentType;

                // Update placeholder text based on type
                const contentTextarea = document.getElementById('content');
                const placeholders = {
                    'post': 'اكتب مشاركتك هنا...',
                    'idea': 'وصف فكرتك بالتفصيل...',
                    'article': 'اكتب مقالك هنا...',
                    'story': 'اكتب قصتك هنا...'
                };
                contentTextarea.placeholder = placeholders[currentContentType] || 'اكتب محتواك هنا...';
            });
        });

        // Character count for excerpt
        document.getElementById('excerpt').addEventListener('input', function() {
            const count = this.value.length;
            const counter = this.parentNode.querySelector('.character-count');
            counter.textContent = `${count}/150`;

            if (count > 150) {
                counter.style.color = '#ef4444';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        });

        function showMessage(message, isError = false) {
            const container = document.getElementById('message-container');
            container.innerHTML = `<div class="${isError ? 'error-message' : 'success-message'}">${message}</div>`;

            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }

        function previewContent() {
            const title = document.getElementById('title').value;
            const excerpt = document.getElementById('excerpt').value;
            const content = document.getElementById('content').value;
            const category = document.getElementById('category').value;

            if (!title || !excerpt || !content) {
                showMessage('يرجى ملء جميع الحقول المطلوبة', true);
                return;
            }

            const previewHTML = `
                <div class="preview-title">${title}</div>
                <div class="preview-meta">
                    <span>الفئة: ${getCategoryName(category)}</span> |
                    <span>النوع: ${getContentTypeName(currentContentType)}</span> |
                    <span>الكاتب: <?php echo htmlspecialchars($user['name']); ?></span>
                </div>
                <div class="preview-text">
                    <strong>المقتطف:</strong> ${excerpt}<br><br>
                    <strong>المحتوى:</strong><br>${content.replace(/\n/g, '<br>')}
                </div>
            `;

            document.getElementById('preview-content').innerHTML = previewHTML;
            document.getElementById('preview-section').style.display = 'block';
            document.querySelector('.share-form').scrollIntoView({ behavior: 'smooth' });
        }

        function editContent() {
            document.getElementById('preview-section').style.display = 'none';
        }

        function publishContent() {
            submitContent(null, true);
        }

        function submitContent(event, isConfirmed = false) {
            if (event) event.preventDefault();

            const title = document.getElementById('title').value;
            const excerpt = document.getElementById('excerpt').value;
            const content = document.getElementById('content').value;
            const category = document.getElementById('category').value;
            const tags = document.getElementById('tags').value;
            const visibility = document.getElementById('visibility').value;

            if (!title || !excerpt || !content) {
                showMessage('يرجى ملء جميع الحقول المطلوبة', true);
                return;
            }

            if (!isConfirmed && document.getElementById('preview-section').style.display === 'none') {
                previewContent();
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('action', currentContentType === 'idea' ? 'add_idea' : 'add_post');
            formData.append('title', title);
            formData.append('description', excerpt);
            formData.append('content', content);
            formData.append('category', category);
            formData.append('tags', tags);
            formData.append('visibility', visibility);

            // Show loading state
            const submitBtn = document.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '⏳ جاري النشر...';

            // Send to server
            fetch('auth.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;

                if (data.success) {
                    showMessage('تم نشر المحتوى بنجاح!');

                    // Reset form
                    document.getElementById('share-form').reset();
                    document.getElementById('preview-section').style.display = 'none';

                    // Redirect to user profile after 2 seconds
                    setTimeout(() => {
                        window.location.href = `users.php?user_id=<?php echo $user['id']; ?>`;
                    }, 2000);
                } else {
                    showMessage(data.message, true);
                }
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                showMessage('حدث خطأ في الاتصال', true);
                console.error('Error:', error);
            });
        }

        function saveDraft() {
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

            if (!title && !content) {
                showMessage('لا يوجد محتوى لحفظه', true);
                return;
            }

            const draft = {
                title: title,
                content: content,
                type: currentContentType,
                timestamp: Date.now()
            };

            const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
            drafts.push(draft);
            localStorage.setItem('drafts', JSON.stringify(drafts));

            showMessage('تم حفظ المسودة');
        }

        function getCategoryName(category) {
            const categories = {
                'general': 'عام',
                'education': 'تعليم',
                'motivation': 'تحفيز',
                'leadership': 'قيادة',
                'personal': 'تطوير شخصي',
                'community': 'مجتمع',
                'environment': 'بيئة',
                'health': 'صحة',
                'technology': 'تقنية',
                'business': 'أعمال'
            };
            return categories[category] || category;
        }

        function getContentTypeName(type) {
            const types = {
                'post': 'مشاركة',
                'idea': 'فكرة',
                'article': 'مقال',
                'story': 'قصة'
            };
            return types[type] || type;
        }

        // Load draft if returning to page
        window.addEventListener('load', function() {
            const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
            if (drafts.length > 0) {
                const lastDraft = drafts[drafts.length - 1];
                if (confirm('هل تريد استكمال المسودة الأخيرة؟')) {
                    document.getElementById('title').value = lastDraft.title;
                    document.getElementById('content').value = lastDraft.content;

                    // Set content type
                    document.querySelector(`[data-type="${lastDraft.type}"]`).click();
                }
            }
        });
    </script>
</body>
</html>