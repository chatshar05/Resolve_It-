const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  assignComplaint,
  getAssignedComplaints,
  updateComplaintStatus,
  resolveComplaint,
  getStaffUsers,
  updateComplaint,
  deleteComplaint
} = require("../controllers/complaint.controller");

const {
  authStudent,
  authAdmin,
  authStaff
} = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");



/* ================= ADMIN ROUTES ================= */

// get all complaints
router.get("/admin", authAdmin, getAllComplaints);

// get all staff users
router.get("/staff-users", authAdmin, getStaffUsers);

// assign complaint to staff
router.patch("/:id/assign", authAdmin, assignComplaint);



/* ================= STAFF ROUTES ================= */

// complaints assigned to staff
router.get("/staff", authStaff, getAssignedComplaints);

// update complaint status (in progress etc)
router.patch("/:id/status", authStaff, updateComplaintStatus);

// resolve complaint with proof
router.post(
  "/:id/resolve",
  authStaff,
  upload.single("image"),
  resolveComplaint
);

/* ================= STUDENT ROUTES ================= */

// create complaint with image upload
router.post(
  "/",
  authStudent,
  upload.single("image"),
  createComplaint
);

// get student's complaints
router.get("/my", authStudent, getMyComplaints);

// edit complaint
router.patch("/:id/edit", authStudent, updateComplaint);

// delete complaint
router.delete("/:id", authStudent, deleteComplaint);



/* ================= COMMON ROUTE ================= */

// get complaint details
router.get("/:id", getComplaintById);



module.exports = router;