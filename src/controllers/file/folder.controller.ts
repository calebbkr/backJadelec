import { Request, Response } from "express";
import * as folderService from "../../services/file/folder.service";

export async function createFolder(req: Request, res: Response): Promise<void> {
  const { clientId, projectId, folderName, createdBy } = req.body;
  try {
    const result = await folderService.createFolderService(
      clientId,
      projectId,
      folderName,
      createdBy
    );
    if (result.success) {
      res.status(201).json({ folder: result.folder });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating folder:", error });
    console.error("Error creating folder:", error);
  }
}

export async function updateFolder(req: Request, res: Response): Promise<void> {
  try {
    const folderId = parseInt(req.params.folderId);
    const updatedFolder = req.body;
    const [rowsAffected] = await folderService.updateFolder(
      folderId,
      updatedFolder
    );
    if (rowsAffected === 0) {
      res.status(404).json({ message: "Folder not found" });
    } else {
      res.status(200).json({ message: "Folder updated successfully" });
    }
  } catch (error) {
    console.error("Error updating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFolderById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const folderId = parseInt(req.params.folderId);
    // console.log("folderIdfolderIdfolderIdfolderIdfolderIdfolderIdfolderIdfolderIdfolderIdfolderIdfolderId : " + folderId)
    const folder = await folderService.getFolderById(folderId);
    if (folder) {
      res.status(200).json(folder);
    } else {
      res.status(404).json({ message: "Folder not found" });
    }
  } catch (error) {
    console.error("Error fetching folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllFolders(
  req: Request,
  res: Response
): Promise<void> {
  const { projectId } = req.params;
  try {
    const folders = await folderService.getAllFolders(Number(projectId));
    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAll(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const folders = await folderService.getAll();
    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteFolder(req: Request, res: Response): Promise<void> {
  try {
    const folderId = parseInt(req.params.folderId);
    const rowsAffected = await folderService.deleteFolder(folderId);
    if (rowsAffected === 0) {
      res.status(404).json({ message: "Folder not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
