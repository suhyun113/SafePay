const express = require('express');
const router = express.Router();
const payment = require('../controllers/paymentController');
const { verifyAccess } = require('../middleware/authMiddleware');

router.post('/create', verifyAccess, payment.createPayment);

module.exports = router;
