import express from 'express';
import * as repertoireController from '../../controllers/file/repertoire.controller';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware.authenticateUser, repertoireController.createRepertoire);
router.get('/', authMiddleware.authenticateUser, repertoireController.getAllRepertoires);
router.get('/:id', authMiddleware.authenticateUser, repertoireController.getRepertoireById);
router.put('/:id', authMiddleware.authenticateUser, repertoireController.updateRepertoire);
router.delete('/:id', authMiddleware.authenticateUser, repertoireController.deleteRepertoire);
router.get('/folder/:folderId', authMiddleware.authenticateUser, repertoireController.getRepertoiresByFolderId);
router.get('/parent/:parentId', authMiddleware.authenticateUser, repertoireController.getRepertoiresByParentId);
export default router;
