<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$defaultTab = 'for-you'; // DEFAULT TAB
if (isset($_COOKIE['activeTab'])) {
    $defaultTab = $_COOKIE['activeTab']; // GETS LAST ACTIVE THROUGH COOKIE
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="public/js/createPost.js" defer></script>
    <link href="public/css/dashstyle.css" rel="stylesheet">
    <link href="public/css/createPost.css" rel="stylesheet">
</head>
<body>
    <?php require 'navbar.php'; ?>

    <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link <?= $defaultTab === 'for-you' ? 'active' : '' ?>" href="#" id="for-you-tab">For You</a>
        </li>
        <li class="nav-item">
            <a class="nav-link <?= $defaultTab === 'following' ? 'active' : '' ?>" href="#" id="following-tab">Following</a>
        </li>
    </ul>

    <div class="feed" id="feed">
        <!-- JS POSTS LOAD -->
    </div>

    <!-- POST.CREATE MODAL -->
    <div id="createPostModal">
        <div class="modal-content">
            <span class="close" id="closeModalButton">&times;</span>
            <textarea id="postContent" placeholder="Speak"></textarea>
            <button id="postButton" class="btn btn-primary">Post</button>
        </div>
    </div>

    <script src="public/js/postActions.js" type="module"></script>
    <script src="public/js/dashboard.js" type="module"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
