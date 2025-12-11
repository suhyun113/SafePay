const { generateNonce, signPayload } = require("../utils/security");
const Order = require("../models/orderModel");
const AttackLog = require("../models/attackLogModel");

exports.checkout = async (req, res) => {
    try {
        const { item, amount, mode, attackType } = req.body;

        if (!item) {
            return res.status(400).json({ success: false, message: "Item is required" });
        }

        // 서버 기준 정상 가격 (DB 대신 하드코딩 – 교육 목적)
        const PRICE_TABLE = {
            "Book": 5000,
            "Laptop Case": 15000,
            "USB Cable": 3000
        };

        const realPrice = PRICE_TABLE[item];
        if (!realPrice) {
            return res.status(400).json({ success: false, message: "Invalid item" });
        }

        // SafeFlow: 보안 요청 생성
        if (mode === "safe") {
            try {
                const nonce = generateNonce();
                const timestamp = Date.now().toString();
                const payload = `${nonce}.${timestamp}.${realPrice}`;
                const signature = signPayload(payload, process.env.JWT_SECRET);

                console.log(`[Payment] Safe payment request: User=${req.user.id}, Item=${item}, Amount=${realPrice}`);

                // 서버가 검증 후 저장
                const orderId = await Order.createOrder(req.user.id, item, realPrice, nonce, signature);

                console.log(`[Payment] Order created successfully: ID=${orderId}`);

                return res.json({
                    success: true,
                    flow: "safe",
                    orderId: orderId,
                    rawRequest: { nonce, timestamp, item, amount: realPrice },
                    payload,
                    signature,
                    serverCheck: "Valid request. Order stored successfully."
                });
            } catch (orderErr) {
                console.error('[Payment] Failed to create order:', orderErr);
                return res.status(500).json({
                    success: false,
                    message: "주문 저장에 실패했습니다.",
                    error: orderErr.message
                });
            }
        }

        // AttackFlow: 공격 유형 처리 =======================
        if (!attackType) {
            return res.status(400).json({ 
                success: false, 
                message: "attackType is required for attack mode" 
            });
        }

        let nonce = generateNonce();
        let timestamp = Date.now().toString();
        let tamperedAmount = realPrice;
        let signature = "";

        let attackResult = "";

        switch (attackType) {
            case "csrf":
                attackResult = "Missing Authorization header (CSRF-like attack)";
                try {
                    await AttackLog.writeLog("CSRF", attackResult, false);
                } catch (logErr) {
                    console.error('Failed to log CSRF attack:', logErr);
                }
                return res.status(403).json({
                    success: false,
                    flow: "attack",
                    attackType,
                    reason: attackResult
                });

            case "replay":
                nonce = "REPLAY_NONCE"; // 서버에 이미 저장된 것으로 가정
                attackResult = "Nonce reused → Replay attack detected";
                try {
                    await AttackLog.writeLog("Replay", attackResult, false);
                } catch (logErr) {
                    console.error('Failed to log Replay attack:', logErr);
                }
                return res.status(400).json({
                    success: false,
                    flow: "attack",
                    attackType,
                    rawRequest: { nonce, timestamp, item, amount: realPrice },
                    reason: attackResult
                });

            case "priceTampering":
                tamperedAmount = 1; // 가격 변조 시나리오
                attackResult = "Client modified price → Price integrity check failed";
                try {
                    await AttackLog.writeLog("Price Tampering", attackResult, false);
                } catch (logErr) {
                    console.error('Failed to log Price Tampering attack:', logErr);
                }
                return res.status(400).json({
                    success: false,
                    flow: "attack",
                    attackType,
                    rawRequest: { nonce, timestamp, item, amount: tamperedAmount },
                    reason: attackResult
                });

            case "signatureTampering":
                signature = "FAKE_SIGNATURE";
                attackResult = "Invalid HMAC signature → Payload integrity broken";
                try {
                    await AttackLog.writeLog("Signature Tampering", attackResult, false);
                } catch (logErr) {
                    console.error('Failed to log Signature Tampering attack:', logErr);
                }
                return res.status(400).json({
                    success: false,
                    flow: "attack",
                    attackType,
                    rawRequest: { nonce, timestamp, item, amount: realPrice },
                    signature,
                    reason: attackResult
                });

            default:
                return res.status(400).json({ success: false, message: "Unknown attack type" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Payment processing failed" });
    }
};
