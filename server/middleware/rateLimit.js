const rateLimit = require('express-rate-limit');
const SecurityLog = require('../models/securityLogModel');

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { msg: "Too many requests" },
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
        // Rate-Limit 차단 시 로그 저장
        const ip = req.ip || req.connection.remoteAddress;
        try {
            await SecurityLog.logRateLimit(ip);
        } catch (err) {
            console.error('Failed to log rate limit:', err);
        }
        res.status(429).json({ msg: "Too many requests" });
    }
});

exports.limit = limiter;
