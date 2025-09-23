<?php
echo "=== اختبار بسيط ===\n";

try {
    require_once 'config.php';
    echo "✅ تم تحميل config.php\n";

    require_once 'classes.php';
    echo "✅ تم تحميل classes.php\n";

    $db = new Database();
    echo "✅ تم إنشاء Database\n";

    $stats = $db->getStats();
    echo "✅ تم جلب الإحصائيات\n";
    echo "المستخدمون: {$stats['total_users']}\n";

} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
    echo "الملف: " . $e->getFile() . "\n";
    echo "السطر: " . $e->getLine() . "\n";
}

echo "=== انتهاء الاختبار ===\n";
?>