<?php
session_start();
header('Content-Type: text/html; charset=utf-8');

// Database configuration
define('DB_FILE', 'users.json');

// Create users database if not exists
if (!file_exists(DB_FILE)) {
    file_put_contents(DB_FILE, json_encode(['users' => [], 'sessions' => []]));
}

function loadDatabase() {
    return json_decode(file_get_contents(DB_FILE), true);
}

function saveDatabase($data) {
    file_put_contents(DB_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function getCurrentUser() {
    if (!isLoggedIn()) return null;

    $db = loadDatabase();
    foreach ($db['users'] as $user) {
        if ($user['id'] === $_SESSION['user_id']) {
            return $user;
        }
    }
    return null;
}

function getAllUsers() {
    $db = loadDatabase();
    return array_map(function($user) {
        return array_diff_key($user, array_flip(['password']));
    }, $db['users']);
}

function getUserPosts($user_id) {
    $db = loadDatabase();
    foreach ($db['users'] as $user) {
        if ($user['id'] === $user_id && isset($user['posts'])) {
            return $user['posts'];
        }
    }
    return [];
}

function getUserIdeas($user_id) {
    $db = loadDatabase();
    foreach ($db['users'] as $user) {
        if ($user['id'] === $user_id && isset($user['ideas'])) {
            return $user['ideas'];
        }
    }
    return [];
}

// Handle user profile page
if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];
    $db = loadDatabase();

    foreach ($db['users'] as $user) {
        if ($user['id'] === $user_id) {
            $user_data = array_diff_key($user, array_flip(['password']));
            $user_posts = getUserPosts($user_id);
            $user_ideas = getUserIdeas($user_id);

            include 'user-profile.php';
            exit;
        }
    }

    // User not found
    echo "<h1>المستخدم غير موجود</h1>";
    echo "<a href='index.html'>العودة للرئيسية</a>";
    exit;
}

// Handle main users page
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>المستخدمون - أنت صاحب المنصة</title>
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
                    <input type="text" class="search-input" placeholder="ابحث عن مستخدم..." id="user-search">
                    <button class="search-btn" onclick="searchUsers()" title="بحث">
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
        <section class="users-section">
            <h1>مجتمع أنت صاحب المنصة</h1>
            <p>تعرف على أعضاء مجتمعنا النشطين واطلع على إنجازاتهم وأفكارهم</p>

            <div class="users-stats">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <h3 id="total-users">0</h3>
                    <p>عضو مسجل</p>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📝</div>
                    <h3 id="total-posts">0</h3>
                    <p>مشاركة</p>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💡</div>
                    <h3 id="total-ideas">0</h3>
                    <p>فكرة</p>
                </div>
            </div>

            <div class="users-grid" id="users-container">
                <!-- Users will be loaded here -->
            </div>

            <div class="loading-indicator" id="loading-users" style="display: none;">
                <div class="spinner"></div>
                <p>جاري تحميل المستخدمين...</p>
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
        // Load users on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadUsers();
            updateStats();
        });

        function loadUsers() {
            const container = document.getElementById('users-container');
            const loading = document.getElementById('loading-users');

            loading.style.display = 'flex';
            container.innerHTML = '';

            fetch('auth.php?action=get_users')
                .then(response => response.json())
                .then(data => {
                    loading.style.display = 'none';

                    if (data.success) {
                        displayUsers(data.data);
                        updateStats();
                    } else {
                        container.innerHTML = '<p>حدث خطأ في تحميل المستخدمين</p>';
                    }
                })
                .catch(error => {
                    loading.style.display = 'none';
                    container.innerHTML = '<p>حدث خطأ في الاتصال</p>';
                    console.error('Error:', error);
                });
        }

        function displayUsers(users) {
            const container = document.getElementById('users-container');

            if (users.length === 0) {
                container.innerHTML = '<p class="no-users">لا يوجد مستخدمون حالياً. كن أول من ينضم!</p>';
                return;
            }

            users.forEach(user => {
                const userCard = createUserCard(user);
                container.appendChild(userCard);
            });
        }

        function createUserCard(user) {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <div class="user-avatar">${user.avatar}</div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p class="user-bio">${user.bio || 'لم يتم إضافة وصف بعد'}</p>
                    <div class="user-stats">
                        <span class="stat">${user.posts ? user.posts.length : 0} مشاركة</span>
                        <span class="stat">${user.ideas ? user.ideas.length : 0} فكرة</span>
                    </div>
                    <div class="user-meta">
                        <span>انضم: ${new Date(user.join_date).toLocaleDateString('ar-SA')}</span>
                        ${user.country_code ? `<span>📍 ${user.country_code}</span>` : ''}
                    </div>
                </div>
                <div class="user-actions">
                    <button onclick="viewUserProfile('${user.id}')" class="btn-primary">عرض الملف الشخصي</button>
                    <button onclick="contactUser('${user.id}')" class="btn-secondary">تواصل</button>
                </div>
            `;
            return card;
        }

        function viewUserProfile(userId) {
            window.location.href = `users.php?user_id=${userId}`;
        }

        function contactUser(userId) {
            // This would open a contact modal or redirect to contact page
            alert('سيتم إضافة خاصية التواصل قريباً');
        }

        function searchUsers() {
            const searchTerm = document.getElementById('user-search').value;
            if (searchTerm.length < 2) {
                loadUsers();
                return;
            }

            const container = document.getElementById('users-container');
            const loading = document.getElementById('loading-users');

            loading.style.display = 'flex';
            container.innerHTML = '';

            fetch('auth.php?action=get_users')
                .then(response => response.json())
                .then(data => {
                    loading.style.display = 'none';

                    if (data.success) {
                        const filteredUsers = data.data.filter(user =>
                            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
                        );
                        displayUsers(filteredUsers);
                    }
                })
                .catch(error => {
                    loading.style.display = 'none';
                    console.error('Error:', error);
                });
        }

        function updateStats() {
            fetch('auth.php?action=get_users')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const users = data.data;
                        document.getElementById('total-users').textContent = users.length;

                        let totalPosts = 0;
                        let totalIdeas = 0;

                        users.forEach(user => {
                            totalPosts += user.posts ? user.posts.length : 0;
                            totalIdeas += user.ideas ? user.ideas.length : 0;
                        });

                        document.getElementById('total-posts').textContent = totalPosts;
                        document.getElementById('total-ideas').textContent = totalIdeas;
                    }
                });
        }
    </script>
</body>
</html>