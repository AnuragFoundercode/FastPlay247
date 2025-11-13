const db = require("../config/db");

class Bet {
  // ✅ Place Bet
//   static async placeBet({ user_id, game_type, match_id, bet_choice, amount,bet_value }) {
//     // User ka wallet check karo
//     const [userData] = await db.query("SELECT self_amount_limit as wallet FROM users WHERE id = ?", [user_id]);
//     if (!userData.length) throw new Error("User not found");

//     const wallet = parseFloat(userData[0].wallet);

//     // Agar wallet balance kam hai
//     if (wallet < amount) {
//       throw new Error("Insufficient balance");
//     }

//     // Wallet se amount deduct karo
//     const newWallet = wallet - amount;
//     await db.query("UPDATE users SET self_amount_limit = ? WHERE id = ?", [newWallet, user_id]);

//     // Bet insert karo
//     const [result] = await db.query(
//       `INSERT INTO bets (user_id, game_type, match_id, bet_choice, amount,bet_value, status) 
//       VALUES (?, ?, ?, ?, ?,?, 'pending')`,
//       [user_id, game_type, match_id, bet_choice, amount,bet_value]
//     );

//     return result.insertId;
//   }

static async placeBet({ user_id, game_type, match_id, bet_choice, bet_value, amount, bet_type }) {
  // 1️⃣ Check user and wallet balance
  const [userData] = await db.query(
    "SELECT self_amount_limit AS wallet FROM users WHERE id = ?",
    [user_id]
  );

  if (!userData.length) throw new Error("User not found");

  const wallet = parseFloat(userData[0].wallet || 0);

  // 2️⃣ Check sufficient balance
  if (wallet < amount) throw new Error("Insufficient balance");

  // 3️⃣ Deduct amount from wallet
  const newWallet = wallet - amount;
  await db.query(
    "UPDATE users SET self_amount_limit = ? WHERE id = ?",
    [newWallet, user_id]
  );

  // 4️⃣ Insert bet into `bets` table
  const now = new Date();
  const [insertBet] = await db.query(
    `INSERT INTO bets 
      (user_id, game_type, match_id, bet_choice, amount, status, bet_value, result, win_amount, type, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,           // value-1
      game_type,         // value-2
      match_id,          // value-3
      bet_choice,        // value-4
      amount,            // value-5
      'pending',         // value-6 (status)
      bet_value,         // value-7
      null,              // value-8 (result)
      0,                 // value-9 (win_amount)
      bet_type,          // value-10 (type)
      now,               // value-11 (created_at)
      now                // value-12 (updated_at)
    ]
  );

  // 5️⃣ Add user transaction
  const op_balance = wallet;
  const cl_balance = newWallet;
  const description = `Bet placed on ${game_type} (Match ID: ${match_id})`;
  const txnType = "DR"; // Debit
  const status = "success";
  const reason = 0;

  await db.query(
    `INSERT INTO tbl_user_transaction 
      (userId, amount, description, type, op_balance, cl_balance, status, reason, datetime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, amount, description, txnType, op_balance, cl_balance, status, reason, now]
  );

  // 6️⃣ Return inserted bet ID
  return insertBet.insertId;
}


 

static async updateBetsResult(matchResults) {
  for (let r of matchResults) {
    const { mid, win } = r;

    // ✅ Fetch all pending bets for this match
    const [bets] = await db.query(
      "SELECT * FROM bets WHERE match_id = ? AND status = 'pending'",
      [mid]
    );

    for (let bet of bets) {
      const status = bet.bet_choice === win ? "won" : "lost";

      // ✅ Now use bet_value from DB dynamically instead of fixed 2x
      const win_amount = status === "won" ? bet.amount * bet.bet_value : 0;

      // ✅ Update the bet record with result and win_amount
      await db.query(
        "UPDATE bets SET status = ?, result = ?, win_amount = ? WHERE id = ?",
        [status, win, win_amount, bet.id]
      );

      // ✅ If user won, update wallet balance
      if (status === "won") {
        await db.query(
          "UPDATE users SET wallet = wallet + ? WHERE id = ?",
          [win_amount, bet.user_id]
        );
      }
    }
  }
}


  // ✅ Fetch User Bet History
//   static async getUserBets(user_id) {
//     const [rows] = await db.query(
//       "SELECT * FROM bets WHERE user_id = ? ORDER BY created_at DESC",
//       [user_id]
//     );
//     return rows;
//   }

static async getUserBets(user_id) {
  // Get normal bets
  const [bets] = await db.query(
    "SELECT id, user_id, game_type, match_id, bet_choice, amount, status, bet_value, result, win_amount, type, created_at, updated_at FROM bets WHERE user_id = ?",
    [user_id]
  );

  // Get sports bets
  const [sportsBets] = await db.query(
    "SELECT id, user_id, event_id, event_name, market_id, market_name, market_type, bet_amount, win_amount, bet_status, bet_message, status, created_at, bet_value, bet_choice, gmId FROM sport_bets WHERE user_id = ?",
    [user_id]
  );

  // Map sports bets into the same structure as normal bets
  const mappedSports = sportsBets.map((b) => ({
    id: b.id,
    user_id: b.user_id,
    game_type: b.event_name || 'Sports',  // since normal bets have 'game_type'
    match_id: b.market_id || b.gmId,
    bet_choice: b.bet_choice,
    amount: b.bet_amount,
    status: b.bet_status,                 // map bet_status to status
    bet_value: b.bet_value,
    result: b.bet_message || '',
    win_amount: b.win_amount,
    type: b.market_type || 'sports',
    created_at: b.created_at,
    updated_at: b.created_at
  }));

  // Merge both and sort by date desc
  const allBets = [...bets, ...mappedSports].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return allBets;
}

}

module.exports = Bet;
