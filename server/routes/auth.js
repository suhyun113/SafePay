const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { verifyAccess } = require('../middleware/authMiddleware');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/logout', verifyAccess, auth.logout);

module.exports = router;
