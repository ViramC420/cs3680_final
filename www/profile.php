<?php
require 'includes/init.php';
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="public/css/dashstyle.css" rel="stylesheet">
    <link href="public/css/profilestyle.css" rel="stylesheet">
    <link href="public/css/createPost.css" rel="stylesheet">
    <script src="public/js/createPost.js" defer></script>
    <script src="public/js/postActions.js" type="module"></script>
    <script src="public/js/profile.js" type="module"></script>
</head>
<body data-user-id="<?php echo htmlspecialchars($userId); ?>">
    <?php include 'navbar.php'; ?>


    <div class="container mt-4">
        <div class="profile-header">
            <img src="images/suscord.png" alt="Profile Picture" id="profilePicture" class="profile-picture">
            <div class="profile-info">
                <h3 id="userName"></h3>
                <p id="userBio"></p>
                <p id="userLocation"></p>
                <p id="userEmail"></p>
            </div>
        </div>
        <div class="profile-nav">
            <button class="profile-tab nav-item" onclick="switchTab('posts')">Posts</button>
            <button class="profile-tab nav-item" onclick="switchTab('following')">Following</button>
            <button class="profile-tab nav-item" onclick="switchTab('followers')">Followers</button>
            <button class="profile-tab nav-item" onclick="switchTab('edit profile')">Edit Profile</button>
        </div>
        <div class="profile-content" id="profileContent">
            <!-- TAB CONTENT -->
        </div>

        <!-- POST.CREATE MODAL -->
        <div id="createPostModal">
            <div class="modal-content">
                <span class="close" id="closeModalButton">&times;</span>
                <textarea id="postContent" placeholder="Speak"></textarea>
                <button id="postButton" class="btn btn-primary">Post</button>
            </div>
        </div>
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
