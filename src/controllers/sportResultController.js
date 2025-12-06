const axios = require("axios");
const SportBet = require("../models/sportResultModel");
const db = require("../config/db");


// exports.syncSportResults = async (req, res) => {
//   try {
//     const { event_id } = req.query;
//     const eventId = event_id || 4; 
//     const apiUrl = `https://root.fastplay247.net/api/sports/get_result_of_event?event_id=${eventId}`;
    
//     const response = await axios.get(apiUrl, { timeout: 15000 });
//     const results = response.data?.data;
    
//     if (!results || results.length === 0)
//       return res.status(400).json({ success: false, message: "No results found from sports API" });

//     await SportBet.updateSportsBetResults(results);
// console.log("response",results);
//     return res.json({ success: true, message: "Sports Results Synced & Bets Updated Successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server Error", error: err });
//   }
// };

exports.syncSportResults = async (req, res) => {
  try {
    const [events] = await db.execute(
      "SELECT gmId, market_id FROM sport_bets WHERE bet_status='pending'"
    );

    if (!events.length) {
      return res.json({
        success: false,
        message: "No gmId/marketId found"
      });
    }

    let summary = [];

    for (const row of events) {
      const gmId = row.gmId;
      const marketId = row.market_id;

      // Pass both gmId + marketId to API
      const apiUrl = `https://root.fastplay247.net/api/sports/get_result_of_event?event_id=${gmId}`;

      try {
        const response = await axios.get(apiUrl, { timeout: 15000 });
        const results = response.data?.data;

        if (!results || results.length === 0) {
          summary.push({
            gmId,
            marketId,
            status: "No Result Found"
          });
          continue;
        }
        
       // console.log("results",results);

        await SportBet.updateSportsBetResults(results);

        summary.push({
          gmId,
          marketId,
          status: "Success",
          count: results.length
        });

      } catch (error) {
  summary.push({
    gmId,
    marketId,
    status: "API Error",
    error: error.response?.data || error.message
  });
}
    }

    return res.json({
      success: true,
      message: "All gmId + marketId Results Synced",
      summary
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err
    });
  }
};
