const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

router.get("/downline", AdminController.getDownline);

router.post("/getDownUserList", AdminController.getDownUserList);
// POST /api/admin/create
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


module.exports = router;
