const followModel = require("../models/followModel");

exports.followUser = function (req, res) {
  const { followerId, followedId } = req.body.params;

  followModel
    .followUser(followerId, followedId)
    .then((result) =>
      res.json({
        jsonrpc: "2.0",
        result: { message: "Follow successful", details: result },
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

exports.unfollowUser = function (req, res) {
  const { followerId, followedId } = req.body.params;

  followModel
    .unfollowUser(followerId, followedId)
    .then((result) =>
      res.json({
        jsonrpc: "2.0",
        result: { message: "Unfollow successful", details: result },
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

exports.getFollowers = function (req, res) {
  const { userId } = req.body.params;

  followModel
    .getFollowers(userId)
    .then((followers) =>
      res.json({
        jsonrpc: "2.0",
        result: followers,
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

exports.getFollowing = function (req, res) {
  const { userId } = req.body.params;

  followModel
    .getFollowing(userId)
    .then((following) =>
      res.json({
        jsonrpc: "2.0",
        result: following,
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
