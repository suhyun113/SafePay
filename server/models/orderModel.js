const db = require("../config/db");

exports.createOrder = async (userId, item, amount, nonce, signature) => {
    try {
        const sql = `
            INSERT INTO orders (user_id, item, amount, nonce, signature, created)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await db.execute(sql, [userId, item, amount, nonce, signature]);
        console.log(`[Order] Created order: ID=${result.insertId}, User=${userId}, Item=${item}, Amount=${amount}`);
        return result.insertId;
    } catch (err) {
        // created 컬럼이 없으면 다시 시도
        if (err.code === 'ER_BAD_FIELD_ERROR' && err.message.includes('created')) {
            try {
                const sqlWithoutDate = `
                    INSERT INTO orders (user_id, item, amount, nonce, signature)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const [result] = await db.execute(sqlWithoutDate, [userId, item, amount, nonce, signature]);
                console.log(`[Order] Created order (without created): ID=${result.insertId}`);
                return result.insertId;
            } catch (err2) {
                console.error('[Order] Failed to create order:', err2.message);
                throw err2;
            }
        } else {
            console.error('[Order] Failed to create order:', err.message);
            throw err;
        }
    }
};
