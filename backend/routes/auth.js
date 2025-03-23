const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.get('/ping', (req, res) => {
  res.send('Auth route is working!');
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;
