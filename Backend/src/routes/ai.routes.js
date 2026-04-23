const express = require("express");
const router = express.Router();

const { analyzeComplaint } = require("../controllers/ai.controller");

router.post("/analyze", analyzeComplaint);

module.exports = router;