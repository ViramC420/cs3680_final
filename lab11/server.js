require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

// APPLY MIDDLEWARES
app.use(express.json());
app.use(
  cors({
    origin: "https://cviramontes.cs3680.com",
  })
);

const user = require("./calls/user");
const verifyToken = require("./authMiddleware");
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const commentController = require("./controllers/commentController");
const reactionController = require("./controllers/reactionController");
const followController = require("./controllers/followController");

const { openDB, closeDB } = require("./calls/user");
const { jsonRes, jsonErr, validJRPC } = require("./utils");

const server = http.createServer(app);
const io = socketIo(server);
const port = 5555;

app.use(validJRPC());

// WebSocket SETUP
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("new_reaction", (data) => {
    socket.broadcast.emit("reaction_update", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// MAIN JRPC ENDPOINT
// FOR TESTING THROUGH POSTMAN EASIER
app.post("/api/lab11/rpc", (req, res) => {
  const { method, params, id } = req.body;

  // METHOD CONTROLLER MAPPING
  const methods = {
    "user.login": userController.loginUser,
    "user.register": userController.registerUser,
    "profile.view": userController.getProfile,
    "profile.update": [verifyToken, userController.updateProfile],
    "post.create": [verifyToken, postController.createPost],
    "post.feed": [verifyToken, postController.getFeed],
    "post.followingFeed": [verifyToken, postController.followingFeed],
    "post.user": postController.getPostsByUser,
    "post.delete": [verifyToken, postController.deletePost],
    "comment.create": [verifyToken, commentController.createComment],
    "comment.get": commentController.getCommentsByPost,
    "comment.edit": [verifyToken, commentController.editComment],
    "comment.delete": [verifyToken, commentController.deleteComment],
    "reaction.add": [verifyToken, reactionController.addOrUpdateReaction],
    "reaction.remove": [verifyToken, reactionController.removeReaction],
    "reaction.count": reactionController.getReactionCounts,
    "user.follow": [verifyToken, followController.followUser],
    "user.unfollow": [verifyToken, followController.unfollowUser],
    "user.getFollowers": followController.getFollowers,
    "user.getFollowing": followController.getFollowing,
  };

  // RETRIEVE APPROPRIATE METHOD
  const procedure = methods[method];
  if (!procedure) {
    res.status(404).json(jsonErr(-32601, "Method not found", id));
    return;
  }

  // EXECUTE CONTROLLER
  // IF IT HAS MIDDLEWARE
  if (Array.isArray(procedure)) {
    procedure[0](req, res, () => procedure[1](req, res));
  } else {
    procedure(req, res);
  }
});

server.listen(port, () => {
  console.log(`Server and WebSocket listening on port ${port}`);
});
