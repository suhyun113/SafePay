exports.createOrder = async (userId, item, amount, nonce, signature) => {
    const sql = `
        INSERT INTO orders (user_id, item, amount, nonce, signature)
        VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [userId, item, amount, nonce, signature]);
};
