require('dotenv').config(); // 환경 변수(.env)를 process.env로 로드하여 비밀 정보 노출 방지

const express = require('express'); // Node.js 기반 웹 서버 프레임워크
const cors = require('cors'); // 프론트엔드와의 교차 출처 요청(CORS)을 제어하기 위한 미들웨어
const cookieParser = require('cookie-parser'); // HTTP 요청의 쿠키를 파싱하여 req.cookies로 접근 가능하게 함

const helmet = require('helmet'); // HTTP 보안 헤더를 자동 설정하여 XSS, Clickjacking 등 공격 완화
const logger = require('./middleware/logger'); // 모든 HTTP 요청을 파일 기반 감사 로그로 기록하는 미들웨어

const authRoutes = require('./routes/auth'); // 회원가입, 로그인, 토큰 관련 인증 API 라우트
const paymentRoutes = require('./routes/payment'); // 결제 및 무결성 검증 관련 API 라우트
const shopRoutes = require("./routes/shop"); // 상품 목록 및 조회 관련 API 라우트
const securityRoutes = require('./routes/security'); // 보안 로그, 공격 로그, 통계 조회 API 라우트

const app = express();

// HTTP 보안 헤더 적용
app.use(helmet());

// 프론트엔드(localhost:5173)만 허용하고 쿠키 기반 인증을 가능하게 설정
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON 요청 바디 파싱
app.use(express.json());

// 쿠키 파싱 (refresh token 처리용)
app.use(cookieParser());

// 모든 요청에 대해 감사 로그 기록
app.use(logger);

// 인증 관련 API
app.use('/api/auth', authRoutes);

// 결제 및 무결성 검증 API
app.use('/api/payment', paymentRoutes);

// 상품 조회 API
app.use("/api/shop", shopRoutes);

// 보안 로그 및 통계 API
app.use('/api/security', securityRoutes);

// 서버 상태 확인용 기본 엔드포인트
app.get('/', (req, res) => {
    res.send('SafePay Server Running');
});

// 서버 실행
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});