const { generateNonce, signPayload } = require("../utils/security");
const Order = require("../models/orderModel");

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
            const nonce = generateNonce();
            const timestamp = Date.now().toString();
            const payload = `${nonce}.${timestamp}.${realPrice}`;
            const signature = signPayload(payload, process.env.JWT_SECRET);

            // 서버가 검증 후 저장
            await Order.createOrder(req.user.id, item, realPrice, nonce, signature);

            return res.json({
                success: true,
                flow: "safe",
                rawRequest: { nonce, timestamp, item, amount: realPrice },
                payload,
                signature,
                serverCheck: "Valid request. Order stored successfully."
            });
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
                return res.status(403).json({
                    success: false,
                    flow: "attack",
                    attackType,
                    reason: attackResult
                });

            case "replay":
                nonce = "REPLAY_NONCE"; // 서버에 이미 저장된 것으로 가정
                attackResult = "Nonce reused → Replay attack detected";
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
