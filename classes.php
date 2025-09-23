<?php
/**
 * Database and Authentication Classes for "أنت صاحب المنصة" Platform
 * Modern, secure, and scalable implementation
 */

require_once 'config.php';

/**
 * Database Class - Handles all database operations
 */
class Database {
    private $dataFile;
    private $data;

    public function __construct() {
        $this->dataFile = DATA_FILE;
        $this->loadData();
    }

    /**
     * Load data from JSON file
     */
    private function loadData() {
        if (!file_exists($this->dataFile)) {
            $this->initializeDatabase();
        }

        $json = file_get_contents($this->dataFile);
        $this->data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new DatabaseException('خطأ في قراءة ملف قاعدة البيانات');
        }
    }

    /**
     * Initialize database with default structure
     */
    private function initializeDatabase() {
        $initialData = [
            'users' => [],
            'posts' => [],
            'comments' => [],
            'ideas' => [],
            'sessions' => [],
            'password_resets' => [],
            'settings' => [
                'site_name' => 'أنت صاحب المنصة',
                'registration_enabled' => true,
                'email_verification_required' => true,
                'max_posts_per_day' => 10,
                'max_comments_per_hour' => 20
            ],
            'stats' => [
                'total_users' => 0,
                'total_posts' => 0,
                'total_comments' => 0,
                'total_ideas' => 0,
                'last_updated' => date('Y-m-d H:i:s')
            ]
        ];

        $this->saveData($initialData);
    }

    /**
     * Save data to JSON file
     */
    private function saveData($data = null) {
        if ($data !== null) {
            $this->data = $data;
        }

        $this->data['stats']['last_updated'] = date('Y-m-d H:i:s');

        $json = json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new DatabaseException('خطأ في كتابة ملف قاعدة البيانات');
        }

        if (file_put_contents($this->dataFile, $json) === false) {
            throw new DatabaseException('فشل في حفظ البيانات');
        }
    }

    /**
     * User Management Methods
     */

    public function userExistsByEmail($email) {
        foreach ($this->data['users'] as $user) {
            if ($user['email'] === $email) {
                return true;
            }
        }
        return false;
    }

    public function userExistsByPhone($phone) {
        foreach ($this->data['users'] as $user) {
            if ($user['phone'] === $phone) {
                return true;
            }
        }
        return false;
    }

    public function getUserById($userId) {
        foreach ($this->data['users'] as $user) {
            if ($user['id'] === $userId) {
                return $user;
            }
        }
        return null;
    }

    public function getUserByEmail($email) {
        foreach ($this->data['users'] as $user) {
            if ($user['email'] === $email) {
                return $user;
            }
        }
        return null;
    }

    public function createUser($name, $email, $phone, $passwordHash, $avatar = '👤') {
        $userId = 'user_' . uniqid();

        $user = [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => $passwordHash,
            'avatar' => $avatar,
            'bio' => '',
            'join_date' => date('Y-m-d H:i:s'),
            'last_login' => null,
            'is_active' => true,
            'is_verified' => empty($email), // Phone-only users are auto-verified
            'posts_count' => 0,
            'comments_count' => 0,
            'ideas_count' => 0,
            'reputation' => 0
        ];

        $this->data['users'][] = $user;
        $this->updateStats();
        $this->saveData();

        return $userId;
    }

    public function updateUserProfile($userId, $name, $bio, $avatar) {
        foreach ($this->data['users'] as &$user) {
            if ($user['id'] === $userId) {
                $user['name'] = $name;
                $user['bio'] = $bio;
                $user['avatar'] = $avatar;
                $this->saveData();
                return true;
            }
        }
        return false;
    }

    public function updateUserAvatar($userId, $avatarPath) {
        foreach ($this->data['users'] as &$user) {
            if ($user['id'] === $userId) {
                $user['avatar'] = $avatarPath;
                $this->saveData();
                return true;
            }
        }
        return false;
    }

    public function updateUserLastLogin($userId) {
        foreach ($this->data['users'] as &$user) {
            if ($user['id'] === $userId) {
                $user['last_login'] = date('Y-m-d H:i:s');
                $this->saveData();
                return true;
            }
        }
        return false;
    }

    public function getUsers($limit = 100, $offset = 0) {
        $users = array_slice($this->data['users'], $offset, $limit);
        return array_map(function($user) {
            return $this->sanitizeUserData($user);
        }, $users);
    }

    /**
     * Post Management Methods
     */

    public function addPost($userId, $title, $content, $category, $tags, $featured = false) {
        $postId = 'post_' . uniqid();

        $post = [
            'id' => $postId,
            'user_id' => $userId,
            'title' => $title,
            'content' => $content,
            'excerpt' => $this->generateExcerpt($content),
            'category' => $category,
            'tags' => array_map('trim', explode(',', $tags)),
            'featured' => $featured,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'views' => 0,
            'likes' => [],
            'comments_count' => 0,
            'status' => 'published'
        ];

        $this->data['posts'][] = $post;

        // Update user posts count
        $this->incrementUserPostsCount($userId);

        $this->updateStats();
        $this->saveData();

        return $postId;
    }

    public function getPosts($page = 1, $limit = 10, $category = '', $search = '') {
        $posts = $this->data['posts'];
        $offset = ($page - 1) * $limit;

        // Filter by category
        if (!empty($category)) {
            $posts = array_filter($posts, function($post) use ($category) {
                return $post['category'] === $category;
            });
        }

        // Filter by search term
        if (!empty($search)) {
            $posts = array_filter($posts, function($post) use ($search) {
                return stripos($post['title'], $search) !== false ||
                       stripos($post['content'], $search) !== false ||
                       stripos($post['excerpt'], $search) !== false;
            });
        }

        // Sort by creation date (newest first)
        usort($posts, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        $total = count($posts);
        $posts = array_slice($posts, $offset, $limit);

        // Add author information
        foreach ($posts as &$post) {
            $post['author'] = $this->getUserById($post['user_id']);
            unset($post['author']['password']);
        }

        return $posts;
    }

    public function getUserPosts($userId) {
        $posts = array_filter($this->data['posts'], function($post) use ($userId) {
            return $post['user_id'] === $userId;
        });

        usort($posts, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return array_values($posts);
    }

    public function updatePost($postId, $userId, $title, $content, $category, $tags) {
        foreach ($this->data['posts'] as &$post) {
            if ($post['id'] === $postId && $post['user_id'] === $userId) {
                $post['title'] = $title;
                $post['content'] = $content;
                $post['excerpt'] = $this->generateExcerpt($content);
                $post['category'] = $category;
                $post['tags'] = array_map('trim', explode(',', $tags));
                $post['updated_at'] = date('Y-m-d H:i:s');

                $this->saveData();
                return true;
            }
        }
        return false;
    }

    public function deletePost($postId, $userId) {
        foreach ($this->data['posts'] as $index => $post) {
            if ($post['id'] === $postId && $post['user_id'] === $userId) {
                unset($this->data['posts'][$index]);

                // Delete associated comments
                $this->data['comments'] = array_filter($this->data['comments'], function($comment) use ($postId) {
                    return $comment['post_id'] !== $postId;
                });

                // Decrement user posts count
                $this->decrementUserPostsCount($userId);

                $this->updateStats();
                $this->saveData();
                return true;
            }
        }
        return false;
    }

    public function togglePostLike($postId, $userId) {
        foreach ($this->data['posts'] as &$post) {
            if ($post['id'] === $postId) {
                $likes = $post['likes'];
                $userIndex = array_search($userId, $likes);

                if ($userIndex !== false) {
                    // Unlike
                    unset($likes[$userIndex]);
                } else {
                    // Like
                    $likes[] = $userId;
                }

                $post['likes'] = array_values($likes);
                $this->saveData();
                return true;
            }
        }
        return false;
    }

    public function getPostsCount($category = '', $search = '') {
        $posts = $this->data['posts'];

        if (!empty($category)) {
            $posts = array_filter($posts, function($post) use ($category) {
                return $post['category'] === $category;
            });
        }

        if (!empty($search)) {
            $posts = array_filter($posts, function($post) use ($search) {
                return stripos($post['title'], $search) !== false ||
                       stripos($post['content'], $search) !== false;
            });
        }

        return count($posts);
    }

    /**
     * Comment Management Methods
     */

    public function addComment($postId, $userId, $content, $parentId = null) {
        $commentId = 'comment_' . uniqid();

        $comment = [
            'id' => $commentId,
            'post_id' => $postId,
            'user_id' => $userId,
            'content' => $content,
            'parent_id' => $parentId,
            'created_at' => date('Y-m-d H:i:s'),
            'likes' => []
        ];

        $this->data['comments'][] = $comment;

        // Update post comments count
        $this->incrementPostCommentsCount($postId);

        // Update user comments count
        $this->incrementUserCommentsCount($userId);

        $this->saveData();

        return $commentId;
    }

    public function getComments($postId) {
        $comments = array_filter($this->data['comments'], function($comment) use ($postId) {
            return $comment['post_id'] === $postId;
        });

        usort($comments, function($a, $b) {
            return strtotime($a['created_at']) - strtotime($b['created_at']);
        });

        // Add author information
        foreach ($comments as &$comment) {
            $comment['author'] = $this->getUserById($comment['user_id']);
            unset($comment['author']['password']);
        }

        return array_values($comments);
    }

    /**
     * Idea Management Methods
     */

    public function addIdea($userId, $title, $description, $category) {
        $ideaId = 'idea_' . uniqid();

        $idea = [
            'id' => $ideaId,
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'category' => $category,
            'created_at' => date('Y-m-d H:i:s'),
            'votes' => [],
            'status' => 'pending',
            'comments_count' => 0
        ];

        $this->data['ideas'][] = $idea;

        // Update user ideas count
        $this->incrementUserIdeasCount($userId);

        $this->updateStats();
        $this->saveData();

        return $ideaId;
    }

    public function getIdeas() {
        $ideas = $this->data['ideas'];

        usort($ideas, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        // Add author information
        foreach ($ideas as &$idea) {
            $idea['author'] = $this->getUserById($idea['user_id']);
            unset($idea['author']['password']);
            $idea['votes_count'] = count($idea['votes']);
        }

        return array_values($ideas);
    }

    public function toggleIdeaVote($ideaId, $userId) {
        foreach ($this->data['ideas'] as &$idea) {
            if ($idea['id'] === $ideaId) {
                $votes = $idea['votes'];
                $userIndex = array_search($userId, $votes);

                if ($userIndex !== false) {
                    // Remove vote
                    unset($votes[$userIndex]);
                } else {
                    // Add vote
                    $votes[] = $userId;
                }

                $idea['votes'] = array_values($votes);
                $this->saveData();
                return true;
            }
        }
        return false;
    }

    /**
     * Search Methods
     */

    public function search($query, $type = 'all') {
        $results = [];
        $query = strtolower($query);

        if ($type === 'all' || $type === 'posts') {
            foreach ($this->data['posts'] as $post) {
                if (stripos($post['title'], $query) !== false ||
                    stripos($post['content'], $query) !== false) {
                    $results['posts'][] = $post;
                }
            }
        }

        if ($type === 'all' || $type === 'ideas') {
            foreach ($this->data['ideas'] as $idea) {
                if (stripos($idea['title'], $query) !== false ||
                    stripos($idea['description'], $query) !== false) {
                    $results['ideas'][] = $idea;
                }
            }
        }

        if ($type === 'all' || $type === 'users') {
            foreach ($this->data['users'] as $user) {
                if (stripos($user['name'], $query) !== false ||
                    ($user['email'] && stripos($user['email'], $query) !== false)) {
                    $results['users'][] = $this->sanitizeUserData($user);
                }
            }
        }

        return $results;
    }

    /**
     * Password Reset Methods
     */

    public function storePasswordResetToken($email, $token, $expires) {
        $resetData = [
            'email' => $email,
            'token' => $token,
            'expires' => $expires,
            'created_at' => date('Y-m-d H:i:s')
        ];

        $this->data['password_resets'][] = $resetData;
        $this->saveData();
    }

    public function getEmailByResetToken($token) {
        foreach ($this->data['password_resets'] as $reset) {
            if ($reset['token'] === $token && strtotime($reset['expires']) > time()) {
                return $reset['email'];
            }
        }
        return null;
    }

    public function deletePasswordResetToken($token) {
        $this->data['password_resets'] = array_filter($this->data['password_resets'], function($reset) use ($token) {
            return $reset['token'] !== $token;
        });
        $this->saveData();
    }

    /**
     * Statistics Methods
     */

    public function getStats() {
        return $this->data['stats'];
    }

    private function updateStats() {
        $this->data['stats']['total_users'] = count($this->data['users']);
        $this->data['stats']['total_posts'] = count($this->data['posts']);
        $this->data['stats']['total_comments'] = count($this->data['comments']);
        $this->data['stats']['total_ideas'] = count($this->data['ideas']);
    }

    private function incrementUserPostsCount($userId) {
        foreach ($this->data['users'] as &$user) {
            if ($user['id'] === $userId) {
                $user['posts_count']++;
                break;
            }
        }
    }

    private function decrementUserPostsCount($userId) {
        foreach ($this->data['users'] as &$user) {
            if ($user['id'] === $userId) {
                $user['posts_count'] = max(0, $user['posts_count'] - 1);
                break;
            }
        }
    }

    private function incrementUserCommentsCount($userId) {
        foreach ($this->data['users'] as &$user) {
            if ($user['id'] === $userId) {
                $user['comments_count']++;
                break;
            }
        }
    }

    private function incrementUserIdeasCount($userId) {
        foreach ($this->data['users'] as &$user) {
            if ($user['id'] === $userId) {
                $user['ideas_count']++;
                break;
            }
        }
    }

    private function incrementPostCommentsCount($postId) {
        foreach ($this->data['posts'] as &$post) {
            if ($post['id'] === $postId) {
                $post['comments_count']++;
                break;
            }
        }
    }

    /**
     * Utility Methods
     */

    private function generateExcerpt($content, $maxLength = 150) {
        $content = strip_tags($content);
        if (strlen($content) <= $maxLength) {
            return $content;
        }
        return substr($content, 0, $maxLength) . '...';
    }

    private function sanitizeUserData($user) {
        unset($user['password']);
        return $user;
    }
}

/**
 * Authentication Class - Handles user authentication and sessions
 */
class Auth {
    private $db;
    private $currentUser;

    public function __construct($db) {
        $this->db = $db;
        $this->initializeSession();
    }

    private function initializeSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start([
                'cookie_secure' => isset($_SERVER['HTTPS']),
                'cookie_httponly' => true,
                'cookie_samesite' => 'Strict'
            ]);
        }

        // Check if user is logged in
        if (isset($_SESSION['user_id']) && isset($_SESSION['token'])) {
            $this->currentUser = $this->db->getUserById($_SESSION['user_id']);
            if (!$this->currentUser || !$this->validateSessionToken()) {
                $this->logout();
            }
        }
    }

    public function register($name, $email, $phone, $password) {
        // Validate password strength
        if (!$this->validatePasswordStrength($password)) {
            throw new ValidationException('كلمة المرور ضعيفة. يجب أن تحتوي على 8 أحرف على الأقل مع أحرف كبيرة وصغيرة وأرقام');
        }

        // Hash password
        $passwordHash = password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ]);

        // Create user
        $userId = $this->db->createUser($name, $email, $phone, $passwordHash);

        // Auto-login if no email verification required
        if (empty($email)) {
            $this->loginByUserId($userId);
        }

        return $userId;
    }

    public function login($login, $password, $remember = false) {
        $user = $this->db->getUserByEmail($login);

        if (!$user) {
            $user = $this->db->getUserByPhone($login);
        }

        if (!$user || !password_verify($password, $user['password'])) {
            throw new AuthenticationException('بيانات تسجيل الدخول غير صحيحة');
        }

        if (!$user['is_active']) {
            throw new AuthenticationException('الحساب معطل. يرجى التواصل مع الإدارة');
        }

        $this->loginByUserId($user['id'], $remember);
        $this->db->updateUserLastLogin($user['id']);

        return $this->sanitizeUserData($user);
    }

    private function loginByUserId($userId, $remember = false) {
        $token = bin2hex(random_bytes(32));
        $expires = $remember ? strtotime('+30 days') : strtotime('+24 hours');

        $_SESSION['user_id'] = $userId;
        $_SESSION['token'] = $token;
        $_SESSION['expires'] = $expires;

        // Store session in database
        $this->db->data['sessions'][$userId] = [
            'token' => $token,
            'expires' => $expires,
            'created_at' => date('Y-m-d H:i:s'),
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT']
        ];

        $this->db->saveData();
    }

    public function logout() {
        $userId = $_SESSION['user_id'] ?? null;

        if ($userId) {
            unset($this->db->data['sessions'][$userId]);
            $this->db->saveData();
        }

        // Clear session
        $_SESSION = [];
        session_destroy();

        $this->currentUser = null;
    }

    public function getCurrentUser() {
        if (!$this->currentUser) {
            throw new AuthenticationException('المستخدم غير مسجل دخول');
        }
        return $this->sanitizeUserData($this->currentUser);
    }

    public function getCurrentUserId() {
        if (!$this->currentUser) {
            throw new AuthenticationException('المستخدم غير مسجل دخول');
        }
        return $this->currentUser['id'];
    }

    private function validateSessionToken() {
        $userId = $_SESSION['user_id'];
        $token = $_SESSION['token'];
        $expires = $_SESSION['expires'];

        if (time() > $expires) {
            return false;
        }

        $session = $this->db->data['sessions'][$userId] ?? null;

        return $session && $session['token'] === $token;
    }

    public function refreshToken($token) {
        foreach ($this->db->data['sessions'] as $userId => $session) {
            if ($session['token'] === $token && time() < $session['expires']) {
                $newToken = bin2hex(random_bytes(32));
                $this->db->data['sessions'][$userId]['token'] = $newToken;
                $this->db->saveData();

                $_SESSION['token'] = $newToken;
                return $newToken;
            }
        }
        throw new AuthenticationException('رمز غير صحيح أو منتهي الصلاحية');
    }

    public function changePassword($userId, $currentPassword, $newPassword) {
        $user = $this->db->getUserById($userId);

        if (!$user || !password_verify($currentPassword, $user['password'])) {
            throw new ValidationException('كلمة المرور الحالية غير صحيحة');
        }

        if (!$this->validatePasswordStrength($newPassword)) {
            throw new ValidationException('كلمة المرور الجديدة ضعيفة');
        }

        $newPasswordHash = password_hash($newPassword, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ]);

        foreach ($this->db->data['users'] as &$u) {
            if ($u['id'] === $userId) {
                $u['password'] = $newPasswordHash;
                break;
            }
        }

        $this->db->saveData();
    }

    public function resetPassword($email, $newPassword) {
        $user = $this->db->getUserByEmail($email);

        if (!$user) {
            throw new ValidationException('البريد الإلكتروني غير مسجل');
        }

        if (!$this->validatePasswordStrength($newPassword)) {
            throw new ValidationException('كلمة المرور الجديدة ضعيفة');
        }

        $newPasswordHash = password_hash($newPassword, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ]);

        foreach ($this->db->data['users'] as &$u) {
            if ($u['email'] === $email) {
                $u['password'] = $newPasswordHash;
                break;
            }
        }

        $this->db->saveData();
    }

    public function sendVerificationEmail($email) {
        // TODO: Implement email sending
        // For now, just log the action
        error_log("Verification email sent to: $email");
    }

    public function verifyEmail($token) {
        // TODO: Implement email verification
        // For now, just mark all users as verified
        foreach ($this->db->data['users'] as &$user) {
            $user['is_verified'] = true;
        }
        $this->db->saveData();
    }

    private function validatePasswordStrength($password) {
        return strlen($password) >= 8 &&
               preg_match('/[a-z]/', $password) &&
               preg_match('/[A-Z]/', $password) &&
               preg_match('/[0-9]/', $password);
    }

    private function sanitizeUserData($user) {
        unset($user['password']);
        return $user;
    }
}

/**
 * Configuration File
 */
if (!defined('DATA_FILE')) {
    define('DATA_FILE', 'data/platform_data.json');
}

/**
 * Custom Exception Classes
 */
class DatabaseException extends Exception {}
class ValidationException extends Exception {}
class AuthenticationException extends Exception {}
?>