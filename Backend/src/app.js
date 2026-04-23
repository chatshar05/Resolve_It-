const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const complaintRoutes = require('./routes/complaint.routes');
const userRoutes = require("./routes/user.routes");

const aiRoutes = require("./routes/ai.routes");
const { default: api } = require('../../Frontend/src/services/api');

const app = express();     // creeating express framework instance , now this app object will control the entire server 

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());   // middleware used for raw data , but other case like form-data we use multer as this 
// is unsupported teher .... with it we can access like re.body.email
app.use(cookieParser());


app.use('/api/auth',authRoutes);          //conmect auth routes to the server 
app.use('/api/complaints',complaintRoutes);   
app.use("/api/users", userRoutes);



// ai api

app.use("/api/ai", aiRoutes);

module.exports = app;