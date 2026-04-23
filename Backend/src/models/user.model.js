const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["Student","Staff","Admin"],
    required: true
  },

  image: {
    type: String
  },

  category: {
    type: String,
    enum: ["wifi","hostel","electricity","classroom","other"],
    default: null
  }

});

module.exports = mongoose.model("User", userSchema);