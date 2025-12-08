const db = require('../config/db');

exports.createUser = async (email, hashedPw) => {
    const sql = `
        INSERT INTO users (email, password)
        VALUES (?, ?)`;
    await db.execute(sql, [email, hashedPw]);
};

exports.findUserById = async (id) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE id = ?`, [id]
    );
    return rows[0];
};

exports.findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE email = ?`, [email]
    );
    return rows[0];
};

exports.updateRefreshToken = async (userId, token) => {
    await db.execute(
        `UPDATE users SET refresh_token = ? WHERE id = ?`,
        [token, userId]
    );
};

exports.revokeToken = async (userId) => {
    await db.execute(
        `UPDATE users SET refresh_token = NULL WHERE id = ?`,
        [userId]
    );
};
