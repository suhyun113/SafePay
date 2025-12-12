const db = require('../config/db');

// 보안 통계 조회
exports.getSecurityStats = async () => {
    try {
        // 공격 유형별 통계
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
            console.log(`[Stats] Attack types: ${attackTypes.length} types found`);
        } catch (err) {
            console.error('Error fetching attack type stats:', err.message);
        }
        
        // 최근 7일간 일별 통계
        let dailyStats = [];
        try {
            const dailySql = `
                SELECT DATE(created_at) as date, 
                       COUNT(*) as count,
                       log_type
                FROM security_logs
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at), log_type
                ORDER BY date ASC
            `;
            const [dailyResult] = await db.execute(dailySql);
            dailyStats = dailyResult || [];
            console.log(`[Stats] Daily stats: ${dailyStats.length} records found`);
        } catch (err) {
            console.error('Error fetching daily stats:', err.message);
        }
        
        return {
            rateLimitBlocks,
            csrfBlocks,
            hijackingAttempts,
            attackTypes,
            dailyStats
        };
    } catch (err) {
        console.error('Error in getSecurityStats:', err);
        throw err;
    }
};

// 보안 로그 조회
exports.getSecurityLogs = async (page = 1, limit = 50, logType = null) => {
    try {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT id, log_type, detail, ip_address, created_at
            FROM security_logs
        `;
        const params = [];
        
        if (logType) {
            sql += ` WHERE log_type = ?`;
            params.push(logType);
        }
        
        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        
        const [logs] = await db.execute(sql, params);
        
        // 전체 개수 조회
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
        // 테이블이 없을 경우 빈 결과 반환
        if (err.code === 'ER_NO_SUCH_TABLE') {
            console.warn('security_logs table does not exist');
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

// 공격 로그 조회
exports.getAttackLogs = async (page = 1, limit = 50, attackType = null) => {
    try {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT id, attack_type, detail, success, created_at
            FROM attack_logs
        `;
        const params = [];
        
        if (attackType) {
            sql += ` WHERE attack_type = ?`;
            params.push(attackType);
        }
        
        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        
        const [logs] = await db.execute(sql, params);
        
        // 전체 개수 조회
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
        // 테이블이 없을 경우 빈 결과 반환
        if (err.code === 'ER_NO_SUCH_TABLE') {
            console.warn('attack_logs table does not exist');
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

