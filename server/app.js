require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const logger = require('./middleware/logger');
const { limit } = require('./middleware/rateLimit');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const attackRoutes = require('./routes/attack');
const shopRoutes = require("./routes/shop");
const securityRoutes = require('./routes/security');

const app = express();

// 보안 미들웨어
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(limit);

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/attack', attackRoutes);
app.use("/api/shop", shopRoutes);
app.use('/api/security', securityRoutes);

app.get('/', (req, res) => {
    res.send('SafePay Server Running');
});

app.listen(4000, () => console.log("Server on 4000"));

