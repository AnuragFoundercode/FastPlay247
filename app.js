const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Routes
const sportRoutes = require("./src/routes/sportRoutes");
const casinoRoutes = require("./src/routes/casinoRoutes");
const userRoutes = require("./src/routes/apiRoutes");
const betRoutes = require("./src/routes/betRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const { login } = require("./src/controllers/userController");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001", 
  "https://fastplay247.net",
  "https://admin.fastplay247.net"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("Not allowed by CORS"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);


app.use("/api/bet", betRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/casino", casinoRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

app.post("/api/login", login);

app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});