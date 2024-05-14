const sqlite3 = require("sqlite3").verbose();
const { openDB, closeDB } = require("../calls/user");

const reactionModel = {
  addOrUpdateReaction: function (postId, userId, reactionType) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `
          INSERT INTO reactions (post_id, user_id, type)
          VALUES (?, ?, ?)
          ON CONFLICT(post_id, user_id) 
          DO UPDATE SET type = excluded.type;
        `;
          db.run(sql, [postId, userId, reactionType], function (err) {
            closeDB(db);
            if (err) reject(err);
            else resolve({ postId, userId, reactionType });
          });
        })
        .catch((err) => reject(err));
    });
  },

  removeReaction: function (postId, userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `DELETE FROM reactions WHERE post_id = ? AND user_id = ?`;
          db.run(sql, [postId, userId], function (err) {
            closeDB(db);
            if (err) reject(err);
            else resolve({ message: "Reaction removed successfully" });
          });
        })
        .catch((err) => reject(err));
    });
  },

  countReactions: function (postId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `SELECT p.*, 
          (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type IN ('like', 'love', 'haha')) AS total_reactions, 
          (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'dislike') AS dislike_count 
          FROM posts p 
          WHERE p.id = ?
        `;
          db.all(sql, [postId], (err, results) => {
            closeDB(db);
            if (err) reject(err);
            else
              resolve(
                results.reduce((acc, curr) => {
                  acc[curr.type] = curr.count;
                  return acc;
                }, {})
              );
          });
        })
        .catch((err) => reject(err));
    });
  },
};

module.exports = reactionModel;
