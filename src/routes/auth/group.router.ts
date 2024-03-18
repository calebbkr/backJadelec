import express from "express";
import * as groupController from "../../controllers/auth/group.controller";
import { authenticateUser, checkAdmin } from "../../middlewares/authMiddleware";
import {
  EmployeeGroupController,
  getEmployeesByGroupId,
  getGroupIdByEmployeeId,
  removeUserFromGroup,
} from "../../controllers/auth/employeeGroup.controller";

const router = express.Router();
// cree un groupe 
router.post("/", authenticateUser, checkAdmin, groupController.createGroup);

// modifier le nom d'un groupe
router.put("/:id", authenticateUser, checkAdmin, groupController.updateGroup);

// recuper un groupe
router.get("/:id", authenticateUser, groupController.getGroupById);

// ajouter un employé dans un groupe
router.post("/add", authenticateUser, checkAdmin, EmployeeGroupController);

// recuperer tout les employees d'un groupe

router.post("/getAll", authenticateUser, getEmployeesByGroupId);

// supprimer un user d'un groupe 

router.post("/removeUser", authenticateUser, checkAdmin, removeUserFromGroup);

// voir tout les groups

router.get("/", authenticateUser, groupController.getAllGroups);

// supprimer un groupe

router.delete(
  "/:id",
  authenticateUser,
  checkAdmin,
  groupController.deleteGroup
);

// Définissez la route pour récupérer l'ID du groupe par ID d'employé
router.get('/employee/:employeeId/', authenticateUser, getGroupIdByEmployeeId);

export default router;
