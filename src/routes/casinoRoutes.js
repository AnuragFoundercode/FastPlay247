// routes/casinoRoutes.js
const express = require("express");
const router = express.Router();
const { 
  getCasinoTable, 
  fetchCasinoData, 
  fetchCasinoResult, 
  fetchCasinoDetailResult,
  getCasinoStream,
  renderCasinoIframe,
  updateBetResults
} = require("../controllers/casinoController");
const { getScore } = require("../controllers/apiController");

// 🔹 GET /api/casino/tableid
router.get("/tableid", getCasinoTable);

// 🔹 GET /api/casino/data?type=lucky5
router.get("/data", fetchCasinoData);

// 🔹 GET /api/casino/result?type=joker1
router.get("/result", fetchCasinoResult);

// 🔹 GET /api/casino/detail_result?type=joker1&mid=168251003114649
router.get("/detail_result", fetchCasinoDetailResult);

//stream video show///
router.get("/stream", getCasinoStream);
router.get("/render", renderCasinoIframe);
//cron for cassino result---------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/updateBetResults", updateBetResults);



// GET /api/score
router.get("/score", getScore);


module.exports = router;
