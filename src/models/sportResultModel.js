const db = require("../config/config");


class SportBet {
  
// static async updateSportsBetResults(results) {
//   for (let r of results) {
//     const { event_id, market_id, final_result } = r;

//     if (!event_id || !market_id || !final_result) continue;

//     const finalRes = final_result.toString().trim().toLowerCase();

//     const [bets] = await db.promise().query(
//       "SELECT * FROM sport_bets WHERE  market_id = ? AND bet_status='pending'",
//       [market_id]
//     );

//     if (!bets.length) continue;

//     for (let bet of bets) {
//       const marketType = bet.market_type.toLowerCase();
//       const betChoice = (bet.bet_choice || "").toLowerCase(); 
//       const betSize = parseFloat(bet.bet_size || 0);    
//       const finalVal = parseFloat(final_result);

//       let status = "lost";
//       // =========================================
//       //        FANCY RESULT LOGIC WITH L/K
//       // =========================================
//       if (marketType === "fancy") {
//         if (betChoice === "L") {
//           // LAGAYI
//           if (finalVal > betSize) status = "won";
//         } else if (betChoice === "K") {
//           // KHAYI
//           if (finalVal < betSize) status = "won";
//         }
//       }

//       // =========================================
//       // MATCH / OTHER MARKET LOGIC
//       // =========================================
//       else {
//         const cleanChoice = betChoice.trim().toLowerCase();
//         if (cleanChoice === finalRes) status = "won";
//       }

//       // Will win amount from DB
//       const win_amount = status === "won" ? parseFloat(bet.will_win || 0) : 0;

//       // Update bet
//       await db.promise().query(
//         "UPDATE sport_bets SET bet_status=?, bet_message=?, win_amount=? WHERE id=?",
//         [status, final_result, win_amount, bet.id]
//       );

//       // If won, credit user wallet
//       if (status === "won") {
//         const [wallet] = await db
//           .promise()
//           .query("SELECT self_amount_limit FROM users WHERE id=?", [bet.user_id]);

//         if (!wallet.length) continue;

//         const op_balance = parseFloat(wallet[0].self_amount_limit);
//         const cl_balance = op_balance + win_amount;

//         await db.promise().query(
//           "UPDATE users SET self_amount_limit=? WHERE id=?",
//           [cl_balance, bet.user_id]
//         );

//         await db.promise().query(
//           `INSERT INTO tbl_user_transaction 
//           (userId, amount, description, type, op_balance, cl_balance, status, datetime)
//           VALUES(?, ?, ?, ?, ?, ?, ?, NOW())`,
//           [
//             bet.user_id,
//             win_amount,
//             `Bet won on ${bet.event_name}`,
//             "CR",
//             op_balance,
//             cl_balance,
//             "Success",
//           ]
//         );
//       }
//     }
//   }
// }


static async updateSportsBetResults(results) {
  try {
    for (let r of results) {
      const { event_id, market_id, final_result } = r;
      if (!event_id || !market_id || !final_result) continue;

      const finalRes = final_result.toString().trim().toLowerCase();
      const finalVal = parseFloat(final_result);

      // Get all pending bets
      const [bets] = await db.promise().query(
        "SELECT * FROM sport_bets WHERE market_id = ? AND bet_status='pending'",
        [market_id]
      );

      console.log("🎯 Pending bets:", bets.length);

      if (!bets.length) continue;

      for (let bet of bets) {
        console.log("➡️ Processing Bet ID:", bet.id);

        const marketType = (bet.market_type || "").toLowerCase();
        const betChoice = (bet.bet_choice || "").toLowerCase();
        const betSize = parseFloat(bet.bet_size || 0);

        let status = "lost";

        // FANCY LOGIC
        if (marketType === "fancy") {
          if (betChoice === "l" && finalVal > betSize) status = "won";
          if (betChoice === "k" && finalVal < betSize) status = "won";
        }
        // MATCH / OTHER
        else {
          if (betChoice.trim() === finalRes) status = "won";
        }

        const winAmount =
          status === "won" ? parseFloat(bet.will_win || 0) : 0;

        const clientPL =
          status === "won"
            ? winAmount
            : -parseFloat(bet.will_loss || 0);

        // Update bet status
        await db.promise().query(
          "UPDATE sport_bets SET bet_status=?, bet_message=?, win_amount=? WHERE id=?",
          [status, final_result, winAmount, bet.id]
        );

        console.log("✔ Bet updated:", bet.id, "Status:", status);

        // Credit wallet if won
        if (status === "won") {
          const [uBal] = await db.promise().query(
            "SELECT self_amount_limit FROM users WHERE id=?",
            [bet.user_id]
          );

          const op = parseFloat(uBal[0].self_amount_limit);
          const cl = op + winAmount;

          await db.promise().query(
            "UPDATE users SET self_amount_limit=? WHERE id=?",
            [cl, bet.user_id]
          );

          console.log("💰 Wallet credited to user:", bet.user_id);

          await db.promise().query(
            `INSERT INTO tbl_user_transaction
            (userId, amount, description, type, op_balance, cl_balance, status, datetime)
            VALUES (?, ?, ?, 'CR', ?, ?, 'Success', NOW())`,
            [
              bet.user_id,
              winAmount,
              `Bet won on ${bet.event_name}`,
              op,
              cl,
            ]
          );
        }

        // SETTLEMENT CHAIN
        const [uu] = await db.promise().query(
          "SELECT username FROM users WHERE id=?",
          [bet.user_id]
        );

        if (!uu.length) continue;

        let currentUsername = uu[0].username;
        let childPL = clientPL;

        while (true) {
          console.log("🔍 Getting parent of:", currentUsername);

          // FIXED: BetService → this
          const parent = await this.getParent(currentUsername);

          if (!parent || !parent.master_user) break;

          const sharePercent = parseFloat(parent.share || 0);
          const shareAmount = (childPL * sharePercent) / 100;

          let commissionPercent = 0;
          if (marketType === "match1") commissionPercent = parent.match_comission;
          if (marketType === "session") commissionPercent = parent.session_comission;
          if (marketType === "casino") commissionPercent = parent.cassino_comission;

          const commissionAmount =
            Math.abs(childPL) * (commissionPercent / 100);

          const parentFinal = -(shareAmount) + commissionAmount;

          await db.promise().query(
            `INSERT INTO settlement_ledger
            (bet_id, child_user, parent_user, child_PL, share_percent, share_amount,
             commission_percent, commission_amount, parent_final)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              bet.id,
              bet.user_id,
              parent.id,
              childPL,
              sharePercent,
              shareAmount,
              commissionPercent,
              commissionAmount,
              parentFinal,
            ]
          );

          currentUsername = parent.master_user;
        }
      }
    }

    return { success: true, message: "Bet results + settlement updated" };

  } catch (err) {
    console.log("❌ RESULT ERROR:", err);
    return { success: false, message: err.message };
  }
}


// ============ PARENT FUNCTION ============
static async getParent(username) {
  console.log("🔎 Fetching parent for:", username);

  const [p] = await db.promise().query(
    `SELECT username, id, role, self_share AS share,
     match_comission, session_comission, cassino_comission,
     master_user
     FROM users
     WHERE username = ?`,
    [username]
  );

  if (!p.length) {
    console.log("⚠️ NO PARENT FOUND for:", username);
    return null;
  }

  console.log("👆 Parent Found:", p[0]);

  return p[0];
}






}

module.exports = SportBet;
