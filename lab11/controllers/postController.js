const postModel = require("../models/postModel");

exports.createPost = function (req, res) {
  const userId = req.user.id; // JWTVERIFY
  const { content, mediaUrl } = req.body.params;

  postModel
    .createPost(userId, content, mediaUrl)
    .then((result) =>
      res.json({
        jsonrpc: "2.0",
        result: result,
        id: req.body.id,
      })
    )
    .catch((err) =>
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: 500,
          message: err.message,
        },
        id: req.body.id,
      })
    );
};

exports.getFeed = function (req, res) {
  const userId = req.user.id; // JWTVERIFY

  postModel
    .getFeed(userId)
    .then((posts) =>
      res.json({
        jsonrpc: "2.0",
        result: posts,
        id: req.body.id,
      })
    )
    .catch((error) =>
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: 500, message: error.message },
        id: req.body.id,
      })
    );
};

exports.followingFeed = function (req, res) {
  const userId = req.user.id; // JWTVERIFY
  postModel
    .followingFeed(userId)
    .then((posts) =>
      res.json({
        jsonrpc: "2.0",
        result: posts,
        id: req.body.id,
      })
    )
    .catch((error) =>
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: 500, message: error.message },
        id: req.body.id,
      })
    );
};

exports.getPostsByUser = function (req, res) {
  const { userId } = req.body.params;

  postModel
    .getPostsByUser(userId)
    .then((posts) => {
      console.log(posts);
      res.json({
        jsonrpc: "2.0",
        result: posts,
        id: req.body.id,
      });
    })
    .catch((error) =>
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: 500, message: error.message },
        id: req.body.id,
      })
    );
};

exports.deletePost = function (req, res) {
  const { postId } = req.body.params;
  const userId = req.user.id;

  postModel
    .deletePost(postId, userId)
    .then((result) => {
      if (!result.message) {
        throw new Error("No post found or user not authorized");
      }
      res.json({
        jsonrpc: "2.0",
        result: result,
        id: req.body.id,
      });
    })
    .catch((error) =>
      res.status(403).json({
        jsonrpc: "2.0",
        error: { code: 403, message: error.message },
        id: req.body.id,
      })
    );
};
