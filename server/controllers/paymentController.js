const { generateNonce, signPayload } = require('../utils/security');
const Order = require('../models/orderModel');

exports.getProducts = (req, res) => {
    res.json({
        products: [
            { id: 1, name: "Book", price: 5000 },
            { id: 2, name: "Laptop Case", price: 15000 },
            { id: 3, name: "USB Cable", price: 3000 }
        ]
    });
};

exports.checkout = async (req, res) => {
    try {
        const { item, amount } = req.body;
        const userId = req.user.id;

        const nonce = generateNonce();
        const timestamp = Date.now().toString();

        const payload = `${nonce}.${timestamp}.${amount}`;
        const signature = signPayload(payload, process.env.JWT_SECRET);

        await Order.createOrder(userId, item, amount, nonce, signature);

        res.json({
            success: true,
            rawRequest: { nonce, timestamp, item, amount },
            signedPayload: payload,
            signature
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Payment failed" });
    }
};
