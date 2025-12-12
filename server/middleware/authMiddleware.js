const jwt = require("jsonwebtoken");
const SecurityLog = require("../models/securityLogModel");

exports.verifyAccess = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token format incorrect" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err.name);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    const ip = req.ip || req.connection.remoteAddress;
    await SecurityLog.logHijackingAttempt(ip, "Invalid token signature");

    return res.status(403).json({ message: "Invalid token" });
  }
};
