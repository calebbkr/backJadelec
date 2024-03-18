import { Request, Response } from "express";
import * as groupService from "../../services/auth/group.service";

export async function createGroup(req: Request, res: Response): Promise<void> {
  try {
    const { name, createdBy } = req.body;
    const group = await groupService.createGroup(name, createdBy);
    res.status(201).json(group);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateGroup(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedGroup = await groupService.updateGroup(parseInt(id), name);
    res.json(updatedGroup);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getGroupById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const group = await groupService.getGroupById(parseInt(id));
    res.json(group);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

export async function getAllGroups(req: Request, res: Response): Promise<void> {
  try {
    const groups = await groupService.getAllGroups();
    res.json(groups);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteGroup(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await groupService.deleteGroup(parseInt(id));
    res.status(204).end();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}
