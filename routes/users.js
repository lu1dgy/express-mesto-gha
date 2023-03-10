const express = require('express');
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getMyself,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  userIdValidator,
  userInfoValidator,
  avatarValidator,
} = require('../utils/validators/usersValidator');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', userIdValidator, getUserById);
router.get('/users/me', auth, getMyself);
router.patch('/users/me', userInfoValidator, updateProfile);
router.patch('/users/me/avatar', avatarValidator, updateAvatar);

module.exports = router;
