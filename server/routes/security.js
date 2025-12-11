const express = require('express');
const router = express.Router();
const security = require('../controllers/securityController');
const { verifyAccess } = require('../middleware/authMiddleware');

// 보안 통계 조회 (인증 필요)
router.get('/stats', verifyAccess, security.getStats);

// 보안 로그 조회 (인증 필요)
router.get('/logs', verifyAccess, security.getSecurityLogs);

// 공격 로그 조회 (인증 필요)
router.get('/attack-logs', verifyAccess, security.getAttackLogs);

// 감사 로그 조회 (인증 필요)
router.get('/audit-logs', verifyAccess, security.getAuditLogs);

module.exports = router;

