const express = require('express');
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getMyself,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.get('/users/me', auth, getMyself);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
