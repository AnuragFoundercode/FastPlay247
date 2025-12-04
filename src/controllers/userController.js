const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = require("../models/userModel");
const crypto = require('crypto');


// ✅ Safe User Login
async function userLogin_13_10_2025(req, res) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and Password required" });
  }

  let user;
  try {
    user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Username" });
    }
  } catch (err) {
    console.error("DB fetch error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }

  // Status check
  if (user.status === 0) {
    return res
      .status(403)
      .json({ success: false, message: "Your account has been blocked." });
  }

  // Password check
  if (user.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid Password" });
  }

  // Remove password
  const { password: _, ...userData } = user;

  // ✅ Generate new token with timestamp for uniqueness
  const token = jwt.sign(
    { ...userData, loginAt: Date.now() },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  try {
    // Update token in DB
    await db.query("UPDATE users SET token = ? WHERE id = ?", [token, user.id]);
  } catch (dbErr) {
    console.error("DB update error:", dbErr);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }

  // ✅ Regenerate session safely and use async/await wrapper
  await new Promise((resolve, reject) => {
    req.session.regenerate(err => {
      if (err) return reject(err);
      req.session.user = { id: user.id, username: user.username };
      resolve();
    });
  }).catch(err => {
  //  console.error("Session regenerate error:", err);
    return res.status(500).json({ success: false, message: "Session error" });
  });

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // production me true
    maxAge: 24 * 60 * 60 * 1000,
  });
//console.log("user",user);
  return res.json({
    success: true,
    message: "Login successful",
    user: userData,
    userAllData : user
  });
}

const generateRandomToken = () => {
  const length = Math.floor(Math.random() * 6) + 20; // 20-25 length
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};




const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required." });
    }

   const user = await User.findByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    
    if(user.status===0){
        return res.status(400).json({ message: "Your profile has been deactivated. Please connect with the provider.." });
   
    }

    const token = generateRandomToken();
    const updatedUser = await User.updateToken(user.id, token);
// console.log(user);
    res.json({
        success: true,
        message: "Login successful",
        userId: updatedUser.id,
        role: updatedUser.role,
        token: updatedUser.token,
        userName : user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Change Password
async function changePassword(req, res) {
  const { user_id, old_password, new_password, confirm_new_password } = req.body || {};

  if (!user_id || !old_password || !new_password || !confirm_new_password) {
    return res.status(400).json({
      success: false,
      message: "user_id, old_password, new_password and confirm_new_password are required"
    });
  }

  if (new_password !== confirm_new_password) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match"
    });
  }

  try {
    // Fetch user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check old password
    if (user.password !== old_password) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    // Update password
    await User.updatePassword(user_id, new_password);

    return res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    // console.error("Change password error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


async function getRules(req, res) {
  try {
    const rules = await User.getAll();
    return res.json({
      success: true,
      data: rules
    });
  } catch (error) {
   // console.error("Get Rules Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}


//export const updateRuleController = async (req, res) => {
async function updateRuleController(req, res){
  const { id, description } = req.body;

  // 🧩 Validate input
  if (!id || !description) {
    return res.status(400).json({
      message: "Both 'id' and 'description' fields are required.",
    });
  }

  try {
    // 🧠 Update using model
    const result = await User.updateRule(id, description);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "No rule found with the given ID.",
      });
    }

    return res.status(200).json({
      message: "Rule updated successfully ✅",
      data: { id, description },
    });
  } catch (error) {
  //  console.error("❌ Error updating rule:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
//profile view api///


async function viewProfile(req, res) {
  const { user_id } = req.params;

  try {
    const userData = await User.getById(user_id);
    const user = Array.isArray(userData) ? userData[0] : userData;

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 1️⃣ Get pending exposure from sport_bets
    const [sportExpoResult] = await db.query(
      `SELECT 
    SUM(
        CASE 
            WHEN market_type = 'match1' THEN will_loss
            WHEN market_type = 'fancy' THEN will_loss
            ELSE 0
        END
    ) AS sport_expo
FROM sport_bets
WHERE bet_status = 'pending' 
  AND user_id = ?;`,
      [user_id]
    );

    const sportExposure = parseFloat(sportExpoResult[0]?.sport_expo || 0);

    // 2️⃣ Get pending exposure from bets (casino bets)
    const [casinoExpoResult] = await db.query(
      `SELECT SUM(amount) AS casino_expo 
       FROM bets 
       WHERE status = 'pending' AND user_id = ?`,
      [user_id]
    );

    const casinoExposure = parseFloat(casinoExpoResult[0]?.casino_expo || 0);

    // 3️⃣ Calculate total exposure
    const totalExposure = sportExposure + casinoExposure;

    // 4️⃣ Add exposure to user profile
    const profile = { ...user, exposure: totalExposure };

    return res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("❌ Error in viewProfile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


async function changeStatus(req, res) {
  const { id } = req.body;

  try {
    const [userData] = await db.query("SELECT status FROM users WHERE id = ?", [id]);
    const user = userData[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newStatus = user.status === 1 ? 0 : 1;

    await db.query("UPDATE users SET status = ? WHERE id = ?", [newStatus, id]);

    return res.json({
      success: true,
      message: "User status updated successfully",
      data: {
        id,
        old_status: user.status,
        new_status: newStatus,
      },
    });
  } catch (error) {
    console.error("Error in changeStatus:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


module.exports = { login,changePassword,getRules,viewProfile,updateRuleController,changeStatus };
