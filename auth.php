<?php
session_start();
header('Content-Type: application/json');

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

function generateToken() {
    return bin2hex(random_bytes(32));
}

function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Handle different actions
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $country_code = trim($_POST['country_code'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($name) || (empty($email) && empty($phone))) {
            sendResponse(false, 'الاسم والبريد الإلكتروني أو رقم الهاتف مطلوبان');
        }

        if (empty($password) || strlen($password) < 6) {
            sendResponse(false, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }

        $db = loadDatabase();

        // Check if user already exists
        foreach ($db['users'] as $user) {
            if ($user['email'] === $email || $user['phone'] === $phone) {
                sendResponse(false, 'المستخدم موجود بالفعل');
            }
        }

        // Create new user
        $user_id = uniqid('user_');
        $new_user = [
            'id' => $user_id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'country_code' => $country_code,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'avatar' => '👤',
            'bio' => '',
            'join_date' => date('Y-m-d H:i:s'),
            'is_active' => true,
            'posts' => [],
            'ideas' => []
        ];

        $db['users'][] = $new_user;
        saveDatabase($db);

        // Auto login
        $_SESSION['user_id'] = $user_id;
        $db['sessions'][$user_id] = [
            'token' => generateToken(),
            'login_time' => date('Y-m-d H:i:s')
        ];
        saveDatabase($db);

        sendResponse(true, 'تم إنشاء الحساب بنجاح', [
            'user' => array_diff_key($new_user, array_flip(['password'])),
            'token' => $db['sessions'][$user_id]['token']
        ]);

    case 'login':
        $login = trim($_POST['login'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($login) || empty($password)) {
            sendResponse(false, 'بيانات تسجيل الدخول غير مكتملة');
        }

        $db = loadDatabase();
        $user = null;

        // Find user
        foreach ($db['users'] as $u) {
            if (($u['email'] === $login || $u['phone'] === $login) && password_verify($password, $u['password'])) {
                $user = $u;
                break;
            }
        }

        if (!$user) {
            sendResponse(false, 'بيانات تسجيل الدخول غير صحيحة');
        }

        // Create session
        $_SESSION['user_id'] = $user['id'];
        $db['sessions'][$user['id']] = [
            'token' => generateToken(),
            'login_time' => date('Y-m-d H:i:s')
        ];
        saveDatabase($db);

        sendResponse(true, 'تم تسجيل الدخول بنجاح', [
            'user' => array_diff_key($user, array_flip(['password'])),
            'token' => $db['sessions'][$user['id']]['token']
        ]);

    case 'logout':
        $user_id = $_SESSION['user_id'] ?? $_POST['user_id'] ?? '';
        if ($user_id) {
            $db = loadDatabase();
            unset($db['sessions'][$user_id]);
            saveDatabase($db);
            session_destroy();
        }
        sendResponse(true, 'تم تسجيل الخروج بنجاح');

    case 'get_profile':
        $user_id = $_SESSION['user_id'] ?? $_POST['user_id'] ?? '';
        if (!$user_id) {
            sendResponse(false, 'غير مصرح لك');
        }

        $db = loadDatabase();
        foreach ($db['users'] as $user) {
            if ($user['id'] === $user_id) {
                sendResponse(true, 'تم جلب بيانات الملف الشخصي', array_diff_key($user, array_flip(['password'])));
            }
        }
        sendResponse(false, 'المستخدم غير موجود');

    case 'update_profile':
        $user_id = $_SESSION['user_id'] ?? '';
        if (!$user_id) {
            sendResponse(false, 'غير مصرح لك');
        }

        $name = trim($_POST['name'] ?? '');
        $bio = trim($_POST['bio'] ?? '');
        $avatar = trim($_POST['avatar'] ?? '👤');

        if (empty($name)) {
            sendResponse(false, 'الاسم مطلوب');
        }

        $db = loadDatabase();
        foreach ($db['users'] as &$user) {
            if ($user['id'] === $user_id) {
                $user['name'] = $name;
                $user['bio'] = $bio;
                $user['avatar'] = $avatar;
                saveDatabase($db);
                sendResponse(true, 'تم تحديث الملف الشخصي', array_diff_key($user, array_flip(['password'])));
            }
        }
        sendResponse(false, 'المستخدم غير موجود');

    case 'add_post':
        $user_id = $_SESSION['user_id'] ?? '';
        if (!$user_id) {
            sendResponse(false, 'غير مصرح لك');
        }

        $title = trim($_POST['title'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $category = trim($_POST['category'] ?? 'general');

        if (empty($title) || empty($content)) {
            sendResponse(false, 'العنوان والمحتوى مطلوبان');
        }

        $db = loadDatabase();
        foreach ($db['users'] as &$user) {
            if ($user['id'] === $user_id) {
                $post = [
                    'id' => uniqid('post_'),
                    'title' => $title,
                    'content' => $content,
                    'category' => $category,
                    'date' => date('Y-m-d H:i:s'),
                    'author' => $user['name'],
                    'likes' => 0,
                    'comments' => []
                ];

                $user['posts'][] = $post;
                saveDatabase($db);
                sendResponse(true, 'تم نشر المحتوى بنجاح', $post);
            }
        }
        sendResponse(false, 'المستخدم غير موجود');

    case 'add_idea':
        $user_id = $_SESSION['user_id'] ?? '';
        if (!$user_id) {
            sendResponse(false, 'غير مصرح لك');
        }

        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $category = trim($_POST['category'] ?? 'general');

        if (empty($title) || empty($description)) {
            sendResponse(false, 'العنوان والوصف مطلوبان');
        }

        $db = loadDatabase();
        foreach ($db['users'] as &$user) {
            if ($user['id'] === $user_id) {
                $idea = [
                    'id' => uniqid('idea_'),
                    'title' => $title,
                    'description' => $description,
                    'category' => $category,
                    'date' => date('Y-m-d H:i:s'),
                    'author' => $user['name'],
                    'status' => 'pending',
                    'votes' => 0
                ];

                $user['ideas'][] = $idea;
                saveDatabase($db);
                sendResponse(true, 'تم مشاركة الفكرة بنجاح', $idea);
            }
        }
        sendResponse(false, 'المستخدم غير موجود');

    case 'get_posts':
        $db = loadDatabase();
        $posts = [];

        foreach ($db['users'] as $user) {
            if (isset($user['posts']) && is_array($user['posts'])) {
                foreach ($user['posts'] as $post) {
                    $posts[] = array_merge($post, ['author_id' => $user['id']]);
                }
            }
        }

        // Sort by date
        usort($posts, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        sendResponse(true, 'تم جلب المشاركات', $posts);

    case 'get_ideas':
        $db = loadDatabase();
        $ideas = [];

        foreach ($db['users'] as $user) {
            if (isset($user['ideas']) && is_array($user['ideas'])) {
                foreach ($user['ideas'] as $idea) {
                    $ideas[] = array_merge($idea, ['author_id' => $user['id']]);
                }
            }
        }

        // Sort by date
        usort($ideas, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        sendResponse(true, 'تم جلب الأفكار', $ideas);

    case 'get_users':
        $db = loadDatabase();
        $users = array_map(function($user) {
            return array_diff_key($user, array_flip(['password', 'posts', 'ideas']));
        }, $db['users']);

        sendResponse(true, 'تم جلب المستخدمين', $users);

    default:
        sendResponse(false, 'إجراء غير معروف');
}
?>