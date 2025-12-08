const { generateNonce, signPayload } = require('../utils/security');
const Order = require('../models/orderModel');

exports.createPayment = async (req, res) => {
    const { item, amount } = req.body;
    const userId = req.user.id;

    const nonce = generateNonce();
    const timestamp = Date.now().toString();
    const payload = `${nonce}.${timestamp}.${amount}`;

    const signature = signPayload(payload, process.env.JWT_SECRET);

    await Order.createOrder(userId, item, amount, nonce, signature);

    res.json({
        nonce,
        timestamp,
        signature,
        safePayload: payload
    });
};
