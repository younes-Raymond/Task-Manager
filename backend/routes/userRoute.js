const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserTakenOf,
  approveRequest,
  rejectRequest,
  confirmTaken,
  search

} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.post('/approve', approveRequest);
router.post('/reject', rejectRequest);
router.post('/confirm', confirmTaken)
router.get('/search', search)

module.exports = router;
