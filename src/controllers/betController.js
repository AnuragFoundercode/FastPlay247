const axios = require("axios");
const Bet = require("../models/Bet");

// ✅ Place Bet API
// exports.placeBet = async (req, res) => {
//   try {
//     const { user_id, game_type, match_id, bet_choice,bet_value, amount,type } = req.body;

//     if (!user_id) return res.status(400).json({ success: false, message: "User ID is required" });
//     if (!game_type) return res.status(400).json({ success: false, message: "Game type is required" });
//     if (!match_id) return res.status(400).json({ success: false, message: "Match ID is required" });
//     if (!bet_choice) return res.status(400).json({ success: false, message: "Bet choice is required" });
//     if (!bet_value) return res.status(400).json({ success: false, message: "Bet Value is required" });
//     if (!amount) return res.status(400).json({ success: false, message: "Amount is required" });
//     if (!type) return res.status(400).json({ success: false, message: "type is required" });

//     const betId = await Bet.placeBet({ user_id, game_type, match_id, bet_choice,bet_value, amount,type });

//     return res.json({
//       success: true,
//       message: "Bet Placed Successfully",
//       bet_id: betId,
//     });
//   } catch (err) {
//     // console.error("❌ placeBet Error:", err.message);
//     if (err.message === "Insufficient balance") {
//       return res.status(400).json({ success: false, message: "Insufficient balance" });
//     } else if (err.message === "User not found") {
//       return res.status(400).json({ success: false, message: "User not found" });
//     }
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

exports.placeBet = async (req, res) => {
  try {
    const { user_id, game_type, match_id, bet_choice, bet_value, amount, type } = req.body;

    if (!user_id) return res.status(400).json({ success: false, message: "User ID is required" });
    if (!game_type) return res.status(400).json({ success: false, message: "Game type is required" });
    if (!match_id) return res.status(400).json({ success: false, message: "Match ID is required" });
    if (!bet_choice) return res.status(400).json({ success: false, message: "Bet choice is required" });
    if (!bet_value) return res.status(400).json({ success: false, message: "Bet value is required" });
    if (!amount) return res.status(400).json({ success: false, message: "Amount is required" });
    if (!type) return res.status(400).json({ success: false, message: "Type is required" });

    const betId = await Bet.placeBet({
      user_id,
      game_type,
      match_id,
      bet_choice,
      bet_value,
      amount,
      bet_type: type
    });

    return res.status(200).json({
      success: true,
      message: "Bet placed successfully",
      bet_id: betId,
    });

  } catch (err) {
    console.error("❌ placeBet Error:", err.message);

    if (err.message === "Insufficient balance") {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    } else if (err.message === "User not found") {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(500).json({ success: false, message: err });
  }
};


// ✅ Fetch Bet History
exports.getBetHistory = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id)
      return res.status(400).json({ success: false, message: "User ID required" });

    const history = await Bet.getUserBets(user_id);
    return res.json({ success: true, data: history });
  } catch (err) {
    // console.error("❌ getBetHistory Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Sync Third Party Results
exports.syncResults = async (req, res) => {
  try {
    const { type } = req.query;
    const apiUrl = `https://root.fastplay247.net/api/casino/result?type=${type}`;

    const response = await axios.get(apiUrl);
    const results = response.data.data.res;
    console.log("response",results);

    if (!results || results.length === 0)
      return res.status(400).json({ success: false, message: "No results found" });

    await Bet.updateBetsResult(results);

    return res.json({ success: true, message: "Results Synced & Bets Updated" });
  } catch (err) {
    // console.error("❌ syncResults Error:", err);
    res.status(500).json({ success: false, message: err });
  }
};
