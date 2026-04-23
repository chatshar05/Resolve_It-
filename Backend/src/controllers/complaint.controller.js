const Complaint = require("../models/complaint.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const axios = require("axios");
const imagekit = require("../config/imagekit");

async function createComplaint(req, res) {
  try {
    const { description, category, priority } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });

      imageUrl = result.url;
    }

    const complaint = await Complaint.create({
      description,
      category,
      priority,
      image: imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json({
      complaint,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getMyComplaints(req, res) {
  try {
    const complaints = await Complaint.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getComplaintById(req, res) {

  try {

    const complaint = await Complaint.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ complaint });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });

  }

}

async function getAllComplaints(req, res) {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({ count: complaints.length, complaints });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function assignComplaint(req, res) {
  try {
    const { assignedTo } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,

      {
        assignedTo: assignedTo,
        status: "assigned",
      },

      { new: true },
    );

    res.status(200).json({
      message: "Complaint assigned successfully",
      complaint,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAssignedComplaints(req, res) {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user.id });

    res.status(200).json({ complaints });
  } catch (err) {
    res.status(500).json({ message: "Internal serverError" });
  }
}

async function updateComplaintStatus(req, res) {
  try {
    const { status } = req.body;

    const allowedStatus = ["in-progress", "resolved"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true },
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint status is updated ",
      complaint,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const getStaffUsers = async (req, res) => {

  try {

    const staff = await User.find({ role: "Staff" }).select("-password");

    const staffWithTasks = await Promise.all(

      staff.map(async (s) => {

        const inProgress = await Complaint.countDocuments({
          assignedTo: s._id,
          status: "in-progress"
        });

        return {
          ...s.toObject(),
          inProgress
        };

      })

    );

    res.json({ staff: staffWithTasks });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

}

async function updateComplaint(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const now = new Date();
    const created = new Date(complaint.createdAt);

    const diff = (now - created) / (1000 * 60);
    if (diff > 5) {
      return res
        .status(400)
        .json({
          message: "You can only update complaint within 5 minutes of creation",
        });
    }

    const { description, category, priority } = req.body;
    complaint.description = description || complaint.description;
    complaint.category = category || complaint.category;
    complaint.priority = priority || complaint.priority;

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteComplaint(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // check owner
    if (complaint.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // check if assigned
    if (complaint.assignedTo) {
      return res.status(400).json({
        message: "Cannot delete complaint after assignment",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      message: "Complaint deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function resolveComplaint(req, res) {
  try {
    const { description } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Upload resolution image to ImageKit
    let imageUrl = "";

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });

      imageUrl = result.url;
    }

    complaint.status = "resolved";
    complaint.resolutionImage = imageUrl;
    complaint.resolutionDescription = description;
    complaint.resolvedAt = new Date();

    await complaint.save();

    res.status(200).json({
      message: "Complaint resolved successfully",
      complaint,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  assignComplaint,
  getAssignedComplaints,
  updateComplaintStatus,
  getStaffUsers,
  updateComplaint,
  deleteComplaint,
  resolveComplaint,
};
