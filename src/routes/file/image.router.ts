import express from 'express';
import multer from 'multer';
import * as imageController from '../../controllers/file/image.controller';
import upload from '../config/multer';
import { UploadController } from '../../controllers/file/image.controller';

const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

router.post('/upload/:folder?/:subFolder', upload.single('file'), UploadController.uploadFile);
// router.get('/:id', UploadController.getImage);
router.get('/:folder?/:subFolder?/:id', UploadController.getImage);

export default router;
