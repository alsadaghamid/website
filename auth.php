<?php
/**
 * Modern Authentication System for "أنت صاحب المنصة" Platform
 * Features: Secure authentication, JWT tokens, rate limiting, CSRF protection
 */

// Security headers (only for web requests)
if (!defined('CLI_MODE') && php_sapi_name() !== 'cli') {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    header('Content-Type: application/json; charset=utf-8');
}

// Error reporting (disable in production)
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Include configuration and classes
require_once 'config.php';
require_once 'classes.php';

// Start session with secure settings
if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_secure' => isset($_SERVER['HTTPS']),
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict'
    ]);
}

// Rate limiting
$rateLimit = new RateLimit();
if (!$rateLimit->check()) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'تم تجاوز الحد المسموح للطلبات. يرجى المحاولة لاحقاً',
        'error' => 'RATE_LIMIT_EXCEEDED'
    ]);
    exit;
}

// CSRF protection - Skip for GET requests, get_csrf_token, and get_posts
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_POST['action'] ?? $_GET['action'] ?? '';

if ($requestMethod === 'POST' && $action !== 'get_csrf_token' && $action !== 'get_posts') {
    $csrfToken = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!validateCSRFToken($csrfToken)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'رمز CSRF غير صحيح',
            'error' => 'CSRF_TOKEN_INVALID'
        ]);
        exit;
    }
}

// Database initialization
$db = new Database();
$auth = new Auth($db);

// Handle different actions
$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'register':
            handleRegister($auth, $db);
            break;

        case 'login':
            handleLogin($auth, $db);
            break;

        case 'logout':
            handleLogout($auth);
            break;

        case 'refresh_token':
            handleRefreshToken($auth);
            break;

        case 'get_profile':
            handleGetProfile($auth);
            break;

        case 'update_profile':
            handleUpdateProfile($auth, $db);
            break;

        case 'change_password':
            handleChangePassword($auth, $db);
            break;

        case 'forgot_password':
            handleForgotPassword($db);
            break;

        case 'reset_password':
            handleResetPassword($auth, $db);
            break;

        case 'verify_email':
            handleVerifyEmail($auth, $db);
            break;

        case 'add_post':
            handleAddPost($auth, $db);
            break;

        case 'get_posts':
            handleGetPosts($db);
            break;

        case 'get_user_posts':
            handleGetUserPosts($auth, $db);
            break;

        case 'update_post':
            handleUpdatePost($auth, $db);
            break;

        case 'delete_post':
            handleDeletePost($auth, $db);
            break;

        case 'like_post':
            handleLikePost($auth, $db);
            break;

        case 'add_comment':
            handleAddComment($auth, $db);
            break;

        case 'get_comments':
            handleGetComments($db);
            break;

        case 'add_idea':
            handleAddIdea($auth, $db);
            break;

        case 'get_ideas':
            handleGetIdeas($db);
            break;

        case 'vote_idea':
            handleVoteIdea($auth, $db);
            break;

        case 'get_users':
            handleGetUsers($db);
            break;

        case 'search':
            handleSearch($db);
            break;

        case 'upload_avatar':
            handleUploadAvatar($auth, $db);
            break;

        case 'get_stats':
            handleGetStats($db);
            break;

        case 'get_csrf_token':
            handleGetCSRFToken();
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'إجراء غير معروف',
                'error' => 'INVALID_ACTION'
            ]);
    }
} catch (Exception $e) {
    error_log("Auth Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'حدث خطأ داخلي في الخادم',
        'error' => 'INTERNAL_ERROR'
    ]);
}

/**
 * Handle user registration
 */
function handleRegister($auth, $db) {
    // Validate input
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if (empty($name) || (empty($email) && empty($phone))) {
        throw new ValidationException('الاسم والبريد الإلكتروني أو رقم الهاتف مطلوبان');
    }

    if (empty($password) || strlen($password) < 8) {
        throw new ValidationException('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }

    if ($password !== $confirmPassword) {
        throw new ValidationException('كلمات المرور غير متطابقة');
    }

    // Validate email format
    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new ValidationException('صيغة البريد الإلكتروني غير صحيحة');
    }

    // Validate phone format
    if ($phone && !preg_match('/^\+?[\d\s\-\(\)]+$/', $phone)) {
        throw new ValidationException('صيغة رقم الهاتف غير صحيحة');
    }

    // Check if user already exists
    if ($email && $db->userExistsByEmail($email)) {
        throw new ValidationException('البريد الإلكتروني مستخدم بالفعل');
    }

    if ($phone && $db->userExistsByPhone($phone)) {
        throw new ValidationException('رقم الهاتف مستخدم بالفعل');
    }

    // Create user
    $userId = $auth->register($name, $email, $phone, $password);

    // Send verification email
    if ($email) {
        $auth->sendVerificationEmail($email);
    }

    echo json_encode([
        'success' => true,
        'message' => 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني',
        'data' => [
            'user_id' => $userId,
            'requires_verification' => !empty($email)
        ]
    ]);
}

/**
 * Handle user login
 */
function handleLogin($auth, $db) {
    $login = trim($_POST['login'] ?? '');
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']);

    if (empty($login) || empty($password)) {
        throw new ValidationException('بيانات تسجيل الدخول غير مكتملة');
    }

    $user = $auth->login($login, $password, $remember);

    echo json_encode([
        'success' => true,
        'message' => 'تم تسجيل الدخول بنجاح',
        'data' => [
            'user' => $user,
            'token' => $_SESSION['token'] ?? null
        ]
    ]);
}

/**
 * Handle logout
 */
function handleLogout($auth) {
    $auth->logout();
    echo json_encode([
        'success' => true,
        'message' => 'تم تسجيل الخروج بنجاح'
    ]);
}

/**
 * Handle token refresh
 */
function handleRefreshToken($auth) {
    $token = $_POST['token'] ?? '';
    $newToken = $auth->refreshToken($token);

    echo json_encode([
        'success' => true,
        'message' => 'تم تجديد الرمز بنجاح',
        'data' => ['token' => $newToken]
    ]);
}

/**
 * Handle get profile
 */
function handleGetProfile($auth) {
    $user = $auth->getCurrentUser();
    echo json_encode([
        'success' => true,
        'message' => 'تم جلب بيانات الملف الشخصي',
        'data' => $user
    ]);
}

/**
 * Handle profile update
 */
function handleUpdateProfile($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $name = trim($_POST['name'] ?? '');
    $bio = trim($_POST['bio'] ?? '');
    $avatar = trim($_POST['avatar'] ?? '');

    if (empty($name)) {
        throw new ValidationException('الاسم مطلوب');
    }

    $db->updateUserProfile($userId, $name, $bio, $avatar);

    echo json_encode([
        'success' => true,
        'message' => 'تم تحديث الملف الشخصي بنجاح',
        'data' => $auth->getCurrentUser()
    ]);
}

/**
 * Handle password change
 */
function handleChangePassword($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $currentPassword = $_POST['current_password'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if (empty($currentPassword) || empty($newPassword)) {
        throw new ValidationException('جميع الحقول مطلوبة');
    }

    if (strlen($newPassword) < 8) {
        throw new ValidationException('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
    }

    if ($newPassword !== $confirmPassword) {
        throw new ValidationException('كلمات المرور الجديدة غير متطابقة');
    }

    $auth->changePassword($userId, $currentPassword, $newPassword);

    echo json_encode([
        'success' => true,
        'message' => 'تم تغيير كلمة المرور بنجاح'
    ]);
}

/**
 * Handle forgot password
 */
function handleForgotPassword($db) {
    $email = trim($_POST['email'] ?? '');

    if (empty($email)) {
        throw new ValidationException('البريد الإلكتروني مطلوب');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new ValidationException('صيغة البريد الإلكتروني غير صحيحة');
    }

    // Generate reset token
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $db->storePasswordResetToken($email, $token, $expires);

    // Send reset email (implement email sending)
    // sendPasswordResetEmail($email, $token);

    echo json_encode([
        'success' => true,
        'message' => 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    ]);
}

/**
 * Handle password reset
 */
function handleResetPassword($auth, $db) {
    $token = trim($_POST['token'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if (empty($token) || empty($password)) {
        throw new ValidationException('جميع الحقول مطلوبة');
    }

    if ($password !== $confirmPassword) {
        throw new ValidationException('كلمات المرور غير متطابقة');
    }

    $email = $db->getEmailByResetToken($token);

    if (!$email) {
        throw new ValidationException('رمز إعادة التعيين غير صحيح أو منتهي الصلاحية');
    }

    $auth->resetPassword($email, $password);
    $db->deletePasswordResetToken($token);

    echo json_encode([
        'success' => true,
        'message' => 'تم إعادة تعيين كلمة المرور بنجاح'
    ]);
}

/**
 * Handle email verification
 */
function handleVerifyEmail($auth, $db) {
    $token = trim($_GET['token'] ?? '');

    if (empty($token)) {
        throw new ValidationException('رمز التحقق مطلوب');
    }

    $auth->verifyEmail($token);

    echo json_encode([
        'success' => true,
        'message' => 'تم التحقق من البريد الإلكتروني بنجاح'
    ]);
}

/**
 * Handle add post
 */
function handleAddPost($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $title = trim($_POST['title'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $category = trim($_POST['category'] ?? 'general');
    $tags = trim($_POST['tags'] ?? '');
    $featured = isset($_POST['featured']);

    if (empty($title) || empty($content)) {
        throw new ValidationException('العنوان والمحتوى مطلوبان');
    }

    $postId = $db->addPost($userId, $title, $content, $category, $tags, $featured);

    echo json_encode([
        'success' => true,
        'message' => 'تم نشر المحتوى بنجاح',
        'data' => ['post_id' => $postId]
    ]);
}

/**
 * Handle get posts
 */
function handleGetPosts($db) {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 10);
    $category = trim($_GET['category'] ?? '');
    $search = trim($_GET['search'] ?? '');

    $posts = $db->getPosts($page, $limit, $category, $search);
    $total = $db->getPostsCount($category, $search);

    echo json_encode([
        'success' => true,
        'message' => 'تم جلب المشاركات بنجاح',
        'data' => [
            'posts' => $posts,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]
    ]);
}

/**
 * Handle get user posts
 */
function handleGetUserPosts($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $posts = $db->getUserPosts($userId);

    echo json_encode([
        'success' => true,
        'message' => 'تم جلب مشاركات المستخدم بنجاح',
        'data' => $posts
    ]);
}

/**
 * Handle update post
 */
function handleUpdatePost($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $postId = trim($_POST['post_id'] ?? '');
    $title = trim($_POST['title'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $tags = trim($_POST['tags'] ?? '');

    if (empty($postId) || empty($title) || empty($content)) {
        throw new ValidationException('جميع الحقول مطلوبة');
    }

    $db->updatePost($postId, $userId, $title, $content, $category, $tags);

    echo json_encode([
        'success' => true,
        'message' => 'تم تحديث المشاركة بنجاح'
    ]);
}

/**
 * Handle delete post
 */
function handleDeletePost($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $postId = trim($_POST['post_id'] ?? '');

    if (empty($postId)) {
        throw new ValidationException('معرف المشاركة مطلوب');
    }

    $db->deletePost($postId, $userId);

    echo json_encode([
        'success' => true,
        'message' => 'تم حذف المشاركة بنجاح'
    ]);
}

/**
 * Handle like post
 */
function handleLikePost($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $postId = trim($_POST['post_id'] ?? '');

    if (empty($postId)) {
        throw new ValidationException('معرف المشاركة مطلوب');
    }

    $db->togglePostLike($postId, $userId);

    echo json_encode([
        'success' => true,
        'message' => 'تم تحديث الإعجاب بنجاح'
    ]);
}

/**
 * Handle add comment
 */
function handleAddComment($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $postId = trim($_POST['post_id'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $parentId = trim($_POST['parent_id'] ?? null);

    if (empty($postId) || empty($content)) {
        throw new ValidationException('جميع الحقول مطلوبة');
    }

    $commentId = $db->addComment($postId, $userId, $content, $parentId);

    echo json_encode([
        'success' => true,
        'message' => 'تم إضافة التعليق بنجاح',
        'data' => ['comment_id' => $commentId]
    ]);
}

/**
 * Handle get comments
 */
function handleGetComments($db) {
    $postId = trim($_GET['post_id'] ?? '');

    if (empty($postId)) {
        throw new ValidationException('معرف المشاركة مطلوب');
    }

    $comments = $db->getComments($postId);

    echo json_encode([
        'success' => true,
        'message' => 'تم جلب التعليقات بنجاح',
        'data' => $comments
    ]);
}

/**
 * Handle add idea
 */
function handleAddIdea($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $category = trim($_POST['category'] ?? 'general');

    if (empty($title) || empty($description)) {
        throw new ValidationException('العنوان والوصف مطلوبان');
    }

    $ideaId = $db->addIdea($userId, $title, $description, $category);

    echo json_encode([
        'success' => true,
        'message' => 'تم مشاركة الفكرة بنجاح',
        'data' => ['idea_id' => $ideaId]
    ]);
}

/**
 * Handle get ideas
 */
function handleGetIdeas($db) {
    $ideas = $db->getIdeas();

    echo json_encode([
        'success' => true,
        'message' => 'تم جلب الأفكار بنجاح',
        'data' => $ideas
    ]);
}

/**
 * Handle vote idea
 */
function handleVoteIdea($auth, $db) {
    $userId = $auth->getCurrentUserId();
    $ideaId = trim($_POST['idea_id'] ?? '');

    if (empty($ideaId)) {
        throw new ValidationException('معرف الفكرة مطلوب');
    }

    $db->toggleIdeaVote($ideaId, $userId);

    echo json_encode([
        'success' => true,
        'message' => 'تم تحديث التصويت بنجاح'
    ]);
}

/**
 * Handle get users
 */
function handleGetUsers($db) {
    $users = $db->getUsers();

    echo json_encode([
        'success' => true,
        'message' => 'تم جلب المستخدمين بنجاح',
        'data' => $users
    ]);
}

/**
 * Handle search
 */
function handleSearch($db) {
    $query = trim($_GET['q'] ?? '');
    $type = trim($_GET['type'] ?? 'all');

    if (empty($query)) {
        throw new ValidationException('كلمة البحث مطلوبة');
    }

    $results = $db->search($query, $type);

    echo json_encode([
        'success' => true,
        'message' => 'تم البحث بنجاح',
        'data' => $results
    ]);
}

/**
 * Handle avatar upload
 */
function handleUploadAvatar($auth, $db) {
    $userId = $auth->getCurrentUserId();

    if (!isset($_FILES['avatar'])) {
        throw new ValidationException('ملف الصورة مطلوب');
    }

    $file = $_FILES['avatar'];

    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new ValidationException('حدث خطأ في رفع الملف');
    }

    if ($file['size'] > 2 * 1024 * 1024) { // 2MB limit
        throw new ValidationException('حجم الملف كبير جداً (حد أقصى 2 ميجابايت)');
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new ValidationException('نوع الملف غير مدعوم. يرجى استخدام صورة بصيغة JPEG, PNG, GIF أو WebP');
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'avatar_' . $userId . '_' . time() . '.' . $extension;
    $uploadPath = 'uploads/avatars/' . $filename;

    // Create directory if not exists
    if (!file_exists('uploads/avatars')) {
        mkdir('uploads/avatars', 0755, true);
    }

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new ValidationException('فشل في حفظ الملف');
    }

    // Update user avatar
    $db->updateUserAvatar($userId, '/' . $uploadPath);

    echo json_encode([
        'success' => true,
        'message' => 'تم رفع الصورة الشخصية بنجاح',
        'data' => ['avatar' => '/' . $uploadPath]
    ]);
}

/**
 * Handle get stats
 */
function handleGetStats($db) {
    $stats = $db->getStats();

    echo json_encode([
        'success' => true,
        'message' => 'تم جلب الإحصائيات بنجاح',
        'data' => $stats
    ]);
}

/**
 * Handle get CSRF token
 */
function handleGetCSRFToken() {
    $token = generateCSRFToken();

    echo json_encode([
        'success' => true,
        'message' => 'تم جلب رمز CSRF بنجاح',
        'csrf_token' => $token
    ]);
}

/**
 * Validate CSRF token
 */
function validateCSRFToken($token) {
    if (empty($token)) {
        return false;
    }

    $sessionToken = $_SESSION['csrf_token'] ?? '';

    if (empty($sessionToken)) {
        // Generate new token if not exists
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        return false; // Token can't match since it was just generated
    }

    return hash_equals($sessionToken, $token);
}



/**
 * Rate Limiting Class
 */
class RateLimit {
    private $limit = 100; // requests per hour
    private $window = 3600; // 1 hour

    public function check() {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $key = "rate_limit_{$ip}";
        $now = time();

        $requests = $_SESSION[$key] ?? [];

        // Remove old requests
        $requests = array_filter($requests, function($timestamp) use ($now) {
            return ($now - $timestamp) < $this->window;
        });

        if (count($requests) >= $this->limit) {
            return false;
        }

        $requests[] = $now;
        $_SESSION[$key] = $requests;

        return true;
    }
}
?>