const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, verifyUser } = require('../controllers/authController');

router.get('/ping', (req, res) => {
  res.send('Auth route is working!');
});

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.post('/users/verify', verifyUser);

module.exports = router;
