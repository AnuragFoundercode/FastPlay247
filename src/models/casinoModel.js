// models/casinoModel.js
const axios = require("axios");
const BASE_URL = "http://164.52.216.63:3009";
const API_KEY = "ALdmzeQOo8ddhdhP4QWn_v34"; 


const fetchCasinoTable = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/casino/tableid`, {
      params: { key: API_KEY }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCasinoData = async (type) => {
  try {
    const response = await axios.get(`${BASE_URL}/casino/data`, {
      params: { type, key: API_KEY }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCasinoResult = async (type) => {
  try {
    const response = await axios.get(`${BASE_URL}/casino/result`, {
      params: { type, key: API_KEY }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCasinoDetailResult = async (type, mid) => {
  try {
    const response = await axios.get(`${BASE_URL}/casino/detail_result`, {
      params: { type, mid, key: API_KEY }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const BASE_URLS = "https://live.cricketid.xyz/casino-tv?id=";

const getCasinoIframeUrl = async (casinoId) => {
  if (!casinoId) {
    throw new Error("Casino ID is required");
  }

  const iframeHtml = `<iframe src="${BASE_URLS}${casinoId}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  return { success: true, iframe: iframeHtml };
};





// ✅ Export functions
module.exports = {
  fetchCasinoTable,
  getCasinoData,
  getCasinoResult,
  getCasinoDetailResult,
  getCasinoIframeUrl
};
