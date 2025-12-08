const rateLimit = require('express-rate-limit');

exports.limit = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { msg: "Too many requests" }
});
