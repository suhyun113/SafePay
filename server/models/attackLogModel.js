const db = require('../config/db');

exports.writeLog = async (type, detail, success) => {
    const sql = `
        INSERT INTO attack_logs (attack_type, detail, success)
        VALUES (?, ?, ?)`;
    await db.execute(sql, [type, detail, success]);
};
