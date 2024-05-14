import {
  renderPosts,
  initializeReactionHandlers,
  hideReactionPopup,
  showPostOptions,
  deletePost,
} from "./postActions.js";

export function updateFeed(feedType) {
  fetch(`https://cviramontes.cs3680.com/api/lab11/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: feedType === "for-you" ? "post.feed" : "post.followingFeed",
      params: {},
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Failed to load posts:", data.error.message);
        return;
      }
      console.log("Rendering posts");
      const feedContainer = document.querySelector(".feed");
      renderPosts(feedContainer, data.result);
    })
    .catch((error) => {
      console.error(`Error fetching posts for ${feedType}:`, error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".nav-tabs .nav-link");
  const profileDropdown = document.getElementById("navbarDropdownMenuLink");
  //GET LAST ACTIVE THROUGH COOKIE OR DEFAULT TO FOR YOU FEED
  let activeTab = getCookie("activeTab") || "for-you";

  // INITIALIZE TAB AND FEED
  tabs.forEach((tab) => {
    tab.classList.remove("active");
    if (
      (tab.id === "for-you-tab" && activeTab === "for-you") ||
      (tab.id === "following-tab" && activeTab === "following")
    ) {
      tab.classList.add("active");
    }
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      setActiveTab(tab);
      hideReactionPopup();
    });
  });

  // FETCH INITIAL POSTS BASED ON ACTIVE TAB
  updateFeed(activeTab);

  function setActiveTab(selectedTab) {
    tabs.forEach((tab) => tab.classList.remove("active"));
    selectedTab.classList.add("active");
    const feedType = selectedTab.id === "for-you-tab" ? "for-you" : "following";
    updateFeed(feedType);
    document.cookie = "activeTab=" + feedType; // REMEMBER LAST TAB
  }

  // EVENT LISTENER FOR POST OPTIONS BUTTON
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("post-options")) {
      showPostOptions(event.target.dataset.postId, event.target);
    }
  });
});

// GET COOKIE BY NAME
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
window.updateFeed = updateFeed;
