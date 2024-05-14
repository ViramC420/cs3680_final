<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Postcord</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</head>
<body>
    <div class="container mt-5">
        <h2>Welcome to Postcord</h2>
        <div class="row">
            <div class="col-md-6">
                <h3>Login</h3>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="loginUsername">Username:</label>
                        <input type="text" class="form-control" id="loginUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password:</label>
                        <input type="password" class="form-control" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
            <div class="col-md-6">
                <h3>Create Account</h3>
                <form id="registerForm">
                    <div class="form-group">
                        <label for="registerUsername">Username:</label>
                        <input type="text" class="form-control" id="registerUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password:</label>
                        <input type="password" class="form-control" id="registerPassword" required>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">Email:</label>
                        <input type="email" class="form-control" id="registerEmail" required>
                    </div>
                    <button type="submit" class="btn btn-success">Create Account</button>
                </form>
            </div>
        </div>
    </div>

    <script src="/public/js/auth.js"></script>
</body>
</html>
