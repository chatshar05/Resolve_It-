const jwt = require("jsonwebtoken");

function getToken(req) {

  // from cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  // from Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
}


// ================= STUDENT =================

async function authStudent(req, res, next) {

  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Student") {
      return res.status(403).json({ message: "You dont have access" });
    }

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });

  }

}


// ================= STAFF =================

async function authStaff(req, res, next) {

  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Staff") {
      return res.status(403).json({ message: "You dont have access" });
    }

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });

  }

}


// ================= ADMIN =================

async function authAdmin(req, res, next) {

  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "You dont have access" });
    }

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });

  }

}

module.exports = { authStudent, authStaff, authAdmin };