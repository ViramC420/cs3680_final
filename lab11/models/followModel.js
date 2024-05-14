const sqlite3 = require("sqlite3").verbose();
const { openDB, closeDB } = require("../calls/user");

const followModel = {
  followUser: function (followerId, followedId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)
                             ON CONFLICT(follower_id, followed_id) DO NOTHING;`;
          db.run(sql, [followerId, followedId], function (err) {
            closeDB(db);
            if (err) reject(err);
            else resolve({ followerId, followedId });
          });
        })
        .catch((err) => reject(err));
    });
  },

  unfollowUser: function (followerId, followedId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql =
            "DELETE FROM follows WHERE follower_id = ? AND followed_id = ?";
          db.run(sql, [followerId, followedId], function (err) {
            closeDB(db);
            if (err) reject(err);
            else resolve({ message: "Unfollowed successfully" });
          });
        })
        .catch((err) => reject(err));
    });
  },

  getFollowers: function (userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `SELECT f.follower_id, u.name, u.bio, EXISTS(SELECT 1 FROM follows WHERE followed_id = u.id AND follower_id = ?) AS is_followed_by_me
            FROM follows f
            JOIN user u ON f.follower_id = u.id
            WHERE f.followed_id = ?;
            ORDER BY u.name`;
          db.all(sql, [userId, userId], (err, rows) => {
            closeDB(db);
            if (err) reject(err);
            else resolve(rows);
          });
        })
        .catch((err) => reject(err));
    });
  },

  getFollowing: function (userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `SELECT u.id AS user_id, u.name, u.bio, EXISTS(SELECT 1 FROM follows WHERE follower_id = f.followed_id AND followed_id = f.follower_id) AS is_following_back
            FROM follows f
            JOIN user u ON f.followed_id = u.id
            WHERE f.follower_id = ?
            ORDER BY u.name`;
          db.all(sql, [userId], (err, rows) => {
            closeDB(db);
            if (err) reject(err);
            else resolve(rows);
          });
        })
        .catch((err) => reject(err));
    });
  },
};

module.exports = followModel;
