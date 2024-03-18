import express from 'express';
import * as fileValidationController from '../../controllers/file/fileValidation.controller';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware.authenticateUser, fileValidationController.createFileValidation);
router.get('/', authMiddleware.authenticateUser, fileValidationController.getAllFileValidations);
router.get('/:id', authMiddleware.authenticateUser, fileValidationController.getFileValidationById);
router.put('/:id', authMiddleware.authenticateUser, fileValidationController.updateFileValidation);
router.delete('/:id', authMiddleware.authenticateUser, fileValidationController.deleteFileValidation);
router.get('/file/:fileId',  authMiddleware.authenticateUser, fileValidationController.getFileValidationByFileIdController);

export default router;
