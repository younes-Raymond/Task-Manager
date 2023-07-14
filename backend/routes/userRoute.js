const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  approveRequest,
  rejectRequest,
  confirmTaken,
  search,
  addJobs,
  getAllJobs,
  applyJob,
  getAllMaterialRequester,
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.post('/admin/approve', approveRequest);
router.post('/admin/reject', rejectRequest);
router.post('/admin/confirm', confirmTaken)
router.get('/search', search)
router.post('/admin/addJobs', addJobs)
router.get('/jobs', getAllJobs)
router.post('/applyJob', applyJob)
router.get('/materialrequesters', getAllMaterialRequester)
router.get('/workers', getAllUsers)



module.exports = router;
