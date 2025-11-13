const axios = require("axios");

const BASE_URL = "https://diamond-api-v2.scoreswift.xyz";
const API_KEY = "ALdmzeQOo8ddhdhP4QWn_v34"; // put your key here

// GET /api/score?gtv=0&sid=1
exports.getScore = async (req, res) => {
  try {
    // take gtv and sid from query params, fallback default
    const { gtv = 0, sid = 1 } = req.query;

    const options = {
      method: "GET",
      url: `${BASE_URL}/score`,
      params: {
        key: API_KEY, // auth
        gtv,          // required param
        sid           // required param
      },
      headers: {
        Accept: "*/*"
      }
    };

    const { data } = await axios.request(options);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("❌ Error fetching score:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch score",
      error: error.message
    });
  }
};
