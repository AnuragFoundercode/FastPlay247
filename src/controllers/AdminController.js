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

    // STEP 1: Get the username of the given user
    const [userData] = await db.query("SELECT username FROM users WHERE id = ?", [id]);

    if (userData.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const username = userData[0].username;

    // STEP 2: Fetch all direct downline users
    const [downlines] = await db.query(
      "SELECT * FROM users WHERE master_user = ?",
      [username]
    );

    if (downlines.length === 0) {
      return res.status(404).json({ success: false, message: "No downline found" });
    }

    // STEP 3: Add agent_share key to each downline user
    const formattedDownlines = downlines.map((user) => {
      const selfShare = Number(user.self_share) || 0;
      const agentShare = 100 - selfShare;
      return {
        ...user,
        agent_share: agentShare,
      };
    });

    res.status(200).json({
      success: true,
      message: "First downline fetched successfully",
      count: formattedDownlines.length,
      data: formattedDownlines,
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

    const [gmIds] = await db.execute(`SELECT DISTINCT gmId FROM sport_bets WHERE gmId IS NOT NULL`);
    if (!gmIds.length) {
      return res.json({ status: true, data: [] });
    }

    const report = [];

    for (const gm of gmIds) {
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

        const player = upline[0]; 
        for (let i = 0; i < upline.length - 1; i++) {
          const currentUser = upline[i];
          const parentUser = upline[i + 1];

          const shareDifference = parentUser.self_share - currentUser.self_share;
          
          if (shareDifference > 0) {
            const shareAmount = (betAmount * shareDifference) / 100;

            if (parentUser.id == userId) {
              if (!isWon) {
                totalCredit += shareAmount;
              } else {
                totalDebit += shareAmount;
              }
            }
          }
        }

        const companyUser = upline.find(user => user.role === 1);
        if (companyUser && companyUser.id == userId) {
          const topDownline = upline[upline.length - 2]; 
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

        if (marketType === "fancy") {
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
            for (let i = 0; i < completeHierarchy.length - 1; i++) {
              const currentLevel = completeHierarchy[i];
              const nextLevel = completeHierarchy[i + 1];

              const sessionAmount = (betAmount * nextLevel.session_comission) / 100;

              if (currentLevel.id == userId) {
                totalDebit += sessionAmount;
              }

              if (nextLevel.id == userId) {
                if (!isWon) { 
                  totalCredit += sessionAmount;
                }
              }
            }

            const lastUser = completeHierarchy[completeHierarchy.length - 1];
            if (lastUser.id == userId && lastUser.role === 7) {
              
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

exports.getAllBetHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    // ✅ Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
      });
    }

    // ===============================
    // 📌 SPORT BETS (pending)
    // ===============================
    const [sportRows] = await db.execute(
      "SELECT * FROM sport_bets WHERE bet_status='pending' AND user_id = ?",
      [parsedUserId]
    );

    // ===============================
    // 📌 CASINO BETS (pending)
    // ===============================
    const [casinoRows] = await db.execute(
      "SELECT game_type, match_id, bet_choice, amount, status, bet_value, type, created_at FROM bets WHERE status='pending' AND user_id = ?",
      [parsedUserId]
    );

    // ===============================
    // 📌 RESPONSE
    // ===============================
    return res.status(200).json({
      success: true,
      sport_total: sportRows.length,
      casino_total: casinoRows.length,
      total: sportRows.length + casinoRows.length,
      sport_bets: sportRows,
      casino_bets: casinoRows,
    });

  } catch (error) {
    console.error("Error in getAllBetHistory:", error);
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
    //if (self_share === undefined)
    //  return res.status(400).json({ success: false, message: "Self share is required" });
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

exports.clientLedger = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ status: false, message: "user_id is required" });
    }

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

      if (bet.market_type === "match1") {
        grouped[gmId].totalCommission += (bet.bet_amount * user.Match_comission) / 100;
      } else if (bet.market_type === "fancy") {
        grouped[gmId].totalCommission += (bet.bet_amount * user.session_comission) / 100;
      }
    }

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

    const finalReport = [...sportsReport, ...cassinoReport];

    const totals = {
      total_debit: (totalDebit + cassinoTotalDebit).toFixed(2),
      total_credit: (totalCredit + cassinoTotalCredit).toFixed(2),
      total_commission: (totalCommission + cassinoTotalCommission).toFixed(2),
      total_balance: (totalBalance + cassinoTotalBalance).toFixed(2),
    };

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

    const [bets] = await db.query(
      `SELECT gmId, event_name, market_type, bet_amount, created_at
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
          eventName: bet.event_name,
          totalMatchComission: 0,
          totalSessionComission: 0,
          totalCassinoComission: 0,
          dateTime: bet.created_at,
        };
      }

      if (bet.market_type === "match1") {
        grouped[gmId].totalMatchComission += (bet.bet_amount * user.Match_comission) / 100;
      } else if (bet.market_type === "fancy") {
        grouped[gmId].totalSessionComission += (bet.bet_amount * user.session_comission) / 100;
      }
    }

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

    const cassinoData = [];
    let totalCassinoCom = 0;

    for (const bet of cassinoBets) {
      const totalBet = parseFloat(bet.total_bet || 0);
      const totalWin = parseFloat(bet.total_win || 0);

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

    const finalReport = [...sportsReport, ...cassinoData];

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

// exports.getUserSummary = async (req, res) => {
//   try {
//     const { user_id } = req.body;

//     if (!user_id) {
//       return res.status(400).json({
//         success: false,
//         message: "user_id is required"
//       });
//     }

//     const [userData] = await db.query(
//       "SELECT id, username, name, role, self_amount_limit, Match_comission, cassino_comission, session_comission FROM users WHERE id = ?",
//       [user_id]
//     );

//     if (userData.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     const user = userData[0];
//     const hierarchy = {
//       1: [2,3,4,5,6,7], 
//       2: [3,4,5,6,7],  
//       3: [4,5,6,7],    
//       4: [5,6,7],
//       5: [6,7],
//       6: [7],
//       7: []
//     };

//     const allowedRoles = hierarchy[user.role];

//     let downlineCounts = {};

//     if (allowedRoles.length > 0) {
//       const allChildren = await getRecursiveUsers(user.username);
//       allowedRoles.forEach(r => {
//         downlineCounts[`role_${r}`] = allChildren.filter(u => u.role === r).length;
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "User summary fetched successfully",
//       data: {
//         user_id: user.id,
//         username: user.username,
//         name: user.name,
//         role: user.role,

//         my_self_amount_limit: user.self_amount_limit,

//         commissions: {
//           match: user.Match_comission,
//           cassino: user.cassino_comission,
//           session: user.session_comission
//         },

//         downline_summary: downlineCounts
//       }
//     });

//   } catch (error) {
//     console.log("Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error
//     });
//   }
// };

// async function getRecursiveUsers(parentUsername) {
//   let results = [];

//   const [directUsers] = await db.query(
//     "SELECT id, username, role FROM users WHERE master_user = ?",
//     [parentUsername]
//   );

//   for (const u of directUsers) {
//     results.push(u);
//     const childUsers = await getRecursiveUsers(u.username);
//     results = results.concat(childUsers);
//   }

//   return results;
// }

exports.getUserSummary = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    const [userData] = await db.query(
      "SELECT id, username, name, role, self_amount_limit, Match_comission, cassino_comission, session_comission FROM users WHERE id = ?",
      [user_id]
    );

    if (userData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userData[0];

    // Role hierarchy
    const hierarchy = {
      1: [2,3,4,5,6,7], 
      2: [3,4,5,6,7],  
      3: [4,5,6,7],    
      4: [5,6,7],
      5: [6,7],
      6: [7],
      7: []
    };

    const allowedRoles = hierarchy[user.role];
    let downlineCounts = {};

    // Only process if user has sub-roles
    if (allowedRoles.length > 0) {
      const allChildren = await getRecursiveUsers(user.username);

      allowedRoles.forEach(r => {
        const usersOfRole = allChildren.filter(u => u.role === r);

        const active = usersOfRole.filter(u => u.status == 1).length;
        const inactive = usersOfRole.filter(u => u.status == 0).length;

        // Format: "active/inactive"
        downlineCounts[`role_${r}`] = `${active}/${inactive}`;
      });
    }

    return res.status(200).json({
      success: true,
      message: "User summary fetched successfully",
      data: {
        user_id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,

        my_self_amount_limit: user.self_amount_limit,

        commissions: {
          match: user.Match_comission,
          cassino: user.cassino_comission,
          session: user.session_comission
        },

        downline_summary: downlineCounts
      }
    });

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error
    });
  }
};

async function getRecursiveUsers(parentUsername) {
  let results = [];

  const [directUsers] = await db.query(
    "SELECT id, username, role, status FROM users WHERE master_user = ?",
    [parentUsername]
  );

  for (const u of directUsers) {
    results.push(u);

    const childUsers = await getRecursiveUsers(u.username);
    results = results.concat(childUsers);
  }

  return results;
}

exports.welcomMsg = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM `tbl_setting`");

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No settings found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Setting data fetched successfully",
      data: data[0] 
    });

  } catch (error) {
    console.error("Error in welcomMsg:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.masterProfitLoss = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ status: false, message: "user_id is required" });
    }

    // STEP 1: Get master info (we also need username)
    const [userRows] = await db.query(
      `SELECT id, username, role, Match_comission, session_comission, cassino_comission 
       FROM users WHERE id = ?`,
      [user_id]
    );

    if (!userRows.length) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const master = userRows[0];

    // Clients cannot access downline
    if (master.role >= 7) {
      return res.status(403).json({ status: false, message: "Clients cannot access downline ledger" });
    }

    const masterUsername = master.username;  // ❤️ IMPORTANT

    // STEP 2: DOWNLINE CLIENTS USING USERNAME (NOT ID)
    const getDownlineClients = async (username) => {
      const [rows] = await db.query(
        `SELECT id, username, role 
         FROM users 
         WHERE master_user = ?`,
        [username]
      );

      let clients = [];

      for (const row of rows) {
        if (row.role == 7) {
          // Found a client
          clients.push(row.id);
        } else {
          // Go deeper recursively using USERNAME
          const childClients = await getDownlineClients(row.username);
          clients = [...clients, ...childClients];
        }
      }

      return clients;
    };

    // 🌟 GET ALL CLIENT IDs
    const clientIds = await getDownlineClients(masterUsername);

    if (clientIds.length === 0) {
      return res.json({
        status: true,
        message: "No clients found under this user",
        data: [],
        total: {
          total_debit: "0.00",
          total_credit: "0.00",
          total_commission: "0.00",
          total_balance: "0.00",
        }
      });
    }

    // ACCUMULATORS (ensure they are numbers)
    let finalReport = [];
    let totalDebit = 0;
    let totalCredit = 0;
    let totalCommission = 0;
    let totalBalance = 0;

    // STEP 3: PROCESS EACH CLIENT
    for (const cId of clientIds) {

      // Client commissions
      const [cdata] = await db.query(
        `SELECT Match_comission, session_comission, cassino_comission 
         FROM users WHERE id = ?`,
        [cId]
      );

      const client = cdata[0] || { Match_comission: 0, session_comission: 0, cassino_comission: 0 };

      // Make sure commissions are numbers
      const matchCommissionRate = parseFloat(client.Match_comission) || 0;
      const sessionCommissionRate = parseFloat(client.session_comission) || 0;
      const cassinoCommissionRate = parseFloat(client.cassino_comission) || 0;

      // --------------------- SPORTS LEDGER ---------------------
      const [bets] = await db.query(
        `SELECT gmId, event_name, market_type, bet_amount, win_amount, created_at
         FROM sport_bets 
         WHERE user_id = ? AND gmId IS NOT NULL
         ORDER BY created_at DESC`,
        [cId]
      );

      const grouped = {};

      for (const bet of bets) {
        const gmId = bet.gmId || "unknown";
        // sanitize numeric fields
        const betAmount = parseFloat(bet.bet_amount) || 0;
        const winAmount = parseFloat(bet.win_amount) || 0;
        const marketType = bet.market_type || "";

        if (!grouped[gmId]) {
          grouped[gmId] = {
            gmId: gmId,
            event_name: bet.event_name || "",
            totalDebit: 0,
            totalCredit: 0,
            totalCommission: 0,
            dateTime: bet.created_at || null
          };
        }

        grouped[gmId].totalDebit += betAmount;
        grouped[gmId].totalCredit += winAmount;

        // Commission
        if (marketType === "match1") {
          grouped[gmId].totalCommission += (betAmount * matchCommissionRate) / 100;
        } else if (marketType === "fancy") {
          grouped[gmId].totalCommission += (betAmount * sessionCommissionRate) / 100;
        }
      }

      const sportsData = Object.values(grouped).map((item) => {
        // ensure numbers
        const td = Number(item.totalDebit) || 0;
        const tc = Number(item.totalCredit) || 0;
        const tcomm = Number(item.totalCommission) || 0;
        const creditVal = tc + tcomm;
        const balance = creditVal - td;

        totalDebit += td;
        totalCredit += creditVal;
        totalCommission += tcomm;
        totalBalance += balance;

        return {
          gmId: item.gmId,
          eventName: item.event_name,
          debit: td.toFixed(2),
          credit: creditVal.toFixed(2),
          commission: tcomm.toFixed(2),
          balance: balance.toFixed(2),
          dateTime: item.dateTime,
        };
      });

      finalReport.push(...sportsData);


      // --------------------- CASSINO LEDGER ---------------------
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
        [cId]
      );

      for (const bet of cassinoBets) {
        const totalBet = parseFloat(bet.total_bet) || 0;
        const totalWin = parseFloat(bet.total_win) || 0;

        let commission = 0;
        if (totalBet > totalWin) {
          commission = ((totalBet - totalWin) * cassinoCommissionRate) / 100;
        }

        const creditVal = totalWin + commission;
        const balance = creditVal - totalBet;

        totalDebit += totalBet;
        totalCredit += creditVal;
        totalCommission += commission;
        totalBalance += balance;

        finalReport.push({
          gmId: `Cassino-${bet.game_type}-${bet.bet_date}`,
          eventName: bet.game_type,
          debit: totalBet.toFixed(2),
          credit: creditVal.toFixed(2),
          commission: commission.toFixed(2),
          balance: balance.toFixed(2),
          dateTime: bet.bet_date,
        });
      }
    }

    // FINAL RESPONSE - make sure totals are numbers before toFixed
    return res.json({
      status: true,
      message: "Master ledger fetched successfully",
      data: finalReport,
      total: {
        total_debit: Number(totalDebit || 0).toFixed(2),
        total_credit: Number(totalCredit || 0).toFixed(2),
        total_commission: Number(totalCommission || 0).toFixed(2),
        total_balance: Number(totalBalance || 0).toFixed(2),
      },
    });

  } catch (err) {
    console.error("Master Ledger Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// exports.allMasterReport = async (req, res) => {
//   try {
//     const { user_id } = req.body;

//     if (!user_id) {
//       return res.status(400).json({ status: false, message: "user_id is required" });
//     }

//     // MASTER INFO
//     const [userRows] = await db.query(
//       `SELECT id, role, username FROM users WHERE id = ?`,
//       [user_id]
//     );

//     if (!userRows.length) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     const master = userRows[0];

//     // ONLY ROLE 1–5 CAN SEE DOWNLINE
//     if (master.role >= 6) {
//       return res.status(403).json({ status: false, message: "Not allowed" });
//     }

//     // HELPER: FETCH DIRECT DOWNLINE USERS (BY USERNAME)
//     const getDownlineUsers = async (username) => {
//       const [rows] = await db.query(
//         `SELECT id, username, role FROM users WHERE master_user = ?`,
//         [username]
//       );
//       return rows;
//     };

//     // STEP 1: FETCH ALL AGENTS (ROLE 6) UNDER MASTER
//     const fetchAgents = async (username) => {
//       let result = [];

//       const users = await getDownlineUsers(username);

//       for (const u of users) {
//         if (u.role == 6) {
//           result.push(u);
//         } else {
//           const deeper = await fetchAgents(u.username);
//           result = [...result, ...deeper];
//         }
//       }

//       return result;
//     };

//     const agents = await fetchAgents(master.username);

//     if (!agents.length) {
//       return res.json({
//         status: true,
//         message: "No agents found",
//         data: [],
//         total: {}
//       });
//     }

//     // MAIN FINAL OUTPUT
//     let finalReport = [];

//     // GRAND TOTALS
//     let G_match = 0,
//       G_session = 0,
//       G_total = 0,
//       G_MComm = 0,
//       G_SComm = 0,
//       G_TComm = 0,
//       G_GTotal = 0,
//       G_AShare = 0,
//       G_Balance = 0;

//     // STEP 2: PROCESS EACH AGENT
//     for (const agent of agents) {
//       const agentUsername = agent.username;

//       // FIND ALL CLIENTS UNDER THIS AGENT
//       const [clients] = await db.query(
//         `SELECT id, Match_comission, session_comission, cassino_comission, self_share
//          FROM users 
//          WHERE master_user = ? AND role = 7`,
//         [agentUsername]
//       );

//       // AGENT SUMMARY ACCUMULATORS
//       let M = 0,
//         S = 0,
//         Total = 0,
//         MComm = 0,
//         SComm = 0,
//         TComm = 0,
//         GTotal = 0,
//         AShare = 0,
//         Balance = 0;

//       // STEP 3: PROCESS CLIENTS OF THIS AGENT
//       for (const client of clients) {
//         const cId = client.id;

//         // SPORT BETS
//         const [bets] = await db.query(
//           `SELECT market_type, bet_amount, win_amount
//           FROM sport_bets WHERE user_id = ?`,
//           [cId]
//         );

//         for (const bet of bets) {
//           const betAmt = parseFloat(bet.bet_amount || 0);
//           const winAmt = parseFloat(bet.win_amount || 0);

//           if (bet.market_type === "match1") {
//             const value = winAmt - betAmt;
//             M += value;

//             const comm = (Math.abs(betAmt) * client.Match_comission) / 100;
//             MComm += comm;
//             TComm += comm;
//           }

//           if (bet.market_type === "fancy") {
//             const value = winAmt - betAmt;
//             S += value;

//             const comm = (Math.abs(betAmt) * client.session_comission) / 100;
//             SComm += comm;
//             TComm += comm;
//           }
//         }

//         // CASSINO BETS
//         const [cBets] = await db.query(
//           `SELECT amount, win_amount FROM bets WHERE user_id = ?`,
//           [cId]
//         );

//         for (const b of cBets) {
//           const betAmt = parseFloat(b.amount || 0);
//           const winAmt = parseFloat(b.win_amount || 0);

//           const value = winAmt - betAmt;
//           Total += value;

//           if (betAmt > winAmt) {
//             const comm = ((betAmt - winAmt) * client.cassino_comission) / 100;
//             TComm += comm;
//           }
//         }
//       }

//       // AGENT TOTAL CALCULATION
//       Total = M + S + Total;

//       GTotal = Total + TComm;

//       AShare = (GTotal * agent.self_share) / 100;
//       Balance = GTotal - AShare;

//       // PUSH RESULT FOR THIS AGENT
//       finalReport.push({
//         agent: agentUsername,
//         match: M.toFixed(2),
//         session: S.toFixed(2),
//         total: Total.toFixed(2),
//         MComm: MComm.toFixed(2),
//         SComm: SComm.toFixed(2),
//         TComm: TComm.toFixed(2),
//         GTotal: GTotal.toFixed(2),
//         AShare: AShare.toFixed(2),
//         balance: Balance.toFixed(2),
//         details: agent.id
//       });

//       // ADD TO GRAND TOTAL
//       G_match += M;
//       G_session += S;
//       G_total += Total;
//       G_MComm += MComm;
//       G_SComm += SComm;
//       G_TComm += TComm;
//       G_GTotal += GTotal;
//       G_AShare += AShare;
//       G_Balance += Balance;
//     }

//     // SEND FINAL RESPONSE
//     return res.json({
//       status: true,
//       message: "Agent wise profit/loss",
//       data: finalReport,
//       total: {
//         match: G_match.toFixed(2),
//         session: G_session.toFixed(2),
//         total: G_total.toFixed(2),
//         MComm: G_MComm.toFixed(2),
//         SComm: G_SComm.toFixed(2),
//         TComm: G_TComm.toFixed(2),
//         GTotal: G_GTotal.toFixed(2),
//         AShare: G_AShare.toFixed(2),
//         balance: G_Balance.toFixed(2)
//       }
//     });

//   } catch (err) {
//     console.error("MASTER LEDGER ERROR:", err);
//     return res.status(500).json({ status: false, error: err });
//   }
// };

exports.allMasterReport = async (req, res) => {
  try {
    const { user_id, from_date, to_date, agent_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ status: false, message: "user_id is required" });
    }

    // MASTER INFO
    const [userRows] = await db.query(
      `SELECT id, role, username FROM users WHERE id = ?`,
      [user_id]
    );

    if (!userRows.length) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const master = userRows[0];

    // ONLY ROLE 1–5 CAN SEE DOWNLINE
    if (master.role >= 6) {
      return res.status(403).json({ status: false, message: "Not allowed" });
    }

    // DATE FILTER QUERY
    let dateFilter = "";
    let dateParams = [];

    if (from_date && to_date) {
      dateFilter = " AND created_at BETWEEN ? AND ? ";
      dateParams.push(from_date, to_date);
    } else if (from_date) {
      dateFilter = " AND created_at >= ? ";
      dateParams.push(from_date);
    } else if (to_date) {
      dateFilter = " AND created_at <= ? ";
      dateParams.push(to_date);
    }

    // HELPER: FETCH DIRECT DOWNLINE USERS (BY USERNAME)
    const getDownlineUsers = async (username) => {
      const [rows] = await db.query(
        `SELECT id, username, role, self_share 
         FROM users WHERE master_user = ?`,
        [username]
      );
      return rows;
    };

    // FETCH ALL AGENTS (ROLE 6)
    const fetchAgents = async (username) => {
      let result = [];

      const users = await getDownlineUsers(username);

      for (const u of users) {
        if (u.role == 6) {
          result.push(u);
        } else {
          const deeper = await fetchAgents(u.username);
          result = [...result, ...deeper];
        }
      }

      return result;
    };

    let agents = await fetchAgents(master.username);

    // 🔥 FILTER ONLY ONE AGENT IF agent_id PROVIDED
    if (agent_id) {
      agents = agents.filter((a) => a.id == agent_id);
    }

    if (!agents.length) {
      return res.json({
        status: true,
        message: "No agents found",
        data: [],
        total: {}
      });
    }

    // MAIN OUTPUT
    let finalReport = [];

    // GRAND TOTALS
    let G_match = 0,
      G_session = 0,
      G_total = 0,
      G_MComm = 0,
      G_SComm = 0,
      G_TComm = 0,
      G_GTotal = 0,
      G_AShare = 0,
      G_Balance = 0;

    // PROCESS EACH AGENT
    for (const agent of agents) {
      const agentUsername = agent.username;

      // FIND CLIENTS OF AGENT
      const [clients] = await db.query(
        `SELECT id, Match_comission, session_comission, cassino_comission, self_share 
         FROM users 
         WHERE master_user = ? AND role = 7`,
        [agentUsername]
      );

      // AGENT SUMMARY
      let M = 0,
        S = 0,
        Total = 0,
        MComm = 0,
        SComm = 0,
        TComm = 0,
        GTotal = 0,
        AShare = 0,
        Balance = 0;

      // PROCESS CLIENTS
      for (const client of clients) {
        const cId = client.id;

        // SPORTS BETS WITH DATE FILTER
        const [bets] = await db.query(
          `SELECT market_type, bet_amount, win_amount
           FROM sport_bets 
           WHERE user_id = ? ${dateFilter}`,
          [cId, ...dateParams]
        );

        for (const bet of bets) {
          const betAmt = parseFloat(bet.bet_amount || 0);
          const winAmt = parseFloat(bet.win_amount || 0);

          if (bet.market_type === "match1") {
            const value = winAmt - betAmt;
            M += value;

            const comm = (Math.abs(betAmt) * client.Match_comission) / 100;
            MComm += comm;
            TComm += comm;
          }

          if (bet.market_type === "fancy") {
            const value = winAmt - betAmt;
            S += value;

            const comm = (Math.abs(betAmt) * client.session_comission) / 100;
            SComm += comm;
            TComm += comm;
          }
        }

        // CASSINO BETS WITH DATE FILTER
        const [cBets] = await db.query(
          `SELECT amount, win_amount 
           FROM bets 
           WHERE user_id = ? ${dateFilter}`,
          [cId, ...dateParams]
        );

        for (const b of cBets) {
          const betAmt = parseFloat(b.amount || 0);
          const winAmt = parseFloat(b.win_amount || 0);

          const value = winAmt - betAmt;
          Total += value;

          if (betAmt > winAmt) {
            const comm = ((betAmt - winAmt) * client.cassino_comission) / 100;
            TComm += comm;
          }
        }
      }

      // FINAL AGENT CALC
      Total = M + S + Total;

      GTotal = Total + TComm;

      AShare = (GTotal * agent.self_share) / 100;

      Balance = GTotal - AShare;

      // AGENT RESULT
      finalReport.push({
        agent: agentUsername,
        match: M.toFixed(2),
        session: S.toFixed(2),
        total: Total.toFixed(2),
        MComm: MComm.toFixed(2),
        SComm: SComm.toFixed(2),
        TComm: TComm.toFixed(2),
        GTotal: GTotal.toFixed(2),
        AShare: AShare.toFixed(2),
        balance: Balance.toFixed(2),
        details: agent.id
      });

      // GRAND TOTALS
      G_match += M;
      G_session += S;
      G_total += Total;
      G_MComm += MComm;
      G_SComm += SComm;
      G_TComm += TComm;
      G_GTotal += GTotal;
      G_AShare += AShare;
      G_Balance += Balance;
    }

    // SEND RESPONSE
    return res.json({
      status: true,
      message: "Agent wise profit/loss",
      data: finalReport,
      total: {
        match: G_match.toFixed(2),
        session: G_session.toFixed(2),
        total: G_total.toFixed(2),
        MComm: G_MComm.toFixed(2),
        SComm: G_SComm.toFixed(2),
        TComm: G_TComm.toFixed(2),
        GTotal: G_GTotal.toFixed(2),
        AShare: G_AShare.toFixed(2),
        balance: G_Balance.toFixed(2)
      }
    });

  } catch (err) {
    console.error("MASTER REPORT ERROR:", err);
    return res.status(500).json({ status: false, error: err });
  }
};

exports.getDownlineAgents = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const [userData] = await db.query(
      "SELECT username FROM users WHERE id = ?",
      [userId]
    );

    if (userData.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const mainUsername = userData[0].username;

    const [agents] = await db.query(
      `WITH RECURSIVE user_tree AS (
          SELECT id, name, username, role, master_user
          FROM users
          WHERE master_user = ?

          UNION ALL

          SELECT u.id, u.name, u.username, u.role, u.master_user
          FROM users u
          INNER JOIN user_tree t ON u.master_user = t.username
      )
      SELECT * FROM user_tree WHERE role = 6`,
      [mainUsername]
    );

    return res.json({
      success: true,
      totalAgents: agents.length,
      agents
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getBetsByType = async (req, res) => {
  try {
    const { userId, type, gmId } = req.body;

    if (!userId || !type) {
      return res.status(400).json({
        status: false,
        message: "userId & type are required"
      });
    }
    const [u] = await db.query("SELECT role FROM users WHERE id = ?", [userId]);
    if (u.length === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const role = u[0].role;

    let userIds = [];
    if (role == 1) {
      const [all] = await db.query("SELECT id FROM users");
      userIds = all.map(x => x.id);
    }

    else if (role >= 2 && role <= 6) {
      userIds = await getDownlineUsers(userId);
    }

    else if (role == 7) {
      userIds = [userId];
    }

    if (userIds.length === 0) userIds = [-1];

    const [bets] = await db.query(
      `SELECT 
         sport_bets.*,
         users.username,
         CASE 
            WHEN sport_bets.market_type = 'match1' THEN 'bookmaker'
            WHEN sport_bets.market_type = 'fancy' THEN 'session'
            ELSE sport_bets.market_type
         END AS type
       FROM sport_bets
       LEFT JOIN users ON users.id = sport_bets.user_id
       WHERE sport_bets.market_type = ? AND sport_bets.gmId = ?
       AND sport_bets.user_id IN (?)
       ORDER BY sport_bets.id DESC`,
      [type, gmId, userIds]
    );

    return res.status(200).json({
      status: true,
      message: "Bets fetched successfully",
      role: role,
      users: userIds.length,
      data: bets
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message
    });
  }
};

// exports.updateBetStatus = async (req, res) => {
//   try {
//     const { username, type } = req.query;

//     if (!username || !type)
//       return res.status(400).json({ success: false, msg: "All fields required" });

//     const [user] = await db.query(
//       "SELECT id, username, role, matchBet, sessionBet, casinoBet, forcedBlock FROM users WHERE username = ?",
//       [username]
//     );

//     if (!user.length) return res.status(404).json({ success: false, msg: "User not found" });

//     const userData = user[0];

    
//     if (userData.forcedBlock == 1) {
//       return res.status(403).json({
//         success: false,
//         msg: "You cannot unblock because your parent user has blocked it",
//       });
//     }

//     let column = "";
//     if (type == 1) column = "matchBet";
//     else if (type == 2) column = "sessionBet";
//     else if (type == 3) column = "casinoBet";
//     else if (type == 4) column = "all";

//     const toggleValue = (current) => (current == 1 ? 0 : 1);
//     let newValue = 0;
//     let isBlocking = false;

//     if (column !== "all") {
//       newValue = toggleValue(userData[column]);
//       isBlocking = newValue === 1;
//     }

//     // Get full tree below the user
//     const [tree] = await db.query(`
//       WITH RECURSIVE user_tree AS (
//         SELECT id, username, master_user
//         FROM users
//         WHERE username = ?

//         UNION ALL

//         SELECT u.id, u.username, u.master_user
//         FROM users u
//         INNER JOIN user_tree t ON u.master_user = t.username
//       )
//       SELECT id FROM user_tree;
//     `, [username]);

//     const userIds = tree.map((row) => row.id);

//     // If blocking -> forceBlock = 1 for all subtree
//     // If unblocking -> forceBlock = 0 for all subtree
//     const forceValue = isBlocking ? 1 : 0;

//     if (column === "all") {
//       await db.query(
//         `UPDATE users SET 
//           matchBet = CASE WHEN matchBet = 1 THEN 0 ELSE 1 END,
//           sessionBet = CASE WHEN sessionBet = 1 THEN 0 ELSE 1 END,
//           casinoBet = CASE WHEN casinoBet = 1 THEN 0 ELSE 1 END,
//           forcedBlock = ?
//         WHERE id IN (${userIds.join(",")})`,
//         [forceValue]
//       );
//     } else {
//       await db.query(
//         `UPDATE users SET ${column} = ?, forcedBlock = ? WHERE id IN (${userIds.join(",")})`,
//         [newValue, forceValue]
//       );
//     }

//     res.json({
//       success: true,
//       msg: isBlocking ? "Blocked successfully" : "Unblocked successfully",
//       affectedUsers: userIds.length,
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, msg: "Internal server error" });
//   }
// };

exports.updateBetStatus = async (req, res) => {
  try {
    const { username, userId, type } = req.query;

    if (!username || !userId || !type) {
      return res.status(400).json({
        success: false,
        msg: "username, userId & type required",
      });
    }

    // Logged in user
    const [cu] = await db.query(
      "SELECT id, role FROM users WHERE id = ?",
      [userId]
    );
    if (!cu.length)
      return res.status(404).json({ success: false, msg: "Logged user not found" });

    const loggedUser = cu[0];

    // Target user
    const [u] = await db.query(
      "SELECT id, username, role, blockedLevel, matchBet, sessionBet, casinoBet FROM users WHERE username = ?",
      [username]
    );
    if (!u.length)
      return res.status(404).json({ success: false, msg: "User not found" });

    const target = u[0];

    // Type mapping
    let column = "";
    if (type == 1) column = "matchBet";
    else if (type == 2) column = "sessionBet";
    else if (type == 3) column = "casinoBet";
    else if (type == 4) column = "all";
    else return res.status(400).json({ success: false, msg: "Invalid type" });

    // ----------------------------------------
    // 🔓 UNBLOCK LOGIC
    // ----------------------------------------
    if (target.blockedLevel > 0) {
      if (loggedUser.role > target.blockedLevel) {
        return res.status(403).json({
          success: false,
          msg: "You cannot unblock because upper level user blocked it",
        });
      }

      let unblockSQL = "";
      if (column === "all") {
        unblockSQL = `
          matchBet = 1,
          sessionBet = 1,
          casinoBet = 1,
          blockedLevel = 0
        `;
      } else {
        unblockSQL = `
          ${column} = 1
        `;
      }

      await db.query(
        `
        UPDATE users SET ${unblockSQL}
        WHERE id IN (
          WITH RECURSIVE child AS (
            SELECT id FROM users WHERE username = ?
            UNION ALL
            SELECT u.id FROM users u
            INNER JOIN child c ON u.master_user = c.id
          )
          SELECT id FROM child
        )
      `,
        [username]
      );

      return res.json({ success: true, msg: "Unblocked successfully" });
    }

    // ----------------------------------------
    // 🔒 BLOCK LOGIC
    // ----------------------------------------
    const blockerLevel = loggedUser.role;

    let blockSQL = "";
    if (column === "all") {
      blockSQL = `
        matchBet = 0,
        sessionBet = 0,
        casinoBet = 0,
        blockedLevel = ${blockerLevel}
      `;
    } else {
      blockSQL = `
        ${column} = 0,
        blockedLevel = ${blockerLevel}
      `;
    }

    await db.query(
      `
      UPDATE users 
      SET ${blockSQL}
      WHERE id IN (
        WITH RECURSIVE child AS (
          SELECT id FROM users WHERE username = ?
          UNION ALL
          SELECT u.id FROM users u
          INNER JOIN child c ON u.master_user = c.id
        )
        SELECT id FROM child
      )
    `,
      [username]
    );

    return res.json({ success: true, msg: "Blocked successfully" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

exports.getBetHistoryByUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        msg: "user_id is required",
      });
    }

    // -------------------------
    // 1️⃣ Fetch SPORTS BET HISTORY
    // -------------------------
    const [sports] = await db.query(
      "SELECT id, user_id, event_id, event_name, market_id, market_name, market_type, bet_amount, actual_bet_amount, win_amount, bet_status, bet_message, status, created_at, bet_value, bet_choice, gmId, bet_size, will_win, will_loss FROM sport_bets WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    // Group sports bets by gmId
    const sportsGrouped = {};

    sports.forEach(bet => {
      const gmId = bet.gmId;
      const event_name = bet.event_name;

      if (!sportsGrouped[gmId]) {
        sportsGrouped[gmId] = {
          type: "sports",
          gmId,
          event_name,
          total_bet_amount: 0,
          total_win_amount: 0,
          total_loss_amount: 0,
          total_bets: 0,
          bets: []
        };
      }

      sportsGrouped[gmId].total_bet_amount += Number(bet.bet_amount || 0);
      sportsGrouped[gmId].total_win_amount += Number(bet.will_win || 0);
      sportsGrouped[gmId].total_loss_amount += Number(bet.will_loss || 0);
      sportsGrouped[gmId].total_bets += 1;
      sportsGrouped[gmId].bets.push(bet);
    });

    // -------------------------
    // 2️⃣ Fetch CASINO BET HISTORY
    // -------------------------
    const [casino] = await db.query(
      "SELECT id, user_id, game_type, game_type AS event_name, game_type AS gmId, match_id, bet_choice, amount AS actual_bet_amount, status AS bet_status, bet_value, result, win_amount AS will_win, type, created_at FROM bets WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );
    
    
    //  const [casino] = await db.query(
    //   "SELECT id, user_id, game_type, match_id, bet_choice, amount, status, bet_value, result, win_amount, type, created_at FROM bets WHERE user_id = ? ORDER BY created_at DESC",
    //   [user_id]
    // );
    

    // Group casino bets by game_type + date
    const casinoGrouped = {};

    casino.forEach(bet => {

      const gameType = bet.game_type;
      const date = bet.created_at.toISOString().substring(0, 10); // YYYY-MM-DD

      const groupKey = `${gameType}_${date}`;

      if (!casinoGrouped[groupKey]) {
        casinoGrouped[groupKey] = {
          type: "casino",
          game_type: gameType,
          date: date,
          total_bet_amount: 0,
          total_win_amount: 0,
          total_loss_amount: 0,
          total_bets: 0,
          bets: []
        };
      }

      casinoGrouped[groupKey].total_bet_amount += Number(bet.amount || 0);
      casinoGrouped[groupKey].total_win_amount += Number(bet.win_amount || 0);
      casinoGrouped[groupKey].total_loss_amount += bet.status === "lost" ? Number(bet.amount) : 0;
      casinoGrouped[groupKey].total_bets += 1;

      casinoGrouped[groupKey].bets.push(bet);
    });

    // -------------------------
    // 3️⃣ Merge both histories
    // -------------------------

    const finalResponse = [
      ...Object.values(sportsGrouped),
      ...Object.values(casinoGrouped)
    ];

    return res.json({
      success: true,
      msg: "Bet history fetched successfully",
      data: finalResponse,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: err.message,
    });
  }
};

exports.getBetSettings = async (req, res) => {
  try {
    const [settingsRows] = await db.query("SELECT * FROM tbl_bet_setting LIMIT 1");

    if (!settingsRows.length) {
      return res.status(404).json({
        success: false,
        message: "Bet settings not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: settingsRows[0],
    });
  } catch (err) {
    console.error("❌ getBetSettings Error:", err.message);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.updateBetSettings = async (req, res) => {
  try {
    const { casino_min_max, fancy_min_max, bookmaker_min_max } = req.body;

    if (!casino_min_max || !fancy_min_max || !bookmaker_min_max) {
      return res.status(400).json({
        success: false,
        message: "casino_min_max, fancy_min_max, and bookmaker_min_max are required",
      });
    }

    try {
      JSON.parse(casino_min_max);
      JSON.parse(fancy_min_max);
      JSON.parse(bookmaker_min_max);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in min/max fields",
      });
    }

    const [settingsRows] = await db.query("SELECT * FROM tbl_bet_setting LIMIT 1");

    if (!settingsRows.length) {
      return res.status(404).json({ success: false, message: "Bet settings not found" });
    }

    const settingsId = settingsRows[0].id;

    await db.query(
      "UPDATE tbl_bet_setting SET casino_min_max = ?, fancy_min_max = ?, bookmaker_min_max = ? WHERE id = ?",
      [casino_min_max, fancy_min_max, bookmaker_min_max, settingsId]
    );

    return res.status(200).json({
      success: true,
      message: "Bet settings updated successfully",
    });
  } catch (err) {
    console.error("❌ updateBetSettings Error:", err.message);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.updateSelfAmount = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: " Amount is required"
      });
    }

    await db.query(
      "UPDATE users SET self_amount_limit = self_amount_limit + ? WHERE id = ?",
      [amount, '1']
    );

    return res.status(200).json({
      success: true,
      message: "Self amount updated successfully",
      data: {
        added_amount: amount
      }
    });

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.updateWelcomeMessage = async (req, res) => {
  try {
    const { welcomMsg } = req.body;

    if (!welcomMsg) {
      return res.status(400).json({
        success: false,
        message: "welcomMsg is required"
      });
    }

    const [update] = await db.query(
      "UPDATE tbl_setting SET welcomMsg = ? WHERE id = 1",
      [welcomMsg]
    );

    return res.status(200).json({
      success: true,
      message: "Welcome message updated successfully",
      updated_value: welcomMsg
    });

  } catch (error) {
    console.log("❌ updateWelcomeMessage Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};









