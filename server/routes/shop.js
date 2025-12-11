const express = require("express");
const router = express.Router();
const shop = require("../controllers/shopController");

router.get("/products", shop.getProducts);

module.exports = router;
