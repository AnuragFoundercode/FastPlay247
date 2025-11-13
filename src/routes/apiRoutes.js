const express = require('express');
const userController = require('../controllers/userController');


const router = express.Router();

//routes
router.post('/login', userController.login);
router.get('/profile/:user_id', userController.viewProfile);
router.post('/changeStatus', userController.changeStatus);

// Change password route
router.post("/change-password", userController.changePassword);

router.get("/rules", userController.getRules);
router.post("/rules_update", userController.updateRuleController);

module.exports = router;