const express = require("express");
const { getAllSports, getMatchList,getSportsStream,getTree,getMatchDetails,getPrivateData,renderDirectStreamIframe,getScore,getMatchListByGid,placeBet,
  getBetsByUser,getResult,getResultOfEvent,getLiveScoreIframe } = require("../controllers/sportController");
 const { syncSportResults } = require("../controllers/sportResultController");



const router = express.Router();

// Example: GET /sports/all
router.get("/all", getAllSports);

// Example: GET /sports/matches?sid=4
router.get("/matches", getMatchList);

router.get("/matchesByGid", getMatchListByGid);

router.get("/stream", getSportsStream);

// Example: GET /sports/tree
router.get("/tree", getTree);

// Match Details by gmid + sid
router.get("/details", getMatchDetails);

// Match Odds, Bookmaker & Fancy
router.get("/private", getPrivateData);

router.get("/direct-stream", renderDirectStreamIframe);

// --------------------------------------------------------------
// 🟣 NEW ROUTES ADDED BELOW
router.post("/place_bet", placeBet);    

// ✅ POST /api/sport/get-result
router.post("/get_result", getResult);

// ✅ Route: Get All Result of Event
router.get("/get_result_of_event", getResultOfEvent);

router.get("/live-score", getLiveScoreIframe);

router.get("/sync", syncSportResults);

// Score
//router.get("/score", getScore);

module.exports = router;
