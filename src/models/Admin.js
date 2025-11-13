const db = require("../config/db");
const moment = require("moment-timezone");


class Admin {
  static async getDownlineUsers(id, role) {
    try {
      // ✅ Define MLM role hierarchy
      const roleMap = {
        1: [2, 3, 4, 5, 6], // Admin can see all
        2: [3, 4, 5, 6],
        3: [4, 5, 6],
        4: [5, 6],
        5: [6],
        6: [],
      };

      const allowedRoles = roleMap[role] || [];

      // ✅ Step 1: Get self info
      const [selfRows] = await db.query(
        `SELECT id, name, image, username, mobile, email, password, wallet, dob, gender, role, token, master_user,
                self_amount_limit, self_share, Match_comission, cassino_comission, session_comission, status, created_at, updated_at
         FROM users WHERE id = ?`,
        [id]
      );

      let allUsers = [...selfRows]; 

      if (allowedRoles.length > 0) {
        let downlineQuery = "";
        let params = [];

        if (role === 1) {
          // Admin → get all role 2–6
          downlineQuery = `SELECT id, name, image, username, mobile, email, password, wallet, dob, gender, role, token, master_user,
                                  self_amount_limit, self_share, Match_comission, cassino_comission, session_comission, status, created_at, updated_at
                           FROM users WHERE role IN (?)`;
          params = [allowedRoles];
        } else {
          // Other roles → only their direct downline
          downlineQuery = `SELECT id, name, image, username, mobile, email, password, wallet, dob, gender, role, token, master_user,
                                  self_amount_limit, self_share, Match_comission, cassino_comission, session_comission, status, created_at, updated_at
                           FROM users WHERE role IN (?) AND master_user = ?`;
          params = [allowedRoles, id];
        }

        const [downlineRows] = await db.query(downlineQuery, params);
        allUsers = [...selfRows, ...downlineRows];
      }

      return allUsers;
    } catch (error) {
      console.error("Error fetching downline users:", error);
      throw error;
    }
  }
  
    static async downUserList(id, role) {
      try {
        const sql = `WITH RECURSIVE user_hierarchy AS ( SELECT id, name, image, username, mobile, email, password, wallet, dob, gender, role, token, master_user, self_amount_limit, self_share, Match_comission, cassino_comission, session_comission, status, created_at, updated_at FROM users WHERE id = ? AND role = ? UNION ALL SELECT u.id, u.name, u.image, u.username, u.mobile, u.email, u.password, u.wallet, u.dob, u.gender, u.role, u.token, u.master_user, u.self_amount_limit, u.self_share, u.Match_comission, u.cassino_comission, u.session_comission, u.status, u.created_at, u.updated_at FROM users u INNER JOIN user_hierarchy h ON u.master_user = h.username ) SELECT * FROM user_hierarchy;`;
    
        const [rows] = await db.query(sql, [id, role]);
        return rows;
      } catch (error) {
        console.error("Error fetching downline users:", error);
        throw error;
      }
    }


    static async create(data) {
    const query = `
      INSERT INTO users (
        name, username, password, master_user, self_amount_limit, self_share,role,
        Match_comission, session_comission, cassino_comission, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, NOW(), NOW())
    `;
    const values = [
      data.name,
      data.username,
      data.password,
      data.master_user,
      data.self_amount_limit,
      data.self_share,
      data.role,
      data.Match_comission,
      data.session_comission,
      data.cassino_comission
    ];

    const [result] = await db.query(query, values);
    return result.insertId;
  }

    static async getMasterUserLimit(masterUserId) {
    const [rows] = await db.query(
      "SELECT self_amount_limit FROM users WHERE username = ?",
      [masterUserId]
    );
    return rows.length > 0 ? rows[0].self_amount_limit : null;
  }
  
    // static async updateSelfLimit(masterId, newLimit) {
    //   await db.query(
    //     "UPDATE users SET self_amount_limit = ?, updated_at = NOW() WHERE username = ?",
    //     [newLimit, masterId]
    //   );
    // }



   // get all users of a role
  static async getUsersByRole(role) {
    const [rows] = await db.query('SELECT id FROM users WHERE role = ?', [role]);
    return rows.map(r => r.id);
  }

  // BFS: get all subtree users under root ids
  static async getSubtreeUserIds(rootIds = []) {
    if (!rootIds || rootIds.length === 0) return [];
    const resultIds = new Set(rootIds.map(id => Number(id)));
    let frontier = [...resultIds];

    while (frontier.length) {
      const placeholders = frontier.map(() => '?').join(',');
      const sql = `SELECT id FROM users WHERE master_user IN (${placeholders})`;
      const [rows] = await db.query(sql, frontier);
      frontier = [];
      for (const r of rows) {
        const id = Number(r.id);
        if (!resultIds.has(id)) {
          resultIds.add(id);
          frontier.push(id);
        }
      }
    }
    return Array.from(resultIds);
  }

  // helper to format date as YYYY-MM-DD
  static _formatDate(dt) {
    const d = new Date(dt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  // main ledger generator
  static async getLedgerData(roleid, fromDate = null, toDate = null) {
    try {
      let scopeUserIds = [];

      // 1️⃣ get users based on role
      if (roleid === 1) {
        const [allUsers] = await db.query('SELECT id FROM users');
        scopeUserIds = allUsers.map(u => u.id);
      } else if (roleid >= 2 && roleid <= 6) {
        const rootIds = await this.getUsersByRole(roleid);
        if (!rootIds || rootIds.length === 0) return { ledger: [], total_credit: 0, total_debit: 0, closing_balance: 0 };
        scopeUserIds = await this.getSubtreeUserIds(rootIds);
      } else {
        return { ledger: [], total_credit: 0, total_debit: 0, closing_balance: 0 };
      }

      if (!scopeUserIds || scopeUserIds.length === 0) return { ledger: [], total_credit: 0, total_debit: 0, closing_balance: 0 };

      // 2️⃣ date filter
      let dateFilter = '';
      let dateParams = [];
      if (fromDate && toDate) {
        dateFilter = ' AND DATE(created_at) BETWEEN ? AND ? ';
        dateParams = [this._formatDate(fromDate), this._formatDate(toDate)];
      }

      // 3️⃣ bets
      const [betsRows] = await db.query(`
        SELECT user_id, DATE(created_at) AS date, game_type AS game_type,
               SUM(COALESCE(amount,0)) AS total_bet_amount,
               SUM(COALESCE(win_amount,0)) AS total_win_amount
        FROM bets
        WHERE user_id IN (?) AND result != 'pending' ${dateFilter}
        GROUP BY user_id, DATE(created_at), game_type
        ORDER BY DATE(created_at) DESC
      `, [[...scopeUserIds], ...dateParams]);

      // 4️⃣ sport bets
      const [sportsRows] = await db.query(`
        SELECT user_id, DATE(created_at) AS date,
               CONCAT(event_name,' / ',market_name) AS game_type,
               SUM(COALESCE(bet_amount,0)) AS total_bet_amount,
               SUM(COALESCE(win_amount,0)) AS total_win_amount
        FROM sport_bets
        WHERE user_id IN (?) AND bet_status != 'pending' ${dateFilter}
        GROUP BY user_id, DATE(created_at), event_name, market_name
        ORDER BY DATE(created_at) DESC
      `, [[...scopeUserIds], ...dateParams]);

      // 5️⃣ combine rows
      const combined = [...betsRows, ...sportsRows];
      if (combined.length === 0) return { ledger: [], total_credit: 0, total_debit: 0, closing_balance: 0 };

      // 6️⃣ collapse by user+date+game_type
      const map = {};
      for (const row of combined) {
        const key = `${row.user_id}||${row.date}||${row.game_type}`;
        if (!map[key]) map[key] = { user_id: row.user_id, date: this._formatDate(row.date), remark: row.game_type, total_bet_amount: 0, total_win_amount: 0 };
        map[key].total_bet_amount += Number(row.total_bet_amount || 0);
        map[key].total_win_amount += Number(row.total_win_amount || 0);
      }

      // 7️⃣ calculate ledger
      const ledgerEntries = [];
      for (const k of Object.keys(map)) {
        const r = map[k];
        const bet = r.total_bet_amount;
        const win = r.total_win_amount;

        let credit = 0, debit = 0, winner = 'draw', balance = 0;

        if (win > bet) {
          debit = Number((win - bet).toFixed(2));
          credit = 0;
          winner = 'loss';
          balance = debit;
        } else if (win < bet) {
          credit = Number((bet - win).toFixed(2));
          debit = 0;
          winner = 'won';
          balance = credit;
        } else {
          credit = 0; debit = 0; winner = 'draw'; balance = 0;
        }

        ledgerEntries.push({
          date: r.date,
          user_id: r.user_id,
          remark: r.remark,
          credit,
          debit,
          balance,
          winner
        });
      }

      // 8️⃣ totals
      const total_credit = ledgerEntries.reduce((s,it)=>s+Number(it.credit||0),0);
      const total_debit = ledgerEntries.reduce((s,it)=>s+Number(it.debit||0),0);
      const closing_balance = Math.abs(total_debit - total_credit);

      return { ledger: ledgerEntries, total_credit, total_debit, closing_balance };
    } catch (err) {
      console.error('Admin.getLedgerData error:', err);
      throw err;
    }
  }
 }
  //end My ledger show ////

module.exports = Admin;
