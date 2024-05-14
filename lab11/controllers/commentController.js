const commentModel = require("../models/commentModel");

exports.createComment = function (req, res) {
  const userId = req.user.id; // JWTVERIFICATION
  const { postId, comment } = req.body.params;

  commentModel
    .createComment(postId, userId, comment)
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

exports.getCommentsByPost = function (req, res) {
  const { postId } = req.body.params;

  commentModel
    .getCommentsByPost(postId)
    .then((comments) =>
      res.json({
        jsonrpc: "2.0",
        result: comments,
        id: req.body.id,
      })
    )
    .catch((error) =>
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: 500,
          message: error.message,
        },
        id: req.body.id,
      })
    );
};

exports.editComment = function (req, res) {
  const userId = req.user.id; // JWTVERIFICATION
  const { commentId, updatedComment } = req.body.params;

  commentModel
    .editComment(commentId, userId, updatedComment)
    .then((result) =>
      res.json({
        jsonrpc: "2.0",
        result: result,
        id: req.body.id,
      })
    )
    .catch((err) =>
      res.status(403).json({
        jsonrpc: "2.0",
        error: {
          code: 403,
          message: err.message,
        },
        id: req.body.id,
      })
    );
};

exports.deleteComment = function (req, res) {
  const { commentId } = req.body.params;
  const userId = req.user.id; // JWTVERIFICATION

  commentModel
    .deleteComment(commentId, userId)
    .then((result) =>
      res.json({
        jsonrpc: "2.0",
        result: result,
        id: req.body.id,
      })
    )
    .catch((error) =>
      res.status(403).json({
        jsonrpc: "2.0",
        error: {
          code: 403,
          message: error.message,
        },
        id: req.body.id,
      })
    );
};
