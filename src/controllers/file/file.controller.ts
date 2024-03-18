import { Request, Response } from 'express';
import * as fileService from '../../services/file/file.service';
import fs from 'fs';
import multer from 'multer';


interface FileRequest extends Request {
    file?: Express.Multer.File; 
}

export async function createFile(req: FileRequest, res: Response): Promise<void> {
    const { filename, comment, createdBy, urlData, validation, folderId } = req.body;

    try {
        const file = await fileService.createFile(filename, comment, createdBy, urlData, validation, folderId);
        res.status(201).json(file);
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateFile(req: FileRequest, res: Response): Promise<void> {
    const fileId = parseInt(req.params.id);
    const updates = req.body;

    try {
        const [rowsUpdated] = await fileService.updateFile(fileId, { ...updates });

        if (rowsUpdated === 0 || !updateFile) {
            res.status(404).json({ message: 'File not found' });
        } else {
            res.json(updateFile);
        }
    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getFileById(req: Request, res: Response): Promise<void> {
    const fileId = parseInt(req.params.id);

    try {
        const file = await fileService.getFileById(fileId);
        if (!file) {
            res.status(404).json({ message: 'File not found' });
        } else {
            res.status(200).json(file);
        }
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteFile(req: Request, res: Response): Promise<void> {
    const fileId = parseInt(req.params.id);

    try {
        const rowsDeleted = await fileService.deleteFile(fileId);
        if (rowsDeleted === 0) {
            res.status(404).json({ message: 'File not found' });
        } else {
            res.json({ message: 'File deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getFilesByFolderId(req: Request, res: Response): Promise<void> {
    const folderId = parseInt(req.params.folderId);

    try {
        const files = await fileService.getFilesByFolderId(folderId);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
