const jwt = require("jsonwebtoken");

exports.verifyAccess = (req, res, next) => {
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
    return res.status(403).json({ message: "Invalid token" });
  }
};
