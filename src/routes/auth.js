// Auth routes
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

// Register routes
router.get('/register', ctrl.showRegister);
router.post('/register', ctrl.register);

// Login routes
router.get('/login', ctrl.showLogin);
router.post('/login', ctrl.login);

// Logout route
router.get('/logout', ctrl.logout);

module.exports = router;
