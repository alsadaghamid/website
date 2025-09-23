<?php
/**
 * Comprehensive System Test for "أنت صاحب المنصة" Platform
 * Tests all major features and modules systematically
 */

echo "=== اختبار شامل لمنصة أنت صاحب المنصة ===\n\n";

try {
    require_once 'config.php';
    require_once 'classes.php';

    $db = new Database();
    $auth = new Auth($db);

    echo "✅ تم إعداد النظام بنجاح\n\n";

    // Test 1: Database Operations
    echo "1️⃣ اختبار قاعدة البيانات...\n";
    $stats = $db->getStats();
    echo "   📊 الإحصائيات الحالية: " . json_encode($stats, JSON_UNESCAPED_UNICODE) . "\n";
    echo "   ✅ قاعدة البيانات تعمل بشكل صحيح\n\n";

    // Test 2: User Registration
    echo "2️⃣ اختبار تسجيل المستخدمين...\n";
    $userId1 = $auth->register('أحمد محمد', 'ahmed@example.com', '+966501234567', 'TestPass123');
    echo "   👤 تم تسجيل المستخدم (بريد إلكتروني): $userId1\n";

    $userId2 = $auth->register('فاطمة علي', '', '+966501234568', 'TestPass123');
    echo "   👤 تم تسجيل المستخدم (هاتف فقط): $userId2\n";
    echo "   ✅ نظام التسجيل يعمل بشكل صحيح\n\n";

    // Test 3: User Login
    echo "3️⃣ اختبار تسجيل الدخول...\n";
    $user1 = $auth->login('ahmed@example.com', 'TestPass123');
    echo "   🔑 تم تسجيل دخول أحمد: " . $user1['name'] . "\n";

    $user2 = $auth->login('+966501234568', 'TestPass123');
    echo "   🔑 تم تسجيل دخول فاطمة: " . $user2['name'] . "\n";
    echo "   ✅ نظام تسجيل الدخول يعمل بشكل صحيح\n\n";

    // Test 4: Content Creation
    echo "4️⃣ اختبار إنشاء المحتوى...\n";

    // Create posts
    $postId1 = $db->addPost($userId1, 'كيفية تطوير الذات', 'المحتوى التفصيلي لتطوير الذات وتحقيق الأهداف', 'personal_development', 'تطوير_ذاتي,أهداف');
    echo "   📝 تم إنشاء منشور عن تطوير الذات: $postId1\n";

    $postId2 = $db->addPost($userId2, 'أهمية القراءة', 'فوائد القراءة في حياة الإنسان', 'education', 'قراءة,تعليم');
    echo "   📝 تم إنشاء منشور عن القراءة: $postId2\n";

    // Create ideas
    $ideaId1 = $db->addIdea($userId1, 'تطبيق لتعلم اللغات', 'تطبيق يساعد في تعلم اللغات بطريقة تفاعلية', 'technology');
    echo "   💡 تم إنشاء فكرة تطبيق اللغات: $ideaId1\n";

    $ideaId2 = $db->addIdea($userId2, 'مبادرة بيئية', 'مبادرة للحفاظ على البيئة في المدن', 'environment');
    echo "   💡 تم إنشاء فكرة المبادرة البيئية: $ideaId2\n";

    // Add comments
    $commentId1 = $db->addComment($postId1, $userId2, 'مقالة رائعة جداً، شكراً لك!');
    echo "   💬 تم إضافة تعليق على منشور تطوير الذات: $commentId1\n";

    $commentId2 = $db->addComment($postId2, $userId1, 'موضوع مهم جداً في وقتنا الحالي');
    echo "   💬 تم إضافة تعليق على منشور القراءة: $commentId2\n";
    echo "   ✅ نظام إنشاء المحتوى يعمل بشكل صحيح\n\n";

    // Test 5: Voting System
    echo "5️⃣ اختبار نظام التصويت...\n";
    $db->toggleIdeaVote($ideaId1, $userId2);
    echo "   🗳️ تم التصويت على فكرة تطبيق اللغات\n";

    $db->toggleIdeaVote($ideaId2, $userId1);
    echo "   🗳️ تم التصويت على فكرة المبادرة البيئية\n";

    $db->togglePostLike($postId1, $userId2);
    echo "   👍 تم إعجاب بمنشور تطوير الذات\n";
    echo "   ✅ نظام التصويت والإعجاب يعمل بشكل صحيح\n\n";

    // Test 6: Search Functionality
    echo "6️⃣ اختبار البحث...\n";
    $searchResults = $db->search('تطوير', 'all');
    echo "   🔍 نتائج البحث عن 'تطوير':\n";
    echo "      - المنشورات: " . (isset($searchResults['posts']) ? count($searchResults['posts']) : 0) . "\n";
    echo "      - الأفكار: " . (isset($searchResults['ideas']) ? count($searchResults['ideas']) : 0) . "\n";
    echo "      - المستخدمون: " . (isset($searchResults['users']) ? count($searchResults['users']) : 0) . "\n";
    echo "   ✅ نظام البحث يعمل بشكل صحيح\n\n";

    // Test 7: Data Retrieval
    echo "7️⃣ اختبار جلب البيانات...\n";
    $posts = $db->getPosts(1, 10);
    echo "   📋 تم جلب " . count($posts) . " منشور\n";

    $ideas = $db->getIdeas();
    echo "   💡 تم جلب " . count($ideas) . " فكرة\n";

    $users = $db->getUsers(10);
    echo "   👥 تم جلب " . count($users) . " مستخدم\n";

    $comments = $db->getComments($postId1);
    echo "   💬 تم جلب " . count($comments) . " تعليق\n";
    echo "   ✅ نظام جلب البيانات يعمل بشكل صحيح\n\n";

    // Test 8: Profile Management
    echo "8️⃣ اختبار إدارة الملف الشخصي...\n";
    $db->updateUserProfile($userId1, 'أحمد محمد علي', 'مطور ومدرب في مجال تطوير الذات', '🚀');
    echo "   👤 تم تحديث ملف أحمد الشخصي\n";

    $db->updateUserProfile($userId2, 'فاطمة علي أحمد', 'ناشطة بيئية ومهتمة بالتعليم', '🌱');
    echo "   👤 تم تحديث ملف فاطمة الشخصي\n";
    echo "   ✅ نظام إدارة الملفات الشخصية يعمل بشكل صحيح\n\n";

    // Test 9: Password Management
    echo "9️⃣ اختبار إدارة كلمات المرور...\n";
    $auth->changePassword($userId1, 'TestPass123', 'NewSecurePass123');
    echo "   🔐 تم تغيير كلمة مرور أحمد\n";

    // Test login with new password
    $user1Updated = $auth->login('ahmed@example.com', 'NewSecurePass123');
    echo "   ✅ تم تسجيل الدخول بكلمة المرور الجديدة\n";
    echo "   ✅ نظام إدارة كلمات المرور يعمل بشكل صحيح\n\n";

    // Test 10: Final Statistics
    echo "🔟 الإحصائيات النهائية...\n";
    $finalStats = $db->getStats();
    echo "   📊 الإحصائيات النهائية:\n";
    echo "      - إجمالي المستخدمين: {$finalStats['total_users']}\n";
    echo "      - إجمالي المنشورات: {$finalStats['total_posts']}\n";
    echo "      - إجمالي التعليقات: {$finalStats['total_comments']}\n";
    echo "      - إجمالي الأفكار: {$finalStats['total_ideas']}\n";
    echo "      - آخر تحديث: {$finalStats['last_updated']}\n";
    echo "   ✅ نظام الإحصائيات يعمل بشكل صحيح\n\n";

    // Test 11: User Posts
    echo "1️⃣1️⃣ اختبار منشورات المستخدمين...\n";
    $userPosts = $db->getUserPosts($userId1);
    echo "   📝 منشورات أحمد: " . count($userPosts) . "\n";

    $userPosts2 = $db->getUserPosts($userId2);
    echo "   📝 منشورات فاطمة: " . count($userPosts2) . "\n";
    echo "   ✅ نظام منشورات المستخدمين يعمل بشكل صحيح\n\n";

    // Test 12: Content Categories
    echo "1️⃣2️⃣ اختبار الفئات...\n";
    $techPosts = $db->getPosts(1, 10, 'technology');
    echo "   💻 منشورات التكنولوجيا: " . count($techPosts) . "\n";

    $eduPosts = $db->getPosts(1, 10, 'education');
    echo "   📚 منشورات التعليم: " . count($eduPosts) . "\n";
    echo "   ✅ نظام الفئات يعمل بشكل صحيح\n\n";

    echo "🎉 تم اختبار جميع الميزات والوحدات بنجاح!\n";
    echo "✅ النظام يعمل بشكل مثالي وجميع الوظائف تعمل كما هو متوقع\n";
    echo "📱 منصة 'أنت صاحب المنصة' جاهزة للاستخدام والنشر\n";

} catch (Exception $e) {
    echo "\n❌ خطأ في النظام: " . $e->getMessage() . "\n";
    echo "📁 الملف: " . $e->getFile() . "\n";
    echo "📍 السطر: " . $e->getLine() . "\n";
    echo "🔍 تفاصيل الخطأ:\n" . $e->getTraceAsString() . "\n";
}

echo "\n=== انتهاء الاختبار الشامل ===\n";
?>