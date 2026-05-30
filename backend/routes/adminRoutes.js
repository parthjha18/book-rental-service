const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { getDashboard, getUsers, deleteUser } = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard',     protect, admin, getDashboard);
router.get('/users',         protect, admin, getUsers);
router.delete('/users/:id',  protect, admin, deleteUser);

module.exports = router;
