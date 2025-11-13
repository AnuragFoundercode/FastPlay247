const express = require("express");
const router = express.Router();
const { syncSportResults } = require("../controllers/sportResultController");

// ✅ Hit this to fetch & update sports results
// Example: GET /api/sport-results/sync?event_id=4
router.get("/sync", syncSportResults);

module.exports = router;
