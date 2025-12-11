const express = require("express");
const router = express.Router();
const pay = require("../controllers/paymentController");
const { verifyAccess } = require("../middleware/authMiddleware");

router.post("/checkout", verifyAccess, pay.checkout);

module.exports = router;
