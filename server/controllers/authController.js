const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    const hashedPw = await bcrypt.hash(password, 10);
    await User.createUser(email, hashedPw);

    res.json({ message: "Signup success" });
};

exports.login = async (req, res) => {
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

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    await User.updateRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false
    });

    res.json({ accessToken });
};

exports.logout = async (req, res) => {
    const userId = req.user.id;
    await User.revokeToken(userId);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
};
