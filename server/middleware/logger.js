const morgan = require('morgan'); // HTTP 요청 정보를 자동으로 기록하는 미들웨어
const fs = require('fs');
const path = require('path');

// 요청 로그를 파일로 저장하기 위한 write stream 생성
// flags: 'a' → 기존 파일에 이어서 기록 (append)
const logStream = fs.createWriteStream(
    path.join(__dirname, '../logs/requests.log'),
    { flags: 'a' }
);

// Morgan의 combined 포맷 사용
// IP, 요청 메서드, 경로, 상태 코드, User-Agent 등 감사 로그에 필요한 정보 포함
module.exports = morgan('combined', { stream: logStream });
