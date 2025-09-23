<?php
echo "=== اختبار شامل للنظام ===\n\n";

try {
    require_once 'config.php';
    echo "✅ تم تحميل config.php\n";

    require_once 'classes.php';
    echo "✅ تم تحميل classes.php\n";

    $db = new Database();
    echo "✅ تم إنشاء Database\n";

    $auth = new Auth($db);
    echo "✅ تم إنشاء Auth\n";

    // Test 1: Database Stats
    echo "\n1. اختبار قاعدة البيانات...\n";
    $stats = $db->getStats();
    echo "✅ الإحصائيات: " . json_encode($stats, JSON_UNESCAPED_UNICODE) . "\n";

    // Test 2: User Registration
    echo "\n2. اختبار تسجيل المستخدمين...\n";
    $userId1 = $auth->register('مستخدم تجريبي 1', '', '+966501234567', 'TestPass123');
    echo "✅ تم تسجيل المستخدم: $userId1\n";

    // Test 3: User Login
    echo "\n3. اختبار تسجيل الدخول...\n";
    $user = $auth->login('+966501234567', 'TestPass123');
    echo "✅ تم تسجيل الدخول: " . $user['name'] . "\n";

    // Test 4: Content Creation
    echo "\n4. اختبار إنشاء المحتوى...\n";
    $postId = $db->addPost($userId1, 'عنوان تجريبي', 'محتوى تجريبي', 'general', 'تجريبي');
    echo "✅ تم إنشاء منشور: $postId\n";

    $ideaId = $db->addIdea($userId1, 'فكرة تجريبية', 'وصف الفكرة', 'general');
    echo "✅ تم إنشاء فكرة: $ideaId\n";

    // Test 5: Voting
    echo "\n5. اختبار التصويت...\n";
    $db->toggleIdeaVote($ideaId, $userId1);
    echo "✅ تم التصويت بنجاح\n";

    // Test 6: Search
    echo "\n6. اختبار البحث...\n";
    $searchResults = $db->search('تجريبي', 'all');
    echo "✅ تم البحث بنجاح\n";

    // Test 7: Get Data
    echo "\n7. اختبار جلب البيانات...\n";
    $posts = $db->getPosts(1, 5);
    echo "✅ المنشورات: " . count($posts) . "\n";

    $ideas = $db->getIdeas();
    echo "✅ الأفكار: " . count($ideas) . "\n";

    $users = $db->getUsers(10);
    echo "✅ المستخدمون: " . count($users) . "\n";

    // Test 8: Profile Update
    echo "\n8. اختبار تحديث الملف الشخصي...\n";
    $db->updateUserProfile($userId1, 'مستخدم محدث', 'سيرة ذاتية جديدة', '🎭');
    echo "✅ تم تحديث الملف الشخصي\n";

    // Test 9: Password Change
    echo "\n9. اختبار تغيير كلمة المرور...\n";
    $auth->changePassword($userId1, 'TestPass123', 'NewTestPass123');
    echo "✅ تم تغيير كلمة المرور\n";

    // Test 10: Final Stats
    echo "\n10. الإحصائيات النهائية...\n";
    $finalStats = $db->getStats();
    echo "✅ الإحصائيات النهائية: " . json_encode($finalStats, JSON_UNESCAPED_UNICODE) . "\n";

    echo "\n🎉 تم اختبار جميع الميزات بنجاح!\n";

} catch (Exception $e) {
    echo "\n❌ خطأ: " . $e->getMessage() . "\n";
    echo "الملف: " . $e->getFile() . "\n";
    echo "السطر: " . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n=== انتهاء الاختبار ===\n";
?>