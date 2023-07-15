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
  deleteUser,
  deleteJob
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
router.delete('/users/:id', deleteUser);
router.delete('/job/:id', deleteJob);

module.exports = router;
