const AttackLog = require('../models/attackLogModel');

exports.csrfAttack = async (req, res) => {
    await AttackLog.writeLog("CSRF", "Cross-site request forgery attempt", false);
    res.json({ message: "CSRF attack simulated", success: false });
};

exports.replayAttack = async (req, res) => {
    await AttackLog.writeLog("Replay", "Replay attack attempt", false);
    res.json({ message: "Replay attack simulated", success: false });
};
