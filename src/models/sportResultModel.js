const db = require("../config/config");

class SportBet {
  
//   static async updateSportsBetResults(results) {
//     for (let r of results) {
//       const { event_id, market_id, final_result } = r;

//       if (!event_id || !market_id || !final_result) {
//         continue; 
//       }

//       const [bets] = await db
//         .promise()
//         .query(
//           "SELECT * FROM sport_bets WHERE event_id = ? AND market_id = ? AND bet_status = 'pending'",
//           [event_id, market_id]
//         );

//       if (!bets || bets.length === 0) {
//         continue;
//       }

//       for (let bet of bets) {
//         const betChoice = (bet.bet_choice || "").toString().trim().toLowerCase();
//         const resultValue = (final_result || "").toString().trim().toLowerCase();

//         const status = betChoice === resultValue ? "won" : "lost";
//         const win_amount = status === "won" ? bet.bet_amount * (bet.bet_value || 1) : 0;
//         await db
//           .promise()
//           .query(
//             "UPDATE sport_bets SET bet_status = ?, bet_message = ?, win_amount = ? WHERE id = ?",
//             [status, final_result.trim(), win_amount, bet.id]
//           );

//         if (status === "won") {
//           await db
//             .promise()
//             .query("UPDATE users SET wallet = wallet + ? WHERE id = ?", [
//               win_amount,
//               bet.user_id,
//             ]);
//         }

//       }
//     }
//   }

static async updateSportsBetResults(results) {
  for (let r of results) {
    const { event_id, market_id, final_result } = r;

    if (!event_id || !market_id || !final_result) {
      continue;
    }

    const [bets] = await db
      .promise()
      .query(
        "SELECT * FROM sport_bets WHERE event_id = ? AND market_id = ? AND bet_status = 'pending'",
        [event_id, market_id]
      );

    if (!bets || bets.length === 0) {
      continue;
    }

    for (let bet of bets) {
      const betChoice = (bet.bet_choice || "").toString().trim().toLowerCase();
      const resultValue = (final_result || "").toString().trim().toLowerCase();

      const status = betChoice === resultValue ? "won" : "lost";
      const win_amount = status === "won" ? bet.bet_amount * (bet.bet_value || 1) : 0;

      // 1️⃣ Update bet status and message
      await db
        .promise()
        .query(
          "UPDATE sport_bets SET bet_status = ?, bet_message = ?, win_amount = ? WHERE id = ?",
          [status, final_result.trim(), win_amount, bet.id]
        );

      // 2️⃣ If user won, credit wallet and insert transaction
      if (status === "won") {
        // Fetch current wallet balance
        const [walletRows] = await db
          .promise()
          .query("SELECT self_amount_limit FROM users WHERE id = ?", [bet.user_id]);

        if (!walletRows.length) continue;

        const op_balance = parseFloat(walletRows[0].self_amount_limit || 0);
        const cl_balance = op_balance + parseFloat(win_amount);

        // Update wallet
        await db
          .promise()
          .query("UPDATE users SET self_amount_limit = ? WHERE id = ?", [
            cl_balance,
            bet.user_id,
          ]);

        // Insert into transaction history
        await db
          .promise()
          .query(
            `INSERT INTO tbl_user_transaction 
              (userId, amount, description, type, op_balance, cl_balance, status, datetime) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              bet.user_id,
              win_amount,
              `Bet won on ${bet.event_name || 'Unknown Event'}`,
              "CR", // Credit
              op_balance,
              cl_balance,
              "Success",
            ]
          );
      }
    }
  }
}

}

module.exports = SportBet;
