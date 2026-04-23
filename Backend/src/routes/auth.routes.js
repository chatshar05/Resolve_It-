const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");

const authController = require("../controllers/auth.controller");

router.post("/register", upload.single("image"), authController.registerUser);

router.post("/login", authController.loginUser);

module.exports = router;