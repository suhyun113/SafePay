const SecurityLog = require('../models/securityLogModel'); // 보안 이벤트(차단 횟수, 통계)를 관리하는 모델
const fs = require('fs');
const path = require('path');

exports.getStats = async (req, res) => {
    try {
        // 보안 통계 데이터(DB 집계 결과) 조회
        const stats = await SecurityLog.getSecurityStats();
        res.json(stats);
    } catch (err) {
        // 통계 조회 실패 시에도 프론트 오류 방지를 위해 기본값 반환
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

exports.getSecurityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, logType } = req.query;

        // 페이지네이션 기반 보안 로그 조회
        const result = await SecurityLog.getSecurityLogs(
            parseInt(page),
            parseInt(limit),
            logType || null
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch security logs" });
    }
};

exports.getAttackLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, attackType } = req.query;

        // 공격 유형 필터링이 가능한 공격 로그 조회
        const result = await SecurityLog.getAttackLogs(
            parseInt(page),
            parseInt(limit),
            attackType || null
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch attack logs" });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        // 서버 요청 로그 파일 경로 지정
        const logFilePath = path.join(__dirname, '../logs/requests.log');

        // 로그 파일이 없는 경우 빈 결과 반환
        if (!fs.existsSync(logFilePath)) {
            return res.json({ logs: [], total: 0, page: 1, limit: 50 });
        }

        // 로그 파일 전체 읽기
        const logContent = fs.readFileSync(logFilePath, 'utf-8');

        // 로그 라인 단위 분리
        const lines = logContent.split('\n').filter(line => line.trim());
        const total = lines.length;

        // 페이지네이션 계산
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);

        // 최신 로그가 먼저 보이도록 역순 정렬
        const paginatedLines = lines.slice(startIndex, endIndex).reverse();

        // Morgan combined 로그 포맷 파싱
        const logs = paginatedLines.map((line, index) => {
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
        res.status(500).json({ message: "Failed to fetch audit logs" });
    }
};
