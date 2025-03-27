const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getAllDrivers, verifyDriver, getDriverDetails, updateUser, deleteUser } = require('../controllers/authController');

router.get('/ping', (req, res) => {
  res.send('Auth route is working!');
});

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/drivers', getAllDrivers);
router.post('/drivers/verify', verifyDriver);
router.get("/drivers/:user_id", getDriverDetails);
router.put("/users", updateUser);
router.delete("/users/:user_id", deleteUser);

module.exports = router;