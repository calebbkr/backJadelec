import { Request, Response } from "express";
import * as permissionService from "../../services/auth/permission.service";
import Permission from "../../db/models/user/permissions.model";

export async function createPermission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { folderId, groupId, userId, readAccess, writeAccess, deleteAccess } =
      req.body;
    const permission = await permissionService.createPermission(
      folderId,
      groupId,
      userId,
      readAccess,
      writeAccess,
      deleteAccess
    );
    res.status(201).json(permission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updatePermission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { readAccess, writeAccess, deleteAccess } = req.body;
    const updatedPermission = await permissionService.updatePermission(
      parseInt(id),
      readAccess,
      writeAccess,
      deleteAccess
    );
    res.json(updatedPermission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getPermissionById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const permission = await permissionService.getPermissionById(parseInt(id));
    res.json(permission);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

export async function getAllPermissions(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const permissions = await permissionService.getAllPermissions();
    res.json(permissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deletePermission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    await permissionService.deletePermission(parseInt(id));
    res.status(204).end();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

export async function getPermissionsByFolderIdController(
  req: Request,
  res: Response
): Promise<void> {
  const folderId = Number(req.params.id); // Récupérer le folderId de la requête

  try {
    const permissions = await permissionService.getPermissionsByFolderId(
      folderId
    ); // Appeler la fonction du service pour récupérer les permissions

    res.status(200).json({ permissions }); // Renvoyer les permissions récupérées
  } catch (error) {
    console.error("Error fetching permissions by folder ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching permissions by folder ID" });
  }
}

export async function getPermissionsByGroupId(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params; // Récupérez le groupId de la requête

  try {
    // Recherchez toutes les permissions qui ont le groupId donné
    const permissions = await Permission.findAll({ where: { groupId: id } });

    res.status(200).json({ permissions });
  } catch (error) {
    console.error("Error fetching permissions by group ID:", error);
    res.status(500).json({ message: "Error fetching permissions by group ID" });
  }
}

export async function getPermissionByGroupIdAndFolderId(
  req: Request,
  res: Response
): Promise<void> {
  const { groupId, folderId } = req.body; // Récupérer les paramètres groupId et folderId de la requête

  try {
    // Recherchez la permission qui correspond au groupId et au folderId donnés
    const permission = await Permission.findOne({
      where: { groupId, folderId },
    });

    // Vérifiez si la permission a été trouvée
    if (!permission) {
      res.status(404).json({ message: "Permission not found" });
      return;
    }

    res.status(200).json({ permission });
  } catch (error) {
    console.error("Error fetching permission by groupId and folderId:", error);
    res.status(500).json({ message: "Error fetching permission" });
  }
}