const db = require("../config/db");
// MySQL 커넥션 풀을 불러와 상품 데이터를 조회하기 위한 DB 연결 객체

exports.getProducts = async (req, res) => {
  try {
    // products 테이블에서 상품 목록을 조회
    // 프론트엔드에서 필요한 id, name, price 컬럼만 선택
    const [rows] = await db.execute(
      "SELECT id, name, price FROM products ORDER BY id ASC"
    );

    // 프론트엔드(ProductSelector)에서 바로 사용할 수 있도록
    // products 배열 형태로 JSON 응답 반환
    res.json({ products: rows });
  } catch (err) {
    // DB 조회 실패 시 서버 로그에 에러 출력
    console.error("Get products failed:", err);

    // 클라이언트에는 일반적인 오류 메시지만 전달
    res.status(500).json({ message: "Failed to load products" });
  }
};
