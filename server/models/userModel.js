const db = require('../config/db'); // 사용자 계정 정보를 관리하기 위한 DB 연결 객체

exports.createUser = async (email, hashedPw) => {
    // 회원가입 시 이메일과 해시된 비밀번호를 저장
    const sql = `
        INSERT INTO users (email, password)
        VALUES (?, ?)
    `;
    await db.execute(sql, [email, hashedPw]);
};

exports.findUserById = async (id) => {
    // 사용자 ID 기준으로 계정 정보 조회
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE id = ?`,
        [id]
    );
    return rows[0];
};

exports.findUserByEmail = async (email) => {
    // 이메일 중복 확인 및 로그인 시 사용자 조회
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
    return rows[0];
};

exports.updateRefreshToken = async (userId, token) => {
    // 로그인 시 발급된 리프레시 토큰을 DB에 저장
    await db.execute(
        `UPDATE users SET refresh_token = ? WHERE id = ?`,
        [token, userId]
    );
};

exports.revokeToken = async (userId) => {
    // 로그아웃 시 리프레시 토큰을 제거하여 재사용 방지
    await db.execute(
        `UPDATE users SET refresh_token = NULL WHERE id = ?`,
        [userId]
    );
};
