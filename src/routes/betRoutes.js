const express = require("express");
const router = express.Router();
const betController = require("../controllers/betController");

// Bet place
router.post("/place-bet", betController.placeBet);

// Bet history
router.get("/bet-history", betController.getBetHistory);

// Sync results from 3rd party API
router.get("/sync-results", betController.syncResults);

module.exports = router;
