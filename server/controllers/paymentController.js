const { generateNonce, signPayload } = require("../utils/security");
const Order = require("../models/orderModel");
const AttackLog = require("../models/attackLogModel");

const PRICE_TABLE = {
  Book: 5000,
  "Laptop Case": 15000,
  "USB Cable": 3000
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

  if (!PRICE_TABLE[item]) {
    return res.status(400).json({ message: "Invalid item" });
  }

  const realPrice = PRICE_TABLE[item];

  /* =====================
     NORMAL PAYMENT
  ===================== */
  if (!attackEnabled) {
    const n = nonce ? generateNonce() : null;
    const ts = timestamp ? Date.now().toString() : null;
    const payload = n && ts ? `${n}.${ts}.${realPrice}` : null;
    const sig = signature && payload
      ? signPayload(payload, process.env.JWT_SECRET)
      : null;

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

  /* =====================
     ATTACK SIMULATION
  ===================== */
  let blocked = false;
  let reason = "";

  if (attackType === "priceTampering" && signature) {
    blocked = true;
    reason = "Price integrity broken";
  }

  if (attackType === "signatureTampering" && signature) {
    blocked = true;
    reason = "Invalid signature";
  }

  if (attackType === "replay" && nonce && timestamp) {
    blocked = true;
    reason = "Replay attack detected";
  }

  if (attackType === "csrf") {
    blocked = true;
    reason = "CSRF blocked by Authorization";
  }

  if (blocked) {
    await AttackLog.writeLog(attackType, reason, false);
    return res.json({ success: false, attackType, reason });
  }

  const hackedAmount = attackType === "priceTampering" ? 1 : realPrice;

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
