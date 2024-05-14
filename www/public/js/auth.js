document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch("https://cviramontes.cs3680.com/api/lab11/rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "user.login",
        params: { name: username, password: password },
        id: new Date().getTime(), // UNIQUE ID FOR EACH REQUEST
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log("HTTP status code:", response.status); // ERROR HANDLING
          throw new Error("Network is offline.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data); // LOG RESPONSE DATA
        if (data.error) {
          throw new Error(
            data.error.message || "Unknown server error occurred"
          );
        }
        if (data.result && data.result.token) {
          localStorage.setItem("userId", data.result.userId); // STORE userId
          localStorage.setItem("token", data.result.token); // STORE TOKEN
          window.location.href = "dashboard.php"; // REDIRECT
        } else {
          throw new Error("Login failed, no token received");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert(
          "Login error: " + (error.message || "An unknown error occurred.")
        );
      });
  });

document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const email = document.getElementById("registerEmail").value;

    fetch("https://cviramontes.cs3680.com/api/lab11/rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "user.register",
        params: {
          name: username,
          password: password,
          email: email,
        },
        id: new Date().getTime(), // UNIQUE ID FOR EACH REQUEST
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data:", data);
        if (data.error) {
          console.error("Registration error:", data.error.message);
          alert("Registration failed: " + data.error.message);
          throw new Error(data.error.message);
        } else if (data.result) {
          alert("Registration successful! Please log in.");
          window.location.href = "index.php"; // REDIRECT
        } else {
          throw new Error("Unexpected response format");
        }
      })
      .catch((error) => {
        console.error("Registration error caught:", error);
        alert(
          "Registration error: " + (error.message || "Unknown error occurred.")
        );
      });
  });
