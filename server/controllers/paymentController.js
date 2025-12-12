const { generateNonce, signPayload } = require("../utils/security"); // nonce 생성 및 서명 생성을 담당하는 보안 유틸 함수
const Order = require("../models/orderModel"); // 주문 정보를 DB에 저장하는 모델
const AttackLog = require("../models/attackLogModel"); // 공격 시도 및 결과를 기록하기 위한 로그 모델

// 서버 기준 상품 가격 테이블 (클라이언트 값 신뢰하지 않음)
const PRICE_TABLE = {
  "Laptop Case": 15000,
  "USB-C Charger": 25000,
  "Wireless Mouse": 18000,
};

exports.checkout = async (req, res) => {
  const {
    item,
    signature = true,
    nonce = true,
    timestamp = true,
    attackEnabled,
    attackType
  } = req.body;

  // 서버에 정의되지 않은 상품 요청은 즉시 차단
  if (!PRICE_TABLE[item]) {
    return res.status(400).json({ message: "Invalid item" });
  }

  // 실제 결제 금액은 서버 가격 기준으로 결정
  const realPrice = PRICE_TABLE[item];

  // ================= 정상 결제 흐름 =================
  if (!attackEnabled) {
    // nonce는 재사용 공격(replay)을 방지하기 위한 난수
    const n = nonce ? generateNonce() : null;

    // timestamp는 요청 시점 고정을 통해 위조 방지
    const ts = timestamp ? Date.now().toString() : null;

    // 서명 대상 payload는 nonce + timestamp + price 조합
    const payload = n && ts ? `${n}.${ts}.${realPrice}` : null;

    // 서버 비밀키로 payload에 서명하여 무결성 보장
    const sig = signature && payload
      ? signPayload(payload, process.env.JWT_SECRET)
      : null;

    // 정상 주문 데이터 DB 저장
    const orderId = await Order.createOrder(
      req.user.id,
      item,
      realPrice,
      n,
      sig,
      signature,
      nonce,
      timestamp,
      null
    );

    return res.json({ success: true, orderId });
  }

  // ================= 공격 시뮬레이션 흐름 =================
  let blocked = false;
  let reason = "";

  // 가격 변조 공격: 서명이 활성화된 경우 무결성 검증으로 차단
  if (attackType === "priceTampering" && signature) {
    blocked = true;
    reason = "Price integrity broken";
  }

  // 서명 위조 공격: 서명 검증 실패로 차단
  if (attackType === "signatureTampering" && signature) {
    blocked = true;
    reason = "Invalid signature";
  }

  // 재전송 공격: nonce + timestamp 조합으로 차단
  if (attackType === "replay" && nonce && timestamp) {
    blocked = true;
    reason = "Replay attack detected";
  }

  // CSRF 공격: Authorization 기반 인증 구조로 차단
  if (attackType === "csrf") {
    blocked = true;
    reason = "CSRF blocked by Authorization";
  }

  // 공격 차단 시 로그 기록 후 종료
  if (blocked) {
    await AttackLog.writeLog(attackType, reason, false);
    return res.json({ success: false, attackType, reason });
  }

  // 가격 변조 공격 성공 시 금액을 1원으로 조작
  const hackedAmount = attackType === "priceTampering" ? 1 : realPrice;

  // 공격 성공 주문을 의도적으로 DB에 저장
  await Order.createOrder(
    req.user.id,
    item,
    hackedAmount,
    "ATTACK_NONCE",
    "FAKE_SIG",
    signature,
    nonce,
    timestamp,
    attackType
  );

  // 공격 성공 로그 기록
  await AttackLog.writeLog(
    attackType,
    `Attack success. amount=${hackedAmount}`,
    true
  );

  return res.json({
    success: true,
    attackType,
    storedAmount: hackedAmount
  });
};
