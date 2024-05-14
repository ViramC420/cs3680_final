/*
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// FOR FILE UPLOADS
const directories = [
  "uploads/",
  "uploads/profile-pictures/",
  "uploads/profile-backgrounds/",
  "uploads/post-images/",
  "uploads/comment-images/",
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// SET UP STORAGE FOR FILE UPLOADS
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = "uploads/"; // DEFAULT PATH
    if (req.baseUrl.includes("profile-picture")) {
      path += "profile-pictures/";
    } else if (req.baseUrl.includes("profile-background")) {
      path += "profile-backgrounds/";
    } else if (req.baseUrl.includes("posts") && req.method === "POST") {
      path += "post-images/";
    } else if (req.baseUrl.includes("comments")) {
      path += "comment-images/";
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const imageFilter = function (req, file, cb) {
  // ACCEPT IMAGE FILES ONLY
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });
*/
// HELPER FUNCTION TO GENERATE RESPONSE BODY
let jsonRes = function (response, id) {
  return {
    jsonrpc: "2.0",
    result: response,
    id: id,
  };
};

// HELPER FUNCTION TO GENERATE ERROR BODY
let jsonErr = function (code, message, id) {
  return {
    jsonrpc: "2.0",
    error: {
      code: code,
      message: message,
    },
    id: id,
  };
};

// EXPORT HELPER FUNCTIONS
exports.jsonRes = jsonRes;
exports.jsonErr = jsonErr;

// EXPORT MIDDLEWARE FUNCTION TO VALIDATE JSONRPC BODY
exports.validJRPC = function () {
  return (req, res, next) => {
    let body = req.body;

    if (!body.jsonrpc) {
      res.send(jsonErr(-32600, "Must include jsonrpc version", body.id));
      return;
    }

    if (!body.method) {
      res.send(jsonErr(-32601, "Method not found", body.id));
      return;
    }

    if (!body.params) {
      res.send(jsonErr(-32602, "Invalid params", body.id));
      return;
    }

    if (!body.id) {
      res.send(jsonErr(-32603, "Must include id", null));
      return;
    }

    next();
  };
};
