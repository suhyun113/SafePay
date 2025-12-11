const db = require('../config/db');

exports.writeLog = async (type, detail, success) => {
    try {
        // created_at이 있으면 포함, 없으면 제외
        const sql = `
            INSERT INTO attack_logs (attack_type, detail, success, created_at)
            VALUES (?, ?, ?, NOW())`;
        await db.execute(sql, [type, detail, success ? 1 : 0]);
        console.log(`[AttackLog] Saved: ${type} - ${detail.substring(0, 50)}`);
    } catch (err) {
        // created_at 컬럼이 없으면 다시 시도
        if (err.code === 'ER_BAD_FIELD_ERROR' && err.message.includes('created_at')) {
            try {
                const sqlWithoutDate = `
                    INSERT INTO attack_logs (attack_type, detail, success)
                    VALUES (?, ?, ?)`;
                await db.execute(sqlWithoutDate, [type, detail, success ? 1 : 0]);
                console.log(`[AttackLog] Saved (without created_at): ${type}`);
            } catch (err2) {
                console.error('[AttackLog] Failed to save:', err2.message);
                throw err2;
            }
        } else {
            console.error('[AttackLog] Failed to save:', err.message);
            throw err;
        }
    }
};
