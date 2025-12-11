# 데이터베이스 스키마 설정

## 필요한 테이블

현재 `safepay` 데이터베이스에는 다음 테이블들이 필요합니다:

### 1. 기존 테이블 (이미 존재)
- ✅ `users` - 사용자 정보
- ✅ `orders` - 주문 정보  
- ✅ `attack_logs` - 공격 로그

### 2. 추가 필요 테이블
- ❌ `security_logs` - 보안 로그 (Rate-Limit, 하이재킹 시도 등)

## 설치 방법

### 방법 1: SQL 파일 실행
```sql
-- create_security_logs.sql 파일의 내용을 실행하세요
USE safepay;

CREATE TABLE IF NOT EXISTS security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_type VARCHAR(50) NOT NULL,
    detail TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_log_type (log_type),
    INDEX idx_created_at (created_at)
);
```

### 방법 2: phpMyAdmin에서 실행
1. phpMyAdmin에서 `safepay` 데이터베이스 선택
2. "SQL" 탭 클릭
3. `create_security_logs.sql` 파일의 내용을 복사하여 실행

### 방법 3: MySQL 명령줄에서 실행
```bash
mysql -u [사용자명] -p safepay < server/database/create_security_logs.sql
```

## 테이블 구조 확인

모든 테이블이 생성되었는지 확인:
```sql
SHOW TABLES FROM safepay;
```

다음 4개 테이블이 보여야 합니다:
- users
- orders
- attack_logs
- security_logs

