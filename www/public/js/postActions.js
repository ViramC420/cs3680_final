import { updateFeed } from "./dashboard.js";

export function renderPosts(container, posts) {
  console.log(posts);
  container.innerHTML = ""; // CLEAR EXISTING POSTS
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = renderPostHTML(post);
    container.appendChild(postElement);
  });
  initializeReactionHandlers(container); // REINIT REACTION
}

export function renderPostHTML(post) {
  let reactionImage;
  if (post.user_reaction === "like") {
    reactionImage = "images/like-active.png";
  } else if (post.user_reaction === "love") {
    reactionImage = "images/love-active.png";
  } else if (post.user_reaction === "haha") {
    reactionImage = "images/haha-active.png";
  } else {
    reactionImage = "images/like-inactive.png"; // DEFAULT
  }

  return `
        <div class='post-avatar'><img src='user_avatar.jpg' alt='User Avatar'></div>
        <div class='post-info-section'>
          <div class='post-header'>
            <div class='post-user-info'>
              <strong>${post.name}</strong>
              <span> · ${new Date(post.created_at).toLocaleTimeString()}</span>
            </div>
            <button class='post-options' data-post-id='${post.id}'>···</button>
          </div>
          <p class='post-content'>${post.content}</p>
          <div class='post-actions'>
            <button class='post-comment'><img src="images/comment.png" alt="Comment">${
              post.comment_count
            }</button>
            <button class='post-repost'><img src="images/repost-inactive.png" alt="Repost"></button>
            <button class='post-like' data-post-id='${
              post.id
            }' data-reaction-type='like'>
              <img src="${reactionImage}" alt="Like">
              <span>${post.total_reactions}</span>
            </button>
            <button class='post-dislike' data-post-id="${
              post.id
            }" data-reaction-type="dislike">
              <img src="images/dislike-${
                post.user_reaction === "dislike" ? "active" : "inactive"
              }.png" alt="Dislike">
              <span>${post.dislike_count}</span>
            </button>
          </div>
        </div>`;
}

// SHOW POST OPTIONS POPUP
export function showPostOptions(postId, targetElement) {
  const popup = document.createElement("div");
  popup.className = "post-options-popup";
  popup.innerHTML = `
      <button class="delete-post-button" data-post-id="${postId}">Delete Post</button>
    `;

  const rect = targetElement.getBoundingClientRect();
  popup.style.position = "absolute";
  popup.style.left = `${rect.left}px`;
  popup.style.top = `${rect.bottom}px`;

  document.body.appendChild(popup);

  document.addEventListener("click", function (event) {
    if (!popup.contains(event.target) && event.target !== targetElement) {
      popup.remove();
    }
  });

  popup
    .querySelector(".delete-post-button")
    .addEventListener("click", function () {
      const postId = this.dataset.postId;
      deletePost(postId);
      popup.remove();
    });
}

export function deletePost(postId) {
  fetch(`https://cviramontes.cs3680.com/api/lab11/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "post.delete",
      params: { postId },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Failed to delete post:", data.error.message);
        alert(`Error: ${data.error.message}`);
      } else {
        updateFeed(
          document.cookie.replace(
            /(?:(?:^|.*;\s*)activeTab\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
          )
        );
      }
    })
    .catch((error) => {
      console.error("Error deleting post:", error);
      alert(`Error: ${error.message}`);
    });
}

export function initializeReactionHandlers(container) {
  const likeButtons = document.querySelectorAll(".post-like");

  likeButtons.forEach((button) => {
    let holdTimer;

    button.addEventListener("mousedown", function (event) {
      holdTimer = setTimeout(() => showReactionOptions(event, button), 500); // .5 SECOND TIMER
    });

    ["mouseup", "mouseleave"].forEach((event) => {
      button.addEventListener(event, () => clearTimeout(holdTimer)); // CLEAR TIMER
    });

    button.addEventListener("click", function (event) {
      // PREVENT CLICK IF LONG PRESS
      if (event.detail === 0) {
        return;
      }
      toggleLikeReaction(button);
    });
  });

  // OTHER REACTIONS HANDLE PER USUAL
  document.querySelectorAll(".post-dislike").forEach((button) => {
    button.addEventListener("click", () => toggleLikeReaction(button));
  });

  container
    .querySelectorAll(".post-repost, .post-comment")
    .forEach((button) => {
      button.addEventListener("click", () => {
        alert("Work in Progress feature :(");
      });
    });
}

export function toggleLikeReaction(button) {
  const postId = button.dataset.postId;
  const isLikeButton = button.classList.contains("post-like");
  const currentButton = button;
  const otherButton = isLikeButton
    ? currentButton.closest(".post-info-section").querySelector(".post-dislike")
    : currentButton.closest(".post-info-section").querySelector(".post-like");
  const currentImg = currentButton.querySelector("img");
  const otherImg = otherButton.querySelector("img");
  const currentReactionType = currentButton.dataset.reactionType;
  const otherReactionType = "dislike";

  const currentIsActive = currentImg.src.includes("-active.png");
  const otherIsActive = otherImg.src.includes("-active.png");

  if (currentIsActive) {
    currentImg.src = `images/${currentReactionType}-inactive.png`;
    updateReactionCount(currentButton, -1);
  } else {
    currentImg.src = `images/${currentReactionType}-active.png`;
    updateReactionCount(currentButton, 1);
  }

  if (otherIsActive) {
    otherImg.src = `images/${otherReactionType}-inactive.png`;
    updateReactionCount(otherButton, -1);
  }

  console.log("Toggling Reaction:", {
    postId,
    currentIsActive,
    currentReactionType,
    otherIsActive,
    otherReactionType,
  });
  sendReactionUpdate(postId, currentReactionType, !currentIsActive);
}

export function createReactionPopup() {
  const popup = document.createElement("div");
  popup.id = "reaction-popup";
  popup.className = "reaction-popup";
  popup.innerHTML = `
        <img src="images/like-active.png" class="reaction-option" data-reaction="like">
        <img src="images/love-active.png" class="reaction-option" data-reaction="love">
        <img src="images/haha-active.png" class="reaction-option" data-reaction="haha">
      `;
  document.body.appendChild(popup);
  return popup;
}

export function showReactionOptions(event, button) {
  console.log("Showing reaction options for button:", button);
  const popup =
    document.getElementById("reaction-popup") || createReactionPopup();
  const rect = button.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  popup.style.left = rect.left + scrollLeft + "px";
  popup.style.top = rect.top + scrollTop - popup.offsetHeight - 10 + "px";
  popup.style.display = "block";
  popup.style.visibility = "visible";
  popup.dataset.postId = button.dataset.postId;

  // EVENT LISTENER FUNCTION
  attachReactionOptionListeners(popup, button);

  event.preventDefault();
}

function attachReactionOptionListeners(popup, button) {
  popup.querySelectorAll(".reaction-option").forEach((option) => {
    option.addEventListener("mouseup", function () {
      console.log("Reaction option clicked:", this.dataset.reaction); // DEBUG LOG
      const reactionType = this.dataset.reaction;
      selectReaction(button, reactionType);
      hideReactionPopup();
    });
  });
}

function selectReaction(button, reactionType) {
  console.log("Selected reaction:", reactionType);
  const postId = button.dataset.postId;
  const img = button.querySelector("img");

  img.src = `images/${reactionType}-active.png`;
  updateReactionCount(button, 1);
  sendReactionUpdate(postId, reactionType, true);
}

// HIDE POPUP ON CLICKING OUT
document.addEventListener("click", function (event) {
  const popup = document.getElementById("reaction-popup");
  if (
    popup &&
    !popup.contains(event.target) &&
    !event.target.classList.contains("reaction-option")
  ) {
    hideReactionPopup();
  }
});

export function hideReactionPopup() {
  console.log("Hiding reaction popup");
  const popup = document.getElementById("reaction-popup");
  if (popup) {
    popup.style.display = "none";
    popup.style.visibility = "hidden";
  }
}

export function updateReaction(button, reactionType) {
  const postId = button.dataset.postId;
  const img = button.querySelector("img");
  const currentIsActive = img.src.includes("-active.png");
  sendReactionUpdate(postId, reactionType, !currentIsActive);
  img.src = `images/${reactionType}-${
    currentIsActive ? "inactive" : "active"
  }.png`;
  updateReactionCount(button, currentIsActive ? -1 : 1);
}

export function updateReactionCount(button, change) {
  const countSpan = button.querySelector("span");
  let currentCount = parseInt(countSpan.textContent);
  countSpan.textContent = currentCount + change;
}

export function sendReactionUpdate(postId, reactionType, isActive) {
  console.log("Sending reaction update:", {
    postId,
    reactionType,
    isActive,
  });
  const method = isActive ? "reaction.add" : "reaction.remove";
  fetch(`https://cviramontes.cs3680.com/api/lab11/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: { postId, reactionType },
      id: new Date().getTime(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error updating reaction:", data.error.message);
      } else {
        console.log("Reaction update successful:", data.result);
      }
    })
    .catch((error) => {
      console.error("Failed to update reaction:", error);
    });
}
