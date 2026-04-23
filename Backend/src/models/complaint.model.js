const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["wifi", "hostel", "electricity", "classroom", "other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["severe", "moderate", "medium"],
      default: "medium",
    },
    image: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["open", "assigned", "in-progress", "resolved"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🔽 ADD THESE NEW FIELDS

    resolutionImage: {
      type: String,
      default: null,
    },

    resolutionDescription: {
      type: String,
      default: "",
    },

    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("complaint", complaintSchema);