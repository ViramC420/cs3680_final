require("dotenv").config();
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const filepath = "./sql/data/app.db";

const saltRounds = 10;

function openDB() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filepath, (err) => {
      if (err) {
        console.error(err.message);
        reject(err); // IF ERR, REJECT PROMISE
      } else {
        console.log("Opened DB Connection");
        resolve(db); // RESOLVE PROMISE WITH DB
      }
    });
  });
}

function closeDB(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
        reject(err); // IF ERR, REJECT PROMISE
      } else {
        console.log("Closed DB Connection");
        resolve(); // RESOLVE PROMISE WITH DB
      }
    });
  });
}

exports.openDB = openDB;
exports.closeDB = closeDB;

//------------//
// PAGINATION //
//------------//

exports.getPaginatedPosts = function (userId, limit, offset) {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const sql = `
        SELECT * FROM posts 
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?;
      `;
        db.all(sql, [userId, limit, offset], (err, rows) => {
          closeDB(db);
          if (err) {
            reject(err.message);
          } else {
            resolve(rows);
          }
        });
      })
      .catch((err) => reject(err));
  });
};

exports.getPaginatedComments = function (postId, limit, offset) {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const sql = `
        SELECT * FROM comments 
        WHERE post_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?;
      `;
        db.all(sql, [postId, limit, offset], (err, rows) => {
          closeDB(db);
          if (err) {
            reject(err.message);
          } else {
            resolve(rows);
          }
        });
      })
      .catch((err) => reject(err));
  });
};
