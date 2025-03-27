const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getAllDrivers, verifyDriver } = require('../controllers/authController');

router.get('/ping', (req, res) => {
  res.send('Auth route is working!');
});

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/drivers', getAllDrivers);
router.post('/drivers/verify', verifyDriver);

module.exports = router;