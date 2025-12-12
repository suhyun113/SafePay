const db = require('../config/db'); // MySQL 커넥션 풀을 불러와 DB 쿼리를 실행하기 위한 객체

exports.writeLog = async (type, detail, success) => {
    try {
        // 공격 로그를 attack_logs 테이블에 저장
        // created_at 컬럼이 존재한다는 전제 하에 현재 시각을 함께 기록
        const sql = `
            INSERT INTO attack_logs (attack_type, detail, success, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        await db.execute(sql, [type, detail, success ? 1 : 0]);

        console.log(`[AttackLog] Saved: ${type} - ${detail.substring(0, 50)}`);
    } catch (err) {
        // DB 스키마에 created_at 컬럼이 없는 경우를 대비한 예외 처리
        if (err.code === 'ER_BAD_FIELD_ERROR' && err.message.includes('created_at')) {
            try {
                // 날짜 컬럼 없이 로그 저장을 재시도
                const sqlWithoutDate = `
                    INSERT INTO attack_logs (attack_type, detail, success)
                    VALUES (?, ?, ?)
                `;
                await db.execute(sqlWithoutDate, [type, detail, success ? 1 : 0]);

                console.log(`[AttackLog] Saved (without created_at): ${type}`);
            } catch (err2) {
                // 재시도까지 실패한 경우 에러를 상위로 전달
                console.error('[AttackLog] Failed to save:', err2.message);
                throw err2;
            }
        } else {
            // 기타 DB 오류 처리
            console.error('[AttackLog] Failed to save:', err.message);
            throw err;
        }
    }
};
