<?php
/**
 * Configuration File for "أنت صاحب المنصة" Platform
 * Contains all configuration constants and settings
 */

// Database Configuration
define('DATA_FILE', 'data/platform_data.json');

// Site Configuration
define('SITE_NAME', 'أنت صاحب المنصة');
define('SITE_URL', 'https://www.antsahib.almunsaa.com');
define('SITE_EMAIL', 'info@antsahib.almunsaa.com');

// Security Configuration
define('ENCRYPTION_KEY', 'your-encryption-key-here'); // Change this in production
define('JWT_SECRET', 'your-jwt-secret-here'); // Change this in production
define('CSRF_TOKEN_LIFETIME', 3600); // 1 hour

// Rate Limiting
define('RATE_LIMIT_REQUESTS', 100); // requests per hour
define('RATE_LIMIT_WINDOW', 3600); // 1 hour

// File Upload Configuration
define('MAX_FILE_SIZE', 2 * 1024 * 1024); // 2MB
define('ALLOWED_FILE_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
define('UPLOAD_PATH', 'uploads/');

// User Configuration
define('DEFAULT_AVATAR', '👤');
define('MIN_PASSWORD_LENGTH', 8);
define('MAX_POSTS_PER_DAY', 10);
define('MAX_COMMENTS_PER_HOUR', 20);

// Email Configuration (for future implementation)
define('SMTP_HOST', 'smtp.example.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@example.com');
define('SMTP_PASSWORD', 'your-password');
define('SMTP_ENCRYPTION', 'tls');

// Social Media Links
define('SOCIAL_LINKS', [
    'youtube' => 'https://www.youtube.com/@OwnThePlatform',
    'tiktok' => 'https://tiktok.com/@youownerplatform',
    'facebook' => 'https://www.facebook.com/share/1CkQRaaNB9/',
    'whatsapp' => 'https://wa.me/message/QTLJ4LOSGZKJG1'
]);

// API Configuration
define('API_VERSION', 'v1');
define('API_BASE_URL', SITE_URL . '/api/' . API_VERSION);

// Error Reporting (set to false in production)
define('DEBUG_MODE', false);

// Timezone
date_default_timezone_set('Asia/Riyadh');

// Error handling
if (!DEBUG_MODE) {
    error_reporting(0);
    ini_set('display_errors', '0');
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
}

// Create necessary directories
$directories = [
    'data',
    'uploads',
    'uploads/avatars',
    'uploads/posts',
    'logs'
];

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Log function for debugging
function logMessage($message, $level = 'INFO') {
    if (!DEBUG_MODE && $level !== 'ERROR') return;

    $logFile = 'logs/platform.log';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] [$level] $message" . PHP_EOL;

    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Security function to generate CSRF token
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Security function to validate CSRF token
function validateCSRFToken($token) {
    if (empty($token)) {
        return false;
    }

    $sessionToken = $_SESSION['csrf_token'] ?? '';

    if (empty($sessionToken)) {
        // Generate new token if not exists
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        return false;
    }

    return hash_equals($sessionToken, $token);
}

// Utility function to sanitize input
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Function to generate secure random string
function generateSecureToken($length = 32) {
    return bin2hex(random_bytes($length));
}

// Function to validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Function to validate phone number
function isValidPhone($phone) {
    // Basic phone validation - adjust regex as needed
    return preg_match('/^\+?[\d\s\-\(\)]+$/', $phone);
}

// Function to get client IP address
function getClientIP() {
    $ip = $_SERVER['REMOTE_ADDR'];

    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    }

    return $ip;
}

// Function to check if request is AJAX
function isAjaxRequest() {
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

// Function to send JSON response
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Function to handle errors
function handleError($message, $code = 500) {
    logMessage($message, 'ERROR');
    sendJsonResponse(['success' => false, 'message' => $message], $code);
}

// Function to handle validation errors
function handleValidationError($message) {
    sendJsonResponse(['success' => false, 'message' => $message, 'error' => 'VALIDATION_ERROR'], 400);
}

// Function to handle authentication errors
function handleAuthError($message) {
    sendJsonResponse(['success' => false, 'message' => $message, 'error' => 'AUTH_ERROR'], 401);
}

// Initialize session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_secure' => isset($_SERVER['HTTPS']),
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict'
    ]);
}
?>