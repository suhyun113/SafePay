const db = require("../config/db");

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
      created
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

  return result.insertId;
};
