<?php
echo "=== اختبار أدنى ===\n";

try {
    require_once 'config.php';
    require_once 'classes.php';

    echo "✅ تم تحميل الملفات\n";

    $db = new Database();
    echo "✅ تم إنشاء قاعدة البيانات\n";

    // Test direct user creation
    echo "اختبار إنشاء مستخدم...\n";
    $userId = $db->createUser('مستخدم أدنى', '', '+966501234570', password_hash('test123', PASSWORD_DEFAULT));
    echo "✅ تم إنشاء المستخدم: $userId\n";

    // Test getting user
    $user = $db->getUserById($userId);
    echo "✅ تم جلب المستخدم: " . $user['name'] . "\n";

    // Test stats
    $stats = $db->getStats();
    echo "✅ الإحصائيات: " . json_encode($stats, JSON_UNESCAPED_UNICODE) . "\n";

    echo "🎉 جميع الاختبارات نجحت!\n";

} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
    echo "الملف: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
?>