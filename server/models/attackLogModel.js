const db = require('../config/db'); // MySQL 커넥션 풀을 불러와 DB 쿼리를 실행하기 위한 객체

exports.writeLog = async (type, detail, success) => {
    try {
        // 공격 로그를 attack_logs 테이블에 저장
        const sql = `
            INSERT INTO attack_logs (attack_type, detail, success, created)
            VALUES (?, ?, ?, NOW())
        `;
        await db.execute(sql, [type, detail, success ? 1 : 0]);

        console.log(`[AttackLog] Saved: ${type} - ${detail.substring(0, 50)}`);
    } catch (err) {
        // 기타 DB 오류 처리
        console.error('[AttackLog] Failed to save:', err.message);
    }
};
