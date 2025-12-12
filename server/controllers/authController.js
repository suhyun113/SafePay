const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const ACCESS_EXPIRE = "10m";
const REFRESH_EXPIRE = "7d";

/* =====================
   SIGNUP
===================== */
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  const exists = await User.findUserByEmail(email);
  if (exists)
    return res.status(400).json({ message: "Email already exists" });

  const hashedPw = await bcrypt.hash(password, 10);
  await User.createUser(email, hashedPw);

  res.json({ success: true });
};

/* =====================
   LOGIN
===================== */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findUserByEmail(email);
  if (!user)
    return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(403).json({ message: "Wrong password" });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_EXPIRE }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRE }
  );

  await User.updateRefreshToken(user.id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ accessToken });
};

/* =====================
   REFRESH
===================== */
exports.refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findUserById(decoded.id);

    if (!user || user.refresh_token !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccess = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_EXPIRE }
    );

    res.json({ accessToken: newAccess });
  } catch {
    res.status(403).json({ message: "Refresh failed" });
  }
};

/* =====================
   LOGOUT
===================== */
exports.logout = async (req, res) => {
  await User.revokeToken(req.user.id);
  res.clearCookie("refreshToken");
  res.json({ success: true });
};
