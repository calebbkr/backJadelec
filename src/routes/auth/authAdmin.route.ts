// ./routes/authRoutes.ts

import express from 'express';
import * as authController from '../../controllers/auth/authAdmin.controller';
import * as authclientController from '../../controllers/auth/authClient.controller';
import * as authEmployeeController from '../../controllers/auth/authEmployee.controller';

// Import des middlewares pour l'authentification
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

// Routes pour l'administration
router.post('/register', authController.register); // Route pour l'inscription
router.get('/isLog', authController.isLog); // Route pour vérifier la connexion

// Routes pour les utilisateurs admin
router.post('/login', authMiddleware.isLog, authMiddleware.isVerifyOtp, authController.loginWithEmail);
router.post('/logout', authController.logout);
router.put('/change-password', authMiddleware.authenticateUser, authController.changePassword);
router.post('/verify-otp', authMiddleware.isLog, authMiddleware.authenticateToken, authController.verifyOtp);
router.get('/user-info', authMiddleware.extractUserInfo, authController.getUserInfo);

// Routes pour les clients
router.post('/client/register', authMiddleware.authenticateUser, authMiddleware.checkAdmin, authclientController.register);
router.post('/client/login', authMiddleware.isLog, authclientController.loginWithEmail);
router.post('/client/logout', authclientController.logout);
router.put('/client/change-password', authMiddleware.authenticateUser, authclientController.changePassword);
router.post('/client/verify-otp', authMiddleware.isLog, authMiddleware.authenticateToken, authclientController.verifyOtp);
router.get('/client/user-info', authMiddleware.extractUserInfo, authclientController.getClientInfo);
router.get('/client', authMiddleware.authenticateUser, authMiddleware.checkAdmin, authclientController.getAllClientsController);
router.get('/client/:id', authMiddleware.authenticateUser, authclientController.getClientByIdController);
router.delete('/client/:id', authMiddleware.authenticateUser, authMiddleware.checkAdmin, authclientController.deleteClient);
router.get('/clientByName/:clientId', authMiddleware.authenticateUser, authclientController.getClientNameByIdController);
router.get('/nameById/:id', authMiddleware.authenticateUser, authclientController.getNameByIdController);
router.get('/userRole/:id', authMiddleware.authenticateUser, authclientController.getUserByIdController);

// Routes pour les employés
router.post('/employee/register', authMiddleware.authenticateUser, authMiddleware.checkAdmin, authEmployeeController.register);
router.post('/employee/login', authMiddleware.isLog, authEmployeeController.loginWithEmail);
router.post('/employee/logout', authEmployeeController.logout);
router.put('/employee/change-password', authMiddleware.authenticateUser, authEmployeeController.changePassword);
router.post('/employee/verify-otp', authMiddleware.isLog, authMiddleware.authenticateToken, authEmployeeController.verifyOtp);
router.get('/employee/user-info', authMiddleware.extractUserInfo, authEmployeeController.getEmployeeInfo);
router.get('/employee', authMiddleware.authenticateUser, authMiddleware.checkAdmin, authEmployeeController.getAllEmployeesController);
router.get('/employee/:id', authMiddleware.authenticateUser, authEmployeeController.getEmployeeByIdController);

export default router;
