const db = require('../config/db'); // 보안 로그 및 통계 정보를 조회하기 위한 DB 연결 객체

exports.getSecurityStats = async () => {
    try {
        // 공격 유형별 차단 통계 조회
        let attackTypes = [];
        try {
            const attackTypeSql = `
                SELECT attack_type, COUNT(*) as count 
                FROM attack_logs 
                WHERE success = 0 OR success = FALSE
                GROUP BY attack_type
                ORDER BY count DESC
            `;
            const [attackTypeResult] = await db.execute(attackTypeSql);
            attackTypes = attackTypeResult || [];
        } catch (err) {
            // 통계 테이블이 없거나 오류 발생 시에도 전체 로직은 중단하지 않음
            console.error('Error fetching attack type stats:', err.message);
        }

        // 최근 7일간 보안 로그 일별 통계 조회
        let dailyStats = [];
        try {
            const dailySql = `
                SELECT DATE(created) as date, 
                       COUNT(*) as count,
                       log_type
                FROM security_logs
                WHERE created >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(created), log_type
                ORDER BY date ASC
            `;
            const [dailyResult] = await db.execute(dailySql);
            dailyStats = dailyResult || [];
        } catch (err) {
            console.error('Error fetching daily stats:', err.message);
        }
        
        return {
            attackTypes,
            dailyStats
        };
    } catch (err) {
        console.error('Error in getSecurityStats:', err);
        throw err;
    }
};

exports.getSecurityLogs = async (page = 1, limit = 50, logType = null) => {
    try {
        // 페이지네이션 계산
        const offset = (page - 1) * limit;

        let sql = `
            SELECT id, log_type, detail, ip_address, created
            FROM security_logs
        `;
        const params = [];

        // 특정 보안 로그 유형만 조회하는 경우
        if (logType) {
            sql += ` WHERE log_type = ?`;
            params.push(logType);
        }

        sql += ` ORDER BY created DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [logs] = await db.execute(sql, params);

        // 전체 로그 개수 조회
        let countSql = `SELECT COUNT(*) as total FROM security_logs`;
        const countParams = [];
        if (logType) {
            countSql += ` WHERE log_type = ?`;
            countParams.push(logType);
        }
        const [countResult] = await db.execute(countSql, countParams);

        return {
            logs: logs || [],
            total: countResult[0]?.total || 0,
            page,
            limit
        };
    } catch (err) {
        // 테이블이 존재하지 않는 경우 빈 결과 반환
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return {
                logs: [],
                total: 0,
                page,
                limit
            };
        }
        throw err;
    }
};

exports.getAttackLogs = async (page = 1, limit = 50, attackType = null) => {
    try {
        const offset = (page - 1) * limit;

        let sql = `
            SELECT id, attack_type, detail, success, created
            FROM attack_logs
        `;
        const params = [];

        // 특정 공격 유형만 필터링
        if (attackType) {
            sql += ` WHERE attack_type = ?`;
            params.push(attackType);
        }

        sql += ` ORDER BY created DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [logs] = await db.execute(sql, params);

        // 전체 로그 개수 조회
        let countSql = `SELECT COUNT(*) as total FROM attack_logs`;
        const countParams = [];
        if (attackType) {
            countSql += ` WHERE attack_type = ?`;
            countParams.push(attackType);
        }
        const [countResult] = await db.execute(countSql, countParams);

        return {
            logs: logs || [],
            total: countResult[0]?.total || 0,
            page,
            limit
        };
    } catch (err) {
        // 공격 로그 테이블이 없는 경우에도 예외 없이 처리
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return {
                logs: [],
                total: 0,
                page,
                limit
            };
        }
        throw err;
    }
};
