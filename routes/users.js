const express = require('express');
const {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
