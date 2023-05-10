const express = require('express');
const { registerUser , loginUser , getAllUsers} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);





module.exports = router;