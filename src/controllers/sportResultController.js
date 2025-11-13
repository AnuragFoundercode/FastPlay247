const axios = require("axios");
const SportBet = require("../models/sportResultModel");

exports.syncSportResults = async (req, res) => {
  try {
    const { event_id } = req.query;
    const eventId = event_id || 4; 
    const apiUrl = `https://root.fastplay247.net/api/sports/get_result_of_event?event_id=${eventId}`;
    
    const response = await axios.get(apiUrl, { timeout: 15000 });
    const results = response.data?.data;
    
    if (!results || results.length === 0)
      return res.status(400).json({ success: false, message: "No results found from sports API" });

    await SportBet.updateSportsBetResults(results);

    return res.json({ success: true, message: "Sports Results Synced & Bets Updated Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
