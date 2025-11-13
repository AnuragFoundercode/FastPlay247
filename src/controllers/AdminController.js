const Admin = require("../models/Admin");
const db = require("../config/db");


exports.getDownline = async (req, res) => {
  try {
    const { id, role } = req.query;

    if (!id || !role) {
      return res.status(400).json({
        success: false,
        message: "id and role are required",
      });
    }

    const parsedId = parseInt(id);
    const parsedRole = parseInt(role);

    const users = await Admin.getDownlineUsers(parsedId, parsedRole);

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
     console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getDownUserList = async (req, res) => {
  try {
    const { id, role } = req.body;

    if (!id || !role) {
      return res.status(400).json({
        success: false,
        message: "id and role are required",
      });
    }

    const parsedId = parseInt(id);
    const parsedRole = parseInt(role);

    const users = await Admin.downUserList(parsedId, parsedRole);

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
     console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.getFirstDownline = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const [userData] = await db.query("SELECT username FROM users WHERE id = ?", [id]);

    if (userData.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const username = userData[0].username;
    const [downlines] = await db.query("SELECT * FROM users WHERE master_user = ?", [username]);

    if (downlines.length === 0) {
      return res.status(404).json({ success: false, message: "No downline found" });
    }

    res.status(200).json({
      success: true,
      message: "First downline fetched successfully",
      count: downlines.length,
      data: downlines,
    });
  } catch (error) {
    console.error("Error fetching downline:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};



function generateUsername() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return randomLetters + randomNumbers;
}

// exports.createAdmin = async (req, res) => {
//   try {
//     const {
//       name,
//       password,
//       master_user,
//       self_amount_limit,
//       self_share,
//       Match_comission,
//       session_comission,
//       cassino_comission,
//       role
//     } = req.body;

//     if (!name) return res.status(400).json({ success: false, message: "Name is required" });
//     if (!password) return res.status(400).json({ success: false, message: "Password is required" });
//     if (!master_user) return res.status(400).json({ success: false, message: "Master user is required" });
//     if (self_amount_limit === undefined)
//       return res.status(400).json({ success: false, message: "Self amount limit is required" });
//     // if (self_share === undefined)
//     //   return res.status(400).json({ success: false, message: "Self share is required" });
//     if (Match_comission === undefined)
//       return res.status(400).json({ success: false, message: "Match commission is required" });
//     if (session_comission === undefined)
//       return res.status(400).json({ success: false, message: "Session commission is required" });
//     if (cassino_comission === undefined)
//       return res.status(400).json({ success: false, message: "Cassino commission is required" });
//     if (!role) return res.status(400).json({ success: false, message: "Role is required" });

//     const masterLimit = await Admin.getMasterUserLimit(master_user);
//     if (masterLimit === null)
//       return res.status(400).json({ success: false, message: "Invalid master user" });

//     const masterLimitNum = parseFloat(masterLimit);
//     const newUserLimitNum = parseFloat(self_amount_limit);

//     if (newUserLimitNum > masterLimitNum)
//       return res.status(400).json({
//         success: false,
//         message: "Self amount limit cannot be greater than master user's available limit",
//       });

//     const username = generateUsername();
    
//     await db.query(
//       "UPDATE users SET self_amount_limit = self_amount_limit - ?, updated_at = NOW() WHERE username = ?",
//       [newUserLimitNum, master_user]
//     );

//     const insertId = await Admin.create({
//       name,
//       username,
//       password,
//       master_user,
//       self_amount_limit,
//       self_share,
//       Match_comission,
//       session_comission,
//       cassino_comission,
//       role
//     });

//     const remainingLimit = masterLimitNum - newUserLimitNum;
//     console.log("remainingLimit",newUserLimitNum);
    

//     return res.status(200).json({
//       success: true,
//       message: "Admin created successfully",
//       data: { id: insertId, username, remainingLimit },
//     });

//   } catch (error) {
//     console.error("Error creating admin:", error);
//     return res.status(500).json({
//       success: false,
//       message: error,
//     });
//   }
// };


exports.createAdmin = async (req, res) => {
  try {
    const {
      name,
      password,
      master_user,
      self_amount_limit,
      self_share,
      Match_comission,
      session_comission,
      cassino_comission,
      role,
    } = req.body;

    // ✅ Basic validation
    if (!name)
      return res.status(400).json({ success: false, message: "Name is required" });
    if (!password)
      return res.status(400).json({ success: false, message: "Password is required" });
    if (!master_user)
      return res.status(400).json({ success: false, message: "Master user is required" });
    if (self_amount_limit === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Self amount limit is required" });
    if (Match_comission === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Match commission is required" });
    if (session_comission === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Session commission is required" });
    if (cassino_comission === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Cassino commission is required" });
    if (!role)
      return res.status(400).json({ success: false, message: "Role is required" });

    // ✅ Fetch master user's available limit
    const masterLimit = await Admin.getMasterUserLimit(master_user);
    if (masterLimit === null)
      return res
        .status(400)
        .json({ success: false, message: "Invalid master user" });

    const masterLimitNum = parseFloat(masterLimit);
    const newUserLimitNum = parseFloat(self_amount_limit);

    if (newUserLimitNum > masterLimitNum)
      return res.status(400).json({
        success: false,
        message:
          "Self amount limit cannot be greater than master user's available limit",
      });

    const username = generateUsername();

    // ✅ Get master user data for transactions
    const [masterData] = await db.query(
      "SELECT id, self_amount_limit FROM users WHERE username = ?",
      [master_user]
    );

    if (masterData.length === 0)
      return res.status(400).json({ success: false, message: "Master user not found" });

    const masterUser = masterData[0];
    const master_op_balance = parseFloat(masterUser.self_amount_limit);
    const master_cl_balance = master_op_balance - newUserLimitNum;

    // ✅ Deduct from master balance
    await db.query(
      "UPDATE users SET self_amount_limit = ?, updated_at = NOW() WHERE username = ?",
      [master_cl_balance, master_user]
    );

    // ✅ Create new admin (child user)
    const insertId = await Admin.create({
      name,
      username,
      password,
      master_user,
      self_amount_limit,
      self_share,
      Match_comission,
      session_comission,
      cassino_comission,
      role,
    });

    const datetime = new Date();
    const reason = 1;

    // ✅ Get child user's opening/closing balance
    const user_op_balance = 0; // since newly created
    const user_cl_balance = parseFloat(self_amount_limit);

    // ✅ Insert transaction for new admin (child)
    await db.query(
      `INSERT INTO tbl_user_transaction 
        (userId, amount, description, type, op_balance, cl_balance, status, reason, datetime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        insertId,
        newUserLimitNum,
        "Initial amount assigned by master",
        "CR",
        user_op_balance,
        user_cl_balance,
        "success",
        reason,
        datetime,
      ]
    );

    // ✅ Insert transaction for master user (deducted)
    await db.query(
      `INSERT INTO tbl_user_transaction 
        (userId, amount, description, type, op_balance, cl_balance, status, reason, datetime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        masterUser.id,
        newUserLimitNum,
        "Amount assigned to new admin",
        "DR",
        master_op_balance,
        master_cl_balance,
        "success",
        reason,
        datetime,
      ]
    );

    const remainingLimit = master_cl_balance;

    return res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: { id: insertId, username, remainingLimit },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


exports.getLedger = async (req, res) => {
  try {
    const { roleid } = req.body;
    if (!roleid) {
      return res.status(400).json({ success: false, message: 'roleid is required' });
    }

    const from_date = req.body.from_date || null; // optional
    const to_date = req.body.to_date || null;     // optional

    const data = await Admin.getLedgerData(Number(roleid), from_date, to_date);

    return res.json({
      success: true,
      message: 'Ledger generated successfully',
      data
    });
  } catch (error) {
    // console.error('Error generating ledger:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.updateUserLimit = async (req, res) => {
  try {
    const { userId, self_amount_limit } = req.body;

    if (!userId)
      return res.status(400).json({ success: false, message: "User ID is required" });
    if (self_amount_limit === undefined)
      return res.status(400).json({ success: false, message: "Self amount limit is required" });

    const [userRows] = await db.execute(
      "SELECT id, master_user FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    const user = userRows[0];

    // Step 3: Fetch master user's limit
    const [masterRows] = await db.execute(
      "SELECT self_amount_limit FROM users WHERE username = ?",
      [user.master_user]
    );

    if (masterRows.length === 0)
      return res.status(400).json({ success: false, message: "Invalid master user" });

    const masterLimit = parseFloat(masterRows[0].self_amount_limit);

    // Step 4: Validate new limit
    if (parseFloat(self_amount_limit) > masterLimit)
      return res.status(400).json({
        success: false,
        message: "Self amount limit cannot exceed the master user's limit",
      });

    await db.execute(
      "UPDATE users SET self_amount_limit = ? WHERE id = ?",
      [self_amount_limit, userId]
    );

    return res.status(200).json({
      success: true,
      message: "User limit updated successfully",
    });
  } catch (error) {
    console.error("Error updating user limit:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.ledgerReport = async (req, res) => {
  try {
    const { userId, role } = req.query;
    if (!userId || !role) {
      return res.status(400).json({ status: false, message: "userId and role are required" });
    }

    // 1️⃣ Get all gmIds
    const [gmIds] = await db.execute(`SELECT DISTINCT gmId FROM sport_bets WHERE gmId IS NOT NULL`);
    if (!gmIds.length) {
      return res.json({ status: true, data: [] });
    }

    const report = [];

    for (const gm of gmIds) {
      // 2️⃣ Get all bets of that game with user details
      const [bets] = await db.execute(
        `SELECT sb.*, u.role as user_role, u.self_share, u.session_comission, u.master_user 
         FROM sport_bets sb 
         JOIN users u ON sb.user_id = u.id 
         WHERE sb.gmId = ?`,
        [gm.gmId]
      );

      let totalCredit = 0;
      let totalDebit = 0;

      for (const bet of bets) {
        const betAmount = parseFloat(bet.bet_amount);
        const isWon = bet.bet_status === "won";
        const marketType = bet.market_type;

        // 3️⃣ Get complete upline hierarchy for this player
        const [upline] = await db.execute(
          `WITH RECURSIVE user_chain AS (
            SELECT id, username, master_user, role, self_share, session_comission, 0 as level
            FROM users WHERE id = ?
            UNION ALL
            SELECT u.id, u.username, u.master_user, u.role, u.self_share, u.session_comission, uc.level + 1
            FROM users u
            INNER JOIN user_chain uc ON u.username = uc.master_user
          )
          SELECT * FROM user_chain ORDER BY level ASC`,
          [bet.user_id]
        );

        if (!upline.length) continue;

        const player = upline[0]; // The actual player who placed bet

        // 4️⃣ SELF SHARE CALCULATION - Percentage Difference Method
        for (let i = 0; i < upline.length - 1; i++) {
          const currentUser = upline[i];
          const parentUser = upline[i + 1];

          // Calculate percentage difference
          const shareDifference = parentUser.self_share - currentUser.self_share;
          
          if (shareDifference > 0) {
            const shareAmount = (betAmount * shareDifference) / 100;

            // Check if this is the target user
            if (parentUser.id == userId) {
              if (!isWon) {
                // Player lost - parent gets credit
                totalCredit += shareAmount;
              } else {
                // Player won - parent gets debit  
                totalDebit += shareAmount;
              }
            }
          }
        }

        // 5️⃣ Handle Company separately (top level gets remaining percentage)
        const companyUser = upline.find(user => user.role === 1);
        if (companyUser && companyUser.id == userId) {
          const topDownline = upline[upline.length - 2]; // Highest downline (MasterAdmin)
          const companyShare = (100 - topDownline.self_share);
          
          if (companyShare > 0) {
            const companyAmount = (betAmount * companyShare) / 100;
            if (!isWon) {
              totalCredit += companyAmount;
            } else {
              totalDebit += companyAmount;
            }
          }
        }

        // 6️⃣ SESSION COMMISSION (Only for fancy bets)
        if (marketType === "fancy") {
          // Session commission flows DOWN from company to downline
          const [sessionUsers] = await db.execute(
            `WITH RECURSIVE session_chain AS (
              SELECT id, role, session_comission, username, 0 as level
              FROM users WHERE role = 1  -- Start from company
              UNION ALL
              SELECT u.id, u.role, u.session_comission, u.username, sc.level + 1
              FROM users u
              INNER JOIN session_chain sc ON u.master_user = sc.username
              WHERE u.role != 1  -- Exclude company in downline
            )
            SELECT * FROM session_chain`,
            []
          );

          for (const sessionUser of sessionUsers) {
            if (sessionUser.id != userId) continue;

            const sessionAmount = (betAmount * sessionUser.session_comission) / 100;

            if (sessionUser.role === 1) {
              // Company gets DEBIT for session commission
              if (!isWon) {
                totalDebit += sessionAmount;
              }
            } else {
              // Downline gets CREDIT for session commission (only if player lost)
              if (!isWon) {
                totalCredit += sessionAmount;
              }
            }
          }
        }
      }

      report.push({
        gmId: gm.gmId,
        credit: totalCredit.toFixed(2),
        debit: totalDebit.toFixed(2),
        balance: (totalCredit - totalDebit).toFixed(2),
      });
    }

    return res.json({ status: true, data: report });
  } catch (err) {
    console.error("Ledger Error:", err);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

exports.myLedgerReport = async (req, res) => {
  try {
    const { id, role } = req.body;
    
    const userId=id;
    if (!userId || !role) {
      return res.status(400).json({ status: false, message: "userId and role are required" });
    }

    // 1️⃣ Get all gmIds
    const [gmIds] = await db.execute(`SELECT DISTINCT gmId FROM sport_bets WHERE gmId IS NOT NULL`);
    if (!gmIds.length) {
      return res.json({ status: true, data: [] });
    }

    const report = [];

    for (const gm of gmIds) {
      // 2️⃣ Get all bets of that game with user details
      const [bets] = await db.execute(
        `SELECT sb.*, u.role as user_role, u.self_share, u.session_comission, u.master_user 
         FROM sport_bets sb 
         JOIN users u ON sb.user_id = u.id 
         WHERE sb.gmId = ?`,
        [gm.gmId]
      );
 const eventName = bets[0].event_name; 
 const dateTime = bets[0].created_at; 
      let totalCredit = 0;
      let totalDebit = 0;

      for (const bet of bets) {
        const betAmount = parseFloat(bet.bet_amount);
        const isWon = bet.bet_status === "won";
        const marketType = bet.market_type;

        // 3️⃣ Get complete upline hierarchy for this player
        const [upline] = await db.execute(
          `WITH RECURSIVE user_chain AS (
            SELECT id, username, master_user, role, self_share, session_comission, 0 as level
            FROM users WHERE id = ?
            UNION ALL
            SELECT u.id, u.username, u.master_user, u.role, u.self_share, u.session_comission, uc.level + 1
            FROM users u
            INNER JOIN user_chain uc ON u.username = uc.master_user
          )
          SELECT * FROM user_chain ORDER BY level ASC`,
          [bet.user_id]
        );

        if (!upline.length) continue;

        const player = upline[0]; // The actual player who placed bet

        // 4️⃣ SELF SHARE CALCULATION - Percentage Difference Method
        for (let i = 0; i < upline.length - 1; i++) {
          const currentUser = upline[i];
          const parentUser = upline[i + 1];

          // Calculate percentage difference
          const shareDifference = parentUser.self_share - currentUser.self_share;
          
          if (shareDifference > 0) {
            const shareAmount = (betAmount * shareDifference) / 100;

            // Check if this is the target user
            if (parentUser.id == userId) {
              if (!isWon) {
                // Player lost - parent gets credit
                totalCredit += shareAmount;
              } else {
                // Player won - parent gets debit  
                totalDebit += shareAmount;
              }
            }
          }
        }

        // 5️⃣ Handle Company separately (top level gets remaining percentage)
        const companyUser = upline.find(user => user.role === 1);
        if (companyUser && companyUser.id == userId) {
          const topDownline = upline[upline.length - 2]; // Highest downline (MasterAdmin)
          const companyShare = (100 - topDownline.self_share);
          
          if (companyShare > 0) {
            const companyAmount = (betAmount * companyShare) / 100;
            if (!isWon) {
              totalCredit += companyAmount;
            } else {
              totalDebit += companyAmount;
            }
          }
        }

        // 6️⃣ SESSION COMMISSION (Only for fancy bets) - TOP to BOTTOM FLOW
        if (marketType === "fancy") {
          // Get the complete hierarchy from company to player
          const [completeHierarchy] = await db.execute(
            `WITH RECURSIVE complete_chain AS (
              SELECT id, username, master_user, role, self_share, session_comission, 0 as level
              FROM users WHERE role = 1  -- Start from company
              UNION ALL
              SELECT u.id, u.username, u.master_user, u.role, u.self_share, u.session_comission, cc.level + 1
              FROM users u
              INNER JOIN complete_chain cc ON u.master_user = cc.username
            )
            SELECT * FROM complete_chain ORDER BY level ASC`,
            []
          );

          if (completeHierarchy.length > 0) {
            // Session commission flows from TOP to BOTTOM
            for (let i = 0; i < completeHierarchy.length - 1; i++) {
              const currentLevel = completeHierarchy[i];
              const nextLevel = completeHierarchy[i + 1];

              // Session commission amount for this level
              const sessionAmount = (betAmount * nextLevel.session_comission) / 100;

              // Check if current level is the target user
              if (currentLevel.id == userId) {
                // Current level gets DEBIT (pays to next level)
                totalDebit += sessionAmount;
              }

              // Check if next level is the target user  
              if (nextLevel.id == userId) {
                // Next level gets CREDIT (receives from current level)
                if (!isWon) { // Only credit if player lost
                  totalCredit += sessionAmount;
                }
              }
            }

            // Special case: If target user is the last level (player)
            const lastUser = completeHierarchy[completeHierarchy.length - 1];
            if (lastUser.id == userId && lastUser.role === 7) {
              // Player doesn't get session commission
              // No action needed
            }
          }
        }
      }

      report.push({
        gmId: gm.gmId,
        eventName: eventName,
        credit: totalCredit.toFixed(2),
        debit: totalDebit.toFixed(2),
        balance: (totalCredit - totalDebit).toFixed(2),
        dateTime: dateTime,
      });
    }

    return res.json({ status: true, data: report });
  } catch (err) {
    console.error("Ledger Error:", err);
    return res.status(500).json({ status: false, message: err });
  }
};

exports.getSportBetHistory = async (req, res) => {
  try {
    const { userId, gmId } = req.body;

    // ✅ Validation
    if (!userId || !gmId) {
      return res.status(400).json({
        success: false,
        message: "userId and gmId are required",
      });
    }

    // ✅ Parse to numbers (optional but safe)
    const parsedUserId = parseInt(userId);
    const parsedGmId = parseInt(gmId);

    if (isNaN(parsedUserId) || isNaN(parsedGmId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or gmId format",
      });
    }

    // ✅ Execute query properly
    const [rows] = await db.execute(
      "SELECT * FROM sport_bets WHERE bet_status='pending' AND user_id = ? AND gmId = ?",
      [parsedUserId, parsedGmId]
    );

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No data found",
        total: 0,
        data: [],
      });
    }

    // ✅ Return results
    return res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });

  } catch (error) {
    console.error("Error in getSportBetHistory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.getCasinoBetHistory = async (req, res) => {
  try {
    const { userId, game_type } = req.body;

    if (!userId || !game_type) {
      return res.status(400).json({
        success: false,
        message: "userId and game_type are required",
      });
    }

    const parsedUserId = parseInt(userId);
    const parsedGmId = game_type

    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or game_type format",
      });
    }

    const [rows] = await db.execute(
      "SELECT game_type, match_id, bet_choice, amount, status, bet_value,type,  created_at FROM bets WHERE status='pending' AND user_id = ? AND game_type = ?",
      [parsedUserId, parsedGmId]
    );

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No data found",
        total: 0,
        data: [],
      });
    }

    // ✅ Return results
    return res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });

  } catch (error) {
    console.error("Error in getSportBetHistory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.updateAdmin = async (req, res) => {
  try {
    const {
      id,
      name,
      password,
      self_amount_limit,
      self_share,
      Match_comission,
      session_comission,
      cassino_comission,
      master_user,
    } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "Admin ID is required" });
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    if (!master_user) return res.status(400).json({ success: false, message: "Master user is required" });
    if (self_amount_limit === undefined)
      return res.status(400).json({ success: false, message: "Self amount limit is required" });
    if (self_share === undefined)
      return res.status(400).json({ success: false, message: "Self share is required" });
    if (Match_comission === undefined)
      return res.status(400).json({ success: false, message: "Match commission is required" });
    if (session_comission === undefined)
      return res.status(400).json({ success: false, message: "Session commission is required" });
    if (cassino_comission === undefined)
      return res.status(400).json({ success: false, message: "Cassino commission is required" });

    const [masterUser] = await db.query(
      `SELECT self_amount_limit, self_share, Match_comission, session_comission, cassino_comission 
       FROM users WHERE username = ?`,
      [master_user]
    );

    if (!masterUser.length)
      return res.status(400).json({ success: false, message: "Invalid master user" });

    const master = masterUser[0];

    const [existingAdmin] = await db.query(
      `SELECT self_amount_limit FROM users WHERE id = ?`,
      [id]
    );

    if (!existingAdmin.length)
      return res.status(400).json({ success: false, message: "Admin not found" });

    const oldLimit = parseFloat(existingAdmin[0].self_amount_limit);
    const masterLimit = parseFloat(master.self_amount_limit);
    const newLimit = parseFloat(self_amount_limit);

    const newShare = parseFloat(self_share);
    const newMatch = parseFloat(Match_comission);
    const newSession = parseFloat(session_comission);
    const newCassino = parseFloat(cassino_comission);

    

    // if (newMatch > parseFloat(master.Match_comission))
    //   return res.status(400).json({ success: false, message: "Match commission cannot exceed master user's match commission" });

    // if (newSession > parseFloat(master.session_comission))
    //   return res.status(400).json({ success: false, message: "Session commission cannot exceed master user's session commission" });

    // if (newCassino > parseFloat(master.cassino_comission))
    //   return res.status(400).json({ success: false, message: "Cassino commission cannot exceed master user's cassino commission" });
    const diff = newLimit - oldLimit;
    if (diff > 0) {
      if (diff > masterLimit) {
        return res.status(400).json({
          success: false,
          message: "Master user does not have enough limit to increase this admin's limit",
        });
      }

      await db.query(
        "UPDATE users SET self_amount_limit = self_amount_limit - ?, updated_at = NOW() WHERE username = ?",
        [diff, master_user]
      );
    }
    else if (diff < 0) {
      await db.query(
        "UPDATE users SET self_amount_limit = self_amount_limit + ?, updated_at = NOW() WHERE username = ?",
        [Math.abs(diff), master_user]
      );
    }

    const updateData = {
      name,
      self_amount_limit: newLimit,
      self_share,
      Match_comission,
      session_comission,
      cassino_comission,
      updated_at: new Date(),
    };

    if (password) {
      updateData.password = password; 
    }

    await db.query("UPDATE users SET ? WHERE id = ?", [updateData, id]);

    const [updatedMaster] = await db.query(
      "SELECT self_amount_limit FROM users WHERE username = ?",
      [master_user]
    );

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: {
        updated_admin_id: id,
        remaining_master_limit: updatedMaster[0].self_amount_limit,
      },
    });

  } catch (error) {
    console.error("Error updating admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateWallet = async (req, res) => {
  const { userId, type, amount } = req.body;

  try {
    if (!userId || !type || !amount) {
      return res.status(400).json({
        success: false,
        message: "userId, type, and amount are required",
      });
    }

    // ✅ Fetch user details
    const [userData] = await db.query(
      "SELECT id, self_amount_limit, master_user FROM users WHERE id = ?",
      [userId]
    );

    const user = userData[0];
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const op_balance = parseFloat(user.self_amount_limit);
    let cl_balance = op_balance;

    // ✅ Prepare variables for master user
    let masterData = [];
    let master_balance = 0;
    let master_op_balance = 0;

    if (user.master_user) {
      [masterData] = await db.query(
        "SELECT id, self_amount_limit FROM users WHERE username = ?",
        [user.master_user]
      );

      if (masterData.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Master user not found" });
      }

      master_balance = parseFloat(masterData[0].self_amount_limit);
      master_op_balance = master_balance;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "This user does not have a master_user" });
    }

    let master_cl_balance = master_balance;

    // ✅ Deposit Logic (child CR, master DR)
    if (type === "deposit") {
      if (amount > master_balance) {
        return res.status(400).json({
          success: false,
          message: "Deposit amount exceeds master user's available balance",
        });
      }

      cl_balance = op_balance + parseFloat(amount);
      master_cl_balance = master_balance - parseFloat(amount);
    }

    // ✅ Withdrawal Logic (child DR, master CR)
    else if (type === "withdrawal") {
      if (op_balance < amount) {
        return res
          .status(400)
          .json({ success: false, message: "Insufficient user balance" });
      }

      cl_balance = op_balance - parseFloat(amount);
      master_cl_balance = master_balance + parseFloat(amount);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'deposit' or 'withdrawal'.",
      });
    }

    // ✅ Update user and master balances
    await db.query("UPDATE users SET self_amount_limit = ? WHERE id = ?", [
      cl_balance,
      userId,
    ]);
    await db.query("UPDATE users SET self_amount_limit = ? WHERE username = ?", [
      master_cl_balance,
      user.master_user,
    ]);

    const datetime = new Date();

    // ✅ Insert child transaction
    const child_description =
      type === "deposit"
        ? "Amount Deposited (from master)"
        : "Amount Withdrawn (to master)";
    const child_cr_dr = type === "deposit" ? "CR" : "DR";

    await db.query(
      `INSERT INTO tbl_user_transaction 
        (userId, amount, description, type, op_balance, cl_balance, status, reason, datetime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        amount,
        child_description,
        child_cr_dr,
        op_balance,
        cl_balance,
        "success",
        1,
        datetime,
      ]
    );

    // ✅ Insert master transaction (reverse entry)
    const master_description =
      type === "deposit"
        ? "Amount Deducted for user deposit"
        : "Amount Credited for user withdrawal";
    const master_cr_dr = type === "deposit" ? "DR" : "CR";

    await db.query(
      `INSERT INTO tbl_user_transaction 
        (userId, amount, description, type, op_balance, cl_balance, status, reason, datetime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        masterData[0].id,
        amount,
        master_description,
        master_cr_dr,
        master_op_balance,
        master_cl_balance,
        "success",
        1,
        datetime,
      ]
    );

    // ✅ Final response
    return res.json({
      success: true,
      message: `Amount ${type === "deposit" ? "deposited" : "withdrawn"} successfully.`,
      data: {
        userId,
        user_op_balance: op_balance,
        user_cl_balance: cl_balance,
        master_user: user.master_user,
        master_op_balance,
        master_cl_balance,
        amount,
        type,
      },
    });
  } catch (error) {
    console.error("Error in updateWallet:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.myStatement = async (req, res) => {
  try {
    const { userId, type, fromDate, toDate } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    let startDate = fromDate;
    let endDate = toDate;

    if (!fromDate || !toDate) {
      const now = new Date();
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday

      startDate = `${firstDayOfWeek.getFullYear()}-${(firstDayOfWeek.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${firstDayOfWeek.getDate().toString().padStart(2, "0")} 00:00:00`;

      const endOfWeek = new Date();
      endDate = `${endOfWeek.getFullYear()}-${(endOfWeek.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${endOfWeek.getDate().toString().padStart(2, "0")} 23:59:59`;
    } else {
      startDate = `${fromDate} 00:00:00`;
      endDate = `${toDate} 23:59:59`;
    }

    let query = `
      SELECT amount, description, type, op_balance, cl_balance, reason, datetime 
      FROM tbl_user_transaction 
      WHERE userId = ? AND datetime BETWEEN ? AND ?`;

    const params = [userId, startDate, endDate];

    if (type === "pl") {
      query += " AND reason = 0";
    } else if (type === "account") {
      query += " AND reason = 1";
    }

    query += " ORDER BY id DESC";

    const [transactions] = await db.query(query, params);

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transaction records found for this user in the selected date range",
      });
    }

    return res.json({
      success: true,
      message: "User transaction statement fetched successfully",
      count: transactions.length,
      filter: type || "all",
      date_range: { start: startDate, end: endDate },
      data: transactions,
    });
  } catch (error) {
    console.error("Error in myStatement:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// only sports working perfect

// exports.clientLedger = async (req, res) => {
//   try {
//     const { user_id } = req.body;

//     if (!user_id) {
//       return res.status(400).json({ status: false, message: "user_id is required" });
//     }

//     // 1️⃣ Check if user exists and is a client
//     const [userRows] = await db.query(
//       `SELECT id, role, Match_comission, session_comission 
//       FROM users WHERE id = ?`,
//       [user_id]
//     );

//     if (!userRows.length) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     const user = userRows[0];
//     if (user.role != 7) {
//       return res.status(403).json({ status: false, message: "Only clients can access this ledger" });
//     }

//     // 2️⃣ Get all bets grouped by gmId for this client
//     const [bets] = await db.query(
//       `SELECT gmId, event_name, market_type, bet_amount, win_amount, created_at
//       FROM sport_bets 
//       WHERE user_id = ? AND gmId IS NOT NULL
//       ORDER BY created_at DESC`,
//       [user_id]
//     );

//     if (!bets.length) {
//       return res.json({ status: true, data: [], total: {} });
//     }

//     // 3️⃣ Group by gmId
//     const grouped = {};
//     for (const bet of bets) {
//       const gmId = bet.gmId;
//       if (!grouped[gmId]) {
//         grouped[gmId] = {
//           gmId,
//           event_name: bet.event_name,
//           totalDebit: 0,
//           totalCredit: 0,
//           totalCommission: 0,
//           dateTime: bet.created_at
//         };
//       }

//       // Debit (bet placed)
//       grouped[gmId].totalDebit += parseFloat(bet.bet_amount || 0);

//       // Credit (win amount)
//       grouped[gmId].totalCredit += parseFloat(bet.win_amount || 0);

//       // Commission (based on market type)
//       if (bet.market_type === "match") {
//         grouped[gmId].totalCommission += (bet.bet_amount * user.Match_comission) / 100;
//       } else if (bet.market_type === "fancy") {
//         grouped[gmId].totalCommission += (bet.bet_amount * user.session_comission) / 100;
//       }
//     }

//     // 4️⃣ Prepare final report and total calculations
//     let totalDebit = 0;
//     let totalCredit = 0;
//     let totalCommission = 0;
//     let totalBalance = 0;

//     const report = Object.values(grouped).map((item) => {
//       const totalCreditValue = item.totalCredit + item.totalCommission;
//       const balance = totalCreditValue - item.totalDebit;

//       totalDebit += item.totalDebit;
//       totalCredit += totalCreditValue;
//       totalCommission += item.totalCommission;
//       totalBalance += balance;

//       return {
//         gmId: item.gmId,
//         eventName: item.event_name,
//         debit: item.totalDebit.toFixed(2),
//         credit: totalCreditValue.toFixed(2),
//         commission: item.totalCommission.toFixed(2),
//         balance: balance.toFixed(2),
//         dateTime: item.dateTime,
//       };
//     });

//     // 5️⃣ Add totals object
//     const totals = {
//       total_debit: totalDebit.toFixed(2),
//       total_credit: totalCredit.toFixed(2),
//       total_commission: totalCommission.toFixed(2),
//       total_balance: totalBalance.toFixed(2),
//     };

//     return res.json({
//       status: true,
//       message: "Client ledger fetched successfully",
//       data: report,
//       total: totals,
//     });

//   } catch (err) {
//     console.error("Ledger Error:", err);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };


exports.clientLedger = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ status: false, message: "user_id is required" });
    }

    // 1️⃣ Check if user exists and is a client
    const [userRows] = await db.query(
      `SELECT id, role, Match_comission, session_comission, cassino_comission 
      FROM users WHERE id = ?`,
      [user_id]
    );

    if (!userRows.length) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const user = userRows[0];
    if (user.role != 7) {
      return res.status(403).json({ status: false, message: "Only clients can access this ledger" });
    }

    // 2️⃣ SPORTS BETS (full history, gmId-based)
    const [bets] = await db.query(
      `SELECT gmId, event_name, market_type, bet_amount, win_amount, created_at
      FROM sport_bets 
      WHERE user_id = ? AND gmId IS NOT NULL
      ORDER BY created_at DESC`,
      [user_id]
    );

    const grouped = {};
    for (const bet of bets) {
      const gmId = bet.gmId;
      if (!grouped[gmId]) {
        grouped[gmId] = {
          gmId,
          event_name: bet.event_name,
          totalDebit: 0,
          totalCredit: 0,
          totalCommission: 0,
          dateTime: bet.created_at
        };
      }

      grouped[gmId].totalDebit += parseFloat(bet.bet_amount || 0);
      grouped[gmId].totalCredit += parseFloat(bet.win_amount || 0);

      if (bet.market_type === "match") {
        grouped[gmId].totalCommission += (bet.bet_amount * user.Match_comission) / 100;
      } else if (bet.market_type === "fancy") {
        grouped[gmId].totalCommission += (bet.bet_amount * user.session_comission) / 100;
      }
    }

    // 3️⃣ CASINO LEDGER (24 hours + grouped by game_type + date)
    const [cassinoBets] = await db.query(
      `SELECT 
          game_type, 
          DATE(created_at) AS bet_date,
          SUM(amount) AS total_bet, 
          SUM(win_amount) AS total_win
      FROM bets
      WHERE user_id = ?
         AND created_at >= NOW() - INTERVAL 1 DAY
      GROUP BY game_type, DATE(created_at)
      ORDER BY bet_date DESC`,
      [user_id]
    );

    const cassinoReport = [];
    let cassinoTotalDebit = 0;
    let cassinoTotalCredit = 0;
    let cassinoTotalCommission = 0;
    let cassinoTotalBalance = 0;

    for (const bet of cassinoBets) {
      const totalBet = parseFloat(bet.total_bet || 0);
      const totalWin = parseFloat(bet.total_win || 0);
      const date = bet.bet_date;

      let commission = 0;
      if (totalBet > totalWin) {
        commission = ((totalBet - totalWin) * user.cassino_comission) / 100;
      }

      const totalCreditValue = totalWin + commission;
      const balance = totalCreditValue - totalBet;

      cassinoTotalDebit += totalBet;
      cassinoTotalCredit += totalCreditValue;
      cassinoTotalCommission += commission;
      cassinoTotalBalance += balance;

      cassinoReport.push({
        gmId: `Cassino-${bet.game_type}-${date}`,
        eventName: bet.game_type,
        debit: totalBet.toFixed(2),
        credit: totalCreditValue.toFixed(2),
        commission: commission.toFixed(2),
        balance: balance.toFixed(2),
        dateTime: date
      });
    }

    // 4️⃣ SPORTS LEDGER CALCULATIONS
    let totalDebit = 0;
    let totalCredit = 0;
    let totalCommission = 0;
    let totalBalance = 0;

    const sportsReport = Object.values(grouped).map((item) => {
      const totalCreditValue = item.totalCredit + item.totalCommission;
      const balance = totalCreditValue - item.totalDebit;

      totalDebit += item.totalDebit;
      totalCredit += totalCreditValue;
      totalCommission += item.totalCommission;
      totalBalance += balance;

      return {
        gmId: item.gmId,
        eventName: item.event_name,
        debit: item.totalDebit.toFixed(2),
        credit: totalCreditValue.toFixed(2),
        commission: item.totalCommission.toFixed(2),
        balance: balance.toFixed(2),
        dateTime: item.dateTime,
      };
    });

    // 5️⃣ MERGE BOTH REPORTS
    const finalReport = [...sportsReport, ...cassinoReport];

    // 6️⃣ TOTALS (combined)
    const totals = {
      total_debit: (totalDebit + cassinoTotalDebit).toFixed(2),
      total_credit: (totalCredit + cassinoTotalCredit).toFixed(2),
      total_commission: (totalCommission + cassinoTotalCommission).toFixed(2),
      total_balance: (totalBalance + cassinoTotalBalance).toFixed(2),
    };

    // 7️⃣ Final response
    return res.json({
      status: true,
      message: "Client ledger fetched successfully",
      data: finalReport,
      total: totals,
    });

  } catch (err) {
    console.error("Ledger Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};




exports.clientCommissionReport = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ status: false, message: "user_id is required" });
    }

    // 1️⃣ Fetch user
    const [userRows] = await db.query(
      `SELECT id, role, Match_comission, session_comission, cassino_comission
       FROM users WHERE id = ?`,
      [user_id]
    );

    if (!userRows.length) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const user = userRows[0];
    if (user.role != 7) {
      return res.status(403).json({ status: false, message: "Only clients can access commission report" });
    }

    // 2️⃣ Fetch sports bets
    const [bets] = await db.query(
      `SELECT gmId, event_name, market_type, bet_amount, created_at
       FROM sport_bets 
       WHERE user_id = ? AND gmId IS NOT NULL
       ORDER BY created_at DESC`,
      [user_id]
    );

    // Group by gmId
    const grouped = {};
    for (const bet of bets) {
      const gmId = bet.gmId;

      if (!grouped[gmId]) {
        grouped[gmId] = {
          gmId,
          eventName: bet.event_name,
          totalMatchComission: 0,
          totalSessionComission: 0,
          totalCassinoComission: 0,
          dateTime: bet.created_at,
        };
      }

      if (bet.market_type === "match") {
        grouped[gmId].totalMatchComission += (bet.bet_amount * user.Match_comission) / 100;
      } else if (bet.market_type === "fancy") {
        grouped[gmId].totalSessionComission += (bet.bet_amount * user.session_comission) / 100;
      }
    }

    // 3️⃣ Fetch cassino bets - DAY WISE + game_type WISE
    const [cassinoBets] = await db.query(
      `SELECT 
          game_type, 
          DATE(created_at) AS bet_date,
          SUM(amount) AS total_bet, 
          SUM(win_amount) AS total_win
       FROM bets
       WHERE user_id = ?
       GROUP BY game_type, DATE(created_at)
       ORDER BY bet_date DESC`,
      [user_id]
    );

    // Process cassino commission
    const cassinoData = [];
    let totalCassinoCom = 0;

    for (const bet of cassinoBets) {
      const totalBet = parseFloat(bet.total_bet || 0);
      const totalWin = parseFloat(bet.total_win || 0);

      // User lost => commission applicable
      if (totalBet > totalWin) {
        const com = ((totalBet - totalWin) * user.cassino_comission) / 100;
        totalCassinoCom += com;

        cassinoData.push({
          gmId: `Cassino-${bet.game_type}-${bet.bet_date}`,
          eventName: bet.game_type,
          dateTime: bet.bet_date,
          total_match_comission: "0.00",
          total_session_comission: "0.00",
          total_cassino_comission: com.toFixed(2),
          total_commission: com.toFixed(2),
        });
      }
    }

    // 4️⃣ Prepare sports report
    let totalMatchCom = 0;
    let totalSessionCom = 0;
    let totalAllCom = totalCassinoCom;

    const sportsReport = Object.values(grouped).map((item) => {
      const totalCommission = item.totalMatchComission + item.totalSessionComission;

      totalMatchCom += item.totalMatchComission;
      totalSessionCom += item.totalSessionComission;
      totalAllCom += totalCommission;

      return {
        gmId: item.gmId,
        eventName: item.eventName,
        dateTime: item.dateTime,
        total_match_comission: item.totalMatchComission.toFixed(2),
        total_session_comission: item.totalSessionComission.toFixed(2),
        total_cassino_comission: "0.00",
        total_commission: totalCommission.toFixed(2),
      };
    });

    // Merge reports
    const finalReport = [...sportsReport, ...cassinoData];

    // 5️⃣ Totals
    const totals = {
      total_match_comission: totalMatchCom.toFixed(2),
      total_session_comission: totalSessionCom.toFixed(2),
      total_cassino_comission: totalCassinoCom.toFixed(2),
      total_commission: totalAllCom.toFixed(2),
    };

    return res.json({
      status: true,
      message: "Client commission report fetched successfully",
      data: finalReport,
      total: totals,
    });

  } catch (err) {
    console.error("Commission Report Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};






