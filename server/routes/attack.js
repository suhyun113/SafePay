const express = require('express');
const router = express.Router();
const attack = require('../controllers/attackController');

router.post('/csrf', attack.csrfAttack);
router.post('/replay', attack.replayAttack);

module.exports = router;
