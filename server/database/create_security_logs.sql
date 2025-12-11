-- security_logs 테이블 생성
-- 이 테이블은 Rate-Limit 차단 및 하이재킹 시도 로그를 저장합니다.

USE safepay;

CREATE TABLE IF NOT EXISTS security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_type VARCHAR(50) NOT NULL COMMENT '로그 유형: RATE_LIMIT, HIJACKING',
    detail TEXT COMMENT '상세 설명',
    ip_address VARCHAR(45) COMMENT 'IP 주소',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    INDEX idx_log_type (log_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='보안 로그 테이블';

