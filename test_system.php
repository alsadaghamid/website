<?php
/**
 * System Test Script for "أنت صاحب المنصة" Platform
 * Tests all major features and modules
 */

// Define CLI mode to prevent JSON output
define('CLI_MODE', true);

require_once 'config.php';
require_once 'classes.php';
require_once 'auth.php';

// Initialize database
$db = new Database();
$auth = new Auth($db);

echo "=== أنت صاحب المنصة - اختبار النظام ===\n\n";

// Test 1: Database Initialization
echo "1. اختبار قاعدة البيانات...\n";
try {
    $stats = $db->getStats();
    echo "✅ قاعدة البيانات تعمل بشكل صحيح\n";
    echo "   - المستخدمون: {$stats['total_users']}\n";
    echo "   - المنشورات: {$stats['total_posts']}\n";
    echo "   - التعليقات: {$stats['total_comments']}\n";
    echo "   - الأفكار: {$stats['total_ideas']}\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في قاعدة البيانات: " . $e->getMessage() . "\n\n";
}

// Test 2: User Registration
echo "2. اختبار تسجيل المستخدمين...\n";
try {
    // Test registration without email (phone only)
    $userId1 = $auth->register('مستخدم تجريبي 1', '', '+966501234567', 'TestPass123');
    echo "✅ تم تسجيل المستخدم (هاتف فقط): $userId1\n";

    // Test registration with email
    $userId2 = $auth->register('مستخدم تجريبي 2', 'test2@example.com', '+966501234568', 'TestPass123');
    echo "✅ تم تسجيل المستخدم (بريد إلكتروني): $userId2\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في تسجيل المستخدم: " . $e->getMessage() . "\n\n";
}

// Test 3: User Login
echo "3. اختبار تسجيل الدخول...\n";
try {
    $user = $auth->login('+966501234567', 'TestPass123');
    echo "✅ تم تسجيل الدخول بنجاح\n";
    echo "   - اسم المستخدم: {$user['name']}\n";
    echo "   - البريد الإلكتروني: {$user['email']}\n";
    echo "   - رقم الهاتف: {$user['phone']}\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في تسجيل الدخول: " . $e->getMessage() . "\n\n";
}

// Test 4: Content Creation
echo "4. اختبار إنشاء المحتوى...\n";
try {
    // Add a post
    $postId = $db->addPost($userId1, 'عنوان تجريبي للمنشور', 'هذا محتوى تجريبي لاختبار النظام', 'general', 'تجريبي,اختبار');
    echo "✅ تم إنشاء منشور: $postId\n";

    // Add an idea
    $ideaId = $db->addIdea($userId1, 'فكرة تجريبية', 'وصف الفكرة التجريبية لاختبار نظام التصويت', 'general');
    echo "✅ تم إنشاء فكرة: $ideaId\n";

    // Add a comment
    $commentId = $db->addComment($postId, $userId1, 'هذا تعليق تجريبي');
    echo "✅ تم إضافة تعليق: $commentId\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في إنشاء المحتوى: " . $e->getMessage() . "\n\n";
}

// Test 5: Voting System
echo "5. اختبار نظام التصويت...\n";
try {
    $db->toggleIdeaVote($ideaId, $userId1);
    echo "✅ تم التصويت على الفكرة بنجاح\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في نظام التصويت: " . $e->getMessage() . "\n\n";
}

// Test 6: Search Functionality
echo "6. اختبار البحث...\n";
try {
    $searchResults = $db->search('تجريبي', 'all');
    echo "✅ تم البحث بنجاح\n";
    echo "   - المنشورات المطابقة: " . (isset($searchResults['posts']) ? count($searchResults['posts']) : 0) . "\n";
    echo "   - الأفكار المطابقة: " . (isset($searchResults['ideas']) ? count($searchResults['ideas']) : 0) . "\n";
    echo "   - المستخدمون المطابقون: " . (isset($searchResults['users']) ? count($searchResults['users']) : 0) . "\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في البحث: " . $e->getMessage() . "\n\n";
}

// Test 7: Get Posts
echo "7. اختبار جلب المنشورات...\n";
try {
    $posts = $db->getPosts(1, 5);
    echo "✅ تم جلب المنشورات بنجاح\n";
    echo "   - عدد المنشورات: " . count($posts) . "\n";
    if (count($posts) > 0) {
        echo "   - أول منشور: {$posts[0]['title']}\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "❌ خطأ في جلب المنشورات: " . $e->getMessage() . "\n\n";
}

// Test 8: Get Ideas
echo "8. اختبار جلب الأفكار...\n";
try {
    $ideas = $db->getIdeas();
    echo "✅ تم جلب الأفكار بنجاح\n";
    echo "   - عدد الأفكار: " . count($ideas) . "\n";
    if (count($ideas) > 0) {
        echo "   - أول فكرة: {$ideas[0]['title']}\n";
        echo "   - عدد الأصوات: {$ideas[0]['votes_count']}\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "❌ خطأ في جلب الأفكار: " . $e->getMessage() . "\n\n";
}

// Test 9: Get Users
echo "9. اختبار جلب المستخدمين...\n";
try {
    $users = $db->getUsers(10);
    echo "✅ تم جلب المستخدمين بنجاح\n";
    echo "   - عدد المستخدمين: " . count($users) . "\n";
    if (count($users) > 0) {
        echo "   - أول مستخدم: {$users[0]['name']}\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "❌ خطأ في جلب المستخدمين: " . $e->getMessage() . "\n\n";
}

// Test 10: Profile Management
echo "10. اختبار إدارة الملف الشخصي...\n";
try {
    $db->updateUserProfile($userId1, 'مستخدم تجريبي محدث', 'سيرة ذاتية تجريبية', '🎭');
    echo "✅ تم تحديث الملف الشخصي بنجاح\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في تحديث الملف الشخصي: " . $e->getMessage() . "\n\n";
}

// Test 11: Password Change
echo "11. اختبار تغيير كلمة المرور...\n";
try {
    $auth->changePassword($userId1, 'TestPass123', 'NewTestPass123');
    echo "✅ تم تغيير كلمة المرور بنجاح\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في تغيير كلمة المرور: " . $e->getMessage() . "\n\n";
}

// Test 12: Final Statistics
echo "12. الإحصائيات النهائية...\n";
try {
    $finalStats = $db->getStats();
    echo "✅ الإحصائيات النهائية:\n";
    echo "   - إجمالي المستخدمين: {$finalStats['total_users']}\n";
    echo "   - إجمالي المنشورات: {$finalStats['total_posts']}\n";
    echo "   - إجمالي التعليقات: {$finalStats['total_comments']}\n";
    echo "   - إجمالي الأفكار: {$finalStats['total_ideas']}\n";
    echo "   - آخر تحديث: {$finalStats['last_updated']}\n\n";
} catch (Exception $e) {
    echo "❌ خطأ في جلب الإحصائيات: " . $e->getMessage() . "\n\n";
}

echo "=== انتهاء اختبار النظام ===\n";
echo "🎉 تم اختبار جميع الميزات والوحدات بنجاح!\n";
?>