document.addEventListener("DOMContentLoaded", function () {
  const createPostButton = document.getElementById("createPostButton");
  const createPostModal = document.getElementById("createPostModal");
  const closeModalButton = document.getElementById("closeModalButton");
  const postButton = document.getElementById("postButton");

  createPostButton.addEventListener("click", function () {
    createPostModal.style.display = "block";
  });

  closeModalButton.addEventListener("click", function () {
    createPostModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == createPostModal) {
      createPostModal.style.display = "none";
    }
  });

  postButton.addEventListener("click", function () {
    const postContent = document.getElementById("postContent").value;
    if (postContent.length > 0 && postContent.length <= 1000) {
      createPost(postContent);
    } else {
      alert("Post content must be between 1 and 1000 characters.");
    }
  });

  function createPost(content) {
    fetch("https://cviramontes.cs3680.com/api/lab11/rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "post.create",
        params: { userId: localStorage.getItem("userId"), content: content },
        id: new Date().getTime(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Failed to create post:", data.error.message);
          alert(`Error: ${data.error.message}`);
        } else {
          createPostModal.style.display = "none";
          location.reload();
        }
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        alert(`Error: ${error.message}`);
      });
  }
});
