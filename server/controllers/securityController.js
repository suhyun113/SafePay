const SecurityLog = require('../models/securityLogModel');
const AttackLog = require('../models/attackLogModel');
const fs = require('fs');
const path = require('path');

// 보안 통계 조회
exports.getStats = async (req, res) => {
    try {
        const stats = await SecurityLog.getSecurityStats();
        console.log('[SecurityController] Stats fetched:', {
            rateLimit: stats.rateLimitBlocks,
            csrf: stats.csrfBlocks,
            hijacking: stats.hijackingAttempts,
            attackTypesCount: stats.attackTypes?.length || 0,
            dailyStatsCount: stats.dailyStats?.length || 0
        });
        res.json(stats);
    } catch (err) {
        console.error('Error in getStats:', err);
        // 에러가 발생해도 기본값으로 응답
        res.json({
            rateLimitBlocks: 0,
            csrfBlocks: 0,
            hijackingAttempts: 0,
            attackTypes: [],
            dailyStats: [],
            error: err.message
        });
    }
};

// 보안 로그 조회
exports.getSecurityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, logType } = req.query;
        const result = await SecurityLog.getSecurityLogs(
            parseInt(page),
            parseInt(limit),
            logType || null
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch security logs" });
    }
};

// 공격 로그 조회
exports.getAttackLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, attackType } = req.query;
        const result = await SecurityLog.getAttackLogs(
            parseInt(page),
            parseInt(limit),
            attackType || null
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch attack logs" });
    }
};

// 감사 로그 조회 (파일 기반)
exports.getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const logFilePath = path.join(__dirname, '../logs/requests.log');
        
        if (!fs.existsSync(logFilePath)) {
            return res.json({ logs: [], total: 0, page: 1, limit: 50 });
        }
        
        const logContent = fs.readFileSync(logFilePath, 'utf-8');
        const lines = logContent.split('\n').filter(line => line.trim());
        const total = lines.length;
        
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedLines = lines.slice(startIndex, endIndex).reverse();
        
        const logs = paginatedLines.map((line, index) => {
            // Morgan combined format 파싱
            const parts = line.match(/^(\S+) - (\S+) \[([^\]]+)\] "([^"]+)" (\d+) (\d+) "([^"]+)" "([^"]+)"$/);
            if (parts) {
                return {
                    id: startIndex + index + 1,
                    ip: parts[1],
                    user: parts[2],
                    timestamp: parts[3],
                    method: parts[4].split(' ')[0],
                    path: parts[4].split(' ')[1],
                    status: parts[5],
                    size: parts[6],
                    referer: parts[7],
                    userAgent: parts[8],
                    raw: line
                };
            }
            return {
                id: startIndex + index + 1,
                raw: line
            };
        });
        
        res.json({
            logs,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch audit logs" });
    }
};

