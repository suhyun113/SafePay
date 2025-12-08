const crypto = require('crypto');

// 재생 공격 방지용 Nonce 생성
exports.generateNonce = () => crypto.randomBytes(16).toString('hex');

// HMAC-SHA256 서명 생성 (OpenSSL 기반)
exports.signPayload = (payload, secret) => {
    return crypto.createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
};
