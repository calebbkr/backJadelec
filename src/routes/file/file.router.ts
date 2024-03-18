import express from 'express';
import * as fileController from '../../controllers/file/file.controller';
import multer from 'multer';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

router.post('/', authMiddleware.authenticateUser, fileController.createFile);
router.put('/:id', authMiddleware.authenticateUser, fileController.updateFile);
router.get('/:id', authMiddleware.authenticateUser, fileController.getFileById);
router.delete('/:id', authMiddleware.authenticateUser, fileController.deleteFile);
router.get('/folder/:folderId', authMiddleware.authenticateUser, fileController.getFilesByFolderId);

export default router;
