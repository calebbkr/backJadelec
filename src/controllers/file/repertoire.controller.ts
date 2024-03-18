import { Request, Response } from 'express';
import * as repertoireService from '../../services/file/repertoire.service';

export async function createRepertoire(req: Request, res: Response): Promise<void> {
    try {
      const randomString = generateRandomString(8);
      const { name, folderId, parentId, createdBy } = req.body;

      const repertoire = await repertoireService.createRepertoire({ name: randomString+"~"+name, folderId, parentId, createdBy });
      res.status(201).json(repertoire);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la création du répertoire', error: error.message });
      console.log(error)
    }
  }
  
  export async function getAllRepertoires(req: Request, res: Response): Promise<void> {
    try {
      const repertoires = await repertoireService.getAllRepertoires();
      res.status(200).json(repertoires);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la récupération des répertoires', error: error.message });
      console.log(error)

    }
  }
  
  export async function getRepertoireById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      const repertoire = await repertoireService.getRepertoireById(id);
      if (repertoire) {
        res.status(200).json(repertoire);
      } else {
        res.status(404).json({ message: 'Répertoire non trouvé' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la récupération du répertoire', error: error.message });
      console.log(error)

    }
  }
  
  export async function updateRepertoire(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      const [, [updatedRepertoire]] = await repertoireService.updateRepertoire(id, req.body);
      if (updatedRepertoire) {
        res.status(200).json(updatedRepertoire);
      } else {
        res.status(404).json({ message: 'Répertoire non trouvé' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du répertoire', error: error.message });
      console.log(error)

    }
  }
  
  export async function deleteRepertoire(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      await repertoireService.deleteRepertoire(id);
    res.status(200).json({ message: 'Répertoire et ses contenus associés supprimés avec succès' });
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la suppression du répertoire', error: error.message });
      console.log(error)

    }
  }

  export async function getRepertoiresByFolderId(req: Request, res: Response): Promise<void> {
    const { folderId } = req.params;
    try {
      const repertoires = await repertoireService.getRepertoiresByFolderId(parseInt(folderId));
      res.status(200).json(repertoires);
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ message: 'Erreur lors de la récupération des répertoires', error: error.message });
    }
  }
  
  export async function getRepertoiresByParentId(req: Request, res: Response): Promise<void> {
    const { parentId } = req.params;
    try {
      const repertoires = await repertoireService.getRepertoiresByParentId(parseInt(parentId));
      res.status(200).json(repertoires);
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ message: 'Erreur lors de la récupération des répertoires', error: error.message });
    }
  }

  function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }
    return result;
}

// Utilisation
