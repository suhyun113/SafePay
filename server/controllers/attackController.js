const AttackLog = require('../models/attackLogModel');

exports.csrfAttack = async (req, res) => {
    await AttackLog.writeLog("CSRF", "Simulated CSRF attack", false);
    res.json({ message: "CSRF attack simulated" });
};

exports.replayAttack = async (req, res) => {
    await AttackLog.writeLog("Replay", "Simulated Replay Attack", false);
    res.json({ message: "Replay attack simulated" });
};
