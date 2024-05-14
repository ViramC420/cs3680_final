const sqlite3 = require("sqlite3").verbose();
const { openDB, closeDB } = require("../calls/user");

const userModel = {
  createUser: function (name, hashedPassword, email) {
    return openDB()
      .then((db) => {
        const sql = `INSERT INTO user (name, password, contact_email) VALUES (?, ?, ?)`;
        return new Promise((resolve, reject) => {
          db.run(sql, [name, hashedPassword, email], function (err) {
            closeDB(db);
            if (err) {
              console.error("Error inserting user into database:", err);
              reject(err);
            } else {
              console.log(`User created successfully, ID: ${this.lastID}`);
              resolve({
                message: "User created successfully",
                id: this.lastID,
              });
            }
          });
        });
      })
      .catch((err) => {
        console.error("Database operation failed:", err);
        throw err; // Rethrow or handle as needed
      });
  },

  findUserByName: function (name) {
    return openDB().then((db) => {
      const sql = `SELECT ID, password FROM user WHERE name = ?`;
      return new Promise((resolve, reject) => {
        db.get(sql, [name], (err, user) => {
          closeDB(db);
          if (err) reject(err);
          else resolve(user);
        });
      });
    });
  },

  // PROFILES
  getProfile: function (userId) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          console.log("Fetching profile for UserID:", userId); // DEBUG
          db.get("SELECT * FROM user WHERE ID = ?", [userId], (err, user) => {
            closeDB(db);
            if (err) reject(err);
            else if (!user) reject({ message: "User not found" });
            else resolve(user);
          });
        })
        .catch((err) => reject(err));
    });
  },

  updateProfile: function (userId, profileData) {
    return new Promise((resolve, reject) => {
      openDB()
        .then((db) => {
          const { name, bio, profile_picture_url, location, contact_email } =
            profileData;
          const sql = `UPDATE user SET name = ?, bio = ?, profile_picture_url = ?, location = ?, contact_email = ? WHERE ID = ?`;
          db.run(
            sql,
            [name, bio, profile_picture_url, location, contact_email, userId],
            function (err) {
              closeDB(db);
              if (err) reject(err);
              else if (this.changes === 0)
                reject({ message: "Profile update failed" });
              else resolve({ message: "Profile updated successfully" });
            }
          );
        })
        .catch((err) => reject(err));
    });
  },
};

module.exports = userModel;
