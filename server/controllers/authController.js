const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    // 이메일 중복 체크
    const exists = await User.findUserByEmail(email);
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPw = await bcrypt.hash(password, 10);
    await User.createUser(email, hashedPw);

    res.json({ message: "Signup success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ message: "Wrong password" });

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await User.updateRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findUserById(decoded.id);

    if (!user || user.refresh_token !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccess = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({ accessToken: newAccess });
  } catch (err) {
    res.status(403).json({ message: "Refresh failed" });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.revokeToken(userId);

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};
