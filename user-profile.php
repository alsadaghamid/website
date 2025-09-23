<?php
// This file is included by users.php when viewing a specific user profile

// Check if required variables are set (when accessed directly)
if (!isset($user_data) || !isset($user_posts) || !isset($user_ideas)) {
    // Redirect to users page if accessed directly without proper data
    header('Location: users.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($user_data['name']); ?> - أنت صاحب المنصة</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
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
                <li><a href="#" onclick="showAuthModal()">الملف الشخصي</a></li>
                <li><a href="users.php">المستخدمون</a></li>
                <li><a href="contact.html">تواصل معنا</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="user-profile-section">
            <div class="profile-header-card">
                <div class="profile-avatar-large"><?php echo htmlspecialchars($user_data['avatar']); ?></div>
                <div class="profile-info">
                    <h1><?php echo htmlspecialchars($user_data['name']); ?></h1>
                    <p class="profile-bio"><?php echo htmlspecialchars($user_data['bio'] ?: 'لم يتم إضافة وصف بعد'); ?></p>
                    <div class="profile-meta">
                        <span>انضم: <?php echo date('d/m/Y', strtotime($user_data['join_date'])); ?></span>
                        <?php if ($user_data['country_code']): ?>
                            <span>📍 <?php echo htmlspecialchars($user_data['country_code']); ?></span>
                        <?php endif; ?>
                        <span>🆔 <?php echo htmlspecialchars(substr($user_data['id'], -8)); ?></span>
                    </div>
                    <div class="profile-stats">
                        <div class="stat">
                            <span class="stat-number"><?php echo count($user_posts); ?></span>
                            <span class="stat-label">مشاركة</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number"><?php echo count($user_ideas); ?></span>
                            <span class="stat-label">فكرة</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number"><?php echo rand(10, 100); ?></span>
                            <span class="stat-label">إعجاب</span>
                        </div>
                    </div>
                </div>
                <div class="profile-actions">
                    <button onclick="contactUser()" class="btn-primary">💬 تواصل</button>
                    <button onclick="shareProfile()" class="btn-secondary">📤 مشاركة</button>
                </div>
            </div>

            <div class="profile-tabs">
                <button class="tab-btn active" onclick="showTab('posts')">المشاركات (<?php echo count($user_posts); ?>)</button>
                <button class="tab-btn" onclick="showTab('ideas')">الأفكار (<?php echo count($user_ideas); ?>)</button>
                <button class="tab-btn" onclick="showTab('about')">نبذة</button>
            </div>

            <div id="posts-tab" class="tab-content active">
                <?php if (empty($user_posts)): ?>
                    <div class="no-content">
                        <p>لا توجد مشاركات بعد</p>
                    </div>
                <?php else: ?>
                    <div class="posts-grid">
                        <?php foreach ($user_posts as $post): ?>
                            <div class="post-item">
                                <div class="post-icon">📝</div>
                                <h3><?php echo htmlspecialchars($post['title']); ?></h3>
                                <p><?php echo htmlspecialchars(substr($post['content'], 0, 150)) . '...'; ?></p>
                                <div class="post-meta">
                                    <span><?php echo date('d/m/Y', strtotime($post['date'])); ?></span>
                                    <span><?php echo htmlspecialchars($post['category']); ?></span>
                                </div>
                                <div class="post-actions">
                                    <button onclick="likePost('<?php echo $post['id']; ?>')" class="like-btn">👍 <?php echo $post['likes']; ?></button>
                                    <button onclick="commentPost('<?php echo $post['id']; ?>')" class="comment-btn">💬 <?php echo count($post['comments']); ?></button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <div id="ideas-tab" class="tab-content">
                <?php if (empty($user_ideas)): ?>
                    <div class="no-content">
                        <p>لا توجد أفكار بعد</p>
                    </div>
                <?php else: ?>
                    <div class="ideas-grid">
                        <?php foreach ($user_ideas as $idea): ?>
                            <div class="idea-item">
                                <div class="idea-header">
                                    <h3><?php echo htmlspecialchars($idea['title']); ?></h3>
                                    <span class="idea-status status-<?php echo $idea['status']; ?>">
                                        <?php echo $idea['status'] === 'pending' ? 'قيد المراجعة' : ($idea['status'] === 'approved' ? 'مُعتمدة' : 'مرفوضة'); ?>
                                    </span>
                                </div>
                                <p><?php echo htmlspecialchars($idea['description']); ?></p>
                                <div class="idea-meta">
                                    <span><?php echo htmlspecialchars($idea['category']); ?></span>
                                    <span><?php echo date('d/m/Y', strtotime($idea['date'])); ?></span>
                                </div>
                                <div class="idea-actions">
                                    <button onclick="voteIdea('<?php echo $idea['id']; ?>')" class="vote-btn">👍 <?php echo $idea['votes']; ?></button>
                                    <button onclick="shareIdea('<?php echo $idea['id']; ?>')" class="share-btn">📤 مشاركة</button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <div id="about-tab" class="tab-content">
                <div class="about-content">
                    <h3>نبذة عن <?php echo htmlspecialchars($user_data['name']); ?></h3>
                    <p><?php echo htmlspecialchars($user_data['bio'] ?: 'لم يتم إضافة نبذة شخصية بعد.'); ?></p>

                    <h4>الإحصائيات</h4>
                    <div class="detailed-stats">
                        <div class="stat-row">
                            <span>تاريخ الانضمام:</span>
                            <span><?php echo date('d F Y', strtotime($user_data['join_date'])); ?></span>
                        </div>
                        <div class="stat-row">
                            <span>عدد المشاركات:</span>
                            <span><?php echo count($user_posts); ?></span>
                        </div>
                        <div class="stat-row">
                            <span>عدد الأفكار:</span>
                            <span><?php echo count($user_ideas); ?></span>
                        </div>
                        <div class="stat-row">
                            <span>الحالة:</span>
                            <span class="status-active">نشط</span>
                        </div>
                    </div>

                    <?php if ($user_data['email']): ?>
                        <h4>معلومات التواصل</h4>
                        <p>📧 البريد الإلكتروني متاح للأعضاء المسجلين</p>
                    <?php endif; ?>
                </div>
            </div>
        </section>
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
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            // Remove active class from all buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected tab
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');
        }

        function contactUser() {
            alert('سيتم إضافة خاصية التواصل قريباً');
        }

        function shareProfile() {
            const url = window.location.href;
            if (navigator.share) {
                navigator.share({
                    title: 'ملف شخصي - <?php echo htmlspecialchars($user_data['name']); ?>',
                    text: 'اطلع على ملف <?php echo htmlspecialchars($user_data['name']); ?> في منصة أنت صاحب المنصة',
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    alert('تم نسخ رابط الملف الشخصي');
                });
            }
        }

        function likePost(postId) {
            alert('سيتم إضافة خاصية الإعجاب قريباً');
        }

        function commentPost(postId) {
            alert('سيتم إضافة خاصية التعليقات قريباً');
        }

        function voteIdea(ideaId) {
            alert('سيتم إضافة خاصية التصويت قريباً');
        }

        function shareIdea(ideaId) {
            alert('سيتم إضافة خاصية المشاركة قريباً');
        }
    </script>
</body>
</html>