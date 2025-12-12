const crypto = require('crypto');
// Node.js 내장 암호화 모듈로, 외부 라이브러리 없이 안전한 난수 및 해시 생성 가능

exports.generateNonce = () => {
    // 재전송 공격(replay attack)을 방지하기 위해 매 요청마다 고유한 난수 생성
    // randomBytes는 암호학적으로 안전한 난수를 생성함
    return crypto.randomBytes(16).toString('hex');
};

exports.signPayload = (payload, secret) => {
    // HMAC-SHA256 방식으로 payload에 대한 무결성 서명 생성
    // 서버만 알고 있는 secret을 사용하여 위조 방지
    return crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
};
