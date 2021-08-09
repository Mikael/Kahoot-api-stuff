const express = require("express");
const { sendattack, stopattack } = require("../controllers/kahoot-attack-controller");
const router = express.Router();

router.post("/kahoot/send", sendattack);
router.post("/kahoot/stop", stopattack);

module.exports = router;
