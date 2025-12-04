const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

router.get("/downline", AdminController.getDownline);

router.post("/getDownUserList", AdminController.getDownUserList);
router.post("/create", AdminController.createAdmin);
router.post("/updateAdmin", AdminController.updateAdmin);
router.post('/my_ledger', AdminController.getLedger);
router.post('/myLedgerReport', AdminController.myLedgerReport);
router.get('/ledgerReport', AdminController.ledgerReport);
router.post('/updateUserLimit', AdminController.updateUserLimit);
router.post('/getSportBetHistory', AdminController.getSportBetHistory);
router.post('/getCasinoBetHistory', AdminController.getCasinoBetHistory);
router.post('/updateWallet', AdminController.updateWallet);
router.post('/myStatement', AdminController.myStatement);
router.post('/clientLedger', AdminController.clientLedger);
router.post('/clientCommissionReport', AdminController.clientCommissionReport);
router.post('/getFirstDownline', AdminController.getFirstDownline);
router.post('/getUserSummary', AdminController.getUserSummary);
router.post('/getAllBetHistory', AdminController.getAllBetHistory);
router.get('/welcomMsg', AdminController.welcomMsg);
router.post('/masterProfitLoss', AdminController.masterProfitLoss);
router.post('/allMasterReport', AdminController.allMasterReport);
router.get('/getDownlineAgents', AdminController.getDownlineAgents);
router.post('/getBetsByType', AdminController.getBetsByType);
router.get('/updateBetStatus', AdminController.updateBetStatus);
router.get('/getBetHistoryByUser', AdminController.getBetHistoryByUser);
router.get('/getBetSettings', AdminController.getBetSettings);
router.post('/updateBetSettings', AdminController.updateBetSettings);
router.post('/updateSelfAmount', AdminController.updateSelfAmount);
router.post('/updateWelcomeMessage', AdminController.updateWelcomeMessage);


module.exports = router;
