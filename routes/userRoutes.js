const express = require('express');
const { auth, authAdmin } = require('../middleware/auth');
const { registerUser, loginUser } = require('../controllers/registerController');
const router = express.Router();


router.post('/register',registerUser);
router.post('/login',loginUser);

module.exports = router;
