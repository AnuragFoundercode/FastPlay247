const axios = require("axios");
const https = require("https");
// const db = require("../config/config");


const mysql = require("mysql2/promise");

const BASE_URL = "https://diamond-api-v2.scoreswift.xyz";
// const BASE_URL = "http://164.52.216.63:3009";
const API_KEY = "ALdmzeQOo8ddhdhP4QWn_v34"; 


const db = mysql.createPool({
  host: "localhost",
  user: "fastplay247",          
  password: "fastplay247",          
  database: "fastplay247" 
});


exports.fetchAllSports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/allSportid?key=${API_KEY}`);
    return response.data; 
    
  } catch (error) {
      
    if (error.response) {
    }
    
    throw error;
  }
};

exports.fetchMatchList = async (sid) => {
  try {
    const response = await axios.get(`${BASE_URL}/esid`, {
      params: { 
        sid: sid, 
        key: API_KEY 
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ fetchMatchList Model Error:", error.message);
    throw error;
  }
};

exports.fetchTree = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tree`, {
      params: { key: API_KEY },
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};

exports.fetchMatchDetails = async (gmid, sid) => {
  try {
    const response = await axios.get(`${BASE_URL}/getDetailsData`, {
      params: { gmid, sid, key: API_KEY },
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};

exports.fetchPrivateData = async (gmid, sid) => {
  try {
    const endpoint = `${BASE_URL}/getPriveteData`; 

    const response = await axios.get(endpoint, {
      params: { gmid, sid, key: API_KEY },
    });

    let data = response.data;

    if (Array.isArray(data)) {
      data = data.filter(item => item.mname === "Normal");
    }
    else if (data && Array.isArray(data.data)) {
      data.data = data.data.filter(item => item.mname === "Normal");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

exports.placeBet = async (betData) => {
  try {
    console.log("📡 Sending bet data to third-party API:", betData);

    const {
      event_id,
      event_name,
      market_id,
      market_name,
      market_type,
      bet_choice,
      bet_value,
      gmId,
      user_id,
      bet_amount
    } = betData;

    // 1️⃣ Get user's wallet
    const [walletRows] = await db.query(
      "SELECT self_amount_limit	 FROM users WHERE id = ?",
      [user_id]
    );

    if (!walletRows.length) {
      throw new Error("User not found");
    }

    const op_balance = parseFloat(walletRows[0].self_amount_limit || 0);
    const betAmount = parseFloat(bet_amount || 0);

    if (op_balance < betAmount) {
      throw new Error("Insufficient wallet balance");
    }

    const cl_balance = op_balance - betAmount;

    // 2️⃣ Call third-party API
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

    if (!data || data.status === false) {
      throw new Error(data?.message || "Bet placement failed in third-party API");
    }

    // 3️⃣ Deduct wallet balance
    await db.query(
      "UPDATE users SET self_amount_limit = ? WHERE id = ?",
      [cl_balance, user_id]
    );

    // 4️⃣ Insert bet details
    const [result] = await db.query(
      `INSERT INTO sport_bets 
        (user_id, event_id, event_name, market_id, market_name, market_type, bet_amount, bet_message, status, bet_choice, bet_value, gmId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        event_id,
        event_name || '',
        market_id,
        market_name || '',
        market_type || '',
        betAmount,
        data.message || "Bet placed successfully",
        'pending',
        bet_choice,
        bet_value,
        gmId
      ]
    );

    // 5️⃣ Insert transaction with balances
    await db.query(
      `INSERT INTO tbl_user_transaction 
        (userId, amount, description, type, op_balance, cl_balance, status, datetime) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        betAmount,
        `Bet placed on ${event_name || 'Unknown Event'}`,
        "DR",
        op_balance,
        cl_balance,
        "Success"
      ]
    );

    // 6️⃣ Final response
    return {
      status: true,
      message: data.message || "Bet placed successfully",
      local_insert_id: result.insertId,
      api_response: data
    };

  } catch (error) {
    console.error("❌ placeBet Model Error:", error.message);

    if (error.response) {
      console.error("❌ API Error Status:", error.response.status);
      console.error("❌ API Error Data:", error.response.data);

      throw new Error(error.response.data?.message || error.response.data?.msg || "Third-party API error");
    } else if (error.request) {
      throw new Error("No response from betting API");
    } else {
      throw new Error(error.message);
    }
  }
};

// --------------------------------------------------------------

exports.getBetsByUser = async (user_id) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM sport_bets WHERE user_id = ? ORDER BY id DESC`,
      [user_id]
    );
    return rows;
  } catch (error) {
    console.error("❌ getBetsByUser Model Error:", error.message);
    throw error;
  }
};



exports.getResult = async (event_id, event_name, market_id, market_name) => {
  try {
    const apiKey = "ALdmzeQOo8ddhdhP4QWn_v34"; 
    const apiUrl = `https://diamond-api-v2.scoreswift.xyz/get-result?key=${apiKey}`;

    const response = await axios.post(
      apiUrl,
      {
        event_id,
        event_name,
        market_id,
        market_name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: 15000,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: `API error: ${error.response.status}`,
        data: error.response.data,
      };
    } else if (error.request) {
      return { success: false, message: "No response from API server" };
    } else {
      return { success: false, message: error.message };
    }
  }
};