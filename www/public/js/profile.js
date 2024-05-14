import {
  renderPosts,
  initializeReactionHandlers,
  hideReactionPopup,
  showPostOptions,
  deletePost,
} from "./postActions.js";

// ------------------ //
// GLOBAL DEFINITIONS //
// ------------------ //

function switchTab(tabName) {
  const tabs = document.querySelectorAll(".profile-tab");
  const profileContent = document.getElementById("profileContent");
  const userId = localStorage.getItem("userId");

  tabs.forEach((tab) => {
    tab.classList.remove("active");
    if (tab.textContent.toLowerCase().includes(tabName)) {
      tab.classList.add("active");
    }
  });

  profileContent.innerHTML = `<p>Loading ${tabName} content...</p>`;

  switch (tabName.toLowerCase()) {
    case "posts":
      fetchPosts(userId);
      break;
    case "following":
      fetchFollowing(userId);
      break;
    case "followers":
      fetchFollowers(userId);
      break;
    case "edit profile":
      editProfile();
      break;
  }
}

function followUser(userId) {
  const followerId = localStorage.getItem("userId");
  fetch("https://cviramontes.cs3680.com/api/lab11/rpc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "user.follow",
      params: { followerId: followerId, followedId: userId },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Failed to follow user:", data.error.message);
        alert(`Error: ${data.error.message}`);
      } else {
        console.log("Followed successfully!");
        refreshFollowData();
      }
    })
    .catch((error) => {
      console.error("Error following user:", error);
      alert(`Error: ${error.message}`);
    });
}

function unfollowUser(userId) {
  const followBackIndicator = document.getElementById(
    `follow-back-indicator-${userId}`
  );
  const followButton = document.getElementById(`follow-button-${userId}`);

  const followerId = localStorage.getItem("userId");

  fetch("https://cviramontes.cs3680.com/api/lab11/rpc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "user.unfollow",
      params: { followerId: followerId, followedId: userId },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Failed to unfollow user:", data.error.message);
        return;
      }
      console.log("Unfollowed successfully!");
      fetchFollowers(followerId);
      fetchFollowing(followerId);
    })
    .catch((error) => {
      console.error("Error unfollowing user:", error);
      alert(`Error: ${error.message}`);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const profileContainer = document.querySelector(".profile-header");
  const userId = localStorage.getItem("userId");
  console.log("Current userId: ", userId);
  switchTab("posts");

  if (!userId) {
    profileContainer.innerHTML =
      "<p>User ID not found. Please log in again.</p>";
    return;
  }
  fetchUserProfile(userId);

  function fetchUserProfile(userId) {
    console.log("Fetching profile for user ID:", userId);
    const profileContainer = document.querySelector(".profile-header");
    profileContainer.innerHTML = "<p>Loading profile...</p>";

    fetch("https://cviramontes.cs3680.com/api/lab11/rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "profile.view",
        params: { userId: userId },
        id: new Date().getTime(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Failed to load profile:", data.error.message);
          profileContainer.innerHTML = `<p>Error loading profile: ${data.error.message}</p>`;
          return;
        }
        console.log(data.result);
        displayUserProfile(data.result);
      })
      .catch((error) => {
        console.log("Error fetching profile:", error);
        profileContainer.innerHTML = `<p>Error loading profile: ${error.message}</p>`;
      });
  }

  function displayUserProfile(data) {
    if (!data) {
      console.error("No data received to display.");
      return;
    }

    const { profilePicture, name, bio, followers, following } = data;
    profileContainer.innerHTML = `
      <img src="${
        profilePicture || "default.jpg"
      }" alt="Profile Picture" class="profile-picture">
      <h3 id="userName">${name || "N/A"}</h3>
      <p id="userBio">${bio || "No bio available."}</p>
    `;

    const followersCount = document.getElementById("followersCount");
    const followingCount = document.getElementById("followingCount");

    if (followersCount && followingCount) {
      followersCount.textContent = followers || "0";
      followingCount.textContent = following || "0";
    } else {
      console.error("Followers or following count elements not found.");
    }
  }
});

function editProfile() {
  const userId = localStorage.getItem("userId");
  fetchUserProfileForEdit(userId);
}

function fetchUserProfileForEdit(userId) {
  fetch(`https://cviramontes.cs3680.com/api/lab11/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "profile.view",
      params: { userId: userId },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(
          "Failed to load profile for editing:",
          data.error.message
        );
        return;
      }
      displayEditProfileForm(data.result);
    })
    .catch((error) => {
      console.error("Error fetching profile for editing:", error);
    });
}

function displayEditProfileForm(data) {
  const userId = localStorage.getItem("userId");
  const profileContent = document.getElementById("profileContent");
  profileContent.innerHTML = `
    <form id="editProfileForm">
      <div>
        <label>Name:</label>
        <input type="text" id="editName" value="${data.name}">
      </div>
      <div>
        <label>Bio:</label>
        <textarea id="editBio">${data.bio}</textarea>
      </div>
      <div>
        <label>Location:</label>
        <input type="text" id="editLocation" value="${data.location}">
      </div>
      <div>
        <label>Email:</label>
        <input type="email" id="editEmail" value="${data.email}">
      </div>
      <button type="submit">Save Changes</button>
    </form>
  `;

  document
    .getElementById("editProfileForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      saveProfileChanges(userId);
    });
}

function saveProfileChanges(userId) {
  const updatedName = document.getElementById("editName").value;
  const updatedBio = document.getElementById("editBio").value;
  const updatedLocation = document.getElementById("editLocation").value;
  const updatedEmail = document.getElementById("editEmail").value;

  console.log("Updated values:", {
    name: updatedName,
    bio: updatedBio,
    location: updatedLocation,
    contact_email: updatedEmail,
  });

  fetch("https://cviramontes.cs3680.com/api/lab11/rpc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "profile.update",
      params: {
        userId: userId,
        name: updatedName,
        bio: updatedBio,
        location: updatedLocation,
        contact_email: updatedEmail,
      },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Update response:", data);
      if (data.error) {
        console.error("Failed to update profile:", data.error.message);
        alert(`Error: ${data.error.message}`);
      } else {
        alert("Profile updated successfully!");
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      alert(`Error: ${error.message}`);
    });
}

// ------------- //
// POSTS RENDERS //
// ------------- //

function fetchPosts(userId) {
  console.log("Getting posts for ", userId);
  fetch(`https://cviramontes.cs3680.com/api/lab11/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "post.user",
      params: { userId: userId },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.result);
      if (data.error) {
        throw new Error(data.error.message);
      }
      const profileContent = document.getElementById("profileContent");
      renderPosts(profileContent, data.result);
    })
    .catch((error) => {
      console.error("Error fetching user posts:", error);
    });
}

// ------------- //
// FOLLOW SYSTEM //
// ------------- //
function refreshFollowData() {
  const userId = localStorage.getItem("userId");
  console.log("refreshing data");
  fetchFollowers(userId);
  fetchFollowing(userId);
}

function fetchFollowing(userId) {
  fetch(`https://cviramontes.cs3680.com/api/lab11/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "user.getFollowing",
      params: { userId: userId },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error.message);
      }
      displayFollowing(data.result);
    })
    .catch((error) => {
      console.error("Error fetching following list:", error);
      document.getElementById(
        "profileContent"
      ).innerHTML = `<p>Error loading following: ${error.message}</p>`;
    });
}

function displayFollowing(followingUsers) {
  const container = document.getElementById("profileContent");
  container.innerHTML = "";

  if (followingUsers.length === 0) {
    container.innerHTML = "<p>User is not following anyone.</p>";
    return;
  }

  const list = document.createElement("ul");
  list.className = "following-list";

  followingUsers.forEach((user) => {
    const item = document.createElement("li");
    item.className = "following-item";
    item.innerHTML = `
          <div class="user-info">
              <div class="user-name">${user.name}</div>
              <div class="follow-back-indicator">${
                user.is_following_back ? "Follows you" : "Does not follow you"
              }</div>
              <div class="user-bio">${user.bio || "No bio available"}</div>
          </div>
          <button onclick="unfollowUser(${
            user.user_id
          })" class="unfollow-button">Unfollow</button>
      `;
    list.appendChild(item);
  });

  container.appendChild(list);
}

function fetchFollowers(userId) {
  fetch(`https://cviramontes.cs3680.com/api/lab11/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "user.getFollowers",
      params: { userId: userId },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error.message);
      }
      displayFollowers(data.result);
    })
    .catch((error) => {
      console.error("Error fetching followers list:", error);
      document.getElementById(
        "profileContent"
      ).innerHTML = `<p>Error loading followers: ${error.message}</p>`;
    });
}

function displayFollowers(followers) {
  const container = document.getElementById("profileContent");
  container.innerHTML = "";

  if (followers.length === 0) {
    container.innerHTML = "<p>No followers.</p>";
    return;
  }

  const list = document.createElement("ul");
  list.className = "followers-list";

  followers.forEach((user) => {
    const item = document.createElement("li");
    item.className = "follower-item";
    const isFollowingBack = user.is_followed_by_me;

    item.innerHTML = `
      <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-bio">${user.bio || "No bio available"}</div>
          <div class="follow-back-indicator" id="follow-back-indicator-${
            user.follower_id
          }">
              ${isFollowingBack ? "Follows you" : "Not following back"}
          </div>
      </div>
      <button onclick="${
        isFollowingBack
          ? `unfollowUser(${user.follower_id})`
          : `followUser(${user.follower_id})`
      }" class="follow-button" id="follow-button-${user.follower_id}">
          ${isFollowingBack ? "Unfollow" : "Follow Back"}
      </button>
    `;
    list.appendChild(item);
  });

  container.appendChild(list);
}

window.switchTab = switchTab;
window.followUser = followUser;
window.unfollowUser = unfollowUser;
