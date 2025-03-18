import express from 'express';
import { authController, masterController } from '../../controllers/index.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { checkSuperAdmin } from '../../middlewares/authorityMiddleware.js';

const router = express.Router();

//master routes
router.get('/getAllRoles', masterController.getAllRoles);
// router.get('/getAllUsers', [authenticateToken, checkSuperAdmin], adminController.getAllUsers);

//auth routes
router.post('/login', authController.loginUser);
router.post('/register', authController.register);

export default router;
