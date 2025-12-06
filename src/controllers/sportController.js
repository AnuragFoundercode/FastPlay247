const sportModel = require("../models/sportModel"); 
const axios = require("axios");

const BASE_URL = "https://diamond-api-v2.scoreswift.xyz";
const API_KEY = "ALdmzeQOo8ddhdhP4QWn_v34";
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "fastplay247",          
  password: "fastplay247",          
  database: "fastplay247" 
});

exports.getAllSports = async (req, res) => {
  try {
    const sports = await sportModel.fetchAllSports();
    let cricketData = [];
    if (Array.isArray(sports)) {
      cricketData = sports.filter(item => item.ename === "Cricket");
    } else if (Array.isArray(sports.data)) {
      cricketData = sports.data.filter(item => item.ename === "Cricket");
    }

    res.json({
      success: true,
      data: cricketData,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

exports.getMatchList = async (req, res) => {
  try {
    const { sid } = req.query;
    if (!sid) {
      return res.status(400).json({ success: false, msg: "sid is required" });
    }

    const matches = await sportModel.fetchMatchList(sid);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

exports.getMatchListByGid = async (req, res) => {
  try {
    const { sid, gmid } = req.query;

    if (!sid) {
      return res.status(400).json({ success: false, msg: "sid is required" });
    }

    if (!gmid) {
      return res.status(400).json({ success: false, msg: "gmid is required" });
    }

    const endpoint = `${BASE_URL}/getPriveteData`;

    const response = await axios.get(endpoint, {
      params: {
        gmid,
        sid,
        key: API_KEY,
      },
    });
    data=response.data;
    if (Array.isArray(data)) {
      data = data.filter(item => item.mname === "Bookmaker");
    }
    else if (data && Array.isArray(data.data)) {
      data.data = data.data.filter(item => item.mname === "Bookmaker");
    }
    
    // console.log("responsessssssssssssssssssssssssssssssssssssssss",response);

    return res.status(200).json({
      success: true,
      msg: "Data fetched successfully",
      response: data, // this is what you asked
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong", error: error.message });
  }
};

exports.getSportsStream = async (req, res) => {
  try {
    const { gmid } = req.query;
    if (!gmid) {
      return res.status(400).send("GMID is required");
    }

    res.json({
      success: true,
      url: `https://livestream-v3-iframe.akamaized.uk/directStream?gmid=${gmid}`
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

exports.getTree = async (req, res) => {
  try {
    const data = await sportModel.fetchTree();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

exports.getMatchDetails = async (req, res) => {
  try {
    const { gmid, sid } = req.query;
    if (!gmid || !sid) {
      return res.status(400).json({ success: false, msg: "gmid and sid are required" });
    }
    const data = await sportModel.fetchMatchDetails(gmid, sid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

exports.getPrivateData = async (req, res) => {
  try {
    const { gmid, sid } = req.query;
    if (!gmid || !sid) {
      return res.status(400).json({ success: false, msg: "gmid and sid are required" });
    }
    const data = await sportModel.fetchPrivateData(gmid, sid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

exports.renderDirectStreamIframe = (req, res) => {
  const { gmid } = req.query;

  if (!gmid) {
    return res.status(400).send("❌ GMID is required");
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Direct Stream</title>
      <style>
        .embed-responsive {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          background: black;
        }
        .embed-responsive iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
      </style>
    </head>
    <body>
      <div class="embed-responsive">
        <iframe
          src="https://livestream-v3-iframe.akamaized.uk/directStream?gmid=${gmid}"
          title="Direct Stream - ${gmid}"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        ></iframe>
      </div>
    </body>
    </html>
  `;

  res.send(html);
};

exports.placeBet = async (req, res) => {
  try {
    const betData = req.body;

    if (!betData.event_id || !betData.market_id) {
      return res.status(400).json({
        success: false,
        msg: "event_id and market_id are required",
      });
    }

    const [userRows] = await db.query(
      "SELECT id, matchBet, sessionBet FROM users WHERE id = ? LIMIT 1",
      [betData.user_id]
    );

    if (userRows.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Invalid user_id",
      });
    }

    const user = userRows[0];

    if (betData.market_type === "fancy") {
      if (user.sessionBet != 1) {
        return res.status(400).json({
          success: false,
          msg: "You are not allowed to place session bets",
        });
      }
    }

    if (betData.market_type === "match1") {
      if (user.matchBet != 1) {
        return res.status(400).json({
          success: false,
          msg: "You are not allowed to place match bets",
        });
      }
    }
    
    
    const [settingsRows] = await db.query("SELECT * FROM tbl_bet_setting LIMIT 1");
    if (settingsRows.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Bet settings not found",
      });
    }

    const settings = settingsRows[0];

    let minMax;
    if (betData.market_type === "casino") {
      minMax = JSON.parse(settings.casino_min_max);
    } else if (betData.market_type === "fancy") {
      minMax = JSON.parse(settings.fancy_min_max);
    } else if (betData.market_type === "match1") {
      minMax = JSON.parse(settings.bookmaker_min_max);
    } else {
      return res.status(400).json({
        success: false,
        msg: "Invalid market_type",
      });
    }

    if (betData.bet_amount < minMax.min || betData.bet_amount > minMax.max) {
      return res.status(400).json({
        success: false,
        msg: `Bet amount must be between ${minMax.min} and ${minMax.max}`,
      });
    }
   
    
    const result = await sportModel.placeBet(betData);

    return res.status(200).json({
      success: true,
      message: result.message,
      local_insert_id: result.local_insert_id,
      api_response: result.api_response,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message || "Something went wrong while placing bet",
      error: error.response?.data || error.message,
    });
  }
};

exports.getBetsByUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id)
      return res.status(400).json({ success: false, msg: "user_id is required" });

    const bets = await sportModel.getBetsByUser(user_id);
    res.json({ success: true, data: bets });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

exports.placeBett = async (req, res) => {
  try {
    const {
      event_id,
      event_name,
      market_id,
      market_name,
      market_type
    } = req.body;

    const url = `https://diamond-api-v2.scoreswift.xyz/placed_bets?key=${API_KEY}`;

    const options = {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      data: {
        event_id,
        event_name,
        market_id,
        market_name,
        market_type
      }
    };

    const { data } = await axios.request(options);

    res.json({
      success: true,
      message: data.message || 'Bet placed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to place bet',
      error: error.response?.data || error.message
    });
  }
};

exports.getResult = async (req, res) => {
  try {
    const { event_id, event_name, market_id, market_name } = req.body;

    const result = await sportModel.getResult(event_id, event_name, market_id, market_name);
    return res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getResultOfEvent = async (req, res) => {
  try {
    const { event_id } = req.query;

    if (!event_id) {
      return res.status(400).json({
        success: false,
        message: "event_id is required"
      });
    }

    const url = `https://diamond-api-v2.scoreswift.xyz/get_placed_bets?event_id=${event_id}&key=${API_KEY}`;

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: url,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await axios.request(config);

    return res.json({
      success: true,
      data: response.data
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to fetch placed bets",
      error: error.response ? error.response.data : error.message
    });
  }
};

exports.getLiveScoreIframe = async (req, res) => {
  try {
    const { gmid } = req.query;

    if (!gmid) {
      return res.status(400).json({ success: false, msg: "gmid is required" });
    }
    const iframeUrl = `https://diamond-score.softgamingapi.com/diamond-live-score?gmid=${gmid}`;

    const iframeHtml = `
      <iframe 
        src="${iframeUrl}" 
        width="100%" 
        height="600" 
        frameborder="0" 
        allowfullscreen
        title="Live Score"
      ></iframe>
    `;

    res.send(iframeHtml);

  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};

exports.getUserPLPreview = async (req, res) => {
  try {
    const { user_id, gmId } = req.query;

    const [bets] = await db.query(
      `SELECT market_name AS selectionName, 
              bet_choice AS betType,
              bet_amount AS stake,
              bet_value AS rate
       FROM sport_bets
       WHERE user_id = ? AND gmId = ? AND market_type = 'match1'`,
      [user_id, gmId]
    );

    const apiRes = await axios.get(
      `https://root.fastplay247.net/api/sports/matchesByGid?sid=4&gmid=${gmId}`
    );

    const sections = apiRes.data?.response?.data?.[0]?.section || [];

    const teams = sections.map(s => s.nat);

    // Format openbets
    const openbets = bets.map(b => ({
      oddsType: "Bookmaker",
      selectionName: b.selectionName,
      betType: b.betType.toLowerCase() === "k" ? "back" : "lay",
      stake: Number(b.stake),
      rate: Number(b.rate)
    }));

    // Create book structure
    let book = teams.map((t, i) => ({
      selectionId: i + 1,
      selectionName: t,
      amount: 0,
      comPercentage: 0,
      comAmount: 0
    }));

    // ============================
    // PROPER BACK + LAY CALCULATION
    // ============================

    openbets.forEach(bet => {
      const { selectionName, betType, stake, rate } = bet;

      const idx = book.findIndex(b => b.selectionName === selectionName);

      const profit = (stake * rate) / 100;   // main calculation ✔

      if (betType === "back") {
        // BACK:
        // selected = +profit
        // others = -stake

        book[idx].amount -= profit;

        book.forEach((t, i) => {
          if (i !== idx) t.amount += stake;
        });

      } else if (betType === "lay") {
        // LAY:
        // selected = +profit (liability)
        // others = +stake

        book[idx].amount += profit;

        book.forEach((t, i) => {
          if (i !== idx) t.amount -= stake;
        });
      }
    });

    const books = [
      {
        oddsType: "Bookmaker",
        book
      }
    ];

    return res.json({
      openbets,
      books
    });

  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
















