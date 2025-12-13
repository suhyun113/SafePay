const db = require("../config/db"); // 주문 데이터를 DB에 저장하기 위한 MySQL 커넥션 풀

exports.createOrder = async (
  userId,
  item,
  amount,
  nonce,
  signature,
  useSignature,
  useNonce,
  useTimestamp,
  attackType
) => {
  // 주문 정보와 함께 보안 기능 사용 여부 및 공격 유형을 기록
  const sql = `
    INSERT INTO orders (
      user_id,
      item,
      amount,
      nonce,
      signature,
      security_signature,
      security_nonce,
      security_timestamp,
      attack_type,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const [result] = await db.execute(sql, [
    userId,
    item,
    amount,
    nonce,
    signature,
    useSignature ? 1 : 0,
    useNonce ? 1 : 0,
    useTimestamp ? 1 : 0,
    attackType
  ]);

  // 생성된 주문의 고유 ID 반환
  return result.insertId;
};
