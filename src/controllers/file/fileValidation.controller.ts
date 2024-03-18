import { Request, Response } from 'express';
import * as fileValidationService from '../../services/file/fileValidation.service';

export async function createFileValidation(req: Request, res: Response): Promise<void> {
  try {
    const { fileId, requestedBy, validatedBy } = req.body;
    const newFileValidation = await fileValidationService.createFileValidation({ fileId, requestedBy, validatedBy });
    res.status(201).json(newFileValidation);
  } catch (error) {
    console.error('Error creating file validation:', error);
    res.status(500).json({ message: 'Erreur ou le fichier a deja une demande de validation' });
  }
}

export async function getFileValidationByFileIdController(req: Request, res: Response): Promise<void> {
    const fileId: number = parseInt(req.params.fileId);

    try {
        const validation = await fileValidationService.getFileValidationByFileId(fileId);
        if (validation) {
            res.status(200).json(validation);
        } else {
            res.status(404).json({ message: 'Aucune validation trouvée pour le fichier spécifié' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la validation:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la validation' });
    }
}

export async function getAllFileValidations(req: Request, res: Response): Promise<void> {
  try {
    const fileValidations = await fileValidationService.getAllFileValidations();
    res.status(200).json(fileValidations);
  } catch (error) {
    console.error('Error fetching file validations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getFileValidationById(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);
  try {
    const fileValidation = await fileValidationService.getFileValidationById(id);
    if (fileValidation) {
      res.status(200).json(fileValidation);
    } else {
      res.status(404).json({ message: 'File validation not found' });
    }
  } catch (error) {
    console.error('Error fetching file validation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateFileValidation(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);
  const data = req.body;
  try {
    await fileValidationService.updateFileValidation(id, data);
    res.status(200).json({ message: 'File validation updated successfully' });
  } catch (error) {
    console.error('Error updating file validation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteFileValidation(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);
  try {
    await fileValidationService.deleteFileValidation(id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting file validation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
