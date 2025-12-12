const express = require("express");
const router = express.Router();

// 상품 관련 비즈니스 로직을 담당하는 컨트롤러 불러오기
const shop = require("../controllers/shopController");

// GET /api/shop/products 요청이 들어오면
// shopController의 getProducts 함수를 실행
router.get("/products", shop.getProducts);

module.exports = router;
