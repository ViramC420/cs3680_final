const sqlite3 = require("sqlite3").verbose();
const { openDB, closeDB } = require("../calls/user");

const commentModel = {
  createComment: function (postId, userId, comment) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `INSERT INTO comments (post_id, user_id, comment, created_at) VALUES (?, ?, ?, datetime('now'))`;
          db.run(sql, [postId, userId, comment], function (err) {
            closeDB(db);
            if (err) reject(err);
            else
              resolve({
                id: this.lastID,
                postId,
                userId,
                comment,
                created_at: new Date(),
              });
          });
        })
        .catch((err) => reject(err));
    });
  },

  getCommentsByPost: function (postId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC`;
          db.all(sql, [postId], (err, comments) => {
            closeDB(db);
            if (err) reject(err);
            else resolve(comments);
          });
        })
        .catch((err) => reject(err));
    });
  },

  editComment: function (commentId, userId, updatedComment) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `UPDATE comments SET comment = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`;
          db.run(sql, [updatedComment, commentId, userId], function (err) {
            closeDB(db);
            if (err) reject(err);
            else if (this.changes === 0)
              reject({
                message: "No comment found or user not authorized to edit",
              });
            else
              resolve({
                id: commentId,
                userId,
                updatedComment,
                updated_at: new Date(),
              });
          });
        })
        .catch((err) => reject(err));
    });
  },

  deleteComment: function (commentId, userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `DELETE FROM comments WHERE id = ? AND user_id = ?`;
          db.run(sql, [commentId, userId], function (err) {
            closeDB(db);
            if (err) reject(err);
            else if (this.changes === 0)
              reject({ message: "No comment found or user not authorized" });
            else resolve({ message: "Comment deleted successfully" });
          });
        })
        .catch((err) => reject(err));
    });
  },
};

module.exports = commentModel;
