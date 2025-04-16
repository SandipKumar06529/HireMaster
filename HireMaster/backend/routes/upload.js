const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: "No image uploaded" });
  }
  return res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;
