import express from 'express';
import * as authController from '../../controllers/auth/role.controller';
import { authenticateUser, checkAdmin } from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', authenticateUser, checkAdmin, authController.createRole);
router.get('/', authenticateUser, authController.getAllRoles);

export default router;