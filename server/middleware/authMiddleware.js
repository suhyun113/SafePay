const jwt = require("jsonwebtoken");
const SecurityLog = require("../models/securityLogModel");

exports.verifyAccess = async (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;

  if (!header) {
    return res.status(403).json({ message: "No token" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token format incorrect" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err);
    
    // 하이재킹 시도 로그 저장
    const ip = req.ip || req.connection.remoteAddress;
    const detail = err.name === 'TokenExpiredError' 
      ? 'Expired token attempt' 
      : 'Invalid token attempt';
    
    try {
      await SecurityLog.logHijackingAttempt(ip, detail);
    } catch (logErr) {
      console.error('Failed to log hijacking attempt:', logErr);
    }
    
    return res.status(403).json({ message: "Invalid token" });
  }
};
