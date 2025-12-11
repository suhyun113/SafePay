# SafePay

결제 보안 실시간 학습 플랫폼

## 기능

- **Compare Mode**: 안전한 결제 흐름과 공격 흐름을 한 화면에서 비교
- **보안 통계 대시보드**: Chart.js를 통한 보안 이벤트 시각화
  - Rate-Limit에 의한 IP 차단 통계
  - CSRF 공격 실패 통계
  - 하이재킹 시도 차단 통계
  - 공격 유형별 통계
  - 최근 7일간 보안 이벤트 추이
- **로그 조회**: 보안 로그, 공격 로그, 감사 로그를 분리하여 조회

## 데이터베이스 설정

`server/database/schema.sql` 파일을 실행하여 필요한 테이블을 생성하세요.

```sql
-- Security Logs 테이블
CREATE TABLE IF NOT EXISTS security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_type VARCHAR(50) NOT NULL,
    detail TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_log_type (log_type),
    INDEX idx_created_at (created_at)
);

-- Attack Logs 테이블
CREATE TABLE IF NOT EXISTS attack_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attack_type VARCHAR(50) NOT NULL,
    detail TEXT,
    success BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attack_type (attack_type),
    INDEX idx_created_at (created_at)
);
```

## 실행 방법

1. 서버 실행:
```bash
cd server
npm install
npm start
```

2. 클라이언트 실행:
```bash
cd client
npm install
npm run dev
```