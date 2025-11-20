const express = require('express');
const router = express.Router();
const { login, signupCustomer, signupProvider } = require('../controllers/authController');

router.post('/login', login);
router.post('/signup-customer', signupCustomer);
router.post('/signup-provider', signupProvider);

module.exports = router;