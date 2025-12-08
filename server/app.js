const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 보안 미들웨어
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// DDOS / Brute-force 제한
app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 100,
}));

app.get('/', (req, res) => {
    res.send('SafePay Server Running');
});

app.listen(4000, () => console.log("Server on 4000"));

