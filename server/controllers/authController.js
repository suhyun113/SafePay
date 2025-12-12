const bcrypt = require("bcrypt"); // 비밀번호를 해시(암호화)하기 위한 라이브러리. 평문 저장을 방지함
const jwt = require("jsonwebtoken"); // JWT(Json Web Token) 생성 및 검증을 위한 라이브러리
const User = require("../models/userModel"); // 사용자 DB 접근 로직을 담당하는 모델

// 액세스 토큰 만료 시간: 짧게 설정하여 보안 강화
const ACCESS_EXPIRE = "1h";
// 리프레시 토큰 만료 시간: 재로그인 없이 토큰 재발급 용도
const REFRESH_EXPIRE = "14d";


exports.signup = async (req, res) => {
  const { email, password } = req.body;

  // 필수 값 검증: 이메일 또는 비밀번호가 없으면 요청 거부
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  // 이메일 중복 확인 (DB 조회)
  const exists = await User.findUserByEmail(email);
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // bcrypt를 이용해 비밀번호를 단방향 해시 처리
  // salt round = 10은 보안과 성능의 균형을 고려한 일반적인 값
  const hashedPw = await bcrypt.hash(password, 10);

  // 해시된 비밀번호를 DB에 저장
  await User.createUser(email, hashedPw);

  // 회원가입 성공 응답
  res.json({ success: true });
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 이메일 기준 사용자 조회
  const user = await User.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 입력된 비밀번호와 DB에 저장된 해시 비밀번호 비교
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(403).json({ message: "Wrong password" });
  }

  // 액세스 토큰 생성
  // 클라이언트 요청 인증에 사용되며 만료 시간이 짧음
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_EXPIRE }
  );

  // 리프레시 토큰 생성
  // 액세스 토큰 재발급에 사용되며 DB에 저장됨
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRE }
  );

  // DB에 리프레시 토큰 저장 (탈취 시 무효화 가능)
  await User.updateRefreshToken(user.id, refreshToken);

  // 리프레시 토큰을 httpOnly 쿠키로 저장
  // JS 접근을 차단하여 XSS 공격 방지
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax"
  });

  // 액세스 토큰만 JSON 응답으로 전달
  res.json({ accessToken });
};


exports.refresh = async (req, res) => {
  // 쿠키에서 리프레시 토큰 추출
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    // 리프레시 토큰 유효성 검증
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    // 토큰에 담긴 사용자 ID로 DB 조회
    const user = await User.findUserById(decoded.id);

    // DB에 저장된 리프레시 토큰과 일치하지 않으면 차단
    if (!user || user.refresh_token !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // 새로운 액세스 토큰 발급
    const newAccess = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_EXPIRE }
    );

    res.json({ accessToken: newAccess });
  } catch {
    // 토큰 만료 또는 위조 시
    res.status(403).json({ message: "Refresh failed" });
  }
};


exports.logout = async (req, res) => {
  // 서버 측에서 리프레시 토큰 제거
  // (access token은 짧은 만료로 자연 소멸)
  await User.revokeToken(req.user.id);

  // 클라이언트 쿠키 삭제
  res.clearCookie("refreshToken");

  res.json({ success: true });
};
