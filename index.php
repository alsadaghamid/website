<?php
// Force UTF-8 encoding for all responses
header('Content-Type: text/html; charset=UTF-8');

// Handle static file requests
$request = $_SERVER['REQUEST_URI'];

// Remove query string
$request = strtok($request, '?');

// Default to index.html for root requests
if ($request === '/' || $request === '') {
    $request = '/index.html';
}

// Map file extensions to MIME types
$mimeTypes = [
    'html' => 'text/html; charset=UTF-8',
    'css' => 'text/css; charset=UTF-8',
    'js' => 'application/javascript; charset=UTF-8',
    'json' => 'application/json; charset=UTF-8',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'ico' => 'image/x-icon'
];

// Get file extension
$ext = pathinfo($request, PATHINFO_EXTENSION);
$filePath = '.' . $request;

// Security check - prevent directory traversal
if (strpos($filePath, '..') !== false || !file_exists($filePath)) {
    http_response_code(404);
    echo 'File not found';
    exit;
}

// Set appropriate content type
if (isset($mimeTypes[$ext])) {
    header('Content-Type: ' . $mimeTypes[$ext]);
}

// Disable caching for development
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Output file content
readfile($filePath);
?>