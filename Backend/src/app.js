const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");

const authRoutes = require('./routes/auth.routes');
const complaintRoutes = require('./routes/complaint.routes');
const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// CORS configuration (allow frontend requests)
app.use(cors({
  origin: true,
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check route (for testing backend)
app.get("/", (req, res) => {
  res.send("ResolveIt backend running 🚀");
});

module.exports = app;