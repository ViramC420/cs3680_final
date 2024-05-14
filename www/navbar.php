<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
    <img src="images/suscord.png" height=25px width=auto>
        <a class="navbar-brand" href="./dashboard.php"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="./dashboard.php">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="uConstruction.php">Notifications</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="uConstruction.php">Messages</a>
                </li>
            </ul>
            <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Profile
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <li><a class="dropdown-item" href="./profile.php">View Profile</a></li>
                        <li><a class="dropdown-item" href="#">Settings</a></li>
                        <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#logoutModal">Logout</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="#" id="createPostButton">Create Post</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- LOGOUT MODAL -->
<div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="logoutModalLabel">Confirm Logout</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Are you sure you want to logout?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
        <button type="button" class="btn btn-primary" onclick="handleLogout()">Yes</button>
      </div>
    </div>
  </div>
</div>
<script>
function handleLogout() {
  localStorage.removeItem('token');
  window.location.href = 'logout.php'; 
}
</script>