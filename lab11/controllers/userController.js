const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

exports.registerUser = function (req, res) {
  const { name, password, email } = req.body.params;
  if (!name || !password || !email) {
    return res.status(400).json({
      jsonrpc: "2.0",
      error: { code: 400, message: "Name, password, and email are required" },
      id: req.body.id,
    });
  }

  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => userModel.createUser(name, hashedPassword, email))
    .then((user) =>
      res.status(201).json({
        jsonrpc: "2.0",
        result: {
          message: "User registered successfully",
          userId: user.id,
          name: name,
        },
        id: req.body.id,
      })
    )
    .catch((err) => {
      console.error("Error in registration:", err);
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: 500, message: err.message || "Internal Server Error" },
        id: req.body.id,
      });
    });
};

exports.loginUser = function (req, res) {
  const { name, password } = req.body.params;
  if (!name || !password) {
    return res.status(400).json({
      jsonrpc: "2.0",
      error: { code: 400, message: "Name and password are required" },
      id: req.body.id,
    });
  }

  userModel
    .findUserByName(name)
    .then((user) => {
      console.log("Lookup result for user:", user);
      if (!user) {
        console.log("No user found for name:", name);
        return res.status(404).json({
          jsonrpc: "2.0",
          error: { code: 404, message: "User not found" },
          id: req.body.id,
        });
      }
      console.log("User found:", user);
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            return res.status(401).json({
              jsonrpc: "2.0",
              error: { code: 401, message: "Invalid password or username" },
              id: req.body.id,
            });
          }

          try {
            const token = jwt.sign(
              { userId: user.ID },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            res.json({
              jsonrpc: "2.0",
              result: {
                token: token,
                userId: user.ID,
                message: "Login successful",
                userId: user.ID,
              },
              id: req.body.id,
            });
          } catch (err) {
            console.error("Error in token generation:", err);
            res.status(500).json({
              jsonrpc: "2.0",
              error: {
                code: 500,
                message: "Error generating token",
              },
              id: req.body.id,
            });
          }
        })
        .catch((err) => {
          console.error("Error in password comparison:", err);
          res.status(500).json({
            jsonrpc: "2.0",
            error: {
              code: 500,
              message: "Error comparing passwords",
            },
            id: req.body.id,
          });
        });
    })
    .catch((err) => {
      console.error("Database operation failed:", err);
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: 500, message: "Database operation failed" },
        id: req.body.id,
      });
    });
};

exports.getProfile = function (req, res) {
  const userId = req.body.params.userId;
  console.log("Fetching profile for UserID:", userId);

  userModel
    .getProfile(userId)
    .then((profile) => {
      res.json({
        jsonrpc: "2.0",
        result: profile,
        id: req.body.id,
      });
    })
    .catch((err) => {
      res.status(404).json({
        jsonrpc: "2.0",
        error: { code: 404, message: err.message || "Profile fetch failed" },
        id: req.body.id,
      });
    });
};

exports.updateProfile = function (req, res) {
  const userId = req.user.id; // JWTVERIFICATION
  const profileData = req.body.params;

  userModel
    .updateProfile(userId, profileData)
    .then((result) => {
      res.json({
        jsonrpc: "2.0",
        result: { message: "Profile updated successfully" },
        id: req.body.id,
      });
    })
    .catch((err) => {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: 500,
          message: err.message || "Failed to update profile",
        },
        id: req.body.id,
      });
    });
};
