import express from "express";
import * as folderController from "../../controllers/file/folder.controller";
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

router.post(
  "/",
  authMiddleware.authenticateUser,
  authMiddleware.checkAdmin,
  folderController.createFolder
);
router.put(
  "/:folderId",
  authMiddleware.authenticateUser,
  authMiddleware.checkAdmin,
  folderController.updateFolder
);

router.get(
  "/",
  authMiddleware.authenticateUser,
  // authMiddleware.checkAdmin,
  folderController.getAll
);

router.get(
  "/projet/:projectId",
  authMiddleware.authenticateUser,
  // authMiddleware.checkAdmin,
  folderController.getAllFolders
);
router.get(
  "/:folderId",
  // authMiddleware.authenticateUser,
  folderController.getFolderById
);
router.delete(
  "/:folderId",
  authMiddleware.authenticateUser,
  authMiddleware.checkAdmin,
  folderController.deleteFolder
);

export default router;
