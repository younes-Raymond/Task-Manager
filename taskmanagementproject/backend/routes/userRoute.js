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
  deleteJob,
  isHaveARequests,
  updateProfileImg,
  createTasks,
  TasksAvailable,
  updatedTask,
  NewMemberMarketingB2B,
  fetchTasks,
  updatedTaskDone,
  editWorker,
  editJobs,
  changePassword,

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
router.post('/admin/addJobs', addJobs)
router.get('/jobs', getAllJobs)
router.post('/applyJob', applyJob)
router.get('/materialrequesters', getAllMaterialRequester)
router.get('/workers', getAllUsers)
router.delete('/users/:id', deleteUser);
router.delete('/job/:id', deleteJob);
router.post('/getReguests', isHaveARequests);
router.post('/updateprofileimg',updateProfileImg)
router.post('/tasks', createTasks)
router.post('/TasksAvailable', TasksAvailable)
router.post('/updateTasks', updatedTask)
router.post('/NewMemberMarketingB2B', NewMemberMarketingB2B);
router.get('/fetchTasks', fetchTasks); 
router.post('/updateTasksDone', updatedTaskDone);
router.post('/editworker', editWorker)
router.post('/editJobs', editJobs)
router.post('/changePassword', changePassword)

module.exports = router;
