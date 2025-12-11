const db = require('../config/db');

// Rate-Limit 차단 로그 저장
exports.logRateLimit = async (ip) => {
    try {
        const sql = `
            INSERT INTO security_logs (log_type, detail, ip_address, created_at)
            VALUES ('RATE_LIMIT', 'Too many requests', ?, NOW())
        `;
        await db.execute(sql, [ip]);
        console.log(`[SecurityLog] Rate-Limit blocked: ${ip}`);
    } catch (err) {
        // 테이블이 없으면 에러를 무시 (로그만 출력)
        if (err.code === 'ER_NO_SUCH_TABLE') {
            console.warn('security_logs table does not exist. Please run schema.sql');
        } else {
            console.error('Error logging rate limit:', err.message);
        }
    }
};

// 하이재킹 시도 로그 저장 (JWT 검증 실패)
exports.logHijackingAttempt = async (ip, detail) => {
    try {
        const sql = `
            INSERT INTO security_logs (log_type, detail, ip_address, created_at)
            VALUES ('HIJACKING', ?, ?, NOW())
        `;
        await db.execute(sql, [detail, ip]);
        console.log(`[SecurityLog] Hijacking attempt logged: ${detail} from ${ip}`);
    } catch (err) {
        // 테이블이 없으면 에러를 무시 (로그만 출력)
        if (err.code === 'ER_NO_SUCH_TABLE') {
            console.warn('security_logs table does not exist. Please run schema.sql');
        } else {
            console.error('Error logging hijacking attempt:', err.message);
        }
    }
};

// 보안 통계 조회
exports.getSecurityStats = async () => {
    try {
        // Rate-Limit 차단 수
        let rateLimitBlocks = 0;
        try {
            const rateLimitSql = `
                SELECT COUNT(*) as count FROM security_logs 
                WHERE log_type = 'RATE_LIMIT'
            `;
            const [rateLimitResult] = await db.execute(rateLimitSql);
            rateLimitBlocks = rateLimitResult[0]?.count || 0;
        } catch (err) {
            console.error('Error fetching rate limit stats:', err.message);
        }
        
        // CSRF 공격 차단 수
        let csrfBlocks = 0;
        try {
            const csrfSql = `
                SELECT COUNT(*) as count FROM attack_logs 
                WHERE attack_type = 'CSRF' AND success = 0
            `;
            const [csrfResult] = await db.execute(csrfSql);
            csrfBlocks = csrfResult[0]?.count || 0;
        } catch (err) {
            console.error('Error fetching CSRF stats:', err.message);
        }
        
        // 하이재킹 시도 차단 수
        let hijackingAttempts = 0;
        try {
            const hijackingSql = `
                SELECT COUNT(*) as count FROM security_logs 
                WHERE log_type = 'HIJACKING'
            `;
            const [hijackingResult] = await db.execute(hijackingSql);
            hijackingAttempts = hijackingResult[0]?.count || 0;
        } catch (err) {
            console.error('Error fetching hijacking stats:', err.message);
        }
        
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

