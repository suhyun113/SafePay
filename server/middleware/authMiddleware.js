const jwt = require("jsonwebtoken"); // JWT 토큰의 서명 검증 및 디코딩을 담당하는 라이브러리
const SecurityLog = require("../models/securityLogModel"); // 토큰 위조, 세션 탈취 시도를 기록하기 위한 보안 로그 모델

exports.verifyAccess = async (req, res, next) => {
  // Authorization 헤더에서 토큰 추출
  const header = req.headers.authorization;

  // Authorization 헤더 자체가 없는 경우 → 인증 시도 자체를 차단
  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  // "Bearer <token>" 형식에서 실제 토큰만 분리
  const token = header.split(" ")[1];

  // Bearer 형식이 맞지 않거나 토큰이 없는 경우
  if (!token) {
    return res.status(401).json({ message: "Token format incorrect" });
  }

  try {
    // 서버 비밀키로 토큰 서명 검증
    // 위조되지 않은 경우 payload를 복호화
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 이후 컨트롤러에서 사용자 정보를 사용하기 위해 req.user에 저장
    req.user = decoded;

    // 인증 성공 → 다음 미들웨어 또는 컨트롤러로 이동
    next();
  } catch (err) {
    // JWT 검증 실패 유형 확인 (만료 / 위조 등)
    console.error("JWT VERIFY ERROR:", err.name);

    // 토큰 만료는 정상적인 경우일 수 있으므로 401로 처리
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    // 만료가 아닌 경우는 토큰 위조 또는 탈취 시도로 판단
    const ip = req.ip || req.connection.remoteAddress;

    // IP 기반 세션 탈취 시도 로그 기록
    await SecurityLog.logHijackingAttempt(ip, "Invalid token signature");

    return res.status(403).json({ message: "Invalid token" });
  }
};
