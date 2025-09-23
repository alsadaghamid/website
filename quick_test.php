<?php
echo "=== اختبار سريع ===\n";

try {
    require_once 'config.php';
    require_once 'classes.php';

    $db = new Database();
    $auth = new Auth($db);

    echo "✅ تم إنشاء النظام\n";

    // Test registration
    echo "اختبار التسجيل...\n";
    $userId = $auth->register('مستخدم سريع', '', '+966501234569', 'TestPass123');
    echo "✅ تم التسجيل: $userId\n";

    // Test login
    echo "اختبار تسجيل الدخول...\n";
    $user = $auth->login('+966501234569', 'TestPass123');
    echo "✅ تم تسجيل الدخول: " . $user['name'] . "\n";

    echo "🎉 جميع الاختبارات نجحت!\n";

} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
    echo "الملف: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
?>