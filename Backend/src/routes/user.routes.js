const express = require("express");
const router = express.Router();

const { getStaffUsers } = require("../controllers/complaint.controller");
const { authAdmin } = require("../middleware/auth.middleware");

router.get("/staff-users", authAdmin, getStaffUsers);

module.exports = router;