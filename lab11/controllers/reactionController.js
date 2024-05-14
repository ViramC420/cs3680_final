const reactionModel = require("../models/reactionModel");

exports.addOrUpdateReaction = function (req, res) {
  const userId = req.user.id; // JWTVERIFICATION
  const { postId, reactionType } = req.body.params;

  reactionModel
    .addOrUpdateReaction(postId, userId, reactionType)
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

exports.removeReaction = function (req, res) {
  const userId = req.user.id;
  const { postId } = req.body.params;

  reactionModel
    .removeReaction(postId, userId)
    .then((result) =>
      res.json({
        jsonrpc: "2.0",
        result: result,
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

exports.getReactionCounts = function (req, res) {
  const { postId } = req.body.params;

  reactionModel
    .countReactions(postId)
    .then((counts) =>
      res.json({
        jsonrpc: "2.0",
        result: counts,
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
