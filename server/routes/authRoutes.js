const express = require('express');
const { registerUser, loginUser, getMe, logoutUser } = require('../controller/authController');
const { protect } = require('../middleware/auth');


const router  = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/me',protect,getMe);
router.post('/logout',protect,logoutUser);

module.exports = router;