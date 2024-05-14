const sqlite3 = require("sqlite3").verbose();
const { openDB, closeDB } = require("../calls/user");

const postModel = {
  createPost: function (userId, content, mediaUrl) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `INSERT INTO posts (user_id, content, media_url, created_at) VALUES (?, ?, ?, datetime('now'))`;
          db.run(sql, [userId, content, mediaUrl], function (err) {
            closeDB(db);
            if (err) reject(err);
            else
              resolve({
                id: this.lastID,
                userId,
                content,
                mediaUrl,
                created_at: new Date(this.lastID),
              });
          });
        })
        .catch((err) => reject(err));
    });
  },

  getPostsByUser: function (userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `SELECT p.id, p.content, p.created_at, u.name,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
            (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'like') AS reaction_count,
            (SELECT type FROM reactions WHERE post_id = p.id AND user_id = $userId) AS user_reaction,
            (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'dislike') AS dislike_count
            FROM posts p
            JOIN user u ON p.user_id = u.id
            WHERE p.user_id = $userId
            ORDER BY p.created_at DESC`;
          db.all(sql, [userId], (err, posts) => {
            closeDB(db);
            if (err) reject(err);
            else resolve(posts);
          });
        })
        .catch((err) => reject(err));
    });
  },

  deletePost: function (postId, userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const sql = `DELETE FROM posts WHERE id = ? AND user_id = ?`;
          db.run(sql, [postId, userId], function (err) {
            closeDB(db);
            if (err) reject(err);
            else if (this.changes === 0)
              reject({ message: "No post found or user not authorized" });
            else resolve({ message: "Post deleted successfully" });
          });
        })
        .catch((err) => reject(err));
    });
  },

  getFeed: function (userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          // FETCH ALL POSTS
          const sql = `
            SELECT p.id, p.content, p.created_at, u.name,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
            (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type IN ('like', 'love', 'haha')) AS total_reactions,
            (SELECT type FROM reactions WHERE post_id = p.id AND user_id = $userId) AS user_reaction,
            (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'dislike') AS dislike_count
            FROM posts p
            JOIN user u ON p.user_id = u.id
            ORDER BY p.created_at DESC`;
          console.log("Executing SQL:", sql, "with userId:", userId);
          db.all(sql, [userId], (err, posts) => {
            closeDB(db);
            if (err) reject(err);
            else resolve(posts);
          });
        })
        .catch((err) => reject(err));
    });
  },

  followingFeed: function (userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          // FETCH FOLLOWING POSTS
          const sql = `
            SELECT p.id, p.content, p.created_at, u.name,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
            (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type IN ('like', 'love', 'haha')) AS total_reactions,
            (SELECT type FROM reactions WHERE post_id = p.id AND user_id = $userId) AS user_reaction,
            (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND type = 'dislike') AS dislike_count
            FROM posts p
            JOIN user u ON p.user_id = u.id
            JOIN follows f ON p.user_id = f.followed_id
            WHERE f.follower_id = $userId
            ORDER BY p.created_at DESC`;
          console.log("Executing SQL:", sql, "with userId:", userId);
          db.all(sql, [userId], (err, posts) => {
            closeDB(db);
            if (err) reject(err);
            else resolve(posts);
          });
        })
        .catch((err) => reject(err));
    });
  },
};

module.exports = postModel;
