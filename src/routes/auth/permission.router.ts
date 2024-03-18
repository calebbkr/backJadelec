import express from "express";
import * as permissionController from "../../controllers/auth/permission.controller";
import { authenticateUser, checkAdmin } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/",authenticateUser, checkAdmin, permissionController.createPermission);
router.put("/:id",authenticateUser, checkAdmin, permissionController.updatePermission);
router.get("/:id",authenticateUser,  permissionController.getPermissionById);
router.get("/",authenticateUser,  permissionController.getAllPermissions);
router.delete("/:id",authenticateUser, checkAdmin, permissionController.deletePermission);
router.get('/folder/:id', permissionController.getPermissionsByFolderIdController);
router.get('/group/:id', permissionController.getPermissionsByGroupId);
router.post("/getPermission",authenticateUser, permissionController.getPermissionByGroupIdAndFolderId);

export default router;
