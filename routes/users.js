const express = require('express');
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getMyself,
} = require('../controllers/users');
const {
  userIdValidator,
  userInfoValidator,
  avatarValidator,
} = require('../utils/validators/usersValidator');

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getMyself);
router.get('/:userId', userIdValidator, getUserById);
router.patch('/me', userInfoValidator, updateProfile);
router.patch('/me/avatar', avatarValidator, updateAvatar);

module.exports = router;
