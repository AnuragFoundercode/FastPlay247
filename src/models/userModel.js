const db = require("../config/db");

class User {
  static async findByUsername(username) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows[0];
  }
  
   static async findById(user_id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
    return rows[0];
  }

  static async updatePassword(user_id, newPassword) {
    await db.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, user_id]);
  }

//   static async findByUsername(username) {
//     const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
//     return rows[0];
//   }

static async getAll() {
    const [rows] = await db.query("SELECT * FROM rules");
    return rows;
  }
  
  static async getById(user_id) {
        const [rows] = await db.query(
            'SELECT id,self_amount_limit AS wallet, token FROM users WHERE id = ?',
            [user_id]
        );
        return rows[0];
    }
  
  /// login////
  
//   static async findByUsername(username) {
//   const [rows] = await db.query(
//     "SELECT * FROM users WHERE username = ?",
//     [username]
//   );
//   return rows[0];
// }

  static async updateToken(userId, token) {
    await db.query('UPDATE users SET token = ? WHERE id = ?', [token, userId]);
    // Return updated user
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
  }
  ///end login///
  
    static async updateRule(id, description) {
  const sql = "UPDATE rules SET description = ? WHERE id = ?";
  try {
    const [result] = await db.query(sql, [description, id]);
    return result;
  } catch (err) {
    throw new Error("DB Update Error: " + err.message);
  }
}

  
}

module.exports = User;
