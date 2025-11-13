const db = require("../config/db");
const axios = require("axios");


// controllers/casinoController.js
const { fetchCasinoTable, getCasinoData, getCasinoResult, getCasinoDetailResult,getCasinoIframeUrl } = require("../models/casinoModel");


const getCasinoTable = async (req, res) => {
  try {
    const data = await fetchCasinoTable();
    const allowedGmids = [
      "teen20",
      "dt20",
      "lucky7eu",
      "teen",
      "worli",
      "aaa",
      "dt202",
      "card32"
    ];

    const games = (data?.data?.t1 || []).filter(item =>
      allowedGmids.includes(item.gmid)
    );

    res.json({ success: true, games });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong (table)" });
  }
};

const fetchCasinoData = async (req, res) => {
  const type = req.query.type ; 
  try {
    const data = await getCasinoData(type);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong (data)" });
  }
};

const fetchCasinoResult = async (req, res) => {
  const type = req.query.type ;
  try {
    const data = await getCasinoResult(type);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong (result)" });
  }
};

const fetchCasinoDetailResult = async (req, res) => {
  const type = req.query.type || 'joker1';
  const mid = req.query.mid;

  if (!mid) {
    return res.status(400).json({ success: false, msg: "mid is required" });
  }

  try {
    const data = await getCasinoDetailResult(type, mid);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong (detail_result)" });
  }
};

const getCasinoStream = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send("Casino ID is required");
    }

    const iframeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Casino Stream</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            background: black;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="https://live.cricketid.xyz/casino-tv?id=${id}" allowfullscreen></iframe>
      </body>
      </html>
    `;

    res.send(iframeHtml);  // 👈 Directly HTML render karega
  } catch (error) {
   // console.error("❌ Controller Error:", error.message);
    res.status(500).send("Something went wrong");
  }
};

const renderCasinoIframe = (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("❌ Casino ID is required");
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Casino Stream</title>
      <style>
        .embed-responsive {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
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
          src="https://live.cricketid.xyz/casino-tv?id=${id}"
          title="Casino TV - ${id}"
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

const updateBetResults = async (req, res) => {
  try {
    const [bets] = await db.query("SELECT * FROM bets WHERE status = 'pending'");

    if (!bets.length) {
      return res.json({ success: true, msg: "No pending bets found", status: 200 });
    }

    for (const bet of bets) {
      const { id, game_type, match_id, bet_choice, amount, bet_value } = bet;

      try {
        // 2️⃣ Call external API
        const response = await axios.get("https://diamond-api-v2.scoreswift.xyz/casino/detail_result", {
          headers: { key: "ALdmzeQOo8ddhdhP4QWn_v34", Accept: "*/*" }, 
          params: {key: "ALdmzeQOo8ddhdhP4QWn_v34",type: game_type, mid: match_id }
        });
        
        console.log("response111",response);

        const data = response.data?.data?.t1;
        if (!data) continue;

        const apiWin = data.win;       
        const resultName = data.winnat; 

        let status = "lost";
        let winAmount = 0;

        if (String(apiWin) === String(bet_choice)) {
          status = "won";
          winAmount = parseFloat(amount) * parseFloat(bet_value);
        }

        await db.query(
          `UPDATE bets 
           SET status = ?, win_amount = ?, result = ?, updated_at = NOW() 
           WHERE id = ?`,
          [status, winAmount, resultName, id]
        );

        if (status === "won" && winAmount > 0) {
          const [userRow] = await db.query("SELECT self_amount_limit AS wallet FROM users WHERE id = ?", [bet.user_id]);
          if (userRow.length) {
            const wallet = parseFloat(userRow[0].wallet || 0);
            const newWallet = wallet + winAmount;

            await db.query("UPDATE users SET self_amount_limit = ? WHERE id = ?", [newWallet, bet.user_id]);

            const description = `Winnings from ${game_type} (Match ID: ${match_id})`;
            await db.query(
              `INSERT INTO tbl_user_transaction 
                (userId, amount, description, type, op_balance, cl_balance, status, reason, datetime)
               VALUES (?, ?, ?, 'CR', ?, ?, 'success', 0, NOW())`,
              [bet.user_id, winAmount, description, wallet, newWallet]
            );
          }
        }

      } catch (apiErr) {
        console.error(`API error for match ${match_id}:`, apiErr);
        continue;
      }
    }

    res.json({ success: true, msg: "Bets updated successfully", status: 200 });
  } catch (err) {
    console.error("❌ updateBetResults Error:", err.message);
    res.status(500).json({ success: false, msg: "Server Error", status: 500 });
  }
};

// ✅ Export all
module.exports = {
  getCasinoTable,
  fetchCasinoData,
  fetchCasinoResult,
  fetchCasinoDetailResult,
  getCasinoStream,
  renderCasinoIframe,
  updateBetResults
};
